# Image Prompt Builder - Scaletta e Architettura

## 📋 Overview del Progetto
Interfaccia web per la costruzione intelligente di prompt per generazione immagini, con backend Java e frontend React.

**Esempio Target:** 
```
"Girl, 24 years old, height 170 cm (5'7"), athletic build with toned abs and long legs, C-cup bust, natural curves. Long, wavy auburn hair, fair skin with warm undertones. Wearing a black lace balconette bra with emerald jewel centerpiece, matching black lace panties with garter straps, sheer black fishnet stockings. Gold necklace with green and white gemstones, dangling earrings. Standing near a window with soft daylight filtering in, cinematic lingerie photography, warm soft lighting, full body view."
```

---

## �🇹 → 🇬🇧 Mini glossario / Quick glossary

Per aiutarti con l'inglese, qui trovi le traduzioni delle etichette e frasi più usate nell'interfaccia.

- Salva → Save
- Carica → Load
- Elimina → Delete
- Anteprima Prompt → Prompt Preview
- Copia → Copy
- Esporta → Export
- Identità → Identity
- Aspetto → Appearance
- Abbigliamento → Clothing
- Scena → Scene
- Fotografia → Photography
- Taglia seno / Bust Size → Bust size
- Coppa reggiseno / Bra cup → Bra cup
- Elementi salvati / Saved Prompts → Saved Prompts
- Barra di progresso → Progress bar

Frasi utili:
- "Inizia a compilare il form per vedere l'anteprima del prompt..." → "Start filling the form to see the prompt preview..."
- "Sei sicuro di voler cancellare tutti i dati?" → "Are you sure you want to delete all data?"
- "Salvato in LocalStorage" → "Saved to LocalStorage"

Consiglio: prova a leggere la UI in inglese usando queste traduzioni e a ripetere le frasi ad alta voce per memorizzarle.


---

## �🏗️ Architettura del Sistema

### Stack Tecnologico
- **Backend:** python flask
- **Frontend:** javascript ES6
- **Database:** sqlite (dev) 
- **Styling:** Tcss, "wow" EFFECTS
- **API:** REST JSON + OpenAPI/Swagger

### Struttura delle Cartelle
```
da definire
```

---

## 🎯 Scaletta di Sviluppo (Focus: UI + Save/Load)

### Phase 1: Setup e Base (1-2 giorni)
1. **Backend Setup**
   - [ ] Creare progetto Spring Boot con starter-web, starter-data-jpa, starter-validation
   - [ ] Configurare CORS per comunicazione con React
   - [ ] Setup database H2 e configurazioni base
   - [ ] Creare primo controller di test (`/health`)

2. **Frontend Setup** 
   - [ ] Creare app React con Vite + TypeScript
   - [ ] Installare TailwindCSS e Headless UI
   - [ ] Setup Axios per chiamate API
   - [ ] Creare layout base e routing

3. **Integrazione Base**
   - [ ] Test comunicazione frontend-backend
   - [ ] Setup CORS e gestione errori base

### Phase 2: Core Models e API (2-3 giorni) ⭐ PRIORITÀ
1. **Backend Models (Semplificati)**
   - [ ] Entity `SavedPrompt` (id, name, promptText, configJson, createdAt)
   - [ ] Entity `PromptPreset` (id, name, description, configJson, isDefault)
   - [ ] Repository interfaces e service base

2. **API Endpoints (Essenziali)**
   - [ ] `POST /api/prompts/build` - Costruzione prompt da form data
   - [ ] `GET /api/prompts/saved` - Lista prompt salvati
   - [ ] `POST /api/prompts/save` - Salva prompt costruito
   - [ ] `DELETE /api/prompts/{id}` - Elimina prompt salvato
   - [ ] `GET /api/presets/default` - Preset predefiniti (3-4 esempi)
   - [ ] `POST /api/presets` - Salva configurazione come preset

3. **Frontend Services (Core)**
   - [ ] Service per API calls con TypeScript types
   - [ ] Local storage per draft/autosave
   - [ ] Form state management (Context o Zustand)

