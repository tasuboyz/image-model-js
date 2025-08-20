# 🎨 Image Prompt Builder - Outfit Consistente

Un'interfaccia web moderna per creare prompt di generazione immagini con modelli umani e outfit consistenti. Database completo di outfit, colori e stili per garantire combinazioni realistiche e coerenti.

## 🚀 Caratteristiche

- **Interfaccia moderna** con design glassmorphism
- **Database outfit completo** (head-to-toe mapping)
- **Generazione prompt intelligente** con logica anatomica
- **Sistema colori coordinati** con palette predefinite
- **6 preset stile** (Business, Casual, Elegante, Beach, Athletic, Artistic)
- **Live preview** con conteggio caratteri e complessità
- **Visual clothing map** per visualizzare l'outfit
- **Save/Load** con localStorage + backend SQLite
- **Export** in multiple formati

## 📁 Struttura Progetto

```
c:\Temp\image model js\
├── index.html          # Interfaccia frontend principale
├── app.js              # Logica JavaScript (ES6)
├── app.py              # Backend Flask (API)
├── requirements.txt    # Dipendenze Python
├── FEATURES.md         # Documentazione completa features
├── PROJECT_PLAN.md     # Piano sviluppo dettagliato
└── README.md           # Questo file
```

## 🎯 Quick Start

### Opzione 1: Solo Frontend (Locale)
```bash
# Apri direttamente nel browser
start index.html
```
Utilizza localStorage per salvare i dati localmente.

### Opzione 2: Full Stack (Raccomandato)

#### Setup Backend:
```powershell
# Crea ambiente virtuale Python
python -m venv .venv

# Attiva ambiente (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Installa dipendenze
pip install -r requirements.txt

# Avvia server Flask
python app.py
```

#### Apri Frontend:
```bash
# Apri in browser (dopo aver avviato il backend)
start index.html
```

## 🌐 Accesso

- **Frontend:** `file://path/to/index.html`
- **Backend API:** `http://localhost:5000/api`
- **Health Check:** `http://localhost:5000/api/health`

## 🎨 Come Usare

### 1. **Compila l'Identità**
- Età, genere, altezza, costituzione
- Per femmine: taglia seno e coppa reggiseno

### 2. **Definisci l'Aspetto**
- Capelli (colore, lunghezza, stile)
- Carnagione e colore occhi
- Livello makeup

### 3. **Seleziona Outfit (Head-to-Toe)**
- **Testa:** Cappelli, occhiali, orecchini
- **Collo:** Collane, choker, sciarpe
- **Superiore:** Reggiseni, top, blazer, giacche
- **Inferiore:** Pantaloni, gonne, vestiti
- **Gambe:** Calze, collant, autoreggenti
- **Piedi:** Scarpe con altezza tacchi

### 4. **Personalizza Colori & Stile**
- Colore principale e secondario
- Materiali (pizzo, seta, pelle)
- Stile generale (casual, business, elegante)

### 5. **Configura Scena**
- Location e illuminazione
- Stile fotografico e inquadratura
- Posa e mood

### 6. **Genera & Salva**
- Preview in tempo reale
- Copia o esporta il prompt
- Salva configurazioni per riutilizzo

## 🎯 Preset Disponibili

1. **💼 Business Professional** - Look formale per ufficio
2. **👕 Casual Everyday** - Stile quotidiano rilassato
3. **🌃 Elegant Evening** - Eleganza per eventi serali
4. **🏖️ Beach Casual** - Outfit per mare e vacanze
5. **🏃‍♀️ Athletic Wear** - Abbigliamento sportivo
6. **🎭 Artistic/Creative** - Stile bohémien e artistico

## 💾 Database Outfit

### Categorie Principali:
- **150+ opzioni vestiti** organizzate anatomicamente
- **25+ colori** con combinazioni armoniche  
- **15+ materiali** (pizzo, seta, cotone, pelle)
- **20+ stili fotografici** e location
- **Logica conflitti** (dress vs separates)
- **Coordinamento colori** automatico

### Esempi Output:

**Business Look:**
```
"Professional woman, 28 years old, athletic build, shoulder-length brunette hair, fair skin, wearing tailored navy blazer, white shirt, black trousers, nude pantyhose, black pumps, office setting, natural lighting, professional photography."
```

**Elegant Evening:**
```
"Elegant woman, 26 years old, curvy figure, long black hair in updo, diamond necklace, off-shoulder black evening gown, sheer stockings, high heels, dramatic lighting, fashion photography."
```

## 🔧 API Endpoints

```
GET  /api/health              # Status check
POST /api/prompts/generate    # Genera prompt da form data
POST /api/prompts/save        # Salva prompt
GET  /api/prompts/saved       # Lista prompt salvati
DELETE /api/prompts/{id}      # Elimina prompt
GET  /api/presets/default     # Preset predefiniti
```

## 🎨 Design Features

- **Glassmorphism UI** con effetti blur e trasparenze
- **Gradients animati** e hover effects
- **Progress tracking** completamento form
- **Visual clothing map** head-to-toe
- **Toast notifications** per feedback
- **Responsive design** desktop/tablet/mobile

## 🔍 Funzionalità Avanzate

- **Auto-save** continuo in localStorage
- **Conflict detection** (es. dress vs pantaloni)
- **Style coherence** checking
- **Character counting** con limiti
- **Complexity analysis** del prompt
- **Export** multipli formati
- **Undo/Redo** (planned)

## 📊 Stats & Analytics

- **Character count:** Target ~512 caratteri
- **Complexity level:** Bassa/Media/Alta
- **Clothing layers:** Conteggio automatico layer
- **Completion progress:** Percentuale campi compilati

## 🛠️ Tech Stack

### Frontend:
- **HTML5** + **TailwindCSS** 
- **Vanilla JavaScript ES6**
- **Font Awesome icons**
- **Google Fonts (Inter)**
- **LocalStorage** persistence

### Backend:
- **Python Flask** minimal API
- **SQLite** database  
- **Flask-CORS** 
- **JSON** serialization

## 🌟 Roadmap

### Phase 2: AI Integration
- Stable Diffusion preview
- Batch generation
- Quality scoring

### Phase 3: Advanced Features  
- User accounts
- Cloud sync
- Sharing system
- Advanced presets

### Phase 4: Mobile
- React Native app
- Camera integration
- Offline mode

## 🤝 Contribuire

Questo è un progetto di esempio per dimostrare:
- Interfacce moderne con vanilla JavaScript
- Database strutturato per outfit fashion
- Logica generazione prompt intelligente
- Integrazione frontend/backend

## 📄 Licenza

MIT License - Vedi progetto completo per dettagli.

---

**Creato con ❤️ per la community di AI image generation**
