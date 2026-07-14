# Review boot iniziale e autenticazione senza flash bianco

Analisi mirata al refresh pagina, caricamento iniziale React, `AuthContext.jsx`, `App.jsx`, montaggio delle rotte e uso di `localStorage`/token asincrono. Non sono stati applicati fix al codice: questo file contiene problemi e soluzioni proposte con file e righe.

## Diagnosi sintetica

Il flash/schermata povera durante refresh nasce dal fatto che l'intero albero di routing viene bloccato da `loading` in `App.jsx`. Gli stili globali sono importati da `main.jsx`, quindi il `body` ha gia un colore scuro, ma il layout principale (`AppLayout`, sidebar, navbar, area contenuto) non viene montato finche `AuthContext` non completa la verifica asincrona del token.

La soluzione consigliata e separare:

- bootstrap visivo immediato: router, shell/layout e stili sempre montati;
- bootstrap auth: lettura sincrona da `localStorage` come stato iniziale ottimistico;
- verifica token: asincrona e non bloccante per l'intero DOM;
- protezione rotte: gestita a livello di route/layout, non con un `return` globale che smonta tutto.

## Problemi e soluzioni

### 1. `App.jsx` blocca tutto il DOM applicativo durante `loading`

- File: `Frontend/src/App.jsx`
- Righe: 14-22

**Problema**
`App` legge `loading` dal context e, se `true`, ritorna solo un `div` inline:

```jsx
if (loading) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Caricamento in corso...</p>
    </div>
  )
}
```

Questo impedisce il montaggio immediato di `BrowserRouter`, `Routes`, `AppLayout`, sidebar, navbar e area contenuto. Il risultato percepito puo essere una schermata vuota, troppo minimale o un cambio visivo netto appena finisce la verifica token.

**Soluzione proposta**
Rimuovere il `return` globale basato su `loading`. `BrowserRouter` e `Routes` devono essere renderizzati sempre. La gestione di `loading` va spostata in componenti di route guard o in uno stato visuale dentro il layout.

Esempio di struttura proposta:

```jsx
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route element={<ProtectedShell />}>
          <Route path="/" element={<DashboardView />} />
          <Route path="/clients" element={<ClientsView />} />
          <Route path="/appointments" element={<AppointmentsView />} />
          <Route path="/finance" element={<FinanceView />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
```

`ProtectedShell` decide cosa fare, ma non deve lasciare una pagina bianca: puo montare `AppLayout` subito se esiste una sessione cached, oppure mostrare una shell/login coerente.

### 2. Stato auth iniziale non deriva in modo sincrono da `localStorage`

- File: `Frontend/src/context/AuthContext.jsx`
- Righe: 7-9, 15-28

**Problema**
Gli stati iniziali sono:

```js
const [isLogged, setIsLogged] = useState(false)
const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)
```

La lettura di `localStorage` avviene solo dentro `useEffect`, quindi solo dopo il primo render. Anche se esistono token e utente salvati, il primo render parte da `isLogged=false`. Al momento `App.jsx` nasconde il problema bloccando tutto con `loading`, ma questo e proprio cio che crea un boot visivo debole.

**Soluzione proposta**
Usare inizializzatori lazy di `useState` o una funzione `readStoredSession()` eseguita durante la prima renderizzazione, cosi lo stato cached e disponibile subito:

```js
const initialSession = readStoredSession()
const [token, setToken] = useState(initialSession.token)
const [user, setUser] = useState(initialSession.user)
const [authStatus, setAuthStatus] = useState(
  initialSession.token ? 'checking' : 'anonymous'
)
```

Poi derivare:

```js
const isLogged = Boolean(token && user)
const isChecking = authStatus === 'checking'
```

In questo modo, se localStorage contiene una sessione plausibile, il layout protetto puo comparire immediatamente mentre `/users/me` verifica il token in background.

### 3. Il controllo asincrono del token decide anche il rendering globale

- File: `Frontend/src/context/AuthContext.jsx`
- Righe: 30-54
- File: `Frontend/src/App.jsx`
- Righe: 14-22, 38-45

**Problema**
La verifica `/users/me` e corretta come concetto, ma il suo stato `loading` blocca tutto il rendering di `App`. Questo accoppia una chiamata di rete potenzialmente lenta alla disponibilita della shell visiva.