### Phase 3: Advanced UI Components (4-5 giorni) ⭐ PRIORITÀ ESTESA
1. **Enhanced Layout Components**
   - [ ] Header con preset selector avanzato e theme toggle
   - [ ] Sidebar expandibile con sezioni clothing head-to-toe
   - [ ] Main area con prompt preview + visual clothing map
   - [ ] Footer con azioni avanzate (save, copy, export, random)

2. **Advanced Form Sections**
   - [ ] **Identity Section:** età, genere, altezza, build (validazione robusta)
   - [ ] **Appearance Section:** capelli dettagliati, pelle, occhi, makeup
   - [ ] **🧢 Head & Hair Section:** headwear, hair accessories, face accessories
   - [ ] **👔 Upper Body Section:** neckwear, tops, sleeves, outerwear, intimate
   - [ ] **👗 Torso & Waist Section:** dresses, necklines, waist accessories
   - [ ] **👖 Lower Body Section:** bottoms, styles, intimate lower
   - [ ] **🦵 Legs & Hosiery Section:** legwear, styles, materials
   - [ ] **👠 Footwear Section:** shoes, heels, socks
   - [ ] **🎨 Style & Scene Section:** overall style, fabrics, colors, location, photography

3. **Smart Controls (Enhanced)**
   - [ ] Live prompt preview con debouncing intelligente
   - [ ] Visual clothing map (anatomical representation)  
   - [ ] Character counter con complexity meter
   - [ ] Conflict detection system (dress vs separates, style coherence)
   - [ ] Quick preset system (6-8 style categories)
   - [ ] Advanced options panel (weights, details, modifiers)

### Phase 4: Advanced Logic & Algorithm (3-4 giorni) ⭐ PRIORITÀ ESTESA
1. **Backend Advanced Logic**
   - [ ] Algoritmo head-to-toe prompt construction
   - [ ] Layering conflict detection (dress vs separates)
   - [ ] Style coherence validation (formal vs casual)
   - [ ] Seasonal logic suggestions (weather-appropriate)
   - [ ] Anatomical ordering system (head → feet)
   - [ ] Smart text optimization (remove duplicates, natural flow)
   - [ ] Multiple output formats (concise vs detailed)

2. **Frontend Advanced Logic**
   - [ ] Real-time conflict highlighting
   - [ ] Dynamic form enabling/disabling (dress disables separates)
   - [ ] Visual clothing map rendering
   - [ ] Preset management avanzato (categorized, searchable)
   - [ ] Auto-save con conflict resolution
   - [ ] Undo/Redo per complex forms
   - [ ] Export multiple formats (text, JSON config, preset)

### Phase 5: UX e Polish (1-2 giorni)
1. **User Experience**
   - [ ] Loading states e skeleton screens
   - [ ] Error messages user-friendly
   - [ ] Confirmation dialogs (delete, overwrite)
   - [ ] Tooltips per i campi form
   - [ ] Responsive design base (desktop + tablet)

2. **Quality of Life**
   - [ ] Dark/light theme toggle
   - [ ] Drag & drop per riordinare sezioni
   - [ ] Keyboard shortcuts (Ctrl+S save, Ctrl+C copy)
   - [ ] Undo last change (1 level)

### Phase 6: Testing e Documentation (1 giorno)
1. **Testing Essenziale**
   - [ ] Test API endpoints principali
   - [ ] Test form validation
   - [ ] Test save/load functionality
   - [ ] Test responsive design

2. **Documentation**
   - [ ] README con setup instructions
   - [ ] User guide base con screenshots
   - [ ] API documentation essenziale

---

## 🚀 Fasi Future (Post-MVP)

### Phase 7: AI Integration (Futura)
- [ ] Integrazione Stable Diffusion API
- [ ] Preview immagine generata
- [ ] Batch generation
- [ ] Quality/style parameters

### Phase 8: Advanced Features (Futura)
- [ ] Token counting accurato
- [ ] Negative prompts builder
- [ ] Advanced weighting system
- [ ] Multi-format export (SD/Midjourney/etc)
- [ ] Sharing system
- [ ] Advanced presets with tags

---

## 📊 Modello Dati (Backend)

### Core Entities (Semplificate per MVP)

