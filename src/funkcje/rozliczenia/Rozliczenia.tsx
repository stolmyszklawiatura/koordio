import { useState, type FormEvent } from 'react'
import type { Uczestnik, Wydatek } from '../wydarzenia/typy'
import { formatujKwote, inicjaly, noweId } from '../wydarzenia/typy'
import { obliczSalda, wyznaczPrzelewy } from './obliczenia'

type Props = {
  uczestnicy: Uczestnik[]
  wydatki: Wydatek[]
  dodajWydatek: (wydatek: Wydatek) => void
}

export function RozliczeniaPanel({ uczestnicy, wydatki, dodajWydatek }: Props) {
  const [pokazFormularz, setPokazFormularz] = useState(false)
  const [blad, setBlad] = useState('')
  const salda = obliczSalda(uczestnicy, wydatki)
  const przelewy = wyznaczPrzelewy(salda)
  const sumaWydatkow = wydatki.reduce((suma, wydatek) => suma + wydatek.kwotaGrosze, 0)

  const zapiszWydatek = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formularz = new FormData(event.currentTarget)
    const kwota = Math.round(Number(formularz.get('kwota')) * 100)
    const platnikId = String(formularz.get('platnikId') ?? '')
    const uczestnicyIds = formularz.getAll('uczestnicy').map(String)
    const opis = String(formularz.get('opis') ?? '').trim()

    if (!opis || !Number.isFinite(kwota) || kwota <= 0 || !platnikId || uczestnicyIds.length === 0) {
      setBlad('Uzupełnij opis, poprawną kwotę, płatnika i co najmniej jedną osobę do podziału.')
      return
    }

    dodajWydatek({
      id: noweId(),
      opis,
      platnikId,
      kwotaGrosze: kwota,
      uczestnicyIds,
      utworzono: new Date().toISOString(),
    })
    event.currentTarget.reset()
    setBlad('')
    setPokazFormularz(false)
  }

  return (
    <div className="strona-modulu">
      <div className="naglowek-modulu">
        <div><p className="nadtytul">WSPÓLNA KASA</p><h2>Rozliczenia</h2><p className="opis-strony">Wydatki grupy i przejrzyste saldo każdej osoby.</p></div>
        <button className="przycisk przycisk-glowny" onClick={() => setPokazFormularz((wartosc) => !wartosc)}><span aria-hidden="true">＋</span> Dodaj wydatek</button>
      </div>

      {pokazFormularz && (
        <form className="karta formularz-karta" onSubmit={zapiszWydatek}>
          <div className="formularz-naglowek"><h3>Nowy wydatek</h3><button type="button" className="przycisk-tekstowy" onClick={() => setPokazFormularz(false)}>Zamknij</button></div>
          <div className="siatka-formularza">
            <label>Za co zapłacono?<input name="opis" required maxLength={100} placeholder="Np. Zakupy na śniadanie" /></label>
            <label>Kwota (PLN)<input name="kwota" required type="number" min="0.01" step="0.01" placeholder="0,00" /></label>
            <label>Zapłacił/a<select name="platnikId" required>{uczestnicy.map((osoba) => <option key={osoba.id} value={osoba.id}>{osoba.imie}</option>)}</select></label>
          </div>
          <fieldset className="wybor-osob"><legend>Podziel koszt między</legend><div className="wybor-osob-lista">{uczestnicy.map((osoba) => <label className="checkbox-osoby" key={osoba.id}><input type="checkbox" name="uczestnicy" value={osoba.id} defaultChecked /><span>{osoba.imie}</span></label>)}</div></fieldset>
          {blad && <p className="blad-formularza" role="alert">{blad}</p>}
          <p className="dopisek-formularza">Koszt zostanie podzielony po równo. To prototyp — dane są zapisane tylko w tej przeglądarce.</p>
          <button className="przycisk przycisk-glowny" type="submit" disabled={uczestnicy.length === 0}>Zapisz wydatek</button>
        </form>
      )}

      <div className="finanse-podsumowanie">
        <article className="karta kafel-finansowy"><span className="ikona-karty ikona-zielona">↗</span><p>Wydatki razem</p><strong>{formatujKwote(sumaWydatkow)}</strong></article>
        <article className="karta kafel-finansowy"><span className="ikona-karty ikona-fioletowa">◎</span><p>Dodane wydatki</p><strong>{wydatki.length}</strong></article>
        <article className="karta kafel-finansowy"><span className="ikona-karty ikona-zolta">⇄</span><p>Do rozliczenia</p><strong>{przelewy.length}</strong></article>
      </div>

      <div className="uklad-dwie-karty">
        <section className="karta">
          <div className="karta-naglowek"><div><p className="nadtytul">KTO KOMU</p><h3>Proponowane rozliczenie</h3></div></div>
          {przelewy.length === 0 ? <div className="informacja-pusta"><span>✓</span><strong>Wszystko wyrównane</strong><p>Dodane wydatki nie tworzą obecnie zobowiązań.</p></div> : <div className="lista-przelewow">{przelewy.map((przelew, index) => <div className="przelew" key={`${przelew.od.id}-${przelew.do.id}-${index}`}><span className="mini-avatar">{inicjaly(przelew.od.imie)}</span><strong>{przelew.od.imie}</strong><span className="strzalka-przelewu">→</span><span className="mini-avatar avatar-wierzyciela">{inicjaly(przelew.do.imie)}</span><strong>{przelew.do.imie}</strong><b>{formatujKwote(przelew.grosze)}</b></div>)}</div>}
          <p className="dopisek-formularza">To wyliczenie sald na podstawie zapisanych wydatków, nie płatność w aplikacji.</p>
        </section>

        <section className="karta">
          <div className="karta-naglowek"><div><p className="nadtytul">SALDO OSÓB</p><h3>Uczestnicy</h3></div></div>
          {salda.length === 0 ? <p className="pusta-lista">Dodaj uczestników w widoku wydarzenia.</p> : <div className="lista-sald">{salda.map(({ uczestnik, grosze }) => <div className="saldo-wiersz" key={uczestnik.id}><span className="mini-avatar">{inicjaly(uczestnik.imie)}</span><div><strong>{uczestnik.imie}</strong><small>{uczestnik.rola === 'organizator' ? 'Organizator' : 'Uczestnik'}</small></div><b className={grosze > 0 ? 'kwota-plus' : grosze < 0 ? 'kwota-minus' : ''}>{grosze > 0 ? '+' : ''}{formatujKwote(grosze)}</b></div>)}</div>}
        </section>
      </div>

      <section className="karta historia-wydatkow"><div className="karta-naglowek"><div><p className="nadtytul">HISTORIA</p><h3>Ostatnie wydatki</h3></div></div>{wydatki.length === 0 ? <p className="pusta-lista">Dodane wydatki pojawią się tutaj.</p> : [...wydatki].reverse().map((wydatek) => <div className="wydatek-wiersz" key={wydatek.id}><span className="ikona-wydatku">↗</span><div><strong>{wydatek.opis}</strong><small>Zapłacił/a {uczestnicy.find((osoba) => osoba.id === wydatek.platnikId)?.imie ?? 'Uczestnik'} · {wydatek.uczestnicyIds.length} os.</small></div><b>{formatujKwote(wydatek.kwotaGrosze)}</b></div>)}</section>
    </div>
  )
}