**Soluzione proposta**
La verifica token deve aggiornare solo lo stato auth:

- se valida: sostituisce `user` cached con dati freschi;
- se 401/403 o token invalido: pulisce storage e imposta `anonymous`;
- se network error temporaneo: non deve necessariamente cancellare subito la sessione cached; puo lasciare l'utente nella shell e mostrare stato offline/errore non bloccante.

Il rendering globale non deve aspettare questa promise. Il controllo va gestito dalla route protetta:

```jsx
function ProtectedShell() {
  const { isLogged, authStatus } = useContext(AuthContext)

  if (isLogged) {
    return <AppLayout authStatus={authStatus} />
  }

  if (authStatus === 'checking') {
    return <AppShellSkeleton />
  }

  return <Navigate to="/login" replace />
}
```

### 4. `AbortController` creato ma non abortito nel cleanup

- File: `Frontend/src/context/AuthContext.jsx`
- Righe: 11-13, 57-58

**Problema**
Il context crea un `AbortController` e passa `signal` a `sendRequest`, ma l'effect non ritorna una cleanup:

```js
useEffect(() => {
  const controller = new AbortController()
  ...
  initializeAuth()
}, [])
```

In React StrictMode, durante lo sviluppo, gli effect possono essere montati/smontati/rimontati per individuare side effect non sicuri. Senza cleanup, una verifica precedente puo completare dopo una verifica successiva e aggiornare stato fuori ordine.

**Soluzione proposta**
Aggiungere cleanup:

```js
useEffect(() => {
  const controller = new AbortController()
  initializeAuth(controller.signal)
  return () => controller.abort()
}, [])
```

Nel `catch`, ignorare `AbortError` senza pulire token o mostrare warning.

### 5. Manca una guardia contro risposte obsolete della validazione token

- File: `Frontend/src/context/AuthContext.jsx`
- Righe: 15-39, 60-72

**Problema**
Durante `initializeAuth`, viene letto il token iniziale da `localStorage`. Se l'utente fa logout/login mentre `/users/me` e ancora in corso, la risposta vecchia puo arrivare dopo e aggiornare `user` o `localStorage` con dati non piu coerenti.

**Soluzione proposta**
Dopo `await sendRequest`, prima di fare `setUser` e `localStorage.setItem`, verificare che il token validato sia ancora quello attuale:

```js
const tokenAtStart = token
...
if (localStorage.getItem('token') !== tokenAtStart) return
```

Meglio ancora: tenere il token nello stato React e confrontare con un `requestIdRef` incrementale per ogni login/logout/verifica.

### 6. `loading` ha semantica troppo larga

- File: `Frontend/src/context/AuthContext.jsx`
- Righe: 9, 18-20, 50-53, 75
- File: `Frontend/src/App.jsx`
- Righe: 14-22

**Problema**
`loading` oggi significa tutto: sto leggendo storage, sto validando token, sto decidendo se posso montare le rotte. Questa semantica spinge a bloccare l'intera app.

**Soluzione proposta**
Sostituire o affiancare `loading` con uno stato piu esplicito:

```js
authStatus: 'anonymous' | 'checking' | 'authenticated'
```

Oppure:

```js
isBootstrapped
isVerifyingToken
hasCachedSession
```

Per eliminare flash bianchi, il punto chiave e che `isVerifyingToken` non deve impedire il render del layout.

### 7. `main.jsx` monta `AuthProvider` sopra tutta l'app, ma il router non e parte della shell stabile

- File: `Frontend/src/main.jsx`
- Righe: 9-14
- File: `Frontend/src/App.jsx`
- Righe: 25-52

**Problema**
`AuthProvider` avvolge `App`, va bene. Il problema e che dentro `App` il router viene montato solo dopo `loading`. Quindi ogni refresh passa da "solo loader" a "intera app". Anche se non e tecnicamente una pagina bianca, e un cambio di albero DOM completo.

**Soluzione proposta**
Lasciare `AuthProvider` in `main.jsx`, ma assicurarsi che `App` monti subito `BrowserRouter`. Se si vuole una shell ancora piu stabile, si puo introdurre un componente root:

```jsx
function RootShell() {
  return (
    <div className="appRoot">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  )
}
```

