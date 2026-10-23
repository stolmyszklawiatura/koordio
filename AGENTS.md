# Instrukcje dla agentów AI

## Cel projektu

Koordio ma ułatwiać grupom organizację wydarzeń, uczestników, ogłoszeń, zadań i wspólnych rozliczeń. Repozytorium zawiera obecnie frontend React + TypeScript uruchamiany przez Vite. Nie ma jeszcze wybranego backendu ani bazy danych. Nie opisuj planowanej funkcji tak, jakby była już zaimplementowana.

## Wybór kontekstu

Zacznij od tego pliku i otwórz tylko dokumenty potrzebne do zadania:

| Zadanie | Dokument |
|---|---|
| Struktura, granice modułów, TypeScript, integracja z API | `docs/architecture.md` |
| Model danych, migracje, zapytania i dostęp do bazy | `docs/baza-danych.md` |
| Logowanie, zaproszenia, cykl życia wydarzenia, wspólne reguły dostępu | `docs/reguly-i-przeplywy.md` |
| Wydarzenia, uczestnicy, role, podgrupy | `docs/modules/events.md` |
| Ogłoszenia, zadania, przypisania, statusy | `docs/modules/tasks.md` |
| Wydatki, podział kosztów, salda | `docs/modules/finances.md` |
| MVP, cele produktu i funkcje przyszłe | `README.md` |

Jeśli zmiana narusza zależność innego modułu, przeczytaj również jego dokument. Nie wczytuj całej dokumentacji ani całego kodu bez potrzeby; wyszukaj miejsca użycia zmienianych typów i zachowań.

Technologie lub reguły oznaczone w dokumentacji jako „propozycja” albo „do decyzji” nie są zatwierdzone. Przed ich implementacją sprawdź, czy zadanie zawiera decyzję; w przeciwnym razie przedstaw warianty i nie koduj ich jako faktów.

## Zasady pracy

1. Najpierw sprawdź istniejący kod, pakiety i lokalne instrukcje. Proponowany katalog nie oznacza, że funkcja już istnieje.
2. Trzymaj definicję uczestnika i ról w obszarze wydarzeń. Inne moduły odwołują się do jego identyfikatorów i reguł.
3. Używaj TypeScript. Nie dodawaj `server`, `shared`, osobnego systemu typów ani innych warstw bez konkretnej potrzeby i decyzji projektowej.
4. Typy TypeScript nie walidują danych otrzymanych z sieci. Walidacja i autoryzacja po stronie serwera będą konieczne, gdy powstanie backend.
5. Nie implementuj funkcji oznaczonych w README jako przyszłe w ramach MVP, chyba że zadanie wyraźnie zmienia zakres.
6. Po zmianie zachowania lub reguł modułu zaktualizuj jego dokument i odpowiednie testy. Przy zmianie wyłącznie wewnętrznej nie edytuj dokumentacji, jeśli jej opis pozostaje prawdziwy.
7. Przy zmianie współdzielonego zachowania sprawdź moduły zależne i uruchom właściwe testy. W podsumowaniu wskaż zmiany i wynik; jeśli testów nie da się uruchomić, podaj powód.

