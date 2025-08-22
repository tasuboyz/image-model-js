package server;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.Map;

public class JsonUtil {
    private static final Gson gson = new Gson();

    public static Map<String, Object> fromJson(String s) {
        Type t = new TypeToken<Map<String, Object>>(){}.getType();
        return gson.fromJson(s, t);
    }

    public static String toJson(Object o) {
        return gson.toJson(o);
    }
}
