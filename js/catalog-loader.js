/* Загружает актуальный каталог из Supabase. При отсутствии настройки использует локальный products.js. */
(async () => {
  const cfg = window.SUPABASE_CONFIG || {};
  if (cfg.url && cfg.anonKey && cfg.url.startsWith("https://")) {
    try {
      const response = await fetch(`${cfg.url}/rest/v1/products?select=data&order=created_at.asc`, {
        headers: cfg.anonKey.startsWith("sb_") ? { apikey: cfg.anonKey } : { apikey: cfg.anonKey, Authorization: `Bearer ${cfg.anonKey}` }
      });
      if (!response.ok) throw new Error(`Supabase: ${response.status}`);
      const rows = await response.json();
      if (Array.isArray(rows) && rows.length) window.PRODUCTS = rows.map(row => row.data).filter(Boolean);
      else if (Array.isArray(rows)) window.PRODUCTS = [];
    } catch (error) {
      console.warn("Не удалось загрузить облачный каталог. Используется локальная копия.", error);
    }
  }
  const script = document.createElement("script");
  script.src = "js/app.js";
  document.body.appendChild(script);
})();