```java
@Entity
public class SavedPrompt {
    @Id @GeneratedValue
    private Long id;
    private String name;
    @Lob
    private String promptText;          // Final prompt generated
    @Lob 
    private String configJson;          // Form state serialized
    private LocalDateTime createdAt;
    private LocalDateTime lastModified;
}

@Entity
public class PromptPreset {
    @Id @GeneratedValue
    private Long id;
    private String name;
    private String description;
    @Lob
    private String configJson;          // Default form state
    private Boolean isDefault;          // System presets
    private LocalDateTime createdAt;
}
```

### DTOs per API (Enhanced con Advanced Clothing)

```java
// Request per costruire prompt da form data avanzata
public class PromptBuildRequest {
    private IdentityData identity;          // age, gender, height, build
    private AppearanceData appearance;      // hair, skin, eyes, makeup
    private AdvancedClothingData clothing;  // detailed head-to-toe mapping
    private SceneData scene;               // location, lighting, mood
    private PhotographyData photography;   // style, shot, angle, grading
}

// Enhanced Clothing Data Structure
public class AdvancedClothingData {
    private HeadAccessoriesData headAccessories;
    private NeckUpperBodyData neckUpperBody;
    private TorsoWaistData torsoWaist;
    private LowerBodyData lowerBody;
    private LegsHosieryData legsHosiery;
    private FootwearData footwear;
    private StyleModifiersData styleModifiers;
}

public class HeadAccessoriesData {
    private String headwear;           // "fedora", "none", "baseball_cap"
    private String hairAccessories;    // "ribbon", "clips", "none"
   private String faceAccessories;    // "sunglasses", "none", "mask"
   private String earrings;           // "studs", "hoops", "dangling", "none"
}

public class NeckUpperBodyData {
    private String neckwear;          // "choker", "scarf", "none"
    private String upperBodyMain;     // "blouse", "t_shirt", "blazer"
    private String sleeves;           // "long", "short", "sleeveless"
    private String outerwear;         // "jacket", "coat", "none"
   private String intimate;          // "bra", "corset", "none"
   private String braCup;            // "AA", "A", "B", "C", "D", "DD", "E" - applicable for female characters
}

public class TorsoWaistData {
    private String dressType;         // "cocktail", "none", "maxi"
    private String neckline;          // "v_neck", "scoop", "off_shoulder"
    private String waistAccessories;  // "belt", "sash", "none"
}

public class LowerBodyData {
    private String bottomsType;       // "jeans", "skirt", "shorts"
    private String bottomsStyle;      // "mini", "midi", "skinny"
    private String intimateLower;     // "panties", "thong", "none"
}

public class LegsHosieryData {
    private String legwear;           // "stockings", "tights", "none"
    private String legwearStyle;      // "fishnet", "sheer", "opaque"
    private String legwearMaterial;   // "nylon", "silk", "cotton"
}

public class FootwearData {
    private String shoeType;          // "heels", "sneakers", "boots"
    private String heelHeight;        // "high", "low", "flat"
    private String socks;             // "ankle", "knee_high", "none"
}

public class StyleModifiersData {
    private String overallStyle;      // "casual", "formal", "bohemian"
    private List<String> fabrics;     // ["silk", "lace", "cotton"]
    private List<String> colors;      // ["black", "red", "gold"]
    private List<String> patterns;    // ["solid", "stripes", "floral"]
    private String fit;               // "tight", "loose", "fitted"
}

// Response con prompt costruito e metadata
public class PromptBuildResponse {
    private String promptText;
    private String detailedPromptText;     // Versione più dettagliata
    private Integer characterCount;
    private Map<String, Object> usedFields;
    private List<String> clothingLayers;   // Lista ordinata head-to-toe
    private Map<String, Integer> sectionWeights; // Per future implementazioni
}
```

---

## 🎨 UI/UX Flow

