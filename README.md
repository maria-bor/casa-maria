# casa-maria
Projekt na przedmiot TIN.
Wymagania poniżej.

## Cel
* Celem jest zbudowanie prostego serwisu prezentującego umiejętności poznane na zajęciach.

## Baza danych
* Dowolna.

## Technologia
* Dowolna.

## Wymagania
### Na ocenę 3:
* Odpowiedni wygląd z wykorzystaniem CSS
* Wykorzystanie bazy danych w celu pobrania/wyświetlenia/dodania/modyfikacji danych wyświetlanych na stronie
* Walidacja danych wpisywanych do formularza (po stronie klienta - za pomocą JavaScript, jak i serwera w wybranej technologii). Dopuszczalne jest użycie bibliotek do walidacji danych.
* 3 tabele w bazie:
    * przynajmniej jedna wiele­-do-­wiele (uwaga: zagnieżdżenie obiektów w MongoDB nie jest relacją wiele-do-wiele)
    * należy zapewnić operację dodawania/modyfikacji/usuwania danych z każdej tabeli (również tej wiele-do-wiele)

### Na ocenę 4
* jw.
* mechanizm rejestracji
* mechanizm logowania
* 2 role użytkowników :
    * anonimowy
    * zalogowany (mający dostęp do innych funkcjonalności aplikacji niż użytkownik anonimowy)
* przechowywanie haseł w sposób bezpieczny, np. w postaci skrótu MD5, SHA1
* 5 tabel w bazie
    * przynajmniej jedna wiele­-do-­wiele (uwaga: zagnieżdżenie obiektów w MongoDB nie jest relacją wiele-do-wiele)
    * przynajmniej jedna relacja jeden-do-wiele
    * należy zapewnić operację dodawania/modyfikacji/usuwania danych z każdej tabeli (również tej wiele-do-wiele)

### Na ocenę 5
* jw.
* rejestracja powinna zawierać mechanizm aktywacji konta (polegający na potwierdzeniu adresu e-mail)
* minimum 3 role użytkowników - zróżnicowane względem uprawnień do zasobów, funkcjonalności aplikacji, np. w przypadku forum internetowego mogłbyśmy wyróżnić użytkowników takich jak:
    * anonimowy - może wyświetlać wszystkie posty
    * autor - może dodawać nowe posty oraz zarządzać tymi, które napisał
    * administrator - może zarządzać wszystkimi postami
* 7 tabel w bazie
    * przynajmniej jedna wiele­-do-­wiele (uwaga: zagnieżdżenie obiektów w MongoDB nie jest relacją wiele-do-wiele)
    * przynajmniej jedna relacja jeden-do-wiele
    * należy zapewnić operację dodawania/modyfikacji/usuwania danych z każdej tabeli (również tej wiele-do-wiele)

## Uwagi
* Projekt powinien realizować konkretną funkcjonalność biznesową.
* Cały rozkład strony (CSS) powinien być robiony samodzielnie samodzielnie - bez używania gotowych frameworków.
* Zabronione jest korzytanie z gotowych tutoriali - projekt powinien stanowić pracę samodzielną (autorską).
* Niedopuszczalne jest wykorzystanie generatora aplikacji (scaffold) obecnego np. w .NET MVC, Ruby on Rails itp.

## Obrona
#### Przy oddawaniu projektu należy zaprezentować:
* działający serwis
* diagram encji
* kod programu
