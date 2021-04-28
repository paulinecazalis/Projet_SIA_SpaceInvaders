import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.js';
import GameConfig from './gameConfig.js';

import gameConfig from './gameConfig.js';
import PlayerClass from './player.js';
import Player from './player.js';
import Sound from './sound.js';

/*-------------Class pour la gestion des aliens -----------*/
export default class Alien{
    constructor(){
        this._positionAlien = true; //Booléen qui permet de déterminer la position des aliens
        this._missileAliens; // Variable pour le missile des aliens
        this._missileAliensTire = false; //Booléen pour le missile des aliens, si il est tiré
    }
    static alienTab = []; // Tableau qui contient les aliens
    static alienBonusTab = []; //Tableau qui contient l'alien bonus
    static positionAlienBonus = true; //Booléen pour la position de l'alien bonus
    static timeouttouch; //Permet de manipuler le setTimeout de l'alien bonus, si le joueur le touche
    static timeoutpos; //Permet de manipuler le setTimeout de la position de l'alien bonus

    //Permet de déterminer la position des aliens
    static isPositionAliens = () => {
        return this._positionAlien;
    }

    //Permet de changer la valeur de la position des aliens
    static setPositionAliens = (bool) => {
        this._positionAlien = bool;
    }

     //Permet de déterminer la position de l'alien bonus
     static isPositionAliensBonus = () => {
        return Alien.positionAlienBonus;
    }

    //Permet de changer la valeur de la position de l'alien bonus
    static setPositionAliensBonus = (bool) => {
        Alien.positionAlienBonus = bool;
    }

    //Permet de déterminer si le missile des aliens est tiré
    static isMissileAliensTire = () => {
        return this._missileAliensTire;
    }

    //Permet de changer la valeur du missile des aliens
    static setMissileAliensTire = (bool) => {
        this._missileAliensTire = bool;
    }

    //Permet la création des aliens
    static async createAlien(nbAliensRow, nbAliensTotal){
        let posX, posZ;
        let aliens = new THREE.Group();
        let geometry = new THREE.BoxGeometry( 1.5, 2, 0.5 );
        let material = new THREE.MeshLambertMaterial( {color: 0x00ff00, transparent : true, opacity: 0.0} );
        /*----------Chargement des modèles 3D----------*/
        const tm = await gameConfig.chargerModeleGLTF('../src/medias/models/Aliens/Tom Nook/scene.gltf');
        tm.scene.scale.set(18,18,18);
        tm.scene.rotation.x = 45.5;
        tm.scene.rotation.z = 15.7;

        const daisy = await gameConfig.chargerModeleGLTF('../src/medias/models/Aliens/Daisy Mae/scene.gltf');
        daisy.scene.scale.set(18,18,18);
        daisy.scene.rotation.x = 45.5;
        daisy.scene.rotation.z = 15.7;

        const rounard = await gameConfig.chargerModeleGLTF('../src/medias/models/Aliens/Crazy Redd/scene.gltf');
        rounard.scene.scale.set(18, 18, 18);
        rounard.scene.rotation.x = 45.5;
        rounard.scene.rotation.z = 15.7;

        const pascal = await gameConfig.chargerModeleGLTF('../src/medias/models/Aliens/Pascal 2/scene2.gltf');
        pascal.scene.scale.set(18,18,18);
        pascal.scene.rotation.x = 45.5;
        pascal.scene.rotation.z = 15.7;

        const reseti = await gameConfig.chargerModeleGLTF('../src/medias/models/Aliens/Mr. Resetti/scene.gltf');
        reseti.scene.scale.set(0.06,0.06,0.06);
        reseti.scene.rotation.x = 45.5;
        reseti.scene.rotation.z = 15.7;

        for(let i = 0; i < nbAliensTotal; i++){
            let nb = parseInt(i/nbAliensRow); //Permet d'obtenir le numéro de la ligne suivant le nombre d'alien par lignes
            posZ = nb;
            posX = i%nbAliensRow - ((nbAliensRow-1)/2); //Permet de séparer les aliens sur la ligne x
            const cube = new THREE.Mesh( geometry, material );
            cube.position.set( posX*2, 0, posZ*2 );
            let alienRow = nb == 1 ? pascal.scene.clone() 
            : nb == 2 ? rounard.scene.clone() : nb == 3 ? reseti.scene.clone() : nb == 4 ? tm.scene.clone() : daisy.scene.clone();
            cube.add(alienRow); //Ajout dans un cube des modèles 3D
            aliens.add(cube); //Ajout des cubes avec les aliens dans le groupe d'aliens
        }
        aliens.position.z = 10;
        Alien.alienTab = aliens.children;
        return aliens;
    }

