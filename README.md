# Koordio

Koordio ma pomóc znajomym, harcerzom i innym społecznościom wspólnie organizować wydarzenia. Każde wydarzenie skupia uczestników, role, ogłoszenia, zadania i rozliczenia. Interfejs prototypu działa na komputerze i telefonie.

## Co działa teraz

Projekt zawiera frontend React + TypeScript + Vite. Prototyp pozwala utworzyć wydarzenie, dodać uczestników, publikować lokalne ogłoszenia, tworzyć i przypisywać zadania, zmieniać ich status oraz wprowadzać wydatki i oglądać sugerowane rozliczenie. Dane demonstracyjne i zmiany trafiają do `localStorage` bieżącej przeglądarki; nie są współdzielone między kontami ani urządzeniami.

MySQL wybrano jako docelową bazę, a początkowy schemat znajduje się w `koordio_mysql.sql` i został zaimportowany przez użytkownika. Sam frontend nie łączy się z tą bazą. Repozytorium nie zawiera backendu, API, rejestracji ani logowania.

## Ustalone dla dalszego rozwoju

- Frontend: React + TypeScript + Vite.
- Backend: NestJS + TypeScript.
- Dostęp do MySQL: bez ORM, przez `mysql2/promise`, pulę połączeń i parametryzowane zapytania.
- Rejestracja konta przez e-mail i hasło. Backend nadaje każdemu kontu unikatowy numer użytkownika; organizator dodaje istniejące konto do wydarzenia przez ten numer.
- Role wydarzenia: organizator i uczestnik. Szczegóły uprawnień: `docs/reguly-i-przeplywy.md`.
- Rozliczenia MVP: PLN, równy podział wybranym uczestnikom, prezentacja sugerowanych spłat bez rejestrowania wpłaty.
- Wydarzenia archiwizujemy, a członkostwo dezaktywujemy. Zachowujemy historię zadań i finansów.

Zaakceptowane rozwiązania są planem, a nie aktualną funkcjonalnością.

## MVP

1. Rejestracja i logowanie.
2. Tworzenie wydarzenia i dodawanie istniejących kont po unikatowym numerze użytkownika.
3. Zarządzanie rolami organizatora i uczestnika.
4. Ogłoszenia i zadania w obrębie wydarzenia.
5. Wspólne wydatki w PLN, równy podział kosztu i sugerowane rozliczenie.
6. Wspólne dane obsługiwane przez API oraz MySQL.
7. Responsywny interfejs, walidacja i obsługa błędów.

## Po MVP

Głosowania nad terminami, kalendarz i przypomnienia, rozbudowane podgrupy i role, wizualizacja postępu, historia aktywności, czat przy zadaniach, punktacja oraz PWA. To możliwe kierunki rozwoju, nie część zatwierdzonego MVP.

## Uruchomienie frontendu

Wymagane Node.js i npm. Skrypty są w `package.json`: `npm run dev`, `npm run build`, `npm run lint`, `npm run preview`. Uruchomienie frontendu nie uruchamia backendu ani nie sprawdza połączenia z MySQL.

## Dokumentacja

- `AGENTS.md` — zasady pracy i wybór kontekstu.
- `docs/architecture.md` — aktualna architektura i docelowy przepływ API.
- `docs/baza-danych.md` — stan MySQL, model danych, rejestracja i migracje.
- `docs/reguly-i-przeplywy.md` — zatwierdzone role, przepływy i polityka archiwizacji.
- `docs/modules/events.md` — wydarzenia, członkostwa i role.
- `docs/modules/tasks.md` — ogłoszenia i zadania.
- `docs/modules/finances.md` — wydatki i rozliczenia.
