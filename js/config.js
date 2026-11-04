// Все данные магазина — только здесь.
window.CONFIG = {
  name: "Sotovik Zaisan",
  phoneDisplay: "+7 (702) 179-60-60",
  phoneTel: "+77021796060",
  whatsapp: "77021796060", // только цифры, без +
  address: "ул. Абая, 77, г. Зайсан",
  plusCode: "FVCC+WP7",
  hours: [["Пн–Сб", "09:00–18:00"], ["Вс", "выходной"]],
  // Соцсети (пустое значение = ссылка скрыта). tiktok — список аккаунтов.
  instagram: "https://www.instagram.com/sotovik_zaisan",
  tiktok: ["https://www.tiktok.com/@sotovik.zaysan", "https://www.tiktok.com/@sotovik_zaisan"],
  telegram: "",
  // Ссылка на карту и маршрут (одна и та же, из Google Maps — на ней есть кнопка «Маршрут»)
  mapLink: "https://maps.app.goo.gl/MYTdygU93hAHbHZH8",
  routeLink: "https://maps.app.goo.gl/MYTdygU93hAHbHZH8",
  // Главное изображение первого экрана. Замените на свою фотографию, например "assets/hero.webp"
  heroImage: "assets/img/hero-front.webp",
  heroImageBack: "assets/img/hero-back.webp",
  // Услуги: меняйте текст, отключайте через enabled:false. showServices:false скрывает блок и страницу целиком.
  showServices: true,
  services: [
    {enabled: true, title: "Ремонт техники", title_kk: "Техниканы жөндеу", text: "Смартфоны, планшеты, ноутбуки, колонки, наушники и телевизоры.", text_kk: "Смартфондар, планшеттер, ноутбуктер, колонкалар, құлаққаптар және теледидарлар."},
    {enabled: true, title: "Программные услуги", title_kk: "Бағдарламалық қызметтер", text: "Перепрошивка Android-устройств и восстановление доступа к iCloud.", text_kk: "Android құрылғыларын қайта прошивкалау және iCloud-қа қолжетімділікті қалпына келтіру."},
    {enabled: true, title: "SIM и E-Sim", title_kk: "SIM және E-Sim", text: "Регистрация физических SIM-карт и подключение E-Sim.", text_kk: "Физикалық SIM-карталарды тіркеу және E-Sim қосу."}
  ],
  // true — показывать разделы каталога, даже если в них пока нет товаров
  showEmptyCategories: true,
  domain: ""
};
