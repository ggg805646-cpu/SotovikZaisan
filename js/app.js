(() => {
"use strict";
const C = window.CONFIG, P = window.PRODUCTS, CATS = window.CATEGORIES, SL = window.SPEC_LABELS;
const I = window.I18N, T = I.t, KK = () => I.lang === "kk";
const L = (o, k) => (KK() && o[k + "_kk"]) || o[k];   // название/описание на выбранном языке
const cat = k => T(CATS[k]);
const $ = (s, r = document) => r.querySelector(s);
const ESC = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"};
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ESC[c]);
const money = n => n == null ? "" : n.toLocaleString("ru-RU").replace(/\u00a0/g, " ") + " ₸";
const AV = {in_stock: "В наличии", order: "Под заказ", out: "Нет в наличии"};
const av = a => T(AV[a] || "");
const ICON = '<svg viewBox="0 0 48 48"><rect x="14" y="5" width="20" height="38" rx="4"/><path d="M21 38h6"/></svg>';

// WhatsApp: единое место формирования ссылок (номер берётся из config.js)
const waLink = text => C.whatsapp ? `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}` : "";
const orderText = (p, ask) => `${T("Здравствуйте! Меня интересует товар:")}\n\n${L(p, "name")}\n${p.price != null ? T("Цена: ") + money(p.price) + "\n" : ""}\n${ask ? T("Подскажите, пожалуйста, есть ли он в наличии?") : T("Хочу заказать. Подскажите, пожалуйста, наличие и условия получения.")}`;
function bindWA(root) {
  root.querySelectorAll("[data-wa]").forEach(a => {
    const href = waLink(a.dataset.wa || T("Здравствуйте! Хочу уточнить информацию."));
    if (href) { a.href = href; a.target = "_blank"; a.rel = "noopener"; }
    else { a.removeAttribute("href"); a.setAttribute("aria-disabled", "true"); a.title = T("Номер WhatsApp не задан"); }
  });
}
const waBtn = (txt, cls = "btn pri", msg = "") => `<a class="${cls}" data-wa="${esc(msg)}">${txt}</a>`;

const placeholder = () => `<div class="mu" style="width:40%">${ICON}</div>`;
const imgSrc = (p, i) => (p.images && p.images[i]) || (i === 0 ? window.CAT_IMG[p.category] : "");
const imgTag = (p, i = 0, lazy = true) => {
  const src = imgSrc(p, i);
  if (!src) return placeholder();
  return `<img class="${src.endsWith(".svg") ? "" : "photo"}" src="${esc(src)}" alt="${esc(L(p, "name"))}" ${lazy ? "loading=lazy" : ""} data-fallback>`;
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
  const tag = p.isSale ? `<span class="tag sale">${T("Акция")}</span>` : p.isNew ? `<span class="tag">${T("Новинка")}</span>` : p.featured ? `<span class="tag">${T("Популярное")}</span>` : "";
  return `<a class="card" href="#/product/${esc(p.id)}"><div class="ph">${tag}${p.demo ? `<span class="tag demo">${T("Демо")}</span>` : ""}${imgTag(p)}</div>
  <div class="bd"><span class="br">${esc([p.brand, cat(p.category)].filter(Boolean).join(" · "))}</span><span class="nm">${esc(L(p, "name"))}</span>${priceHtml(p)}
  <span class="st ${esc(p.availability)}">${av(p.availability)}</span></div></a>`;
};
const cards = list => list.length ? `<div class="grid">${list.map(card).join("")}</div>` : "";
const SUB = window.SUBCATS || {};
const parentOf = k => Object.keys(SUB).find(pk => SUB[pk].includes(k));
const inCat = (p, k) => p.category === k || (SUB[k] || []).includes(p.category);
const hasProducts = k => P.some(p => inCat(p, k));
// верхний уровень разделов (без подразделов)
const catList = () => Object.entries(CATS).filter(([k]) => !parentOf(k) && (C.showEmptyCategories || hasProducts(k))).map(([k, v]) => [k, T(v)]);
const catImgCls = k => window.CAT_IMG[k].endsWith(".svg") ? "" : window.CAT_IMG[k].includes("/cat-") ? "photo blend" : "photo";
const catTile = (k, label, cls = "") => `<a class="cat ${cls}" href="#/catalog?cat=${k}"><b>${label}</b>${hasProducts(k) ? "" : '<span class="soon">${T("Скоро")}</span>'}<img class="${catImgCls(k)}" src="${window.CAT_IMG[k]}" alt="" loading="lazy"></a>`;
const hoursHtml = () => C.hours.map(([d, t]) => `<div><span>${esc(T(d))}</span><b>${esc(T(t))}</b></div>`).join("");
const handle = u => "@" + u.split("@")[1];
const socials = () => [["Instagram", C.instagram], ...[].concat(C.tiktok || []).map(u => ["TikTok " + handle(u), u]), ["Telegram", C.telegram]].filter(s => s[1]);
const mapUrl = () => C.mapLink || "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.plusCode + " Зайсан");
const routeUrl = () => C.routeLink || mapUrl();

function setMeta(title, desc) {
  document.title = title;
  const m = $("meta[name=description]"); if (m && desc) m.content = desc;
}

const activeServices = () => C.showServices ? (C.services || []).filter(s => s.enabled !== false) : [];
const servicesHtml = () => `<div class="svc">${activeServices().map(s => `<div><h3>${esc(L(s, "title"))}</h3><p>${esc(L(s, "text"))}</p></div>`).join("")}</div>`;

/* ---------- pages ---------- */
function home() {
  setMeta(T("Sotovik Zaisan — электроника, ремонт и аксессуары в Зайсане"), T("Аксессуары, наушники, зарядные устройства, ремонт телефонов и электроники в Зайсане. Каталог и заказ через WhatsApp."));
  const pop = P.filter(p => p.featured).slice(0, 8), nw = P.filter(p => p.isNew), sale = P.filter(p => p.isSale);
  const sec = (t, l, href, max = 4) => l.length ? `<section class="sec"><div class="wrap"><div class="sec-h"><h2>${t}</h2><a class="link" href="${href}">${T("Все товары")}</a></div>${cards(l.slice(0, max))}</div></section>` : "";
  const tile = (cls, t, txt, href, img) => `<a class="tile ${cls}" href="${href}"><h2>${t}</h2><p>${txt}</p><span class="btn wh sm">${T("Смотреть")}</span><img src="${img}" alt="" loading="lazy"></a>`;
  const svc = activeServices();
  return `<div class="wrap hero"><div class="hero-box"><div><h1>${T("Техника под рукой")}</h1>
  <p>${T("Аксессуары, наушники и зарядные устройства. Ремонт и настройка устройств. Наличие уточним заранее в WhatsApp.")}</p>
  <div class="cta"><a class="btn pri" href="#/catalog">${T("Смотреть каталог")}</a>${waBtn(T("Связаться с нами"), "btn")}</div></div>
  <div class="hero-art"><img class="a" src="${esc(C.heroImageBack || C.heroImage)}" alt=""><img class="b" src="${esc(C.heroImage)}" alt="${T("Смартфон")}"></div></div></div>
  <section class="sec"><div class="wrap"><div class="sec-h"><h2>${T("Категории")}</h2></div><div class="cats" data-n="${catList().length}">${catList().map(([k, v]) => catTile(k, v)).join("")}</div></div></section>
  ${sec(T("Популярные товары"), pop, "#/catalog", 8)}
  ${nw.length || sale.length ? `<section class="sec"><div class="wrap promo">${nw.length ? tile("n", T("Новые поступления"), T("Свежие товары в каталоге."), "#/catalog?flag=new", imgSrc(nw[0], 0)) : ""}${sale.length ? tile("s", T("Акции"), T("Товары со сниженной ценой."), "#/catalog?flag=sale", imgSrc(sale[0], 0)) : ""}</div></section>` : ""}
  ${svc.length ? `<section class="sec"><div class="wrap"><div class="svcband"><div class="sec-h" style="margin:0"><h2>${T("Сервис и услуги")}</h2><a class="btn ln sm" href="#/services">${T("Подробнее")}</a></div>${servicesHtml()}<div class="cta" style="margin-top:28px"><a class="btn pri" href="#/repair">${T("Оставить заявку на ремонт")}</a></div></div></div></section>` : ""}
  <div class="wrap"><div class="final"><h2>${T("Ищете что-то конкретное?")}</h2><p>${T("Свяжитесь с нами — поможем узнать наличие и подобрать подходящий товар.")}</p>${waBtn(T("Написать в WhatsApp"))}</div></div>`;
}

function catalog(q) {
  setMeta(T("Каталог — Sotovik Zaisan"), T("Каталог товаров Sotovik Zaisan: аксессуары, наушники, зарядные устройства. Уточните наличие через WhatsApp."));
  const st = {cat: q.get("cat") || "", q: q.get("q") || "", flag: q.get("flag") || "", stock: false, sort: "new"};
  setTimeout(() => {
    const draw = () => {
      const par = SUB[st.cat] ? st.cat : parentOf(st.cat);
      $("#chips").innerHTML = [["", T("Все")], ...catList()].map(([k, v]) => `<button class="chip ${st.cat === k || par === k ? "on" : ""}" data-c="${k}">${v}</button>`).join("");
      $("#subchips").innerHTML = par ? [[par, KK() ? T("Все") : "Все " + CATS[par].toLowerCase()], ...SUB[par].map(k => [k, T(window.SUB_LABELS[k] || CATS[k])])].map(([k, v]) => `<button class="chip sm ${st.cat === k ? "on" : ""}" data-c="${k}">${v}</button>`).join("") : "";
      $("#subs").innerHTML = SUB[st.cat] ? `<div class="cats sub">${SUB[st.cat].map(k => catTile(k, cat(k), "sm")).join("")}</div>` : ""; reveal($("#subs"));
      const t = st.q.trim().toLowerCase();
      const l = P.filter(p => (!st.cat || inCat(p, st.cat)) && (!st.stock || p.availability === "in_stock") &&
        (!st.flag || (st.flag === "sale" ? p.isSale : p.isNew)) &&
        (!t || [p.name, p.name_kk, p.brand, CATS[p.category], cat(p.category)].join(" ").toLowerCase().includes(t)));
      const idx = p => P.indexOf(p);
      l.sort(st.sort === "pa" ? (a, b) => a.price - b.price : st.sort === "pd" ? (a, b) => b.price - a.price : st.sort === "n" ? (a, b) => L(a, "name").localeCompare(L(b, "name"), KK() ? "kk" : "ru") : (a, b) => (b.isNew - a.isNew) || idx(a) - idx(b));
      $("#cnt").textContent = T("Найдено товаров: ") + l.length;
      const emptyCat = !l.length && st.cat && !hasProducts(st.cat) && !t && !st.stock && !st.flag;
      const hd = $("#ph"); if (hd && !st.flag) hd.textContent = st.cat ? cat(st.cat) : T("Каталог");
      $("#res").innerHTML = l.length ? cards(l) : emptyCat ? `<div class="empty"><h3>${T("Раздел скоро пополнится")}</h3><p>${T("Товаров здесь пока нет. Напишите нам — подскажем, что есть в наличии.")}</p>${waBtn(T("Спросить в WhatsApp"), "btn pri", T("Здравствуйте! Интересует раздел «") + cat(st.cat) + T("». Подскажите, пожалуйста, что есть в наличии?"))}</div>` : '<div class="empty"><h3>${T("По вашему запросу ничего не найдено")}</h3><p>${T("Попробуйте изменить запрос или фильтры.")}</p><button class="btn" id="reset">${T("Сбросить фильтры")}</button></div>';
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
  return `<div class="wrap"><h1 id="ph" class="page-h" style="font-size:clamp(2.2rem,5vw,3.6rem)">${T(st.flag === "sale" ? "Акции" : st.flag === "new" ? "Новинки" : "Каталог")}</h1>
  <div class="bar"><input class="in q" id="q" type="search" placeholder="${T("Поиск по названию, бренду, категории")}" aria-label="${T("Поиск")}" value="${esc(st.q)}">
  <select class="in" id="sort" aria-label="${T("Сортировка")}"><option value="new">${T("Сначала новые")}</option><option value="pa">${T("Цена: по возрастанию")}</option><option value="pd">${T("Цена: по убыванию")}</option><option value="n">${T("По названию")}</option></select>
  <label class="in" style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="stock"> ${T("Только в наличии")}</label></div>
  <div class="chips" id="chips"></div><div class="chips" id="subchips"></div><div id="subs"></div><p class="mu" id="cnt" aria-live="polite"></p><div id="res"></div></div>`;
}

function product(id) {
  const p = P.find(x => x.id === id);
  if (!p) { setMeta(T("Товар не найден — Sotovik Zaisan")); return `<div class="wrap empty"><h1>${T("Товар не найден")}</h1><p>${T("Возможно, он удалён из каталога.")}</p><a class="btn pri" href="#/catalog">${T("В каталог")}</a></div>`; }
  setMeta(`${L(p, "name")} — Sotovik Zaisan`, L(p, "description"));
  const rel = P.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  const specs = Object.entries(p.specifications || {}).filter(([, v]) => v).map(([k, v]) => `<div><span>${esc(T(SL[k] || k))}</span><b>${esc(T(v))}</b></div>`).join("");
  const imgN = Math.max(1, (p.images || []).length), n = imgN + (p.video ? 1 : 0);
  const slides = Array.from({length: imgN}, (_, i) => `<div class="slide">${imgTag(p, i, i > 0)}</div>`).join("")
    + (p.video ? `<div class="slide vid"><video src="${esc(p.video)}" ${p.videoPoster ? `poster="${esc(p.videoPoster)}"` : ""} controls playsinline preload="none"></video></div>` : "");
  const thumbs = Array.from({length: n}, (_, i) => i < imgN
    ? `<button data-i="${i}" aria-label="${T("Фото ")}${i + 1}" aria-current="${i === 0}">${imgTag(p, i)}</button>`
    : `<button data-i="${i}" class="vt" aria-label="${T("Видео")}" aria-current="false">${p.videoPoster ? `<img class="photo" src="${esc(p.videoPoster)}" alt="" loading="lazy">` : ""}<i>▶</i></button>`).join("");
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
  return `<div class="wrap"><div class="crumb"><a href="#/catalog">${T("Каталог")}</a> / <a href="#/catalog?cat=${esc(p.category)}">${esc(cat(p.category))}</a></div>
  <div class="pd"><div class="gal"><div class="main"><div class="track">${slides}</div>${n > 1 ? `<button class="nav pv" aria-label="${T("Назад")}">‹</button><button class="nav nx" aria-label="${T("Далее")}">›</button>` : ""}</div>${n > 1 ? `<div class="thumbs">${thumbs}</div>` : ""}</div>
  <div class="info"><span class="mu">${esc([p.brand, cat(p.category)].filter(Boolean).join(" · "))}${p.demo ? T(" · демонстрационный товар") : ""}</span><h1>${esc(L(p, "name"))}</h1><p class="mu desc">${esc(L(p, "description"))}</p>
  <div class="buy">${priceHtml(p)}<span class="st ${esc(p.availability)}">${av(p.availability)}</span>
  <div class="cta">${waBtn(T("Заказать в WhatsApp"), "btn pri", orderText(p, false))}${waBtn(T("Уточнить наличие"), "btn", orderText(p, true))}</div>
  <p class="note">${T("Заказ не оформлен, пока магазин не подтвердит наличие и условия в WhatsApp. Самовывоз: ")}${esc(T(C.address).replace(/\.$/, ""))}.</p></div>
  ${specs ? `<div class="specs">${specs}</div>` : ""}</div></div>
  ${rel.length ? `<section class="sec" style="padding-top:56px"><h2 style="margin-bottom:28px">${T("Похожие товары")}</h2>${cards(rel)}</section>` : ""}</div>`;
}

function services() {
  setMeta(T("Услуги и о магазине — Sotovik Zaisan"), T("Ремонт смартфонов и электроники, перепрошивка, SIM и E-Sim в Зайсане."));
  const svc = activeServices();
  return `<div class="wrap"><h1 class="page-h" style="font-size:clamp(2.2rem,5vw,3.6rem)">${T("О магазине" + (svc.length ? " и услуги" : ""))}</h1>
  <p class="mu" style="max-width:36em;font-size:1.15rem;margin:16px 0 0">${T("Sotovik Zaisan — магазин электроники в Зайсане. Продаём аксессуары и технику (почти всё, кроме чехлов).")}</p>
  ${svc.length ? `<div class="sec" style="padding-top:40px"><div class="svcband">${servicesHtml()}<div class="cta" style="margin-top:28px"><a class="btn pri" href="#/repair">${T("Оставить заявку на ремонт")}</a></div></div></div>` : ""}
  <div class="final"><h2>${T("Нужна консультация?")}</h2><p>${T("Опишите модель и задачу — подскажем по срокам и стоимости. Цены уточняйте у магазина.")}</p>${waBtn(T("Написать в WhatsApp"), "btn pri", T("Здравствуйте! Хочу узнать про услугу или товар."))}</div></div>`;
}

function repair() {
  setMeta(T("Заявка на ремонт — Sotovik Zaisan"), T("Опишите, что случилось с устройством. Откроется WhatsApp с готовым сообщением — останется нажать «Отправить», и мы ответим по срокам и стоимости."));
  const devs = ["Смартфон", "Планшет", "Ноутбук", "Наушники / колонка", "Телевизор", "Другое"];
  setTimeout(() => {
    const f = $("#rf"); if (!f) return;
    f.onsubmit = e => {
      e.preventDefault();
      const v = id => f.elements[id].value.trim();
      const lines = [T("Здравствуйте! Заявка на ремонт."), T("Устройство: ") + T(v("dev"))];
      if (v("model")) lines.push(T("Модель: ") + v("model"));
      lines.push(T("Что случилось: ") + v("issue"));
      if (v("name")) lines.push(T("Имя: ") + v("name"));
      const url = waLink(lines.join("\n"));
      if (!url) { alert(T("Номер WhatsApp не задан")); return; }
      const w = window.open(url, "_blank"); if (w) w.opener = null; else location.href = url;
    };
  });
  return `<div class="wrap"><h1 class="page-h" style="font-size:clamp(2.2rem,5vw,3.6rem)">${T("Заявка на ремонт")}</h1>
  <p class="mu" style="max-width:36em;font-size:1.1rem;margin:16px 0 0">${T("Опишите, что случилось с устройством. Откроется WhatsApp с готовым сообщением — останется нажать «Отправить», и мы ответим по срокам и стоимости.")}</p>
  <form id="rf" class="rf">
    <label>${T("Тип устройства")}<select class="in" name="dev">${devs.map(d => `<option value="${esc(d)}">${esc(T(d))}</option>`).join("")}</select></label>
    <label>${T("Модель (например, Redmi Note 12)")}<input class="in" name="model" maxlength="80" autocomplete="off"></label>
    <label>${T("Что случилось")}<textarea class="in ta" name="issue" required maxlength="600" rows="4" placeholder="${esc(T("Например: разбит экран, не заряжается, не включается"))}"></textarea></label>
    <label>${T("Ваше имя (необязательно)")}<input class="in" name="name" maxlength="60" autocomplete="name"></label>
    <button class="btn pri" type="submit">${T("Отправить в WhatsApp")}</button>
    <p class="mu note">${T("Заявка отправляется через ваш WhatsApp. Цену и срок мы назовём после уточнения.")}</p>
  </form></div>`;
}

function contacts() {
  setMeta(T("Контакты — Sotovik Zaisan"), T("Адрес, телефон, WhatsApp и график работы магазина Sotovik Zaisan в Зайсане."));
  return `<div class="wrap"><h1 class="page-h" style="font-size:clamp(2.2rem,5vw,3.6rem)">${T("Контакты")}</h1><div class="two"><div class="dl">
  <div><span class="mu">${T("Адрес")}</span><b>${esc(T(C.address))}<br>${esc(C.plusCode)}</b></div>
  <div><span class="mu">${T("Телефон")}</span><b><a href="tel:${esc(C.phoneTel)}">${esc(C.phoneDisplay)}</a></b></div>
  ${socials().map(s => `<div><span class="mu">${s[0]}</span><b><a href="${esc(s[1])}" target="_blank" rel="noopener">${T("Открыть")}</a></b></div>`).join("")}
  <div style="display:block"><span class="mu">${T("График работы")}</span><div class="dl" style="margin-top:6px">${hoursHtml()}</div></div></div>
  <div><div class="cta">${waBtn(T("Написать в WhatsApp"))}<a class="btn" href="${routeUrl()}" target="_blank" rel="noopener">${T("Построить маршрут")}</a></div>
  <p><a href="${mapUrl()}" target="_blank" rel="noopener" style="color:var(--ac);font-weight:600">${T("Открыть на карте")}</a></p></div></div></div>`;
}

// строки подвала в виде кнопок: значок, текст, стрелка — сразу видно, что это можно нажать
const FI = {
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  wa: '<path d="M4 20l1.3-4.2A8 8 0 1 1 8.4 19z"/><path d="M9 9.5c.5 2 2.5 4 4.5 4.5l1.2-1.2-1.7-1-.8.6a4 4 0 0 1-1.8-1.8l.6-.8-1-1.7z"/>',
  ig: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.8" cy="7.2" r=".6"/>',
  tt: '<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 4c.4 2.2 1.9 3.6 4 3.8"/>',
  tg: '<path d="M21 4 3 11l5.5 2L10 19l3-3.5 4.5 3.3z"/><path d="m8.5 13 8-6"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'
};
const ficon = n => `<svg viewBox="0 0 24 24" aria-hidden="true">${FI[n]}</svg>`;
const fl = (icon, text, attrs, cls = "") => `<a class="fl ${cls}" ${attrs}><i>${ficon(icon)}</i><span>${text}</span><b aria-hidden="true">›</b></a>`;
const socIcon = n => /instagram/i.test(n) ? "ig" : /tiktok/i.test(n) ? "tt" : "tg";
function footer() {
  $("#footer").innerHTML = `<div class="fg"><div><b>SOTOVIK ZAISAN</b><p style="margin-top:8px">${T("Магазин электроники и сервисный центр в Зайсане.")}</p></div>
  <div><h3>${T("Разделы")}</h3><a href="#/catalog">${T("Каталог")}</a><a href="#/services">${T("О магазине")}</a>${activeServices().length ? `<a href="#/repair">${T("Заявка на ремонт")}</a>` : ""}<a href="#/contacts">${T("Контакты")}</a></div>
  <div><h3>${T("Категории")}</h3>${catList().slice(0, 6).map(([k, v]) => `<a href="#/catalog?cat=${k}">${v}</a>`).join("")}</div>
  <div class="fc"><h3>${T("Контакты")}</h3>${fl("phone", esc(C.phoneDisplay), `href="tel:${esc(C.phoneTel)}"`)}${fl("wa", "WhatsApp", "data-wa", "wa")}${socials().map(s => fl(socIcon(s[0]), s[0], `href="${esc(s[1])}" target="_blank" rel="noopener"`)).join("")}${fl("pin", esc(T(C.address)), `href="${mapUrl()}" target="_blank" rel="noopener"`)}<div class="fl-info"><i>${ficon("clock")}</i><span>${C.hours.map(h => h.map(x => T(x)).join(" ")).join(", ")}</span></div></div></div>
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
  const view = r === "catalog" ? catalog(q) : r === "product" ? product(decodeURIComponent(seg[1] || "")) : r === "services" ? services() : r === "repair" ? repair() : r === "contacts" ? contacts() : home();
  $("#app").innerHTML = view; bindWA($("#app")); reveal($("#app"));
  document.querySelectorAll("#nav a").forEach(a => a.classList.toggle("on", a.dataset.r === (r === "product" ? "catalog" : r)));
  $("#nav").classList.remove("show"); $("#burger").setAttribute("aria-expanded", "false");
  if (!q.get("focus")) window.scrollTo(0, 0);
}
$("#burger").onclick = () => { const o = $("#nav").classList.toggle("show"); $("#burger").setAttribute("aria-expanded", String(o)); };
if (!activeServices().length) { const n = $("#nav [data-r=services]"); n.textContent = "О магазине"; }
function applyStatic() {
  document.documentElement.lang = I.lang;
  document.querySelectorAll("[data-t]").forEach(e => { e.textContent = T(e.dataset.t); });
  document.querySelectorAll("[data-ta]").forEach(e => e.setAttribute("aria-label", T(e.dataset.ta)));
  const lb = $("#lang"); if (lb) { lb.textContent = KK() ? "РУС" : "ҚАЗ"; lb.setAttribute("aria-label", KK() ? "Русский язык" : "Қазақ тілі"); }
}
const lb = $("#lang");
if (lb) lb.onclick = () => { const y = window.scrollY; I.setLang(KK() ? "ru" : "kk"); applyStatic(); footer(); bindWA(document); route(); window.scrollTo(0, y); };
applyStatic(); footer(); bindWA(document); window.addEventListener("hashchange", route); route();
})();
