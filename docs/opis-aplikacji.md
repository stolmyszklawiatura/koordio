# Opis aplikacji Koordio

## 1. Czym jest Koordio

Koordio pomaga grupie zaplanować wycieczkę i wspólnie prowadzić jej sprawy. W jednej przestrzeni członkowie mogą odczytywać informacje, wykonywać zadania i rozliczać wspólne wydatki.

Jedna osoba może należeć do wielu wycieczek. Jej rola zależy od konkretnej wycieczki: może organizować jedną i uczestniczyć w innej.

## 2. Stan aplikacji

Obecnie projekt zawiera prototyp frontendowy React + TypeScript + Vite. Pozwala testować lokalne wydarzenia, uczestników, ogłoszenia, zadania i rozliczenia. Dane trafiają do localStorage bieżącej przeglądarki.

Nie ma jeszcze działających kont, logowania, współdzielonych danych, backendu, API ani połączenia z MySQL. Poniższe funkcje opisują zatwierdzony kierunek rozwoju, a nie gotowy produkt.

## 3. Obszary i status funkcji

MVP oznacza zakres planowany do wdrożenia, nie funkcje już dostępne. W prototypie funkcje działają lokalnie w jednej przeglądarce; nie ma kont, synchronizacji ani backendu.

| Obszar | Działa w prototypie | Plan MVP |
|---|---|---|
| Konto | Brak rejestracji i logowania; profil jest demonstracyjny. | Rejestracja, logowanie i unikatowy numer użytkownika. |
| Wycieczki | Tworzenie, wybór i przechowywanie lokalnych wycieczek; można dodać lokalne osoby. | Wspólne wycieczki, konta uczestników, role i archiwizacja. |
| Ogłoszenia | Dodawanie i odczyt lokalnych ogłoszeń. | Publikacja organizatora i odczyt przez członków. |
| Zadania | Tworzenie, lokalne przypisanie jednej osoby i zmiana statusu. | Wspólne zadania; uczestnik zmienia status zadania przypisanego do siebie. |
| Rozliczenia | Lokalne wydatki, równy podział, saldo i sugerowane spłaty. | Wspólny zapis PLN i saldo; bez rejestrowania spłat. |
| Znajomi | Brak. | Poza zatwierdzonym MVP. |

Powiadomienia i płatności nie należą do MVP. Konto może mieć różne role w różnych wycieczkach. Znajomość nie daje dostępu do wycieczki.
## 4. Konta, wycieczki i role

- Konto oznacza jedną osobę w całym Koordio.
- Osoba może należeć do wielu wycieczek.
- Członkostwo łączy konto z konkretną wycieczką i określa rolę oraz stan dostępu.
- Rola nie jest przypisana na stałe do konta. W każdej wycieczce może być inna.
- Organizator tworzący wycieczkę automatycznie zostaje jej organizatorem.
- Organizator dodaje istniejące konto po jego unikatowym numerze użytkownika.
- Znajomi nie należą do zatwierdzonego MVP. Znajomość nie daje dostępu do wycieczki.

Przykład: Marta organizuje wycieczkę w góry, a w wyjeździe nad morze jest uczestniczką. To jedno konto i dwa osobne członkostwa z różnymi rolami.

## 5. Funkcje i uprawnienia

| Funkcja | Organizator | Uczestnik |
|---|---|---|
| Odczyt wycieczki i ogłoszeń | Tak | Tak |
| Edycja i archiwizacja wycieczki | Tak | Nie |
| Dodawanie członków i zarządzanie rolami | Tak | Nie |
| Publikowanie ogłoszeń | Tak | Nie |
| Tworzenie i przypisywanie zadań | Tak | Nie |
| Zmiana statusu zadania przypisanego do siebie | Tak | Tak |
| Dodawanie wydatków i odczyt rozliczeń | Tak | Tak |

**Ogłoszenia** przekazują informacje członkom wycieczki. W MVP publikuje je organizator.

**Zadania** mają opis, status i przypisanie do członka tej samej wycieczki. Statusy to: do zrobienia, w trakcie i zrobione. Prototyp obsługuje jednego wykonawcę; liczba wykonawców w docelowym kontrakcie wymaga ustalenia.

**Rozliczenia** obsługują PLN. Członek dodaje wydatek, wskazuje płatnika i osoby dzielące koszt. System dzieli kwotę równo, wylicza saldo i pokazuje sugerowane spłaty. Nie przesyła pieniędzy i nie zapisuje wykonanej spłaty.

## 6. Przykładowe działanie

### Utworzenie wycieczki i dodanie uczestnika

Organizator tworzy wycieczkę. System zapisuje ją i członkostwo organizatora. Organizator podaje numer istniejącego konta; system dodaje tę osobę jako uczestnika wyłącznie do tej wycieczki.

### Dodanie zadania

Organizator wybiera wycieczkę, wpisuje zadanie i wskazuje jej członka. System sprawdza dostęp i zapisuje zadanie z przypisaniem. Uczestnik może zmienić status zadania przypisanego do siebie.

### Dodanie wydatku

Członek dodaje kwotę w PLN, płatnika i osoby do podziału. System sprawdza, czy wszystkie te osoby należą do tej samej wycieczki, oblicza udziały w groszach i aktualizuje saldo.

