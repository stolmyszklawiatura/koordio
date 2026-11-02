# Wycieczki, konta i członkostwa

## Zakres i stan

Moduł odpowiada za konta, tworzenie wycieczek, członkostwa, role i archiwizację. Prototyp pozwala tworzyć lokalne wydarzenia i uczestników. Rejestracja, konta i współdzielone dane wymagają backendu, którego jeszcze nie ma.

## Model

- Jedno konto oznacza jedną osobę w Koordio.
- Konto może należeć do wielu wycieczek.
- Członkostwo łączy jedno konto z jedną wycieczką; konto może być członkiem tej samej wycieczki tylko raz.
- Rola należy do członkostwa, a nie do konta. Ta sama osoba może być organizatorem wycieczki A i uczestnikiem wycieczki B.
- Ogłoszenia, zadania, wykonawcy zadań, płatnicy i udziały wydatków muszą wskazywać członków tej samej wycieczki.

    users
      └── event_memberships (rola i stan członkostwa)
            └── events
                  ├── announcements
                  ├── tasks → task_assignees
                  └── expenses → expense_shares

Szczegóły tabel i kluczy są w docs/baza-danych.md.

## Rejestracja i dołączanie

1. Osoba rejestruje się e-mailem i hasłem. E-mail jest unikatowy, hasło przechowywane jako bezpieczny hash.
2. Backend nadaje kontu niezmienny, unikatowy numer użytkownika.
3. Organizator tworzy wycieczkę i automatycznie zostaje jej członkiem z rolą organizatora.
4. Organizator dodaje istniejące konto, podając jego numer. Nowe członkostwo otrzymuje rolę uczestnika.
5. Osoba bez konta nie może zostać dodana jako członek.

Format numeru, weryfikacja e-maila, sesje i odzyskiwanie hasła wymagają ustalenia przed wdrożeniem. Zasady usuwania lub anonimizacji konta także pozostają do ustalenia.

## Uprawnienia w wycieczce

| Czynność | Organizator | Uczestnik |
|---|---:|---:|
| Odczyt wycieczki i ogłoszeń | Tak | Tak |
| Edycja i archiwizacja wycieczki | Tak | Nie |
| Dodawanie członków i zmiana ich ról | Tak | Nie |
| Publikowanie ogłoszeń | Tak | Nie |
| Tworzenie i przypisywanie zadań | Tak | Nie |
| Zmiana statusu zadania przypisanego do siebie | Tak | Tak |
| Dodawanie wydatków i odczyt rozliczeń | Tak | Tak |

Backend sprawdza konto, członkostwo i uprawnienie przy każdym żądaniu. Interfejs nie jest kontrolą dostępu. Ostatni aktywny organizator musi przekazać rolę przed odejściem.

## Wyjście i archiwizacja

Wycieczkę archiwizujemy zamiast usuwać. Członkostwo można dezaktywować, ale zachowujemy historię zadań, wydatków i udziałów. Szczegóły zmian bazy są w docs/baza-danych.md.

## Znajomi

System znajomych nie jest zatwierdzony w MVP ani obecnym modelu danych. Znajomość nie daje dostępu do wycieczki. Jeśli funkcja zostanie zatwierdzona, dodanie znajomego do wycieczki nadal będzie osobnym działaniem organizatora.

