# Architektura i granice funkcji

## Co istnieje teraz

Repozytorium zawiera wyłącznie frontend React + TypeScript + Vite. Aplikacja startuje w `src/main.tsx`, główny ekran i składanie widoków są w `src/App.tsx`, style globalne w `src/index.css`, a funkcje w `src/funkcje/`. Dane są trzymane w `localStorage` bieżącej przeglądarki.

W projekcie nie ma backendu, endpointów, modułu rejestracji, klienta MySQL ani konfiguracji połączenia. Zaimportowana baza nie jest używana przez aplikację.

## Docelowy, zatwierdzony kierunek

Frontend React + Vite komunikuje się po HTTPS z backendem NestJS napisanym w TypeScript. Backend łączy się z MySQL przez `mysql2/promise`; nie używamy Prismy ani innego ORM. Sekrety połączenia są tylko w środowisku backendu.

```text
Przeglądarka
  → REST API /api/v1
  → NestJS: uwierzytelnienie, walidacja i kontrola roli/członkostwa
  → mysql2/promise: parametryzowane zapytania i transakcje
  → MySQL
```

Do backendu należy dodać minimalny katalog `backend/` i moduły według funkcji: konta, wydarzenia, ogłoszenia, zadania, rozliczenia. Nie twórz osobnego `shared/` ani innych pustych warstw. NestJS organizuje funkcje przez moduły; dostęp do tabel i SQL pozostaje po stronie serwera.

## Kontrakt API — zakres bazowy

Wszystkie trasy mają prefiks `/api/v1`, przyjmują i zwracają JSON. Błędy walidacji mają status 400, brak uwierzytelnienia 401, brak uprawnień lub dostępu do wydarzenia 403/404, a konflikt unikatowego e-maila lub numeru użytkownika 409. Dokładne DTO należy utrzymywać po stronie backendu i odzwierciedlać w frontendzie.

- `POST /auth/register`, `POST /auth/login`, `POST /auth/logout` — konto i sesja.
- `GET /events`, `POST /events`, `GET /events/:eventId`, `PATCH /events/:eventId` — wydarzenia dostępne dla zalogowanego użytkownika.
- `POST /events/:eventId/members` — dodanie konta przez unikatowy numer użytkownika.
- `GET/POST /events/:eventId/announcements` — odczyt i publikowanie ogłoszeń.
- `GET/POST /events/:eventId/tasks`, `PATCH /events/:eventId/tasks/:taskId` — zadania i statusy.
- `GET/POST /events/:eventId/expenses` — wydatki i udziały.
- `POST /events/:eventId/archive` — archiwizacja przez organizatora.

Backend zawsze pobiera tożsamość z uwierzytelnionej sesji, nie z pola `userId` przesłanego przez frontend. Każde żądanie do zasobu sprawdza członkostwo w tym samym wydarzeniu. Mechanizm sesji/tokenów i dokładne formaty DTO pozostają do ustalenia podczas implementacji.

## Zależności modułów

- `wydarzenia` jest właścicielem członkostwa, ról i identyfikatorów uczestników.
- `zadania` zapisują autora i przypisanie do członka tego samego wydarzenia.
- `rozliczenia` zapisują płatnika oraz udziały członków wydarzenia; saldo wylicza backend.
- `App.tsx` składa widoki; nie powinien zawierać logiki autoryzacji, dostępu do MySQL ani zasad wyliczania finansów.

## Spójność

UUID są identyfikatorami technicznymi. Numer użytkownika jest osobnym, unikatowym identyfikatorem do wyszukiwania kont przy dodawaniu do wydarzenia. Po zmianach kontraktu, ról lub modeli sprawdź wszystkie moduły zależne, zaktualizuj dokumenty i testy. Dane klienta i ukryte przyciski nie zastępują walidacji ani autoryzacji backendu.
