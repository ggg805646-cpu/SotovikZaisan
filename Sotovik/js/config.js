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
    {enabled: true, title: "Ремонт техники", text: "Смартфоны, планшеты, ноутбуки, колонки, наушники и телевизоры."},
    {enabled: true, title: "Программные услуги", text: "Перепрошивка Android-устройств и восстановление доступа к iCloud."},
    {enabled: true, title: "SIM и E-Sim", text: "Регистрация физических SIM-карт и подключение E-Sim."}
  ],
  // true — показывать разделы каталога, даже если в них пока нет товаров
  showEmptyCategories: true,
  domain: ""
};
