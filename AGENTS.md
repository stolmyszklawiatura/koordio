# AGENTS.md — jak pracować z projektem

## Cel pliku

Ten plik jest mapą dokumentacji i zasadami pracy dla agenta. Nie jest opisem wszystkich funkcji Koordio. Przy każdym zadaniu otwórz tylko wskazane dokumenty i pliki kodu związane ze zmianą; nie przeglądaj całego repozytorium bez potrzeby.

## Najpierw ustal zakres

- Sprawdź kod w obszarze, którego dotyczy zadanie. Dokument opisuje zamiar, kod pokazuje stan obecny.
- Gdy zmiana dotyczy jednej funkcji, zacznij od jej dokumentu modułu i powiązanego kodu.
- Czytaj architekturę tylko przy zmianie wspólnego przepływu, kontrolerów, API lub granic modułów.
- Czytaj dokument bazy tylko przy zmianie tabel, zapytań, migracji lub przechowywania danych.
- Nie otwieraj pozostałych dokumentów, jeśli ich zakres nie jest potrzebny.
- Jeśli kod i dokumentacja są sprzeczne, zgłoś różnicę i nie przedstawiaj planu jako działającej funkcji.

## Mapa dokumentacji

| Potrzeba | Otwórz |
|---|---|
| Krótki wstęp i uruchomienie prototypu | README.md |
| Całościowy opis aplikacji i funkcji | docs/opis-aplikacji.md |
| Kontrolery, wspólny przepływ, API, granice modułów | docs/architecture.md |
| Konta, wycieczki, członkostwa, role, archiwizacja | docs/modules/events.md |
| Ogłoszenia, zadania, przypisania i statusy | docs/modules/tasks.md |
| Wydatki, podział kosztów i saldo | docs/modules/finances.md |
| Schemat MySQL, zapytania i migracje | docs/baza-danych.md |

Przykłady:
- Zmiana rozliczeń: docs/modules/finances.md i kod tej funkcji; architekturę tylko przy zmianie wspólnego API, bazę tylko przy zmianie zapisu danych.
- Zmiana dostępu do zadania: docs/modules/tasks.md i docs/modules/events.md; architekturę tylko przy zmianie wspólnej kontroli dostępu.
- Zmiana kontrolerów lub wspólnego API: docs/architecture.md i dokumenty funkcji, których trasy się zmieniają.

## Zasady pracy

- Stosuj KIS i DRY: wybieraj najprostsze rozwiązanie i nie kopiuj wspólnych reguł.
- Kontroler przyjmuje żądanie i przekazuje je do usługi modułu. Reguły funkcji należą do jej modułu; kontrolery korzystają ze wspólnej kontroli dostępu.
- Backend: NestJS + TypeScript. Baza: MySQL przez mysql2/promise, bez ORM. Używaj puli, parametryzowanych zapytań i transakcji dla wieloetapowych zapisów.
- Frontend nie łączy się z MySQL. Nie ufaj identyfikatorowi konta ani uprawnieniom przesłanym przez klienta.
- UUID generuje backend; numer użytkownika jest osobnym identyfikatorem do wyszukiwania kont.
- Aktualizuj tylko dokument będący źródłem prawdy dla zmienionej funkcji. Architektura i baza zmieniają się tylko przy zmianie ich zakresu.
- Zmiany schematu wprowadzaj wersjonowaną migracją; nie importuj ponownie pliku początkowego SQL.

## Stan projektu

Działa prototyp frontendowy React + TypeScript + Vite z danymi w localStorage. Konta, backend, API i połączenie z MySQL są planem, dopóki nie zostaną zaimplementowane.
