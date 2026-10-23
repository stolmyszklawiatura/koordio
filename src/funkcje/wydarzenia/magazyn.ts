import type { DaneAplikacji, Wydarzenie } from './typy'

const KLUCZ = 'koordio-prototyp-v1'

const dataZaDni = (dni: number) => {
  const data = new Date()
  data.setDate(data.getDate() + dni)
  return [data.getFullYear(), `${data.getMonth() + 1}`.padStart(2, '0'), `${data.getDate()}`.padStart(2, '0')].join('-')
}

const wydarzeniePokazowe: Wydarzenie = {
  id: 'wydarzenie-pokazowe',
  nazwa: 'Weekend w Beskidach',
  miejsce: 'Szczyrk',
  data: dataZaDni(18),
  uczestnicy: [
    { id: 'osoba-jakub', imie: 'Jakub', rola: 'organizator' },
    { id: 'osoba-ola', imie: 'Ola', rola: 'uczestnik' },
    { id: 'osoba-marek', imie: 'Marek', rola: 'uczestnik' },
    { id: 'osoba-ania', imie: 'Ania', rola: 'uczestnik' },
  ],
  ogloszenia: [
    {
      id: 'ogloszenie-pakowanie',
      tytul: 'Co zabieramy?',
      tresc: 'Dajcie znać, kto może wziąć apteczkę i dodatkową latarkę.',
      utworzono: new Date().toISOString(),
    },
  ],
  zadania: [
    {
      id: 'zadanie-nocleg',
      tytul: 'Potwierdzić nocleg',
      opis: 'Zadzwonić do schroniska i potwierdzić rezerwację.',
      uczestnikId: 'osoba-jakub',
      termin: dataZaDni(4),
      status: 'w trakcie',
    },
    {
      id: 'zadanie-przekaski',
      tytul: 'Przygotować listę zakupów',
      opis: 'Spisać przekąski i produkty na wspólne śniadanie.',
      uczestnikId: 'osoba-ola',
      termin: dataZaDni(9),
      status: 'do zrobienia',
    },
    {
      id: 'zadanie-trasa',
      tytul: 'Wybrać trasę na sobotę',
      opis: 'Sprawdzić wariant krótszy i dłuższy.',
      uczestnikId: 'osoba-marek',
      termin: dataZaDni(6),
      status: 'zrobione',
    },
  ],
  wydatki: [
    {
      id: 'wydatek-rezerwacja',
      opis: 'Zaliczka za nocleg',
      platnikId: 'osoba-jakub',
      kwotaGrosze: 48000,
      uczestnicyIds: ['osoba-jakub', 'osoba-ola', 'osoba-marek', 'osoba-ania'],
      utworzono: new Date().toISOString(),
    },
    {
      id: 'wydatek-bilety',
      opis: 'Bilety na pociąg',
      platnikId: 'osoba-ola',
      kwotaGrosze: 21600,
      uczestnicyIds: ['osoba-jakub', 'osoba-ola', 'osoba-marek', 'osoba-ania'],
      utworzono: new Date().toISOString(),
    },
  ],
}

const danePoczatkowe = (): DaneAplikacji => ({
  wydarzenia: [wydarzeniePokazowe],
  aktywneWydarzenieId: wydarzeniePokazowe.id,
})

export const wczytajDane = (): DaneAplikacji => {
  try {
    const zapis = localStorage.getItem(KLUCZ)
    if (!zapis) return danePoczatkowe()

    const dane = JSON.parse(zapis) as DaneAplikacji
    if (!Array.isArray(dane.wydarzenia)) return danePoczatkowe()
    return dane
  } catch {
    return danePoczatkowe()
  }
}

export const zapiszDane = (dane: DaneAplikacji) => {
  try {
    localStorage.setItem(KLUCZ, JSON.stringify(dane))
    return true
  } catch {
    return false
  }
}

export const wyczyscDane = () => localStorage.removeItem(KLUCZ)

