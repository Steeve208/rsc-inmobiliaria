/**
 * Generates fr/de/it/ar message packs from en.json with localized overlays.
 * Untranslated leaves remain English (request.ts also deep-merges en at runtime).
 */
const fs = require("fs");
const path = require("path");

const messagesDir = path.join(__dirname, "../messages");
const en = JSON.parse(fs.readFileSync(path.join(messagesDir, "en.json"), "utf8"));

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function deepMerge(base, override) {
  if (typeof override !== "object" || override === null || Array.isArray(override)) {
    return override;
  }
  const result = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (
      typeof result[key] === "object" &&
      result[key] !== null &&
      !Array.isArray(result[key]) &&
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      result[key] = deepMerge(result[key], value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

const sharedLanguages = {
  en: "English",
  es: "Español",
  pt: "Português",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  ar: "العربية",
  zh: "中文",
  hi: "हिन्दी",
  bn: "বাংলা",
};

const countryNames = {
  fr: {
    br: "Brésil", mx: "Mexique", ar: "Argentine", co: "Colombie", cl: "Chili",
    pe: "Pérou", uy: "Uruguay", ec: "Équateur", ve: "Venezuela", bo: "Bolivie",
    py: "Paraguay", cr: "Costa Rica", pa: "Panama", gt: "Guatemala",
    do: "République dominicaine", cu: "Cuba", hn: "Honduras", sv: "Salvador",
    ni: "Nicaragua", us: "États-Unis", ca: "Canada", jm: "Jamaïque",
    pr: "Porto Rico", tt: "Trinité-et-Tobago", ht: "Haïti", bs: "Bahamas",
    bb: "Barbade", es: "Espagne", pt: "Portugal", fr: "France", de: "Allemagne",
    it: "Italie", gb: "Royaume-Uni", ie: "Irlande", nl: "Pays-Bas", be: "Belgique",
    ch: "Suisse", at: "Autriche", pl: "Pologne", se: "Suède", no: "Norvège",
    gr: "Grèce", cz: "Tchéquie", ro: "Roumanie", za: "Afrique du Sud",
    ng: "Nigeria", ke: "Kenya", gh: "Ghana", eg: "Égypte", ma: "Maroc",
    ao: "Angola", mz: "Mozambique", sn: "Sénégal", ci: "Côte d'Ivoire",
    tz: "Tanzanie", sa: "Arabie saoudite", ae: "Émirats arabes unis",
  },
  de: {
    br: "Brasilien", mx: "Mexiko", ar: "Argentinien", co: "Kolumbien", cl: "Chile",
    pe: "Peru", uy: "Uruguay", ec: "Ecuador", ve: "Venezuela", bo: "Bolivien",
    py: "Paraguay", cr: "Costa Rica", pa: "Panama", gt: "Guatemala",
    do: "Dominikanische Republik", cu: "Kuba", hn: "Honduras", sv: "El Salvador",
    ni: "Nicaragua", us: "Vereinigte Staaten", ca: "Kanada", jm: "Jamaika",
    pr: "Puerto Rico", tt: "Trinidad und Tobago", ht: "Haiti", bs: "Bahamas",
    bb: "Barbados", es: "Spanien", pt: "Portugal", fr: "Frankreich", de: "Deutschland",
    it: "Italien", gb: "Vereinigtes Königreich", ie: "Irland", nl: "Niederlande",
    be: "Belgien", ch: "Schweiz", at: "Österreich", pl: "Polen", se: "Schweden",
    no: "Norwegen", gr: "Griechenland", cz: "Tschechien", ro: "Rumänien",
    za: "Südafrika", ng: "Nigeria", ke: "Kenia", gh: "Ghana", eg: "Ägypten",
    ma: "Marokko", ao: "Angola", mz: "Mosambik", sn: "Senegal", ci: "Elfenbeinküste",
    tz: "Tansania", sa: "Saudi-Arabien", ae: "Vereinigte Arabische Emirate",
  },
  it: {
    br: "Brasile", mx: "Messico", ar: "Argentina", co: "Colombia", cl: "Cile",
    pe: "Perù", uy: "Uruguay", ec: "Ecuador", ve: "Venezuela", bo: "Bolivia",
    py: "Paraguay", cr: "Costa Rica", pa: "Panama", gt: "Guatemala",
    do: "Repubblica Dominicana", cu: "Cuba", hn: "Honduras", sv: "El Salvador",
    ni: "Nicaragua", us: "Stati Uniti", ca: "Canada", jm: "Giamaica",
    pr: "Porto Rico", tt: "Trinidad e Tobago", ht: "Haiti", bs: "Bahamas",
    bb: "Barbados", es: "Spagna", pt: "Portogallo", fr: "Francia", de: "Germania",
    it: "Italia", gb: "Regno Unito", ie: "Irlanda", nl: "Paesi Bassi", be: "Belgio",
    ch: "Svizzera", at: "Austria", pl: "Polonia", se: "Svezia", no: "Norvegia",
    gr: "Grecia", cz: "Cechia", ro: "Romania", za: "Sudafrica", ng: "Nigeria",
    ke: "Kenya", gh: "Ghana", eg: "Egitto", ma: "Marocco", ao: "Angola",
    mz: "Mozambico", sn: "Senegal", ci: "Costa d'Avorio", tz: "Tanzania",
    sa: "Arabia Saudita", ae: "Emirati Arabi Uniti",
  },
  ar: {
    br: "البرازيل", mx: "المكسيك", ar: "الأرجنتين", co: "كولومبيا", cl: "تشيلي",
    pe: "بيرو", uy: "أوروغواي", ec: "الإكوادور", ve: "فنزويلا", bo: "بوليفيا",
    py: "باراغواي", cr: "كوستاريكا", pa: "بنما", gt: "غواتيمالا",
    do: "جمهورية الدومينيكان", cu: "كوبا", hn: "هندوراس", sv: "السلفادور",
    ni: "نيكاراغوا", us: "الولايات المتحدة", ca: "كندا", jm: "جامايكا",
    pr: "بورتوريكو", tt: "ترينيداد وتوباغو", ht: "هايتي", bs: "البهاما",
    bb: "بربادوس", es: "إسبانيا", pt: "البرتغال", fr: "فرنسا", de: "ألمانيا",
    it: "إيطاليا", gb: "المملكة المتحدة", ie: "أيرلندا", nl: "هولندا", be: "بلجيكا",
    ch: "سويسرا", at: "النمسا", pl: "بولندا", se: "السويد", no: "النرويج",
    gr: "اليونان", cz: "التشيك", ro: "رومانيا", za: "جنوب أفريقيا", ng: "نيجيريا",
    ke: "كينيا", gh: "غانا", eg: "مصر", ma: "المغرب", ao: "أنغولا",
    mz: "موزمبيق", sn: "السنغال", ci: "ساحل العاج", tz: "تنزانيا",
    sa: "المملكة العربية السعودية", ae: "الإمارات العربية المتحدة",
  },
  zh: {
    br: "巴西", mx: "墨西哥", ar: "阿根廷", co: "哥伦比亚", cl: "智利",
    pe: "秘鲁", uy: "乌拉圭", ec: "厄瓜多尔", ve: "委内瑞拉", bo: "玻利维亚",
    py: "巴拉圭", cr: "哥斯达黎加", pa: "巴拿马", gt: "危地马拉",
    do: "多米尼加共和国", cu: "古巴", hn: "洪都拉斯", sv: "萨尔瓦多",
    ni: "尼加拉瓜", us: "美国", ca: "加拿大", jm: "牙买加",
    pr: "波多黎各", tt: "特立尼达和多巴哥", ht: "海地", bs: "巴哈马",
    bb: "巴巴多斯", es: "西班牙", pt: "葡萄牙", fr: "法国", de: "德国",
    it: "意大利", gb: "英国", ie: "爱尔兰", nl: "荷兰", be: "比利时",
    ch: "瑞士", at: "奥地利", pl: "波兰", se: "瑞典", no: "挪威",
    gr: "希腊", cz: "捷克", ro: "罗马尼亚", za: "南非", ng: "尼日利亚",
    ke: "肯尼亚", gh: "加纳", eg: "埃及", ma: "摩洛哥", ao: "安哥拉",
    mz: "莫桑比克", sn: "塞内加尔", ci: "科特迪瓦", tz: "坦桑尼亚",
    sa: "沙特阿拉伯", ae: "阿联酋",
  },
  hi: {
    br: "ब्राज़ील", mx: "मैक्सिको", ar: "अर्जेंटीना", co: "कोलंबिया", cl: "चिली",
    pe: "पेरू", uy: "उरुग्वे", ec: "इक्वाडोर", ve: "वेनेज़ुएला", bo: "बोलीविया",
    py: "पराग्वे", cr: "कोस्टा रिका", pa: "पनामा", gt: "ग्वाटेमाला",
    do: "डोमिनिकन गणराज्य", cu: "क्यूबा", hn: "होंडुरास", sv: "अल सल्वाडोर",
    ni: "निकारागुआ", us: "संयुक्त राज्य अमेरिका", ca: "कनाडा", jm: "जमैका",
    pr: "प्युर्टो रिको", tt: "त्रिनिदाद और टोबैगो", ht: "हैती", bs: "बहामास",
    bb: "बारबाडोस", es: "स्पेन", pt: "पुर्तगाल", fr: "फ़्रांस", de: "जर्मनी",
    it: "इटली", gb: "यूनाइटेड किंगडम", ie: "आयरलैंड", nl: "नीदरलैंड", be: "बेल्जियम",
    ch: "स्विट्ज़रलैंड", at: "ऑस्ट्रिया", pl: "पोलैंड", se: "स्वीडन", no: "नॉर्वे",
    gr: "ग्रीस", cz: "चेक गणराज्य", ro: "रोमानिया", za: "दक्षिण अफ़्रीका",
    ng: "नाइजीरिया", ke: "केन्या", gh: "घाना", eg: "मिस्र", ma: "मोरक्को",
    ao: "अंगोला", mz: "मोज़ाम्बिक", sn: "सेनेगल", ci: "कोट डिव्वार", tz: "तंज़ानिया",
    sa: "सऊदी अरब", ae: "संयुक्त अरब अमीरात",
  },
  bn: {
    br: "ব্রাজিল", mx: "মেক্সিকো", ar: "আর্জেন্টিনা", co: "কলম্বিয়া", cl: "চিলি",
    pe: "পেরু", uy: "উরুগুয়ে", ec: "ইকুয়েডর", ve: "ভেনেজুয়েলা", bo: "বলিভিয়া",
    py: "প্যারাগুয়ে", cr: "কোস্টা রিকা", pa: "পানামা", gt: "গুয়াতেমালা",
    do: "ডোমিনিকান প্রজাতন্ত্র", cu: "কিউবা", hn: "হন্ডুরাস", sv: "এল সালভাদোর",
    ni: "নিকারাগুয়া", us: "যুক্তরাষ্ট্র", ca: "কানাডা", jm: "জামাইকা",
    pr: "পুয়ের্তো রিকো", tt: "ত্রিনিদাদ ও টোবাগো", ht: "হাইতি", bs: "বাহামা",
    bb: "বার্বাডোস", es: "স্পেন", pt: "পর্তুগাল", fr: "ফ্রান্স", de: "জার্মানি",
    it: "ইতালি", gb: "যুক্তরাজ্য", ie: "আয়ারল্যান্ড", nl: "নেদারল্যান্ডস", be: "বেলজিয়াম",
    ch: "সুইজারল্যান্ড", at: "অস্ট্রিয়া", pl: "পোল্যান্ড", se: "সুইডেন", no: "নরওয়ে",
    gr: "গ্রিস", cz: "চেক প্রজাতন্ত্র", ro: "রোমানিয়া", za: "দক্ষিণ আফ্রিকা",
    ng: "নাইজেরিয়া", ke: "কেনিয়া", gh: "ঘানা", eg: "মিশর", ma: "মরক্কো",
    ao: "অ্যাঙ্গোলা", mz: "মোজাম্বিক", sn: "সেনেগাল", ci: "কোত দিভোয়ার", tz: "তানজানিয়া",
    sa: "সৌদি আরব", ae: "সংযুক্ত আরব আমিরাত",
  },
};

const overlays = {
  fr: {
    metadata: {
      title: "REESKOVA — Marketplace immobilier, véhicules et services",
      description:
        "Explorez des biens, véhicules, entreprises et services sur un marketplace mondial.",
    },
    brand: {
      tagline: "Marketplace I by RSC Group",
      poweredBy: "Propulsé par",
      poweredByBrand: "RSC Group",
    },
    nav: {
      exploreNav: "Explorer",
      categories: "Catégories",
      companies: "Entreprises",
      services: "Services",
      more: "Plus",
      vehicles: "Véhicules",
      financing: "Financement",
      howItWorks: "Comment ça marche",
      help: "Aide",
      wishlist: "Favoris",
      toggleMenu: "Menu",
      changeRegion: "Changer de pays",
      changeLanguage: "Changer de langue",
      explore: {
        title: "Explorer",
        houses: "Maisons",
        apartments: "Appartements",
        land: "Terrains",
        launches: "Lancements",
        commercial: "Commercial",
        luxury: "Luxe",
      },
      cat: {
        properties: "Immobilier",
        vehicles: "Véhicules",
        launches: "Lancements",
        companies: "Entreprises",
        financing: "Financement",
        services: "Services",
      },
    },
    footer: {
      rights: "Tous droits réservés.",
      tagline:
        "Le marketplace où des milliers d'entreprises proposent biens, véhicules et services.",
    },
    landing: {
      featured: {
        title: "Biens en vedette",
        viewAll: "Voir tout",
      },
      featuredVehicles: {
        title: "Véhicules en vedette",
        viewAll: "Voir tout",
      },
      categories: {
        title: "Explorer par catégories",
        subtitle: "Trouvez rapidement ce que vous cherchez.",
      },
    },
    markets: {
      regions: {
        latam: "Amérique latine",
        northAmerica: "Amérique du Nord",
        caribbean: "Caraïbes",
        europe: "Europe",
        africa: "Afrique",
        middleEast: "Moyen-Orient",
      },
      languages: sharedLanguages,
      names: countryNames.fr,
      detection: {
        message: "Nous avons détecté que vous êtes en {country}. Continuer ?",
        confirm: "Confirmer",
        change: "Changer",
        dismiss: "Fermer",
      },
    },
  },
  de: {
    metadata: {
      title: "REESKOVA — Marktplatz für Immobilien, Fahrzeuge und Services",
      description:
        "Entdecken Sie Immobilien, Fahrzeuge, Unternehmen und Services auf einem globalen Marktplatz.",
    },
    brand: {
      tagline: "Marketplace I by RSC Group",
      poweredBy: "Powered by",
      poweredByBrand: "RSC Group",
    },
    nav: {
      exploreNav: "Entdecken",
      categories: "Kategorien",
      companies: "Unternehmen",
      services: "Services",
      more: "Mehr",
      vehicles: "Fahrzeuge",
      financing: "Finanzierung",
      howItWorks: "So funktioniert's",
      help: "Hilfe",
      wishlist: "Favoriten",
      toggleMenu: "Menü",
      changeRegion: "Land wechseln",
      changeLanguage: "Sprache wechseln",
      explore: {
        title: "Entdecken",
        houses: "Häuser",
        apartments: "Wohnungen",
        land: "Grundstücke",
        launches: "Neubauprojekte",
        commercial: "Gewerbe",
        luxury: "Luxus",
      },
      cat: {
        properties: "Immobilien",
        vehicles: "Fahrzeuge",
        launches: "Neubauprojekte",
        companies: "Unternehmen",
        financing: "Finanzierung",
        services: "Services",
      },
    },
    footer: {
      rights: "Alle Rechte vorbehalten.",
      tagline:
        "Der Marktplatz, auf dem tausende Unternehmen Immobilien, Fahrzeuge und Services anbieten.",
    },
    landing: {
      featured: {
        title: "Immobilien im Fokus",
        viewAll: "Alle anzeigen",
      },
      featuredVehicles: {
        title: "Fahrzeuge im Fokus",
        viewAll: "Alle anzeigen",
      },
      categories: {
        title: "Nach Kategorien entdecken",
        subtitle: "Finden Sie schnell, was Sie suchen.",
      },
    },
    markets: {
      regions: {
        latam: "Lateinamerika",
        northAmerica: "Nordamerika",
        caribbean: "Karibik",
        europe: "Europa",
        africa: "Afrika",
        middleEast: "Naher Osten",
      },
      languages: sharedLanguages,
      names: countryNames.de,
      detection: {
        message: "Wir haben erkannt, dass Sie in {country} sind. Fortfahren?",
        confirm: "Bestätigen",
        change: "Ändern",
        dismiss: "Schließen",
      },
    },
  },
  it: {
    metadata: {
      title: "REESKOVA — Marketplace di immobili, veicoli e servizi",
      description:
        "Esplora immobili, veicoli, aziende e servizi in un marketplace globale.",
    },
    brand: {
      tagline: "Marketplace I by RSC Group",
      poweredBy: "Powered by",
      poweredByBrand: "RSC Group",
    },
    nav: {
      exploreNav: "Esplora",
      categories: "Categorie",
      companies: "Aziende",
      services: "Servizi",
      more: "Altro",
      vehicles: "Veicoli",
      financing: "Finanziamento",
      howItWorks: "Come funziona",
      help: "Aiuto",
      wishlist: "Preferiti",
      toggleMenu: "Menu",
      changeRegion: "Cambia paese",
      changeLanguage: "Cambia lingua",
      explore: {
        title: "Esplora",
        houses: "Case",
        apartments: "Appartamenti",
        land: "Terreni",
        launches: "Nuovi progetti",
        commercial: "Commerciale",
        luxury: "Lusso",
      },
      cat: {
        properties: "Immobili",
        vehicles: "Veicoli",
        launches: "Nuovi progetti",
        companies: "Aziende",
        financing: "Finanziamento",
        services: "Servizi",
      },
    },
    footer: {
      rights: "Tutti i diritti riservati.",
      tagline:
        "Il marketplace dove migliaia di aziende offrono immobili, veicoli e servizi.",
    },
    landing: {
      featured: {
        title: "Immobili in evidenza",
        viewAll: "Vedi tutti",
      },
      featuredVehicles: {
        title: "Veicoli in evidenza",
        viewAll: "Vedi tutti",
      },
      categories: {
        title: "Esplora per categorie",
        subtitle: "Trova rapidamente ciò che cerchi.",
      },
    },
    markets: {
      regions: {
        latam: "America Latina",
        northAmerica: "Nord America",
        caribbean: "Caraibi",
        europe: "Europa",
        africa: "Africa",
        middleEast: "Medio Oriente",
      },
      languages: sharedLanguages,
      names: countryNames.it,
      detection: {
        message: "Abbiamo rilevato che ti trovi in {country}. Continuare?",
        confirm: "Conferma",
        change: "Cambia",
        dismiss: "Chiudi",
      },
    },
  },
  ar: {
    metadata: {
      title: "REESKOVA — سوق العقارات والمركبات والخدمات",
      description:
        "استكشف العقارات والمركبات والشركات والخدمات في سوق عالمي.",
    },
    brand: {
      tagline: "Marketplace I by RSC Group",
      poweredBy: "مدعوم من",
      poweredByBrand: "RSC Group",
    },
    nav: {
      exploreNav: "استكشف",
      categories: "الفئات",
      companies: "الشركات",
      services: "الخدمات",
      more: "المزيد",
      vehicles: "المركبات",
      financing: "التمويل",
      howItWorks: "كيف يعمل",
      help: "المساعدة",
      wishlist: "المفضلة",
      toggleMenu: "القائمة",
      changeRegion: "تغيير البلد",
      changeLanguage: "تغيير اللغة",
      explore: {
        title: "استكشف",
        houses: "منازل",
        apartments: "شقق",
        land: "أراضٍ",
        launches: "إطلاقات جديدة",
        commercial: "تجاري",
        luxury: "فاخر",
      },
      cat: {
        properties: "عقارات",
        vehicles: "مركبات",
        launches: "إطلاقات جديدة",
        companies: "شركات",
        financing: "تمويل",
        services: "خدمات",
      },
    },
    footer: {
      rights: "جميع الحقوق محفوظة.",
      tagline:
        "السوق الذي تعرض فيه آلاف الشركات عقارات ومركبات وخدمات.",
    },
    landing: {
      featured: {
        title: "عقارات مميزة",
        viewAll: "عرض الكل",
      },
      featuredVehicles: {
        title: "مركبات مميزة",
        viewAll: "عرض الكل",
      },
      categories: {
        title: "استكشف حسب الفئات",
        subtitle: "اعثر بسرعة على ما تبحث عنه.",
      },
    },
    markets: {
      regions: {
        latam: "أمريكا اللاتينية",
        northAmerica: "أمريكا الشمالية",
        caribbean: "الكاريبي",
        europe: "أوروبا",
        africa: "أفريقيا",
        middleEast: "الشرق الأوسط",
      },
      languages: sharedLanguages,
      names: countryNames.ar,
      detection: {
        message: "اكتشفنا أنك في {country}. هل تريد المتابعة؟",
        confirm: "تأكيد",
        change: "تغيير",
        dismiss: "إغلاق",
      },
    },
  },
  zh: {
    metadata: {
      title: "REESKOVA — 房产、车辆与服务市场",
      description: "在全球市场中探索房产、车辆、企业与服务。",
    },
    brand: {
      tagline: "Marketplace I by RSC Group",
      poweredBy: "由",
      poweredByBrand: "RSC Group 提供支持",
    },
    nav: {
      exploreNav: "探索",
      categories: "分类",
      companies: "企业",
      services: "服务",
      more: "更多",
      vehicles: "车辆",
      financing: "融资",
      howItWorks: "运作方式",
      help: "帮助",
      wishlist: "收藏",
      toggleMenu: "菜单",
      changeRegion: "更改国家",
      changeLanguage: "更改语言",
      explore: {
        title: "探索",
        houses: "房屋",
        apartments: "公寓",
        land: "土地",
        launches: "新项目",
        commercial: "商业",
        luxury: "豪华",
      },
      cat: {
        properties: "房产",
        vehicles: "车辆",
        launches: "新项目",
        companies: "企业",
        financing: "融资",
        services: "服务",
      },
    },
    footer: {
      rights: "保留所有权利。",
      tagline: "数以千计的企业在此市场提供房产、车辆与服务。",
    },
    landing: {
      featured: {
        title: "精选房产",
        viewAll: "查看全部",
      },
      featuredVehicles: {
        title: "精选车辆",
        viewAll: "查看全部",
      },
      categories: {
        title: "按分类探索",
        subtitle: "快速找到您想要的内容。",
      },
    },
    markets: {
      regions: {
        latam: "拉丁美洲",
        northAmerica: "北美洲",
        caribbean: "加勒比",
        europe: "欧洲",
        africa: "非洲",
        middleEast: "中东",
      },
      languages: sharedLanguages,
      names: countryNames.zh,
      detection: {
        message: "我们检测到您位于{country}。是否继续？",
        confirm: "确认",
        change: "更改",
        dismiss: "关闭",
      },
    },
  },
  hi: {
    metadata: {
      title: "REESKOVA — संपत्ति, वाहन और सेवाओं का बाज़ार",
      description: "एक वैश्विक बाज़ार में संपत्ति, वाहन, कंपनियाँ और सेवाएँ खोजें।",
    },
    brand: {
      tagline: "Marketplace I by RSC Group",
      poweredBy: "द्वारा संचालित",
      poweredByBrand: "RSC Group",
    },
    nav: {
      exploreNav: "खोजें",
      categories: "श्रेणियाँ",
      companies: "कंपनियाँ",
      services: "सेवाएँ",
      more: "और",
      vehicles: "वाहन",
      financing: "वित्त",
      howItWorks: "यह कैसे काम करता है",
      help: "सहायता",
      wishlist: "पसंदीदा",
      toggleMenu: "मेन्यू",
      changeRegion: "देश बदलें",
      changeLanguage: "भाषा बदलें",
      explore: {
        title: "खोजें",
        houses: "घर",
        apartments: "अपार्टमेंट",
        land: "भूमि",
        launches: "नई परियोजनाएँ",
        commercial: "व्यावसायिक",
        luxury: "लक्ज़री",
      },
      cat: {
        properties: "संपत्ति",
        vehicles: "वाहन",
        launches: "नई परियोजनाएँ",
        companies: "कंपनियाँ",
        financing: "वित्त",
        services: "सेवाएँ",
      },
    },
    footer: {
      rights: "सर्वाधिकार सुरक्षित।",
      tagline: "वह बाज़ार जहाँ हज़ारों कंपनियाँ संपत्ति, वाहन और सेवाएँ प्रदान करती हैं।",
    },
    landing: {
      featured: {
        title: "विशेष संपत्ति",
        viewAll: "सभी देखें",
      },
      featuredVehicles: {
        title: "विशेष वाहन",
        viewAll: "सभी देखें",
      },
      categories: {
        title: "श्रेणी अनुसार खोजें",
        subtitle: "जो खोज रहे हैं उसे जल्दी पाएँ।",
      },
    },
    markets: {
      regions: {
        latam: "लैटिन अमेरिका",
        northAmerica: "उत्तरी अमेरिका",
        caribbean: "कैरिबियन",
        europe: "यूरोप",
        africa: "अफ़्रीका",
        middleEast: "मध्य पूर्व",
      },
      languages: sharedLanguages,
      names: countryNames.hi,
      detection: {
        message: "हमने पाया कि आप {country} में हैं। जारी रखें?",
        confirm: "पुष्टि करें",
        change: "बदलें",
        dismiss: "बंद करें",
      },
    },
  },
  bn: {
    metadata: {
      title: "REESKOVA — সম্পত্তি, যানবাহন ও পরিষেবার বাজার",
      description: "একটি বিশ্বব্যাপী বাজারে সম্পত্তি, যানবাহন, কোম্পানি ও পরিষেবা অন্বেষণ করুন।",
    },
    brand: {
      tagline: "Marketplace I by RSC Group",
      poweredBy: "পরিচালিত দ্বারা",
      poweredByBrand: "RSC Group",
    },
    nav: {
      exploreNav: "অন্বেষণ",
      categories: "বিভাগ",
      companies: "কোম্পানি",
      services: "পরিষেবা",
      more: "আরও",
      vehicles: "যানবাহন",
      financing: "অর্থায়ন",
      howItWorks: "যেভাবে কাজ করে",
      help: "সাহায্য",
      wishlist: "প্রিয়",
      toggleMenu: "মেনু",
      changeRegion: "দেশ পরিবর্তন",
      changeLanguage: "ভাষা পরিবর্তন",
      explore: {
        title: "অন্বেষণ",
        houses: "বাড়ি",
        apartments: "অ্যাপার্টমেন্ট",
        land: "জমি",
        launches: "নতুন প্রকল্প",
        commercial: "বাণিজ্যিক",
        luxury: "বিলাসবহুল",
      },
      cat: {
        properties: "সম্পত্তি",
        vehicles: "যানবাহন",
        launches: "নতুন প্রকল্প",
        companies: "কোম্পানি",
        financing: "অর্থায়ন",
        services: "পরিষেবা",
      },
    },
    footer: {
      rights: "সর্বস্বত্ব সংরক্ষিত।",
      tagline: "যে বাজারে হাজার হাজার কোম্পানি সম্পত্তি, যানবাহন ও পরিষেবা দেয়।",
    },
    landing: {
      featured: {
        title: "নির্বাচিত সম্পত্তি",
        viewAll: "সব দেখুন",
      },
      featuredVehicles: {
        title: "নির্বাচিত যানবাহন",
        viewAll: "সব দেখুন",
      },
      categories: {
        title: "বিভাগ অনুসারে অন্বেষণ",
        subtitle: "যা খুঁজছেন দ্রুত খুঁজে পান।",
      },
    },
    markets: {
      regions: {
        latam: "লাতিন আমেরিকা",
        northAmerica: "উত্তর আমেরিকা",
        caribbean: "ক্যারিবিয়ান",
        europe: "ইউরোপ",
        africa: "আফ্রিকা",
        middleEast: "মধ্যপ্রাচ্য",
      },
      languages: sharedLanguages,
      names: countryNames.bn,
      detection: {
        message: "আমরা দেখেছি আপনি {country}-এ আছেন। চালিয়ে যাবেন?",
        confirm: "নিশ্চিত",
        change: "পরিবর্তন",
        dismiss: "বন্ধ",
      },
    },
  },
};

for (const locale of ["fr", "de", "it", "ar", "zh", "hi", "bn"]) {
  const pack = deepMerge(deepClone(en), overlays[locale]);
  // Ensure SA/AE exist even if en was missing them somehow
  pack.markets.names.sa = countryNames[locale].sa;
  pack.markets.names.ae = countryNames[locale].ae;
  pack.markets.regions.middleEast = overlays[locale].markets.regions.middleEast;
  pack.markets.languages = sharedLanguages;
  const out = path.join(messagesDir, `${locale}.json`);
  fs.writeFileSync(out, JSON.stringify(pack, null, 2) + "\n");
  console.log("wrote", out, "keys~", Object.keys(pack).length);
}
