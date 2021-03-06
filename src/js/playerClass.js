import * as THREE from '../lib/node_modules/three/build/three.module.js';
import {ColladaLoader} from '../lib/node_modules/three/examples/jsm/loaders/ColladaLoader.js';
import {GLTFLoader} from '../lib/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import Level from '../js/level.js';
export default class PlayerClass{
    constructor(){
        this._missilePlayerActive = false;
        this._keyboard = new THREEx.KeyboardState();
        this._spaceship;
        this.moveSpaceShip();
        this._lockCam = true;
    }

    isMissileActive = () => {
        return this._missilePlayerActive;
    }

    setMissileActive = (bool) => {
        this._missilePlayerActive = bool;
    }

    async createSpaceship(){
        let geometry = new THREE.BoxGeometry( 2, 0.8, 0.4 );
        let material = new THREE.MeshLambertMaterial( {color: 0x660000, transparent : true, opacity: 0.0} );
        this._spaceship = new THREE.Mesh( geometry, material );
        const vill1 = await this.chargerModeleGLTF('../src/medias/models/villageoise.gltf');
        const vill1Space = vill1.scene;
        vill1Space.scale.set(0.15,0.15,0.15);
        vill1Space.rotation.x = 14.2;
        this._spaceship.add(vill1Space);
        this._spaceship.name = "spaceship";
        return this._spaceship;
    }

    async createBunker(){
        let bunker = new THREE.Group();
        
        for(let i = 0 ; i <= 4; i++){
            /*let geometry = new THREE.BoxGeometry( 1, 1, 1 );
            let material = new THREE.MeshLambertMaterial( {color: 'blue', transparent : true, opacity: 1.0} );
            const cubBunk = new THREE.Mesh( geometry, material );
            cubBunk.position.x = i * 3;
            const tree = await this.chargerModele('../src/medias/models/Tree/fg_tree.dae');
            const treeBunk = tree.scene;
            treeBunk.scale.set(10,10,10);
            cubBunk.add(treeBunk);
            bunker.add(cubBunk);
            bunker.position.x = -6;
            bunker.position.z = 2;*/
            const tree = await this.chargerModeleGLTF('../src/medias/models/Tree/scene.gltf');
            const treeBunk = tree.scene;
            treeBunk.position.x = i * 3;
            treeBunk.scale.set(10,10,10);
            treeBunk.rotation.x = 45.5;
            bunker.add(treeBunk);
            bunker.position.x = -6;
            bunker.position.z = 2;
        }
        return bunker;
    }

    async createMissilePlayer(){
        let geometry = new THREE.BoxGeometry(0.4,0.3,0.6);
        let material = new THREE.MeshLambertMaterial( {color: 'rgb(255, 255, 0)', transparent : true, opacity: 0.0} );
        const loadedData4 = await this.chargerModele('../src/medias/models/Bell_bag/Bell_Bag.dae');
        this._missile = new THREE.Mesh(geometry, material);
        const geoMissile = loadedData4.scene;
        geoMissile.scale.set(0.1,0.1,0.1);
        //geoMissile.visible = false;
        this._missile.add(geoMissile);
        this._missile.visible = false;

        return this._missile;
        
        //this._missile = new THREE.Mesh(geometry, material);
        
        
    }

    chargerModele(url){
        let loader = new ColladaLoader();
        return new Promise((resolve, reject) => {
            loader.load(url, data=> resolve(data), null, reject);
        });
    }

    chargerModeleGLTF(url){
        let loader = new GLTFLoader();
        return new Promise((resolve, reject) => {
            loader.load(url, data=> resolve(data), null, reject);
        });
    }

    moveMissilePlayer = () =>{
        this._missile.position.z += 0.5;
        if(this._missile.position.z >= 20){
            this._missile.position.z = 0;
            this._missile.visible = false;
            this.setMissileActive(false);
        }
    }

    moveSpaceShip = (step, camera, controls) =>{
        if(this._keyboard.pressed("right")){
            if(this._spaceship.position.x - 1.5 > -14){
                this._spaceship.position.x -= 5 * step;
            }
            //this._spaceship.position.x -= 5 * step;
            if(!this._lockCam){
              camera.position.set(this._spaceship.position.x, 1, -2);
              controls.target = new THREE.Vector3(this._spaceship.position.x, 0, 20);
            }
        }
        if(this._keyboard.pressed("left")){
            if(this._spaceship.position.x + 1.5 < 14){
                this._spaceship.position.x += 5 * step;
            }
          
          if(!this._lockCam){
            camera.position.set(this._spaceship.position.x, 1, -2);
            controls.target = new THREE.Vector3(this._spaceship.position.x, 0, 20);
          }
        }
        if(this._keyboard.pressed("space")){
          if(!this._missilePlayerActive){
            this.setMissileActive(true);
            this._missile.position.z = 0;
            this._missile.position.x = this._spaceship.position.x;
            this._missile.visible = true;
          }
        }
    }

    touchAliens = (alienTab, aliens) =>{
        var ray = new THREE.Raycaster();
        var vect = new THREE.Vector3(1, 0, 1);
        ray.set(this._missile.position, vect);
      
        //Calcule les objets coupant le rayon de prélèvement
        var intersect = ray.intersectObjects(alienTab);
        if(intersect.length > 0){
          intersect[0].object.visible = false;
          this._missile.visible = false;
          this.setMissileActive(false);
          alienTab.splice(alienTab.indexOf(intersect[0].object),1);
          aliens.remove(intersect[0].object);
          Level.scoreTotal += intersect[0].object.position.z * 10 + 10;
          console.log(Level.scoreTotal);
        }
    }

    playerTouchBunk = (bunkTab) =>{
        /*var ray = new THREE.Raycaster();
        //var vect = new THREE.Vector3(1, 0, 1);
        var vect = new THREE.Vector3(0, 0, 1);
        ray.set(this._missile.position, vect);
      
        //Calcule les objets coupant le rayon de prélèvement
        var intersect = ray.intersectObjects(bunkTab, true);
        if(intersect.length > 0){
            //console.log(intersect[0].object.material.opacity);
            intersect[0].object.material.opacity -= 0.5;
            this.setMissileActive(false);
            this._missile.visible = false;
            
            if(intersect[0].object.material.opacity <= 0){
                bunkTab.splice(bunkTab.indexOf(intersect[0].object),1);
                console.log(bunkTab.length);              
            }
        }*/

        var ray = new THREE.Raycaster();
        var vect = new THREE.Vector3(0, 0, 1);
        ray.set(this._missile.position, vect);
      
        //Calcule les objets coupant le rayon de prélèvement
        var intersect = ray.intersectObjects(bunkTab, true);
        if(intersect.length > 0){
          if(intersect[0].object.material.opacity != 0){
            intersect[0].object.material.opacity -= 0.5;
            this.setMissileActive(false);
            this._missile.visible = false;
            console.log(intersect[0].object.material.opacity);
            if(intersect[0].object.material.opacity < 0){
              //scene.remove(intersect[0].object);
              bunkTab.splice(bunkTab.indexOf(intersect[0].object),1);
            }
          }
        }
    }

    cameraBind = (camera, controls, spaceship) =>{
        if(this._keyboard.pressed("0")){
          this._lockCam = true;
          camera.position.set(0, 8, -20);
          controls.target = new THREE.Vector3(0, 0, 0);
        }
        if(this._keyboard.pressed("1")){
          this._lockCam = false;
          camera.position.set(spaceship.position.x, 1, -2);
          controls.target = new THREE.Vector3(spaceship.position.x, 0, 20);
        }
    }
}