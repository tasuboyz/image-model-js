package server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.Executors;

/**
 * Minimal Java HTTP server using built-in com.sun.net.httpserver
 * - GET /api/health -> JSON status
 * - Serves static files from the working directory (use repository root when running)
 *
 * No external libraries required; works with a standard JDK.
 */
public class Main {
    public static void main(String[] args) throws Exception {
    int port = 8089;
    HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
    Database db = new Database("prompts.db");
    db.init();

        // Health endpoint
        server.createContext("/api/health", (HttpExchange exchange) -> {
            System.out.println("[/api/health] " + exchange.getRequestMethod() + " " + exchange.getRequestURI());
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) { sendOptions(exchange); return; }
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(405, -1);
                return;
            }
            String body = String.format("{\"status\":\"OK\",\"timestamp\":\"%s\",\"version\":\"1.0.0\"}", Instant.now().toString());
            exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
            byte[] bytes = body.getBytes("UTF-8");
            exchange.sendResponseHeaders(200, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        });

        // Presets and metadata endpoints (simplified, synchronous handlers)
    server.createContext("/api/presets", (HttpExchange exchange) -> {
            try {
        System.out.println("[/api/presets] " + exchange.getRequestMethod() + " " + exchange.getRequestURI());
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) { sendOptions(exchange); return; }
                String method = exchange.getRequestMethod();
                String query = exchange.getRequestURI().getQuery();
                Map<String, String> q = queryToMap(query);

                if ("GET".equalsIgnoreCase(method)) {
                    // list or get by id
                    String path = exchange.getRequestURI().getPath();
                    String[] parts = path.split("/");
                    if (parts.length >= 4 && parts[3].length() > 0) {
                        int id = Integer.parseInt(parts[3]);
                        Map<String, Object> preset = db.getPreset(id);
                        if (preset == null) {
                            sendJson(exchange, 404, Collections.singletonMap("error", "Preset not found"));
                        } else {
                            sendJson(exchange,200,preset);
                        }
                        return;
                    }

                    Map<String,Object> filters = new HashMap<>();
                    if (q.containsKey("category")) filters.put("category", q.get("category"));
                    if (q.containsKey("search")) filters.put("search", q.get("search"));
                    if (q.containsKey("tags")) filters.put("tags", Arrays.asList(q.get("tags").split(",")));
                    List<Map<String,Object>> list = db.getPresets(filters);
                    sendJson(exchange,200,list);
                    return;
                }

                if ("POST".equalsIgnoreCase(method)) {
                    String body = new String(exchange.getRequestBody().readAllBytes(), "UTF-8");
                    Map<String,Object> obj = JsonUtil.fromJson(body);
                    if (!obj.containsKey("name") || !obj.containsKey("data")) {
                        sendJson(exchange,400,Collections.singletonMap("error","Name and data are required"));
                        return;
                    }
                    int id = db.createPreset(obj);
                    sendJson(exchange,201,Collections.singletonMap("id",id));
                    return;
                }

                if ("PUT".equalsIgnoreCase(method)) {
                    String path = exchange.getRequestURI().getPath();
                    String[] parts = path.split("/");
                    if (parts.length < 4) { sendJson(exchange,400,Collections.singletonMap("error","ID required")); return; }
                    int id = Integer.parseInt(parts[3]);
                    String body = new String(exchange.getRequestBody().readAllBytes(), "UTF-8");
                    Map<String,Object> obj = JsonUtil.fromJson(body);
                    boolean ok = db.updatePreset(id,obj);
                    if (!ok) sendJson(exchange,404,Collections.singletonMap("error","Preset not found")); else sendJson(exchange,200,Collections.singletonMap("ok",true));
                    return;
                }

                if ("DELETE".equalsIgnoreCase(method)) {
                    String path = exchange.getRequestURI().getPath();
                    String[] parts = path.split("/");
                    if (parts.length < 4) { sendJson(exchange,400,Collections.singletonMap("error","ID required")); return; }
                    int id = Integer.parseInt(parts[3]);
                    boolean ok = db.deletePreset(id);
                    if (!ok) sendJson(exchange,404,Collections.singletonMap("error","Preset not found")); else sendJson(exchange,200,Collections.singletonMap("ok",true));
                    return;
                }

                exchange.sendResponseHeaders(405,-1);
            } catch (Exception e) {
                e.printStackTrace();
                sendJson(exchange,500,Collections.singletonMap("error","Server error"));
            }
        });

        // Categories
        server.createContext("/api/categories", (HttpExchange exchange) -> {
            System.out.println("[/api/categories] " + exchange.getRequestMethod() + " " + exchange.getRequestURI());
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) { sendOptions(exchange); return; }
            try {
                if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) { exchange.sendResponseHeaders(405,-1); return; }
                List<String> cats = db.getCategories();
                sendJson(exchange,200,cats);
            } catch (Exception e) { e.printStackTrace(); sendJson(exchange,500,Collections.singletonMap("error","Server error")); }
        });

        // Tags
        server.createContext("/api/tags", (HttpExchange exchange) -> {
            System.out.println("[/api/tags] " + exchange.getRequestMethod() + " " + exchange.getRequestURI());
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) { sendOptions(exchange); return; }
            try {
                if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) { exchange.sendResponseHeaders(405,-1); return; }
                List<String> tags = db.getTags();
                sendJson(exchange,200,tags);
            } catch (Exception e) { e.printStackTrace(); sendJson(exchange,500,Collections.singletonMap("error","Server error")); }
        });

        // Batch create presets
        server.createContext("/api/presets/batch", (HttpExchange exchange) -> {
            System.out.println("[/api/presets/batch] " + exchange.getRequestMethod() + " " + exchange.getRequestURI());
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) { sendOptions(exchange); return; }
            try {
                if (!"POST".equalsIgnoreCase(exchange.getRequestMethod()) && !"DELETE".equalsIgnoreCase(exchange.getRequestMethod())) { exchange.sendResponseHeaders(405,-1); return; }

                String body = new String(exchange.getRequestBody().readAllBytes(), "UTF-8");
                Map<String,Object> obj = JsonUtil.fromJson(body);

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    Object presetsObj = obj.get("presets");
                    if (!(presetsObj instanceof List)) { sendJson(exchange,400,Collections.singletonMap("error","Presets must be an array")); return; }
                    @SuppressWarnings("unchecked")
                    List<Map<String,Object>> presets = (List<Map<String,Object>>) presetsObj;
                    List<Map<String,Object>> results = new ArrayList<>();
                    int successCount = 0;
                    for (Map<String,Object> p : presets) {
                        try {
                            int id = db.createPreset(p);
                            Map<String,Object> r = new HashMap<>(); r.put("success", true); r.put("id", id); r.put("name", p.get("name"));
                            results.add(r); successCount++;
                        } catch (Exception ex) {
                            Map<String,Object> r = new HashMap<>(); r.put("success", false); r.put("error", ex.getMessage()); r.put("name", p.get("name"));
                            results.add(r);
                        }
                    }
                    Map<String,Object> resp = new HashMap<>(); resp.put("success", successCount); resp.put("failed", results.size() - successCount); resp.put("total", results.size()); resp.put("results", results);
                    sendJson(exchange,200,resp);
                    return;
                }

                if ("DELETE".equalsIgnoreCase(exchange.getRequestMethod())) {
                    Object idsObj = obj.get("ids");
                    if (!(idsObj instanceof List)) { sendJson(exchange,400,Collections.singletonMap("error","IDs must be an array")); return; }
                    @SuppressWarnings("unchecked")
                    List<Number> ids = (List<Number>) idsObj;
                    List<Map<String,Object>> results = new ArrayList<>();
                    int successCount = 0;
                    for (Number n : ids) {
                        try {
                            boolean ok = db.deletePreset(n.intValue());
                            Map<String,Object> r = new HashMap<>(); r.put("success", ok); r.put("id", n);
                            results.add(r); if (ok) successCount++;
                        } catch (Exception ex) {
                            Map<String,Object> r = new HashMap<>(); r.put("success", false); r.put("error", ex.getMessage()); r.put("id", n);
                            results.add(r);
                        }
                    }
                    Map<String,Object> resp = new HashMap<>(); resp.put("success", successCount); resp.put("failed", results.size() - successCount); resp.put("total", results.size()); resp.put("results", results);
                    sendJson(exchange,200,resp);
                    return;
                }
            } catch (Exception e) { e.printStackTrace(); sendJson(exchange,500,Collections.singletonMap("error","Server error")); }
        });

        // Export presets
        server.createContext("/api/export", (HttpExchange exchange) -> {
            System.out.println("[/api/export] " + exchange.getRequestMethod() + " " + exchange.getRequestURI());
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) { sendOptions(exchange); return; }
            try {
                if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) { exchange.sendResponseHeaders(405,-1); return; }
                String query = exchange.getRequestURI().getQuery();
                Map<String,String> q = queryToMap(query);
                String format = q.getOrDefault("format","json");
                if (!"json".equalsIgnoreCase(format)) { sendJson(exchange,400,Collections.singletonMap("error","Unsupported format")); return; }

                Map<String,Object> exportData = db.backup();
                exchange.getResponseHeaders().set("Content-Disposition", "attachment; filename=presets-export.json");
                sendJson(exchange,200,exportData);
            } catch (Exception e) { e.printStackTrace(); sendJson(exchange,500,Collections.singletonMap("error","Export failed")); }
        });

        // Import presets
        server.createContext("/api/import", (HttpExchange exchange) -> {
            System.out.println("[/api/import] " + exchange.getRequestMethod() + " " + exchange.getRequestURI());
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) { sendOptions(exchange); return; }
            try {
                if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) { exchange.sendResponseHeaders(405,-1); return; }
                String body = new String(exchange.getRequestBody().readAllBytes(), "UTF-8");
                Map<String,Object> obj = JsonUtil.fromJson(body);
                Object importData = obj.get("data");
                Map<String,Object> parsed;
                if (importData instanceof String) {
                    parsed = JsonUtil.fromJson((String) importData);
                } else if (importData instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String,Object> tmp = (Map<String,Object>) importData; parsed = tmp;
                } else {
                    sendJson(exchange,400,Collections.singletonMap("error","No import data provided")); return;
                }

                Object presetsObj = parsed.get("presets");
                if (!(presetsObj instanceof List)) { sendJson(exchange,400,Collections.singletonMap("error","Invalid import format")); return; }
                @SuppressWarnings("unchecked")
                List<Map<String,Object>> presets = (List<Map<String,Object>>) presetsObj;
                List<Map<String,Object>> results = new ArrayList<>();
                int successCount = 0;
                for (Map<String,Object> p : presets) {
                    try {
                        int id = db.createPreset(p);
                        Map<String,Object> r = new HashMap<>(); r.put("success", true); r.put("id", id); r.put("name", p.get("name"));
                        results.add(r); successCount++;
                    } catch (Exception ex) {
                        Map<String,Object> r = new HashMap<>(); r.put("success", false); r.put("error", ex.getMessage()); r.put("name", p.get("name"));
                        results.add(r);
                    }
                }
                Map<String,Object> resp = new HashMap<>(); resp.put("success", successCount); resp.put("failed", results.size() - successCount); resp.put("total", results.size()); resp.put("results", results);
                sendJson(exchange,200,resp);
            } catch (Exception e) { e.printStackTrace(); sendJson(exchange,500,Collections.singletonMap("error","Import failed")); }
        });

    // Static file handler: serve files from project root (search upward for index.html)
    Path docRoot = findDocRoot();
        server.createContext("/", (HttpExchange exchange) -> {
            System.out.println("[static] " + exchange.getRequestMethod() + " " + exchange.getRequestURI());
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) { sendOptions(exchange); return; }

            String path = exchange.getRequestURI().getPath();
            if (path == null || path.equals("/")) {
                path = "/index.html";
            }

            // normalize requested path
            Path resolved = docRoot.resolve(path.substring(1)).normalize();
            if (!resolved.startsWith(docRoot)) {
                exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
                exchange.sendResponseHeaders(403, -1);
                return;
            }

            if (Files.exists(resolved) && !Files.isDirectory(resolved)) {
                String contentType = guessContentType(resolved);
                byte[] data = Files.readAllBytes(resolved);
                // CORS for static files
                exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
                if (contentType != null) {
                    exchange.getResponseHeaders().set("Content-Type", contentType);
                }
                exchange.sendResponseHeaders(200, data.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(data);
                }
            } else {
                String notfound = "{\"error\":\"Not found\"}";
                exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
                exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
                exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
                byte[] bytes = notfound.getBytes("UTF-8");
                exchange.sendResponseHeaders(404, bytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(bytes);
                }
            }
        });

        server.setExecutor(Executors.newFixedThreadPool(8));
        server.start();
        System.out.println("Java server running: http://localhost:" + port + " serving " + docRoot);
        System.out.println("Available endpoints: GET /api/health and static files (e.g. /index.html)");

        // Graceful shutdown hook
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("Shutting down server...");
            server.stop(1);
            try { db.close(); } catch (Exception ignored) {}
        }));
    }

    // Try to locate project root which contains index.html by searching upwards from user.dir
    private static Path findDocRoot() {
        Path cur = Paths.get(System.getProperty("user.dir")).toAbsolutePath();
        for (int i = 0; i < 6 && cur != null; i++) {
            Path idx = cur.resolve("index.html");
            if (Files.exists(idx)) return cur;
            cur = cur.getParent();
        }
        // fallback to user.dir
        return Paths.get(System.getProperty("user.dir")).toAbsolutePath();
    }

    // Helper: send JSON response
    private static void sendJson(HttpExchange exchange, int status, Object obj) throws IOException {
        String body = JsonUtil.toJson(obj);
        byte[] bytes = body.getBytes("UTF-8");
        // CORS headers
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) { os.write(bytes); }
    }

    // Helper: respond to OPTIONS preflight
    private static void sendOptions(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
        exchange.sendResponseHeaders(204, -1);
    }

    // Helper: parse query string into map
    private static Map<String, String> queryToMap(String query) {
        Map<String, String> map = new HashMap<>();
        if (query == null || query.isEmpty()) return map;
        String[] pairs = query.split("&");
        for (String p : pairs) {
            int idx = p.indexOf('=');
            if (idx > -1) {
                String k = p.substring(0, idx);
                String v = p.substring(idx + 1);
                map.put(k, v);
            } else {
                map.put(p, "");
            }
        }
        return map;
    }

    private static String guessContentType(Path p) {
        try {
            String t = Files.probeContentType(p);
            if (t != null) return t;
        } catch (IOException ignored) {
        }
        String name = p.getFileName().toString().toLowerCase();
        if (name.endsWith(".html") || name.endsWith(".htm")) return "text/html; charset=utf-8";
        if (name.endsWith(".js")) return "application/javascript; charset=utf-8";
        if (name.endsWith(".css")) return "text/css; charset=utf-8";
        if (name.endsWith(".json")) return "application/json; charset=utf-8";
        if (name.endsWith(".png")) return "image/png";
        if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
        if (name.endsWith(".svg")) return "image/svg+xml";
        return "application/octet-stream";
    }
}
