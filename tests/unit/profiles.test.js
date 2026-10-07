const test = require('node:test');
const assert = require('node:assert/strict');
const { loadGame, toPlain } = require('../helpers/load-game');

const LM = loadGame();

function fakeStorage() {
  const items = new Map();
  return {
    items: items,
    getItem: function (key) { return items.has(key) ? items.get(key) : null; },
    setItem: function (key, value) { items.set(key, String(value)); },
  };
}

function throwingStorage() {
  return {
    getItem: function () { throw new Error('SecurityError'); },
    setItem: function () { throw new Error('SecurityError'); },
  };
}

test('gender forms pick the boy or girl variant', function () {
  assert.equal(LM.genderForms.applyGenderForms('Zdobył{eś|aś} osiągnięcie!', 'boy'), 'Zdobyłeś osiągnięcie!');
  assert.equal(LM.genderForms.applyGenderForms('Zdobył{eś|aś} osiągnięcie!', 'girl'), 'Zdobyłaś osiągnięcie!');
  assert.equal(LM.genderForms.applyGenderForms('Nie obejrzał{eś|aś} się, był{eś|aś} dzieln{y|a}.', 'girl'), 'Nie obejrzałaś się, byłaś dzielna.');
});

test('a saved game survives a reload', function () {
  const storage = fakeStorage();
  const store = LM.storage.createSaveStore(storage);
  const save = store.load();
  LM.profiles.createProfile(save, '  Ola ', 'girl', '2026-10-07T10:00:00Z');
  store.save(save);
  const reloaded = LM.storage.createSaveStore(storage).load();
  assert.equal(reloaded.profiles.length, 1);
  assert.equal(reloaded.profiles[0].name, 'Ola');
  assert.equal(LM.profiles.activeProfile(reloaded).gender, 'girl');
});

test('storage that throws falls back to memory instead of crashing', function () {
  const store = LM.storage.createSaveStore(throwingStorage());
  const save = store.load();
  assert.deepEqual(toPlain(save), toPlain(LM.storage.emptySave()));
  store.save(save);
  assert.equal(store.isPersistent(), false);
  assert.equal(LM.storage.createSaveStore(null).isPersistent(), false);
});

test('a corrupt save is backed up and the game starts fresh', function () {
  const storage = fakeStorage();
  storage.setItem(LM.storage.SAVE_KEY, '{not json');
  const save = LM.storage.createSaveStore(storage).load();
  assert.equal(save.profiles.length, 0);
  assert.equal(storage.getItem(LM.storage.SAVE_KEY + '.backup'), '{not json');
});

test('a save from an unknown version is replaced by an empty save', function () {
  assert.deepEqual(toPlain(LM.storage.migrateSave({ version: 99, profiles: [] })), toPlain(LM.storage.emptySave()));
  assert.deepEqual(toPlain(LM.storage.migrateSave(null)), toPlain(LM.storage.emptySave()));
});

test('missions unlock in order and the exam opens after all three', function () {
  const save = LM.storage.emptySave();
  const profile = LM.profiles.createProfile(save, 'Jaś', 'boy', '2026-10-07T10:00:00Z');
  assert.equal(LM.profiles.isMissionUnlocked(profile, 'theseus'), true);
  assert.equal(LM.profiles.isMissionUnlocked(profile, 'icarus'), false);
  LM.profiles.recordMissionResult(profile, { missionId: 'theseus', percent: 60, isPassed: false, dateIso: 'd1' });
  assert.equal(LM.profiles.isMissionUnlocked(profile, 'icarus'), false);
  ['theseus', 'icarus', 'orpheus'].forEach(function (missionId) {
    LM.profiles.recordMissionResult(profile, { missionId: missionId, percent: 90, isPassed: true, dateIso: 'd2' });
  });
  assert.equal(LM.profiles.isMissionUnlocked(profile, 'orpheus'), true);
  assert.equal(LM.profiles.isExamUnlocked(profile), true);
  assert.deepEqual(toPlain(profile.unlockedSongs), ['theseus', 'icarus', 'orpheus']);
  assert.equal(profile.history.length, 4);
});

test('deleting the active profile clears the selection', function () {
  const save = LM.storage.emptySave();
  const first = LM.profiles.createProfile(save, 'A', 'boy', 'd');
  const second = LM.profiles.createProfile(save, 'B', 'girl', 'd');
  assert.notEqual(first.id, second.id);
  LM.profiles.deleteProfile(save, second.id);
  assert.equal(save.activeProfileId, null);
  assert.equal(save.profiles.length, 1);
});
