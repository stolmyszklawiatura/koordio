# Ogłoszenia i zadania

## Cel

Moduł porządkuje komunikację organizacyjną i obowiązki w ramach wydarzenia. Ogłoszenie przekazuje informację grupie; zadanie wskazuje pracę do wykonania i jej postęp.

## Funkcje MVP

### Ogłoszenia

- Organizator publikuje ogłoszenie w konkretnym wydarzeniu.
- Uczestnicy wydarzenia mogą wyświetlić ogłoszenia, do których mają dostęp.
- Edycja i usuwanie ogłoszenia są dostępne dla jego autora lub organizatora.

### Zadania

- Uprawniony użytkownik tworzy zadanie w wydarzeniu i opisuje oczekiwany rezultat.
- Zadanie można przypisać uczestnikowi wydarzenia.
- Przypisany uczestnik może zobaczyć zadanie i zaktualizować jego stan.
- Organizator może przeglądać zadania wydarzenia.

Proponowane statusy to `do zrobienia`, `w trakcie`, `zrobione`; ostateczny zestaw należy potwierdzić przed implementacją. Dokumentacja nie rozstrzyga wielu wykonawców, terminów, priorytetów, komentarzy ani powiadomień.

## Zasady dostępu i zależności

- Każde ogłoszenie i zadanie należy do wydarzenia.
- Wskazany wykonawca musi być uczestnikiem tego samego wydarzenia.
- Uczestnicy i role pochodzą z `docs/modules/events.md`; nie twórz kopii profilu uczestnika.
- Potwierdzenie przeczytania ogłoszenia jest opcjonalnym pomysłem i nie jest wymagane w MVP.
- Po dodaniu backendu serwer sprawdza uprawnienia dla każdej operacji.

Wspólne zasady członkostwa i ról opisuje `docs/reguly-i-przeplywy.md`; nie kopiuj ich do tego modułu.

## Testy i aktualizacja

Testuj tworzenie i edycję, przypisanie do uczestnika z innego wydarzenia, zmianę statusu oraz dostęp organizatora i uczestnika. Zmiana członkostwa może wpłynąć na istniejące zadania i widoczność ogłoszeń. Aktualizuj ten dokument, jeśli zmienią się te reguły lub zakres MVP.

