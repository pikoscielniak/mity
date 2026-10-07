# Labirynt Mitów — plan implementacji

## Context

Repozytorium `D:\experiments\gra-mity` jest puste (tylko `README.md` z promptem). Użytkownik chce przeglądarkowej gry
edukacyjnej po polsku dla „ogarniętego” 12-latka. Gra najpierw uczy, a potem sprawdza znajomość trzech mitów greckich
(wersje z „Mitologii” Parandowskiego, czyli lektury szkolnej): Tezeusz i Ariadna, Dedal i Ikar, Orfeusz i Eurydyka.
Działa bez backendu i ma muzykę, lektora i piosenki. Wymagania doprecyzowane w kilku rundach pytań, a kierunek
graficzny wybrany na podstawie makiet. Poniżej są tylko ustalenia. W kroku 1 plan trafia do repo jako `docs/plan.md`.

## Ustalenia (zatwierdzone przez użytkownika)

**Platforma:** komputer, klawiatura + mysz. Statyczny HTML+JS uruchamiany dwuklikiem z dysku (`file://`, offline) i
później z hostingu. Bez modułów ES, bez `fetch`, bez CDN. Gra działa bez budowania; skrypt Node tylko skleja wersję
jednoplikową.

**Styl:** estetyka kolorowych gier Java z komórek (midlety, ok. 2005), ale w HD na laptopy. Jeden `<canvas>`
1280×720 skalowany do okna, rysowany w kodzie bez plików graficznych: soczyste kolory, gradienty z widocznym
pasmowaniem, kreskówkowe postacie z obrysem, błyszczące paski UI, pergaminowe okna dialogowe, czcionka Verdana/Tahoma.
Wzorzec to zaakceptowana klatka „Lot Ikara”. Bez ramki telefonu i bez klawiatury telefonu.

**Struktura gry:**
- Ekran tytułowy („Naciśnij Enter”, odblokowuje audio), potem wybór/utworzenie profilu z imieniem (kilka profili, autozapis w `localStorage`).
- Hub: animowana mapa świata mitów (Grecja z Morzem Egejskim + Sycylia; misje: Kreta, Ikaria, Tracja, Delfy). Statek płynie do wybranego miejsca, a zablokowane misje są zasnute mgłą.
- Misje odblokowywane po kolei: 1 → 2 → 3 → egzamin końcowy „Wyrocznia w Delfach”.
- Każda misja: opowieść (ilustrowane plansze + lektor, **pomijalna**) → etapy mini-gier z wplecionymi pytaniami → scenka końcowa zgodna z mitem → podsumowanie → piosenka → mapa. Około 10–15 min, 10–12 pytań losowanych z puli 25–30.
- Bez przewodnika/maskotki, narrator z offu.

**Misje:**
1. **Tezeusz i Ariadna:** labirynt z góry (strzałki/WASD), za Tezeuszem rozwija się nić. 4–5 drzwi z pieczęciami (pytania), krążący Minotaur (dotknięcie = −1 serce). Pojedynek: 5 pytań, dobra odpowiedź = cios. Ucieczka po nici na czas. Statek: Naksos, żagle, Egeusz, Morze Egejskie.
2. **Dedal i Ikar:** warsztat Dedala na Krecie (wybór materiałów: pióra + wosk, układanie piór, pytania) → lot (side-scroller: zielona strefa wysokości, za wysoko topi się wosk, za nisko mokną pióra; pióra, zwoje z pytaniami, mewy, wiatr, mijane Samos/Paros/Delos) → scenka upadku, Ikaria i Morze Ikaryjskie, Dedal na Sycylii.
3. **Orfeusz i Eurydyka:** gra rytmiczna na lutni (lirze), 4 struny = strzałki, wolno i krótko: Charon/Styks, Cerber, Hades (płaczące Erynie), a pomiędzy pytania → wspinaczka, w której trzymasz „naprzód” i NIE naciskasz „obejrzyj się” mimo pokus, a Hermes prowadzi Eurydykę (echa = pytania) → scenka: Orfeusz ogląda się tuż przed wyjściem, dalsze losy w jednym–dwóch zdaniach.
4. **Egzamin „Wyrocznia w Delfach”:** Pytia zadaje 15 losowych pytań ze wszystkich mitów, także łączących mity. Wszystkie typy pytań, próg 70%, osiągnięcie „Znawca mitów” i ekran końcowy.

