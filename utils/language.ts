// Language utilities for Lovtiti Agro Mart

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false
  },
  {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    flag: '🇹🇿',
    rtl: false
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    rtl: false
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇪🇬',
    rtl: true
  },
  {
    code: 'yo',
    name: 'Yoruba',
    nativeName: 'Yorùbá',
    flag: '🇳🇬',
    rtl: false
  },
  {
    code: 'ha',
    name: 'Hausa',
    nativeName: 'Hausa',
    flag: '🇳🇬',
    rtl: false
  },
  {
    code: 'ig',
    name: 'Igbo',
    nativeName: 'Igbo',
    flag: '🇳🇬',
    rtl: false
  },
  {
    code: 'am',
    name: 'Amharic',
    nativeName: 'አማርኛ',
    flag: '🇪🇹',
    rtl: false
  },
  {
    code: 'zu',
    name: 'Zulu',
    nativeName: 'isiZulu',
    flag: '🇿🇦',
    rtl: false
  },
  {
    code: 'xh',
    name: 'Xhosa',
    nativeName: 'isiXhosa',
    flag: '🇿🇦',
    rtl: false
  }
];

export const getLanguageByCode = (code: string): Language | undefined => {
  return SUPPORTED_LANGUAGES.find(language => language.code === code);
};

export const getLanguageOptions = (): Array<{ value: string; label: string; flag: string }> => {
  return SUPPORTED_LANGUAGES.map(language => ({
    value: language.code,
    label: `${language.flag} ${language.nativeName} (${language.name})`,
    flag: language.flag
  }));
};

export const getDefaultLanguage = (country: string): Language => {
  // Map countries to their primary languages
  const countryLanguageMap: Record<string, string> = {
    'nigeria': 'en',
    'kenya': 'sw',
    'tanzania': 'sw',
    'uganda': 'en',
    'ghana': 'en',
    'south africa': 'en',
    'egypt': 'ar',
    'ethiopia': 'am',
    'france': 'fr',
    'united states': 'en',
    'united kingdom': 'en'
  };
  
  const languageCode = countryLanguageMap[country.toLowerCase()];
  const language = languageCode ? getLanguageByCode(languageCode) : undefined;
  
  return language || SUPPORTED_LANGUAGES[0]; // Default to English
};