### Main Interface Layout (Advanced Clothing Focus)
```
┌───────────────────────────────────────────────────────────────────────────────┐
│ Header: Logo | [Load Preset ▼] | [Save] | [Export] | [Clear] | Theme Toggle   │
├─────────────────────┬─────────────────────────────────────────────────────────┤
│ Form Sidebar (40%)  │ Preview Area (60%)                                      │
│                     │                                                         │
│ ┌─Identity────────┐ │ ┌─Live Prompt Preview─────────────────────────────────┐ │
│ │ Age: [24]       │ │ │ "Female, 24 years old, athletic build, long wavy   │ │
│ │ Gender: [▼]     │ │ │ auburn hair, fair skin, wearing black lace         │ │
│ │ Build: [▼]      │ │ │ balconette bra with emerald centerpiece, matching  │ │
│ └─────────────────┘ │ │ black lace panties, sheer fishnet stockings..."    │ │
│                     │ └─────────────────────────────────────────────────────┘ │
│ ┌─Appearance──────┐ │                                                         │
│ │ Hair: [▼][▼][▼] │ │ ┌─Clothing Visual Map─────────────────────────────────┐ │
│ │ Skin: [▼]       │ │ │     👤 HEAD: Fedora hat, sunglasses               │ │
│ │ Eyes: [▼]       │ │ │     👔 UPPER: Black lace bra, blazer              │ │
│ │ Makeup: [▼]     │ │ │     👗 TORSO: None                                 │ │
│ └─────────────────┘ │ │     👖 LOWER: Black lace panties                   │ │
│                     │ │     🦵 LEGS: Fishnet stockings                     │ │
│ ┌─🧢 Head & Hair──┐ │ │     👠 FEET: Black heels (4")                      │ │
│ │ Hat: [▼]        │ │ └─────────────────────────────────────────────────────┘ │
│ │ Hair Acc: [▼]   │ │                                                         │
│ │ Face Acc: [▼]   │ │ ┌─Actions─────┐ ┌─Stats───────────────────────────────┐ │
│ └─────────────────┘ │ │ [� Save]   │ │ Characters: 234 / ~512              │ │
│                     │ │ [�📋 Copy]   │ │ Clothing Layers: 6                  │ │
│ ┌─👔 Upper Body───┐ │ │ [📥 Export] │ │ Style: Professional Lingerie        │ │
│ │ Neckwear: [▼]   │ │ │ [🎲 Random] │ │ Complexity: ████████░░░░ Medium     │ │
│ │ Top: [▼]        │ │ └─────────────┘ └─────────────────────────────────────┘ │
│ │ Sleeves: [▼]    │ │                                                         │
│ │ Outerwear: [▼]  │ │ ┌─Quick Presets───────────────────────────────────────┐ │
│ │ Intimate: [▼]   │ │ │ 📸 Studio Portrait  🏖️ Beach Casual  🌃 Night Out   │ │
│ └─────────────────┘ │ │ 💼 Business       🏃‍♀️ Athletic     🎭 Artistic      │ │
│                     │ └─────────────────────────────────────────────────────┘ │
│ ┌─👗 Torso & Waist┐ │                                                         │
│ │ Dress: [▼]      │ │ ┌─Saved Prompts──────────────────────────────────────┐ │
│ │ Neckline: [▼]   │ │ │ 📝 Elegant Evening Look (5 min ago)                │ │
│ │ Waist: [▼]      │ │ │ 📝 Casual Summer Outfit (1 hour ago)               │ │
│ └─────────────────┘ │ │ 📝 Professional Business (yesterday)               │ │
│                     │ │ [+ View All Saved (12)]                            │ │
│ ┌─👖 Lower Body───┐ │ └─────────────────────────────────────────────────────┘ │
│ │ Bottoms: [▼]    │ │                                                         │
│ │ Style: [▼]      │ │ ┌─Advanced Options────────────────────────────────────┐ │
│ │ Intimate: [▼]   │ │ │ ☐ Include fabric details                           │ │
│ └─────────────────┘ │ │ ☑ Include color descriptions                        │ │
│                     │ │ ☐ Add style modifiers                               │ │
│ ┌─🦵 Legs & Hosiery┐ │ │ ☑ Generate detailed version                        │ │
│ │ Legwear: [▼]    │ │ │ Weight: [██████████] 100%                          │ │
│ │ Style: [▼]      │ │ └─────────────────────────────────────────────────────┘ │
│ │ Material: [▼]   │ │                                                         │
│ └─────────────────┘ │                                                         │
│                     │                                                         │
│ ┌─👠 Footwear─────┐ │                                                         │
│ │ Shoes: [▼]      │ │                                                         │
│ │ Heel: [▼]       │ │                                                         │
│ │ Socks: [▼]      │ │                                                         │
│ └─────────────────┘ │                                                         │
│                     │                                                         │
│ ┌─🎨 Style & Scene┐ │                                                         │
│ │ Overall: [▼]    │ │                                                         │
│ │ Fabrics: [🏷️▼]  │ │                                                         │
│ │ Colors: [🎨▼]   │ │                                                         │
│ │ Location: [▼]   │ │                                                         │
│ │ Photography:[▼] │ │                                                         │
│ └─────────────────┘ │                                                         │
└─────────────────────┴─────────────────────────────────────────────────────────┘
```

