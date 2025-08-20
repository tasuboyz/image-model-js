# 🎨 Image Prompt Builder - Interfaccia Frontend

Un'interfaccia web moderna per creare prompt di generazione immagini con modelli umani e outfit consistenti.

## 🚀 Caratteristiche Principali

### ✨ Interfaccia Utente Avanzata
- **Design Glassmorphism** con gradients e effetti moderni
- **Tabs responsive** per organizzare le sezioni del form
- **Live Preview** del prompt in tempo reale
- **Progress Bar** per completamento form
- **Visual Clothing Map** per vedere l'outfit head-to-toe
- **Animazioni fluide** e feedback visivo

### 👤 Sezioni del Form

#### 1. **Identità del Modello**
- Età (18-65 anni)
- Genere (Femminile/Maschile/Non-binary)
- Altezza (preset comuni)
- Costituzione fisica
- **Solo per Femmine:** Taglia seno e coppa reggiseno

#### 2. **Aspetto Fisico**
- **Capelli:** Colore, lunghezza, stile, texture
- **Carnagione:** Toni di pelle realistici
- **Occhi:** Colori naturali
- **Makeup:** Livelli da naturale a drammatico

#### 3. **Outfit Dettagliato (Head-to-Toe)**

##### 🧢 **Testa & Accessori**
- Copricapo (cappelli, berretti, fasce)
- Accessori capelli (mollette, nastri, fiori)
- Accessori viso (occhiali, maschere)
- Orecchini (bottoni, cerchi, pendenti)

##### 👔 **Parte Superiore**
- Collane e accessori collo
- Top principali (t-shirt, camicette, blazer)
- Lunghezza maniche
- Intimo superiore (reggiseni, corsetti)
- Capospalla (giacche, cappotti)

##### 👖 **Parte Inferiore**
- Tipo (pantaloni, gonne, vestiti, shorts)
- Stile e vestibilità
- Intimo inferiore
- Dettagli speciali (garter straps per calze)

##### 🦵 **Gambe & Piedi**
- Calze e collant (autoreggenti, collant, calzamaglie)
- Stili (trasparenti, a rete, fantasia)
- Scarpe (tacchi, sneakers, stivali)
- Altezza tacchi

##### 🎨 **Colori & Materiali**
- Colore principale e secondario
- Materiali (pizzo, seta, pelle, mesh)
- Stile generale (casual, business, elegante)

#### 4. **Scena & Fotografia**
- Location (studio, esterno, casa)
- Illuminazione (naturale, drammatica, soft)
- Stile fotografico (ritratto, fashion, artistico)
- Inquadratura (corpo intero, mezzo busto)
- Posa del modello
- Mood generale

### 🛠️ Funzionalità Avanzate

#### **Gestione Prompt**
- **Auto-save** continuo nel localStorage
- **Salvataggio** con nome personalizzabile
- **Lista prompt salvati** con anteprima
- **Caricamento** rapido di configurazioni
- **Eliminazione** selettiva
- **Esportazione** in file .txt

#### **Preset Intelligenti**
- **6 Preset predefiniti:**
  - 💼 Business Professional
  - 👕 Casual Everyday  
  - 🌃 Elegant Evening
  - 🏖️ Beach Casual
  - 🏃‍♀️ Athletic Wear
  - 🎭 Artistic/Creative
- **Applicazione rapida** con un click
- **Preset casuali** per ispirazione

#### **Strumenti di Analisi**
- **Conteggio caratteri** in tempo reale
- **Livello di complessità** (Bassa/Media/Alta)
- **Numero di layer** dell'outfit
- **Progress tracking** completamento form

#### **Azioni Utente**
- **Copia prompt** negli appunti
- **Download** file di testo
- **Pulizia rapida** del form
- **Toggle** mappa visuale
- **Navigazione** tab con keyboard

### 🎯 Logica di Generazione Intelligente

#### **Algoritmo Head-to-Toe**
L'interfaccia costruisce il prompt seguendo l'anatomia umana:
1. **Identità base** (età, genere, costituzione)
2. **Aspetto fisico** (capelli, pelle, occhi)
3. **Accessori testa** (cappelli, occhiali)
4. **Gioielli** (orecchini, collane)
5. **Intimo superiore** (reggiseni, corsetti)
6. **Top principali** (camicie, blazer)
7. **Capospalla** (giacche, cappotti)
8. **Vestiti** (se selezionati)
9. **Pantaloni/gonne** (se non vestito)
10. **Intimo inferiore** (slip, reggicalze)
11. **Calze/collant** (autoreggenti, collant)
12. **Scarpe** (tacchi, sneakers)
13. **Scena finale** (location, lighting, photography)

#### **Gestione Conflitti**
- **Dress vs Separates:** Se selezionato vestito, nasconde opzioni top/bottom
- **Seasonal Logic:** Suggerisce combinazioni stagionali appropriate
- **Style Coherence:** Evidenzia conflitti di stile (formale vs casual)
- **Color Harmony:** Coordina colori principali e secondari

