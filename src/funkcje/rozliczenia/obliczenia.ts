import type { Uczestnik, Wydatek } from '../wydarzenia/typy'

export type Saldo = {
  uczestnik: Uczestnik
  grosze: number
}

export type Przelew = {
  od: Uczestnik
  do: Uczestnik
  grosze: number
}

export const obliczSalda = (uczestnicy: Uczestnik[], wydatki: Wydatek[]): Saldo[] => {
  const salda = new Map(uczestnicy.map((osoba) => [osoba.id, 0]))

  for (const wydatek of wydatki) {
    if (!salda.has(wydatek.platnikId)) continue
    salda.set(wydatek.platnikId, (salda.get(wydatek.platnikId) ?? 0) + wydatek.kwotaGrosze)

    const osoby = [...new Set(wydatek.uczestnicyIds)].filter((id) => salda.has(id))
    if (osoby.length === 0) continue
    const podstawowaKwota = Math.floor(wydatek.kwotaGrosze / osoby.length)
    let reszta = wydatek.kwotaGrosze - podstawowaKwota * osoby.length
    for (const id of osoby) {
      const udzial = podstawowaKwota + (reszta > 0 ? 1 : 0)
      if (reszta > 0) reszta -= 1
      salda.set(id, (salda.get(id) ?? 0) - udzial)
    }
  }

  return uczestnicy.map((uczestnik) => ({ uczestnik, grosze: salda.get(uczestnik.id) ?? 0 }))
}

export const wyznaczPrzelewy = (salda: Saldo[]): Przelew[] => {
  const dluznicy = salda.filter((saldo) => saldo.grosze < 0).map((saldo) => ({ ...saldo, grosze: -saldo.grosze }))
  const wierzyciele = salda.filter((saldo) => saldo.grosze > 0).map((saldo) => ({ ...saldo }))
  const przelewy: Przelew[] = []
  let d = 0
  let w = 0

  while (d < dluznicy.length && w < wierzyciele.length) {
    const kwota = Math.min(dluznicy[d].grosze, wierzyciele[w].grosze)
    if (kwota > 0) przelewy.push({ od: dluznicy[d].uczestnik, do: wierzyciele[w].uczestnik, grosze: kwota })
    dluznicy[d].grosze -= kwota
    wierzyciele[w].grosze -= kwota
    if (dluznicy[d].grosze === 0) d += 1
    if (wierzyciele[w].grosze === 0) w += 1
  }

  return przelewy
}

