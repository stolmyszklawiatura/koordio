# Architektura i granice funkcji

## Co istnieje teraz

Repozytorium jest aplikacją frontendową React + TypeScript + Vite. Punkt startowy to `src/main.tsx`, główny komponent to obecnie `src/App.tsx`, a style globalne znajdują się w `src/index.css`. W `src/funkcje/` są katalogi domenowe, a `src/img/` przechowuje obrazy. Nie ma backendu, persystencji ani kontraktu API.

## Minimalny układ

```text
src/
  main.tsx              # start aplikacji
  App.tsx               # główny układ i składanie widoków
  App.css, index.css    # style
  funkcje/
    wydarzenia/         # wydarzenia, uczestnicy, role, podgrupy
    zadania/            # ogłoszenia i zadania
    rozliczenia/        # wydatki i salda
  img/                  # pliki graficzne
```

Dodawaj pliki w katalogu funkcji dopiero, gdy dana funkcja jest implementowana. Nie twórz pustych warstw `server`, `shared`, `services`, `types`, `utils` ani rozbudowanych katalogów testowych na zapas. Komponenty specyficzne dla funkcji trzymaj przy niej; wspólny komponent wydziel dopiero, gdy korzysta z niego więcej niż jedno miejsce.

## Odpowiedzialność i zależności

- `wydarzenia` jest źródłem prawdy o wydarzeniu, członkostwie, uczestniku i roli.
- `zadania` korzystają z identyfikatora uczestnika oraz zakresu wydarzenia.
- `rozliczenia` korzystają z uczestników wydarzenia; własne reguły finansowe utrzymują lokalnie.
- `App.tsx` składa funkcje w interfejsie, nie przejmuje ich reguł domenowych.

Nie importuj prywatnych szczegółów jednego modułu bezpośrednio do drugiego. W razie potrzeby współdziel tylko mały, uzgodniony typ, bez budowania osobnej architektury na zapas.

## Dane i przyszły backend

Model pojęciowy, propozycje tabel oraz bezpieczną ścieżkę dostępu opisuje `docs/baza-danych.md`. Wspólne przepływy, role i nierozstrzygnięte reguły opisuje `docs/reguly-i-przeplywy.md`. Oba dokumenty zawierają propozycje, nie aktualny kod: na dziś aplikacja nie ma serwera ani dostępu do trwałej bazy.

## Otwarte decyzje techniczne

React, TypeScript i Vite są już w projekcie. Nie ustalono frameworka backendowego, bazy danych, hostingu, sposobu logowania ani API. Modularny monolit jest propozycją na przyszłość, jeśli aplikacja będzie potrzebowała serwera. Do tego czasu nie twórz symulowanego backendu ani nie przedstawiaj lokalnego stanu interfejsu jako trwałych danych.

Gdy backend powstanie, operacje na wydarzeniach będą wymagały walidacji wejścia i sprawdzania uprawnień po stronie serwera. Typy TypeScript po stronie przeglądarki nie stanowią zabezpieczenia.

## Spójność zmian

Zmiana członkostwa lub identyfikatora uczestnika może dotknąć zadań i rozliczeń. Zmiana zachowania widocznego dla użytkownika wymaga aktualizacji dokumentu modułu oraz testów. Po zmianie kontraktu sprawdź wszystkie jego miejsca użycia; nie duplikuj definicji modelu w dokumentacji.

