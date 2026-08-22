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
        btn.textContent = currentLanguage === 'en' ? 'ID' : 'EN'
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

    // Create language toggle button if not exists
    if(!document.querySelector('.js-language-toggle'))
    {
        const button = document.createElement('button')
        button.className = 'js-language-toggle language-toggle'
        button.textContent = currentLanguage === 'en' ? 'ID' : 'EN'
        button.title = currentLanguage === 'en' ? 'Ganti ke Bahasa Indonesia' : 'Switch to English'

        button.style.position = 'fixed'
        button.style.top = '16px'
        button.style.right = '60px'
        button.style.zIndex = '1000'
        button.style.padding = '6px 12px'
        button.style.borderRadius = '20px'
        button.style.border = '1px solid rgba(255, 255, 255, 0.2)'
        button.style.background = 'rgba(20, 16, 25, 0.65)'
        button.style.backdropFilter = 'blur(8px)'
        button.style.webkitBackdropFilter = 'blur(8px)'
        button.style.color = '#ffffff'
        button.style.fontFamily = "'Nunito', sans-serif"
        button.style.fontSize = '13px'
        button.style.fontWeight = '700'
        button.style.letterSpacing = '1px'
        button.style.cursor = 'pointer'
        button.style.transition = 'all 0.2s ease'
        button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)'

        button.addEventListener('mouseenter', () =>
        {
            button.style.background = 'rgba(255, 255, 255, 0.2)'
            button.style.transform = 'scale(1.05)'
        })

        button.addEventListener('mouseleave', () =>
        {
            button.style.background = 'rgba(20, 16, 25, 0.65)'
            button.style.transform = 'scale(1)'
        })

        button.addEventListener('click', () =>
        {
            const nextLang = currentLanguage === 'en' ? 'id' : 'en'
            setLanguage(nextLang)
        })

        document.body.appendChild(button)
    }
}
