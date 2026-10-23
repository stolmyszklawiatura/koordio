import { useEffect, useState, type FormEvent } from 'react'
import { RozliczeniaPanel } from './funkcje/rozliczenia/Rozliczenia'
import { ZadaniaPanel } from './funkcje/zadania/Zadania'
import { wczytajDane, zapiszDane } from './funkcje/wydarzenia/magazyn'
import type { DaneAplikacji, Ogloszenie, Wydarzenie, Wydatek, Zadanie } from './funkcje/wydarzenia/typy'
import { formatujDate, formatujKwote, inicjaly, noweId } from './funkcje/wydarzenia/typy'
import './App.css'

type Widok = 'pulpit' | 'wydarzenie' | 'zadania' | 'rozliczenia'

const dzisiaj = () => {
  const data = new Date()
  return [data.getFullYear(), `${data.getMonth() + 1}`.padStart(2, '0'), `${data.getDate()}`.padStart(2, '0')].join('-')
}

function App() {
  const [dane, setDane] = useState<DaneAplikacji>(wczytajDane)
  const [widok, setWidok] = useState<Widok>('pulpit')
  const [pokazNoweWydarzenie, setPokazNoweWydarzenie] = useState(false)
  const [zapisLokalny, setZapisLokalny] = useState(true)

  useEffect(() => {
    setZapisLokalny(zapiszDane(dane))
  }, [dane])

  const wydarzenie = dane.wydarzenia.find((element) => element.id === dane.aktywneWydarzenieId) ?? null
  const aktualizujWydarzenie = (zmien: (bieżące: Wydarzenie) => Wydarzenie) => {
    if (!wydarzenie) return
    setDane((bieżące) => ({
      ...bieżące,
      wydarzenia: bieżące.wydarzenia.map((element) => element.id === wydarzenie.id ? zmien(element) : element),
    }))
  }

  const dodajWydarzenie = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const pola = new FormData(event.currentTarget)
    const nazwa = String(pola.get('nazwa') ?? '').trim()
    if (!nazwa) return
    const id = noweId()
    const nowe: Wydarzenie = {
      id,
      nazwa,
      miejsce: String(pola.get('miejsce') ?? '').trim(),
      data: String(pola.get('data') ?? ''),
      uczestnicy: [{ id: noweId(), imie: 'Jakub', rola: 'organizator' }],
      ogloszenia: [],
      zadania: [],
      wydatki: [],
    }
    setDane((bieżące) => ({ wydarzenia: [nowe, ...bieżące.wydarzenia], aktywneWydarzenieId: id }))
    setWidok('wydarzenie')
    setPokazNoweWydarzenie(false)
  }

  const dodajUczestnika = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formularz = new FormData(event.currentTarget)
    const imie = String(formularz.get('imie') ?? '').trim()
    if (!imie) return
    aktualizujWydarzenie((bieżące) => ({ ...bieżące, uczestnicy: [...bieżące.uczestnicy, { id: noweId(), imie, rola: 'uczestnik' }] }))
    event.currentTarget.reset()
  }

  const dodajZadanie = (zadanie: Zadanie) => aktualizujWydarzenie((bieżące) => ({ ...bieżące, zadania: [...bieżące.zadania, zadanie] }))
  const dodajOgloszenie = (ogloszenie: Ogloszenie) => aktualizujWydarzenie((bieżące) => ({ ...bieżące, ogloszenia: [...bieżące.ogloszenia, ogloszenie] }))
  const dodajWydatek = (wydatek: Wydatek) => aktualizujWydarzenie((bieżące) => ({ ...bieżące, wydatki: [...bieżące.wydatki, wydatek] }))
  const zmienStatus = (id: string, status: Zadanie['status']) => aktualizujWydarzenie((bieżące) => ({
    ...bieżące,
    zadania: bieżące.zadania.map((zadanie) => zadanie.id === id ? { ...zadanie, status } : zadanie),
  }))

  const wybierzWydarzenie = (id: string) => setDane((bieżące) => ({ ...bieżące, aktywneWydarzenieId: id || null }))
  const otwarteZadania = wydarzenie?.zadania.filter((zadanie) => zadanie.status !== 'zrobione').length ?? 0
  const sumaWydatkow = wydarzenie?.wydatki.reduce((suma, wydatek) => suma + wydatek.kwotaGrosze, 0) ?? 0

  return (
    <div className="aplikacja">
      <aside className="panel-boczny">
        <a className="marka" href="#pulpit" onClick={(event) => { event.preventDefault(); setWidok('pulpit') }}>
          <span className="znak-marki">k</span><span>koordio<span className="kropka-marki">.</span></span>
        </a>

        <div className="wybor-wydarzenia">
          <label htmlFor="wybor-wydarzenia">AKTYWNE WYDARZENIE</label>
          <select id="wybor-wydarzenia" value={wydarzenie?.id ?? ''} onChange={(event) => wybierzWydarzenie(event.target.value)}>
            <option value="">Wybierz wydarzenie</option>
            {dane.wydarzenia.map((element) => <option value={element.id} key={element.id}>{element.nazwa}</option>)}
          </select>
          <button className="dodaj-wydarzenie-boczne" onClick={() => setPokazNoweWydarzenie(true)}><span>＋</span> Nowe wydarzenie</button>
        </div>

        <nav className="nawigacja" aria-label="Główna nawigacja">
          <p className="etykieta-nawigacji">MENU</p>
          <button className={`link-nawigacji ${widok === 'pulpit' ? 'link-aktywny' : ''}`} onClick={() => setWidok('pulpit')}><span className="ikona-nav">⌂</span>Pulpit</button>
          <button className={`link-nawigacji ${widok === 'wydarzenie' ? 'link-aktywny' : ''}`} onClick={() => setWidok('wydarzenie')} disabled={!wydarzenie}><span className="ikona-nav">◫</span>Wydarzenie</button>
          <button className={`link-nawigacji ${widok === 'zadania' ? 'link-aktywny' : ''}`} onClick={() => setWidok('zadania')} disabled={!wydarzenie}><span className="ikona-nav">☷</span>Zadania i ogłoszenia{otwarteZadania > 0 && <span className="znacznik-nav">{otwarteZadania}</span>}</button>
          <button className={`link-nawigacji ${widok === 'rozliczenia' ? 'link-aktywny' : ''}`} onClick={() => setWidok('rozliczenia')} disabled={!wydarzenie}><span className="ikona-nav">◉</span>Rozliczenia</button>
        </nav>

        <div className="pomoc-boczna"><span className="pomoc-ikona">✦</span><strong>Wszystko w jednym miejscu</strong><p>Ogarnijcie wydarzenie razem — bez wiadomości, które giną w czacie.</p><button onClick={() => setWidok('wydarzenie')}>Zobacz wydarzenie <span>→</span></button></div>
        <div className="profil"><span className="avatar avatar-ja">JK</span><span><strong>Jakub</strong><small>Organizator</small></span><button className="profil-menu" aria-label="Menu profilu">···</button></div>
      </aside>

      <main className="obszar-glowny">
        <header className="pasek-gorny">
          <div className="okruszki"><span>Twoja przestrzeń</span><span className="okruszek-separator">/</span><strong>{wydarzenie?.nazwa ?? 'Wydarzenia'}</strong></div>
          <div className="pasek-akcje"><span className={`status-zapisu ${zapisLokalny ? '' : 'status-zapisu-blad'}`}><i />{zapisLokalny ? 'Zapis lokalny' : 'Błąd zapisu'}</span><span className="separator-paska" /><button className="avatar avatar-ja avatar-maly" aria-label="Profil Jakuba">JK</button></div>
        </header>

        {!wydarzenie ? (
          <section className="pusty-start">
            <div className="pusty-rysunek"><span>✳</span><span>＋</span><span>↗</span></div>
            <p className="nadtytul">ZACZNIJ OD WSPÓLNEGO PLANU</p>
            <h1>Każde dobre wydarzenie<br />zaczyna się od planu.</h1>
            <p>Utwórz wydarzenie, zaproś ekipę i zbierz wszystko w jednym miejscu.</p>
            <button className="przycisk przycisk-glowny" onClick={() => setPokazNoweWydarzenie(true)}>＋ Utwórz pierwsze wydarzenie</button>
          </section>
        ) : (
          <div className="zawartosc">
            {widok === 'pulpit' && <>
              <section className="powitanie">
                <div><p className="nadtytul">{new Intl.DateTimeFormat('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}</p><h1>Cześć, Jakub <span>✳</span></h1><p>Oto co dzieje się w Twojej ekipie.</p></div>
                <button className="przycisk przycisk-glowny" onClick={() => setPokazNoweWydarzenie(true)}>＋ Nowe wydarzenie</button>
              </section>

              <section className="hero-wydarzenie">
                <div className="hero-swiatlo" />
                <div className="hero-tekst"><span className="etykieta-hero"><i /> NAJBLIŻSZE WYDARZENIE</span><h2>{wydarzenie.nazwa}</h2><p><span>⌖</span> {wydarzenie.miejsce || 'Miejsce do ustalenia'} <span className="hero-kropka">·</span> <span>▦</span> {formatujDate(wydarzenie.data)}</p><button onClick={() => setWidok('wydarzenie')}>Otwórz wydarzenie <span>→</span></button></div>
                <div className="hero-ksiezyc" aria-hidden="true"><span>✳</span></div>
                <div className="hero-uczestnicy"><span className="avatar-stos">{wydarzenie.uczestnicy.slice(0, 3).map((osoba, index) => <i className={`avatar avatar-stos-${index}`} key={osoba.id}>{inicjaly(osoba.imie)}</i>)}</span><strong>{wydarzenie.uczestnicy.length}</strong><small>uczestników</small></div>
              </section>

              <section className="kafelki-podsumowania">
                <article className="karta kafel-podsumowania"><span className="ikona-karty ikona-fioletowa">♙</span><div><p>Ekipa</p><strong>{wydarzenie.uczestnicy.length}<small> osób</small></strong></div><button aria-label="Zobacz uczestników" onClick={() => setWidok('wydarzenie')}>↗</button></article>
                <article className="karta kafel-podsumowania"><span className="ikona-karty ikona-zolta">☷</span><div><p>Do zrobienia</p><strong>{otwarteZadania}<small> zadań</small></strong></div><button aria-label="Zobacz zadania" onClick={() => setWidok('zadania')}>↗</button></article>
                <article className="karta kafel-podsumowania"><span className="ikona-karty ikona-zielona">↗</span><div><p>Wspólne wydatki</p><strong>{formatujKwote(sumaWydatkow)}</strong></div><button aria-label="Zobacz rozliczenia" onClick={() => setWidok('rozliczenia')}>↗</button></article>
              </section>

              <section className="pulpit-dol">
                <div className="karta karta-szybkie-zadania"><div className="karta-naglowek"><div><p className="nadtytul">MAŁE KROKI, DOBRY PLAN</p><h3>Najbliższe zadania</h3></div><button className="przycisk-tekstowy" onClick={() => setWidok('zadania')}>Wszystkie <span>→</span></button></div>
                  {wydarzenie.zadania.filter((zadanie) => zadanie.status !== 'zrobione').slice(0, 3).map((zadanie) => { const osoba = wydarzenie.uczestnicy.find((element) => element.id === zadanie.uczestnikId); return <div className="szybkie-zadanie" key={zadanie.id}><span className="kropka-zadania" /><div><strong>{zadanie.tytul}</strong><small>{osoba?.imie ?? 'Bez przypisania'}{zadanie.termin ? ` · ${formatujDate(zadanie.termin)}` : ''}</small></div><button onClick={() => { zmienStatus(zadanie.id, 'zrobione') }} aria-label={`Oznacz ${zadanie.tytul} jako zrobione`}>✓</button></div> })}
                  {wydarzenie.zadania.filter((zadanie) => zadanie.status !== 'zrobione').length === 0 && <p className="pusta-lista">Wszystkie zadania są zrobione. Dobra robota!</p>}
                </div>
                <div className="karta karta-ostatnie-ogloszenia"><div className="karta-naglowek"><div><p className="nadtytul">WAŻNE DLA EKIPY</p><h3>Ogłoszenia</h3></div><span className="ikona-karty ikona-zolta">✳</span></div>
                  {[...wydarzenie.ogloszenia].reverse().slice(0, 2).map((ogloszenie) => <article className="mini-ogloszenie" key={ogloszenie.id}><span className="mini-ozdobnik" /><div><strong>{ogloszenie.tytul}</strong><p>{ogloszenie.tresc}</p></div></article>)}
                  {wydarzenie.ogloszenia.length === 0 && <p className="pusta-lista">Tu pojawią się ważne wiadomości od organizatora.</p>}
                  <button className="przycisk-tekstowy" onClick={() => setWidok('zadania')}>Otwórz ogłoszenia <span>→</span></button>
                </div>
              </section>
              <p className="notka-prototypu">Prototyp zapisuje dane lokalnie w tej przeglądarce. Nie są synchronizowane z innymi urządzeniami.</p>
            </>}

            {widok === 'wydarzenie' && <section className="strona-modulu">
              <div className="naglowek-modulu"><div><p className="nadtytul">PRZESTRZEŃ TWOJEJ EKIPY</p><h2>{wydarzenie.nazwa}</h2><p className="opis-strony">{wydarzenie.miejsce || 'Miejsce do ustalenia'} <span>·</span> {formatujDate(wydarzenie.data)}</p></div><button className="przycisk przycisk-jasny" onClick={() => setPokazNoweWydarzenie(true)}>＋ Nowe wydarzenie</button></div>
              <div className="karta sekcja-uczestnikow"><div className="karta-naglowek"><div><p className="nadtytul">RAZEM RAŹNIEJ</p><h3>Uczestnicy <span className="licznik">{wydarzenie.uczestnicy.length}</span></h3></div></div>
                <div className="lista-uczestnikow">{wydarzenie.uczestnicy.map((osoba, index) => <div className="uczestnik-wiersz" key={osoba.id}><span className={`avatar avatar-osoba avatar-kolor-${index % 4}`}>{inicjaly(osoba.imie)}</span><div><strong>{osoba.imie}</strong><small>{osoba.rola === 'organizator' ? 'Organizator wydarzenia' : 'Uczestnik'}</small></div><span className={`rola ${osoba.rola === 'organizator' ? 'rola-organizator' : ''}`}>{osoba.rola}</span></div>)}</div>
                <form className="formularz-dodaj-osobe" onSubmit={dodajUczestnika}><label htmlFor="imie-uczestnika">Dodaj osobę do ekipy</label><div><input id="imie-uczestnika" name="imie" required maxLength={60} placeholder="Wpisz imię i nazwisko" /><button className="przycisk przycisk-glowny" type="submit">＋ Dodaj uczestnika</button></div><small>W prototypie uczestnicy są dodawani lokalnie, bez wysyłania zaproszenia.</small></form>
              </div>
              <div className="karta szczegoly-wydarzenia"><div className="karta-naglowek"><div><p className="nadtytul">SZCZEGÓŁY</p><h3>Plan w skrócie</h3></div></div><div className="szczegoly-siatka"><div><span className="szczegol-ikona">▦</span><small>Data</small><strong>{formatujDate(wydarzenie.data)}</strong></div><div><span className="szczegol-ikona">⌖</span><small>Miejsce</small><strong>{wydarzenie.miejsce || 'Do ustalenia'}</strong></div><div><span className="szczegol-ikona">♙</span><small>Organizator</small><strong>{wydarzenie.uczestnicy.find((osoba) => osoba.rola === 'organizator')?.imie ?? 'Nie przypisano'}</strong></div></div></div>
            </section>}

            {widok === 'zadania' && <ZadaniaPanel uczestnicy={wydarzenie.uczestnicy} zadania={wydarzenie.zadania} ogloszenia={wydarzenie.ogloszenia} dodajZadanie={dodajZadanie} zmienStatus={zmienStatus} dodajOgloszenie={dodajOgloszenie} />}
            {widok === 'rozliczenia' && <RozliczeniaPanel uczestnicy={wydarzenie.uczestnicy} wydatki={wydarzenie.wydatki} dodajWydatek={dodajWydatek} />}
          </div>
        )}
      </main>

      {pokazNoweWydarzenie && <div className="tlo-modalu" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPokazNoweWydarzenie(false) }}><form className="modal" onSubmit={dodajWydarzenie}><div className="modal-gora"><span className="ikona-karty ikona-fioletowa">✳</span><button type="button" className="zamknij-modal" aria-label="Zamknij" onClick={() => setPokazNoweWydarzenie(false)}>×</button></div><p className="nadtytul">NOWY WSPÓLNY PLAN</p><h2>Co organizujemy?</h2><p className="opis-strony">Utwórz przestrzeń i zbierz ekipę wokół wydarzenia.</p><label>Nazwa wydarzenia<input name="nazwa" autoFocus required maxLength={100} placeholder="Np. Weekend w górach" /></label><label>Miejsce<input name="miejsce" maxLength={100} placeholder="Np. Szczyrk" /></label><label>Data<input name="data" type="date" min={dzisiaj()} /></label><div className="modal-akcje"><button className="przycisk przycisk-jasny" type="button" onClick={() => setPokazNoweWydarzenie(false)}>Anuluj</button><button className="przycisk przycisk-glowny" type="submit">Utwórz wydarzenie <span>→</span></button></div></form></div>}
    </div>
  )
}

export default App

