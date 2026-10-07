// "Kto gra?": pick a player, create one (name + boy/girl for Polish verb forms) or delete one.
(function (LM) {
  'use strict';

  const MAX_PROFILES = 6;
  const MAX_NAME_LENGTH = 16;
  const PANEL = { x: 340, y: 130, width: 600, height: 470 };
  const NAME_FIELD = { x: 390, y: 300, width: 500, height: 56 };

  const ROOMY_ROWS = { itemHeight: 54, gap: 10, fontSize: 22 };
  // Six players plus "Nowy gracz" and "Usuń gracza" still fit inside the panel.
  const COMPACT_ROWS = { itemHeight: 40, gap: 8, fontSize: 20 };

  function menuLayout(game, itemCount) {
    const rows = itemCount > 6 ? COMPACT_ROWS : ROOMY_ROWS;
    return Object.assign({ x: 380, y: 200, width: 520, playSound: game.sfx }, rows);
  }

  function profileLabel(profile) {
    const passed = profile.progress.passedMissions.length;
    const examMark = profile.progress.isExamPassed ? '  ★' : '';
    return profile.name + '  ·  misje ' + passed + '/' + LM.data.missions.length + examMark;
  }

  function createProfilesScene(game) {
    let elapsed = 0;
    let panel = null;

    function useProfile(profile) {
      game.save.activeProfileId = profile.id;
      game.persist();
      game.applySettings();
      game.show('map');
    }

    function showProfileList() {
      const items = game.save.profiles.map(function (profile) { return { id: 'profile', label: profileLabel(profile), profile: profile }; });
      items.push({ id: 'new', label: 'Nowy gracz', isEnabled: game.save.profiles.length < MAX_PROFILES });
      if (game.save.profiles.length > 0) {
        items.push({ id: 'delete', label: 'Usuń gracza' });
      }
      const menu = LM.menu.createMenu(items, menuLayout(game, items.length));
      panel = {
        title: game.save.profiles.length > 0 ? 'Kto gra?' : 'Witaj w Labiryncie Mitów!',
        update: function (input) {
          const chosen = menu.update(input);
          if (!chosen) {
            return;
          }
          if (chosen.id === 'profile') {
            useProfile(chosen.profile);
          } else if (chosen.id === 'new') {
            showNameEntry();
          } else {
            showDeletePicker();
          }
        },
        render: menu.render,
      };
    }

    function showNameEntry() {
      game.textInput.show(NAME_FIELD, {
        placeholder: 'Wpisz imię…',
        maxLength: MAX_NAME_LENGTH,
        onSubmit: function (text) {
          if (text.trim().length > 0) {
            game.textInput.hide();
            game.sfx('choose');
            showGenderChoice(text.trim());
          }
        },
        onCancel: function () {
          game.textInput.hide();
          game.sfx('back');
          showProfileList();
        },
      });
      panel = {
        title: 'Nowy gracz',
        update: function () { game.textInput.keepFocus(); },
        render: function (ctx) {
          LM.text.drawWrappedText(ctx, 'Jak masz na imię?', 640, 260, 520, {
            font: LM.text.boldFont(26), color: LM.palette.ink, lineHeight: 32, align: 'center',
          });
          LM.text.drawWrappedText(ctx, 'Wpisz imię i naciśnij Enter. Esc wraca.', 640, 410, 520, {
            font: LM.text.regularFont(18), color: LM.palette.inkSoft, lineHeight: 24, align: 'center',
          });
        },
      };
    }

    function showGenderChoice(name) {
      const items = [
        { id: 'boy', label: 'Gram jako chłopak' },
        { id: 'girl', label: 'Gram jako dziewczyna' },
        { id: 'back', label: 'Wróć' },
      ];
      const menu = LM.menu.createMenu(items, Object.assign(menuLayout(game, 3), { y: 300 }));
      panel = {
        title: 'Cześć, ' + name + '!',
        update: function (input) {
          const chosen = menu.update(input);
          if (chosen && chosen.id === 'back') {
            showNameEntry();
          } else if (chosen) {
            useProfile(LM.profiles.createProfile(game.save, name, chosen.id, new Date().toISOString()));
          }
        },
        render: function (ctx) {
          LM.text.drawWrappedText(ctx, 'Gra będzie się do ciebie zwracać we właściwej formie (np. „zdobyłeś” albo „zdobyłaś”).', 640, 230, 520, {
            font: LM.text.regularFont(19), color: LM.palette.ink, lineHeight: 26, align: 'center',
          });
          menu.render(ctx);
        },
      };
    }

    function showDeletePicker() {
      const items = game.save.profiles.map(function (profile) { return { id: 'profile', label: profile.name, profile: profile }; });
      items.push({ id: 'cancel', label: 'Anuluj' });
      const menu = LM.menu.createMenu(items, menuLayout(game, items.length));
      panel = {
        title: 'Którego gracza usunąć?',
        update: function (input) {
          const chosen = menu.update(input);
          if (chosen && chosen.id === 'profile') {
            showDeleteConfirmation(chosen.profile);
          } else if (chosen || input.wasPressed('back')) {
            showProfileList();
          }
        },
        render: menu.render,
      };
    }

    function showDeleteConfirmation(profile) {
      const items = [{ id: 'keep', label: 'Nie, zostaw' }, { id: 'delete', label: 'Tak, usuń' }];
      const menu = LM.menu.createMenu(items, Object.assign(menuLayout(game, 2), { y: 340 }));
      panel = {
        title: 'Usunąć gracza?',
        update: function (input) {
          const chosen = menu.update(input);
          if (chosen && chosen.id === 'delete') {
            LM.profiles.deleteProfile(game.save, profile.id);
            game.persist();
          }
          if (chosen || input.wasPressed('back')) {
            showProfileList();
          }
        },
        render: function (ctx) {
          LM.text.drawWrappedText(ctx, 'Gracz „' + profile.name + '” i cały jego postęp znikną na zawsze.', 640, 250, 520, {
            font: LM.text.regularFont(21), color: LM.palette.ink, lineHeight: 28, align: 'center',
          });
          menu.render(ctx);
        },
      };
    }

    function render(ctx) {
      LM.scenery.drawSunsetCoast(ctx, elapsed);
      LM.ui.drawTitledPanel(ctx, PANEL, panel.title);
      panel.render(ctx);
      if (!game.saveStore.isPersistent()) {
        LM.ui.drawShadowText(ctx, 'Uwaga: ta przeglądarka nie pozwala zapisać postępu.', 640, 640, 18, '#ffd0c0', 'center');
      }
    }

    showProfileList();

    return {
      update: function (dt, input) {
        elapsed += dt;
        panel.update(input);
      },
      render: render,
      exit: function () { game.textInput.hide(); },
    };
  }

  LM.sceneFactories.profiles = createProfilesScene;
}(window.LM = window.LM || {}));
