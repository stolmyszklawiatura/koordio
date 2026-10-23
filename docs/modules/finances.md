# Wydatki i rozliczenia

## Cel

Moduł pomaga uczestnikom wydarzenia rozliczyć wspólne koszty. Odpowiada za rejestrowanie wydatków, podział kosztów i obliczenie sald. Reguł finansowych nie duplikuj w interfejsie ani module wydarzeń.

## Funkcje MVP

- Dodanie wydatku z opisem, kwotą i osobą, która go opłaciła.
- Określenie uczestników, między których koszt jest dzielony.
- Obliczenie udziału uczestników i ich salda względem pozostałych.
- Wyświetlenie podsumowania rozliczeń dla wydarzenia.

Dokumentacja nie precyzuje jeszcze płatności wykonywanych w aplikacji. MVP oznacza kalkulację i informację o wzajemnym rozliczeniu, nie transfer pieniędzy.

## Reguły wymagające decyzji

Przed implementacją uzgodnij: walutę, podział równy lub inny, możliwość wykluczenia uczestników z wydatku, zaokrąglenia, korekty, zwroty, ewidencję wpłat i sposób prezentowania sald. Nie zakładaj, że wszystkie koszty dzielą się równo.

## Dane, bezpieczeństwo i dokładność

- Każdy wydatek należy do jednego wydarzenia.
- Osoba płacąca i osoby obciążane kosztem muszą być uczestnikami wydarzenia.
- Nie używaj zmiennoprzecinkowej arytmetyki JavaScript do obliczeń pieniężnych; wybierz dokładną reprezentację po ustaleniu reguł.
- Nie uznawaj obliczenia w przeglądarce za wiarygodne po dodaniu backendu; serwer powinien walidować dane i ponownie wyliczać saldo.

Proponowane przechowywanie kwot i relacje z uczestnikami opisuje `docs/baza-danych.md`. Dostęp do rozliczeń i zachowanie po odejściu uczestnika wymagają decyzji opisanych w `docs/reguly-i-przeplywy.md`.

## Testy i zależności

Testuj przypadki typowe, nierówny podział, ułamki najmniejszej jednostki waluty, zaokrąglenie i nieprawidłowych uczestników. Zmiana członkostwa z `docs/modules/events.md` wymaga ustalenia, jak traktować historyczne wydatki. Aktualizuj ten dokument przy każdej zmianie reguł obliczeń.

