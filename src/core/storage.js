// Saves the game in localStorage. Any storage failure (private mode, file:// restrictions) falls back to memory.
(function (LM) {
  'use strict';

  const SAVE_KEY = 'labiryntMitow.save';
  const BACKUP_KEY = 'labiryntMitow.save.backup';
  const CURRENT_VERSION = 1;

  function emptySave() {
    return { version: CURRENT_VERSION, activeProfileId: null, profiles: [] };
  }

  function isUsableSave(data) {
    return Boolean(data) && typeof data === 'object' && Array.isArray(data.profiles);
  }

  // Future save formats add their upgrade steps here, oldest first.
  function migrateSave(data) {
    if (!isUsableSave(data) || data.version !== CURRENT_VERSION) {
      return emptySave();
    }
    return data;
  }

  function createSaveStore(storageLike) {
    let isPersistent = Boolean(storageLike);

    function keepCorruptCopy(text) {
      try {
        storageLike.setItem(BACKUP_KEY, text);
      } catch (error) {
        isPersistent = false;
      }
    }

    function load() {
      if (!isPersistent) {
        return emptySave();
      }
      let text = null;
      try {
        text = storageLike.getItem(SAVE_KEY);
      } catch (error) {
        isPersistent = false;
        return emptySave();
      }
      if (!text) {
        return emptySave();
      }
      try {
        return migrateSave(JSON.parse(text));
      } catch (error) {
        keepCorruptCopy(text);
        return emptySave();
      }
    }

    function save(data) {
      if (!isPersistent) {
        return;
      }
      try {
        storageLike.setItem(SAVE_KEY, JSON.stringify(data));
      } catch (error) {
        isPersistent = false;
      }
    }

    return { load, save, isPersistent: function () { return isPersistent; } };
  }

  LM.storage = { SAVE_KEY, CURRENT_VERSION, emptySave, migrateSave, createSaveStore };
}(window.LM = window.LM || {}));
