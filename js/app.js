(() => {
"use strict";
const C = window.CONFIG, P = window.PRODUCTS, CATS = window.CATEGORIES, SL = window.SPEC_LABELS;
const $ = (s, r = document) => r.querySelector(s);
const ESC = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"};
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ESC[c]);
const money = n => n == null ? "" : n.toLocaleString("ru-RU").replace(/\u00a0/g, " ") + " ₸";
const AV = {in_stock: "В наличии", order: "Под заказ", out: "Нет в наличии"};
const ICON = '<svg viewBox="0 0 48 48"><rect x="14" y="5" width="20" height="38" rx="4"/><path d="M21 38h6"/></svg>';

// WhatsApp: единое место формирования ссылок (номер берётся из config.js)
const waLink = text => C.whatsapp ? `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}` : "";
const orderText = (p, ask) => `Здравствуйте! Меня интересует товар:\n\n${p.name}\n${p.price != null ? "Цена: " + money(p.price) + "\n" : ""}\n${ask ? "Подскажите, пожалуйста, есть ли он в наличии?" : "Хочу заказать. Подскажите, пожалуйста, наличие и условия получения."}`;
function bindWA(root) {
  root.querySelectorAll("[data-wa]").forEach(a => {
    const href = waLink(a.dataset.wa || "Здравствуйте! Хочу уточнить информацию.");
    if (href) { a.href = href; a.target = "_blank"; a.rel = "noopener"; }
    else { a.removeAttribute("href"); a.setAttribute("aria-disabled", "true"); a.title = "Номер WhatsApp не задан"; }
  });
}
const waBtn = (txt, cls = "btn pri", msg = "") => `<a class="${cls}" data-wa="${esc(msg)}">${txt}</a>`;

const placeholder = () => `<div class="mu" style="width:40%">${ICON}</div>`;
const imgSrc = (p, i) => (p.images && p.images[i]) || (i === 0 ? window.CAT_IMG[p.category] : "");
const imgTag = (p, i = 0, lazy = true) => {
  const src = imgSrc(p, i);
  if (!src) return placeholder();
  return `<img class="${src.endsWith(".svg") ? "" : "photo"}" src="${esc(src)}" alt="${esc(p.name)}" ${lazy ? "loading=lazy" : ""} data-fallback>`;
};
document.addEventListener("error", e => {
  const t = e.target;
  if (t.tagName === "IMG" && t.hasAttribute("data-fallback")) t.outerHTML = placeholder();
}, true);
const priceHtml = p => {
  const sale = p.oldPrice && p.oldPrice > p.price;
  return `<div class="pr"><span>${money(p.price)}</span>${sale ? `<s>${money(p.oldPrice)}</s><span class="off">−${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ""}</div>`;
};
const card = p => {
  const tag = p.isSale ? '<span class="tag sale">Акция</span>' : p.isNew ? '<span class="tag">Новинка</span>' : p.featured ? '<span class="tag">Популярное</span>' : "";
  return `<a class="card" href="#/product/${esc(p.id)}"><div class="ph">${tag}${p.demo ? '<span class="tag demo">Демо</span>' : ""}${imgTag(p)}</div>
  <div class="bd"><span class="br">${esc([p.brand, CATS[p.category]].filter(Boolean).join(" · "))}</span><span class="nm">${esc(p.name)}</span>${priceHtml(p)}
  <span class="st ${esc(p.availability)}">${AV[p.availability] || ""}</span></div></a>`;
};
const cards = list => list.length ? `<div class="grid">${list.map(card).join("")}</div>` : "";
const SUB = window.SUBCATS || {};
const parentOf = k => Object.keys(SUB).find(pk => SUB[pk].includes(k));
const inCat = (p, k) => p.category === k || (SUB[k] || []).includes(p.category);
const hasProducts = k => P.some(p => inCat(p, k));
// верхний уровень разделов (без подразделов)
const catList = () => Object.entries(CATS).filter(([k]) => !parentOf(k) && (C.showEmptyCategories || hasProducts(k)));
const catImgCls = k => window.CAT_IMG[k].endsWith(".svg") ? "" : window.CAT_IMG[k].includes("/cat-") ? "photo blend" : "photo";
const catTile = (k, label, cls = "") => `<a class="cat ${cls}" href="#/catalog?cat=${k}"><b>${label}</b>${hasProducts(k) ? "" : '<span class="soon">Скоро</span>'}<img class="${catImgCls(k)}" src="${window.CAT_IMG[k]}" alt="" loading="lazy"></a>`;
const hoursHtml = () => C.hours.map(([d, t]) => `<div><span>${esc(d)}</span><b>${esc(t)}</b></div>`).join("");
const handle = u => "@" + u.split("@")[1];
const socials = () => [["Instagram", C.instagram], ...[].concat(C.tiktok || []).map(u => ["TikTok " + handle(u), u]), ["Telegram", C.telegram]].filter(s => s[1]);
const mapUrl = () => C.mapLink || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.plusCode + " Зайсан");
const routeUrl = () => C.routeLink || mapUrl();

function setMeta(title, desc) {
  document.title = title;
  const m = $("meta[name=description]"); if (m && desc) m.content = desc;
}

const activeServices = () => C.showServices ? (C.services || []).filter(s => s.enabled !== false) : [];
const servicesHtml = () => `<div class="svc">${activeServices().map(s => `<div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join("")}</div>`;

/* ---------- pages ---------- */
function home() {
  setMeta("Sotovik Zaisan — электроника, ремонт и аксессуары в Зайсане", "Аксессуары, наушники, зарядные устройства, ремонт телефонов и электроники в Зайсане. Каталог и заказ через WhatsApp.");
  const pop = P.filter(p => p.featured).slice(0, 8), nw = P.filter(p => p.isNew), sale = P.filter(p => p.isSale);
  const sec = (t, l, href, max = 4) => l.length ? `<section class="sec"><div class="wrap"><div class="sec-h"><h2>${t}</h2><a class="link" href="${href}">Все товары</a></div>${cards(l.slice(0, max))}</div></section>` : "";
  const tile = (cls, t, txt, href, img) => `<a class="tile ${cls}" href="${href}"><h2>${t}</h2><p>${txt}</p><span class="btn wh sm">Смотреть</span><img src="${img}" alt="" loading="lazy"></a>`;
  const svc = activeServices();
  return `<div class="wrap hero"><div class="hero-box"><div><h1>Техника под рукой</h1>
  <p>Аксессуары, наушники и зарядные устройства. Ремонт и настройка устройств. Наличие уточним заранее в WhatsApp.</p>
  <div class="cta"><a class="btn pri" href="#/catalog">Смотреть каталог</a>${waBtn("Связаться с нами", "btn")}</div></div>
  <div class="hero-art"><img class="a" src="${esc(C.heroImageBack || C.heroImage)}" alt=""><img class="b" src="${esc(C.heroImage)}" alt="Смартфон"></div></div></div>
  <section class="sec"><div class="wrap"><div class="sec-h"><h2>Категории</h2></div><div class="cats" data-n="${catList().length}">${catList().map(([k, v]) => catTile(k, v)).join("")}</div></div></section>
  ${sec("Популярные товары", pop, "#/catalog", 8)}
  ${nw.length || sale.length ? `<section class="sec"><div class="wrap promo">${nw.length ? tile("n", "Новые поступления", "Свежие товары в каталоге.", "#/catalog?flag=new", imgSrc(nw[0], 0)) : ""}${sale.length ? tile("s", "Акции", "Товары со сниженной ценой.", "#/catalog?flag=sale", imgSrc(sale[0], 0)) : ""}</div></section>` : ""}
  ${svc.length ? `<section class="sec"><div class="wrap"><div class="svcband"><div class="sec-h" style="margin:0"><h2>Сервис и услуги</h2><a class="btn ln sm" href="#/services">Подробнее</a></div>${servicesHtml()}</div></div></section>` : ""}
  <div class="wrap"><div class="final"><h2>Ищете что-то конкретное?</h2><p>Свяжитесь с нами — поможем узнать наличие и подобрать подходящий товар.</p>${waBtn("Написать в WhatsApp")}</div></div>`;
}

function catalog(q) {
  setMeta("Каталог — Sotovik Zaisan", "Каталог товаров Sotovik Zaisan: аксессуары, наушники, зарядные устройства. Уточните наличие через WhatsApp.");
  const st = {cat: q.get("cat") || "", q: q.get("q") || "", flag: q.get("flag") || "", stock: false, sort: "new"};
  setTimeout(() => {
    const draw = () => {
      const par = SUB[st.cat] ? st.cat : parentOf(st.cat);
      $("#chips").innerHTML = [["", "Все"], ...catList()].map(([k, v]) => `<button class="chip ${st.cat === k || par === k ? "on" : ""}" data-c="${k}">${v}</button>`).join("");
      $("#subchips").innerHTML = par ? [[par, "Все " + CATS[par].toLowerCase()], ...SUB[par].map(k => [k, window.SUB_LABELS[k] || CATS[k]])].map(([k, v]) => `<button class="chip sm ${st.cat === k ? "on" : ""}" data-c="${k}">${v}</button>`).join("") : "";
      $("#subs").innerHTML = SUB[st.cat] ? `<div class="cats sub">${SUB[st.cat].map(k => catTile(k, CATS[k], "sm")).join("")}</div>` : ""; reveal($("#subs"));
      const t = st.q.trim().toLowerCase();
      const l = P.filter(p => (!st.cat || inCat(p, st.cat)) && (!st.stock || p.availability === "in_stock") &&
        (!st.flag || (st.flag === "sale" ? p.isSale : p.isNew)) &&
        (!t || [p.name, p.brand, CATS[p.category]].join(" ").toLowerCase().includes(t)));
      const idx = p => P.indexOf(p);
      l.sort(st.sort === "pa" ? (a, b) => a.price - b.price : st.sort === "pd" ? (a, b) => b.price - a.price : st.sort === "n" ? (a, b) => a.name.localeCompare(b.name, "ru") : (a, b) => (b.isNew - a.isNew) || idx(a) - idx(b));
      $("#cnt").textContent = `Найдено товаров: ${l.length}`;
      const emptyCat = !l.length && st.cat && !hasProducts(st.cat) && !t && !st.stock && !st.flag;
      const hd = $("#ph"); if (hd && !st.flag) hd.textContent = st.cat ? CATS[st.cat] : "Каталог";
      $("#res").innerHTML = l.length ? cards(l) : emptyCat ? `<div class="empty"><h3>Раздел скоро пополнится</h3><p>Товаров здесь пока нет. Напишите нам — подскажем, что есть в наличии.</p>${waBtn("Спросить в WhatsApp", "btn pri", `Здравствуйте! Интересует раздел «${CATS[st.cat]}». Подскажите, пожалуйста, что есть в наличии?`)}</div>` : '<div class="empty"><h3>По вашему запросу ничего не найдено</h3><p>Попробуйте изменить запрос или фильтры.</p><button class="btn" id="reset">Сбросить фильтры</button></div>';
      bindWA($("#res")); reveal($("#res"));
      const r = $("#reset"); if (r) r.onclick = () => { Object.assign(st, {cat: "", q: "", flag: "", stock: false}); $("#q").value = ""; $("#stock").checked = false; draw(); };
    };
    $("#q").oninput = e => { st.q = e.target.value; draw(); };
    $("#sort").onchange = e => { st.sort = e.target.value; draw(); };
    $("#stock").onchange = e => { st.stock = e.target.checked; draw(); };
    const pick = e => { const b = e.target.closest("[data-c]"); if (b) { st.cat = b.dataset.c; draw(); } };
    $("#chips").onclick = pick; $("#subchips").onclick = pick;
    draw(); if (q.get("focus")) $("#q").focus();
  });
  return `<div class="wrap"><h1 id="ph" class="page-h" style="font-size:clamp(2.2rem,5vw,3.6rem)">${st.flag === "sale" ? "Акции" : st.flag === "new" ? "Новинки" : "Каталог"}</h1>
  <div class="bar"><input class="in q" id="q" type="search" placeholder="Поиск по названию, бренду, категории" aria-label="Поиск" value="${esc(st.q)}">
  <select class="in" id="sort" aria-label="Сортировка"><option value="new">Сначала новые</option><option value="pa">Цена: по возрастанию</option><option value="pd">Цена: по убыванию</option><option value="n">По названию</option></select>
  <label class="in" style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="stock"> Только в наличии</label></div>
  <div class="chips" id="chips"></div><div class="chips" id="subchips"></div><div id="subs"></div><p class="mu" id="cnt" aria-live="polite"></p><div id="res"></div></div>`;
}

function product(id) {
  const p = P.find(x => x.id === id);
  if (!p) { setMeta("Товар не найден — Sotovik Zaisan"); return '<div class="wrap empty"><h1>Товар не найден</h1><p>Возможно, он удалён из каталога.</p><a class="btn pri" href="#/catalog">В каталог</a></div>'; }
  setMeta(`${p.name} — Sotovik Zaisan`, p.description);
  const rel = P.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  const specs = Object.entries(p.specifications || {}).filter(([, v]) => v).map(([k, v]) => `<div><span>${esc(SL[k] || k)}</span><b>${esc(v)}</b></div>`).join("");
  const imgN = Math.max(1, (p.images || []).length), n = imgN + (p.video ? 1 : 0);
  const slides = Array.from({length: imgN}, (_, i) => `<div class="slide">${imgTag(p, i, i > 0)}</div>`).join("")
    + (p.video ? `<div class="slide vid"><video src="${esc(p.video)}" ${p.videoPoster ? `poster="${esc(p.videoPoster)}"` : ""} controls playsinline preload="none"></video></div>` : "");
  const thumbs = Array.from({length: n}, (_, i) => i < imgN
    ? `<button data-i="${i}" aria-label="Фото ${i + 1}" aria-current="${i === 0}">${imgTag(p, i)}</button>`
    : `<button data-i="${i}" class="vt" aria-label="Видео" aria-current="false">${p.videoPoster ? `<img class="photo" src="${esc(p.videoPoster)}" alt="" loading="lazy">` : ""}<i>▶</i></button>`).join("");
  setTimeout(() => {
    const tr = $(".gal .track"); if (!tr) return;
    const bs = [...document.querySelectorAll(".thumbs button")];
    const go = i => tr.scrollTo({left: i * tr.clientWidth, behavior: "smooth"});
    bs.forEach(b => b.onclick = () => go(+b.dataset.i));
    const prev = $(".gal .nav.pv"), next = $(".gal .nav.nx");
    const cur = () => Math.round(tr.scrollLeft / tr.clientWidth);
    if (prev) prev.onclick = () => go(Math.max(0, cur() - 1));
    if (next) next.onclick = () => go(Math.min(n - 1, cur() + 1));
    let t;
    tr.addEventListener("scroll", () => { clearTimeout(t); t = setTimeout(() => {
      const c = cur();
      bs.forEach((x, i) => x.setAttribute("aria-current", String(i === c)));
      tr.querySelectorAll("video").forEach(v => { if (c !== n - 1) v.pause(); });
      if (prev) prev.hidden = c === 0; if (next) next.hidden = c === n - 1;
    }, 60); }, {passive: true});
    if (prev) prev.hidden = true;
  });
  return `<div class="wrap"><div class="crumb"><a href="#/catalog">Каталог</a> / <a href="#/catalog?cat=${esc(p.category)}">${esc(CATS[p.category])}</a></div>
  <div class="pd"><div class="gal"><div class="main"><div class="track">${slides}</div>${n > 1 ? '<button class="nav pv" aria-label="Назад">‹</button><button class="nav nx" aria-label="Далее">›</button>' : ""}</div>${n > 1 ? `<div class="thumbs">${thumbs}</div>` : ""}</div>
  <div class="info"><span class="mu">${esc([p.brand, CATS[p.category]].filter(Boolean).join(" · "))}${p.demo ? " · демонстрационный товар" : ""}</span><h1>${esc(p.name)}</h1><p class="mu desc">${esc(p.description)}</p>
  <div class="buy">${priceHtml(p)}<span class="st ${esc(p.availability)}">${AV[p.availability]}</span>
  <div class="cta">${waBtn("Заказать в WhatsApp", "btn pri", orderText(p, false))}${waBtn("Уточнить наличие", "btn", orderText(p, true))}</div>
  <p class="note">Заказ не оформлен, пока магазин не подтвердит наличие и условия в WhatsApp. Самовывоз: ${esc(C.address)}.</p></div>
  ${specs ? `<div class="specs">${specs}</div>` : ""}</div></div>
  ${rel.length ? `<section class="sec" style="padding-top:56px"><h2 style="margin-bottom:28px">Похожие товары</h2>${cards(rel)}</section>` : ""}</div>`;
}

function services() {
  setMeta("Услуги и о магазине — Sotovik Zaisan", "Ремонт смартфонов и электроники, перепрошивка, SIM и E-Sim в Зайсане.");
  const svc = activeServices();
  return `<div class="wrap"><h1 class="page-h" style="font-size:clamp(2.2rem,5vw,3.6rem)">О магазине${svc.length ? " и услуги" : ""}</h1>
  <p class="mu" style="max-width:36em;font-size:1.15rem;margin:16px 0 0">Sotovik Zaisan — магазин электроники в Зайсане. Продаём аксессуары и технику (почти всё, кроме чехлов).</p>
  ${svc.length ? `<div class="sec" style="padding-top:40px"><div class="svcband">${servicesHtml()}</div></div>` : ""}
  <div class="final"><h2>Нужна консультация?</h2><p>Опишите модель и задачу — подскажем по срокам и стоимости. Цены уточняйте у магазина.</p>${waBtn("Написать в WhatsApp", "btn pri", "Здравствуйте! Хочу узнать про услугу или товар.")}</div></div>`;
}

function contacts() {
  setMeta("Контакты — Sotovik Zaisan", "Адрес, телефон, WhatsApp и график работы магазина Sotovik Zaisan в Зайсане.");
  return `<div class="wrap"><h1 class="page-h" style="font-size:clamp(2.2rem,5vw,3.6rem)">Контакты</h1><div class="two"><div class="dl">
  <div><span class="mu">Адрес</span><b>${esc(C.address)}<br>${esc(C.plusCode)}</b></div>
  <div><span class="mu">Телефон</span><b><a href="tel:${esc(C.phoneTel)}">${esc(C.phoneDisplay)}</a></b></div>
  ${socials().map(s => `<div><span class="mu">${s[0]}</span><b><a href="${esc(s[1])}" target="_blank" rel="noopener">Открыть</a></b></div>`).join("")}
  <div style="display:block"><span class="mu">График работы</span><div class="dl" style="margin-top:6px">${hoursHtml()}</div></div></div>
  <div><div class="cta">${waBtn("Написать в WhatsApp")}<a class="btn" href="${routeUrl()}" target="_blank" rel="noopener">Построить маршрут</a></div>
  <p><a href="${mapUrl()}" target="_blank" rel="noopener" style="color:var(--ac);font-weight:600">Открыть на карте</a></p></div></div></div>`;
}

function footer() {
  $("#footer").innerHTML = `<div class="fg"><div><b>SOTOVIK ZAISAN</b><p style="margin-top:8px">Магазин электроники и сервисный центр в Зайсане.</p></div>
  <div><h3>Разделы</h3><a href="#/catalog">Каталог</a><a href="#/services">О магазине</a><a href="#/contacts">Контакты</a></div>
  <div><h3>Категории</h3>${catList().slice(0, 6).map(([k, v]) => `<a href="#/catalog?cat=${k}">${v}</a>`).join("")}</div>
  <div><h3>Контакты</h3><a href="tel:${esc(C.phoneTel)}">${esc(C.phoneDisplay)}</a><a data-wa>WhatsApp</a>${socials().map(s => `<a href="${esc(s[1])}" target="_blank" rel="noopener">${s[0]}</a>`).join("")}<p>${esc(C.address)}</p><p>${C.hours.map(h => h.join(" ")).join(", ")}</p></div></div>
  <div class="copy">© ${new Date().getFullYear()} ${esc(C.name)}</div>`;
}

/* ---------- scroll animations ---------- */
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const io = "IntersectionObserver" in window && !REDUCED ? new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
}), {threshold: 0.12, rootMargin: "0px 0px -6% 0px"}) : null;
function reveal(root) {
  if (!io) return;
  root.querySelectorAll(".sec-h, .page-h, .crumb, .bar, .card, .cat, .tile, .svcband, .final, .gal, .info, .dl > div, .empty, .specs div, .svc > div, .sec > .wrap > h2, .sec > h2").forEach(el => {
    if (el.classList.contains("rv")) return;
    const sib = [...el.parentElement.children].indexOf(el);
    el.style.transitionDelay = Math.min(sib % 4, 3) * 70 + "ms";
    el.classList.add("rv"); io.observe(el);
  });
}
// лёгкий параллакс телефонов в Hero и тень шапки при прокрутке
let tick = false;
addEventListener("scroll", () => {
  if (tick) return; tick = true;
  requestAnimationFrame(() => {
    const y = scrollY; tick = false;
    $("#hdr").classList.toggle("sc", y > 8);
    if (!REDUCED && y < 900) { const a = $(".hero-art .a"), b = $(".hero-art .b"); if (a) a.style.marginTop = y * 0.05 + "px"; if (b) b.style.marginTop = y * 0.12 + "px"; }
  });
}, {passive: true});

/* ---------- router ---------- */
function route() {
  const [path, qs] = location.hash.slice(1).split("?"); const q = new URLSearchParams(qs || "");
  const seg = path.split("/").filter(Boolean); const r = seg[0] || "home";
  const view = r === "catalog" ? catalog(q) : r === "product" ? product(decodeURIComponent(seg[1] || "")) : r === "services" ? services() : r === "contacts" ? contacts() : home();
  $("#app").innerHTML = view; bindWA($("#app")); reveal($("#app"));
  document.querySelectorAll("#nav a").forEach(a => a.classList.toggle("on", a.dataset.r === (r === "product" ? "catalog" : r)));
  $("#nav").classList.remove("show"); $("#burger").setAttribute("aria-expanded", "false");
  if (!q.get("focus")) window.scrollTo(0, 0);
}
$("#burger").onclick = () => { const o = $("#nav").classList.toggle("show"); $("#burger").setAttribute("aria-expanded", String(o)); };
if (!activeServices().length) { const n = $("#nav [data-r=services]"); n.textContent = "О магазине"; }
footer(); bindWA(document); window.addEventListener("hashchange", route); route();
})();
