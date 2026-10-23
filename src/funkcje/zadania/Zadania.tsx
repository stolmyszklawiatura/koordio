import { useState, type FormEvent } from 'react'
import type { Ogloszenie, Uczestnik, Zadanie } from '../wydarzenia/typy'
import { formatujDate, inicjaly, noweId } from '../wydarzenia/typy'

type Props = {
  uczestnicy: Uczestnik[]
  zadania: Zadanie[]
  ogloszenia: Ogloszenie[]
  dodajZadanie: (zadanie: Zadanie) => void
  zmienStatus: (id: string, status: Zadanie['status']) => void
  dodajOgloszenie: (ogloszenie: Ogloszenie) => void
}

export function ZadaniaPanel({
  uczestnicy,
  zadania,
  ogloszenia,
  dodajZadanie,
  zmienStatus,
  dodajOgloszenie,
}: Props) {
  const [pokazFormularz, setPokazFormularz] = useState(false)
  const [pokazOgloszenie, setPokazOgloszenie] = useState(false)

  const utworzZadanie = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formularz = new FormData(event.currentTarget)
    const tytul = String(formularz.get('tytul') ?? '').trim()
    if (!tytul || uczestnicy.length === 0) return

    dodajZadanie({
      id: noweId(),
      tytul,
      opis: String(formularz.get('opis') ?? '').trim(),
      uczestnikId: String(formularz.get('uczestnikId') ?? uczestnicy[0].id),
      termin: String(formularz.get('termin') ?? ''),
      status: 'do zrobienia',
    })
    event.currentTarget.reset()
    setPokazFormularz(false)
  }

  const utworzOgloszenie = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formularz = new FormData(event.currentTarget)
    const tytul = String(formularz.get('tytul') ?? '').trim()
    const tresc = String(formularz.get('tresc') ?? '').trim()
    if (!tytul || !tresc) return

    dodajOgloszenie({ id: noweId(), tytul, tresc, utworzono: new Date().toISOString() })
    event.currentTarget.reset()
    setPokazOgloszenie(false)
  }

  const kolejneStatusy: Record<Zadanie['status'], Zadanie['status']> = {
    'do zrobienia': 'w trakcie',
    'w trakcie': 'zrobione',
    zrobione: 'do zrobienia',
  }

  return (
    <div className="strona-modulu">
      <div className="naglowek-modulu">
        <div>
          <p className="nadtytul">PLAN DZIAŁANIA</p>
          <h2>Zadania i ogłoszenia</h2>
          <p className="opis-strony">Ważne informacje i obowiązki w jednym miejscu.</p>
        </div>
        <div className="przyciski-wiersz">
          <button className="przycisk przycisk-jasny" onClick={() => setPokazOgloszenie((wartosc) => !wartosc)}>
            <span aria-hidden="true">＋</span> Ogłoszenie
          </button>
          <button className="przycisk przycisk-glowny" onClick={() => setPokazFormularz((wartosc) => !wartosc)}>
            <span aria-hidden="true">＋</span> Nowe zadanie
          </button>
        </div>
      </div>

      {pokazOgloszenie && (
        <form className="karta formularz-karta" onSubmit={utworzOgloszenie}>
          <div className="formularz-naglowek"><h3>Nowe ogłoszenie</h3><button type="button" className="przycisk-tekstowy" onClick={() => setPokazOgloszenie(false)}>Zamknij</button></div>
          <label>Tytuł<input name="tytul" required maxLength={80} placeholder="Np. Zmiana miejsca zbiórki" /></label>
          <label>Treść<textarea name="tresc" required maxLength={600} rows={3} placeholder="Co uczestnicy powinni wiedzieć?" /></label>
          <button className="przycisk przycisk-glowny" type="submit">Opublikuj ogłoszenie</button>
        </form>
      )}

      {pokazFormularz && (
        <form className="karta formularz-karta" onSubmit={utworzZadanie}>
          <div className="formularz-naglowek"><h3>Dodaj zadanie</h3><button type="button" className="przycisk-tekstowy" onClick={() => setPokazFormularz(false)}>Zamknij</button></div>
          <div className="siatka-formularza">
            <label>Nazwa zadania<input name="tytul" required maxLength={100} placeholder="Np. Zarezerwować nocleg" /></label>
            <label>Osoba odpowiedzialna<select name="uczestnikId" required>{uczestnicy.map((osoba) => <option key={osoba.id} value={osoba.id}>{osoba.imie}</option>)}</select></label>
            <label>Termin<input name="termin" type="date" /></label>
          </div>
          <label>Szczegóły<textarea name="opis" maxLength={400} rows={2} placeholder="Dodatkowe informacje (opcjonalnie)" /></label>
          <button className="przycisk przycisk-glowny" type="submit" disabled={uczestnicy.length === 0}>Dodaj do listy</button>
        </form>
      )}

      <div className="uklad-dwie-karty">
        <section className="karta karta-zadania">
          <div className="karta-naglowek"><div><p className="nadtytul">DO ZROBIENIA</p><h3>Lista zadań</h3></div><span className="licznik">{zadania.filter((zadanie) => zadanie.status !== 'zrobione').length} otwarte</span></div>
          {zadania.length === 0 ? <p className="pusta-lista">Nie ma jeszcze zadań. Dodaj pierwsze, by podzielić się obowiązkami.</p> : (
            <div className="lista-zadan">
              {[...zadania].sort((a, b) => Number(a.status === 'zrobione') - Number(b.status === 'zrobione')).map((zadanie) => {
                const osoba = uczestnicy.find((element) => element.id === zadanie.uczestnikId)
                return (
                  <article className={`zadanie-wiersz ${zadanie.status === 'zrobione' ? 'zadanie-gotowe' : ''}`} key={zadanie.id}>
                    <button className={`pole-statusu status-${zadanie.status.replaceAll(' ', '-')}`} aria-label={`Zmień status zadania ${zadanie.tytul}`} onClick={() => zmienStatus(zadanie.id, kolejneStatusy[zadanie.status])}>
                      {zadanie.status === 'zrobione' ? '✓' : zadanie.status === 'w trakcie' ? '◷' : ''}
                    </button>
                    <div className="zadanie-tresc"><strong>{zadanie.tytul}</strong>{zadanie.opis && <p>{zadanie.opis}</p>}<div className="zadanie-meta"><span className="mini-avatar">{inicjaly(osoba?.imie ?? 'Brak')}</span><span>{osoba?.imie ?? 'Bez przypisania'}</span>{zadanie.termin && <><span className="kropka-meta">·</span><span>{formatujDate(zadanie.termin)}</span></>}</div></div>
                    <span className={`znacznik-statusu znacznik-${zadanie.status.replaceAll(' ', '-')}`}>{zadanie.status}</span>
                  </article>
                )
              })}
            </div>
          )}
        </section>

        <section className="karta karta-ogloszenia">
          <div className="karta-naglowek"><div><p className="nadtytul">W OBIEGU</p><h3>Ogłoszenia</h3></div><span className="ikona-karty ikona-zolta">✳</span></div>
          {ogloszenia.length === 0 ? <p className="pusta-lista">Nie opublikowano jeszcze żadnego ogłoszenia.</p> : (
            <div className="lista-ogloszen">
              {[...ogloszenia].reverse().map((ogloszenie) => <article className="ogloszenie" key={ogloszenie.id}><div className="ogloszenie-data">{new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long' }).format(new Date(ogloszenie.utworzono))}</div><h4>{ogloszenie.tytul}</h4><p>{ogloszenie.tresc}</p></article>)}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

