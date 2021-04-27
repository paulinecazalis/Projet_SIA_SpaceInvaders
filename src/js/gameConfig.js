//Class de configuration du jeu
import {GLTFLoader} from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import {ColladaLoader} from 'https://threejs.org/examples/jsm/loaders/ColladaLoader.js';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.js';

import Player from './player.js';
import Alien from './alien.js';

export default class gameConfig{

    static invincible = false; //le joueur n'est pas invincible, il le devient en utilisant la touche de triche
    static level = 1; // initialisation du premier niveau
    static vitesseAliens = 0.06; //initialisation de la vitesse des aliens
    static vitesseMissileAlien = 0.1; //initialisation de la vitesse du missile des aliens
    static scoreTotal = 0; //initialisation du score total du joueur
    static partieFinie = false; //initialisation à faux car la partie n'est pas finie
    static keyboard = new THREEx.KeyboardState(); //variables qui permet d'utiliser les touches du claviers
    static lockCam = true; //Booléen qui permet de bloquer la caméra du joueur
    static pause = false; // pour savoir si le jeu est en pause ou non
    static help = false; //pour savoir si on a appuyé sur la touche h
    static spaceshipObject;
    static scene = new THREE.Scene();
    static smokeParticles = new THREE.Group();
    static particle;

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
        if(gameConfig.keyboard.pressed("2")){
            gameConfig.lockCam = true;
            /*camera.position.set( -10, 30, -5);
            camera.lookAt(0, Math.PI/2, 0);
            camera.up.set(0, 90, 0);*/
            camera.position.set(30, 20, 10);
            //camera.lookAt(0, 150, 0);
        }
    }

    //Permet d'enlever les vies affichées à l'écran (pommes)
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

    //Permet de faire l'interface du jeu (vies, affichage des commandes...)
    static interfaceGame = () =>{
        document.getElementById('lives').style.display = "block";
        document.getElementById('game-element').style.visibility = "visible";
        document.getElementById('help-commande').style.visibility = "visible";
        document.getElementById('score-level').style.display = "block";
        document.getElementById('camera').style.visibility = "visible";
        document.getElementById('score').innerHTML = "Score: " + gameConfig.scoreTotal;
        document.getElementById('level').innerHTML = "Level: " + gameConfig.level;
        document.getElementById('invincible').style.display = "block";
        document.getElementById('invincible').innerHTML = "Invincible: non" ;
        document.getElementById('postpro').style.display = "block";
        document.getElementById('postpro').innerHTML = "Post-processing: non" ;
    }

    static helpKey = () =>{
        document.addEventListener('keydown', (e) => {
            if(e.key == "h" || e.key == "H"){
                gameConfig.sethelpGame(!gameConfig.help);
                if(gameConfig.help){
                    document.getElementById('help-commande').style.visibility = "hidden";
                    document.getElementById('camera').style.visibility = "hidden";
                }else{
                    document.getElementById('help-commande').style.visibility = "visible";
                    document.getElementById('camera').style.visibility = "visible";
                }
            }
        })
    }

    static async loadSpaceshipMenu(scene){
        await Player.createSpaceship().then((value) =>{
            //space = value;
            //scene.remove(value)
            gameConfig.spaceshipObject = value;
            scene.add(value);
        })
    }

    static loadSmokeEffect(){
        let smokeTexture = new THREE.TextureLoader();
        smokeTexture.load("./src/medias/images/smoke.png", function(texture){
            let smokeGeo = new THREE.PlaneGeometry(3, 3);
            let smokeMaterial = new THREE.MeshLambertMaterial({
                //color: new THREE.Color("rgb(83, 84, 255)"),
                map: texture,
                transparent: true,
                opacity: 0.0
            });
            gameConfig.particle = new THREE.Mesh(smokeGeo, smokeMaterial);
            gameConfig.particle.name = "particle";
            gameConfig.particle.position.x = Player.missile.position.x;
            gameConfig.particle.position.z = Player.missile.position.z;
            gameConfig.particle.position.y = 3;
            gameConfig.particle.rotation.y = 9.5;
            gameConfig.particle.material.opacity = 1;
            gameConfig.smokeParticles.add(gameConfig.particle);
            let interval = setInterval(() => {
                gameConfig.scene.add(gameConfig.smokeParticles);
                gameConfig.particle.position.y += 0.1;
                if(gameConfig.particle.position.y > 6){
                    gameConfig.scene.remove(gameConfig.particle);
                    clearInterval(interval);
                }
            }, 1000/60);
            setTimeout(() => {
                gameConfig.smokeParticles.remove(gameConfig.particle)
                gameConfig.scene.remove(gameConfig.smokeParticles);
            }, 500);
        });
          
    }

    static optionMenu = () =>{
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