    //Permet la création de l'alien bonus
    static async createAlienBonus(){
        let geometry = new THREE.BoxGeometry( 1.5, 2, 0.5 );
        let material = new THREE.MeshLambertMaterial( {color: 0x00ff00, transparent : true, opacity: 0.0} );
        /*----------Chargement du modèle 3D----------*/
        const alienBns = await gameConfig.chargerModeleGLTF('../src/medias/models/Present/untitled.gltf');
        alienBns.scene.scale.set(0.2,0.2,0.2);
        alienBns.scene.rotation.y = 4;
        alienBns.scene.position.y = -1.5;
        alienBns.scene.rotation.x = 0.05;
        alienBns.scene.rotation.z = 0.05;
        const cubeAlienB = new THREE.Mesh( geometry, material );
        cubeAlienB.add(alienBns.scene);
        cubeAlienB.position.y = 1;
        cubeAlienB.position.z = 25;
        cubeAlienB.position.x = -30;
        cubeAlienB.visible = false;
        Alien.alienBonusTab.push(cubeAlienB);
        return cubeAlienB;
    }

    //Permet de bouger les aliens horizontalement et verticalement
    static moveAlien(aliens){
        let box = new THREE.Box3().setFromObject(aliens);
        if( box.max.x >= 15 || box.min.x <= -15){
            Alien._positionAlien = !Alien._positionAlien;
            if(!gameConfig.isInvincible()){
                aliens.position.z -= 0.1 + gameConfig.vitesseMissileAlien;
            }
        }
        if(Alien._positionAlien){
            aliens.position.x += gameConfig.vitesseAliens;
        }else{
            aliens.position.x -= gameConfig.vitesseAliens;
        }
    }

    //Permet de faire apparaitre et faire bouger l'alien bonus toutes les 10 secondes
    static moveAlienBonus(alienBonus,scene){
        alienBonus.visible = true
        alienBonus.position.x += 0.11;
        Alien.setPositionAliensBonus(true);
        if(Alien.isPositionAliensBonus()){
            if(Player.touchAlienBonus){ //Si le joueur touche l'alien bonus
                alienBonus.visible = false;
                scene.remove(alienBonus);
                alienBonus.position.x = -30;
                Player.touchAlienBonus = false;
                Alien.setPositionAliensBonus(false);
                document.getElementById('invincible').innerHTML = "Invincible: oui";
                Alien.timeouttouch = setTimeout(() => { //Réapparition de l'alien bonus au bout de 10 secondes
                    if(!gameConfig.isPartieActive() && !gameConfig.isPauseGame()){
                        scene.add(alienBonus);
                    alienBonus.visible = true;
                    Alien.setPositionAliensBonus(true);
                    document.getElementById('invincible').innerHTML = "Invincible: non";
                    }
                    
                }, 10000);
            }
            if(alienBonus.position.x >= 30){ //Si l'alien bonus sort du terrain
                scene.remove(alienBonus);
                alienBonus.visible = true;
                alienBonus.position.x = -30;
                Player.touchAlienBonus = false;
                Alien.setPositionAliensBonus(false);
                Alien.timeoutpos = setTimeout(() => { //Réapparition de l'alien bonus au bout de 10 secondes
                    if(!gameConfig.isPartieActive() && !gameConfig.isPauseGame()){
                        scene.add(alienBonus);
                        alienBonus.visible = true;
                        Alien.setPositionAliensBonus(true);
                    }
                }, 10000);
            }
        }
        
        
    }

