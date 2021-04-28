//Class de configuration du jeu
import {GLTFLoader} from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import {ColladaLoader} from 'https://threejs.org/examples/jsm/loaders/ColladaLoader.js';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.js';
import { GlitchPass } from 'https://threejs.org/examples/jsm/postprocessing/GlitchPass.js';

import Player from './player.js';
import Alien from './alien.js';

/*-------------Class pour la gestion du jeu -----------*/
export default class GameConfig{

    static invincible = false; //le joueur n'est pas invincible, il le devient en utilisant la touche de triche
    static level = 1; //initialisation du premier niveau
    static vitesseAliens = 0.06; //initialisation de la vitesse des aliens
    static vitesseMissileAlien = 0.1; //initialisation de la vitesse du missile des aliens
    static scoreTotal = 0; //initialisation du score total du joueur
    static partieFinie = false; //initialisation à faux car la partie n'est pas finie
    static keyboard = new THREEx.KeyboardState(); //variables qui permet d'utiliser les touches du claviers
    static lockCam = true; //Booléen qui permet de bloquer la caméra du joueur
    static pause = false; // pour savoir si le jeu est en pause ou non
    static help = false; //pour savoir si on a appuyé sur la touche h
    static spaceshipObject; //Pour la création du joueur
    static scene = new THREE.Scene();
    static smokeParticles = new THREE.Group(); //Group pour la fumée des aliens
    static particle; //variable pour la fumée des aliens
    static bestScore = 0; //Variable pour le meilleur score du joueur
    static composer; //Variable pour l'effet de post processing
    static glitchPass; //Variable pour l'effet de post processing 
    static boolPostPro = false; //booléen qui permet de savoir si l'effet de postProcessing est activé
    static scoreGroup = new THREE.Group(); //groupe de texte pour le score

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

    //Permet de savoir si le joueur est invincible
    static isInvincible = () =>{
        return GameConfig.invincible;
    }

    //Permet de changer la valeur invincible
    static setInvincible = (bool) =>{
        GameConfig.invincible = bool;
    }

    //permet de savoir le statut du menu pause
    static isPauseGame = () =>{
        return GameConfig.pause;
    }

    //Permet de changer la valeur de pause
    static setPauseGame = (bool) =>{
        GameConfig.pause = bool;
    }

    //permet de savoir le statut du menu help
    static isHelpGame = () =>{
        return GameConfig.help;
    }

    //Permet de changer la valeur de help
    static sethelpGame = (bool) =>{
        GameConfig.help = bool;
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
        document.getElementById('level').innerHTML = "Level: " + GameConfig.level;
        document.getElementById('best-score').innerHTML = "Meilleur score: " + GameConfig.bestScore;
        document.getElementById('invincible').style.display = "block";
        document.getElementById('invincible').innerHTML = "Invincible: non" ;
        document.getElementById('postpro').style.display = "block";
        document.getElementById('postpro').innerHTML = "Post-processing: oui" ;
    }

    //Permet d'afficher les commandes d'aide au joueur
    static helpKey = () =>{
        document.addEventListener('keydown', (e) => {
            if(e.key == "h" || e.key == "H"){
                GameConfig.sethelpGame(!GameConfig.help);
                if(GameConfig.help){
                    document.getElementById('help-commande').style.visibility = "hidden";
                    document.getElementById('camera').style.visibility = "hidden";
                }else{
                    document.getElementById('help-commande').style.visibility = "visible";
                    document.getElementById('camera').style.visibility = "visible";
                }
            }
        })
    }

    //joueur
    //Permet de créer le vaisseau du joueur suivant son choix dans le menu
    static async loadSpaceshipMenu(scene){
        await Player.createSpaceship().then((value) =>{
            GameConfig.spaceshipObject = value;
            scene.add(value);
        })
    }

    //Alien
    //Permet d'afficher la fumée des aliens quand ceux-ci sont touchés
    static loadSmokeEffect(){
        let smokeTexture = new THREE.TextureLoader();
        smokeTexture.load("./src/medias/images/smoke.png", function(texture){
            let smokeGeo = new THREE.PlaneGeometry(3, 3);
            let smokeMaterial = new THREE.MeshLambertMaterial({
                map: texture,
                transparent: true,
                opacity: 0.0
            });
            GameConfig.particle = new THREE.Mesh(smokeGeo, smokeMaterial);
            GameConfig.particle.name = "particle";
            GameConfig.particle.position.x = Player.missile.position.x;
            GameConfig.particle.position.z = Player.missile.position.z;
            GameConfig.particle.position.y = 3;
            GameConfig.particle.rotation.y = 9.5;
            GameConfig.particle.material.opacity = 1;
            GameConfig.smokeParticles.add(GameConfig.particle);
            let interval = setInterval(() => {
                GameConfig.scene.add(GameConfig.smokeParticles);
                GameConfig.particle.position.y += 0.1;
                if(GameConfig.particle.position.y > 6){
                    GameConfig.scene.remove(GameConfig.particle);
                    clearInterval(interval);
                }
            }, 1000/60);
            setTimeout(() => {
                GameConfig.smokeParticles.remove(GameConfig.particle)
                GameConfig.scene.remove(GameConfig.smokeParticles);
            }, 500);
        });
          
    }

    //Création de l'effet de post processing (glitch)
    static postProcessing = () =>{
        GameConfig.glitchPass = new GlitchPass();
        GameConfig.composer.addPass( GameConfig.glitchPass );
        setTimeout(() => { //Au bout de 2 secondes on enlève l'effet
            GameConfig.composer.removePass(GameConfig.glitchPass);
        }, 1000);
    }

    //Touche pour activer le post-processing
    static postproKey = () =>{
        document.addEventListener('keydown', (e) => {
            if(e.key == "p" || e.key == "P"){
                GameConfig.setPostProcessing(!GameConfig.boolPostPro);
                if(GameConfig.isPostProcessing()){
                    document.getElementById('postpro').innerHTML = "Post-processing: non" ;
                    let alert = document.getElementsByClassName('alert');
                    alert[0].classList.remove('hide');
                    alert[0].classList.add('show');
                    alert[0].style.opacity = 1;
                    document.getElementsByClassName('msg')[0].innerHTML = "Post-processing désactivé";
                    document.getElementsByClassName('msg')[0].style.fontSize = "16px";
                    setTimeout(() => {
                        alert[0].classList.remove('show');
                        alert[0].classList.add('hide');
                        //alert[0].style.opacity = 0;
                    }, 5000);
                }else{
                    document.getElementById('postpro').innerHTML = "Post-processing: oui" ;
                    let alert = document.getElementsByClassName('alert');
                    alert[0].classList.remove('hide');
                    alert[0].classList.add('show');
                    alert[0].style.opacity = 1;
                    document.getElementsByClassName('msg')[0].innerHTML = "Post-processing activé";
                    document.getElementsByClassName('msg')[0].style.fontSize = "16px";
                    setTimeout(() => {
                        alert[0].classList.remove('show');
                        alert[0].classList.add('hide');
                    }, 5000);
                }

            }
        })
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
          //scene.add(textMesh);
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