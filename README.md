# Koordio

Koordio służy do wspólnego organizowania wycieczek: uczestników, ogłoszeń, zadań i wydatków.

## Stan

Obecnie działa prototyp frontendowy React + TypeScript + Vite. Dane zapisują się w localStorage jednej przeglądarki. Nie ma kont, backendu ani połączenia z MySQL. Docelowy kierunek to backend NestJS i MySQL.

## Uruchomienie prototypu

Wymagane Node.js i npm: npm run dev, npm run build, npm run lint lub npm run preview. Uruchomienie frontendu nie uruchamia backendu.

## Dokumentacja

- [Architektura](docs/architecture.md) — wspólny przepływ, kontrolery i API.
- [Wycieczki](docs/modules/events.md) — konta, członkostwa i role.
- [Ogłoszenia i zadania](docs/modules/tasks.md).
- [Rozliczenia](docs/modules/finances.md).
- [Baza danych](docs/baza-danych.md).

Agent ma mapę zadań i zasady pracy w [AGENTS.md](AGENTS.md). README jest krótkim wprowadzeniem, a szczegóły funkcji mają jedno źródło w odpowiednich dokumentach modułów.
