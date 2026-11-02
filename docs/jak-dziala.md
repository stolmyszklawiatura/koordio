# Jak działa Koordio

## Po co jest aplikacja

Koordio pomaga grupie wspólnie organizować wycieczkę: zebrać uczestników, przekazywać informacje, planować zadania i rozliczać wspólne wydatki.

## Co działa, a co jest planem

Obecnie repozytorium zawiera prototyp interfejsu. Można w nim testować wydarzenia, uczestników, ogłoszenia, zadania i wydatki, ale dane zapisują się w pamięci przeglądarki. Nie ma jeszcze kont, logowania, wspólnych danych online ani backendu.

Docelowo aplikacja ma używać kont użytkowników, API w NestJS i bazy MySQL. Opisane niżej konta i współdzielone działanie są planem, a nie już działającymi funkcjami.

## Jak połączone są konto, znajomi i wycieczki

- Jedno konto oznacza jedną osobę w całym Koordio.
- Konto może należeć do wielu wycieczek.
- Rola jest przypisana osobno w każdej wycieczce. Ta sama osoba może być organizatorem jednej wycieczki i uczestnikiem innej.
- Członkostwo w wycieczce daje dostęp do jej informacji. Sama znajomość z organizatorem nie daje takiego dostępu.
- System znajomych nie jest obecnie opisany ani zatwierdzony. Jeśli zostanie dodany, lista znajomych będzie niezależna od członkostwa w wycieczkach. Dodanie znajomego do wycieczki nadal będzie osobnym działaniem organizatora.

Przykład:

    Konto Anny
    ├── Wycieczka w góry — organizatorka
    ├── Wyjazd nad morze — uczestniczka
    └── Znajomi — niezależna lista kont

## Jak przebiega działanie w wycieczce

    Użytkownik wykonuje działanie
            ↓
    Aplikacja wysyła je do API
            ↓
    Serwer rozpoznaje konto i wybraną wycieczkę
            ↓
    Serwer sprawdza członkostwo i uprawnienia w tej wycieczce
            ↓
    Właściwa funkcja obsługuje działanie i zapisuje dane
            ↓
    Aplikacja pokazuje wynik

Wspólny mechanizm to te kroki obsługi: rozpoznanie konta, sprawdzenie dostępu, walidacja i zapis. Każda funkcja korzysta z nich, a sama definiuje tylko swoje zasady. Przykładowo, sprawdzanie czy użytkownik jest organizatorem powinno działać według jednej reguły dla ogłoszeń, zarządzania członkami i edycji wycieczki.

## Kto może co zrobić

W MVP rola organizatora lub uczestnika obowiązuje w obrębie konkretnej wycieczki.

| Działanie | Organizator | Uczestnik |
|---|---|---|
| Odczyt wycieczki i ogłoszeń | Tak | Tak |
| Edycja i archiwizacja wycieczki | Tak | Nie |
| Dodawanie osób i zarządzanie ich rolami | Tak | Nie |
| Publikowanie ogłoszeń | Tak | Nie |
| Tworzenie i przypisywanie zadań | Tak | Nie |
| Zmiana statusu własnego zadania | Tak | Tak |
| Dodawanie wydatków i odczyt rozliczeń | Tak | Tak |

Serwer sprawdza uprawnienia przy każdym działaniu. Ukrycie przycisku w interfejsie nie zastępuje tej kontroli.

## Przykładowe przepływy

### Utworzenie wycieczki

Organizatorka tworzy wycieczkę. System zapisuje ją i tworzy jej członkostwo z rolą organizatorki. Może potem dodać istniejące konta przez ich unikatowe numery użytkownika. Każde dodane konto staje się uczestnikiem tej wycieczki.

### Dodanie ogłoszenia

Organizatorka wybiera wycieczkę i wpisuje treść. Serwer sprawdza, czy jest zalogowana i ma w tej wycieczce rolę organizatorki. Zapisuje ogłoszenie przypisane do tej wycieczki. Jej uczestnicy mogą je odczytać.

### Dodanie zadania

Organizatorka tworzy zadanie i przypisuje je członkowi tej samej wycieczki. Serwer sprawdza członkostwo i zapisuje zadanie z wycieczką oraz wykonawcą. Uczestnik może zmienić status zadania przypisanego do siebie.

### Dodanie wydatku

Członek wycieczki podaje kwotę, płatnika i osoby dzielące koszt. Serwer sprawdza, czy wskazane osoby są członkami tej wycieczki, dzieli koszt równo i zapisuje wydatek z udziałami. Koordio pokazuje sugerowane rozliczenie, ale w MVP nie rejestruje wykonanej spłaty.

### Znajomi — możliwy przyszły przepływ

Jeżeli system znajomych zostanie zatwierdzony, użytkownik będzie mógł wyszukać konto po numerze i wysłać zaproszenie. Akceptacja utworzy relację znajomości, ale nie doda automatycznie do żadnej wycieczki. Organizator będzie osobno wybierał, kogo zaprasza do konkretnej wycieczki.

## Zasady utrzymania prostoty

- Jedno konto na osobę i jedna wspólna obsługa dostępu.
- Członkostwo, rola i dane funkcji zawsze odnoszą się do konkretnej wycieczki.
- Nie kopiujemy logiki sprawdzania dostępu między funkcjami.
- Każda funkcja przechowuje tylko dane potrzebne do swojego działania.
- Wycieczki archiwizujemy, a nie usuwamy z historią zadań i finansów.

## Powiązana dokumentacja

- [README](../README.md) — skrót projektu, stan i zakres MVP.
- [Architektura](architecture.md) — technologie, API i granice funkcji.
- [Reguły i przepływy](reguly-i-przeplywy.md) — szczegółowe uprawnienia i zasady.
- [Baza danych](baza-danych.md) — encje, bezpieczeństwo i migracje.
- [Wycieczki i uczestnicy](modules/events.md), [zadania](modules/tasks.md), [rozliczenia](modules/finances.md) — szczegóły funkcji.
