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
| Krótki opis projektu, stan prototypu, uruchomienie | `README.md` |
| Kontrolery, wspólny przepływ, API, granice modułów | `docs/architecture.md` |
| Konta, wiele wycieczek, członkostwa, role, archiwizacja | `docs/modules/events.md` |
| Ogłoszenia, zadania, przypisania i statusy | `docs/modules/tasks.md` |
| Wydatki, podział kosztów, salda i sugerowane rozliczenia | `docs/modules/finances.md` |
| Schemat MySQL, zapytania, migracje i bezpieczeństwo danych | `docs/baza-danych.md` |

Przykłady:
- Zmiana sposobu liczenia kosztu, salda lub API paliw w rozliczeniach: dokument rozliczeń i kod tej funkcji; architektura tylko przy zmianie wspólnego API, baza tylko przy zmianie zapisu danych.
- Zmiana dostępu uczestnika do zadania: dokument zadań i dokument wycieczek; architektura tylko wtedy, gdy zmienia się wspólny mechanizm kontroli dostępu.
- Zmiana kontrolerów lub wspólnego API: architektura oraz dokumenty funkcji, których trasy się zmieniają.

## Zasady pracy

- Stosuj KIS i DRY: najprostsze rozwiązanie, wspólna reguła zapisana i zaimplementowana w jednym miejscu.
- Kontroler przyjmuje żądanie i przekazuje je do usługi modułu. Reguły funkcji należą do jej modułu; kontrolery nie powinny kopiować wspólnych kontroli dostępu.
- Backend: NestJS + TypeScript. Baza: MySQL przez mysql2/promise, bez ORM. Używaj puli, parametryzowanego execute() i transakcji dla wieloetapowych zapisów.
- Frontend nie łączy się z MySQL. Nie ufaj identyfikatorowi konta ani uprawnieniom przysłanym przez klienta.
- UUID generuje backend; numer użytkownika jest osobnym identyfikatorem do wyszukiwania kont.
- Aktualizuj tylko dokument będący źródłem prawdy dla zmienionej funkcji. Zmień też architekturę lub bazę wyłącznie przy zmianie ich zakresu. Nie kopiuj pełnych reguł do README.
- Zmian schematu wprowadzaj wersjonowaną migracją; nie importuj ponownie pliku początkowego SQL.

## Stan projektu

Działa prototyp frontendowy React + TypeScript + Vite z danymi w localStorage. Konta, backend, kontrolery i połączenie z MySQL są planem, dopóki nie zostaną zaimplementowane.

