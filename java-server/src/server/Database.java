package server;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Minimal SQLite helper using JDBC. Requires sqlite-jdbc on the classpath.
 */
public class Database {
    private final String dbPath;
    private Connection conn;
    private final Gson gson = new Gson();

    public Database(String dbPath) {
        this.dbPath = dbPath == null ? "prompts.db" : dbPath;
    }

    public void init() throws SQLException {
        String url = "jdbc:sqlite:" + this.dbPath;
        conn = DriverManager.getConnection(url);
        createTables();
    }

    private void createTables() throws SQLException {
        String createPresets = "CREATE TABLE IF NOT EXISTS presets (" +
                "id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "name TEXT NOT NULL," +
                "category TEXT DEFAULT 'outfit'," +
                "data TEXT NOT NULL," +
                "tags TEXT DEFAULT '[]'," +
                "created_at DATETIME DEFAULT CURRENT_TIMESTAMP," +
                "updated_at DATETIME DEFAULT CURRENT_TIMESTAMP" +
                ")";

        try (Statement st = conn.createStatement()) {
            st.execute(createPresets);
            st.execute("CREATE INDEX IF NOT EXISTS idx_presets_category ON presets(category)");
            st.execute("CREATE INDEX IF NOT EXISTS idx_presets_created_at ON presets(created_at)");
            st.execute("CREATE INDEX IF NOT EXISTS idx_presets_name ON presets(name)");
        }
    }