**Pytania:** ABCD i prawda/fałsz (klawisze 1–4 / mysz), ułóż wydarzenia w kolejności, dopasuj pary, wpisz odpowiedź
(tolerancja literówek i braku polskich znaków). Bez limitu czasu.

**Zasady:** 3 serca tracone **tylko w zręczności**, a utrata wszystkich cofa do ostatniego punktu kontrolnego. Zła odpowiedź nie
zabiera serca, tylko pokazuje wyjaśnienie z mitu. Misja jest zaliczona przy ≥70% dobrych odpowiedzi za pierwszym
razem, inaczej powtórka z nowym losowaniem. Jeden poziom trudności.

**Podpowiedź:** klawisz H otwiera „Zwój” z fragmentem opowieści zawierającym odpowiedź. Maksymalnie 3 na misję,
blokuje osiągnięcie „Bez podpowiedzi”.

**Motywacja:** tylko osiągnięcia (bez punktów, gwiazdek i dyplomu). Lista:
- Bez jednego błędu
- Bez podpowiedzi
- Nietknięty przez Minotaura
- Nić nie pękła (ucieczka bez straty serca)
- Złoty środek (cały lot w zielonej strefie)
- Wszystkie pióra zebrane
- Mistrz lutni
- Nie obejrzał{eś|aś} się ani razu
- Mól książkowy (wysłuchane wszystkie opowieści bez pomijania)
- Śpiewak z Tracji (wszystkie ballady w szafie grającej)
- Znawca mitów (zdany egzamin)
- Wyrocznia pod wrażeniem (egzamin bez błędu)

**Podsumowanie misji:** lista błędów z poprawną odpowiedzią i zdaniem z mitu, „Warto zapamiętać” (5–7 pojęć z
definicjami). W menu historia wyników profilu (data, misja, %, zaliczona).

**Treść:** pełne mity podane łagodnie (bez drastycznych opisów; los Orfeusza w jednym zdaniu). Tekst gry pisany
własnymi słowami, bez cytowania książki.

**Audio (wszystko generowane w kodzie, Web Audio API):**
- muzyka w stylu polifonicznych dzwonków z midletów: sekwencer + proste instrumenty, motywy mapy, każdej misji i egzaminu oraz efekty dźwiękowe;
- lektor przez `speechSynthesis` pl-PL z różnymi głosami postaci (narrator Paulina, mężczyźni Adam, ton i tempo per postać); wyłączany w ustawieniach, a bez głosów działa sam tekst;
- piosenka na koniec każdej misji: rymowana ballada streszczająca mit, śpiewana **własnym robotycznym syntezatorem formantowym** po polsku, z tekstem karaoke. Potem dostępna w menu „Szafa grająca”. **Wczesne demo jednej zwrotki do akceptacji użytkownika.**

**Zasada nadrzędna (słowa użytkownika):** „celem gry jest nauczyć mitów, a nie wypracować zręczność”. Wszystkie
mini-gry mają być łagodne i wyrozumiałe: wolny i przewidywalny Minotaur, hojny limit czasu ucieczki, szeroka strefa
lotu, na lirze wolne i krótkie sekwencje bez szybkich serii. Zręczność jest tłem dla opowieści i pytań.

**Detale:**
- Profil: imię + „Gram jako: chłopak / dziewczyna”, a teksty używają właściwej formy (`Zdobyłeś/Zdobyłaś`).
- Dystrybucja: czytelny folder (`index.html` + pliki JS) oraz skrypt Node sklejający wszystko w jeden plik `dist/labirynt-mitow.html` (do wysłania mailem/na hosting).
- Opowieść przewijana ręcznie: tekst pisze się jak na maszynie, lektor czyta, Enter/klik przechodzi dalej, Esc pomija całość.
- Lira: strzałki ← ↓ ↑ →.
- Utrata 3 serc cofa do **ostatniego punktu kontrolnego** (ostatnie otwarte drzwi, ostatni zwój, ostatni oczarowany strażnik). Serca wracają do 3, a udzielone odpowiedzi zostają.
- Mapa uczy geografii: podpisy (Ateny, Kreta, Naksos, Ikaria, Sycylia, Delfy, Tenaron) i jednozdaniowa ciekawostka po najechaniu.

