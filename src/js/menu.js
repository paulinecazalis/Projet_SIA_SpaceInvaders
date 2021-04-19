import gameConfig from "./gameConfig.js";
import Level from "./level.js";
import Player from "./player.js";

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
            this.menuPerso();
            //gameConfig.interfaceGame();
            //gameConfig.resetLives();
            
        }
    }

    menuPerso(){
        let space;
        document.getElementById('menu-personnage').style.display = "block";
        document.getElementById('checkbox-femme').checked = false;
        document.getElementById('checkbox-homme').checked = false;
        document.getElementById('checkbox-femme').onclick = () =>{
            if(document.getElementById('checkbox-femme').checked == true){
                document.getElementById('checkbox-homme').checked = false;
            }else{
                document.getElementById('checkbox-homme').checked = true;
            }
        };

        document.getElementById('checkbox-homme').onclick = () =>{
            if(document.getElementById('checkbox-homme').checked == true){
                document.getElementById('checkbox-femme').checked = false;
            }else{
                document.getElementById('checkbox-femme').checked = true;
            }
        };

        document.getElementById('jouer-menu-perso').onclick = async () =>{
            this.createTransition("Level "+ gameConfig.level, 3000);
            document.getElementById('menu-personnage').style.display = "none";
            await Player.createSpaceship().then((value) =>{
                //space = value;
                //scene.remove(value)
                gameConfig.spaceshipObject = value;
                gameConfig.scene.add(value);
            })
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
        //this.createTransition("Level "+ gameConfig.level, 3000);
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
