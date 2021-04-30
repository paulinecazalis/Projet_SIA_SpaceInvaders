
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://threejs.org/examples/jsm/libs/stats.module.js';
import { EffectComposer } from 'https://threejs.org/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://threejs.org/examples/jsm/postprocessing/RenderPass.js';

import Menu from '../js/menu.js';
import Player from './player.js';
import Alien from '../js/alien.js';
import Level from '../js/level.js';
import Sound from '../js/sound.js';
import Decor from '../js/decor.js';
import GameConfig from '../js/gameConfig.js';

/*----------------------------Fichier principal du jeu----------------------------*/

let container, w, h, camera, controls, renderer, stats, light;
let loop = {}; // info de la boucle du jeu

//Variables pour la gestion des aliens
let aliens;
let aliensBonus;

//variables pour le missile du joueur
let missileJoueur;

//variables pour les bunkers
let bunkers;

let joueur = new Player();

//variable pour le menu
let menu = new Menu();

window.addEventListener('load', go);
window.addEventListener('resize', resize);

function go() {
  menu.loadMenu(); //Chargement du menu
  Sound.volumeMusic(); //Chargement de la musique du jeu
  Sound.volumeSound(); //Chargement des sons du jeu
  init();
  gameLoop();
}

async function init() {
  container = document.querySelector('#SIApp');
  w = container.clientWidth;
  h = container.clientHeight;

  camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 100);
  camera.position.set(0, 8, -10);
  camera.add( Sound.listener );

  controls = new OrbitControls(camera, container);
  controls.target = new THREE.Vector3(0, 0, 20);
  controls.panSpeed = 0.3;
  controls.enabled = false;

  const renderConfig = {antialias: true, alpha: true};
  renderer = new THREE.WebGLRenderer(renderConfig);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h);
  container.appendChild(renderer.domElement);

  stats = new Stats();
  stats.domElement.style.removeProperty('top');
  stats.domElement.style.bottom = '0px';
  document.body.appendChild( stats.domElement );

  /*----------Lumière du jeu----------*/
  light = new THREE.AmbientLight( 0xFFFFFF);
  GameConfig.scene.add(light);

  light = new THREE.SpotLight(0xffa95c, 2);
  light.position.set(-50,50,50);
  light.castShadow = true;
  GameConfig.scene.add( light );

  /*----------Chargement des modèles 3D----------*/
  await Player.createBunker().then((value) => {
    bunkers = value;
    GameConfig.scene.add(value);
  })

  await Player.createMissilePlayer().then((value) => {
    missileJoueur = value;
    GameConfig.scene.add(value);
  });

  await Alien.createAlien(6, 30).then((value) => {
    aliens = value;
    GameConfig.scene.add(value);
  });
  
  await Alien.createAlienBonus().then((value) => {
    aliensBonus = value;
    GameConfig.scene.add(value);
  });
  
  await Alien.createMissileAliens().then((value) => {
    GameConfig.scene.add(value);
  });

  /*----------Création du décor arrière (background, batiments)----------*/
  let background = Decor.createBackground('../src/medias/images/skybox/ile/');
  GameConfig.scene.background = background;
  let ground = Decor.createGround('../src/medias/images/herbe.png');
  GameConfig.scene.add(ground);
  Decor.chooseBackground();

  await Decor.createTown().then((value) =>{
    GameConfig.scene.add(value);
  })

  await Decor.createTreeTown().then((value) =>{
    GameConfig.scene.add(value);
  })

  await Decor.nookShop().then((value) =>{
    GameConfig.scene.add(value);
  })

  //Chargement du menu option dans le menu principal
  menu.optionMenu();

  triche(); //Fonction pour les touches de triche
  pauseMenu(); //Fonction pour le menu pause
  helpKey(); //Fonction pour le menu help
  postproKey(); //Fonction pour l'activation ou la désactivation de l'effet de post-processing

  /*----------Chargement des sons----------*/
  Sound.audioLoader();
  Sound.sliderVolumeAlien();
  Sound.sliderVolumeLives();

  /*----------Chargement pour l'effet de post-processing----------*/
  GameConfig.composer = new EffectComposer( renderer );
  GameConfig.composer.addPass( new RenderPass( GameConfig.scene, camera ) );

  /*----------Affichage du score en 3D à côté des aliens----------*/
  GameConfig.scene.add(GameConfig.scoreGroup);

  const fps  = 30;
  const slow = 1; // slow motion! 1: normal speed, 2: half speed...
  loop.dt       = 0,
  loop.now      = timestamp();
  loop.last     = loop.now;
  loop.fps      = fps;
  loop.step     = 1/loop.fps;
  loop.slow     = slow;
  loop.slowStep = loop.slow * loop.step;

}

