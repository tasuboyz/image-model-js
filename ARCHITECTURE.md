# 🏗️ Architettura del Progetto - Image Prompt Builder

## 📋 Panoramica
Il **Image Prompt Builder** è un'applicazione web full-stack per la generazione di prompt AI per modelli umani con outfit consistenti. L'architettura segue il pattern MVC con separazione chiara tra frontend e backend.

## 🗂️ Struttura File

```
image-model-js/
├── 📄 index.html              # Template HTML principale
├── 🎨 styles.css             # Foglio di stile principale
├── ⚡ app.js                 # Logica frontend JavaScript
├── 🐍 app.py                 # Server Flask (backend)
├── 📦 requirements.txt       # Dipendenze Python
├── 📖 README.md              # Documentazione principale
├── 📝 PROJECT_PLAN.md        # Piano di sviluppo
├── ✨ FEATURES.md            # Lista delle funzionalità
└── 🏗️ ARCHITECTURE.md       # Questo file
```

## 🏛️ Architettura del Sistema

### 🎭 Frontend (Client-Side)
```
┌─────────────────────────────────────────┐
│             PRESENTATION LAYER           │
├─────────────────────────────────────────┤
│ index.html                              │
│ ├── Header (Navigation, Presets)        │
│ ├── Sidebar (Form Tabs)                 │
│ │   ├── Identity Tab                    │
│ │   ├── Appearance Tab                  │
│ │   ├── Clothing Tab                    │
│ │   └── Scene Tab                       │
│ └── Main Panel                          │
│     ├── Live Preview                    │
│     ├── Visual Clothing Map             │
│     ├── Quick Actions                   │
│     └── Saved Prompts                   │
└─────────────────────────────────────────┘
```

### 🎨 Styling Layer
```
┌─────────────────────────────────────────┐
│              STYLE LAYER                │
├─────────────────────────────────────────┤
│ styles.css                              │
│ ├── 🌀 Glassmorphism Effects           │
│ ├── 🎨 Gradient Backgrounds            │
│ ├── ✨ Animations & Transitions        │
│ ├── 📱 Responsive Design               │
│ ├── 🎛️ Form Components                 │
│ └── ♿ Accessibility Features          │
└─────────────────────────────────────────┘
```

### ⚡ Logic Layer
```
┌─────────────────────────────────────────┐
│             BUSINESS LOGIC              │
├─────────────────────────────────────────┤
│ app.js                                  │
│ ├── 🏪 appState (Application State)     │
│ ├── 🛠️ Utils (Utility Functions)        │
│ ├── 💾 Storage (LocalStorage Manager)   │
│ ├── 🤖 PromptGenerator (Core Engine)    │
│ ├── 🖥️ UI (Interface Controller)        │
│ └── 🎲 OUTFIT_DATABASE (Presets)       │
└─────────────────────────────────────────┘
```

### 🐍 Backend (Server-Side)
```
┌─────────────────────────────────────────┐
│             SERVER LAYER                │
├─────────────────────────────────────────┤
│ app.py (Flask Application)              │
│ ├── 🌐 API Routes                       │
│ │   ├── POST /api/generate              │
│ │   ├── GET/POST /api/prompts           │
│ │   └── GET /api/health                 │
│ ├── 💾 SQLite Database Models           │
│ ├── 🤖 Server-side Prompt Generation    │
│ └── 📁 Static File Serving              │
└─────────────────────────────────────────┘
```

## 🔄 Flusso di Dati

### 📝 Creazione Prompt
```
User Input (Form) 
    ↓
UI.handleFormChange() 
    ↓
PromptGenerator.generate()
    ↓
Live Preview Update
    ↓
Storage.autoSave() → LocalStorage
```

### 💾 Salvataggio/Caricamento
```
Save Action
    ↓
Storage.savePrompt()
    ↓
LocalStorage + UI Update
    ↓
Optional: API /api/prompts (POST)
```

### 🎯 Preset Application
```
Preset Selection
    ↓
OUTFIT_DATABASE.presets[name]
    ↓
UI.applyPreset()
    ↓
Form Population + Auto-generation
```

## 🧩 Componenti Principali

### 1. 🎛️ Form System
- **Tabs**: Identity, Appearance, Clothing, Scene
- **Validation**: Real-time con feedback visivo
- **Auto-save**: Salvataggio automatico in LocalStorage
- **Progress**: Barra di completamento dinamica

### 2. 🤖 Prompt Engine
- **Generator**: Algoritmo di generazione prompt head-to-toe
- **Templates**: System di template modulari
- **Validation**: Controllo coerenza outfit
- **Stats**: Analisi complessità e caratteri

### 3. 💾 Storage System
- **LocalStorage**: Persistenza lato client
- **Auto-save**: Backup continuo del form
- **Prompt History**: Gestione cronologia
- **Export/Import**: Funzionalità di esportazione

### 4. 🎨 UI Components
- **Glassmorphism**: Effetti visivi moderni
- **Responsive**: Design mobile-first
- **Accessibility**: Support screen readers
- **Animations**: Transizioni fluide

## 🔧 Tecnologie Utilizzate

### Frontend Stack
- **HTML5**: Struttura semantica
- **CSS3**: Styling moderno (Glassmorphism)
- **JavaScript ES6+**: Logica applicativa
- **TailwindCSS**: Framework CSS utility-first
- **Font Awesome**: Iconografia
- **Google Fonts**: Typography (Inter)

### Backend Stack
- **Python 3.8+**: Linguaggio server
- **Flask**: Framework web leggero
- **Flask-CORS**: Cross-origin resource sharing
- **SQLite**: Database embedded
- **Werkzeug**: WSGI utilities

### Development Tools
- **VS Code**: Editor principale
- **PowerShell**: Terminal environment
- **Git**: Version control
- **Browser DevTools**: Debug e testing

