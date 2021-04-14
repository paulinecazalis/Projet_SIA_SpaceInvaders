//Class de configuration du jeu
import {GLTFLoader} from '../lib/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {ColladaLoader} from '../lib/node_modules/three/examples/jsm/loaders/ColladaLoader.js';
import * as THREE from '../lib/node_modules/three/build/three.module.js';

import Level from './level.js';
import Menu from './menu.js';

export default class gameConfig{

    static invincible = false; //le joueur n'est pas invincible, il le devient en utilisant la touche de triche
    static level = 1; // initialisation du premier niveau
    static vitesseAliens = 0.05; //initialisation de la vitesse des aliens
    static vitesseMissileAlien = 0.1; //initialisation de la vitesse du missile des aliens
    static scoreTotal = 0; //initialisation du score total du joueur
    static partieFinie = false; //initialisation à faux car la partie n'est pas finie
    static keyboard = new THREEx.KeyboardState(); //variables qui permet d'utiliser les touches du claviers
    static lockCam = true; //Booléen qui permet de bloquer la caméra du joueur
    static pause = false; // pour savoir si le jeu est en pause ou non
    static help = false; //pour savoir si on a appuyé sur la touche h


    //Permet de charger des modèles 3D de type GLTF
    static chargerModeleGLTF(url){
        let loader = new GLTFLoader();
        return new Promise((resolve, reject) => {
            loader.load(url, data=> resolve(data), null, reject);
        });
    }

    //Permet de charger des modèles 3D de type collada (dae)
    static chargerModeleDAE = (url) =>{
        let loader = new ColladaLoader();
        return new Promise((resolve, reject) => {
            loader.load(url, data=> resolve(data), null, reject);
        });
    }

    //Permet de savoir si la partie est active ou non
    static isPartieActive = () =>{
        return gameConfig.partieFinie;
    }

    //Permet de changer la valeur de partieFinie
    static setPartieActive = (bool) =>{
        gameConfig.partieFinie = bool;
    }

    static isInvincible = () =>{
        return gameConfig.invincible;
    }

    //Permet de changer la valeur de partieFinie
    static setInvincible = (bool) =>{
        gameConfig.invincible = bool;
    }

    //permet de savoir le statut du menu pause
    static isPauseGame = () =>{
        return gameConfig.pause;
    }

    //Permet de changer la valeur de pause
    static setPauseGame = (bool) =>{
        gameConfig.pause = bool;
    }

    //permet de savoir le statut du menu help
    static isHelpGame = () =>{
        return gameConfig.help;
    }

    //Permet de changer la valeur de help
    static sethelpGame = (bool) =>{
        gameConfig.help = bool;
    }



    //Permet de changer la caméra du joueur
    static cameraBind = (camera, controls, spaceship) =>{
        if(gameConfig.keyboard.pressed("0")){
          gameConfig.lockCam = true;
          camera.position.set(0, 8, -10);
          controls.target = new THREE.Vector3(0, 0, 20);
        }
        if(gameConfig.keyboard.pressed("1")){
          gameConfig.lockCam = false;
          camera.position.set(spaceship.position.x, 2.5, -2);
          controls.target = new THREE.Vector3(spaceship.position.x, 0, 20);
        }
    }

    //Permet d'enlever les vies affichées à l'écran (pommes)
    static removeLives = (nbLives) =>{
        nbLives == 2 ? document.getElementById('life3').style.visibility = 'hidden' : nbLives == 1 ? document.getElementById('life2').style.visibility = 'hidden' : document.getElementById('life1').style.visibility = 'hidden'
    }

    //Permet de re afficher les vies à l'écran (pommes)
    static resetLives = () =>{
        document.getElementById('life3').style.visibility = 'visible';
        document.getElementById('life2').style.visibility = 'visible';
        document.getElementById('life1').style.visibility = 'visible';
        document.getElementById('score').innerHTML = "Score: " +  0;
    }

    //Permet de faire l'interface du jeu (vies, affichage des commandes...)
    static interfaceGame = () =>{
        document.getElementById('lives').style.visibility = "visible";
        document.getElementById('game-element').style.visibility = "visible";
        document.getElementById('help-commande').style.visibility = "visible";
        document.getElementById('score-level').style.display = "block";
        document.getElementById('score').innerHTML = "Score: " + gameConfig.scoreTotal;
        document.getElementById('level').innerHTML = "Level: " + gameConfig.level;
        document.getElementById('invincible').style.display = "block";
        document.getElementById('invincible').innerHTML = "Invincible: non" ;
    }

    static helpKey = () =>{
        document.addEventListener('keydown', (e) => {
            if(e.key == "h" || e.key == "H"){
                gameConfig.sethelpGame(!gameConfig.help);
                if(gameConfig.help){
                    document.getElementById('help-commande').style.visibility = "hidden";
                }else{
                    document.getElementById('help-commande').style.visibility = "visible";
                }
            }
        })
    }

   

}