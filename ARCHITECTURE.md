# AI Image Model - Prompt Generator

## 🎨 Architettura del Progetto (JavaScript ES6)

Un generatore di prompt avanzato per modelli di immagini AI con focus su abbigliamento e aspetto. Interfaccia web interattiva con backend Node.js/Express e database SQLite.

### 📁 Struttura del Progetto

```
image-model-js/
├── package.json                 # Configurazione Node.js e dipendenze
├── index.html                   # Entry point frontend
├── styles.css                   # Stili globali con supporto tema scuro/chiaro
├── src/
│   ├── server/
│   │   ├── app.js               # Server Express.js con API REST
│   │   └── db.js                # Helper SQLite per persistenza preset
│   ├── lib/                     # Librerie client riutilizzabili
│   │   ├── promptGenerator.js   # Generatore di prompt (ES6 modules)
│   │   ├── storage.js           # Wrapper LocalStorage + autosave
│   │   ├── apiClient.js         # Client AJAX per API backend
│   │   └── i18n.js              # Helper traduzione/normalizzazione valori
│   ├── data/
│   │   └── outfits.js           # Database/preset outfit (seed presets)
│   └── ui/
│       └── app.js               # Controller UI (event handling, preview)
├── scripts/
│   └── smoke_db_test.js         # Test di integrazione API/database
├── tests/
│   └── promptGenerator.test.js  # Unit test per il generatore prompt
├── prompts.db                   # Database SQLite (creato automaticamente)
└── README.md                    # Documentazione del progetto
```

## 🚀 Avvio del Progetto

### 1. Installazione Dipendenze

```bash
npm install
```

### 2. Avvio del Server

```bash
# Avvio normale
npm start

# Modalità sviluppo (con watch)
npm run dev
```

Il server sarà disponibile su: `http://localhost:3000`

### 3. Test

```bash
# Test unitari
npm test

# Test di integrazione (smoke test)
npm run smoke-test
```

## 🎯 Funzionalità Principali

### ✨ Interfaccia Utente

- **Layout Responsive**: Sidebar form (40%) + Area preview (60%)
- **Tema Scuro/Chiaro**: Toggle automatico con persistenza
- **Autosave**: Salvataggio automatico dei dati del form
- **Preview Live**: Aggiornamento in tempo reale del prompt
- **Mappa Visuale Outfit**: Rappresentazione grafica dell'abbigliamento

### 👤 Sezioni Form

#### Identità
- Età, genere, etnia, professione
- Tags personalizzati e note
- Campi sensibili (opzionali, nascosti di default)

#### Aspetto
- Tipo di corpo, altezza, tonalità pelle
- Capelli: lunghezza, stile, colore, texture
- Colore occhi, makeup

#### Outfit
- Capo superiore: tipo, colore, lunghezza, scollatura
- Capo inferiore: tipo, colore
- Calzature: tipo, colore, altezza tacco
- Accessori e soprabiti

#### Scena
- Posa, location, orario, meteo
- Mood, illuminazione, tipo di inquadratura
- Sfondo personalizzabile

### 🔧 Tecnologie Backend

#### Server Express.js
- **API REST**: CRUD completo per preset
- **CORS**: Configurato per sviluppo cross-origin
- **Middleware**: Logging, parsing JSON, file statici
- **Error Handling**: Gestione errori centralizzata

#### Database SQLite
- **Tabelle**: `presets` con metadata (nome, categoria, tags)
- **Operazioni**: Create, Read, Update, Delete, Search
- **Batch Operations**: Creazione/eliminazione multipla
- **Export/Import**: JSON format con versioning

### 📡 API Endpoints

```
GET    /api/health              # Health check
GET    /api/presets             # Lista tutti i preset (con filtri)
GET    /api/presets/:id         # Singolo preset
POST   /api/presets             # Crea nuovo preset
PUT    /api/presets/:id         # Aggiorna preset
DELETE /api/presets/:id         # Elimina preset
POST   /api/presets/batch       # Creazione batch
DELETE /api/presets/batch       # Eliminazione batch
GET    /api/categories          # Lista categorie
GET    /api/tags                # Lista tags
GET    /api/export              # Export preset
POST   /api/import              # Import preset
```

### 🧩 Moduli JavaScript ES6

#### PromptGenerator
```javascript
import PromptGenerator from './src/lib/promptGenerator.js';

const generator = new PromptGenerator();
const result = generator.generate(formData);
// { prompt: "string", clothingMap: [...] }
```

#### Storage (LocalStorage)
```javascript
import Storage from './src/lib/storage.js';

const storage = new Storage();
storage.autosave(formData);
const presets = storage.loadPresets();
```

#### ApiClient
```javascript
import ApiClient from './src/lib/apiClient.js';

const client = new ApiClient();
const preset = await client.createPreset(data);
```

#### I18n (Normalizzazione)
```javascript
import I18n from './src/lib/i18n.js';

const i18n = new I18n('en');
const normalized = i18n.normalizeValue('v-neck'); // "v neck"
```

## 📋 Esempi di Utilizzo

### Generazione Prompt Completo

