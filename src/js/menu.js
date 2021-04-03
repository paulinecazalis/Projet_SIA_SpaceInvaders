import gameConfig from "./gameConfig.js";
import Level from "./level.js";
import NewGame from "./newGame.js";

export default class Menu{
    constructor(){
        this._active = true; //Booléen qui permet de déterminer si le menu est actif ou non
        this.buttonEvent();
    }

    //Permet de déterminer la valeur de this._active
    static isActive = () => {
        return this._active;
    }

    //Permet de changer la valeur de this._active
    static setActive = (bool) => {
        this._active = bool;
    }

    //Evenement du bouton "jouer" sur le menu principal
    //Démarrage du jeu + réinitialisation des données si la partie est perdue
    buttonEvent = () => {
        let btn = document.getElementById("button-play")
        btn.onclick = () => {
            this.discardMenu();
            gameConfig.interfaceGame();
            gameConfig.resetLives();
            //NewGame.loadNewGame();
            
        }
    }

    //Permet le chargement du menu
    loadMenu = () => {
        Menu.setActive(true);
        document.getElementById("menu").style.display = "block";
    }

    //Permet de cacher le menu et de créer la transition du premier niveau
    discardMenu = () => {
        document.getElementById("menu").style.display = "none";
        this.createTransition("Level "+ gameConfig.level, 3000);
    }

    //Permet la création de la transition pour le premier niveau
    createTransition = (text, duration) => {
        document.getElementById('title-trans').innerHTML = text;
        document.getElementById('trans').id = "trans";
        document.getElementById('trans').style.display = "block";
        Menu.setActive(true);
        if(duration > 0){
            setTimeout(() => {
                document.getElementById('trans').style.display = "none";
                Menu.setActive(false);
                gameConfig.setPartieActive(false);
            }, duration);
        }
    }
}
