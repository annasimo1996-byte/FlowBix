# FlowBix 🚀

FlowBix è un'applicazione gestionale e CRM full-stack moderna, progettata per ottimizzare la gestione dei clienti, la pianificazione degli appuntamenti e il monitoraggio finanziario in tempo reale. 

Questo progetto rappresenta l'elaborato finale per il conseguimento del Master in **Web Developer FullStack**.

---

## 📱 Funzionalità Principali (Core Features)

- **Gestione Clienti (CRM):** Anagrafica completa dei clienti con viste ottimizzate per desktop (tabellare con troncamento del testo ed effetto *ellipsis*) e mobile (card responsive con dettagli a scomparsa).
- **Agenda & Appuntamenti:** Pianificazione avanzata e fluida con la possibilità di navigare e visualizzare gli impegni su base giornaliera (`DayView`), settimanale (`WeekView`) e mensile (`MonthView`).
- **Modali Intuitivi:** Flussi di lavoro rapidi e dinamici per la creazione, modifica ed eliminazione di clienti (`NewClientModal`) e appuntamenti (`AppointmentModal`) senza ricaricare la pagina.
- **Monitoraggio Finanziario:** Dashboard per il tracciamento di entrate e uscite con filtri temporali avanzati (mensile, range rapidi a 3/6/12 mesi e date personalizzate tramite *datepicker*).
- **Interfaccia Responsive & Dark Mode:** Design accattivante con palette scura ottimizzato nativamente per dispositivi mobile, tablet e desktop.

---

## 🛠️ Tech Stack

Il progetto è strutturato separando nettamente la logica di Backend (API RESTful) e Frontend (Single Page Application):

### Frontend
- **React** (funzionalità basate su Hooks, gestione degli stati e Context API per l'autenticazione)
- **Vite** (Build tool ad alte prestazioni)
- **Recharts** (Libreria integrata per la futura visualizzazione dei grafici statistici delle transazioni)
- **Bootstrap Icons** (Per una gestione pulita e moderna della libreria di icone di sistema)
- CSS3 personalizzato con approccio Mobile-First

### Backend
- **Node.js** & **Express** (Architettura solida divisa in moduli atomici: Controllers, Services, Schemas e Routes)
- **MongoDB** (Gestione database NoSQL tramite Mongoose)
- **Passport.js** (Strategie di autenticazione e protezione delle rotte tramite token JWT)

---

## ⚙️ Configurazione e Installazione Locale

Per avviare il progetto in locale sul tuo computer, segui questi passaggi:

### 1. Clonare la Repository
Inizia clonando il progetto sul tuo computer locale ed entrando nella cartella principale:
> git clone [https://github.com/annasimo1996-byte/FlowBix.git](https://github.com/annasimo1996-byte/FlowBix.git)
> cd FlowBix

### 2. Configurazione Backend
Entra nella cartella del backend ed installa le dipendenze:
> cd Backend
> npm install

Crea un file chiamato .env all'interno della cartella Backend e inserisci le seguenti configurazioni:
> PORT=9998
> MONGO_URI="mongodb+srv://AnnaSimo:BtE2FMfK1VNIWSYf@epibooks.z4vedwy.mongodb.net/flowbix"
> JWT_SECRET="f3b14d2e8fa69c10bc738d4e92a15f0b6e7d8c9b0a1f2e3d4c5b6a7f8e9d0c1b"

Ora puoi avviare il server di backend in modalità sviluppo:
> npm run dev

### 3. Configurazione Frontend
Apri un nuovo terminale, spostati nella cartella dedicata al frontend, installa i pacchetti necessari e lancia l'app:
> cd ../Frontend
> npm install
> npm run dev

---

## 📸 Anteprima Visuale (Screenshots)

Di seguito sono riportate alcune schermate dell'applicazione che ne mostrano l'interfaccia e la responsività:

*(Nota: Inserire gli screenshot del progetto).*

---

## 📄 Licenza

Questo progetto è distribuito sotto la **GNU Lesser General Public License v3.0** - consulta il file [LICENSE](LICENSE) per ulteriori dettagli.

---

## 👤 Autore

- **Anna Maria Simonetti** - *Sviluppatore Full-Stack* - [@annasimo1996-byte](https://github.com/annasimo1996-byte)