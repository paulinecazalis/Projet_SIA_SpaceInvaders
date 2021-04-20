import * as THREE from '../lib/node_modules/three/build/three.module.js';
import Level from './level.js';
import gameConfig from './gameConfig.js';
import Alien from './alien.js';
import Sound from './sound.js';

export default class Player{
    constructor(){
        this.moveSpaceShip();
    }

    static bunkerTab = []; //Tableau qui contient les bunkers
    static spaceship; //Variable pour le vaiseau du joueur
    static missilePlayerActive = false; //Booléen qui détermine si le missile du joueur est présent
    static missile; //Variable pour le missile du joueur
    static scoreGroup = new THREE.Group(); //groupe de texte pour le score
    static touchAlienBonus = false;

    //Permet de déterminer la valeur de this._missilePlayerActive
    isMissileActive = () => {
        return Player.missilePlayerActive;
    }

    //Permet de changer la valeur de this._missilePlayerActive
    setMissileActive = (bool) => {
        Player.missilePlayerActive = bool;
    }

    //Permet la création du joueur
    static async createSpaceship(){
        let geometry = new THREE.BoxGeometry( 2, 0.8, 0.4 );
        let material = new THREE.MeshLambertMaterial( {color: 0x660000, transparent : true, opacity: 0.0} );
        Player.spaceship = new THREE.Mesh( geometry, material );
        //const vill1 = await gameConfig.chargerModeleGLTF('../src/medias/models/villageoise.gltf');
        let vill1;
        if(document.getElementById('checkbox-homme').checked == true){
          vill1 = await gameConfig.chargerModeleDAE('../src/medias/models/Villagers/dys_guest_boy01.dae');

        }else{
          vill1 = await gameConfig.chargerModeleDAE('../src/medias/models/Villagers/dys_guest_girl01.dae');
        }
        console.log(vill1.scene);
        const vill1Space = vill1.scene;
        vill1Space.scale.set(0.15,0.15,0.15);
        //vill1Space.rotation.x = 14.2;
        vill1Space.rotation.x = 0;
        vill1Space.position.y = -1;
        Player.spaceship.add(vill1Space);
        return Player.spaceship;
    }

    //Permet la création des bunkers
    static async createBunker(){
        let bunker = new THREE.Group();
        for(let i = 0 ; i <= 4; i++){
            const tree = await gameConfig.chargerModeleGLTF('../src/medias/models/Stone/stone.gltf');
            const treeBunk = tree.scene;
            //treeBunk.position.x = i * 3;
            treeBunk.position.x = (i%4 - ((4-3)/2)) * 5;
            treeBunk.scale.set(0.7,0.7,0.7);
            //treeBunk.rotation.x = 45.5;
            bunker.add(treeBunk);
            bunker.position.x = -6;
            bunker.position.z = 2;
            bunker.position.y = -1;
            Player.bunkerTab.push(bunker.children[i]);
        }
        return bunker;
    }

    //Permet la création du missile du joueur
    static async createMissilePlayer(){
        let geometry = new THREE.BoxGeometry(0.3,0.3,0.6);
        let material = new THREE.MeshLambertMaterial( {color: 'rgb(255, 255, 0)', transparent : true, opacity: 0.0} );
        const loadedData4 = await gameConfig.chargerModeleDAE('../src/medias/models/Bell_bag/Bell_Bag.dae');
        Player.missile = new THREE.Mesh(geometry, material);
        const geoMissile = loadedData4.scene;
        geoMissile.scale.set(0.08,0.08,0.08);
        //geoMissile.visible = false;
        Player.missile.add(geoMissile);
        Player.missile.visible = false;
        return Player.missile;
        //this._missile = new THREE.Mesh(geometry, material);
    }

    //Permet le mouvement du missile du joueur
    moveMissilePlayer = () =>{
        Player.missile.position.z += 0.5;
        if(Player.missile.position.z >= 28){
            Player.missile.position.z = 0;
            Player.missile.visible = false;
            this.setMissileActive(false);
        }
    }

