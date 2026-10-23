# Baza danych i dostęp do danych

## Stan i rekomendacja

Obecny projekt to wyłącznie frontend React + TypeScript + Vite. Nie ma serwera, bazy, danych trwałych ani API. Żadna strona lub komponent przeglądarkowy nie może więc obecnie wykonywać rzeczywistego zapisu danych.

**Propozycja do decyzji:** PostgreSQL jako relacyjna baza danych. Pasuje do powiązań między wydarzeniami, członkami, zadaniami i udziałami w kosztach. Baza, dostawca hostingu, ORM i biblioteka walidacji nie zostały zatwierdzone. Nie dodawaj ich bez decyzji i zadania implementacyjnego.

## Bezpieczna ścieżka dostępu

Gdy powstanie backend, rekomendowany przepływ wygląda tak:

```text
Przeglądarka (React)
    → HTTPS API
    → uwierzytelnienie użytkownika
    → sprawdzenie członkostwa i uprawnień dla event_id
    → logika modułu i walidacja danych
    → warstwa dostępu do danych po stronie serwera
    → baza danych
```

- Przeglądarka nie łączy się bezpośrednio z bazą i nie otrzymuje hasła ani uprzywilejowanego klucza.
- Sekrety bazy przechowuj wyłącznie w konfiguracji środowiska serwera. Zmienne `VITE_*` są wbudowywane do kodu klienta i nie nadają się na sekrety.
- Każde żądanie serwera uwierzytelnia użytkownika, waliduje treść i sprawdza członkostwo/rolę dla wskazanego wydarzenia.
- Każde zapytanie do zasobu wydarzenia ogranicz przez `event_id` oraz członkostwo. Nie pobieraj najpierw rekordu wyłącznie po jego ID, a potem nie polegaj na tym, że interfejs ukrył niedostępny przycisk.
- Używaj parametryzowanych zapytań lub bezpiecznego ORM. Nie sklejaj SQL z danymi użytkownika.
- Odpowiedź API zawiera tylko pola potrzebne klientowi. Nie wysyłaj sekretów, danych uwierzytelniających ani zbędnych danych osobowych.

To docelowa zasada, a nie opis istniejącego kodu. Obecny frontend nie może symulować, że zapis lokalny jest już trwałym zapisem w bazie.

## Proponowany model pojęciowy

Poniższe encje to punkt wyjścia do projektu schematu. Nazwy tabel, pola i typy nie są zatwierdzone.

| Encja | Rola i kluczowe relacje |
|---|---|
| `users` | Konto osoby; może należeć do wielu wydarzeń. Minimalizuj przechowywane dane osobowe. |
| `events` | Wydarzenie z właścicielem/organizatorem i podstawowymi informacjami. |
| `event_memberships` | Łączy `users` z `events`; przechowuje rolę i ewentualny stan członkostwa. Unikalność pary wydarzenie–użytkownik. |
| `event_groups` | Opcjonalne podgrupy w wydarzeniu; wdrażaj dopiero po potwierdzeniu zakresu. |
| `announcements` | Treść ogłoszenia oraz autor i wydarzenie. Potwierdzenia odczytu, jeśli kiedyś będą potrzebne, powinny być osobną relacją użytkownik–ogłoszenie. |
| `tasks` | Treść, status, wydarzenie i autor. |
| `task_assignees` | Relacja zadania do jednego lub wielu członków wydarzenia; decyzja o wielu wykonawcach pozostaje otwarta. |
| `expenses` | Wydatek, wydarzenie, płatnik, kwota i waluta. |
| `expense_shares` | Udział członka wydarzenia w konkretnym wydatku. Pozwala zachować historię wejściowych wyliczeń. |

Nie twórz tabel zaproszeń, płatności, historii aktywności ani potwierdzeń ogłoszeń, dopóki te funkcje nie wejdą do uzgodnionego zakresu. Kalkulacja salda nie oznacza transferu pieniędzy. Wpis `settlements` byłby potrzebny dopiero po decyzji, że aplikacja rejestruje faktyczne spłaty.

## Integralność danych

- Używaj kluczy obcych dla relacji oraz ograniczeń unikalności dla członkostwa w wydarzeniu i innych rzeczywiście unikalnych par.
- Sprawdzaj, czy autor, płatnik, wykonawca i odbiorca są członkami tego samego wydarzenia co dany zasób. Sama zgodność typów TypeScript tego nie gwarantuje.
- Operacje wieloetapowe zapisuj w transakcji. Przykład: utworzenie wydatku i wszystkich jego udziałów powinno zakończyć się w całości albo wcale.
- Waliduj granice kwot, długości tekstu i wymagane pola na granicy API oraz wzmacniaj je ograniczeniami bazy, gdy to możliwe.
- Nie kasuj kaskadowo historii finansowej po usunięciu członkostwa. Preferuj stan nieaktywny/archiwalny, ale dokładna polityka usuwania wymaga decyzji produktowej.
- Dodawaj indeksy dopiero dla uzasadnionych zapytań; prawdopodobne kandydaty to członkostwo po `user_id`, zasoby po `event_id` i zadania po statusie/wykonawcy.

## Kwoty i daty

- Nie używaj binarnych liczb zmiennoprzecinkowych JavaScript do pieniędzy.
- **Propozycja:** przechowuj kwoty jako liczbę całkowitą w najmniejszej jednostce waluty, np. groszach, wraz z kodem waluty. Przed implementacją zatwierdź obsługiwane waluty, dokładność i zasady zaokrągleń.
- Przechowuj chwile jako daty z jednoznacznym odniesieniem do UTC; strefę lokalną wydarzenia ustal jako osobną regułę. Jej wybór wpływa na wyświetlanie i terminy.

## Migracje, środowiska i kopie

- Zmiany schematu wprowadzaj wersjonowanymi migracjami w repozytorium, nie ręcznymi poprawkami produkcyjnej bazy.
- Rozdziel środowiska lokalne, testowe i produkcyjne; nigdy nie używaj produkcyjnych danych osobowych w testach.
- Sekrety nie trafiają do Gita. Ogranicz prawa konta aplikacji do wymaganych operacji i rotuj dane dostępowe po ujawnieniu.
- Przed uruchomieniem produkcyjnym ustal szyfrowanie połączeń, kopie zapasowe, retencję, odtwarzanie oraz monitoring błędów.
- Logi nie powinny zawierać haseł, tokenów, pełnych danych płatniczych ani niepotrzebnej treści prywatnej.

## Decyzje przed implementacją

1. PostgreSQL czy inna baza oraz gdzie będzie hostowana?
2. Jaki backend i ORM/klient bazy będą używane?
3. Jak działa logowanie i skąd serwer bierze zaufaną tożsamość użytkownika?
4. Czy użytkownik może mieć wiele ról lub wiele podgrup w wydarzeniu?
5. Czy zadanie ma jednego, czy wielu wykonawców?
6. Jakie waluty, podział i reguły zaokrągleń obsługuje kalkulator?
7. Co oznacza usunięcie wydarzenia, użytkownika lub członkostwa dla historii?

Po zatwierdzeniu decyzji zaktualizuj ten plik i odpowiednie dokumenty modułów, zaprojektuj migracje oraz testy dostępu i integralności. Do tego czasu traktuj schemat i PostgreSQL wyłącznie jako propozycję.