## 📐 Design Patterns

### 1. 🏭 Module Pattern
```javascript
const ComponentName = {
    init() { /* initialization */ },
    method() { /* public methods */ },
    _privateMethod() { /* private methods */ }
};
```

### 2. 🔄 Observer Pattern
```javascript
// Form changes trigger multiple updates
UI.handleFormChange() → [
    generateAndUpdatePreview(),
    updateProgress(),
    updateClothingMap(),
    autoSave()
]
```

### 3. 💾 Repository Pattern
```javascript
Storage = {
    save(), load(), clear(),
    savePrompt(), getSavedPrompts(),
    autoSave(), loadAutoSave()
}
```

### 4. 🏗️ Builder Pattern
```javascript
PromptGenerator.generate() → [
    generateIdentity(),
    generateAppearance(),
    generateOutfit(),
    generateScene()
] → Complete Prompt
```

## 🚀 Funzionalità Principali

### ✨ Core Features
- [x] **Form Builder**: Creazione outfit step-by-step
- [x] **Live Preview**: Anteprima in tempo reale
- [x] **Preset System**: Template predefiniti
- [x] **Save/Load**: Gestione prompt salvati
- [x] **Export**: Download come file .txt
- [x] **Auto-save**: Backup automatico
- [x] **Visual Map**: Mappa visuale dell'outfit
- [x] **Progress Tracking**: Indicatore completamento

### 🎨 UI/UX Features
- [x] **Glassmorphism**: Design moderno
- [x] **Responsive**: Mobile-friendly
- [x] **Animations**: Transizioni fluide
- [x] **Dark Theme**: Support tema scuro
- [x] **Accessibility**: Screen reader support
- [x] **Keyboard Navigation**: Navigazione da tastiera

### 🔧 Technical Features
- [x] **Client Storage**: LocalStorage integration
- [x] **API Integration**: Backend communication
- [x] **Error Handling**: Gestione errori robusta
- [x] **Performance**: Debouncing e optimization
- [x] **SEO Ready**: Meta tags e structure

## 📊 Performance Considerations

### ⚡ Optimizations
- **Debouncing**: Limitazione chiamate API (300ms)
- **Lazy Loading**: Caricamento componenti on-demand
- **Minimal DOM**: Manipolazione DOM ottimizzata
- **CSS Efficiency**: Selettori performanti
- **Image Optimization**: Sprite e compression

### 📱 Mobile Performance
- **Touch Events**: Gestione touch ottimizzata
- **Viewport**: Meta viewport configurato
- **Reduced Motion**: Support prefers-reduced-motion
- **Offline**: Service worker (planned)

## 🔒 Security Considerations

### 🛡️ Client-Side Security
- **Input Validation**: Sanitizzazione input utente
- **XSS Prevention**: Escape di contenuti dinamici
- **CSRF Protection**: Token CSRF (backend)
- **Content Security Policy**: CSP headers (planned)

### 🔐 Data Privacy
- **Local Storage**: Dati solo in locale
- **No Tracking**: Nessun analytics invasivo
- **GDPR Compliance**: Conformità privacy
- **Data Encryption**: Encryption opzionale (planned)

## 🧪 Testing Strategy

### ✅ Test Types
- **Unit Tests**: Funzioni core (planned)
- **Integration Tests**: API endpoints (planned)
- **E2E Tests**: User workflows (planned)
- **Manual Testing**: Browser compatibility

### 🎯 Test Coverage
- **Form Validation**: Input validation logic
- **Prompt Generation**: Output quality
- **Storage Operations**: Save/load functionality
- **UI Interactions**: User interface behavior

## 🚀 Deployment

### 📦 Build Process
1. **Development**: Local Flask server
2. **Testing**: Manual browser testing
3. **Production**: Static hosting + API server
4. **CI/CD**: Automated deployment (planned)

### 🌐 Hosting Options
- **Static Frontend**: Netlify, Vercel, GitHub Pages
- **Backend API**: Heroku, Railway, DigitalOcean
- **Database**: SQLite (local) → PostgreSQL (production)
- **CDN**: CloudFlare (planned)

## 🔄 Future Enhancements

### 🆕 Planned Features
- [ ] **AI Integration**: OpenAI/Stable Diffusion API
- [ ] **Image Generation**: Direct image creation
- [ ] **User Accounts**: Registration e login
- [ ] **Cloud Sync**: Sincronizzazione cloud
- [ ] **Collaboration**: Sharing e comments
- [ ] **Advanced Presets**: Machine learning suggestions
- [ ] **Plugin System**: Extensibility
- [ ] **Mobile App**: React Native/Flutter

### 🏗️ Technical Debt
- [ ] **TypeScript**: Migration to TypeScript
- [ ] **Testing**: Comprehensive test suite
- [ ] **Documentation**: API documentation
- [ ] **Performance**: Bundle optimization
- [ ] **Security**: Security audit
- [ ] **Monitoring**: Error tracking (Sentry)

## 📚 Documentation

### 📖 Available Docs
- `README.md`: Setup e usage instructions
- `FEATURES.md`: Feature documentation
- `PROJECT_PLAN.md`: Development roadmap
- `ARCHITECTURE.md`: This architectural overview

### 📝 Code Documentation
- **JSDoc**: Function documentation (planned)
- **OpenAPI**: API specification (planned)
- **Style Guide**: Coding standards (planned)

---

## 🤝 Contributing

Per contribuire al progetto:
1. Fork del repository
2. Creazione feature branch
3. Commit con conventional commits
4. Pull request con descrizione dettagliata

## 📄 License

Progetto open source sotto licenza MIT.

---

*Ultima modifica: Agosto 2025*
*Versione: 1.0.0*