    //Permet le mouvement du joueur (déplacement latéral + tire)
    moveSpaceShip = (step, camera, controls, aliens) =>{
        if(gameConfig.keyboard.pressed("right")){
            if(Player.spaceship.position.x - 1.5 > -14){
                Player.spaceship.position.x -= 4 * step;
            }
            //this._spaceship.position.x -= 5 * step;
            if(!gameConfig.lockCam){
              camera.position.set(Player.spaceship.position.x, 2.5, -2);
              controls.target = new THREE.Vector3(Player.spaceship.position.x, 0, 20);
              //Alien.moveAlien(aliens)
            }
        }
        if(gameConfig.keyboard.pressed("left")){
            if(Player.spaceship.position.x + 1.5 < 14){
                Player.spaceship.position.x += 4 * step;
            }
          
          if(!gameConfig.lockCam){
            camera.position.set(Player.spaceship.position.x, 2.5, -2);
            controls.target = new THREE.Vector3(Player.spaceship.position.x, 0, 20);
          }
        }
        if(gameConfig.keyboard.pressed("space")){
          if(!Player.missilePlayerActive){
            this.setMissileActive(true);
            Player.missile.position.z = 0;
            Player.missile.position.x = Player.spaceship.position.x;
            Player.missile.visible = true;
          }
        }
    }

    //Permet au joueur de toucher les aliens
    touchAliens = (aliens) =>{
        var ray = new THREE.Raycaster();
        var vect = new THREE.Vector3(1, 0, 1);
        ray.set(Player.missile.position, vect);
      
        //Calcule les objets coupant le rayon de prélèvement
        var intersect = ray.intersectObjects(Alien.alienTab);
        if(intersect.length > 0){
          intersect[0].object.visible = false;
          Player.missile.visible = false;
          if(!Sound.boolSound){
            Sound.alienSound(aliens);
          }
          gameConfig.loadSmokeEffect();          
          if(intersect[0].object.visible == false){
            Alien.alienTab.splice(Alien.alienTab.indexOf(intersect[0].object),1);
            aliens.remove(intersect[0].object);
          }          
          gameConfig.scoreTotal += intersect[0].object.position.z * 10 + 10;
          document.getElementById('score').innerHTML = "Score: " + gameConfig.scoreTotal;
          let score3D = intersect[0].object.position.z * 10 + 10;
          let convertScore3D = score3D.toString();
          console.log(gameConfig.scoreTotal);
          this.scoreTouchAlien("+" + convertScore3D);
          this.setMissileActive(false);
        }
    }

    //Permet au joueur de toucher les bunker
    playerTouchBunk = () =>{
        var ray = new THREE.Raycaster();
        var vect = new THREE.Vector3(0, 2, 1); //pour toucher les feuilles de l'arbre et non le tronc
        vect.normalize();
        ray.set(Player.missile.position, vect);
      
        //Calcule les objets coupant le rayon de prélèvement
        var intersect = ray.intersectObjects(Player.bunkerTab, true);
        if(intersect.length > 0){
          if(intersect[0].object.material.opacity != 0){
            intersect[0].object.material.opacity -= 0.5;
            this.setMissileActive(false);
            Player.missile.visible = false;
            if(intersect[0].object.material.opacity <= 0){
                intersect[0].object.visible = false;
              //scene.remove(intersect[0].object);
              //bunkTab.splice(bunkTab.indexOf(intersect[0].object),1);
            }
          }
        }
    }

    touchAlienBonus = () =>{
      var ray = new THREE.Raycaster();
      var vect = new THREE.Vector3(0, 0.4, 1);
      ray.set(Player.missile.position, vect);
      //Calcule les objets coupant le rayon de prélèvement
      var intersect = ray.intersectObjects(Alien.alienBonusTab);
      if(intersect.length > 0){
        intersect[0].object.visible = false;
        Player.touchAlienBonus = true;
        Player.missile.visible = false;
        this.setMissileActive(false);
        gameConfig.setInvincible(true);
        setTimeout(() => {
          console.log('plus invincible');
          gameConfig.setInvincible(false);
        }, 10000);
      }
    }

    scoreTouchAlien = (score) =>{
      //console.log(gameConfig.scoreTotal);

      var fontLoader = new THREE.FontLoader();
      fontLoader.load('../src/medias/font/IndieFlower.json', (font) => {
        var textMaterial = new THREE.MeshBasicMaterial({color: "rgb(255,255,255)"});
        var textGeometry = new THREE.TextGeometry(score, {
          font: font,
          size: 0.7,
          height: 0.2
        });
        //textGeometry.center();
        var textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.x = Player.missile.position.x;
        textMesh.position.y = 3;
        textMesh.position.z = Player.missile.position.z;
        textMesh.rotation.y = THREE.Math.degToRad(-180);
        //scene.add(textMesh);
        Player.scoreGroup.add(textMesh);
        setInterval(() => {
          textMesh.position.y += 0.05;
          if(textMesh.position.y > 4){
            clearInterval(this);
          }
        }, 1000/60);
        setTimeout(() => {
          Player.scoreGroup.remove(textMesh);
        }, 1000);
      });
    }

    
}