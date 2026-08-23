import { translations } from './translations.js'
export { translations }

let currentLanguage = localStorage.getItem('language') || (/^id/i.test(navigator.language) ? 'id' : 'en')

export function getCurrentLanguage()
{
    return currentLanguage
}

export function t(key, fallback = '')
{
    const dict = translations[currentLanguage] || translations.en
    return dict[key] ?? fallback
}

export function setLanguage(lang)
{
    if(lang !== 'en' && lang !== 'id')
        lang = 'en'

    currentLanguage = lang
    localStorage.setItem('language', currentLanguage)

    applyLanguage(currentLanguage)

    // Update toggle button text
    const btn = document.querySelector('.js-language-toggle')
    if(btn)
    {
        const textEl = btn.querySelector('.js-lang-text')
        if(textEl)
            textEl.textContent = currentLanguage === 'en' ? 'ID' : 'EN'
        btn.title = currentLanguage === 'en' ? 'Ganti ke Bahasa Indonesia' : 'Switch to English'
    }

    // Dispatch global event for 3D canvas and components
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: currentLanguage } }))
}

export function applyLanguage(lang)
{
    const dict = translations[lang] || translations.en

    // Text content
    document.querySelectorAll('[data-i18n]').forEach((element) =>
    {
        const key = element.getAttribute('data-i18n')
        if(dict[key] !== undefined)
            element.textContent = dict[key]
    })

    // HTML content
    document.querySelectorAll('[data-i18n-html]').forEach((element) =>
    {
        const key = element.getAttribute('data-i18n-html')
        if(dict[key] !== undefined)
            element.innerHTML = dict[key]
    })

    // Input placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) =>
    {
        const key = element.getAttribute('data-i18n-placeholder')
        if(dict[key] !== undefined)
            element.placeholder = dict[key]
    })
}

export function initLanguageToggle()
{
    // Apply initial translations on page load
    applyLanguage(currentLanguage)

    const btn = document.querySelector('.js-language-toggle')
    if(btn)
    {
        const textEl = btn.querySelector('.js-lang-text')
        if(textEl)
            textEl.textContent = currentLanguage === 'en' ? 'ID' : 'EN'
        btn.title = currentLanguage === 'en' ? 'Ganti ke Bahasa Indonesia' : 'Switch to English'

        btn.addEventListener('click', () =>
        {
            const nextLang = currentLanguage === 'en' ? 'id' : 'en'
            setLanguage(nextLang)
        })
    }
}
