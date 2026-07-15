# GT.Code Analytic CAD v1.0.0

Web app React + TypeScript per rappresentare curve matematiche su un canvas 2D e convertirne i punti campionati in un programma G-code.

## Contenuto del progetto

```text
gt-code-cad/
├── public/
│   ├── icons/
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Canvas.tsx
│   │   ├── FormulaPanel.tsx
│   │   ├── GCodeViewer.tsx
│   │   ├── Header.tsx
│   │   └── ToolPanel.tsx
│   ├── hooks/
│   │   ├── useCAD.ts
│   │   └── useGCode.ts
│   ├── utils/
│   │   ├── gcodeGenerator.ts
│   │   └── mathEngine.ts
│   ├── App.tsx
│   ├── index.css
│   └── index.tsx
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Requisiti

- Node.js 18 o superiore
- npm
- Un browser moderno
- Account GitHub, solo se si desidera pubblicare l'app

## Avvio locale

Aprire un terminale nella cartella del progetto ed eseguire:

```bash
npm install
npm start
```

L'ambiente di sviluppo apre normalmente l'app all'indirizzo:

```text
http://localhost:3000
```

## Build di produzione

```bash
npm run build
```

Il risultato viene creato nella cartella `build/`.

## Configurazione per GitHub Pages

Nel file `package.json` sostituire:

```json
"homepage": "https://yourusername.github.io/gt-code-cad"
```

con il proprio nome utente e il nome esatto del repository, per esempio:

```json
"homepage": "https://TUO_USERNAME.github.io/gt-code-cad"
```

Il nome del repository e quello presente nell'URL devono coincidere, incluse maiuscole, minuscole e trattini.

## Creazione del repository

### Metodo tramite sito GitHub

1. Accedere a GitHub.
2. Creare un nuovo repository.
3. Assegnargli il nome `gt-code-cad`.
4. Non aggiungere altri file iniziali se questa cartella contiene già README e `.gitignore`.

Quindi, dalla cartella del progetto:

```bash
git init
git add .
git commit -m "Initial commit - GT.Code CAD v1.0.0"
git branch -M main
git remote add origin https://github.com/TUO_USERNAME/gt-code-cad.git
git push -u origin main
```

## Deploy su GitHub Pages

Il pacchetto `gh-pages` e gli script necessari sono già dichiarati in `package.json`.

Eseguire:

```bash
npm run deploy
```

Lo script:

1. esegue automaticamente `npm run build`;
2. crea o aggiorna il branch `gh-pages`;
3. pubblica in quel branch il contenuto della cartella `build/`.

## Attivazione di GitHub Pages

Nel repository GitHub:

1. aprire `Settings`;
2. selezionare `Pages`;
3. in `Source` scegliere `Deploy from a branch`;
4. selezionare il branch `gh-pages`;
5. scegliere la cartella `/ (root)`;
6. salvare.

L'indirizzo finale avrà questa forma:

```text
https://TUO_USERNAME.github.io/gt-code-cad/
```

La prima pubblicazione può richiedere alcuni minuti.

## Installazione su iPhone

1. Aprire l'indirizzo pubblico dell'app in Safari.
2. Toccare il pulsante Condividi.
3. Selezionare `Aggiungi alla schermata Home`.
4. Confermare il nome.

Il manifest, i meta tag Apple e le icone PNG sono già inclusi.

## Design

- Tema scuro industriale.
- Accento arancio `#ff6b35`.
- Accento azzurro `#00d4ff`.
- Griglia tecnica su canvas.
- Layout adattivo per PC e iPhone.
- Supporto alle aree sicure di iOS.
- Pannello laterale con strumenti, formule, risultati, G-code ed esportazione.

## Funzioni presenti nel sorgente

- Rappresentazione di funzioni esplicite nel formato `y=...`.
- Campionamento dei punti della curva.
- Rappresentazione grafica su canvas 2D.
- Generazione di movimenti lineari G0/G1.
- Intestazione G21, G90 e G17.
- Download del progetto in formato `.gtcad`.
- Download del programma in formato `.nc`.
- Manifest PWA e icone per l'installazione sulla schermata Home.

## Nota tecnica importante

Questo archivio riproduce il prototipo descritto. I pulsanti Line, Circle, Arc, Rect, Trim, Offset e Measure selezionano lo strumento nell'interfaccia, ma le rispettive operazioni geometriche interattive non sono ancora implementate. Prima di usare un G-code su una macchina CNC occorre validarlo con simulazione, controllo quote, limiti macchina, origine pezzo, utensile, avanzamenti, profondità e procedure di sicurezza.

## Formule

L'implementazione principale accetta direttamente espressioni JavaScript semplici dopo `y=`. Esempi:

```text
y=x^2
y=2*x+3
y=x^3-4*x
```

Il modulo `src/utils/mathEngine.ts` mette inoltre a disposizione `mathjs` per una futura integrazione più completa di funzioni matematiche.

## File esportati

### Progetto GTCAD

Il file contiene:

- versione;
- elenco delle curve;
- equazione;
- punti;
- colore;
- data e ora di salvataggio.

### Programma NC

Il G-code usa:

- millimetri;
- coordinate assolute;
- piano XY;
- quota di sicurezza iniziale;
- discesa a Z -0.5;
- interpolazioni lineari tra i punti;
- rientro a Z 10;
- chiusura con M30.

I parametri sono dimostrativi e devono essere verificati e configurati in funzione della lavorazione reale.
