# Koordio

Koordio ma pomóc grupom znajomych, harcerzom i innym społecznościom wspólnie organizować wydarzenia bez rozpraszania informacji między czatem, arkuszem i kalendarzem. Każde wydarzenie jest osobną przestrzenią dla uczestników, ról, ogłoszeń, zadań i rozliczeń. Interfejs ma działać na telefonach i komputerach.

## Obecny stan techniczny

Projekt zawiera frontend React + TypeScript z Vite. Obecne `src/App.tsx` to ekran startowy szablonu, nie gotowa funkcja Koordio. Backend, logowanie, baza danych i API nie zostały jeszcze wybrane ani zaimplementowane. TypeScript jest wybranym językiem; framework serwerowy i baza pozostają otwartymi decyzjami.

## Zakres MVP

1. Tworzenie wydarzeń i zarządzanie uczestnikami.
2. Podstawowe role i uprawnienia dla organizatora i uczestników.
3. Ogłoszenia powiązane z wydarzeniem.
4. Przydzielanie zadań uczestnikom i śledzenie ich wykonania.
5. Rejestrowanie wspólnych wydatków, podział kosztów i wzajemne rozliczenia.
6. Responsywny interfejs przeglądarkowy.

To zakres funkcji, nie zatwierdzony schemat danych. Szczegółowe reguły opisują dokumenty w `docs/`.

## Po MVP

Głosowania nad terminami, wizualizacja postępu, kalendarz i przypomnienia, rozbudowane role i podgrupy, czat przy zadaniach, historia aktywności, punktacja oraz PWA. PWA jest rozszerzeniem aplikacji webowej. Nie implementuj tych elementów jako części MVP bez osobnej decyzji.

## Uruchomienie frontendu

Wymagane jest środowisko Node.js z npm. Dostępne skrypty są zdefiniowane w `package.json`:

- `npm run dev` — lokalny serwer developerski.
- `npm run build` — sprawdzenie TypeScript i budowa produkcyjna.
- `npm run lint` — kontrola lint.
- `npm run preview` — podgląd zbudowanej aplikacji.

## Dokumentacja dla agentów

- `AGENTS.md` — wybór kontekstu i zasady pracy.
- `docs/architecture.md` — aktualny szkielet, granice i otwarte decyzje techniczne.
- `docs/baza-danych.md` — propozycja modelu danych oraz zasady bezpiecznego dostępu do przyszłej bazy.
- `docs/reguly-i-przeplywy.md` — przepływy użytkownika, wspólne reguły i lista decyzji do podjęcia.
- `docs/modules/events.md` — wydarzenia, uczestnicy i uprawnienia.
- `docs/modules/tasks.md` — ogłoszenia i zadania.
- `docs/modules/finances.md` — wydatki i rozliczenia.

