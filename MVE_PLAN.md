# MVE Plan — Rimodulazione architettura (Image Prompt Builder)

Obiettivo: rimodulare l'architettura del progetto in modo incrementale (Minimum Viable Evolution), con deliverable testabili ad ogni fase, basso rischio e rollback semplice.

Breve piano operativo
- Stabilizzare il codice corrente e rimuovere debug residui.
- Estrarre moduli chiave (storage, API client, prompt generator) con contratti chiari e test.
- Migrare la UI per UX più robusta (modal per titolo, pulsante Sincronizza, toggle torso).
- Hardening backend (validazione, paginazione) e sincronizzazione bidirezionale minima.
- Aggiungere test automatici e smoke checks.

## Checklist delle richieste da soddisfare
- [ ] Rimodulare architettura frontend + backend in modo incrementale.
- [ ] Fornire fasi MVE con task concreti, file interessati, tempi stimati.
- [ ] Implementare salvataggio su server con fallback locale (già avviato) e titolo di salvataggio via modal.
- [ ] Garantire quality gates per ogni fase (build, lint/test, smoke).

---

## Fase 0 — Preparazione rapida (baseline)
Durata stimata: 0.5 day

Obiettivo
- Pulire la baseline per evitare rumor/debug che ostacolano refactor e test.

Task
- Rimuovere o centralizzare console.debug dietro flag DEBUG.
- Consolidare `CONFIG` e costanti top-level in `app.js` (già presente ma verifica/refactor se necessario).
- Aggiungere piccolo script `npm`/`make` per avviare il server (se non già presente).

File coinvolti
- `app.js`, `index.html`, `styles.css` (minime modifiche)

Criteri di successo
- L'app si avvia; console priva di debug indesiderati.

---

## Fase 1 — Storage & API client (contratti chiari)
Durata stimata: 1–2 days

Obiettivo
- Estrarre la logica di storage locale e le chiamate API in moduli con API chiare.

Task
- Creare `storage.js` (API: `load()`, `save(data)`, `savePrompt(promptData)`, `getSavedPrompts()`, `syncFromServer()`).
- Creare `apiClient.js` (API: `generatePrompt(formData)`, `savePrompt(payload)`, `getSavedPrompts(params)`).
- Refactor `app.js` per usare `storage.js` e `apiClient.js`.
- Documentare i contratti (promise return, error handling).

File coinvolti
- Nuovi: `storage.js`, `apiClient.js`
- Modificati: `app.js`, `index.html` (ordine `<script>`), `README.md` (aggiornamento endpoint/client)

Criteri di successo
- Test manuale: salvataggio tenta il server; su successo aggiorna localStorage con ID ritornato; su fallimento salva localmente.
- Nessuna regressione nell'interfaccia.

---

## Fase 2 — Isolare PromptGenerator + Tests
Durata stimata: 1 day

Obiettivo
- Rendere `PromptGenerator` riusabile, testabile e confrontabile tra client e server.

Task
- Estrarre `PromptGenerator` in `promptGenerator.js` (API: `generate(formData) => { prompt, characterCount, complexity, layers }`).
- Aggiungere test unitari (Jest o un semplice runner) che coprano casi: dress/torso fallback, color mapping, layer counting.
- Verificare parità di output tra `promptGenerator.js` client e `PromptGenerator` server (python) su casi campione.

File coinvolti
- Nuovi: `promptGenerator.js`, `tests/promptGenerator.test.js`
- Modificati: `app.js` (usa modulo locale), `app.py` (lascia API ma confronta output in test)

Criteri di successo
- Test unitari verdi.
- Output coerente tra client e server almeno sui casi principali.

---

## Fase 3 — UX: modal titolo + pulsante Sincronizza + toggle torso
Durata stimata: 1 day

Obiettivo
- Migliorare UX per salvataggi e synchronizzazione.

Task
- Sostituire `window.prompt()` con una modal (HTML + CSS + JS) per inserire il titolo.
- Aggiungere pulsante `Sincronizza` in header che richiama `Storage.syncFromServer()` e mostra spinner/toast.
- Lasciare checkbox `torsoCoversLower` (già implementata) e aggiungere breve tooltip/documentazione.

File coinvolti
- `index.html` (modal markup, sync button), `app.js` (handler modal/sync), `styles.css`

Criteri di successo
- Modal per titolo funziona e UX è piacevole; pulsante Sincronizza scarica prompt server e aggiorna lista.

---

## Fase 4 — Hardening backend e API
Durata stimata: 1–2 days

Obiettivo
- Rendere gli endpoint robusti per utilizzo reale e testabile.

Task
- Aggiungere validazione request in `save_prompt()` (`name` e `prompt` requisiti, length limits).
- Rendere `GET /api/prompts/saved` paginabile (`?limit=&offset=`).
- Aggiungere logging più dettagliato e gestione errori coerente (status codes e message bodies uniformi).

File coinvolti
- `app.py`, possibili aggiornamenti a `requirements.txt` (es. `marshmallow` o `pydantic` se vuoi validation più robusta)

Criteri di successo
- API testate con curl/Postman; DB mostra salvataggi; response shape coerente.

---

## Fase 5 — Tests, CI e smoke checks
Durata stimata: 1–2 days

Obiettivo
- Aggiungere test automatici e uno smoke script per verifiche rapide.

Task
- Unit tests JS per `promptGenerator.js`.
- Pytest per API (`/api/health`, `/api/prompts/save`, `/api/prompts/saved`).
- Script `smoke/test.sh` o PowerShell `smoke.ps1` che avvia server e prova gli endpoint.
- (Opzionale) Setup GitHub Actions che esegue test su push.

File coinvolti
- `tests/`, `smoke.ps1` o `smoke.sh`, `.github/workflows/test.yml` (opzionale)

Criteri di successo
- Test locali verdi e smoke script che termina con success exit 0.

---

## Quality Gates (applicati ogni fase)
- Build/run: pagina carica senza errori console.
- Lint/Style: JS lint (opzionale) o controllo manuale.
- Unit tests: prompt generator minimo + API smoke.
- Manual smoke: salva prompt, ricarica pagina, carica prompt salvato e verifica form ripopolato.

## Edge cases & rischi
- Divergenza schema `formData` tra client e server: definire schema minimo (chiavi supportate) e versionare se cambia.
- SQLite è OK per MVE ma non per concorrenza pesante; valutare DB esterno per produzione.
- Offline: assicurare fallback e policy di merge (prima versione: server sovrascrive, client mantiene local copy).

## Stima complessiva
- Totale MVE stimato: 4–7 giorni uomo per portare il progetto a una struttura modulare, con test e UX migliorata.
- Priorità rapida (alto valore): Fase 1 + Fase 3 → ~1.5 giorni.

## Comandi utili (avvio locale)
```powershell
cd 'C:\Temp\image model js'
python app.py
# Apri http://localhost:5000
```

## Prossimi passi proposti (pick-1)
- Opzione A: partire ora con Fase 1 (estrazione storage/api client) + Fase 3 (modal titolo + sync) — consegna ~1.5 giorni.
- Opzione B: partire subito con Fase 2 (prompt generator tests) se preferisci avere prima la test coverage.

---

Se vuoi, scrivo subito la Fase 1 (creo `storage.js` e `apiClient.js`, modifico `index.html` per includerli e refactorizzo `app.js`) e preparo un piccolo smoke test per il salvataggio/sync. Scrivimi quale opzione preferisci e inizio le modifiche pratiche.
