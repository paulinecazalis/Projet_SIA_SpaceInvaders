import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.js';
import Alien from './alien.js';
import GameConfig from './gameConfig.js';
import Menu from "./menu.js";

/*-------------Class pour la gestion des niveaux -----------*/
export default class Level{
    static level = 1; //initialisation du premier niveau
    static levelActive = true; //Booléen qui permet de contrôler si le niveau est actif ou non
    
    //Permet de savoir l'état de levelActive
    static isActive = () => {
        return Level.levelActive;
    }

    //Permet de changer l'état de levelActive
    static setActive = (bool) => {
        Level.levelActive = bool;
    }

    //Permet la transition de changement de niveau
    static changementLevel = (level) =>{
        Level.createTransition("Level " + level, 3000);
        Alien.vitesseAliens = level/30;
        Alien.vitesseMissileAlien = level/10; 
    }

    //Permet de créer le bandeau de transition entre chaque niveaux
    static createTransition = (text, duration) => {
        document.getElementById('title-trans').innerHTML = text;
        document.getElementById('trans').style.display = "block";
        Level.setActive(false);
        setTimeout(() => {
            document.getElementById('trans').style.display = "none";
            Level.setActive(true);
        }, duration);
    }

    //Permet de faire le bandeau de transition lorsque la partie est finie (perdu) et de revenir au menu principal
    static gameOver = (text, camera, controls) =>{
        document.getElementById('title-trans-gameover').innerHTML = text;
        document.getElementById('trans-gameover').style.display = "block";
        document.getElementById('trans-gameover').style.minHeight = "30%";

        var scoreFinal = document.createElement('p');
        scoreFinal.innerHTML = "Score final : " + GameConfig.scoreTotal;
        scoreFinal.id = "score-final";
        document.getElementById('trans-gameover').appendChild(scoreFinal);
        if(GameConfig.bestScore <= GameConfig.scoreTotal){
            GameConfig.bestScore = GameConfig.scoreTotal;
        }
        document.getElementById('best-score').innerHTML = "Meilleur score: " + GameConfig.bestScore;

        var btnMenu = document.createElement('button');
        btnMenu.innerHTML = 'Retour menu';
        btnMenu.id = "return-menu";
        btnMenu.onclick = () =>{
            let menu = new Menu();
            menu.loadMenu();
            document.getElementById('trans-gameover').style.display = "none";
            document.getElementById('score-final').style.display = "none";
            document.getElementById('score-level').style.display = "none";
            document.getElementById('game-element').style.visibility = "hidden";
            document.getElementById('help-commande').style.visibility = "hidden";
            document.getElementById('camera').style.visibility = "hidden";
            scoreFinal.innerHTML = "";
            Alien.vitesseAliens = Level.level/30;
            Alien.vitesseMissileAlien = Level.level/10;
            GameConfig.scoreTotal = 0;
            GameConfig.setPostProcessing(false);
            camera.position.set(0, 8, -10);
            controls.target = new THREE.Vector3(0, 0, 20);
        }
        document.getElementById('trans-gameover').appendChild(btnMenu);
    }




}
