import { Game } from './Game.js'
import { getCurrentLanguage, translations } from '../i18n/LanguageToggle.js'

export class Options
{
    constructor()
    {
        this.game = Game.getInstance()
        this.element = this.game.menu.items.get('options').contentElement

        this.setSound()
        this.setQuality()
        this.setRespawn()
        this.setReset()
        this.setRenderer()
        this.setServer()

        window.addEventListener('languagechange', () =>
        {
            this.updateTranslations()
        })
    }

    setSound()
    {
        const element = this.element.querySelector('.js-audio-toggle')

        element.addEventListener('click', this.game.audio.mute.toggle)
    }

    setQuality()
    {
        const element = this.element.querySelector('.js-quality-toggle')
        this.qualityText = element.querySelector('span')
        
        const updateText = () =>
        {
            const lang = getCurrentLanguage()
            if(this.game.quality.level === 0)
                this.qualityText.textContent = translations[lang]?.options_quality_high || 'High'
            else
                this.qualityText.textContent = translations[lang]?.options_quality_low || 'Low'
        }

        updateText()

        element.addEventListener('click', () =>
        {
            this.game.quality.changeLevel(this.game.quality.level === 0 ? 1 : 0)
        })

        this.game.quality.events.on('change', () =>
        {
            updateText()
        })
    }

    setRespawn()
    {
        const element = this.element.querySelector('.js-respawn')

        element.addEventListener('click', () =>
        {
            this.game.player.respawn()
            this.game.menu.close()
        })
    }

    setReset()
    {
        const element = this.element.querySelector('.js-reset')

        element.addEventListener('click', () =>
        {
            this.game.reset()
            this.game.menu.close()
        })
    }

    setRenderer()
    {        
        if(this.game.rendering.renderer.backend.isWebGLBackend)
        {
            const element = this.element.querySelector('.js-renderer')
            element.classList.remove('is-success')
            element.classList.add('is-danger')

            const text = element.querySelector('span')
            text.textContent = 'WebGL'

            const tooltip = element.querySelector('.js-tooltip')
            tooltip.innerHTML = /* html */`Your browser is <strong>not compatible</strong> with WebGPU resulting in performance loss`
        }
    }

    setServer()
    {
        const element = this.element.querySelector('.js-server')
        this.serverText = element.querySelector('span')
        this.serverTooltip = element.querySelector('.js-tooltip')
        
        this.updateServer = (connected) =>
        {
            const lang = getCurrentLanguage()
            if(connected)
            {
                element.classList.add('is-success')
                element.classList.remove('is-danger')
                
                this.serverText.textContent = translations[lang]?.options_server_online || 'Online'
                this.serverTooltip.innerHTML = /* html */`Enjoy the <strong>multiplayer</strong> features`
            }
            else
            {
                element.classList.remove('is-success')
                element.classList.add('is-danger')
                this.serverText.textContent = translations[lang]?.options_server_offline || 'Offline'
                this.serverTooltip.innerHTML = /* html */`Server offline`
            }
        }

        this.updateServer(this.game.server.connected)

        this.game.server.events.on('connected', () =>
        {
            this.updateServer(true)
        })
        this.game.server.events.on('disconnected', () =>
        {
            this.updateServer(false)
        })
    }

    updateTranslations()
    {
        const lang = getCurrentLanguage()
        if(this.qualityText)
        {
            if(this.game.quality.level === 0)
                this.qualityText.textContent = translations[lang]?.options_quality_high || 'High'
            else
                this.qualityText.textContent = translations[lang]?.options_quality_low || 'Low'
        }

        if(this.updateServer)
        {
            this.updateServer(this.game.server.connected)
        }
    }
}