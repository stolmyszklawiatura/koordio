# Koordio

Koordio pomaga grupom organizować wycieczki: zarządzać uczestnikami, ogłoszeniami, zadaniami i wspólnymi wydatkami.

## Stan projektu

Obecnie jest to prototyp frontendowy React + TypeScript + Vite. Dane demonstracyjne zapisują się w localStorage bieżącej przeglądarki; nie są współdzielone. Aplikacja nie ma jeszcze kont, logowania, backendu ani połączenia z MySQL.

Docelowy kierunek to frontend React, backend NestJS oraz MySQL. Założenia opisują plan rozwoju, nie gotowe funkcje.

## Zakres MVP

1. Rejestracja i logowanie.
2. Tworzenie wielu wycieczek i dodawanie istniejących kont po unikatowym numerze użytkownika.
3. Role organizatora i uczestnika przypisane osobno w każdej wycieczce.
4. Ogłoszenia, zadania i wydatki w ramach wycieczki.
5. Rozliczenia w PLN z równym podziałem kosztu i sugerowanymi spłatami.
6. Wspólne dane obsługiwane przez API i MySQL.

System znajomych nie jest jeszcze zatwierdzoną częścią zakresu. Szczegółowy opis działania aplikacji, w tym relacji kont, ról i wycieczek, znajduje się w [przewodniku działania Koordio](docs/jak-dziala.md).

## Dokumentacja

- [Jak działa Koordio](docs/jak-dziala.md) — przewodnik po działaniu aplikacji.
- [Architektura](docs/architecture.md) — technologie i granice funkcji.
- [Reguły i przepływy](docs/reguly-i-przeplywy.md) — uprawnienia i zasady działania.
- [Baza danych](docs/baza-danych.md) — model danych i dostęp do MySQL.
- [Wycieczki](docs/modules/events.md), [zadania](docs/modules/tasks.md), [rozliczenia](docs/modules/finances.md) — opisy funkcji.

## Uruchomienie prototypu

Wymagane są Node.js i npm. Dostępne polecenia: npm run dev, npm run build, npm run lint i npm run preview. Uruchomienie frontendu nie uruchamia backendu ani nie łączy się z MySQL.