## Architektura

**Zasada ładowania:** klasyczne skrypty `<script src>` w kolejności z `index.html`. Każdy plik to IIFE dopisujące się
do `window.LM`: `(function (LM) { … }(window.LM = window.LM || {}));`. Na poziomie modułu żaden plik poza
`src/main.js` i `src/debug/debug-hook.js` nie dotyka DOM, więc testy ładują resztę w czystym `vm`. Gra nie ma żadnych
zależności. `package.json` służy tylko do testów (devDependency `playwright`, przeglądarka `msedge` z systemu).

```
index.html, css/page.css
src/data/        treść (tylko dane): missions.js, voices.js, map-places.js, concepts.js, achievements.js,
                 myths/{theseus,icarus,orpheus}-story.js, questions/{theseus,icarus,orpheus,cross}-questions.js,
                 songs/ballad-{theseus,icarus,orpheus}.js, music-themes.js, lyre-charts.js
src/core/        random.js (seedowany RNG), text-normalize.js (normalizacja + Levenshtein),
                 gender-forms.js (applyGenderForms: „Zdobył{eś|aś}”), note-notation.js, storage.js
src/engine/      canvas-view.js (1280×720, letterbox, DPR), game-loop.js (rAF, stały krok), input.js
                 (event.code → akcje, mysz w układzie logicznym), scene-manager.js (scena + stos nakładek),
                 answer-input-overlay.js (HTML <input> nad canvasem do wpisywania z polskimi znakami)
src/render/      palette.js, retro-draw.js (pasmowe gradienty, obrysowane kształty), text.js (zawijanie,
                 sklejanie jednoliterowych spójników), ui-widgets.js (błyszczące paski, pergamin, serca,
                 klawisze), characters-*.js, illustrations-{theseus,icarus,orpheus}.js, map-painter.js
src/audio/       audio-hub.js (odblokowanie, szyny music/sfx/voice, ściszanie muzyki pod lektora),
                 instruments.js (bell, flute, bass, pad, pulseLead, noiseDrum), sequencer.js (lookahead),
                 sfx.js, speech.js (głosy pl, dzielenie na zdania, watchdog, tryb tylko-tekst)
src/singer/      polish-phonemes.js, phoneme-table.js, phoneme-timing.js, voice-automation.js (czyste,
                 testowane) → formant-voice.js (Web Audio: źródło + 3 formanty + szum), song-player.js (karaoke)
src/game/        answer-check.js, question-draw.js, mission-run.js (wynik, próg 70%), achievements.js,
                 profiles.js, mission-runner.js (etapy, serca, punkty kontrolne, powtórki)
src/ui/          choice-view.js (ABCD + P/F), order-view.js, match-view.js, typed-view.js,
                 question-overlay.js, hint-scroll-overlay.js, pause-overlay.js, achievement-toast.js
src/minigames/   labyrinth/ (maze-generator, minotaur-brain, labyrinth-, duel-, escape-, ship-stage),
                 workshop/ (materials-, feather-order-stage), flight/ (flight-model, flight-stage),
                 lyre/ (rhythm-judge, lyre-stage), ascent/ (ascent-model, ascent-stage)
src/scenes/      title, profile-select, settings, map, cutscene, summary, song, jukebox, history,
                 achievements, exam, ending (po jednym pliku *-scene.js)
src/debug/debug-hook.js   window.LM_DEBUG tylko przy ?debug=1, a ?scene=… otwiera scenę bezpośrednio
src/main.js
tools/build-single-file.js   skleja CSS+JS do dist/labirynt-mitow.html
tests/helpers/load-game.js, tests/unit/*.test.js, tests/smoke/playthrough.test.js
```

