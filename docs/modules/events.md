# Wydarzenia, uczestnicy i role

## Cel

Wydarzenie jest osobną przestrzenią Koordio. Skupia podstawowe informacje, organizatora, uczestników, ogłoszenia, zadania i rozliczenia. Ten moduł jest właścicielem wydarzeń, członkostwa, podgrup i ról.

## Funkcje MVP

- Utworzenie wydarzenia z nazwą i podstawowymi informacjami.
- Wyświetlenie i edycja wydarzenia przez uprawnionego organizatora.
- Zarządzanie listą uczestników wydarzenia.
- Podstawowa rola organizatora oraz rola uczestnika.
- Proste podgrupy, jeżeli są potrzebne do organizacji konkretnego wydarzenia; rozbudowany system grup jest poza MVP.

Dokumentacja nie określa jeszcze procesu zapraszania, logowania, akceptacji zaproszeń, usuwania wydarzenia ani przekazania organizatora. Ustal te zachowania przed ich implementacją.

## Reguły działania

- Każdy uczestnik i każda dalsza funkcja są przypisane do konkretnego wydarzenia.
- Organizator zarządza ustawieniami wydarzenia i jego uczestnikami.
- Uczestnik widzi informacje dostępne dla członków wydarzenia i wykonuje przypisane mu działania.
- Nie zakładaj globalnej roli administratora produktu.
- Gdy zostanie dodany backend, każda operacja musi sprawdzać członkostwo i rolę po stronie serwera.

Dokładna macierz uprawnień i widoczność danych wymagają decyzji. Nie rozszerzaj praw uczestnika domyślnie.

Wspólne propozycje dotyczące logowania, zaproszeń, usuwania członkostwa i ról znajdują się w `docs/reguly-i-przeplywy.md`. Nie traktuj ich jako zatwierdzonych reguł, dopóki nie zostaną zaakceptowane.

## Dane pojęciowe

Na poziomie produktu potrzebne są: wydarzenie, członkostwo uczestnika w wydarzeniu, rola oraz opcjonalna podgrupa. To opis pojęć, nie zatwierdzony schemat bazy ani interfejs TypeScript.

Proponowane relacje i zasady przechowywania tych danych opisuje `docs/baza-danych.md`.

## Zależności i kontrola spójności

`zadania` i `rozliczenia` korzystają z identyfikatora członkostwa z tego modułu. Zmiana uczestnika, usunięcie go lub zmiana roli wymaga sprawdzenia istniejących przypisań, ogłoszeń i rozliczeń.

Dodaj testy dla tworzenia/edycji wydarzenia, członkostwa i reguł ról, gdy powstaną te funkcje. Aktualizuj ten dokument po zmianie zachowania, zakresu MVP lub uprawnień.

