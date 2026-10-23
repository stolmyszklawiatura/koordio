# Baza danych i dostęp do danych

## Stan obecny

MySQL został wybrany i użytkownik zaimportował początkowy schemat z `koordio_mysql.sql`. Aplikacja nie łączy się jeszcze z bazą: repozytorium nie zawiera backendu, konfiguracji połączenia ani klienta MySQL. Prototyp nadal zapisuje dane w `localStorage` przeglądarki.

## Zatwierdzony kierunek

- Baza: MySQL.
- Backend: NestJS + TypeScript.
- Dostęp do danych: bez ORM, przez `mysql2/promise`, pulę połączeń i `execute()` z parametrami.
- Migracje SQL przechowywane w repozytorium; nie importuj ponownie pliku bootstrap do aktualnej bazy.
- Sekrety MySQL tylko w środowisku serwera. Przeglądarka nie łączy się bezpośrednio z bazą.

## Model docelowy

| Encja | Dane i zasady |
|---|---|
| `users` | Konto z e-mailem, hashem hasła, nazwą i unikatowym numerem użytkownika generowanym przy rejestracji. E-mail i numer muszą być unikatowe. Hasło nigdy nie jest przechowywane w zwykłym tekście. |
| `events` | Wydarzenie z twórcą/organizatorem, nazwą, opisem, miejscem i opcjonalną datą. Właściciel staje się członkiem z rolą organizatora. |
| `event_memberships` | Powiązanie konta z wydarzeniem oraz rolą `organizer` lub `participant`. Do jednego wydarzenia konto może dołączyć tylko raz. Członkostwo jest dezaktywowane, nie kasowane z historią. |
| `announcements` | Ogłoszenie wydarzenia z autorem-członkiem. Tworzy je organizator; uczestnicy je odczytują. |
| `tasks` | Zadanie z wydarzeniem, autorem, opisem, terminem i statusem `todo`, `in_progress` albo `done`. |
| `task_assignees` | Powiązanie zadania z członkami tego samego wydarzenia. Prototyp obsługuje jednego wykonawcę; liczba wykonawców w MVP wymaga doprecyzowania przy DTO. |
| `expenses` | Wydatek w PLN z płatnikiem i kwotą w groszach. |
| `expense_shares` | Udział każdego wskazanego członka w wydatku; suma udziałów musi równać się kwocie wydatku. |

Wszystkie UUID generuje backend. Numer użytkownika jest oddzielny od UUID i służy do wyszukania istniejącego konta przy dodawaniu do wydarzenia.

## Różnice między importem a decyzjami

Zaimportowany schemat jest tylko punktem startowym. Nie zawiera jeszcze kolumny `users.user_number` ani hasha hasła; członkostwo dopuszcza `user_id = NULL`; nie ma też pól stanu członkostwa i archiwizacji wydarzenia. Przed rejestracją i podłączeniem aplikacji przygotuj migrację, która doda potrzebne pola i ograniczenia. Nie uruchamiaj ponownie `koordio_mysql.sql` jako sposobu aktualizacji.

Dokładny format numeru użytkownika, mechanizm sesji oraz sposób usuwania/anonymizacji konta pozostają do decyzji. Numer generuje serwer w sposób odporny na równoczesne rejestracje i niezmienny po nadaniu.

## Bezpieczny dostęp

```text
React → HTTPS API → NestJS: sesja, walidacja i uprawnienia → mysql2/promise → MySQL
```

- Skonfiguruj ograniczoną pulę połączeń; nie używaj konta `root` aplikacji.
- Parametryzuj wszystkie wartości SQL przez `execute(sql, values)`. Nazw kolumn/tabel nie da się bezpiecznie przekazać jako zwykłych parametrów — wybieraj je wyłącznie z kodu backendu.
- Każde żądanie sprawdza zalogowane konto, członkostwo i rolę w konkretnym `event_id`.
- Nie ufaj `userId`, kwotom, rolom ani listom członków przysłanym przez klienta. Serwer ponownie je waliduje.
- Zapis wydatku i wszystkich udziałów wykonuj w jednej transakcji. Serwer sprawdza, czy wszystkie osoby są członkami wydarzenia oraz czy udziały sumują się do całości.
- W bazie używaj InnoDB i kluczy obcych. Brak `ON DELETE CASCADE` chroni powiązaną historię przed automatycznym usunięciem.

## Kwoty, czas i retencja

- Finanse MVP obsługują wyłącznie PLN. Kwoty to całkowite grosze, bez arytmetyki zmiennoprzecinkowej.
- Koszt dzielimy równo między wybrane osoby. Resztę groszową rozdziela się po jednym groszu zgodnie z kolejnością uczestników przekazaną do operacji.
- Użytkownicy widzą saldo i sugerowane transfery. System nie rejestruje spłat i nie przesyła pieniędzy.
- Wydarzenie archiwizujemy; nie kasujemy go fizycznie w MVP. Członkostwo można oznaczyć jako nieaktywne, zachowując powiązane zadania i finanse.
- Daty zapisu backend obsługuje w UTC; wyświetlanie formatuje frontend.

## Migracje

Każda późniejsza zmiana schematu trafia do wersjonowanego pliku SQL. Zmianę najpierw sprawdź lokalnie, potem zaktualizuj tę dokumentację i odpowiednie moduły. Przed produkcją ustal kopie zapasowe, retencję, odtwarzanie i ograniczone prawa konta aplikacji.
