# Architektura

## Stan

Frontend React + TypeScript + Vite działa jako prototyp i zapisuje dane w localStorage. Backend, API, konta i połączenie z MySQL nie są jeszcze zaimplementowane. Docelowe technologie to NestJS + TypeScript oraz MySQL przez mysql2/promise, bez ORM.

## Wspólny przepływ żądania

    React → REST API /api/v1 → wspólne kontrole → kontroler funkcji
          → usługa funkcji → MySQL

Wspólna obsługa backendu odpowiada za:
1. Ustalenie konta na podstawie sesji.
2. Sprawdzenie dostępu do wskazanej wycieczki i wymaganej roli.
3. Walidację żądania i jednolity format błędów.
4. Udostępnienie połączenia z bazą; wieloetapowe zapisy są transakcyjne.

Kontroler mapuje trasę HTTP na operację usługi. Usługa stosuje reguły swojej funkcji i zapisuje dane. Kontrolery nie zawierają powielonej autoryzacji ani logiki biznesowej. Nie budujemy jednego kontrolera dla całej aplikacji ani osobnego systemu dostępu w każdym module.

## Kontrolery i odpowiedzialność modułów

| Kontroler | Zakres usługi |
|---|---|
| AuthController | Rejestracja, logowanie i wylogowanie |
| EventsController | Wycieczki, członkostwa i archiwizacja |
| AnnouncementsController | Ogłoszenia wycieczki |
| TasksController | Zadania, przypisania i statusy |
| FinancesController | Wydatki, udziały i saldo |

Kontrola członkostwa jest wspólna dla tras wycieczki. Wymagana rola zależy od czynności: przykładowo publikacja ogłoszenia wymaga organizatora, a zmiana statusu zadania przez uczestnika wymaga, by zadanie było przypisane do niego. Konkretne zasady są w dokumencie danej funkcji.

## Przykład: utworzenie zadania

Dla POST /api/v1/events/:eventId/tasks:

1. Serwer rozpoznaje konto z sesji.
2. Wspólna kontrola sprawdza członkostwo i rolę organizatora w eventId.
3. Walidacja sprawdza dane zadania. Usługa sprawdza, czy przypisany wykonawca należy do tej samej wycieczki.
4. TasksController przekazuje żądanie do TasksService.
5. Usługa zapisuje zadanie i przypisanie. Kontroler zwraca wynik.

Przy zmianie statusu wspólny dostęp jest sprawdzany ponownie. Uczestnik może zmienić status tylko przypisanego mu zadania.

## Główne trasy API

- POST /auth/register, POST /auth/login, POST /auth/logout
- GET/POST /events
- GET/PATCH /events/:eventId
- POST /events/:eventId/members
- POST /events/:eventId/archive
- GET/POST /events/:eventId/announcements
- GET/POST /events/:eventId/tasks
- PATCH /events/:eventId/tasks/:taskId
- GET/POST /events/:eventId/expenses

Każda trasa wycieczki działa w jej kontekście. Backend nie ufa userId ani roli przesłanej przez frontend. UUID generuje backend; numer użytkownika jest osobnym identyfikatorem wyszukiwawczym. Błędy API powinny mieć spójne odpowiedzi: 400 dla niepoprawnych danych, 401 dla braku logowania, 403/404 dla braku dostępu lub zasobu i 409 dla konfliktu unikatowości. Operacje zapisu powinny bezpiecznie obsługiwać ponowione żądania.

Szczegóły ról, zadań, finansów i schematu danych opisują dokumenty wskazane w README. Znajomi nie są częścią zatwierdzonego MVP.

