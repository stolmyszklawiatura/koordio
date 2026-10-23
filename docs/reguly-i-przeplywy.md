# Wspólne reguły i przepływy

Ten dokument zbiera zachowania przekrojowe, których dokumentacja projektu jeszcze nie rozstrzyga. Wskazane niżej warianty oznaczone jako **propozycja** pomagają podjąć decyzje, ale same nie są zatwierdzonymi wymaganiami.

## Konta i tożsamość

Funkcje wymagają rozpoznania osoby, ale sposób logowania nie został określony. Do decyzji pozostają: rejestracja, logowanie, odzyskiwanie dostępu, dostawca tożsamości, weryfikacja adresu i możliwość zmiany adresu. Nie przechowuj haseł samodzielnie bez wyboru i poprawnego wdrożenia mechanizmu uwierzytelniania.

**Proponowany przepływ zaproszenia:** organizator tworzy zaproszenie do konkretnego wydarzenia, zaproszona osoba przyjmuje je po uwierzytelnieniu, a system tworzy członkostwo. Trzeba zdecydować, czy zaproszenia działają przez e-mail, kod/link, czy ręczne dodanie użytkownika, jaki mają termin ważności i czy można je unieważnić.

## Członkostwo i role

Punktem wyjścia są dwie role: `organizator` i `uczestnik`. Właścicielem członkostwa i ról jest `docs/modules/events.md`.

| Czynność | Organizator | Uczestnik |
|---|---:|---:|
| Przegląd wydarzenia i jego ogłoszeń | Tak | Tak, jako członek |
| Edycja podstawowych danych wydarzenia | Tak | Nie |
| Dodawanie/usuwanie członków i zmiana roli | Tak | Nie |
| Publikowanie ogłoszeń | Propozycja: tak | Do decyzji |
| Tworzenie i przypisywanie zadań | Tak | Do decyzji |
| Zmiana stanu przypisanego zadania | Tak | Propozycja: tak |
| Dodawanie wydatku | Do decyzji | Do decyzji |
| Odczyt sald wydarzenia | Tak | Do decyzji |

Ta tabela jest szkicem do zatwierdzenia. Każdą operację serwer musi sprawdzać niezależnie od tego, co interfejs pokazuje. Nie polegaj wyłącznie na roli zapisanej w przeglądarce.

**Propozycje bezpieczeństwa konta wydarzenia:** wydarzenie musi mieć co najmniej jednego organizatora; odejście członka nie powinno niszczyć historii zadań i finansów; przekazanie lub usunięcie ostatniego organizatora wymaga jawnego procesu. Dokładny proces pozostaje otwarty.

## Przepływ organizacji wydarzenia

1. Organizator tworzy wydarzenie i wprowadza minimum: nazwę oraz podstawowe informacje.
2. Organizator dodaje uczestników lub wysyła im zaproszenia (metoda do decyzji).
3. Organizator publikuje ogłoszenia i tworzy zadania; dostęp do tych czynności zależy od zatwierdzonej macierzy uprawnień.
4. Uczestnicy przeglądają informacje i wykonują przypisane zadania.
5. Członkowie dodają wydatki i przeglądają wyliczone rozliczenie według zatwierdzonych reguł finansowych.

Do decyzji pozostaje, czy wydarzenie może być szkicem, kiedy staje się aktywne, czy można je archiwizować i co widzą użytkownicy po archiwizacji. Nie zakładaj usuwania na stałe jako domyślnego zachowania.

## Ogłoszenia i zadania

- Ogłoszenie jest powiązane z wydarzeniem i ma autora, treść oraz datę publikacji.
- Potwierdzenie przeczytania, wysyłka e-mail/push i powiadomienia w czasie rzeczywistym nie należą do potwierdzonego MVP.
- Zadanie ma wydarzenie, tytuł, opis, autora, wykonawcę lub wykonawców oraz status.
- Proponowany minimalny przebieg statusu: `do zrobienia` → `w trakcie` → `zrobione`. Ustal, czy zadanie można zamknąć ponownie i kto może zmieniać status.
- Do decyzji pozostają wielu wykonawców, termin, priorytet, komentarze, usuwanie i historia zmian.

Szczegóły modułowe znajdują się w `docs/modules/tasks.md`.

## Wydatki i rozliczenie

Proponowany przepływ: członek zapisuje wydatek, wskazuje płatnika, kwotę/walutę oraz osoby uczestniczące w podziale; system wylicza udziały i saldo. Aplikacja MVP nie przesyła pieniędzy. Oznaczenie długu jako faktycznie spłaconego wymaga osobnej decyzji i modelu ewidencji.

Do decyzji pozostają: kto może dodawać/edytować wydatki, kto widzi indywidualne salda, czy podział może być równy/procentowy/kwotowy, jak obsługiwać korekty i jak rozwiązywać groszowe reszty. Szczegóły modelu danych są w `docs/baza-danych.md`, a zakres modułu w `docs/modules/finances.md`.

## Walidacja, błędy i puste stany

- Formularz pokazuje, które wymagane pole jest niepoprawne, i zachowuje wpisane wartości po błędzie.
- Interfejs odróżnia ładowanie, brak danych, sukces i błąd; pusty widok powinien prowadzić do dozwolonego następnego kroku.
- Serwer ponownie waliduje dane i autoryzację; błędy klienta nie są zabezpieczeniem.
- Odpowiedzi błędów nie powinny ujawniać, czy istnieje cudze wydarzenie, konto ani zasób.
- Do decyzji pozostają: język interfejsu, formaty dat/liczb, strefa wydarzenia, wymagania dostępności oraz dokładne limity tekstów i plików.

## Prywatność i retencja

Przechowuj tylko dane potrzebne do działania wydarzenia. Nie zapisuj danych kart ani haseł w zwykłym tekście. Dostęp do danych jest ograniczony do członków wydarzenia zgodnie z zatwierdzoną rolą.

Przed wdrożeniem trzeba zdecydować o eksportowaniu danych, usuwaniu konta, retencji po zakończeniu wydarzenia, usunięciu/archiwizacji wydarzenia oraz zachowaniu historycznych rozliczeń po odejściu członka. Nie kasuj historii finansowej automatycznie tylko dlatego, że użytkownik przestał być aktywnym członkiem.

## Rejestr decyzji

Przed wdrożeniem nowych zachowań zamień odpowiednie punkty „do decyzji” w zatwierdzone reguły. Zapisz każdą ważną decyzję krótko: wybrany wariant, powód i moduły, których dotyczy. Następnie zaktualizuj ten dokument, właściwy dokument modułu, model bazy w `docs/baza-danych.md` i testy akceptacyjne.

