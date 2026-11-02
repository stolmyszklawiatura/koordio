# Architektura i działanie Koordio

## Stan projektu

Koordio jest obecnie prototypem frontendowym React + TypeScript + Vite. Interfejs pozwala testować wycieczki, uczestników, ogłoszenia, zadania i wydatki. Dane są zapisywane w localStorage jednej przeglądarki.

Nie ma jeszcze kont, logowania, API, kontrolerów backendu ani połączenia z MySQL. Poniższy model opisuje docelowe działanie, a nie gotową funkcjonalność.

## Model aplikacji

Konto oznacza osobę w całym Koordio. Konto może należeć do wielu wycieczek. Rola nie jest globalna: jest przypisana do członkostwa w konkretnej wycieczce. Ta sama osoba może być organizatorem jednej wycieczki i uczestnikiem innej.

    Konto użytkownika
    ├── członkostwo w wycieczce A: organizator
    ├── członkostwo w wycieczce B: uczestnik
    └── członkostwo w wycieczce C: uczestnik

    Wycieczka
    ├── członkowie i ich role
    ├── ogłoszenia
    ├── zadania i przypisania
    └── wydatki i udziały

Każde ogłoszenie, zadanie i wydatek należy do jednej wycieczki. Każdy autor, wykonawca, płatnik i uczestnik podziału kosztu musi być członkiem tej samej wycieczki.

System znajomych nie jest zatwierdzony w MVP ani opisany w obecnym modelu danych. Jeśli zostanie dodany, relacja znajomości będzie niezależna od członkostwa. Bycie znajomym nie daje dostępu do wycieczki.

## Podział backendu

Backend docelowo używa NestJS. Każdy moduł odpowiada za jedną dziedzinę aplikacji i ma kontroler przyjmujący żądania oraz usługę wykonującą reguły tej dziedziny.

    Żądanie HTTP
       ↓
    Wspólne mechanizmy
    ├── uwierzytelnienie konta
    ├── sprawdzenie członkostwa i roli w wycieczce
    ├── walidacja danych i wspólna obsługa błędów
    └── połączenie z bazą i transakcje
       ↓
    Kontroler właściwego modułu
    ├── AccountsController → AccountsService
    ├── EventsController → EventsService
    ├── AnnouncementsController → AnnouncementsService
    ├── TasksController → TasksService
    └── FinancesController → FinancesService
       ↓
    MySQL przez mysql2/promise

Kontroler wybiera operację na podstawie trasy, przekazuje konto, identyfikator wycieczki i sprawdzone dane do usługi, a następnie zwraca odpowiedź API. Nie powinien sam zawierać zasad biznesowych ani zapytań SQL.

Wspólne mechanizmy są używane przez kontrolery wszystkich funkcji. Nie tworzymy osobnego logowania, sprawdzania uprawnień ani obsługi błędów dla każdego modułu. Jednocześnie nie tworzymy jednego kontrolera, który zawiera całą aplikację: kontrolery pozostają przypisane do zasobów, a reguły wspólne są współdzielone.

## Kto może wykonać działanie

Uprawnienia dotyczą członkostwa w wybranej wycieczce. Szczegółowa macierz jest w [regułach i przepływach](reguly-i-przeplywy.md).

- Organizator tworzy i edytuje wycieczkę, zarządza członkami, publikuje ogłoszenia oraz tworzy i przypisuje zadania.
- Uczestnik odczytuje wycieczkę i ogłoszenia oraz zmienia status zadania przypisanego do siebie.
- Organizator i uczestnik mogą dodawać wydatki oraz odczytywać rozliczenia wycieczki.
- Serwer sprawdza uprawnienia przy każdym żądaniu. Widoczność lub ukrycie przycisku w interfejsie nie jest zabezpieczeniem.

## Przykład: utworzenie i odczyt zadania

Dla żądania POST /api/v1/events/123/tasks:

1. Wspólne uwierzytelnienie ustala konto z sesji. Serwer nie ufa userId przesłanemu przez przeglądarkę.
2. Kontrola dostępu sprawdza członkostwo konta w wycieczce 123 i wymaganą rolę organizatora.
3. Walidacja sprawdza treść i termin zadania. Serwer sprawdza też, czy przypisana osoba należy do tej samej wycieczki.
4. TasksController przekazuje sprawdzone dane do TasksService.
5. Usługa zapisuje zadanie i przypisanie w MySQL, po czym kontroler zwraca utworzone zadanie.

Przy zmianie statusu serwer ponownie sprawdza dostęp. Organizator może zmienić status, a uczestnik — tylko zadania przypisanego do siebie.

## Przykład: dodanie wydatku

Każdy członek może dodać wydatek do swojej wycieczki. FinancesController przekazuje go do FinancesService. Usługa sprawdza, czy płatnik i osoby dzielące koszt należą do tej samej wycieczki, wylicza równy podział w całych groszach i zapisuje wydatek z udziałami w jednej transakcji. Saldo oznacza sugerowane rozliczenie; MVP nie zapisuje wykonanej spłaty.

## Utworzenie wycieczki i dodanie osoby

Przy tworzeniu wycieczki serwer zapisuje wycieczkę i członkostwo twórcy z rolą organizatora. Organizator dodaje istniejące konto przez jego unikatowy numer użytkownika. Serwer tworzy członkostwo z rolą uczestnika. To członkostwo dotyczy tylko wybranej wycieczki.

## Technologie i granice

    React → HTTPS /api/v1 → NestJS → mysql2/promise → MySQL

Frontend nie łączy się bezpośrednio z bazą. Hasła i sekrety nie trafiają do przeglądarki. Backend używa parametryzowanych zapytań. Wiele zapisów składających się na jedną operację, np. wydatek i jego udziały, wykonuje w transakcji.

- Backend: NestJS + TypeScript.
- Baza: MySQL.
- Dostęp do bazy: mysql2/promise, pula połączeń, execute() z parametrami; bez ORM.
- API: REST, JSON, prefiks /api/v1.
- Identyfikatory techniczne: UUID generowane przez backend. Numer użytkownika jest osobnym identyfikatorem do wyszukiwania kont.

## Główne trasy API

- Konta: POST /auth/register, POST /auth/login, POST /auth/logout.
- Wycieczki: GET/POST /events, GET/PATCH /events/:eventId, POST /events/:eventId/members, POST /events/:eventId/archive.
- Ogłoszenia: GET/POST /events/:eventId/announcements.
- Zadania: GET/POST /events/:eventId/tasks, PATCH /events/:eventId/tasks/:taskId.
- Wydatki: GET/POST /events/:eventId/expenses.

Każda trasa dotycząca wycieczki działa w kontekście jej identyfikatora i sprawdza członkostwo. Dokładne formaty sesji i danych API należy ustalić podczas wdrażania.

## Historia i archiwizacja

Wycieczkę archiwizujemy zamiast usuwać. Członkostwo można dezaktywować, ale wcześniejsze zadania i finanse pozostają. Wycieczka musi mieć aktywnego organizatora; ostatni organizator musi przekazać rolę przed odejściem.

## Powiązane dokumenty

- [README](../README.md) — krótki opis projektu, stan i MVP.
- [Reguły i przepływy](reguly-i-przeplywy.md) — uprawnienia oraz zasady produktu.
- [Baza danych](baza-danych.md) — encje, MySQL i migracje.
- [Moduły](modules/events.md) — wycieczki; [zadania](modules/tasks.md); [rozliczenia](modules/finances.md).