#### **Esempi di Output**

**Business Professional:**
```
"Professional woman, 28 years old, athletic build, shoulder-length sleek brunette hair, fair skin, brown eyes, wearing tailored navy blazer with long sleeves, white button-up shirt, black leather belt, fitted charcoal trousers, sheer nude pantyhose, medium-height black pumps, standing in modern office environment, natural lighting, professional photography, full body view."
```

**Elegant Evening:**
```
"Elegant woman, 26 years old, curvy figure, long black hair styled in updo, medium skin tone, green eyes, dramatic makeup, diamond necklace, wearing off-shoulder black evening gown, silk sheer stockings, high black stiletto heels, sophisticated evening setting, dramatic lighting, fashion photography, full body view."
```

### 💾 Persistenza Dati

#### **LocalStorage (Frontend)**
- Auto-save continuo durante la compilazione
- Ripristino automatico al reload della pagina
- Gestione fino a 20 prompt salvati
- Backup configurazione corrente

#### **Database SQLite (Backend)**
- Salvataggio permanente prompt
- Storico completo modifiche
- Metadati (timestamp, caratteristiche)
- API REST per sincronizzazione

### 🎨 Design System

#### **Palette Colori**
- **Primary Gradient:** `#667eea → #764ba2` (Blu-Viola)
- **Accent Gradient:** `#f093fb → #f5576c` (Rosa)
- **Glass Effects:** `rgba(255,255,255,0.1)` con blur
- **Text:** Bianco con opacity variabile

#### **Typography**
- **Font:** Inter (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700
- **Hierarchy:** Dimensioni responsive

#### **Componenti**
- **Buttons:** Gradients con hover effects
- **Inputs:** Glass style con focus glow
- **Cards:** Glassmorphism con bordi subtili
- **Progress:** Animated gradient bar

### 📱 Responsive Design

#### **Breakpoints**
- **Desktop:** 1024px+ (Layout ottimale)
- **Tablet:** 768px-1023px (Form compatto)
- **Mobile:** 320px-767px (Stack verticale)

#### **Adattamenti Mobile**
- Sidebar collassabile
- Tabs scrollabili
- Touch-friendly controls
- Simplified clothing map

### 🔧 Configurazione Tecnica

#### **Frontend Stack**
- **HTML5** semantico
- **TailwindCSS** + custom CSS
- **Vanilla JavaScript ES6**
- **Font Awesome** per icone
- **Google Fonts** (Inter)

#### **Backend Stack**  
- **Python Flask** (minimal API)
- **SQLite** database
- **Flask-CORS** per comunicazione
- **JSON** serialization

#### **Browser Support**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Android Chrome 90+

### 🚀 Quick Start

#### **Solo Frontend (LocalStorage)**
```bash
# Apri il file HTML in un browser moderno
open index.html
```

#### **Full Stack (con Backend)**
```powershell
# Setup Python environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Avvia backend
python app.py

# Apri frontend
start index.html
```

#### **Accesso**
- **Frontend:** `file://path/to/index.html` o `http://localhost:8080`
- **Backend API:** `http://localhost:5000/api`
- **Health Check:** `http://localhost:5000/api/health`

### 📈 Metriche & Analytics

#### **Form Completion**
- Progress tracking in percentuale
- Campi obbligatori vs opzionali
- Tempo medio di completamento

#### **Prompt Quality**
- Lunghezza caratteri (target ~512)
- Complessità calcolata (0-1)
- Numero layer outfit (1-7)

#### **User Engagement**
- Preset più utilizzati
- Sezioni più modificate
- Frequenza salvataggio

### 🎯 Roadmap Future

#### **Phase 2: AI Integration**
- Preview immagine generata
- Integrazione Stable Diffusion
- Batch generation
- Quality feedback loop

#### **Phase 3: Advanced Features**
- User accounts e sync cloud
- Sharing e collaboration
- Advanced presets con tags
- Multi-format export (SD/Midjourney)

#### **Phase 4: Mobile App**
- React Native version
- Camera integration
- Offline mode
- Push notifications

---

## 💡 Note per Sviluppatori

### **Architettura**
L'interfaccia è progettata con separazione chiara tra:
- **Presentazione** (HTML/CSS)
- **Logica Business** (JavaScript modules)  
- **Persistenza** (LocalStorage + API)

### **Estensibilità**
Facile aggiungere:
- Nuove sezioni outfit
- Altri tipi di preset
- Integrazioni API esterne
- Formati export personalizzati

### **Performance**
- Debouncing per live preview (300ms)
- Lazy loading componenti pesanti
- Ottimizzazione rendering DOM
- Compression assets produzione

### **Accessibility**
- Keyboard navigation completa
- Screen reader compatibility
- High contrast mode support
- Touch gesture support

Questa interfaccia rappresenta una soluzione completa e moderna per la generazione di prompt per modelli umani con outfit consistenti, bilanciando funzionalità avanzate con un'esperienza utente intuitiva.
