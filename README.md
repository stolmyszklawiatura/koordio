# Koordio

Koordio pomaga grupom organizować wycieczki: zarządzać uczestnikami, ogłoszeniami, zadaniami i wspólnymi wydatkami.

## Stan projektu

Obecnie jest to prototyp frontendowy React + TypeScript + Vite. Dane demonstracyjne zapisują się w localStorage bieżącej przeglądarki i nie są współdzielone. Nie ma jeszcze kont, logowania, backendu ani połączenia z MySQL.

## Zakres MVP

- Rejestracja i logowanie.
- Wiele wycieczek na konto; rola organizatora lub uczestnika jest przypisana osobno w każdej wycieczce.
- Dodawanie istniejących kont do wycieczki po unikatowym numerze użytkownika.
- Ogłoszenia, zadania i wydatki w ramach wycieczki.
- Rozliczenia w PLN z równym podziałem i sugerowanymi spłatami.

System znajomych nie jest zatwierdzony w MVP. Szczegółowy model kont, wycieczek oraz przepływ przez kontrolery backendu opisuje [architektura](docs/architecture.md).

## Dokumentacja

- [Architektura i działanie](docs/architecture.md) — model aplikacji, uprawnienia, kontrolery i przykładowe przepływy.
- [Reguły i przepływy](docs/reguly-i-przeplywy.md) — szczegółowe uprawnienia i zasady.
- [Baza danych](docs/baza-danych.md) — model danych, MySQL i migracje.
- [Opisy modułów](docs/modules/events.md) — wycieczki; [zadania](docs/modules/tasks.md); [rozliczenia](docs/modules/finances.md).

## Uruchomienie prototypu

Wymagane są Node.js i npm. Polecenia: npm run dev, npm run build, npm run lint i npm run preview. Uruchomienie frontendu nie uruchamia backendu ani nie łączy się z MySQL.
