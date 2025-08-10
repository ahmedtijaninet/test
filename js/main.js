document.addEventListener('DOMContentLoaded', () => {
    const langSelect = document.getElementById('lang-select');

    const loadTranslations = async (lang) => {
        try {
            const response = await fetch(`lang/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang}.json`);
            }
            const translations = await response.json();
            applyTranslations(translations);
            updateLanguageDirection(lang);
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to French if the selected language fails
            if (lang !== 'fr') {
                loadTranslations('fr');
            }
        }
    };

    const applyTranslations = (translations) => {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                element.innerHTML = translations[key];
            }
        });
        document.title = translations.page_title || 'SELYN';
    };

    const updateLanguageDirection = (lang) => {
        if (lang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'ar');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', lang);
        }
    };

    const getInitialLanguage = () => {
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang) {
            return savedLang;
        }
        const browserLang = navigator.language.split('-')[0];
        const supportedLangs = ['fr', 'en', 'ar', 'es'];
        return supportedLangs.includes(browserLang) ? browserLang : 'fr';
    };

    langSelect.addEventListener('change', (e) => {
        const selectedLang = e.target.value;
        localStorage.setItem('preferredLanguage', selectedLang);
        loadTranslations(selectedLang);
    });

    // Initial load
    const initialLang = getInitialLanguage();
    langSelect.value = initialLang;
    loadTranslations(initialLang);
});