// Translation keys and default English translations
export const translations = {
  en: {
    // Navigation
    'nav.marketplace': 'Marketplace',
    'nav.dashboards': 'Dashboards',
    'nav.pricing': 'Pricing',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.help': 'Help',
    'nav.privacy': 'Privacy',
    'nav.signin': 'Sign In',
    'nav.signup': 'Get Started',
    'nav.cart': 'Cart',
    
    // Roles
    'role.farmer': 'Farmer',
    'role.buyer': 'Buyer',
    'role.distributor': 'Distributor',
    'role.transporter': 'Transporter',
    'role.agro-vet': 'Agro Expert',
    'role.admin': 'Admin',
    
    // Dashboard
    'dashboard.overview': 'Overview',
    'dashboard.listings': 'My Listings',
    'dashboard.orders': 'Orders',
    'dashboard.agro-products': 'Agro Expert Products',
    'dashboard.equipment': 'Equipment Lease',
    'dashboard.tutorials': 'Tutorials',
    'dashboard.analytics': 'Analytics',
    
    // Common
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.add-to-cart': 'Add to Cart',
    'common.price': 'Price',
    'common.quantity': 'Quantity',
    'common.total': 'Total',
    'common.status': 'Status',
    'common.active': 'Active',
    'common.pending': 'Pending',
    'common.completed': 'Completed',
    'common.cancelled': 'Cancelled',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.close': 'Close',
    
    // Payment
    'payment.methods': 'Payment Methods',
    'payment.stripe': 'Credit/Debit Card',
    'payment.mpesa': 'MPESA',
    'payment.crypto': 'Cryptocurrency',
    'payment.hbar': 'Hedera HBAR',
    'payment.bitcoin': 'Bitcoin',
    'payment.ethereum': 'Ethereum',
    'payment.tether': 'Tether USD',
    'payment.pay-now': 'Pay Now',
    'payment.processing': 'Processing Payment...',
    'payment.success': 'Payment Successful',
    'payment.failed': 'Payment Failed',
    
    // Currency
    'currency.select': 'Select Currency',
    'currency.convert': 'Convert Currency',
    'currency.rate': 'Exchange Rate',
    
    // Language
    'language.select': 'Select Language',
    'language.change': 'Change Language',
    
    // Settings
    'settings.currency': 'Currency',
    'settings.language': 'Language',
    'settings.location': 'Location',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.account': 'Account',
    'settings.profile': 'Profile',
    'settings.preferences': 'Preferences'
  },
  
  sw: {
    // Navigation
    'nav.marketplace': 'Soko',
    'nav.dashboards': 'Dashibodi',
    'nav.pricing': 'Bei',
    'nav.about': 'Kuhusu Sisi',
    'nav.contact': 'Mawasiliano',
    'nav.help': 'Msaada',
    'nav.privacy': 'Faragha',
    'nav.signin': 'Ingia',
    'nav.signup': 'Anza',
    'nav.cart': 'Mkokoteni',
    
    // Roles
    'role.farmer': 'Mkulima',
    'role.buyer': 'Mnunuzi',
    'role.distributor': 'Msambazaji',
    'role.transporter': 'Mchukuzi',
    'role.agro-vet': 'Mtaalamu wa Kilimo',
    'role.admin': 'Msimamizi',
    
    // Dashboard
    'dashboard.overview': 'Muhtasari',
    'dashboard.listings': 'Orodha Yangu',
    'dashboard.orders': 'Maagizo',
    'dashboard.agro-products': 'Bidhaa za Daktari',
    'dashboard.equipment': 'Kukodi Vifaa',
    'dashboard.tutorials': 'Mafunzo',
    'dashboard.analytics': 'Uchambuzi',
    
    // Common
    'common.search': 'Tafuta',
    'common.filter': 'Chuja',
    'common.add-to-cart': 'Ongeza kwenye Mkokoteni',
    'common.price': 'Bei',
    'common.quantity': 'Kiasi',
    'common.total': 'Jumla',
    'common.status': 'Hali',
    'common.active': 'Hai',
    'common.pending': 'Inasubiri',
    'common.completed': 'Imekamilika',
    'common.cancelled': 'Imefutwa',
    'common.loading': 'Inapakia...',
    'common.error': 'Hitilafu',
    'common.success': 'Imefanikiwa',
    'common.save': 'Hifadhi',
    'common.cancel': 'Ghairi',
    'common.edit': 'Hariri',
    'common.delete': 'Futa',
    'common.view': 'Angalia',
    'common.close': 'Funga',
    
    // Payment
    'payment.methods': 'Njia za Malipo',
    'payment.stripe': 'Kadi ya Kredit/Debit',
    'payment.mpesa': 'MPESA',
    'payment.crypto': 'Sarafu ya Kidijitali',
    'payment.hbar': 'Hedera HBAR',
    'payment.bitcoin': 'Bitcoin',
    'payment.ethereum': 'Ethereum',
    'payment.tether': 'Tether USD',
    'payment.pay-now': 'Lipa Sasa',
    'payment.processing': 'Inachakata Malipo...',
    'payment.success': 'Malipo Yamefanikiwa',
    'payment.failed': 'Malipo Yameshindwa',
    
    // Currency
    'currency.select': 'Chagua Sarafu',
    'currency.convert': 'Badilisha Sarafu',
    'currency.rate': 'Kiwango cha Ubadilishaji',
    
    // Language
    'language.select': 'Chagua Lugha',
    'language.change': 'Badilisha Lugha',
    
    // Settings
    'settings.currency': 'Sarafu',
    'settings.language': 'Lugha',
    'settings.location': 'Mahali',
    'settings.notifications': 'Arifa',
    'settings.privacy': 'Faragha',
    'settings.account': 'Akaunti',
    'settings.profile': 'Wasifu',
    'settings.preferences': 'Mapendeleo'
  },
  
  fr: {
    // Navigation
    'nav.marketplace': 'Marché',
    'nav.dashboards': 'Tableaux de Bord',
    'nav.pricing': 'Tarifs',
    'nav.about': 'À Propos',
    'nav.contact': 'Contact',
    'nav.help': 'Aide',
    'nav.privacy': 'Confidentialité',
    'nav.signin': 'Se Connecter',
    'nav.signup': 'Commencer',
    'nav.cart': 'Panier',
    
    // Roles
    'role.farmer': 'Agriculteur',
    'role.buyer': 'Acheteur',
    'role.distributor': 'Distributeur',
    'role.transporter': 'Transporteur',
    'role.agro-vet': 'Expert Agricole',
    'role.admin': 'Administrateur',
    
    // Dashboard
    'dashboard.overview': 'Aperçu',
    'dashboard.listings': 'Mes Annonces',
    'dashboard.orders': 'Commandes',
    'dashboard.agro-products': 'Produits Vétérinaires',
    'dashboard.equipment': 'Location d\'Équipement',
    'dashboard.tutorials': 'Tutoriels',
    'dashboard.analytics': 'Analyses',
    
    // Common
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.add-to-cart': 'Ajouter au Panier',
    'common.price': 'Prix',
    'common.quantity': 'Quantité',
    'common.total': 'Total',
    'common.status': 'Statut',
    'common.active': 'Actif',
    'common.pending': 'En Attente',
    'common.completed': 'Terminé',
    'common.cancelled': 'Annulé',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.view': 'Voir',
    'common.close': 'Fermer',
    
    // Payment
    'payment.methods': 'Méthodes de Paiement',
    'payment.stripe': 'Carte de Crédit/Débit',
    'payment.mpesa': 'MPESA',
    'payment.crypto': 'Cryptomonnaie',
    'payment.hbar': 'Hedera HBAR',
    'payment.bitcoin': 'Bitcoin',
    'payment.ethereum': 'Ethereum',
    'payment.tether': 'Tether USD',
    'payment.pay-now': 'Payer Maintenant',
    'payment.processing': 'Traitement du Paiement...',
    'payment.success': 'Paiement Réussi',
    'payment.failed': 'Paiement Échoué',
    
    // Currency
    'currency.select': 'Sélectionner la Devise',
    'currency.convert': 'Convertir la Devise',
    'currency.rate': 'Taux de Change',
    
    // Language
    'language.select': 'Sélectionner la Langue',
    'language.change': 'Changer la Langue',
    
    // Settings
    'settings.currency': 'Devise',
    'settings.language': 'Langue',
    'settings.location': 'Localisation',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Confidentialité',
    'settings.account': 'Compte',
    'settings.profile': 'Profil',
    'settings.preferences': 'Préférences'
  }
};

export const getTranslation = (key: string, language: string = 'en'): string => {
  const langTranslations = translations[language as keyof typeof translations];
  if (!langTranslations) {
    // Fallback to English
    const englishTranslations = translations.en;
    return englishTranslations[key as keyof typeof englishTranslations] || key;
  }
  
  return langTranslations[key as keyof typeof langTranslations] || key;
};

export const getCurrentLanguage = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('selectedLanguage') || 'en';
  }
  return 'en';
};

export const setCurrentLanguage = (languageCode: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('selectedLanguage', languageCode);
    // Update HTML lang attribute
    document.documentElement.lang = languageCode;
    // Update HTML dir attribute for RTL languages
    const language = getLanguageByCode(languageCode);
    if (language) {
      document.documentElement.dir = language.rtl ? 'rtl' : 'ltr';
    }
  }
};
