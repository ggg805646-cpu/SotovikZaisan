// Поле video (mp4) и videoPoster (картинка-обложка) — необязательные: видео показывается последним в галерее карточки.
// Единая база товаров. Данные внесены со слов владельца (цены, описания) и по его фотографиям.
// Перед публикацией проверьте цены и наличие. Чтобы добавить товар — скопируйте объект и поменяйте поля.
window.CATEGORIES = {smartphones:"Смартфоны",phones_new:"Новые смартфоны",phones_used:"Смартфоны б/у",headphones:"Наушники",chargers:"Зарядные устройства",cables:"Кабели",watches:"Умные часы",other:"Разное"};
// Вложенные разделы: ключ — родитель, значение — подразделы. Товару в products указывайте подраздел (phones_new / phones_used).
window.SUBCATS = {smartphones:["phones_new","phones_used"]};
window.SUB_LABELS = {phones_new:"Новые",phones_used:"Б/у"};
// Пустые категории показываются, пока в config.js включено showEmptyCategories.
// Картинки категорий: фото или иллюстрации.
window.CAT_IMG = {smartphones:"assets/img/cat-phones.webp",phones_new:"assets/img/cat-phones.webp",phones_used:"assets/img/cat-phones-used.webp",headphones:"assets/products/earpods-usbc.webp",chargers:"assets/products/charger-20w-1.webp",cables:"assets/products/cable-usbc-1m.webp",watches:"assets/products/watch-w26.webp",other:"assets/img/cat-other.webp"};
window.SPEC_LABELS = {storage:"Память",ram:"Оперативная память",color:"Цвет",connection:"Подключение",battery:"Автономность",power:"Мощность",connector:"Разъём",length:"Длина кабеля",type:"Тип",compat:"Совместимость",kit:"Комплектация",versions:"Версии",material:"Материал рамки",condition:"Состояние"};
window.PRODUCTS = [
 {id:"earpods-usbc-lux",name:"Наушники USB-C с микрофоном (Lux-качество)",name_kk:"Микрофоны бар USB-C құлаққаптары (Lux сапасы)",brand:"",category:"headphones",price:2499,oldPrice:null,
  description:"Новое поступление. Чистый звук, удобный разъём USB-C и микрофон для звонков.\nЦена 2 499 ₸ с учётом кабеля USB–USB C. При самовывозе из магазина — 2 000 ₸.",
  description_kk:"Жаңа түскен тауар. Таза дыбыс, ыңғайлы USB-C ұяшығы және қоңырауға арналған микрофон.\nБағасы 2 499 ₸ — USB–USB C кабелімен бірге. Дүкеннен өзі алып кетсеңіз — 2 000 ₸.",
  images:["assets/products/earpods-usbc.webp"],specifications:{connection:"USB-C",kit:"наушники, кабель USB–USB C"},availability:"in_stock",featured:true,isNew:true,isSale:false},
 {id:"charger-usbc-20w",name:"Сетевое зарядное устройство USB-C 20 Вт",name_kk:"USB-C 20 Вт желілік зарядтағыш",brand:"",category:"chargers",price:7990,oldPrice:null,
  description:"Быстрая, безопасная зарядка для смартфонов и другой техники.\nЗаряжает смартфон от 0% до 50% примерно за 30 минут. Защита от перегрева, перепадов напряжения и короткого замыкания. Подходит для iPhone (8 и новее), iPad, AirPods и других устройств с USB-C.",
  description_kk:"Смартфондар мен басқа техникаға арналған жылдам әрі қауіпсіз зарядтау.\nСмартфонды 0%-дан 50%-ға дейін шамамен 30 минутта зарядтайды. Қызып кетуден, кернеу секірулерінен және қысқа тұйықталудан қорғаныс бар. iPhone (8 және одан жаңа), iPad, AirPods және USB-C бар басқа құрылғыларға жарайды.",
  images:["assets/products/charger-20w-1.webp","assets/products/charger-20w-2.webp"],specifications:{power:"20 Вт",connector:"USB-C",kit:"адаптер 20 Вт, фирменная упаковка"},availability:"in_stock",featured:true,isNew:false,isSale:false},
 {id:"cable-usbc-1m",name:"Кабель USB-C — Lightning / USB-C — USB-C, 1 м",name_kk:"USB-C — Lightning / USB-C — USB-C кабелі, 1 м",brand:"",category:"cables",price:4990,oldPrice:null,
  description:"Быстрая и безопасная зарядка без нагрева и сбоев. Встроенные чипы защиты, поддержка быстрой зарядки и стабильная передача данных.\nДве версии: USB-C — Lightning (iPhone 8–14, iPad, AirPods) и USB-C — USB-C (iPhone 15 / 16, iPad, Android и другие современные устройства).",
  description_kk:"Қызбай, іркіліссіз жылдам әрі қауіпсіз зарядтау. Қорғаныс чиптері орнатылған, жылдам зарядтауды қолдайды және деректі тұрақты жібереді.\nЕкі нұсқасы бар: USB-C — Lightning (iPhone 8–14, iPad, AirPods) және USB-C — USB-C (iPhone 15 / 16, iPad, Android және басқа заманауи құрылғылар).",
  images:["assets/products/cable-usbc-1m.webp"],specifications:{length:"1 м",versions:"USB-C — Lightning; USB-C — USB-C"},availability:"in_stock",featured:true,isNew:false,isSale:false},
 {id:"watch-w26-3in1",name:"Набор 3 в 1: смарт-часы W26 Pro Max Special + наушники + ремешки",name_kk:"3-і бір жинақ: W26 Pro Max Special смарт-сағаты + құлаққап + қайыстар",brand:"Watch+",category:"watches",price:4490,oldPrice:null,
  description:"Стильный комплект на каждый день и хороший подарок.\nСмарт-часы: вызовы, сообщения, пульс, спорт-режимы. Беспроводные наушники: чистый звук и быстрое подключение. В комплекте два ремешка — классический и спортивный.",
  description_kk:"Күн сайынға арналған сәнді жинақ және жақсы сыйлық.\nСмарт-сағат: қоңыраулар, хабарламалар, пульс, спорт режимдері. Сымсыз құлаққап: таза дыбыс және жылдам қосылу. Жинақта екі қайыс бар — классикалық және спорттық.",
  images:["assets/products/watch-w26.webp"],specifications:{kit:"смарт-часы, беспроводные наушники, 2 ремешка"},availability:"in_stock",featured:true,isNew:false,isSale:false},
 {id:"gerlax-lightning",name:"Наушники GERLAX с разъёмом Lightning",name_kk:"Lightning ұяшықты GERLAX құлаққаптары",brand:"GERLAX",category:"headphones",price:1200,oldPrice:null,
  description:"Проводные наушники с пультом регулировки громкости.",
  description_kk:"Дыбыс деңгейін реттейтін пульті бар сымды құлаққаптар.",
  images:["assets/products/gerlax-lightning.webp"],specifications:{connection:"Lightning"},availability:"in_stock",featured:false,isNew:false,isSale:false},
 {id:"gerlax-e18",name:"Наушники GERLAX E18 Hi-Fi, 3,5 мм",name_kk:"GERLAX E18 Hi-Fi құлаққаптары, 3,5 мм",brand:"GERLAX",category:"headphones",price:1000,oldPrice:null,
  description:"Стереонаушники Hi-Fi с усиленными басами.",
  description_kk:"Бас жиілігі күшейтілген Hi-Fi стерео құлаққаптар.",
  images:["assets/products/gerlax-e18.webp"],specifications:{connection:"3,5 мм (mini jack)",length:"1,2 м"},availability:"in_stock",featured:false,isNew:false,isSale:false},
 {id:"moxom-mx-ep66",name:"Наушники MOXOM MX-EP66, 3,5 мм",name_kk:"MOXOM MX-EP66 құлаққаптары, 3,5 мм",brand:"MOXOM",category:"headphones",price:1000,oldPrice:null,
  description:"Проводные наушники с микрофоном.",
  description_kk:"Микрофоны бар сымды құлаққаптар.",
  images:["assets/products/moxom-ep66.webp"],specifications:{connection:"3,5 мм (mini jack)",length:"1,2 м"},availability:"in_stock",featured:false,isNew:false,isSale:false},
 {id:"moxom-mx-ep18",name:"Наушники MOXOM MX-EP18 Bass, 3,5 мм",name_kk:"MOXOM MX-EP18 Bass құлаққаптары, 3,5 мм",brand:"MOXOM",category:"headphones",price:800,oldPrice:null,
  description:"Проводные Hi-Fi наушники с акцентом на бас и микрофоном.",
  description_kk:"Бас жиілігіне баса мән берілген, микрофоны бар сымды Hi-Fi құлаққаптар.",
  images:["assets/products/moxom-ep18-bass.webp"],specifications:{connection:"3,5 мм (mini jack)",color:"белые или чёрные"},availability:"in_stock",featured:false,isNew:false,isSale:false},
 {id:"kuzoom-lens-iphone14",name:"Защитное стекло для камеры KUZOOM, iPhone 14 / 14 Plus",name_kk:"KUZOOM камера қорғағыш әйнегі, iPhone 14 / 14 Plus",brand:"KUZOOM",category:"other",price:1500,oldPrice:null,
  description:"Защитные линзы на камеру с титановой рамкой 99AR HD. Антибликовое покрытие сохраняет чёткость снимков, стекло устойчиво к царапинам и износу, защищает от запотевания (Nano Waterproof). Прозрачность 99,9%, 0 haze — без мутности и искажений при съёмке.",
  description_kk:"Титан жақтауы бар 99AR HD камера қорғағыш линзалары. Шағылысуға қарсы жабын түсірілімнің анықтығын сақтайды, әйнек сызат пен тозуға төзімді, буланудан қорғайды (Nano Waterproof). Мөлдірлігі 99,9%, 0 haze — түсіру кезінде бұлыңғырлық пен бұрмалау жоқ.",
  images:["assets/products/kuzoom-lens-14.webp"],specifications:{compat:"iPhone 14 / iPhone 14 Plus",color:"Midnight Black (полуночный чёрный)",material:"титановый сплав (рамка), стекло 99AR HD"},availability:"in_stock",featured:false,isNew:true,isSale:false},
 {id:"redmi-note-12-pro-5g-256",name:"Xiaomi Redmi Note 12 Pro 5G, 256 ГБ (б/у)",name_kk:"Xiaomi Redmi Note 12 Pro 5G, 256 ГБ (қолданылған)",brand:"Xiaomi",category:"phones_used",price:50000,oldPrice:null,
  description:"Всё родное, кроме задней крышки. Ремонта не было, экран не менялся — заменена только задняя крышка.",
  description_kk:"Артқы қақпағынан басқасының бәрі төл. Жөндеу болмаған, экраны ауыстырылмаған — тек артқы қақпағы ауыстырылған.",
  images:["assets/products/redmi-note12pro-1.webp","assets/products/redmi-note12pro-2.webp"],video:"assets/products/redmi-note12pro.mp4",videoPoster:"assets/products/redmi-note12pro-poster.webp",
  specifications:{storage:"256 ГБ",connection:"5G",condition:"Б/у, всё родное, без ремонта; экран не менялся; заменена задняя крышка"},availability:"in_stock",featured:false,isNew:false,isSale:false}
];
