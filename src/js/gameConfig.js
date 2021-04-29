//Class de configuration du jeu
import {GLTFLoader} from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import {ColladaLoader} from 'https://threejs.org/examples/jsm/loaders/ColladaLoader.js';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.js';
import { GlitchPass } from 'https://threejs.org/examples/jsm/postprocessing/GlitchPass.js';

import Player from './player.js';
import Level from './level.js';

/*-------------Class pour la gestion du jeu -----------*/
export default class GameConfig{

    static scoreTotal = 0; //Variable pour le score total du joueur
    static bestScore = 0; //Variable pour le meilleur score du joueur
    static scoreGroup = new THREE.Group(); //Groupe pour l'affichage du score à côté des aliens (3D)

    static partieFinie = false; //Booléen pour savoir si la partie est finie ou non
    static keyboard = new THREEx.KeyboardState(); //Variable pour les touches du clavier
    static lockCam = true; //Booléen pour la caméra du joueur
    static pause = false; //Booléen pour savoir si le jeu est en pause ou non
    static scene = new THREE.Scene(); //Variable pour la scène du jeu
    
    static composer; //Variable pour l'effet de post processing
    static glitchPass; //Variable pour l'effet de post processing 
    static boolPostPro = false; //booléen qui permet de savoir si l'effet de postProcessing est activé
    

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
        return GameConfig.partieFinie;
    }

    //Permet de changer la valeur de partieFinie
    static setPartieActive = (bool) =>{
        GameConfig.partieFinie = bool;
    }

    //permet de savoir le statut du menu pause
    static isPauseGame = () =>{
        return GameConfig.pause;
    }

    //Permet de changer la valeur de pause
    static setPauseGame = (bool) =>{
        GameConfig.pause = bool;
    }

    //Permet de déterminer si l'effet de postProcessing est activé ou non
    static isPostProcessing = () => {
        return GameConfig.boolPostPro;
    }

    //Permet de changer la valeur du postProcessing
    static setPostProcessing = (bool) => {
        GameConfig.boolPostPro = bool;
    }

    //Permet de changer la caméra du joueur
    static cameraBind = (camera, controls, spaceship) =>{
        if(GameConfig.keyboard.pressed("0")){
          GameConfig.lockCam = true;
          camera.position.set(0, 8, -10);
          controls.target = new THREE.Vector3(0, 0, 20);
        }
        if(GameConfig.keyboard.pressed("1")){
          GameConfig.lockCam = false;
          camera.position.set(spaceship.position.x, 2.5, -2);
          controls.target = new THREE.Vector3(spaceship.position.x, 0, 20);
        }
        if(GameConfig.keyboard.pressed("2")){
            GameConfig.lockCam = true;
            camera.position.set(30, 20, 10);
        }
    }

    //Permet d'enlever les vies affichées à l'écran (pommes)
    //Compte suivant le nombre de vies restantes du joueur
    static removeLives = (nbLives) =>{
        nbLives == 2 ? document.getElementById('life3').style.display = 'none' : nbLives == 1 ? document.getElementById('life2').style.display = 'none' : document.getElementById('life1').style.display = 'none';
    }

    //Permet de re afficher les vies à l'écran (pommes)
    static resetLives = () =>{
        document.getElementById('life3').style.display = 'block';
        document.getElementById('life2').style.display = 'block';
        document.getElementById('life1').style.display = 'block';
        document.getElementById('score').innerHTML = "Score: " +  0;
    }

    //Permet d'initialiser l'interface du jeu (vies, affichage des commandes...)
    static interfaceGame = () =>{
        document.getElementById('lives').style.display = "block";
        document.getElementById('game-element').style.visibility = "visible";
        document.getElementById('help-commande').style.visibility = "visible";
        document.getElementById('score-level').style.display = "block";
        document.getElementById('camera').style.visibility = "visible";
        document.getElementById('score').innerHTML = "Score: " + GameConfig.scoreTotal;
        document.getElementById('level').innerHTML = "Level: " + Level.level;
        document.getElementById('best-score').innerHTML = "Meilleur score: " + GameConfig.bestScore;
        document.getElementById('invincible').style.display = "block";
        document.getElementById('invincible').innerHTML = "Invincible: non" ;
        document.getElementById('postpro').style.display = "block";
        document.getElementById('postpro').innerHTML = "Post-processing: oui" ;
    }

    //Création de l'effet de post processing (glitch)
    static postProcessing = () =>{
        GameConfig.glitchPass = new GlitchPass();
        GameConfig.composer.addPass( GameConfig.glitchPass );
        setTimeout(() => { //Au bout de 2 secondes on enlève l'effet
            GameConfig.composer.removePass(GameConfig.glitchPass);
        }, 1000);
    }

    //Permet d'afficher, dès que le joueur touche un alien, le nombre de point qui est égal à l'alien à côté de celui-ci
    static scoreTouchAlien = (score) =>{
        var fontLoader = new THREE.FontLoader();
        fontLoader.load('../src/medias/font/IndieFlower.json', (font) => {
          var textMaterial = new THREE.MeshBasicMaterial({color: "rgb(255,255,255)"});
          var textGeometry = new THREE.TextGeometry(score, {
            font: font,
            size: 0.7,
            height: 0.2
          });
          var textMesh = new THREE.Mesh(textGeometry, textMaterial);
          textMesh.position.x = Player.missile.position.x;
          textMesh.position.y = 3;
          textMesh.position.z = Player.missile.position.z;
          textMesh.rotation.y = THREE.Math.degToRad(-180);
          GameConfig.scoreGroup.add(textMesh);
          setInterval(() => {
            textMesh.position.y += 0.05;
            if(textMesh.position.y > 4){
              clearInterval(this);
            }
          }, 1000/60);
          setTimeout(() => {
            GameConfig.scoreGroup.remove(textMesh);
          }, 1000);
        });
    }


}