function gameLoop() {
  // gestion de l'incrément du temps
  loop.now = timestamp();
  loop.dt = loop.dt + Math.min(1, (loop.now - loop.last) / 1000);
  while(loop.dt > loop.slowStep) {
    loop.dt = loop.dt - loop.slowStep;
    update(loop.step); // déplace les objets d'une fraction de seconde
    GameConfig.composer.render(); //Effet de post-processing dans le rendu de la scène
  }
  //renderer.render(scene, camera);  // rendu de la scène
  loop.last = loop.now;

  requestAnimationFrame(gameLoop); // relance la boucle du jeu

  controls.update();
  stats.update();
}

function update(step) {
  if(!Menu.isActive()){
    GameConfig.cameraBind(camera, controls, GameConfig.spaceshipObject);
    if(!GameConfig.isPartieActive() && !GameConfig.isPauseGame()){
      joueur.moveSpaceShip(step, camera, controls, aliens);
      Alien.moveAlien(aliens);
      if(Alien.isPositionAliensBonus() && aliensBonus != undefined){
        Alien.moveAlienBonus(aliensBonus, GameConfig.scene);
      }
      if(joueur.isMissileActive()){
        playerShoot();
      }
      if(Alien.isMissileAliensTire()){
        aliensShoot();
      }else{
       Alien.aliensAttack(aliens);
      }
    }
  }
}

