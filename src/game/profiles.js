// Player profiles inside the save data: progress, achievements, settings and results history.
(function (LM) {
  'use strict';

  const MAX_HISTORY_ENTRIES = 200;

  function defaultSettings() {
    return { musicVolume: 0.55, sfxVolume: 0.8, voiceVolume: 1, isNarrationEnabled: true };
  }

  function newProfileId(save) {
    const highest = save.profiles.reduce(function (max, profile) { return Math.max(max, profile.id); }, 0);
    return highest + 1;
  }

  // A profile that is not stored in any save (used when a developer view opens without a player).
  function createDetachedProfile(id, name, gender, nowIso) {
    return {
      id: id,
      name: name.trim(),
      gender: gender,
      createdAt: nowIso,
      settings: defaultSettings(),
      progress: { passedMissions: [], isExamPassed: false },
      achievements: {},
      unlockedSongs: [],
      storiesHeard: [],
      history: [],
    };
  }

  // gender: 'boy' | 'girl' — used for Polish verb forms in game texts.
  function createProfile(save, name, gender, nowIso) {
    const profile = createDetachedProfile(newProfileId(save), name, gender, nowIso);
    save.profiles.push(profile);
    save.activeProfileId = profile.id;
    return profile;
  }

  function findProfile(save, profileId) {
    return save.profiles.find(function (profile) { return profile.id === profileId; }) || null;
  }

  function activeProfile(save) {
    return findProfile(save, save.activeProfileId);
  }

  function deleteProfile(save, profileId) {
    save.profiles = save.profiles.filter(function (profile) { return profile.id !== profileId; });
    if (save.activeProfileId === profileId) {
      save.activeProfileId = null;
    }
  }

  function hasPassedMission(profile, missionId) {
    return profile.progress.passedMissions.indexOf(missionId) >= 0;
  }

  // Missions unlock in order: the first is always open, each next one after passing the previous.
  function isMissionUnlocked(profile, missionId) {
    const index = LM.data.missions.findIndex(function (mission) { return mission.id === missionId; });
    return index === 0 || (index > 0 && hasPassedMission(profile, LM.data.missions[index - 1].id));
  }

  function isExamUnlocked(profile) {
    return LM.data.missions.every(function (mission) { return hasPassedMission(profile, mission.id); });
  }

  function addOnce(list, item) {
    if (list.indexOf(item) < 0) {
      list.push(item);
    }
  }

  // result: { missionId, percent, isPassed, dateIso }
  function recordMissionResult(profile, result) {
    profile.history.push({ missionId: result.missionId, percent: result.percent, isPassed: result.isPassed, dateIso: result.dateIso });
    if (profile.history.length > MAX_HISTORY_ENTRIES) {
      profile.history.shift();
    }
    if (!result.isPassed) {
      return;
    }
    if (result.missionId === LM.data.exam.id) {
      profile.progress.isExamPassed = true;
      return;
    }
    addOnce(profile.progress.passedMissions, result.missionId);
    const mission = LM.missions.byId(result.missionId);
    addOnce(profile.unlockedSongs, mission.songId);
  }

  function recordStoryHeard(profile, missionId) {
    addOnce(profile.storiesHeard, missionId);
  }

  LM.profiles = {
    createDetachedProfile,
    createProfile,
    findProfile,
    activeProfile,
    deleteProfile,
    hasPassedMission,
    isMissionUnlocked,
    isExamUnlocked,
    recordMissionResult,
    recordStoryHeard,
  };
}(window.LM = window.LM || {}));
