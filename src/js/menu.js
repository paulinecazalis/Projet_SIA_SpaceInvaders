import Decor from "./decor.js";
import GameConfig from "./gameConfig.js";
import Level from "./level.js";
import Player from "./player.js";

/*-------------Class pour la gestion du menu principal -----------*/
export default class Menu{
    constructor(){
        this.buttonEvent();
    }
    static actif = true;//Booléen qui permet de déterminer si le menu est actif ou non

    //Permet de déterminer la valeur actif
    static isActive = () => {
        return Menu.actif;
    }

    //Permet de changer la valeur de actif
    static setActive = (bool) => {
        Menu.actif = bool;
    }

    //Evenement du bouton "jouer" sur le menu principal
    //Démarrage du jeu + réinitialisation des données si la partie est perdue
    buttonEvent = () => {
        let btn = document.getElementById("button-play")
        btn.onclick = () => {
            this.discardMenu();
            this.menuPerso();
            GameConfig.interfaceGame();
            GameConfig.resetLives();
        }
    }

    //Permet de gérer le menu des personnages, lorsque le joueur à le choix entre les deux personnages pour jouer
    menuPerso(){
        document.getElementById('menu-personnage').style.display = "block";
        document.getElementById('checkbox-femme').checked = true;
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
            this.createTransition("Level "+ Level.level, 3000);
            document.getElementById('menu-personnage').style.display = "none";
            await Player.createSpaceship().then((value) =>{
                GameConfig.spaceshipObject = value;
                GameConfig.scene.add(value);
            })
        }
    }

    //Permet le chargement du menu principal
    loadMenu = () => {
        Menu.setActive(true);
        document.getElementById("menu").style.display = "block";
    }

    //Permet de cacher le menu principal
    discardMenu = () => {
        document.getElementById("menu").style.display = "none";
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
                GameConfig.setPartieActive(false);
            }, duration);
        }
    }

     //Permet d'afficher le menu option dans le menu principal
    optionMenu = () =>{
        document.getElementById('option').onclick = () =>{
            document.getElementById('menu-option').style.display = "block"
            document.getElementById('menu').style.background = "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('../src/medias/images/menu/page1.jpg') no-repeat center center fixed";
            document.getElementById('menu').style.backgroundSize = "100%"
        }

        document.getElementById('close-option').onclick = () =>{
            document.getElementById('menu-option').style.display = "none"
            document.getElementById('menu').style.background = "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url('../src/medias/images/menu/page1.jpg') no-repeat center center fixed";
            document.getElementById('menu').style.backgroundSize = "100%"
        }
    }
}
