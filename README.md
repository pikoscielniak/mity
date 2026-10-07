# Labirynt Mitów

Przeglądarkowa gra edukacyjna w stylu kolorowych gier z komórek z lat 2000 (midletów), ale w jakości HD.
Najpierw uczy trzech mitów greckich według „Mitologii” Jana Parandowskiego, a potem sprawdza, czy dziecko je zna.
Przeznaczona dla ogarniętego 12-latka.

- **Misja 1 – Tezeusz i Ariadna:** labirynt z nicią Ariadny, pojedynek z Minotaurem, ucieczka po nici, rejs przez Naksos do Aten.
- **Misja 2 – Dedal i Ikar:** warsztat Dedala (pióra i wosk), lot „złotym środkiem” nad Samos, Paros i Delos, dalej Dedalem na Sycylię.
- **Misja 3 – Orfeusz i Eurydyka:** gra na lutni dla Charona, Cerbera i Hadesa, droga z podziemi bez oglądania się.
- **Egzamin – Wyrocznia w Delfach:** 15 pytań ze wszystkich mitów, także łączących mity.

Każda misja to opowieść (z lektorem, do pominięcia) → mini-gry z pytaniami → podsumowanie z błędami i pojęciami
„Warto zapamiętać” → ballada śpiewana przez robotycznego aojdę z tekstem karaoke.

## Jak uruchomić

Nie trzeba niczego instalować ani mieć internetu.

- Otwórz **`index.html`** dwuklikiem (Edge, Chrome albo Firefox na komputerze), albo
- zbuduj jeden plik do wysłania mailem lub wrzucenia na hosting:

```bash
npm run build
```

Powstaje `dist/labirynt-mitow.html`, czyli cała gra w jednym pliku (ok. 460 KB).

## Sterowanie

| Klawisz | Działanie |
| --- | --- |
| ← ↑ ↓ → (lub WASD) | ruch, wybór, struny lutni |
| Enter / Spacja | dalej, zatwierdź |
| 1–4 | odpowiedź w pytaniach |
| H | zwój z podpowiedzią (fragment opowieści; 3 na misję) |
| Esc | pomiń opowieść, pauza, menu na mapie |

Myszą da się klikać odpowiedzi, przeciągać karty w pytaniach „ułóż w kolejności” i wybierać miejsca na mapie.

## Dla rodzica i nauczyciela

- Treść opiera się na wersjach mitów z „Mitologii” Parandowskiego (lektura w klasach 4–6), opowiedzianych własnymi słowami.
  O szczegóły, w których wersje mitów się różnią (np. kolor żagla zwycięstwa, miejsce upadku Ikara), gra nie pyta. Zamiast tego mówi, że różne wersje istnieją.
- Pytania są pięciu typów: wybór, prawda/fałsz, kolejność wydarzeń, dopasuj pary i wpisz odpowiedź (z tolerancją literówek i braku polskich znaków).
  W każdej misji losuje się 12 z ponad 30 pytań, a odpowiedzi są tasowane.
- Misja jest zaliczona przy co najmniej 70% dobrych odpowiedzi **za pierwszym razem**. Po błędzie gra pokazuje poprawną odpowiedź i wyjaśnienie z mitu.
- Serca traci się tylko w mini-grach, i to łagodnie: gra uczy mitów, a nie wyrabia refleks.
- W menu mapy (Esc) jest **Historia wyników** każdego podejścia i lista osiągnięć.
- Postęp zapisuje się w przeglądarce (localStorage), osobno dla każdego profilu gracza.

## Technika

- Statyczny HTML + JavaScript (klasyczne skrypty pod `window.LM`), jeden `<canvas>` 1280×720 skalowany do okna, bez bibliotek i bez plików graficznych.
- Wszystko jest generowane w kodzie: grafika, muzyka w stylu polifonicznych dzwonków (Web Audio API), lektor (`speechSynthesis` z polskimi głosami systemu) i śpiew.
- Śpiew robi własny syntezator formantowy w stylu Klatta, działający w AudioWorklet, z polskimi regułami wymowy (`src/singer/`).

```
src/core      zapis, losowanie, normalizacja tekstu, formy rodzajowe, notacja nut
src/engine    canvas, pętla gry, wejście, sceny, pole tekstowe
src/render    paleta, kształty, postacie, tła, ilustracje mitów, mapa
src/audio     instrumenty, sekwencer, efekty, lektor
src/singer    głoski, tabela formantów, synteza Klatta, odtwarzacz ballad
src/game      profile, pytania, wynik, osiągnięcia, przebieg misji
src/ui        menu, widoki pytań, nakładki, karaoke
src/minigames labirynt, pojedynek, rejs, warsztat, lot, lutnia, wspinaczka
src/scenes    ekrany gry
src/data      treść: opowieści, pytania, pojęcia, ballady, motywy muzyczne
```

## Testy

```bash
npm install
```

```bash
npm test
```

```bash
npm run test:smoke
```

`npm test` uruchamia testy jednostkowe (Node) logiki, wymowy, labiryntu, lotu, rytmu i walidacji całej treści.
`npm run test:smoke` otwiera grę z dysku w Edge (Playwright), przechodzi wszystkie misje, egzamin i mapę i robi zrzuty do `test-results/`.

## Prompt

Napisz mi grę, która sprawdza wiedzę o mitach greckich.
Gra ma mieć trzy misje. Każda misja to jeden mit grecki.
Misja 1. Mit o Tezeuszu i Ariadnie
Misja 2. Mit o Dedalu i Ikarze
Misja 3. Mit o Orfeuszu i Eurydyce

Gra ma być w stylu retro.
Celem gry jest nauczyć dziecka treści mitu oraz podstawowych pojąc związanych z danym mitem.
Gra ma być sprawdzianem czy dziecko zna ten mit.
Gra jest kierowana do ogarniętego 12-latka.

Gram ma być przeglądarkową grą HTML, może Canvas, sam zdecyduj co użyjesz byleby działało w przeglądarce.
Gra ma nie mieć backend-u ma być statycznym html, js-em.

Gra ma być w języku polskim.

Gra ma zawierać muzykę. Możesz, jeśli potrafisz, generować audio ze słowami.

Bądź twórczy aby stworzy angażującą grę.

Zadaj tak wiele pytań jak to tylko możliwe aby dopracować wymagania i implementację.
