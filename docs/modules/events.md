# Wydarzenia, uczestnicy i role

## Cel i stan prototypu

Wydarzenie jest osobną przestrzenią Koordio. Zawiera uczestników, ogłoszenia, zadania i rozliczenia. Ten obszar jest właścicielem członkostwa i ról.

Obecny frontend pozwala tworzyć wydarzenie i dodawać lokalnych uczestników. Dane są zapisywane wyłącznie w `localStorage` przeglądarki. Konta, rejestracja, numer użytkownika, współdzielenie i backend nie są jeszcze zaimplementowane.

## Uzgodniony przepływ docelowy

- Użytkownik rejestruje konto przez e-mail i hasło. Backend nadaje mu unikatowy numer użytkownika.
- Organizator tworzy wydarzenie i zostaje jego pierwszym członkiem z rolą organizatora.
- Organizator dodaje istniejące konto przez numer użytkownika. Konto może należeć do wydarzenia tylko raz.
- Role MVP: `organizator` i `uczestnik`.
- Organizator edytuje i archiwizuje wydarzenie oraz zarządza członkami i ich rolami.
- Uczestnik przegląda wydarzenie i wykonuje dozwolone działania opisane w `docs/reguly-i-przeplywy.md`.

Numer użytkownika służy do wyszukania konta; nie jest identyfikatorem technicznym. Powiązania w bazie używają UUID.

## Archiwizacja i zachowanie historii

Wydarzenie archiwizujemy; w MVP nie usuwamy go fizycznie. Członkostwo można dezaktywować, ale wcześniejsze przypisania zadań i rozliczenia muszą pozostać. Ostatni aktywny organizator musi przekazać rolę przed odejściem. Szczegóły anonimizacji konta są jeszcze otwarte.

Zaimportowany SQL nie ma jeszcze `user_number`, hasha hasła, stanu członkostwa ani archiwizacji wydarzenia. Dodaj migrację przed wdrożeniem rejestracji i tych przepływów. Nie korzystaj z pustego `user_id` dla docelowych członków zalogowanej aplikacji.

## Zależności i kontrola spójności

Zadania, ogłoszenia i rozliczenia wskazują członka tego samego wydarzenia. Backend w każdym żądaniu sprawdza powiązanie, rolę i stan członkostwa. Zmiana/dezaktywacja członka wymaga zachowania historii i sprawdzenia powiązanych modułów.

Aktualizuj ten dokument przy zmianie modelu członkostwa, ról, rejestracji lub cyklu życia wydarzenia.