    //Permet de créer le missile des aliens
    static async createMissileAliens(){
        /*----------Chargement du modèle 3D----------*/
        const missileAlien = await gameConfig.chargerModeleDAE('../src/medias/models/DIY_Recipe/UnitIconRecipe.dae');
        Alien._missileAliens = missileAlien.scene;
        Alien._missileAliens.scale.set(0.2,0.2,0.2);
        Alien._missileAliens.rotation.z = 15.7;
        Alien._missileAliens.visible = false;
        return Alien._missileAliens;
    }

    //Permet de bouger le missile des aliens sur l'axe z. Si celui-ci sort du terrain il devient invisible et retrouve sa position initiale
    static moveMissileAliens = () =>{
        Alien._missileAliens.position.z -= gameConfig.vitesseMissileAlien;
        if(Alien._missileAliens.position.z <= -3){
          Alien._missileAliens.visible = false;
          Alien.setMissileAliensTire(false);
        }
    }

    //Permet de bouger le missie des aliens suivant le nombre d'aliens présents
    //Le missile est positionné en fonction du groupe d'aliens
    static aliensAttack = (aliens) =>{
        //Permet de générer un chiffre entre 0 à n aliens --> correspond au nb d'aliens
        var generAliens = Math.floor(Math.random() * Alien.alienTab.length);
        var random = Math.random();
        if(Alien.alienTab[generAliens] != undefined){
          if(random > 0.8){
            Alien._missileAliens.visible = true;
            Alien.setMissileAliensTire(true);
            Alien._missileAliens.position.z = aliens.position.z + Alien.alienTab[generAliens].position.z;
            Alien._missileAliens.position.x = aliens.position.x + Alien.alienTab[generAliens].position.x;
            gameConfig.vitesseMissileAlien += 0.01;
          }
        }
    }

    //Permet aux aliens de toucher le vaisseau du joueur et de lui faire perdre des vies
    static aliensTouchSpaceship = (spaceship, nbLives) =>{
        var ray = new THREE.Raycaster();
        var vect = new THREE.Vector3(0, 0, 1);
        ray.set(Alien._missileAliens.position, vect);
        var intersect = ray.intersectObject(spaceship);
        if(intersect.length > 0){
            Alien.setMissileAliensTire(false);
            Alien._missileAliens.visible = false;
            if(!Sound.boolSound){ //Activation du son pour le vaisseau
                Sound.livesSound(spaceship);
            }
            if(!gameConfig.isInvincible()){ //Si le mode invincible n'est pas activé on perd une vie
                nbLives --;
                gameConfig.removeLives(nbLives);
                if(!GameConfig.isPostProcessing()){ //L'effet de post-processing est activé si le joueur n'est pas invincible
                    GameConfig.postProcessing();
                }else{
                    GameConfig.composer.removePass(GameConfig.glitchPass);
                }
            }
        }
        return nbLives;
    }

    //Permet aux aliens de toucher le bunker et de leur réduire l'opacité
    static aliensTouchBunk = () =>{
        var ray = new THREE.Raycaster();
        var vect = new THREE.Vector3(0, 3, 1);
        vect.normalize();
        ray.set(Alien._missileAliens.position, vect);
        //Calcule les objets coupant le rayon de prélèvement
        var intersect = ray.intersectObjects(PlayerClass.bunkerTab, true);
        if(intersect.length > 0){
          if(intersect[0].object.material.opacity != 0){
            intersect[0].object.material.opacity -= 0.5; //On réduit l'opacité des bunkers dès qu'un alien le touche
            Alien.setMissileAliensTire(false);
            Alien._missileAliens.visible = false;
            if(intersect[0].object.material.opacity <= 0){ //Si l'opacité est en dessous de 0 on supprime visuellement les bunkers de la scene
              intersect[0].object.visible = false;
            }
          }
        }
    }

    

    




}
