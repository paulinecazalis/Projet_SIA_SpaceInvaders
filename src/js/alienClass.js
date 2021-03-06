import * as THREE from '../lib/node_modules/three/build/three.module.js';
import {GLTFLoader} from '../lib/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {ColladaLoader} from '../lib/node_modules/three/examples/jsm/loaders/ColladaLoader.js';
import Level from '../js/level.js';
export default class Alien{
    constructor(){
        this._position;
        this._pointAlien;
        this._speed;
        this._positionAlien = true;
        this._missileAliens;
        this._missileAliensTire = false;
        this._alienTab = [];
        this._vitesseMissileAlien = 0.4;
        
    }

    static isPositionAliens = () => {
        return this._positionAlien;
    }

    static setPositionAliens = (bool) => {
        this._positionAlien = bool;
    }

    static isMissileAliensTire = () => {
        return this._missileAliensTire;
    }

    static setMissileAliensTire = (bool) => {
        this._missileAliensTire = bool;
    }


     static async createAlien(nbAliensRow, nbAliensTotal){
        let posX, posZ;
        let aliens = new THREE.Group();
        let geometry = new THREE.BoxGeometry( 1, 1, 1 );
        let material = new THREE.MeshLambertMaterial( {color: 0x00ff00, transparent : true, opacity: 0.0} );
        //PRENDRE MODEL MOBILE POUR QUE CA FONCTIONNE
        const tm = await this.chargerModele('../src/medias/models/Tom Nook/scene.gltf');
        const daisy = await this.chargerModele('../src/medias/models/Daisy Mae/scene.gltf');
        const rounard = await this.chargerModele('../src/medias/models/Crazy Redd/scene.gltf');
        const pascal = await this.chargerModele('../src/medias/models/Pascal 2/scene2.gltf');
        const reseti = await this.chargerModele('../src/medias/models/Mr. Resetti/scene.gltf');
        //const reseti = await this.chargerModeleDAE('../src/medias/models/Crazy_Redd/Crazy_Redd.dae');
        tm.scene.scale.set(11,11,11);
        tm.scene.rotation.x = 45.5;
        tm.scene.rotation.z = 15.7;
        daisy.scene.scale.set(11,11,11);
        daisy.scene.rotation.x = 45.5;
        daisy.scene.rotation.z = 15.7;
        rounard.scene.scale.set(11, 11, 11);
        rounard.scene.rotation.x = 45.5;
        rounard.scene.rotation.z = 15.7;
        pascal.scene.scale.set(11,11,11);
        pascal.scene.rotation.x = 45.5;
        pascal.scene.rotation.z = 15.7;
        reseti.scene.scale.set(0.04,0.04,0.04);
        reseti.scene.rotation.x = 45.5;
        reseti.scene.rotation.z = 15.7;
        for(let i = 0; i < nbAliensTotal; i++){
            let nb = parseInt(i/nbAliensRow);
            posZ = nb;
            posX = i%nbAliensRow - ((nbAliensRow-1)/2);
            const cubeRounard = new THREE.Mesh( geometry, material );
            cubeRounard.position.set( posX*2, 0, posZ*2 );
            let essai = nb == 1 ? pascal.scene.clone() 
            : nb == 2 ? rounard.scene.clone() : nb == 3 ? reseti.scene.clone() : nb == 4 ? tm.scene.clone() : daisy.scene.clone();
            cubeRounard.add(essai);
            aliens.add(cubeRounard);
            
        }
        aliens.position.z = 10;
        this._alienTab = aliens.children;
        return aliens;
    }

    static chargerModele(url){
        let loader = new GLTFLoader();
        return new Promise((resolve, reject) => {
            loader.load(url, data=> resolve(data), null, reject);
        });
    }

    static moveAlien(step, aliens){
        let box = new THREE.Box3().setFromObject(aliens);
        if( box.max.x >= 15 || box.min.x <= -15){
            Alien._positionAlien = !Alien._positionAlien;
            aliens.position.z -= 0.1 + Level.vitesseMissileAlien;
        }
        if(Alien._positionAlien){
            aliens.position.x += Level.vitesseAliens;
        }else{
            aliens.position.x -= Level.vitesseAliens;
        }
    }

    static async createMissileAliens(){
        /*let geometry = new THREE.BoxGeometry(0.2,0.2,0.6);
        let material = new THREE.MeshLambertMaterial( {color: 'rgb(255, 255, 0)'} );
        Alien._missileAliens = new THREE.Mesh(geometry, material);
        Alien._missileAliens.visible = false;*/
        const missileAlien = await this.chargerModeleDAE('../src/medias/models/DIY_Recipe/UnitIconRecipe.dae');
        Alien._missileAliens = missileAlien.scene;
        Alien._missileAliens.scale.set(0.2,0.2,0.2);
        Alien._missileAliens.rotation.z = 15.7;
        Alien._missileAliens.visible = false;
        return Alien._missileAliens;
    }

    static chargerModeleDAE = (url) =>{
        let loader = new ColladaLoader();
        return new Promise((resolve, reject) => {
            loader.load(url, data=> resolve(data), null, reject);
        });
    }

    static moveMissileAliens = () =>{
        Alien._missileAliens.position.z -= Level.vitesseMissileAlien;
        if(Alien._missileAliens.position.z <= -3){
          Alien._missileAliens.visible = false;
          Alien.setMissileAliensTire(false);
        }
    }

    static aliensAttack = (aliens) =>{
        //Permet de générer un chiffre entre 0 à n aliens --> correspond au nb d'aliens
        var generAliens = Math.floor(Math.random() * Alien._alienTab.length);
        var random = Math.random();
        if(Alien._alienTab[generAliens] != undefined){
          if(random > 0.8){
            Alien._missileAliens.visible = true;
            Alien.setMissileAliensTire(true);
            Alien._missileAliens.position.z = aliens.position.z + Alien._alienTab[generAliens].position.z;
            Alien._missileAliens.position.x = aliens.position.x + Alien._alienTab[generAliens].position.x;
            Level.vitesseMissileAlien += 0.01;
          }
        }
    }

    static aliensTouchSpaceship = (spaceship, nbLives) =>{
        var ray = new THREE.Raycaster();
        var vect = new THREE.Vector3(0, 0, 1);
        ray.set(Alien._missileAliens.position, vect);
      
        var intersect = ray.intersectObject(spaceship);
        if(intersect.length > 0){
            Alien.setMissileAliensTire(false);
            Alien._missileAliens.visible = false;
            nbLives --;
        }
        return nbLives;
    }

    static aliensTouchBunk = (bunkTab) =>{
        var ray = new THREE.Raycaster();
        var vect = new THREE.Vector3(0, 0, 1);
        ray.set(Alien._missileAliens.position, vect);
      
        //Calcule les objets coupant le rayon de prélèvement
        var intersect = ray.intersectObjects(bunkTab, true);
        if(intersect.length > 0){
          if(intersect[0].object.material.opacity != 0){
            intersect[0].object.material.opacity -= 0.5;
            Alien.setMissileAliensTire(false);
            Alien._missileAliens.visible = false;
            if(intersect[0].object.material.opacity <= 0){
              //scene.remove(intersect[0].object);
              bunkTab.splice(bunkTab.indexOf(intersect[0].object),1);
            }
          }
        }
    }




}