**Kluczowe decyzje techniczne:**
- Scena ma `{enter, exit, update(dt,input), render(ctx)}`, a etap mini-gry dodatkowo `debugComplete()`. Etapy rejestrują się przez `LM.stageFactories[type]`, a `missions.js` odwołuje się do nich nazwą.
- Kontekst etapu: `askQuestion(slot, onClosed)`, `loseHeart()`, `reachCheckpoint(id)`, `recordStat()`, `completeStage()`. Po złej odpowiedzi jest wyjaśnienie i ponowna próba (pieczęć otwiera dopiero dobra odpowiedź), a liczy się tylko pierwsza próba. W pojedynku zła odpowiedź oznacza brak ciosu i kolejne pytanie.
- Pytanie: wspólne pola `{id, myth, slot, type, prompt, hintPageId, explanation}` plus pola typu: `choice{options,correctIndex}`, `truefalse{statement,statementIsTrue}`, `order{itemsInOrder}`, `match{pairs}`, `typed{acceptedAnswers}`.
- Wpisywane odpowiedzi: NFD, usunięcie znaków diakrytycznych, `ł→l`, Levenshtein 0 dla ≤4 znaków, 1 dla ≤8, 2 dla dłuższych.
- Piosenka to sylaby (dzielone przez autora) 1:1 z nutami, np. `'D4/8 E4/8 F4/4'`. Śpiewak: tekst → głoski (dwuznaki, zmiękczenia, ą/ę) → czasy głosek → automatyka parametrów → jeden graf Web Audio na piosenkę, a karaoke synchronizowane z `audioCtx.currentTime`.
- Zapis: klucz `labiryntMitow.save` z `version` i `profiles[{name, gender, settings, progress, achievements, unlockedSongs, history}]`. Każdy dostęp do `localStorage` jest w try/catch, z awaryjnym zapisem w pamięci i jednorazowym komunikatem.

## Treść mitów (karta faktów według Parandowskiego)

Źródłem są fragmenty i ćwiczenia z ZPE (zpe.gov.pl), sprawdzone ze streszczeniami. Zasady:
1. Pytamy tylko o fakty potwierdzone u Parandowskiego.
2. Tam, gdzie wersje się różnią, **nie pytamy**. W opowieści sygnalizujemy różnicę („w innych opowieściach…”), bo to też uczy.
3. Wszystko piszę własnymi słowami.

**Tezeusz i Ariadna**
- Tezeusz, syn króla Aten Ajgeusa. W grze piszemy „Egeusz (u Parandowskiego: Ajgeus)”, a w odpowiedziach wpisywanych uznajemy obie formy.
- Haracz dla Minosa: 7 dziewcząt i 7 chłopców wybieranych losem, na pożarcie Minotaurowi (głowa byka, ciało człowieka) w labiryncie zbudowanym przez Dedala.
- Tezeusz zgłasza się sam. Czarny żagiel oznacza śmierć, a znak zwycięstwa to żagiel szkarłatny (w innych wersjach biały, więc o kolor zwycięstwa nie pytamy).
- Ariadna, córka Minosa, daje kłębek nici; u Parandowskiego to jej pomysł. Nić przywiązana u wejścia, Minotaur pokonany, powrót po nici.
- Ariadna zostaje śpiąca na Naksos, a jej mężem zostaje Dionizos.
- Tezeusz zapomina zmienić żagiel, a Egeusz rzuca się ze skały do morza (Morze Egejskie, według tradycji).
- Pojęcia: nić Ariadny, labirynt, po nitce do kłębka, heros, mit/mitologia.
- Nie pytamy o: częstotliwość haraczu (co rok / co 9 lat), broń Tezeusza, kolor żagla zwycięstwa.

**Dedal i Ikar**
- Dedal: Ateńczyk, genialny budowniczy i wynalazca (świder, poziomica, „żywe” posągi), budowniczy labiryntu.
- Tęskni za ojczyzną, ale Minos go nie wypuszcza ze strachu przed zdradą tajemnic. **Bez więzienia w wieży**, więc etap 2 to „Warsztat Dedala na Krecie”.
- Skrzydła z ptasich piór sklejonych woskiem. Właściwe materiały w warsztacie to pióra + wosk; układanie piór to tylko mechanika, nie pytanie.
- Przestroga: leć środkiem, za wysoko słońce stopi wosk, za nisko woda zmoczy pióra (złoty środek).
- Lot obok wysp Samos, Paros i Delos. Mijane wyspy pojawiają się w tle lotu z podpisami.
- Ikar leci coraz wyżej, wosk topnieje, Ikar spada i ginie. U Parandowskiego spada na wyspę, w innych wersjach do morza, więc o miejsce upadku nie pytamy.
- Dedal grzebie syna. Od Ikara nazwano wyspę Ikarię i Morze Ikaryjskie. Dedal dociera na Sycylię, do króla; Minos ginie, ścigając go.
- Pojęcia: ikarowy lot, Ikar (brawura) kontra Dedal (rozsądek), złoty środek, marzenie o lataniu.