### Form Sections Detail (Advanced Clothing Mapping)

#### 1. Identity Section ⭐ CORE
- **Age:** Number input (18-65) con validation obbligatoria
- **Gender:** Dropdown (Female, Male, Non-binary, Other)
- **Height:** Preset dropdown (150cm, 160cm, 170cm, 180cm, 190cm + Custom)
- **Build:** Dropdown (Slim, Athletic, Curvy, Muscular, Average)

#### 2. Appearance Section ⭐ CORE
- **Hair Color:** Dropdown (Blonde, Brunette, Black, Red, Gray, Silver, Other + Custom)
- **Hair Length:** Dropdown (Pixie, Short, Shoulder, Long, Very Long)
- **Hair Style:** Dropdown (Straight, Wavy, Curly, Braided, Updo, Ponytail)
- **Hair Texture:** Dropdown (Fine, Thick, Voluminous, Sleek)
- **Skin Tone:** Dropdown (Pale, Fair, Medium, Olive, Tan, Dark, Deep)
- **Eye Color:** Dropdown (Blue, Brown, Green, Hazel, Gray, Amber)
- **Makeup:** Dropdown (Natural, Light, Bold, Dramatic, None)

#### 3. Advanced Clothing Section ⭐ ENHANCED
**Clothing Strategy:** Mappa anatomica dalla testa ai piedi con categorie specifiche

##### 3.1 Head & Hair Accessories
- **Headwear:** 
  - Options: None, Hat, Cap, Beret, Headband, Tiara, Veil, Helmet
  - Styles: Baseball cap, Fedora, Beanie, Sun hat, Wide-brim
- **Hair Accessories:** 
  - Options: None, Clip, Ribbon, Scrunchie, Flowers, Pins
- **Face Accessories:**
  - Options: None, Glasses, Sunglasses, Mask, Face paint

##### 3.2 Neck & Upper Body
- **Neckwear:**
  - Options: None, Necklace, Choker, Scarf, Tie, Bow tie
  - Materials: Gold, Silver, Pearl, Leather, Silk
- **Upper Body - Main:**
  - **Tops:** T-shirt, Blouse, Shirt, Tank top, Crop top, Sweater, Hoodie
  - **Formal:** Blazer, Suit jacket, Vest, Cardigan
  - **Intimate:** Bra, Bralette, Camisole, Corset, Bustier
  - **Outerwear:** Coat, Jacket, Leather jacket, Denim jacket
- **Sleeves:** Sleeveless, Short, 3/4, Long, Bell, Puffy, Tight
- **Bra Cup Size:** AA, A, B, C, D, DD, E (for Female)
- **Bust Size:** Petite, Average, Full, Very Full (for Female)

##### 3.3 Torso & Waist
- **Dresses:** 
  - Types: Cocktail, Evening, Casual, Maxi, Mini, Midi, A-line, Bodycon
  - Necklines: V-neck, Scoop, High neck, Off-shoulder, Strapless
- **Waist Accessories:**
  - Options: None, Belt, Sash, Chain belt, Corset belt
  - Materials: Leather, Fabric, Metal, Rope

##### 3.4 Lower Body
- **Bottoms:**
  - **Pants:** Jeans, Trousers, Leggings, Yoga pants, Cargo pants
  - **Skirts:** Mini, Midi, Maxi, A-line, Pencil, Pleated
  - **Shorts:** Denim, Athletic, Dress shorts, Hot pants
- **Intimate Lower:**
  - Options: Panties, Thong, Boyshorts, Lingerie set
  - Styles: Lace, Cotton, Silk, Seamless
