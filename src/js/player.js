import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.js';

import GameConfig from './gameConfig.js';
import Alien from './alien.js';
import Sound from './sound.js';

/*-------------Class pour la gestion du joueur -----------*/
export default class Player{
    constructor(){
        this.moveSpaceShip(); //Permet de faire bouger le personnage du joueur
    }

    static bunkerTab = []; //Tableau qui contient les bunkers
    static spaceship; //Variable pour le vaiseau du joueur
    static missilePlayerActive = false; //Booléen qui détermine si le missile du joueur est présent
    static missile; //Variable pour le missile du joueur
    static touchAlienBonus = false; //Booléen pour l'alien bonus
    static nbLives = 3; //Variable pour le nombre de vie du joueur
    static invincible = false; //le joueur n'est pas invincible, il le devient en utilisant la touche de triche

    //Permet de déterminer la valeur de this._missilePlayerActive
    isMissileActive = () => {
        return Player.missilePlayerActive;
    }

    //Permet de changer la valeur de this._missilePlayerActive
    setMissileActive = (bool) => {
        Player.missilePlayerActive = bool;
    }

    //Permet de savoir si le joueur est invincible
    static isInvincible = () =>{
      return Player.invincible;
    }

    //Permet de changer la valeur invincible
    static setInvincible = (bool) =>{
      Player.invincible = bool;
    }

    //Permet la création du joueur
    static async createSpaceship(){
        let geometry = new THREE.BoxGeometry( 2, 0.8, 0.4 );
        let material = new THREE.MeshLambertMaterial( {color: 0x660000, transparent : true, opacity: 0.0} );
        Player.spaceship = new THREE.Mesh( geometry, material );
        let vill1;
        if(document.getElementById('checkbox-homme').checked == true){
          /*----------Chargement du modèle 3D----------*/
          vill1 = await GameConfig.chargerModeleDAE('../src/medias/models/Villagers/dys_guest_boy01.dae');
        }else{
          /*----------Chargement du modèle 3D----------*/
          vill1 = await GameConfig.chargerModeleDAE('../src/medias/models/Villagers/dys_guest_girl01.dae');
        }
        const vill1Space = vill1.scene;
        vill1Space.scale.set(0.15,0.15,0.15);
        vill1Space.rotation.x = 0;
        vill1Space.position.y = -1;
        Player.spaceship.add(vill1Space);
        return Player.spaceship;
    }

    //Permet la création des bunkers
    static async createBunker(){
        let bunker = new THREE.Group();
        for(let i = 0 ; i < 4; i++){
          /*----------Chargement du modèle 3D----------*/
            const stone = await GameConfig.chargerModeleGLTF('../src/medias/models/Stone/stone.gltf');
            const stoneBunk = stone.scene;
            stoneBunk.position.x = (i%4 - ((4-3)/2)) * 5;
            stoneBunk.scale.set(0.7,0.7,0.7);
            bunker.add(stoneBunk);
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
        /*----------Chargement du modèle 3D----------*/
        const loadedData4 = await GameConfig.chargerModeleDAE('../src/medias/models/Bell_bag/Bell_Bag.dae');
        Player.missile = new THREE.Mesh(geometry, material);
        const geoMissile = loadedData4.scene;
        geoMissile.scale.set(0.08,0.08,0.08);
        Player.missile.add(geoMissile);
        Player.missile.visible = false;
        return Player.missile;
    }

    //Permet le mouvement du missile du joueur sur l'axe z
    //Si celui-ci dépasse la zone il disparait et revient à sa position initiale
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
        if(GameConfig.keyboard.pressed("right")){
            if(Player.spaceship.position.x - 1.5 > -14){
                Player.spaceship.position.x -= 4 * step;
            }
            if(!GameConfig.lockCam){
              camera.position.set(Player.spaceship.position.x, 2.5, -2);
              controls.target = new THREE.Vector3(Player.spaceship.position.x, 0, 20);
            }
        }
        if(GameConfig.keyboard.pressed("left")){
            if(Player.spaceship.position.x + 1.5 < 14){
                Player.spaceship.position.x += 4 * step;
            }
          if(!GameConfig.lockCam){
            camera.position.set(Player.spaceship.position.x, 2.5, -2);
            controls.target = new THREE.Vector3(Player.spaceship.position.x, 0, 20);
          }
        }
        if(GameConfig.keyboard.pressed("space")){
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
          Alien.alienTab.splice(Alien.alienTab.indexOf(intersect[0].object),1);
          aliens.remove(intersect[0].object);
          Player.missile.visible = false;
          //Son de l'alien
          if(!Sound.boolSound){
            Sound.alienSound(aliens);
          }
          //Fumée de l'alien
          Alien.loadSmokeEffect();
          GameConfig.scoreTotal += intersect[0].object.position.z * 10 + 10;
          //Affichage du score en 3D
          document.getElementById('score').innerHTML = "Score: " + GameConfig.scoreTotal;
          let score3D = intersect[0].object.position.z * 10 + 10;
          let convertScore3D = score3D.toString();
          GameConfig.scoreTouchAlien("+" + convertScore3D);
          this.setMissileActive(false);
        }
    }

    //Permet au joueur de toucher les bunker
    playerTouchBunk = () =>{
        var ray = new THREE.Raycaster();
        var vect = new THREE.Vector3(0, 2, 1);
        vect.normalize();
        ray.set(Player.missile.position, vect);
        //Calcule les objets coupant le rayon de prélèvement
        var intersect = ray.intersectObjects(Player.bunkerTab, true);
        if(intersect.length > 0){
          if(intersect[0].object.material.opacity != 0){
            intersect[0].object.material.opacity -= 0.5; //On réduit l'opacité des bunkers dès qu'un alien le touche
            if(intersect[0].object.material.opacity <= 0){ //Si l'opacité est en dessous de 0 on supprime visuellement les bunkers de la scene
              intersect[0].object.visible = false;
            }
          }
        }
    }

    //Permet au joueur de toucher l'alien bonus (rend invinsible)
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
        Player.setInvincible(true);
        //Alerte à droite de l'écran qui annonce le mode invincible ou non
        let alert = document.getElementsByClassName('alert');
        alert[0].classList.remove('hide');
        alert[0].classList.add('show');
        alert[0].style.opacity = 1;
        document.getElementsByClassName('msg')[0].innerHTML = "Mode invincible";
        setTimeout(() => {
          alert[0].classList.remove('show');
          alert[0].classList.add('hide');
        }, 5000);
        setTimeout(() => {
          Player.setInvincible(false);
          let alert = document.getElementsByClassName('alert');
          alert[0].classList.remove('hide');
          alert[0].classList.add('show');
          alert[0].style.opacity = 1;
          document.getElementsByClassName('msg')[0].innerHTML = "Mode normal";
          setTimeout(() => {
            alert[0].classList.remove('show');
            alert[0].classList.add('hide');
          }, 5000);
        }, 10000);
      }
    }
    
}