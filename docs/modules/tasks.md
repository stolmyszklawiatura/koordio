# Ogłoszenia i zadania

## Cel i stan prototypu

Ogłoszenia przekazują informacje w ramach wydarzenia; zadania opisują pracę i jej status. Obecny prototyp pozwala tworzyć lokalne ogłoszenia i zadania oraz zmieniać status zadania. Nie ma rozsyłania danych do innych kont, synchronizacji, rejestracji ani kontroli dostępu na serwerze.

## Zakres i reguły MVP

### Ogłoszenia

- Każde ogłoszenie należy do wydarzenia i ma autora będącego jego członkiem.
- Organizator publikuje ogłoszenia; uczestnicy wydarzenia mogą je odczytać.
- Potwierdzenia odczytu, e-mail/push i powiadomienia w czasie rzeczywistym nie należą do MVP.

### Zadania

- Organizator tworzy zadanie w wydarzeniu i przypisuje je uczestnikowi tego wydarzenia.
- Uczestnik widzi zadania dostępne w wydarzeniu i może zmieniać status zadania przypisanego do siebie.
- Organizator może tworzyć, przypisywać i przeglądać zadania.
- Statusy MVP: `do zrobienia`, `w trakcie`, `zrobione`; API mapuje je odpowiednio na `todo`, `in_progress`, `done`.
- Prototyp obsługuje jednego wykonawcę. Schemat SQL ma tabelę łącznikową dopuszczającą wielu; przed implementacją kontraktu należy ustalić, czy backend ogranicza zadanie do jednej osoby w MVP.

Terminy pojawiają się w prototypie. Priorytety, komentarze, historia zmian, ponowne otwieranie i powiadomienia nie należą obecnie do ustalonego zakresu.

## Zależności i bezpieczeństwo

- Autor i wykonawca muszą być członkami tego samego wydarzenia co zadanie/ogłoszenie.
- Użytkownik loguje się e-mailem i hasłem, a członkostwo wydarzenia tworzy się przez unikatowy numer użytkownika.
- Backend sprawdza rolę i członkostwo przy każdym żądaniu; frontend nie jest zabezpieczeniem.
- Dezaktywacja członka nie usuwa zadań ani ogłoszeń powiązanych z historią wydarzenia.

Szczegóły ról są w `docs/reguly-i-przeplywy.md`; model kont i bazy w `docs/baza-danych.md`. Aktualizuj dokument przy każdej zmianie statusów, przypisań lub uprawnień.