- **Skirt Advanced Details:**
  - **Length:** Mini, Knee-length, Midi, Maxi, Floor-length
  - **Style:** A-line, Pencil, Pleated, Flowing, Wrap, High-low
  - **Fit:** High-waisted, Low-waisted, Mid-rise, Fitted, Loose
  - **Fabric Type:** Elegant silk, Flowing chiffon, Structured cotton, etc.
  - **Special Details:** Slit on one side, Asymmetrical hem, Embroidered details, etc.

##### 3.5 Legs & Hosiery
- **Legwear:**
  - Options: None, Pantyhose, Stockings, Tights, Knee-highs, Thigh-highs
  - Styles: Sheer, Opaque, Fishnet, Patterned, Colored
  - Materials: Nylon, Silk, Cotton, Lace top

##### 3.6 Feet & Footwear
- **Shoes:**
  - **Casual:** Sneakers, Flats, Sandals, Loafers, Boots
  - **Formal:** Heels, Pumps, Dress shoes, Oxford shoes
  - **Athletic:** Running shoes, Training shoes, Dance shoes
  - **Special:** Thigh-high boots, Ankle boots, Platform shoes
- **Heel Height:** Flat, Low (1-2"), Medium (2-3"), High (3-4"), Very High (4"+)
- **Socks:** None, Ankle socks, Crew socks, Over-knee, Patterned

##### 3.7 Style & Details Modifiers
- **Overall Style Categories:**
  - Casual, Business, Formal, Evening, Sporty, Bohemian, Gothic, Vintage, Modern
- **Fabric & Textures:**
  - Cotton, Silk, Lace, Leather, Denim, Satin, Velvet, Mesh, Sequins
- **Colors & Patterns:**
  - Solid colors, Stripes, Polka dots, Floral, Animal print, Geometric
- **Fit & Style:**
  - Tight, Loose, Fitted, Oversized, Flowing, Structured

##### 3.8 Color Management System
- **Primary Color:** Main clothing item color (dress, top, pants)
- **Secondary Color:** Complementary pieces (jacket, shoes, accessories)
- **Accent Color:** Small details (jewelry, buttons, trim)
- **Metallic Options:** Gold, Silver, Rose Gold, Copper, Platinum, None
- **Pattern Types:** Solid, Striped, Polka Dots, Floral, Geometric, Animal Print, Gradient
- **Color Schemes:** Monochromatic, Complementary, Analogous, Triadic, Neutral, Bold

**Example Output:** "wearing a long flowing skirt (high-waisted, elegant silk fabric, slit on one side) in emerald green primary color with gold metallic details"

#### 4. Scene Section
- **Location:** Dropdown (Indoor Studio, Outdoor Natural, Urban, Home, Beach, Forest, City)
- **Lighting:** Dropdown (Natural Light, Studio Lighting, Golden Hour, Blue Hour, Dramatic, Soft)
- **Mood:** Dropdown (Professional, Casual, Romantic, Artistic, Dramatic, Playful)
- **Weather/Season:** Spring, Summer, Autumn, Winter, Rainy, Sunny
- **Pose:** Dropdown / presets (Standing, Sitting, Reclining, Walking, Action, Candid, Dynamic, Lying)

#### 5. Photography & Style Section
- **Photography Style:** Portrait, Fashion, Editorial, Street, Artistic, Documentary
- **Shot Type:** Full Body, 3/4 Body, Half Body, Bust, Close-up, Face only
- **Camera Angle:** Eye Level, Low Angle, High Angle, Dutch angle
- **Depth of Field:** Shallow, Medium, Deep focus
- **Color Grading:** Natural, Warm, Cool, Vintage, High contrast, Desaturated
 - **Pose (photography):** Posed, Natural, Motion blur, Action pose, Relaxed, Editorial pose
 - **Point of View / Camera Distance:** Close-up (tight), Mid (waist/chest), Full body, Wide/Environment, Overhead, POV (first-person)

---

## 🗺️ Advanced Clothing Mapping Logic

### Strategia di Costruzione Head-to-Toe
L'interfaccia costruisce il prompt seguendo l'anatomia umana dall'alto verso il basso, garantendo descrizioni naturali e logiche.

