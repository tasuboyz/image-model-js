image-model-js/
├── index.html                    # entry point frontend (static demo)
├── styles.css                    # stili globali
├── app.py                        # Flask backend (API + static serving)
├── db.py                         # helper SQLite (prompts persistence)
├── requirements.txt              # dipendenze Python (server)
├── src/
│   ├── lib/                      # librerie client riutilizzabili
│   │   ├── promptGenerator.js    # generatore di prompt (client-side)
│   │   ├── storage.js            # wrapper LocalStorage + autosave
│   │   ├── apiClient.js          # client AJAX per API backend (create/list presets)
│   │   └── i18n.js               # helper di traduzione/normalizzazione valori
│   ├── data/
│   │   └── outfits.js            # database/preset outfit (seed presets)
│   └── ui/
│       └── app.js                # controller UI (event handling, preview, mappa)
├── scripts/                      # utility scripts
│   └── smoke_db_test.py          # simple smoke test for POST /api/presets
├── tests/                        # unit tests (prompt generator, altri)
├── prompts.db                    # SQLite DB (runtime, created by db.py)
├── ARCHITECTURE.md               # architettura progetto
└── README.md                     # this file

## 🎨 UI/UX Flow

### Main Interface Layout (Advanced Clothing Focus)
```
┌───────────────────────────────────────────────────────────────────────────────┐
│ Header: Logo | [Load Preset ▼] | [Save] | [Export] | [Clear] | Theme Toggle   │
├─────────────────────┬─────────────────────────────────────────────────────────┤
│ Form Sidebar (40%)  │ Preview Area (60%)                                      │
│                     │                                                         │
│ ┌───────────────────────────────────────────────────────────────────────────┐ │
│ │ 👤 IDENTITÀ (Identity)                                                      │ │
│ │ Age: [24]                 Gender: [▼]           Ethnicity: [▼]            │ │
│ │ Profession: [doctor]      braCup: [—] *hidden*   bustSize: [—] *hidden*   │ │
│ │ Tags: [vintage, edgy]     Notes: [optional free text]                      │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────────────────────────────────────┐ │
│ │ ✨ ASPETTO (Appearance)                                                    │ │
│ │ BodyType: [slim|curvy]    Height: [tall|short]     SkinTone: [fair|olive]  │ │
│ │ Hair: [length][style][color]    HairTexture: [wavy|straight]               │ │
│ │ EyeColor: [blue]           Makeup: [natural|smokey]                        │ │
│ │ Additional: [scars|tattoos|marks]                                         │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────────────────────────────────────┐ │
│ │ 👗 OUTFIT (Clothing)                                                       │ │
│ │ Torso: [dress|blouse|shirt]   TorsoColor: [red]   TorsoLength: [midi|mini]  │ │
│ │ Neckline: [v-neck]            TorsoCoversLower: [yes|no]                   │ │
│ │ Lower: [pants|skirt]          LowerColor: [black]                          │ │
│ │ Footwear: [heels|sneakers]    FootwearColor: [black]   HeelHeight: [4"]    │ │
│ │ Accessories: [pearl necklace, hat]   Outerwear: [blazer|coat]              │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│ ┌───────────────────────────────────────────────────────────────────────────┐ │
│ │ 🎬 SCENA (Scene)                                                           │ │
│ │ Pose: [standing|sitting]    Location: [beach|studio|office]                │ │
│ │ Time: [sunset|night]        Weather: [sunny|rainy]   Mood: [romantic]      │ │
│ │ Lighting: [natural|dramatic]   ShotType: [full-body|bust|close-up]         │ │
│ │ Background: [city skyline, studio backdrop]                                │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│                     │                                                         │
│ ┌─Live Prompt Preview──────────────────────────────────────────────────────┐ │
│ │ "Female, 24 years old, athletic build, long wavy auburn hair, fair skin,  │ │
│ │ wearing a red midi dress with v-neck, black heels (4") and a pearl       │ │
│ │ necklace, posed standing on a city skyline at sunset, natural lighting."  │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│                     │ ┌─Clothing Visual Map─────────────────────────────────┐ │
│                     │ │     👤 HEAD: Fedora hat, sunglasses               │ │
│                     │ │     👔 UPPER: Black lace bra, blazer              │ │
│                     │ │     👗 TORSO: red midi dress                       │ │
│                     │ │     👖 LOWER: None                                  │ │
│                     │ │     🦵 LEGS: Fishnet stockings                     │ │
│                     │ │     👠 FEET: Black heels (4")                      │ │
│                     │ └─────────────────────────────────────────────────────┘ │
│                     │                                                         │
└─────────────────────┴─────────────────────────────────────────────────────────┘
```

## 👤 Identità
- age — età (es. "25")
- gender — genere (es. "female", "male", ecc.)
- ethnicity — etnia (attenzione a uso e forma, es. "asian")
- profession — professione/ruolo (es. "doctor")
- braCup — taglia coppa (campo sensibile; non includere di default nella preview)
- bustSize — dimensione del busto (campo sensibile; non includere di default nella preview)

