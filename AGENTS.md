# Instrukcje dla agentów AI

## Cel i aktualny stan

Koordio pomaga grupom organizować wydarzenia, uczestników, ogłoszenia, zadania i wspólne rozliczenia. Repozytorium zawiera działający prototyp frontendowy React + TypeScript + Vite. Dane demonstracyjne są przechowywane w `localStorage` jednej przeglądarki. W projekcie nie ma jeszcze backendu, rejestracji, logowania ani połączenia z zaimportowaną bazą MySQL.

## Zatwierdzone decyzje projektowe

- Frontend pozostaje React + TypeScript + Vite.
- Docelowy backend: NestJS w TypeScript.
- Baza: MySQL. Dostęp z backendu będzie realizowany bez ORM, przez `mysql2/promise`, pulę połączeń i parametryzowane zapytania.
- Użytkownik rejestruje się e-mailem i hasłem. Przy rejestracji otrzymuje unikatowy numer użytkownika, którym można dodać jego konto do wydarzenia.
- Role w wydarzeniu: organizator i uczestnik. Zatwierdzona macierz jest w `docs/reguly-i-przeplywy.md`.
- Finanse MVP: PLN, równy podział wydatku na wskazane osoby, wyświetlanie sugerowanych rozliczeń bez rejestrowania spłaty.
- Wydarzenia i członkostwa archiwizujemy/dezaktywujemy; nie usuwamy fizycznie historii powiązanej z zadaniami lub finansami.

## Wybór kontekstu

Zacznij od tego pliku i otwórz tylko dokumenty potrzebne do zadania:

| Zadanie | Dokument |
|---|---|
| Struktura, granice modułów, frontend/backend i API | `docs/architecture.md` |
| Rejestracja, MySQL, model danych, migracje i dostęp do bazy | `docs/baza-danych.md` |
| Wspólne przepływy, role, prywatność i archiwizacja | `docs/reguly-i-przeplywy.md` |
| Wydarzenia, konta uczestników i role | `docs/modules/events.md` |
| Ogłoszenia, zadania i przypisania | `docs/modules/tasks.md` |
| Wydatki, podział kosztów i salda | `docs/modules/finances.md` |
| Zakres MVP i funkcje przyszłe | `README.md` |

## Zasady pracy

1. Najpierw sprawdź kod i pakiety. Opis docelowy nie oznacza, że funkcja jest już zaimplementowana.
2. Wyraźnie rozdzielaj stan prototypu od zatwierdzonych planów. Nie przedstawiaj połączenia MySQL, logowania ani współdzielenia danych jako działających.
3. W backendzie grupuj kod NestJS według funkcji. Nie dodawaj warstw `shared`, repozytoriów lub innych katalogów bez uzasadnienia.
4. Frontend nigdy nie łączy się bezpośrednio z MySQL. Sekrety pozostają wyłącznie po stronie backendu.
5. Przy dostępie do MySQL używaj `mysql2/promise`, puli i `execute()` z parametrami. Nie sklejaj zapytań z danymi użytkownika. Wieloetapowe zapisy wykonuj w transakcjach.
6. UUID generuje backend. Unikatowy numer użytkownika jest osobnym identyfikatorem do wyszukiwania kont i nie zastępuje UUID.
7. Po zmianie reguł, modelu lub zachowania aktualizuj odpowiednie dokumenty i testy. Sprawdź wpływ na zależne moduły.
8. Nie uruchamiaj zmian schematu na bazie bez osobnego zadania i migracji. `koordio_mysql.sql` jest plikiem początkowego importu, nie mechanizmem aktualizacji istniejącej bazy.