function resize() {
  w = container.clientWidth;
  h = container.clientHeight;
  camera.aspect = w/h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function timestamp() {
  return window.performance.now();
}

//Permet de supprimer de la scène les différents modèlès 3D...
function removeScene(){
  GameConfig.scene.remove(aliens);
  Alien.alienTab.length = 0;
  GameConfig.scene.remove(aliensBonus);
  Alien.alienBonusTab.length = 0;
  Alien.setPositionAliensBonus(false);
  Alien.setMissileAliensTire(false);
  Alien._missileAliens.visible = false;
  Player.bunkerTab.length = 0;
  GameConfig.scene.remove(missileJoueur);
  joueur.setMissileActive(false);
  GameConfig.scene.remove(bunkers);
  GameConfig.scene.remove(GameConfig.spaceshipObject);
  GameConfig.composer.removePass(GameConfig.glitchPass);
  GameConfig.setPartieActive(true);
  clearTimeout(Alien.timeoutpos);
  clearTimeout(Alien.timeouttouch);
}

//Permet de gérer les fonctions du joueur
function playerShoot(){
  joueur.moveMissilePlayer();
  joueur.playerTouchBunk();
  joueur.touchAliens(aliens);
  joueur.touchAlienBonus();
  if(Alien.alienTab.length == 0){ //Si il n'y a plus d'aliens sur la scène
    removeScene();
    Level.level++;
    document.getElementById('level').innerHTML = "Level: " + Level.level;
    Level.changementLevel(Level.level);
    newGameAlien();
  }
}

//Permet de gérer les fonctions des aliens
function aliensShoot(){
  Alien.moveMissileAliens();
  Alien.aliensTouchBunk();
  Player.nbLives = Alien.aliensTouchSpaceship(GameConfig.spaceshipObject, Player.nbLives);
  if(Player.nbLives == 0){ //Si le joueur n'a plus de vies
    removeScene();
    Level.gameOver("Game Over !", camera, controls);
    Player.nbLives = 3;
    newGameLoose();
    Level.level = 1;
  }
  else if(aliens.position.z == GameConfig.spaceshipObject.position.z){ //Si les aliens atteignent le joueur
    removeScene();
    GameConfig.setPartieActive(true);
    Level.gameOver("Game Over !");
  }
}

//Permet l'activation ou la désactivation des touches de triche
function triche(){
  document.addEventListener('keydown', (e) => {
    if(e.key == "k" || e.key == 'K'){
      if(Level.isActive()){
        removeScene();
        Level.level++;
        document.getElementById('level').innerHTML = "Level: " + Level.level;
        Level.changementLevel(Level.level);
        newGameAlien();
      }
    }
    if(e.key == "i" || e.key == 'I'){
      Player.setInvincible(!Player.invincible);
      if(Player.invincible){
        document.getElementById('invincible').innerHTML = "Invincible: oui";
        let alert = document.getElementsByClassName('alert');
        alert[0].classList.remove('hide');
        alert[0].classList.add('show');
        alert[0].style.opacity = 1;
        document.getElementsByClassName('msg')[0].innerHTML = "Mode invincible";
        setTimeout(() => {
          alert[0].classList.remove('show');
          alert[0].classList.add('hide');
        }, 5000);
        Sound.audioLives.pause();
      }else{
        document.getElementById('invincible').innerHTML = "Invincible: non";
        let alert = document.getElementsByClassName('alert');
        alert[0].classList.remove('hide');
        alert[0].classList.add('show');
        alert[0].style.opacity = 1;
        document.getElementsByClassName('msg')[0].innerHTML = "Mode normal";
        setTimeout(() => {
          alert[0].classList.remove('show');
          alert[0].classList.add('hide');
        }, 5000);
      }
    }
  });
}

//Créer une nouvelle vague d'alien + reset position spaceship + enlève triche et affiche bandeau niveau
async function newGameAlien(){
  GameConfig.spaceshipObject.position.x = 0;
  await Player.createBunker().then((value) => {
    bunkers = value;
    GameConfig.scene.add(value);
  })
  await Alien.createAlien(6, 30).then((value) => {
    aliens = value;
    GameConfig.scene.add(value);
  });
  await Player.createMissilePlayer().then((value) => {
    missileJoueur = value;
    GameConfig.scene.add(value);
  });
  await Alien.createAlienBonus().then((value) => {
    aliensBonus = value;
    GameConfig.scene.add(value);
  });
  await Player.createSpaceship().then((value) =>{
    GameConfig.spaceshipObject = value;
    GameConfig.scene.add(value);
  });
  Alien.setPositionAliensBonus(true);
  clearTimeout(Alien.timeoutpos);
  clearTimeout(Alien.timeouttouch);
  GameConfig.setPartieActive(false);
  Player.setInvincible(false);
  document.getElementById('invincible').innerHTML = "Invincible: " + Player.invincible;
  Menu.setActive(true);
  setTimeout(() => {
    Menu.setActive(false);
  }, 3000);
}

//Permet de réinitialiser la scene si la partie est perdue
async function newGameLoose(){
  GameConfig.spaceshipObject.position.x = 0;
  await Player.createBunker().then((value) => {
    bunkers = value;
    GameConfig.scene.add(value);
  })
  await Alien.createAlien(6, 30).then((value) => {
    aliens = value;
    GameConfig.scene.add(value);
  });
  await Player.createMissilePlayer().then((value) => {
    missileJoueur = value;
    GameConfig.scene.add(value);
  });
  await Alien.createAlienBonus().then((value) => {
    aliensBonus = value;
    GameConfig.scene.add(value);
  });
  Player.setInvincible(false);
  Alien.setPositionAliensBonus(true);
}

//Permet d'afficher le menu pause du jeu 
function pauseMenu(){
  document.addEventListener('keydown', (e) => {
    if(e.key == "Escape"){
      if(Level.isActive() && !Menu.isActive()){
        GameConfig.setPauseGame(!GameConfig.pause);
        if(GameConfig.pause){
          document.getElementById('pause').style.display = 'block';
          //Bouton pour continuer la partie
          document.getElementById('continuer').onclick = () =>{
            document.getElementById('pause').style.display = 'none';
            GameConfig.setPauseGame(false);
          };
          //Bouton pour recommencer la partie
          document.getElementById('recom').onclick = () =>{
            document.getElementById('recom-alert').style.display = "block";
            document.getElementById('recom-non').onclick = () =>{
              document.getElementById('recom-alert').style.display = "none";
            }
            document.getElementById('recom-oui').onclick = () =>{
              document.getElementById('recom-alert').style.display = "none";
              document.getElementById('pause').style.display = 'none';
              removeScene();
              Player.nbLives = 3;
              GameConfig.resetLives();
              Level.level = 1;
              document.getElementById('level').innerHTML = "Level: " + Level.level;
              menu.createTransition("Level "+ Level.level, 3000);
              Alien.vitesseAliens = 0.05;
              Alien.vitesseMissileAlien = 0.1;
              GameConfig.scoreTotal = 0;
              newGameAlien();
              GameConfig.setPauseGame(false);
              camera.position.set(0, 8, -10);
              controls.target = new THREE.Vector3(0, 0, 20);
            }
          };
          //Bouton pour quitter la partie
          document.getElementById('quit').onclick = () =>{
            document.getElementById('pause').style.display = 'none';
            document.getElementById('score-level').style.display = "none";
            document.getElementById('game-element').style.visibility = "hidden";
            document.getElementById('lives').style.display = "none";
            document.getElementById('help-commande').style.visibility = "hidden";
            document.getElementById('camera').style.visibility = "hidden";
            let menu = new Menu();
            menu.loadMenu();
            removeScene();
            Player.nbLives = 3;
            newGameLoose();
            Level.level = 1;
            Alien.vitesseAliens = Level.level/30;
            Alien.vitesseMissileAlien = Level.level/10;
            GameConfig.scoreTotal = 0;
            GameConfig.setPauseGame(false);
            camera.position.set(0, 8, -10);
            controls.target = new THREE.Vector3(0, 0, 20);
          };
        }else{
          document.getElementById('pause').style.display = 'none';
        }
      }
    }
  });
}

//Permet d'afficher les commandes d'aide au joueur
function helpKey(){
  let help = false;
  document.addEventListener('keydown', (e) => {
      if(e.key == "h" || e.key == "H"){
          help = !help;
          if(help){
              document.getElementById('help-commande').style.visibility = "hidden";
              document.getElementById('camera').style.visibility = "hidden";
          }else{
              document.getElementById('help-commande').style.visibility = "visible";
              document.getElementById('camera').style.visibility = "visible";
          }
      }
  })
}

//Permet d'activer ou désactiver l'effet de post-processing en appuyant sur la touche p
function postproKey(){
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