Note: i campi sensibili (braCup, bustSize) sono disponibili ma dovrebbero essere gestiti separatamente e non mostrati nella preview breve.

## ✨ Aspetto
- bodyType — tipo di corporatura / build (es. "slim", "curvy")
- height — altezza (es. "tall", "short")
- hairLength — lunghezza dei capelli (es. "long", "short")
- hairStyle — stile dei capelli (es. "curly", "braided")
- hairTexture — texture (es. "wavy", "straight")
- hairColor — colore capelli (preferibilmente in inglese per il prompt, es. "black")
- eyeColor — colore occhi (es. "blue")
- skinTone — tonalità della pelle (es. "fair", "olive")
- makeup — trucco (es. "natural", "smokey")

## 👗 Outfit (clothing)
Questa sezione copre sia la stringa per il prompt che la struttura della Mappa Visuale Outfit.

Campi principali usati dal `PromptGenerator`:
- torso — capo superiore principale / torso (es. "dress", "blouse", "shirt")
- torsoColor — colore del capo superiore (es. "red")
- torsoLength — lunghezza del capo superiore (es. "midi", "mini")
- neckline — scollatura (es. "v-neck", "crew")
- torsoCoversLower — booleano: il torso copre la parte inferiore (es. per dress)
- lower — capo inferiore (es. "pants", "skirt")
- lowerColor — colore capo inferiore
- footwear — calzature (es. "heels", "sneakers")
- footwearColor — colore calzature
- accessories — descrizione libera accessori (es. "pearl necklace")

Campi addizionali usati nella UI (mappati dalla form):
- headwear — copricapo (es. "hat")
- hairAccessories — accessori per capelli
- faceAccessories — accessori viso
- intimate — intimo / capo intimo superiore
- upperBodyMain — capo principale superiore (altro naming presente nella UI)
- outerwear — soprabito
- torsoGarment — alias/variante per torso (UI)
- torsoStyle — stile del torso (es. "boho", "formal")
- bottomsType — tipo inferiore (UI: could be "pants", "dress" etc.)
- bottomsStyle — stile bottoms
- intimateLower — intimo inferiore
- legwear — tipo di calze/pantaloni per le gambe
- legwearStyle — stile per le gambe
- shoeType — tipo di scarpa (alias di footwear)
- heelHeight — altezza tacco
- earrings, neckwear — accessori specifici (orecchini, collana)

Struttura proposta di `clothingMap` (ritornata da `PromptGenerator.generate`):
- Array di oggetti: { area: 'torso'|'lower'|'footwear'|'accessory', type: string, color: string, attributes: [string] }

Esempio:
- { area: 'torso', type: 'dress', color: 'red', attributes: ['midi','v-neck'] }

## 🎬 Scena
- pose — posa (mappata: 'standing', 'sitting', 'reclining', 'walking', 'dynamic', 'relaxed', 'editorial')
- location — luogo (es. "office", "beach")
- time — ora/periodo (es. "sunset", "night")
- weather — meteo (es. "rainy", "sunny")
- mood — mood/atmosfera (es. "romantic", "professional")
- lighting — tipo di illuminazione (es. "natural", "dramatic")
- shotType — inquadratura / shot (es. 'full-body', 'three-quarter', 'bust', 'close-up', 'face-only')
- background — dettagli di sfondo (es. "city skyline")

## Note rapide per integrazione
- Normalizza i colori in inglese nella UI prima di passarli al `PromptGenerator` per ottenere frasi coerenti.
- Per la preview interattiva, usare `PromptGenerator.generatePreviewPatch(changedFieldPath, formData)` per ottenere il frammento e `clothingMap` aggiornati.
- Evitare di includere campi sensibili nella preview breve; aggiungere flag `opts.includeSensitive` per includerli solo se esplicitamente richiesto.

## 🔌 API: Salvataggio Preset
Endpoint principale per salvare preset e prompt: `POST /api/presets`

Payload JSON (esempio per salvare un outfit con titolo):

```json
{
	"name": "Evening outfit",
	"category": "outfit",
	"data": {
		"identity": { "age": 28, "gender": "female" },
		"appearance": { "bodyType": "slim", "hairColor": "auburn" },
		"outfit": { "torso": "dress", "torsoColor": "red", "footwear": "heels" },
		"scene": { "pose": "standing", "location": "city" }
	},
	"tags": ["evening","red"]
}
```

Risposta di successo: 201

```json
{ "ok": true, "id": 12 }
```

Nota: il campo `category` è opzionale ma utile per filtrare (es. `outfit`, `scene`, `appearance`, `identity`, `prompt`).

### Eseguire localmente (PowerShell)
1) Crea e attiva virtualenv (Windows PowerShell):

```powershell
python -m venv .venv
& .venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2) Avvia il server:

```powershell
python app.py
```

3) Esegui lo smoke test (richiede `requests` nel virtualenv):

```powershell
pip install requests
python scripts\smoke_db_test.py
```
