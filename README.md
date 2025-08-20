# Flask backend for Prompt Builder (minimal)

This is a minimal Flask API to support the React ES6 frontend in `frontend_js`.

APIs:
- GET /api/health -> { "status": "ok" }
- POST /api/prompts/generate -> accepts JSON with `identity`, `appearance`, `clothing` and returns `{ "generated_prompt": "..." }`

Quick start (PowerShell):

```powershell
cd "c:\Temp\Image Model\new_flask_app"
python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt
python app.py
```

The Flask app will run on http://localhost:5000 by default.
