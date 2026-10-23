# Wydatki i rozliczenia

## Cel i stan prototypu

Moduł ewidencjonuje wspólne wydatki wydarzenia i oblicza salda. Obecny frontend przyjmuje kwoty w PLN, dzieli je po równo między wskazane osoby, pokazuje salda i sugerowane przelewy. Dane są lokalne w przeglądarce. Brak zapisu MySQL, synchronizacji i ewidencji faktycznych spłat.

## Uzgodnione reguły MVP

- Wydatek należy do wydarzenia; płatnik i każda osoba uwzględniona w podziale są członkami tego wydarzenia.
- Walutą MVP jest PLN. Kwoty są przechowywane i liczone w całkowitych groszach.
- Wydatek dzieli się równo między wybrane osoby. Pozostałe grosze trafiają po jednym, w kolejności osób w podziale.
- System wyświetla saldo i sugeruje przelewy, ale nie oznacza spłat jako wykonanych i nie przesyła pieniędzy.
- Historyczne wydatki i udziały zachowują się po archiwizacji wydarzenia lub dezaktywacji członka.

## Przyszły zapis w bazie

`expenses` przechowuje wydarzenie, płatnika, opis, kwotę groszy i walutę; `expense_shares` zapisuje udział każdej osoby. Backend waliduje, że osoby należą do wydarzenia, suma udziałów równa się kwocie i całość zapisuje się w jednej transakcji. Wydatku nie wolno fizycznie usuwać, jeśli usunęłoby to historię rozliczeń.

Zaimportowany schemat ma początkowe tabele, ale nadal nie ma działającego połączenia backend–MySQL. Zmiany wprowadzaj migracjami, nie przez ponowny import SQL.

## Dostęp i pozostałe szczegóły

Organizator i uczestnicy mogą dodawać wydatki oraz odczytywać rozliczenia wydarzenia. Dokładne zasady edycji i korekt wydatków pozostają do doprecyzowania. Backend ponownie wylicza saldo i sprawdza uprawnienia; nie ufa kwotom ani listom osób przesłanym przez przeglądarkę. Nie używaj arytmetyki zmiennoprzecinkowej do pieniędzy.
