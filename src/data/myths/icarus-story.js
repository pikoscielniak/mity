// Mit o Dedalu i Ikarze, opowiedziany własnymi słowami na podstawie „Mitologii” Jana Parandowskiego.
// Pages are read by the narrator (or a character); illustrations are drawn in src/render/illustrations-icarus.js.
(function (LM) {
  'use strict';

  LM.data.myths = LM.data.myths || {};
  LM.data.myths.icarus = {
    id: 'icarus',
    title: 'Dedal i Ikar',
    storyPages: [
      {
        id: 'ika-s01', speaker: 'narrator', illustration: 'ika-inventor',
        text: 'W Atenach żył kiedyś Dedal, najzdolniejszy budowniczy i wynalazca swoich czasów. Mówiono, że to on wymyślił świder do wiercenia otworów ' +
          'i poziomicę, która pokazuje, czy coś leży prosto. Jego posągi wyglądały jak żywe: ludziom zdawało się, że zaraz ruszą z miejsca.',
      },
      {
        id: 'ika-s02', speaker: 'narrator', illustration: 'ika-crete',
        text: 'Dedal opuścił Ateny i zamieszkał na Krecie, u króla Minosa. Minos był mądrym władcą, a jego okręty panowały nad morzami. ' +
          'Dla niego Dedal zbudował labirynt, plątaninę korytarzy, w której zamknięto Minotaura. To ten sam labirynt, z którego wyszedł Tezeusz.',
      },
      {
        id: 'ika-s03', speaker: 'narrator', illustration: 'ika-homesick',
        text: 'Na Krecie Dedal mieszkał razem z synem, młodym Ikarem. Mijały lata, a on coraz bardziej tęsknił za ojczyzną. ' +
          'W końcu poprosił króla, żeby pozwolił mu wrócić do Aten.',
      },
      {
        id: 'ika-s04', speaker: 'minos', illustration: 'ika-minos-refuses',
        text: 'Nie, Dedalu, nie odpłyniesz z Krety. Znasz wszystkie tajemnice mojego pałacu i mojego królestwa. ' +
          'Gdybyś wrócił do Aten, mógłbyś je zdradzić moim wrogom.',
      },
      {
        id: 'ika-s05', speaker: 'narrator', illustration: 'ika-guarded-sea',
        text: 'Minos panował nad morzem, więc żaden statek nie mógł wywieźć Dedala bez jego zgody. W niektórych opowieściach król zamknął Dedala i Ikara ' +
          'w wieży albo w labiryncie, ale u Parandowskiego nikt ich nie więzi: po prostu nie wolno im odpłynąć.',
      },
      {
        id: 'ika-s06', speaker: 'daedalus', illustration: 'ika-birds',
        text: 'Minos rządzi ziemią i morzem, ale niebo do niego nie należy! Ludzie od zawsze marzą o tym, żeby latać jak ptaki. ' +
          'Zrobię skrzydła i odlecimy stąd razem, synu.',
      },
      {
        id: 'ika-s07', speaker: 'narrator', illustration: 'ika-workshop',
        text: 'Dedal zbierał ptasie pióra, od najmniejszych do największych, i układał je rzędami. Skleił je woskiem i lekko wygiął, ' +
          'tak jak wygina się prawdziwe ptasie skrzydło. Mały Ikar kręcił się obok, łapał fruwające piórka i ugniatał palcami miękki wosk.',
      },
      {
        id: 'ika-s08', speaker: 'narrator', illustration: 'ika-first-flight',
        text: 'Gdy skrzydła były gotowe, Dedal przypiął je do ramion, poruszył nimi i uniósł się w powietrze. ' +
          'Potem zrobił drugą, mniejszą parę dla Ikara i uczył syna latać, tak jak ptak uczy swoje pisklę.',
      },
      {
        id: 'ika-s09', speaker: 'daedalus', illustration: 'ika-warning',
        text: 'Słuchaj mnie uważnie, synu. Leć zawsze środkiem, blisko mnie. Jeśli wzniesiesz się za wysoko, słońce roztopi wosk. ' +
          'Jeśli zniżysz się nad same fale, woda zmoczy pióra i staną się ciężkie. Ani za wysoko, ani za nisko!',
      },
      {
        id: 'ika-s10', speaker: 'narrator', illustration: 'ika-takeoff',
        text: 'Ojciec i syn wzbili się nad Kretę. Dedal leciał przodem i często oglądał się na Ikara. Trzymał się drogi pośrodku, między słońcem a morzem. ' +
          'Taką rozsądną drogę, bez przesady w żadną stronę, nazywamy dziś złotym środkiem.',
      },
      {
        id: 'ika-s11', speaker: 'narrator', illustration: 'ika-islands',
        text: 'Lecieli nad szerokim morzem, a w dole przesuwały się wyspy: minęli Samos, Paros i Delos. ' +
          'Kreta została daleko za nimi, wiatr szumiał w piórach, a ziemia w dole wyglądała jak mapa.',
      },
      {
        id: 'ika-s12', speaker: 'icarus', illustration: 'ika-joy',
        text: 'Ojcze, jak tu pięknie! Czuję się jak ptak! Chcę polecieć jeszcze wyżej, aż do samego słońca!',
      },
      {
        id: 'ika-s13', speaker: 'narrator', illustration: 'ika-higher',
        text: 'Zachwycony Ikar zapomniał o przestrodze ojca i wzbijał się coraz wyżej. Dlatego Ikar stał się symbolem młodzieńczej śmiałości i marzeń, ' +
          'a Dedal symbolem rozsądku i geniuszu wynalazcy. Śmiały, ale ryzykowny plan, który może skończyć się upadkiem, nazywamy dziś „ikarowym lotem”.',
      },
      {
        id: 'ika-s14', speaker: 'narrator', illustration: 'ika-fall',
        text: 'Słońce grzało coraz mocniej. Wosk zmiękł i zaczął się topić, a pióra odpadały jedno po drugim. Ikar machał już gołymi ramionami, ' +
          'zawołał ojca i spadł z wysoka. Tak zginął młody Ikar. U Parandowskiego spadł na wyspę, a w wielu innych opowieściach do morza.',
      },
      {
        id: 'ika-s15', speaker: 'narrator', illustration: 'ika-burial',
        text: 'Dedal obejrzał się, ale syna już przy nim nie było. Wołał go i szukał, a gdy go odnalazł, ze łzami pochował syna na wyspie. ' +
          'Od imienia Ikara tę wyspę nazwano Ikarią, a morze wokół niej Morzem Ikaryjskim.',
      },
      {
        id: 'ika-s16', speaker: 'narrator', illustration: 'ika-sicily',
        text: 'Samotny Dedal dotarł na Sycylię. Tamtejszy król przyjął go życzliwie, a Dedal został jego budowniczym. ' +
          'Minos nie zapomniał o uciekinierze: popłynął za nim z wielką flotą, ale zginął w tej wojnie.',
      },
    ],
    endingPages: [
      {
        id: 'ika-e01', speaker: 'narrator', illustration: 'ika-dream',
        text: 'Tak skończył się pierwszy lot człowieka. Wynalazek Dedala działał, ale Ikar nie posłuchał przestrogi. ' +
          'Ludzie wciąż marzą o lataniu, a mit przypomina, że śmiałość potrzebuje rozsądku.',
      },
      {
        id: 'ika-e02', speaker: 'narrator', illustration: 'ika-player-wings',
        text: 'Ty był{eś|aś} rozważniejsz{y|a} od Ikara: zbudował{eś|aś} skrzydła, trzymał{eś|aś} się środka i przeleciał{eś|aś} nad morzem. ' +
          'Czas na balladę o Dedalu i Ikarze!',
      },
    ],
    concepts: [
      { id: 'ikarowy-lot', term: 'ikarowy lot', definition: 'śmiały, ale ryzykowny plan, który może skończyć się upadkiem; mówi się też o „ikaryjskich lotach”' },
      { id: 'ikar', term: 'Ikar', definition: 'symbol młodzieńczej śmiałości i marzeń, ale też brawury, która nie słucha przestróg' },
      { id: 'dedal', term: 'Dedal', definition: 'symbol rozsądku i genialnego wynalazcy, który potrafi zbudować rzeczy z pozoru niemożliwe' },
      { id: 'zloty-srodek', term: 'złoty środek', definition: 'rozsądna droga pośrodku, bez przesady w żadną stronę' },
      { id: 'marzenie-o-lataniu', term: 'marzenie o lataniu', definition: 'odwieczne pragnienie ludzi, by unieść się w powietrze jak ptaki' },
      { id: 'morze-ikaryjskie', term: 'Morze Ikaryjskie', definition: 'część Morza Egejskiego wokół wyspy Ikarii; według mitu nazwane od Ikara' },
    ],
  };
}(window.LM = window.LM || {}));