    public int createPreset(Map<String, Object> preset) throws SQLException {
        String sql = "INSERT INTO presets (name, category, data, tags) VALUES (?, ?, ?, ?)";
        String name = (String) preset.get("name");
        String category = preset.getOrDefault("category", "outfit").toString();
        Object dataObj = preset.get("data");
        String dataJson = dataObj instanceof String ? (String) dataObj : gson.toJson(dataObj);
        Object tagsObj = preset.getOrDefault("tags", new ArrayList<>());
        String tagsJson = tagsObj instanceof String ? (String) tagsObj : gson.toJson(tagsObj);

        try (PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, name);
            ps.setString(2, category);
            ps.setString(3, dataJson);
            ps.setString(4, tagsJson);
            ps.executeUpdate();
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) return rs.getInt(1);
            }
        }
        return -1;
    }

    public Map<String, Object> getPreset(int id) throws SQLException {
        String sql = "SELECT * FROM presets WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) return null;
                return rowToPreset(rs);
            }
        }
    }

    public List<Map<String, Object>> getPresets(Map<String, Object> filters) throws SQLException {
        StringBuilder sql = new StringBuilder("SELECT * FROM presets WHERE 1=1");
        List<Object> params = new ArrayList<>();

        if (filters != null) {
            if (filters.containsKey("category")) {
                sql.append(" AND category = ?");
                params.add(filters.get("category"));
            }
            if (filters.containsKey("search")) {
                sql.append(" AND (name LIKE ? OR tags LIKE ?)");
                String sp = "%" + filters.get("search") + "%";
                params.add(sp);
                params.add(sp);
            }
            if (filters.containsKey("tags") && filters.get("tags") instanceof List) {
                @SuppressWarnings("unchecked")
                List<String> tags = (List<String>) filters.get("tags");
                if (!tags.isEmpty()) {
                    sql.append(" AND (");
                    for (int i = 0; i < tags.size(); i++) {
                        if (i > 0) sql.append(" OR ");
                        sql.append("tags LIKE ?");
                        params.add("%\"" + tags.get(i) + "\"%");
                    }
                    sql.append(")");
                }
            }
        }

        sql.append(" ORDER BY created_at DESC");

        try (PreparedStatement ps = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) ps.setObject(i + 1, params.get(i));
            try (ResultSet rs = ps.executeQuery()) {
                List<Map<String, Object>> out = new ArrayList<>();
                while (rs.next()) out.add(rowToPreset(rs));
                return out;
            }
        }
    }

    public boolean updatePreset(int id, Map<String, Object> preset) throws SQLException {
        String sql = "UPDATE presets SET name = ?, category = ?, data = ?, tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, preset.get("name").toString());
            ps.setString(2, preset.getOrDefault("category", "outfit").toString());
            Object dataObj = preset.get("data");
            ps.setString(3, dataObj instanceof String ? (String) dataObj : gson.toJson(dataObj));
            Object tagsObj = preset.getOrDefault("tags", new ArrayList<>());
            ps.setString(4, tagsObj instanceof String ? (String) tagsObj : gson.toJson(tagsObj));
            ps.setInt(5, id);
            int changes = ps.executeUpdate();
            return changes > 0;
        }
    }

    public boolean deletePreset(int id) throws SQLException {
        String sql = "DELETE FROM presets WHERE id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            int changes = ps.executeUpdate();
            return changes > 0;
        }
    }

    public List<String> getCategories() throws SQLException {
        String sql = "SELECT DISTINCT category FROM presets ORDER BY category";
        try (PreparedStatement ps = conn.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            List<String> out = new ArrayList<>();
            while (rs.next()) out.add(rs.getString("category"));
            return out;
        }
    }

    public List<String> getTags() throws SQLException {
        String sql = "SELECT tags FROM presets WHERE tags != '[]'";
        try (PreparedStatement ps = conn.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            List<String> set = new ArrayList<>();
            while (rs.next()) {
                String tagsJson = rs.getString("tags");
                try {
                    JsonElement el = JsonParser.parseString(tagsJson);
                    if (el.isJsonArray()) {
                        for (JsonElement t : el.getAsJsonArray()) {
                            String tv = t.getAsString();
                            if (!set.contains(tv)) set.add(tv);
                        }
                    }
                } catch (Exception ignored) {}
            }
            set.sort(String::compareTo);
            return set;
        }
    }

    public Map<String, Object> getStats() throws SQLException {
        Map<String, Object> stats = new HashMap<>();

        // total presets
        try (PreparedStatement ps = conn.prepareStatement("SELECT COUNT(*) as count FROM presets")) {
            try (ResultSet rs = ps.executeQuery()) {
                stats.put("totalPresets", rs.next() ? rs.getInt("count") : 0);
            }
        }

        // categories counts
        List<Map<String, Object>> cats = new ArrayList<>();
        try (PreparedStatement ps = conn.prepareStatement("SELECT category, COUNT(*) as count FROM presets GROUP BY category")) {
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> c = new HashMap<>();
                    c.put("category", rs.getString("category"));
                    c.put("count", rs.getInt("count"));
                    cats.add(c);
                }
            }
        }
        stats.put("categories", cats);

        // recent presets (last 7 days)
        try (PreparedStatement ps = conn.prepareStatement("SELECT COUNT(*) as count FROM presets WHERE created_at > datetime('now', '-7 days')")) {
            try (ResultSet rs = ps.executeQuery()) {
                stats.put("recentPresets", rs.next() ? rs.getInt("count") : 0);
            }
        }

        return stats;
    }

    public Map<String, Object> backup() throws SQLException {
        Map<String, Object> out = new HashMap<>();
        out.put("version", "1.0");
        out.put("exported", java.time.Instant.now().toString());
        out.put("stats", getStats());
        out.put("presets", getPresets(new HashMap<>()));
        return out;
    }

    private Map<String, Object> rowToPreset(ResultSet rs) throws SQLException {
        Map<String, Object> p = new HashMap<>();
        p.put("id", rs.getInt("id"));
        p.put("name", rs.getString("name"));
        p.put("category", rs.getString("category"));
        p.put("data", gson.fromJson(rs.getString("data"), Object.class));
        p.put("tags", gson.fromJson(rs.getString("tags"), List.class));
        p.put("created_at", rs.getString("created_at"));
        p.put("updated_at", rs.getString("updated_at"));
        return p;
    }

    public void close() {
        try {
            if (conn != null && !conn.isClosed()) conn.close();
        } catch (SQLException ignored) {}
    }
}