#### Ordine di Descrizione (Template Algorithm)
```
1. Identity + Appearance Base
   → "Female, 24 years old, athletic build, long wavy auburn hair, fair skin"

2. Head & Face Accessories  
   → "wearing sunglasses and a black fedora"

3. Upper Body (Neck → Torso)
   → "gold choker necklace, black lace balconette bra with emerald centerpiece"

4. Outerwear (se presente)
   → "under an open white blazer"

5. Lower Body Main
   → "matching black lace panties with garter straps"

6. Legs & Hosiery
   → "sheer black fishnet stockings"

7. Footwear
   → "black leather high heels (4 inches)"

8. Scene & Photography
   → "standing near a window with soft daylight, cinematic lighting, full body shot"
```

#### Smart Combination Rules
- **Layering Logic:** L'algoritmo riconosce incompatibilità (es. vestito + pantaloni)
- **Style Coherence:** Suggerisce combinazioni coerenti (formale vs casual)
- **Anatomical Order:** Mantiene ordine logico nella descrizione
- **Seasonal Logic:** Adatta suggerimenti in base al contesto (es. cappotto in inverno)

#### Esempi di Output Avanzato

**Esempio 1: Professional Business**
```
Form Input:
- Identity: Female, 28, athletic
- Head: None, none, glasses  
- Upper: None, blazer, long sleeves, none
- Torso: None, none, belt
- Lower: trousers, fitted, none
- Legs: pantyhose, sheer, nylon
- Feet: heels, medium, none

Generated Prompt:
"Professional woman, 28 years old, athletic build, wearing stylish glasses, 
tailored navy blazer with long sleeves, white button-up shirt, black leather belt, 
fitted charcoal trousers, sheer nude pantyhose, medium-height black pumps, 
standing in modern office environment, natural lighting, professional photography"
```

**Esempio 2: Elegant Evening**
```
Form Input:
- Identity: Female, 25, curvy
- Head: None, hair clip, none
- Upper: necklace, none, sleeveless, none  
- Torso: evening dress, off-shoulder, none
- Lower: none (dress), none, none
- Legs: stockings, sheer, silk
- Feet: heels, high, none

Generated Prompt:
"Elegant woman, 25 years old, curvy figure, hair styled in updo with decorative clip,
diamond necklace, wearing off-shoulder black evening gown, silk sheer stockings,
high black stiletto heels, sophisticated evening setting, dramatic lighting,
fashion photography"
```

#### Conflict Resolution System
- **Dress vs Separates:** Se selezionato vestito, disabilita automaticamente top/bottom separati
- **Seasonal Check:** Avvisa se combinazione non stagionale (es. cappotto + shorts)
- **Style Coherence:** Evidenzia conflitti di stile (es. formale + sportivo)
- **Layering Rules:** Gestisce ordine logico degli strati (intimo → top → outerwear)

---

## ✅ Checklist di Sviluppo (MVP Focus)

### Scopo dell'MVP
Consegna rapida di una applicazione funzionante che permette a un utente di: costruire un prompt via form, visualizzarlo in anteprima, salvarlo localmente e esportarlo. Ogni punto qui sotto ha un criterio di accettazione rapido (vedi "Verifica rapida").

### Must‑have (MVP) — Priorità Alta
- [X] Inizializzare repository e script di sviluppo (frontend/backend)
   - Verifica rapida: `npm run dev` avvia frontend, backend risponde a `/health`.
- [X] Frontend: Form base per Identità, Aspetto, Abbigliamento
   - Verifica rapida: i campi aggiornano lo state e la preview cambia in tempo reale.
- [X] Live Prompt Preview con conteggio caratteri e copia/esporta
   - Verifica rapida: prompt aggiornato, copia negli appunti e download .txt funzionano.
- [X] Local autosave (localStorage) + Load/Clear draft
   - Verifica rapida: riaprendo la pagina i dati salvati vengono ripristinati.
- [X] Backend: health endpoint (`/health`) implementato
   - Verifica rapida: `GET /health` ritorna 200 OK.
- [X] UI moderna con design glassmorphism e gradients
   - Verifica rapida: interfaccia con colori aggiornati, tab responsive, animazioni fluide.
- [ ] Backend: API minimale per Save/Load prompt (work in progress)
   - Verifica rapida: `POST /api/prompts/save` e `GET /api/prompts/saved` funzionano su dati mock.
- [ ] Input validation essenziale (es. età >= 18, altezza valida)
   - Verifica rapida: campi non validi mostrano errore e prevengono il salvataggio.

