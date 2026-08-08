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
};

for (const locale of ["fr", "de", "it", "ar"]) {
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