```javascript
const formData = {
    identity: {
        age: 28,
        gender: 'female',
        ethnicity: 'asian',
        profession: 'doctor'
    },
    appearance: {
        bodyType: 'slim',
        height: 'tall',
        hairLength: 'long',
        hairStyle: 'wavy',
        hairColor: 'black',
        eyeColor: 'brown',
        skinTone: 'fair',
        makeup: 'natural'
    },
    outfit: {
        torso: 'dress',
        torsoColor: 'red',
        torsoLength: 'midi',
        neckline: 'v-neck',
        footwear: 'heels',
        footwearColor: 'black',
        heelHeight: '4"',
        accessories: 'pearl necklace'
    },
    scene: {
        pose: 'standing',
        location: 'office',
        time: 'morning',
        mood: 'professional',
        lighting: 'natural',
        shotType: 'full-body'
    }
};

const generator = new PromptGenerator();
const result = generator.generate(formData);

console.log(result.prompt);
// "Female, 28 years old, asian, doctor, tall slim build, long wavy black hair, 
//  brown eyes, fair skin, natural makeup, wearing red midi dress with v neck, 
//  black heels (4") and pearl necklace, posed standing in office, at morning, 
//  natural lighting, full body shot, professional mood"
```

### Salvataggio Preset

```javascript
const apiClient = new ApiClient();

const preset = {
    name: 'Evening Elegant Look',
    category: 'outfit',
    data: formData,
    tags: ['evening', 'elegant', 'formal']
};

const response = await apiClient.createPreset(preset);
console.log('Preset saved with ID:', response.id);
```

### Mappa Visuale Outfit

```javascript
const result = generator.generate(formData);

result.clothingMap.forEach(area => {
    console.log(area.display);
});

// Output:
// "👤 HEAD: None"
// "👔 UPPER: None"  
// "👗 TORSO: red midi dress"
// "👖 LOWER: None"
// "🦵 LEGS: None"
// "👠 FEET: black heels (4")"
```

## 🎨 Personalizzazione UI

### CSS Variables per Theming

```css
:root {
    --primary-color: #3b82f6;
    --background-color: #ffffff;
    --surface-color: #f8fafc;
    --text-color: #1e293b;
    /* ... */
}

[data-theme="dark"] {
    --background-color: #0f172a;
    --surface-color: #1e293b;
    --text-color: #f1f5f9;
    /* ... */
}
```

### Event Handling

```javascript
// Auto-update del preview sui cambiamenti form
document.addEventListener('input', (e) => {
    if (e.target.matches('input, select, textarea')) {
        appController.handleFormChange(e.target);
    }
});

// Shortcuts da tastiera
// Ctrl+S: Save
// Ctrl+E: Export  
// Ctrl+R: Clear (override default)
// Escape: Close modal
```

## 🧪 Testing

### Unit Tests
```bash
npm test
# Testa PromptGenerator con vari scenari
```

### Integration Tests
```bash
npm run smoke-test
# Testa API endpoints e database operations
```

### Coverage Test Principali
- ✅ Generazione prompt con dati minimi
- ✅ Generazione prompt completa
- ✅ Gestione abiti che coprono parti inferiori
- ✅ Mappa visuale outfit
- ✅ Campi sensibili (on/off)
- ✅ Normalizzazione valori
- ✅ Gestione valori vuoti/null
- ✅ API CRUD operations
- ✅ Batch operations
- ✅ Search e filtering

## 🔧 Configurazione Avanzata

### Opzioni PromptGenerator

```javascript
const options = {
    includeSensitive: false,  // Include campi sensibili
    language: 'en'           // Lingua per normalizzazione
};

const generator = new PromptGenerator(options);
```

### Configurazione Storage

```javascript
const storageOptions = {
    keyPrefix: 'aiPrompt_',
    autosaveKey: 'currentForm',
    autosaveDelay: 1000
};

const storage = new Storage(storageOptions);
```

### Configurazione Server

```javascript
const serverOptions = {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
};

const server = new Server(serverOptions);
```

## 📚 Architettura e Design Patterns

### Module Pattern (ES6)
- Ogni componente è un modulo ES6 indipendente
- Import/export espliciti per dependencies
- Namespace isolation per prevenire conflitti

### Observer Pattern  
- Event-driven UI updates
- Form changes → Preview updates
- Debounced autosave

### Factory Pattern
- PromptGenerator genera oggetti strutturati
- Database factory per diverse configurazioni

### Repository Pattern
- Storage abstraction per LocalStorage
- ApiClient abstraction per HTTP requests
- Database class per SQLite operations

## 🛠️ Sviluppo e Contributi

### Setup Ambiente di Sviluppo

```bash
# Clone e setup
git clone <repository>
cd image-model-js
npm install

# Sviluppo con hot reload
npm run dev

# Debug database
# Il file prompts.db viene creato automaticamente
# Usa qualsiasi SQLite browser per ispezionare
```

### Struttura per Nuove Features

1. **Backend**: Aggiungi endpoint in `src/server/app.js`
2. **Database**: Estendi `src/server/db.js` per nuove queries
3. **Frontend**: Aggiungi logica in `src/ui/app.js`
4. **Lib**: Crea moduli riutilizzabili in `src/lib/`
5. **Tests**: Aggiungi test in `tests/`

### Best Practices

- ✅ Usa ES6 modules e async/await
- ✅ Implementa error handling appropriato
- ✅ Scrivi test per nuove funzionalità
- ✅ Segui la struttura CSS con variabili
- ✅ Documenta le API nel codice
- ✅ Usa semantic versioning per releases

---

**🎯 Obiettivo**: Fornire un tool professionale e user-friendly per la generazione di prompt AI, con architettura modulare e scalabile per future estensioni.
