import './threejs-override.js'
import { initLanguageToggle } from './i18n/LanguageToggle.js'
import { Game } from './Game/Game.js'
import consoleLog from './data/consoleLog.js'

initLanguageToggle()

if(import.meta.env.VITE_LOG)
    console.log(
        ...consoleLog
    )

if(import.meta.env.VITE_GAME_PUBLIC)
    window.game = new Game()
else
    new Game()