**Orfeusz i Eurydyka**
- Orfeusz: król-śpiewak z Tracji. Gra na **lutni** (podręczniki: lira), a jego muzyka porusza drzewa, rzeki i zwierzęta. W grze instrument nazywa się „lutnia (lira)” i obie odpowiedzi są uznawane.
- Eurydyka: nimfa drzewna, żona Orfeusza. Ucieka przed Aristajosem w dolinie Tempe, kąsa ją żmija.
- Zejście do podziemia: Charon, oczarowany muzyką, przewozi go przez Styks za darmo, Cerber nie szczeka, płaczą nawet Erynie. Hades oddaje Eurydykę, a Hermes ją prowadzi.
- Warunek: nie oglądać się za siebie. Orfeusz ogląda się, gdy są już prawie na górze, i traci ją na zawsze.
- Los Orfeusza (jedno–dwa zdania, łagodnie): zginął z rąk menad, a jego głowa, wciąż wołając Eurydykę, dopłynęła do Lesbos; muzy pochowały go u stóp Olimpu.
- Etap liry: kolejno oczarowani strażnicy to Charon → Cerber → Hades (z płaczącymi Eryniami). Na wspinaczce Hermes prowadzi Eurydykę za Orfeuszem.
- Pojęcia: Orfeusz (potęga sztuki, miłość silniejsza niż śmierć), cerber (czujny strażnik), Charon, Styks, Hades (bóg i kraina), nimfa, muza.
- Nie pytamy o: rodziców Orfeusza (Kalliope), Persefonę, Tenaron, Tartar.

**Pytania łączące (egzamin):** Dedal zbudował labirynt z mitu 1. Minos występuje w obu pierwszych mitach. Dionizos
poślubia Ariadnę, a jego menady zabijają Orfeusza. Dwa morza nazwane od ofiar (Egejskie, Ikaryjskie). Wspólny motyw
złamanego zakazu lub zapomnianej przestrogi (żagiel, lot, spojrzenie).

**Mapa:** obejmuje Grecję i Sycylię. Miejsca: Ateny, Kreta, Naksos, Samos, Paros, Delos, Ikaria, Sycylia, Tracja,
Lesbos, Delfy. Misja 3 startuje w Tracji.

## Sposób pracy

Po akceptacji planu **nie angażuję już użytkownika** (jego decyzja): sam odbieram każdy krok według kryteriów niżej.
Praca na gałęzi `feat/labirynt-mitow`, jeden commit na krok. Każdy krok to implementacja + testy + samoodbiór:
zrzuty ekranu z Playwright oglądane przeze mnie, testy jednostkowe i dymne zielone, brak błędów w konsoli. Na końcu
`/simplify` i `/code-review` zgodnie z globalnym CLAUDE.md. Zmiany w istniejących testach dostają trailer
`Test-change:`.

## Kamienie milowe i kroki

**M1 Fundament**
1. Szkielet: `package.json` (tylko testy), `.gitignore`, `index.html`, namespace, canvas-view, pętla, input, menedżer scen, ekran tytułowy; loader testów + test ładowania + dymny test otwarcia strony.
2. Zestaw rysunkowy: retro-draw, zawijanie tekstu (testy), widżety UI; `?scene=styleguide` do przeglądu.
3. Audio: hub, instrumenty, parser nut (testy), sekwencer; motyw tytułowy po Enter.
- *Samoodbiór:* zrzut ekranu tytułowego i styleguide'u wizualnie zgodny z zaakceptowaną klatką „Lot Ikara”; ostry przy DPR 1 i 2 oraz przy oknach 1366×768 i 1920×1080.

