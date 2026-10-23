# Wspólne reguły i przepływy

Ten dokument zapisuje uzgodnione reguły produktu oraz oddziela je od funkcji, które dopiero trzeba wdrożyć. W tej chwili aplikacja pozostaje prototypem jednej przeglądarki: nie ma rejestracji, logowania, backendu ani współdzielonych danych. Role widoczne w prototypie nie zabezpieczają dostępu.

## Uzgodnione technologie i tożsamość

Frontend pozostaje React + TypeScript + Vite. Docelowy backend to NestJS + TypeScript, a dostęp do MySQL odbywa się przez `mysql2/promise`, bez Prismy i bez ORM.

Każda osoba zakłada konto przez rejestrację z e-mailem i hasłem. E-mail jest unikatowy. Backend nadaje przy rejestracji unikatowy i niezmienny numer użytkownika. Organizator dodaje do wydarzenia istniejące konto, podając jego numer. Hasła przechowuje się wyłącznie w formie bezpiecznego hasha. Format numeru, weryfikacja e-maila i mechanizm sesji pozostają do doprecyzowania przed wdrożeniem.

## Role i dostęp

| Czynność | Organizator | Uczestnik |
|---|---:|---:|
| Odczyt wydarzenia i ogłoszeń | Tak | Tak, jako członek |
| Edycja danych i archiwizacja wydarzenia | Tak | Nie |
| Dodawanie kont do wydarzenia i zarządzanie członkostwem/rolą | Tak | Nie |
| Publikowanie ogłoszeń | Tak | Nie |
| Tworzenie i przypisywanie zadań | Tak | Nie |
| Odczyt zadań | Tak | Tak, jako członek |
| Zmiana statusu zadania przypisanego tej osobie | Tak | Tak |
| Dodawanie wydatków i odczyt rozliczeń wydarzenia | Tak | Tak |

Każda operacja backendu sprawdza uwierzytelnienie, członkostwo i rolę. Samo ukrycie przycisku w React nie jest kontrolą dostępu. Wydarzenie musi mieć aktywnego organizatora; sposób przekazania roli ostatniego organizatora trzeba obsłużyć przed jego dezaktywacją.

## Przepływy

### Rejestracja i dodanie do wydarzenia

1. Osoba rejestruje e-mail, hasło i nazwę.
2. Backend zapisuje konto i nadaje mu unikatowy numer użytkownika.
3. Organizator podaje ten numer w formularzu dodawania członka.
4. Backend znajduje konto, sprawdza, czy nie jest już członkiem wydarzenia, i tworzy członkostwo z rolą uczestnika.

Dodawanie osób bez konta nie jest docelowym przepływem. Obecny import SQL dopuszcza pusty `user_id`, więc przed uruchomieniem rejestracji trzeba dodać migrację zgodną z tą regułą.

### Wydarzenie, zadania i ogłoszenia

Organizator tworzy wydarzenie i automatycznie otrzymuje członkostwo z rolą organizatora. Dodaje konta, publikuje ogłoszenia i tworzy/przypisuje zadania. Uczestnicy odczytują informacje i zmieniają status własnych zadań. Potwierdzenia odczytu i powiadomienia nie należą do MVP.

### Wydatki

Członek dodaje wydatek w PLN, wskazuje płatnika i uczestników podziału. Backend sprawdza członkostwo, dzieli kwotę równo i zapisuje wydatek z udziałami w transakcji. Saldo pokazuje proponowane rozliczenie; nie oznacza wykonanej płatności.

## Archiwizacja, członkostwo i historia

Wydarzenie archiwizuje się, zamiast usuwać je fizycznie. Członka można dezaktywować/oznaczyć jako odchodzącego; jego wcześniejsze zadania, wydatki i udziały pozostają. Nie można dezaktywować ostatniego organizatora bez wcześniejszego przekazania roli. Sposób usuwania lub anonimizacji konta użytkownika pozostaje do ustalenia.

Obecny schemat importowy nie ma pól archiwizacji i stanu członkostwa. Dodaj je migracją przed wdrożeniem tych przepływów; nie importuj ponownie pliku bootstrap.

## Walidacja, błędy i prywatność

- API waliduje wymagane pola i zwraca czytelne błędy bez ujawniania cudzych danych.
- Serwer sprawdza zasoby w kontekście wydarzenia przy każdym odczycie i zapisie.
- Nie zapisuj haseł w zwykłym tekście, nie umieszczaj sekretów w zmiennych `VITE_*` i nie łącz przeglądarki bezpośrednio z MySQL.
- Rejestracja, wydatki oraz pozostałe operacje mają być odporne na powtórne żądania i konflikty unikatowości.

## Nierozstrzygnięte szczegóły

Przed wdrożeniem doprecyzuj format numeru użytkownika, weryfikację e-maila, politykę sesji i odzyskiwania hasła, formaty odpowiedzi API, edycję/korekty wydatków, liczbę wykonawców zadania oraz procedurę anonimizacji usuwanego konta.