### Nice‑to‑have (MVP+) — Priorità Media
- [ ] Preset semplice (3‑5 preset) con import rapido
- [ ] Debounce sulla preview (300ms) per evitare ricalcoli eccessivi
- [ ] Barra di progresso per completamento form (micro‑UX)
- [X] Visual clothing map base (toggle on/off)
- [X] UI/UX migliorata con animazioni e feedback visivo

### Stretch (post‑MVP in sprint successivi)
- [ ] Conflict detection head-to-toe (es. dress vs separates)
- [ ] Advanced export (JSON config, templates)
- [ ] Undo/redo semplice (1 livello)

### Quality Gates (criteri obbligatori prima di merge su main)
- Build: il frontend compila (`npm run build`) e il backend compila (`mvn -q package` o `javac` per MVP)
- Lint/Typecheck: nessun errore TS/ESLint critico
- Unit smoke tests: 1‑2 test core per prompt generation + 1 test API health
- Manual smoke: avviare frontend + backend, completare flow Save → Load → Export

### Criteri di Accettazione (AC) — cosa significa "Done" per l'MVP
1. Un utente può creare un prompt completo usando solo i form; la preview riflette fedelmente i dati inseriti.
2. L'utente può salvare il prompt (localStorage o API) e ricaricarlo in un secondo momento.
3. L'utente può copiare il prompt e scaricarlo come `.txt`.
4. Gli input principali sono validati e non consentono salvataggi invalidi.

### Verifica rapida (checklist operativa per testing veloce)
1. Avvia frontend: `cd frontend && npm install && npm run dev` → apri http://localhost:5174
2. Avvia backend (opzionale per test API): `cd backend && mvn spring-boot:run` (o esegui SimplePromptServer)
3. Compila Identità + Aspetto + Abbigliamento → la preview cambia immediatamente
4. Premi Copia → incolla in un editor per confermare
5. Premi Esporta → controlla `prompt.txt` scaricato
6. Ricarica pagina → conferma che i dati salvati vengono ripristinati

### Tempi stimati (MVP scope)
- Setup + Form base + Preview + Save/Load (local): 2‑4 giorni
- Minimal backend endpoints + integration: 1‑2 giorni
- Polish (validation, UX): 1‑2 giorni

### Note operative
- Preferire soluzioni semplici, client‑first per la generazione prompt; spostare logica complessa al backend in una seconda fase.
- Documentare ogni endpoint minimo nel file `docs/api.md` o `ARCHITECTURE.md`.


---

## 🚫 Out of Scope (Per Ora)
- ❌ Integrazione AI/Stable Diffusion
- ❌ Token counting avanzato  
- ❌ Negative prompts
- ❌ Weight system avanzato
- ❌ Multi-format export
- ❌ Sharing/collaboration
- ❌ User authentication
- ❌ Advanced validation/filtering
- ❌ Performance optimization avanzata

---

## 🚀 Quick Start Commands

### Backend (da cartella backend/)
```bash
# Setup progetto
mvn spring-boot:run

# Tests
mvn test

# Build
mvn clean package
```

### Frontend (da cartella frontend/)
```bash
# Setup dependencies  
npm install

# Dev server
npm run dev

# Build production
npm run build

# Tests
npm run test
```

### Full Stack Dev
```bash
# Terminal 1: Backend
cd backend && mvn spring-boot:run

# Terminal 2: Frontend  
cd frontend && npm run dev

# App disponibile su http://localhost:5173
# API disponibile su http://localhost:8080
```

---

## 📝 Note Tecniche

### Security Considerations
- Validazione obbligatoria età >= 18
- Content filtering per parole inappropriate
- Rate limiting su API calls
- HTTPS only in production
- Input sanitization everywhere

### Performance Tips
- Debouncing su live preview (300ms)
- Token counting ottimizzato
- Lazy loading UI components
- API response caching per presets
- Database indexing su query frequenti

### Extensibility Points
- Plugin system per nuove sezioni
- Custom prompt templates
- Integration hooks per multiple AI APIs
- Multi-language support
- Advanced export formats

---

*Documento creato: Agosto 2025*
*Ultimo aggiornamento: Agosto 2025*
