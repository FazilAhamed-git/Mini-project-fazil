import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(null); // 'day' | 'night'

  const applyThemeClass = (t) => {
    try {
      const root = document.documentElement;
      root.classList.remove("theme-day", "theme-night");
      if (t === "day") root.classList.add("theme-day");
      if (t === "night") root.classList.add("theme-night");
    } catch (e) {
      // ignore during SSR or tests
    }
  };

  const setAndPersist = (t) => {
    setTheme(t);
    try {
      localStorage.setItem("theme", t);
    } catch (e) {}
    applyThemeClass(t === null ? "night" : t);
  };

  const toggleTheme = () => {
    setAndPersist(theme === "day" ? "night" : "day");
  };

  // Determine initial theme: prefer persisted, otherwise fetch local time
  useEffect(() => {
    const persisted = (() => {
      try {
        return localStorage.getItem("theme");
      } catch (e) {
        return null;
      }
    })();

    if (persisted === "day" || persisted === "night") {
      setTheme(persisted);
      applyThemeClass(persisted);
      return;
    }

    // Try a public time API to detect local hour
    const detectFromApi = async () => {
      try {
        const res = await fetch("https://worldtimeapi.org/api/ip", { cache: "no-store" });
        if (!res.ok) throw new Error("timeapi");
        const data = await res.json();
        const dt = data.datetime || data.unixtime;
        const hour = dt ? new Date(data.datetime).getHours() : new Date().getHours();
        const inferred = hour >= 6 && hour < 19 ? "day" : "night";
        setAndPersist(inferred);
      } catch (e) {
        // Fallback to client time
        const hour = new Date().getHours();
        const inferred = hour >= 6 && hour < 19 ? "day" : "night";
        setAndPersist(inferred);
      }
    };

    detectFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setAndPersist }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;
