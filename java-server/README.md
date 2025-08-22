Java server standalone (no external deps)

Questo piccolo server Java usa la classe built-in com.sun.net.httpserver per fornire:

- GET /api/health -> restituisce JSON con status e timestamp
- Servire i file statici dalla working directory (per esempio la root del repository)

Per mantenere intatto il servizio Node.js, questo server è opzionale e può essere eseguito separatamente.

Come compilare ed eseguire (PowerShell su Windows):

```powershell
# Dalla root del repository (c:\Temp\image-model-js)
# 1) Compila
mkdir -Force java-server\out; javac -d java-server\out java-server\src\server\Main.java

# 2) Avvia in background (working dir: repository root, così i file statici vengono serviti dalla repo)
Start-Process -NoNewWindow -FilePath java -ArgumentList '-cp', 'java-server\\out', 'server.Main' -WorkingDirectory '.\' -PassThru

# 3) Test rapido (dopo qualche istante)
Invoke-RestMethod -Uri http://localhost:8080/api/health
```

Nota: il server Java ascolta sulla porta 8089 di default. Per mantenere Node.js intatto non è necessario modificare alcun file Node: il server Java è aggiuntivo.

Dipendenze esterne necessarie per la versione con SQLite e JSON:
- sqlite-jdbc (es. org.xerial:sqlite-jdbc)
- gson (com.google.code.gson:gson)

Esempio di compilazione ed esecuzione (PowerShell). Scarica i jar `sqlite-jdbc.jar` e `gson.jar` nella cartella `java-server/lib` quindi:

```powershell
# dalla root del repository
if (!(Test-Path -Path "java-server\out")) { New-Item -ItemType Directory -Path "java-server\out" | Out-Null }
if (!(Test-Path -Path "java-server\lib")) { New-Item -ItemType Directory -Path "java-server\lib" | Out-Null }

# Compila
javac -d java-server\out -cp "java-server\lib\*" java-server\src\server\*.java

# Avvia
Start-Process -FilePath java -ArgumentList '-cp','java-server\\out;java-server\\lib\\*','server.Main' -WorkingDirectory '.' -WindowStyle Hidden

# Test
Invoke-RestMethod -Uri http://localhost:8089/api/health
```
