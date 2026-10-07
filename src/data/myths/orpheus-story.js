// Mit o Orfeuszu i Eurydyce, opowiedziany własnymi słowami na podstawie „Mitologii” Jana Parandowskiego.
// Pages are read by the narrator (or a character); illustrations are drawn in src/render/illustrations-orpheus.js.
(function (LM) {
  'use strict';

  LM.data.myths = LM.data.myths || {};
  LM.data.myths.orpheus = {
    id: 'orpheus',
    title: 'Orfeusz i Eurydyka',
    storyPages: [
      {
        id: 'orf-s01', speaker: 'narrator', illustration: 'thrace-forest',
        text: 'Posłuchaj mitu o muzyce i miłości. W górzystej Tracji żył młody król Orfeusz, najwspanialszy śpiewak, o jakim opowiadają mity. ' +
          'Grał na lutni (w podręcznikach często: na lirze). Gdy śpiewał, drzewa pochylały gałęzie, rzeki zatrzymywały nurt, a dzikie zwierzęta kładły mu się u stóp.',
      },
      {
        id: 'orf-s02', speaker: 'narrator', illustration: 'orpheus-eurydice',
        text: 'Żoną Orfeusza była Eurydyka, nimfa drzewna. Nimfy to boginki przyrody, które mieszkały w drzewach, źródłach, rzekach i górach. ' +
          'Orfeusz i Eurydyka bardzo się kochali, a dla niej śpiewak układał swoje najpiękniejsze pieśni.',
      },
      {
        id: 'orf-s03', speaker: 'narrator', illustration: 'tempe-meadow',
        text: 'Pewnego dnia Eurydyka przechadzała się po zielonej dolinie Tempe. Zobaczył ją tam Aristajos, syn boga Apollina, i zaczął ją gonić. ' +
          'Przestraszona nimfa rzuciła się do ucieczki przez wysokie trawy.',
      },
      {
        id: 'orf-s04', speaker: 'narrator', illustration: 'viper',
        text: 'W trawie ukryta była żmija. Ukąsiła uciekającą Eurydykę, a jad żmii okazał się śmiertelny. ' +
          'Młoda nimfa umarła, a jej dusza odeszła do podziemnego królestwa zmarłych, którym władał bóg Hades.',
      },
      {
        id: 'orf-s05', speaker: 'orpheus', illustration: 'orpheus-decision',
        text: 'Bez Eurydyki moje pieśni są tylko płaczem. Zejdę do krainy zmarłych i poproszę jej władcę, żeby mi ją oddał. ' +
          'Nie wezmę miecza ani złota, tylko moją lutnię. Może muzyka wzruszy nawet podziemie.',
      },
      {
        id: 'orf-s06', speaker: 'narrator', illustration: 'styx-shore',
        text: 'Orfeusz zszedł głęboko pod ziemię i stanął nad Styksem, rzeką podziemnego świata. Dusze zmarłych przewoził przez nią w łodzi ' +
          'ponury przewoźnik Charon. Każdy, kto chciał przepłynąć na drugi brzeg, musiał mu zapłacić.',
      },
      {
        id: 'orf-s07', speaker: 'charon', illustration: 'charon-boat',
        text: 'Od wieków wożę przez Styks milczące dusze, ale takiej pieśni nie słyszałem nigdy. Wsiadaj do łodzi, śpiewaku! ' +
          'Przewiozę cię na drugi brzeg za darmo, tylko graj dalej.',
      },
      {
        id: 'orf-s08', speaker: 'narrator', illustration: 'cerberus-gate',
        text: 'Bramy podziemnego świata strzegł Cerber, ogromny pies o trzech głowach. Gdy usłyszał lutnię Orfeusza, nie zaszczekał ani razu, ' +
          'tylko położył łby na łapach i przepuścił śpiewaka. Dziś o czujnym, surowym strażniku mówimy, że „pilnuje jak cerber”.',
      },
      {
        id: 'orf-s09', speaker: 'narrator', illustration: 'hades-throne',
        text: 'Wreszcie Orfeusz stanął przed tronem Hadesa, władcy podziemi. (Hadesem nazywano też całe jego królestwo.) ' +
          'Śpiewak zagrał i zaśpiewał o swojej miłości i tęsknocie. Pieśń była tak piękna i smutna, że zapłakały nawet Erynie, surowe boginie zemsty.',
      },
      {
        id: 'orf-s10', speaker: 'hades', illustration: 'hades-decision',
        text: 'Twoja pieśń poruszyła nawet moje serce. Zabierz Eurydykę! Hermes, posłaniec bogów, poprowadzi ją za tobą na górę. ' +
          'Ale pamiętaj o jednym warunku: dopóki nie wyjdziesz z podziemi, nie wolno ci obejrzeć się za siebie.',
      },
      {
        id: 'orf-s11', speaker: 'hermes', illustration: 'ascent',
        text: 'Idź przodem, Orfeuszu, a ja poprowadzę za tobą Eurydykę. Droga na górę jest długa, stroma i ciemna, ' +
          'a cienie zmarłych stąpają bezgłośnie. Nie oglądaj się, choćby nie wiem co!',
      },
      {
        id: 'orf-s12', speaker: 'narrator', illustration: 'look-back',
        text: 'Szli długo w ciszy. Byli już prawie u wyjścia, gdy Orfeusz nie wytrzymał: tak bardzo chciał zobaczyć ukochaną, że obejrzał się za siebie. ' +
          'Ujrzał Eurydykę tylko przez mgnienie oka. Hermes zatrzymał ją i poprowadził z powrotem w ciemność.',
      },
      {
        id: 'orf-s13', speaker: 'eurydice', illustration: 'eurydice-farewell',
        text: 'Orfeuszu, byliśmy już tak blisko światła! Teraz muszę wrócić do krainy cieni. Żegnaj, mój ukochany, żegnaj na zawsze…',
      },
      {
        id: 'orf-s14', speaker: 'narrator', illustration: 'thrace-lament',
        text: 'Bramy podziemi zamknęły się i Orfeusz wyszedł na świat sam. Stracił Eurydykę po raz drugi, tym razem na zawsze. ' +
          'Długo błąkał się po górach i lasach Tracji, a wzgórza wypełniały się jego żałosnymi pieśniami.',
      },
      {
        id: 'orf-s15', speaker: 'narrator', illustration: 'lesbos',
        text: 'Wiele lat później Orfeusz zginął z rąk menad, dzikich towarzyszek boga Dionizosa. ' +
          'Mit mówi, że jego głowa, wciąż wołając imię Eurydyki, dopłynęła z falami aż do wyspy Lesbos.',
      },
      {
        id: 'orf-s16', speaker: 'narrator', illustration: 'olympus-muses',
        text: 'Muzy, boginie opiekujące się sztuką, pochowały Orfeusza u stóp Olimpu. Dziś muzą nazywamy też to, co daje artyście natchnienie. ' +
          'A sam Orfeusz stał się symbolem potęgi muzyki i sztuki oraz miłości silniejszej niż śmierć.',
      },
    ],
    endingPages: [
      {
        id: 'orf-e01', speaker: 'narrator', illustration: 'look-back',
        text: 'Tak skończyła się wędrówka do podziemi: pieśń Orfeusza wzruszyła nawet władcę zmarłych, ' +
          'ale jedno spojrzenie za siebie odebrało mu Eurydykę na zawsze.',
      },
      {
        id: 'orf-e02', speaker: 'narrator', illustration: 'thrace-forest',
        text: 'Był{eś|aś} dzieln{y|a} jak Orfeusz: prze{szedłeś|szłaś} przez podziemie, oczarował{eś|aś} lutnią Charona, Cerbera i Hadesa ' +
          'i wędrował{eś|aś} z Eurydyką ku światłu. Czas na balladę o Orfeuszu!',
      },
    ],
    concepts: [
      { id: 'orfeusz', term: 'Orfeusz', definition: 'symbol potęgi muzyki i sztuki oraz miłości silniejszej niż śmierć' },
      { id: 'cerber', term: 'cerber', definition: 'czujny, surowy strażnik; mówimy, że ktoś „pilnuje jak cerber”' },
      { id: 'charon', term: 'Charon', definition: 'przewoźnik, który wiózł dusze zmarłych łodzią przez Styks' },
      { id: 'styks', term: 'Styks', definition: 'rzeka podziemnego świata, oddzielająca krainę zmarłych od świata żywych' },
      { id: 'hades', term: 'Hades', definition: 'bóg podziemi, a także nazwa jego królestwa, czyli krainy zmarłych' },
      { id: 'nimfa', term: 'nimfa', definition: 'boginka przyrody mieszkająca w drzewach, źródłach, rzekach lub górach' },
      { id: 'muza', term: 'muza', definition: 'bogini opiekująca się sztuką; w przenośni: natchnienie artysty' },
    ],
  };
}(window.LM = window.LM || {}));
