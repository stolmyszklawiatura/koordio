export type Rola = 'organizator' | 'uczestnik'
export type StatusZadania = 'do zrobienia' | 'w trakcie' | 'zrobione'

export type Uczestnik = {
  id: string
  imie: string
  rola: Rola
}

export type Ogloszenie = {
  id: string
  tytul: string
  tresc: string
  utworzono: string
}

export type Zadanie = {
  id: string
  tytul: string
  opis: string
  uczestnikId: string
  termin: string
  status: StatusZadania
}

export type Wydatek = {
  id: string
  opis: string
  platnikId: string
  kwotaGrosze: number
  uczestnicyIds: string[]
  utworzono: string
}

export type Wydarzenie = {
  id: string
  nazwa: string
  miejsce: string
  data: string
  uczestnicy: Uczestnik[]
  ogloszenia: Ogloszenie[]
  zadania: Zadanie[]
  wydatki: Wydatek[]
}

export type DaneAplikacji = {
  wydarzenia: Wydarzenie[]
  aktywneWydarzenieId: string | null
}

export const noweId = () => crypto.randomUUID()

export const formatujKwote = (grosze: number) =>
  new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(grosze / 100)

export const formatujDate = (data: string) => {
  if (!data) return 'Termin do ustalenia'
  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${data}T12:00:00`))
}

export const inicjaly = (imie: string) =>
  imie
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((czesc) => czesc[0]?.toLocaleUpperCase('pl-PL'))
    .join('')