`appRoot` puo avere background, min-height e colori globali, cosi il primo paint e coerente anche prima che le route interne decidano cosa mostrare.

### 8. Gli stili del layout esistono, ma il layout non viene usato come fallback visivo

- File: `Frontend/src/layout/AppLayout.jsx`
- Righe: 18-35
- File: `Frontend/src/layout/AppLayout.css`
- Righe: 2-24
- File: `Frontend/src/App.jsx`
- Righe: 16-22

**Problema**
`AppLayout` definisce una shell scura stabile (`screenContainer`, `rightContentWrapper`, `pageDynamicArea`), ma durante `loading` non viene montata. Il loader inline di `App.jsx` non usa queste classi e non preserva struttura, navbar, sidebar o area contenuto.

**Soluzione proposta**
Creare un fallback visuale coerente usando la stessa struttura:

```jsx
function AppShellSkeleton() {
  return (
    <div className="screenContainer">
      <div className="rightContentWrapper">
        <main className="pageDynamicArea">
          <div className="bootLoader">Caricamento...</div>
        </main>
      </div>
    </div>
  )
}
```

Ancora meglio: se c'e una sessione cached, montare direttamente `AppLayout` e mostrare uno skeleton solo dentro `<Outlet />` o nella pagina corrente.

### 9. Il fallback route puo amplificare redirect visivi durante boot

- File: `Frontend/src/App.jsx`
- Righe: 47-48

**Problema**
La route `*` fa sempre `<Navigate to="/" />`. Durante stati auth non ancora stabilizzati, un path sconosciuto o una navigazione iniziale puo innescare redirect e poi un secondo redirect verso `/login`.

**Soluzione proposta**
Usare `replace` su tutti i redirect auth/fallback e lasciare che le route guard decidano in base a `authStatus`:

```jsx
<Navigate to="/" replace />
<Navigate to="/login" replace />
```

Questo non elimina da solo il flash, ma riduce flicker e history entries inutili.

## Struttura consigliata

### AuthContext

- Leggere `localStorage` sincronicamente con una funzione sicura.
- Esporre `authStatus`, `isLogged`, `user`, `isVerifyingToken`.
- Avviare `/users/me` in background se c'e un token.
- Non bloccare l'intero albero React durante la verifica.
- Abortire la request nel cleanup.
- Ignorare risposte obsolete confrontando token/request id.

### App

- Montare sempre `BrowserRouter`.
- Non fare `return` globale se `loading`.
- Delegare le decisioni a `PublicRoute` e `ProtectedShell`.
- Usare `replace` nei redirect.

### ProtectedShell

- Se c'e sessione cached: montare subito `AppLayout`.
- Se non c'e sessione e auth e ancora in stato iniziale: mostrare una shell/skeleton scura, non pagina bianca.
- Se auth e anonymous: redirect a `/login`.
- Se il token viene invalidato dopo verifica: pulire storage e navigare a login.

### Layout e CSS

- Aggiungere una classe root stabile (`appRoot` o `bootShell`) in `index.css`.
- Riutilizzare `screenContainer`/`pageDynamicArea` per fallback e skeleton.
- Evitare loader inline con stili hardcoded dentro `App.jsx`.

## Sequenza di fix proposta

1. Modificare `AuthContext.jsx` righe 7-9 e 15-58 per stato iniziale sincrono da `localStorage`, `authStatus`, cleanup `AbortController` e guardia token obsoleto.
2. Modificare `App.jsx` righe 14-22 eliminando il blocco globale e introducendo `PublicRoute`/`ProtectedShell`.
3. Modificare `App.jsx` righe 30-48 per usare route guard e redirect con `replace`.
4. Aggiungere uno skeleton/shell coerente in `App.jsx` o in un nuovo componente, riusando classi di `AppLayout.css`.
5. Aggiornare `index.css` righe 8-14 con eventuale `html`, `body`, `#root` e `.appRoot` a `min-height: 100vh` e background stabile.

## Nota finale

Il disallineamento principale c'e: lo stato auth viene risolto dopo il primo render, ma il router protetto dipende da quello stato. La soluzione attuale evita il redirect sbagliato bloccando tutto, pero sacrifica il primo paint della shell. La soluzione migliore e rendere immediata la cornice dell'app e trattare la verifica token come stato interno/non bloccante, con route guard piu granulari.