**M2 Śpiew (największe ryzyko)**
4. Głoski po polsku, tabela formantów, planowanie czasów, automatyka (czyste, testowane: `rzeka, szczęście, dziewczyna, cień, ząb, chór, Eurydyka, pióra`).
5. Głos formantowy, odtwarzacz piosenki, scena karaoke z jedną zwrotką (`?scene=singdemo`).
- *Samoodbiór:* render offline (`OfflineAudioContext`) bez NaN, RMS powyżej progu, wysokość dźwięku zgodna z melodią (autokorelacja ±1 półton). Zapis WAV i próba transkrypcji lokalnym ASR (np. `faster-whisper`, jeśli da się zainstalować) jako miara zrozumiałości, potem strojenie tabeli formantów. Jeśli mimo strojenia śpiew pozostaje niezrozumiały, robo-śpiew zostaje ciszej i dublowany melodią prowadzącą, a karaoke niesie tekst.

**M3 Profile i silnik pytań**
6. Storage, profile (imię + chłopak/dziewczyna), `applyGenderForms`, wybór profilu z polem tekstowym, ustawienia (głośności, lektor).
7. answer-check, question-draw, mission-run (testy progów: 7/10 zalicza, 6/10 nie; 9/12 tak, 8/12 nie).
8. Widoki 4 typów pytań, nakładka pytania, zwój podpowiedzi; `?scene=questions`.

**M4 Misja 1 (Tezeusz i Ariadna)**
9. Treść: opowieść, zakończenie, około 28 pytań, pojęcia + test walidacji treści.
10. Lektor (`speech.js`) i scena opowieści (ilustracje, maszyna do pisania, Enter/Esc).
11. Runner misji, podsumowanie, scena piosenki, statyczna mapa z odblokowaniem.
12. Labirynt: generator (testy: każda komórka osiągalna, drzwi na ścieżce), ruch, nić, pieczęcie.
13. Minotaur (wolny, przewidywalny patrol), serca, punkty kontrolne.
14. Pojedynek. 15. Ucieczka po nici (hojny czas) + scena statku.
16. Osiągnięcia, powiadomienia, ekrany historii i osiągnięć; pełna ballada Tezeusza.
- *Samoodbiór:* przejście misji botem (debug hook) i prawdziwymi klawiszami w Playwright, czas rozgrywki 10–15 min przy czytaniu, zrzuty każdej sceny, treść sprawdzona z kartą faktów mitu.

**M5 Misja 2 (Dedal i Ikar)**
17. Treść + ballada, warsztat (materiały, układanie piór). 18. Model lotu (testy: prosty bot utrzymujący środek strefy kończy lot), etap lotu, scenka upadku.

**M6 Misja 3 (Orfeusz i Eurydyka)**
19. Treść + ballada, partytury liry (wolne, krótkie), sędzia rytmu (szerokie okna trafienia), etap liry.
20. Wspinaczka (pokusy, klawisz „obejrzyj się”), scenka zakończenia.

**M7 Całość**
21. Egzamin u Pytii (15 pytań, w tym łączące mity), ekran końcowy, „Znawca mitów”.
22. Animowana mapa (statek, mgła, podpisy i ciekawostki), szafa grająca, motywy mapy i egzaminu.
23. `tools/build-single-file.js` → `dist/labirynt-mitow.html` + test dymny także na tym pliku.
24. Szlif: tempo, balans, DPR/resize, przegląd tekstów (forma rodzajowa, literówki), `/simplify`, `/code-review`, `README.md` z instrukcją.

## Weryfikacja (end-to-end)

```bash
npm test
```
```bash
npm run test:smoke
```
- `npm test`: `node --test tests/unit` (logika, głoski, labirynt, model lotu, sędzia rytmu, zapis, walidacja całej treści).
- `npm run test:smoke`: Playwright (msedge, headless) otwiera `index.html?debug=1&seed=42` przez `file://`. Tworzy profil prawdziwymi klawiszami, przechodzi każdą misję i egzamin przez `LM_DEBUG`, wykonuje jedno podejście z samymi złymi odpowiedziami (powtórka misji), przeładowuje stronę i sprawdza zachowany postęp. Robi zrzuty każdej sceny do `test-results/` i failuje na dowolnym błędzie konsoli. Te same testy przechodzą na `dist/labirynt-mitow.html`.
- Ręcznie (w moim zakresie): obejrzenie zrzutów wszystkich scen; render piosenek offline; uruchomienie przez dwuklik `index.html` w Edge/Chrome.