## 7. Jak system ma działać technicznie

Docelowy stack:

- Frontend: React + TypeScript + Vite.
- Backend: NestJS + TypeScript.
- Baza: MySQL przez mysql2/promise, bez ORM.
- Komunikacja: REST API przez HTTPS, z prefiksem /api/v1.

Przepływ żądania:

    Interfejs → API → wspólne kontrole → kontroler funkcji
              → usługa funkcji → MySQL

Wspólne mechanizmy rozpoznają zalogowane konto, sprawdzają członkostwo i uprawnienia w wybranej wycieczce, walidują dane i zapewniają jednolitą obsługę błędów. Kontroler obsługuje trasę HTTP i przekazuje działanie do usługi. Usługa stosuje reguły swojej funkcji i zapisuje dane.

| Kontroler | Obsługiwana funkcja |
|---|---|
| AuthController | Rejestracja, logowanie i wylogowanie |
| EventsController | Wycieczki, członkostwa, role i archiwizacja |
| AnnouncementsController | Ogłoszenia |
| TasksController | Zadania, przypisania i statusy |
| FinancesController | Wydatki, udziały i saldo |

### Graf przepływu przez kontrolery

Poniższy model dotyczy docelowego backendu. Każda funkcja ma własny kontroler i usługę, ale żądania korzystają ze wspólnych kontroli.

~~~mermaid
flowchart TD
    UI["Interfejs Koordio"] --> API["REST API /api/v1"]
    API --> AUTH["Wspólne uwierzytelnienie"]
    AUTH --> ACCESS["Kontrola członkostwa i roli w wycieczce"]
    ACCESS --> VALIDATE["Walidacja danych"]
    VALIDATE --> ROUTE{"Kontroler funkcji"}
    ROUTE --> C1["AuthController"]
    ROUTE --> C2["EventsController"]
    ROUTE --> C3["AnnouncementsController"]
    ROUTE --> C4["TasksController"]
    ROUTE --> C5["FinancesController"]
    C1 --> S1["AuthService"]
    C2 --> S2["EventsService"]
    C3 --> S3["AnnouncementsService"]
    C4 --> S4["TasksService"]
    C5 --> S5["FinancesService"]
    S1 --> DB["mysql2/promise"]
    S2 --> DB
    S3 --> DB
    S4 --> DB
    S5 --> DB
    DB --> MYSQL["MySQL"]
~~~
Kontrolery korzystają ze wspólnych kontroli dostępu. Nie tworzymy jednego kontrolera z całą logiką ani osobnego systemu logowania i uprawnień dla każdej funkcji. Frontend nie łączy się bezpośrednio z MySQL; sekrety pozostają po stronie serwera.

## 8. Dane i historia

Główne powiązania danych:

    users → event_memberships → events
                                  ├── announcements
                                  ├── tasks → task_assignees
                                  └── expenses → expense_shares

Wszystkie elementy funkcji są przypisane do wycieczki. Autor ogłoszenia, autor i wykonawca zadania, płatnik oraz osoby dzielące koszt muszą mieć członkostwo w tej samej wycieczce.

Wycieczki archiwizujemy zamiast usuwać. Członkostwo można dezaktywować, ale zachowujemy powiązaną historię zadań i finansów. Ostatni aktywny organizator musi przekazać rolę przed odejściem.

## 9. Rozszerzanie aplikacji

Nowa funkcja powinna wykorzystywać wspólne konto, kontrolę dostępu do wycieczki, walidację i zapis danych. Dodaje własny kontroler oraz usługę tylko wtedy, gdy potrzebuje nowych tras i reguł.

Przykładowo przyszła lista zakupów należałaby do konkretnej wycieczki. Jej kontroler używałby tych samych kontroli członkostwa co zadania i wydatki; własna usługa obsługiwałaby wyłącznie zasady listy zakupów.

Zasady KIS i DRY:

- Jedno konto na osobę; rola zależy od członkostwa w wycieczce.
- Jedna wspólna kontrola logowania i dostępu.
- Reguły funkcji zapisujemy w jej module, a nie kopiujemy między modułami.
- Nową funkcję dodajemy dopiero po ustaleniu jej zakresu, danych i uprawnień.

## 10. Poza zakresem MVP i otwarte decyzje

Poza MVP są: system znajomych, płatności i rejestrowanie spłat, głosowania, kalendarz, przypomnienia, czat, punktacja i PWA.

Przed wdrożeniem trzeba ustalić format numeru użytkownika, weryfikację e-maila i politykę sesji, liczbę wykonawców zadania, korekty wydatków oraz zasady usuwania lub anonimizacji konta. Nie należy przedstawiać tych decyzji jako już wdrożonych.

## 11. Gdzie znaleźć szczegóły

- README — krótki wstęp, stan projektu i uruchomienie prototypu.
- AGENTS.md — mapa dokumentacji dla agenta.
- docs/architecture.md — kontrolery, przepływ API i granice techniczne.
- docs/modules/events.md — konta, członkostwa, role i archiwizacja.
- docs/modules/tasks.md — ogłoszenia i zadania.
- docs/modules/finances.md — wydatki i obliczanie salda.
- docs/baza-danych.md — MySQL, schemat i migracje.


