//import {three_axis} from '../../objects/axis.js';
//import {stade} from '../js/stade.js';
import * as THREE from '../lib/node_modules/three/build/three.module.js';
import { OrbitControls } from '../lib/node_modules/three/examples/jsm/controls/OrbitControls.js';
import Stats from '../lib/node_modules/three/examples/jsm/libs/stats.module.js';
import { EffectComposer } from '../lib/node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../lib/node_modules/three/examples/jsm/postprocessing/RenderPass.js';

import Menu from '../js/menu.js';
import Player from './player.js';
import Alien from '../js/alien.js';
import Level from '../js/level.js';
import Sound from '../js/sound.js';
import gameConfig from '../js/gameConfig.js';
import Decor from '../js/decor.js';


//import {stade} from '../js/decor.js';


//import essai from './essai.js';

let container, w, h, scene, camera, controls, renderer, stats, light;
let loop = {}; // info de la boucle du jeu
let axis, grid

//variables pour les aliens
let aliens;
let aliensBonus;
let aliensObject;

//variables pour le vaisseau
let spaceship;
let spaceshipObject;
let nbLives = 3;

//variables pour le missile
let missileObject;

//variables pour les bunkers
let bunkObject;

let element = new Player();
//let alienElement = new Alien();
//Variables pour la partie
//let partieFinie = false;

//variable menu
let menu = new Menu();

//variable pour les niveaux
let lvl;

let composer;
let glitchPass;

window.addEventListener('load', go);
window.addEventListener('resize', resize);

function go() {
  menu.loadMenu();
  Sound.volumeMusic();
  //Sound.boolSound = !Sound.boolSound;
  Sound.volumeSound();
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
  //renderer.sortObjects = false;
  container.appendChild(renderer.domElement);

  // add Stats.js - https://github.com/mrdoob/stats.js
  stats = new Stats();
  stats.domElement.style.removeProperty('top');
  stats.domElement.style.bottom = '0px';
  document.body.appendChild( stats.domElement );

  /*grid = new THREE.GridHelper( 100, 100 );
  scene.add(grid);*/

  /*axis = three_axis;
  scene.add(axis);*/
  light = new THREE.AmbientLight( 0xFFFFFF);
  gameConfig.scene.add(light);

  //Background scene
  const path = '../src/medias/images/Standard-Cube-Map2/';
  const format = '.png';
  const urls = [
    path + 'px' + format, path + 'nx' + format,
    path + 'py' + format, path + 'ny' + format,
    path + 'pz' + format, path + 'nz' + format,
  ];

  const reflectionCube = new THREE.CubeTextureLoader().load( urls );
  const refractionCube = new THREE.CubeTextureLoader().load( urls );
  refractionCube.mapping = THREE.CubeRefractionMapping;
  gameConfig.scene.background = reflectionCube;

  //gameConfig.loadSmokeEffect(gameConfig.scene);

  /*spaceshipObject = element.createSpaceship();
  scene.add(spaceshipObject);*/
  
  /*await Player.createSpaceship().then((value) =>{
    spaceshipObject = value;
    scene.add(value);
  })*/
  /*light = new THREE.DirectionalLight( 0xFFFFFF, 1 );
  light.position.set( 10,10,10 ).normalize();
  scene.add(light);*/

  /*let hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
  scene.add(hemiLight);*/

  /*document.getElementById('jouer-menu-perso').onclick = () =>{
    menu.createTransition("Level "+ gameConfig.level, 3000);
    document.getElementById('menu-personnage').style.display = "none";
    gameConfig.loadSpaceshipMenu(scene)
  }*/


  light = new THREE.SpotLight(0xffa95c, 2);
  light.position.set(-50,50,50);
  light.castShadow = true;
  gameConfig.scene.add( light );


  await Player.createBunker().then((value) => {
    bunkObject = value;
    gameConfig.scene.add(value);
  })

  /*bunkObject = element.createBunker();
  scene.add(bunkObject);*/

  await Player.createMissilePlayer().then((value) => {
    missileObject = value;
    gameConfig.scene.add(value);
  });

  await Alien.createAlien(6, 30).then((value) => {
    aliens = value;
    gameConfig.scene.add(value);
  });
  
  await Alien.createAlienBonus().then((value) => {
    setTimeout(() => {
      aliensBonus = value;
      gameConfig.scene.add(value);
    }, 20000);
  });


  //scene.add(Alien.createMissileAliens());
  await Alien.createMissileAliens().then((value) => {
    gameConfig.scene.add(value);
  });

  //scene.add(stade);
  let ground = Decor.createGround();
  gameConfig.scene.add(ground);

  let groundTownHall = Decor.createGroundTownHall();
  gameConfig.scene.add(groundTownHall);

  await Decor.createTree().then((value) =>{
    gameConfig.scene.add(value);
  })

  await Decor.createTown().then((value) =>{
    gameConfig.scene.add(value);
  })

  await Decor.createHouse().then((value) =>{
    gameConfig.scene.add(value);
  })

  await Decor.createTreeTown().then((value) =>{
    gameConfig.scene.add(value);
  })

  await Decor.nookShop().then((value) =>{
    gameConfig.scene.add(value);
  })


  const dir = new THREE.Vector3( 0, 0.5, 1 );

  //normalize the direction vector (convert to vector of length 1)
  dir.normalize();

  const origin = new THREE.Vector3( 0, 0.5, 1 );
  const length = 1;
  const hex = 0xffff00;

  const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
  gameConfig.scene.add( arrowHelper );
  triche();
  pauseMenu();
  gameConfig.helpKey();

  Sound.audioLoader();
  

  // postprocessing pour epileptique
  //Alien.postProcessing(renderer,scene,camera);
  Alien.composer = new EffectComposer( renderer );
  Alien.composer.addPass( new RenderPass( gameConfig.scene, camera ) );


  gameConfig.scene.add(Player.scoreGroup);


  
  

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
    Alien.composer.render();
    //gameConfig.evolveSmoke();
  }
  //renderer.render(scene, camera);  // rendu de la scène
  loop.last = loop.now;

  requestAnimationFrame(gameLoop); // relance la boucle du jeu

  controls.update();
  stats.update();
}

function update(step) {
  if(!Menu.isActive()){
    gameConfig.cameraBind(camera, controls, gameConfig.spaceshipObject);
    if(!gameConfig.isPartieActive() && !gameConfig.isPauseGame()){
      element.moveSpaceShip(step, camera, controls, aliens);
      Alien.moveAlien(aliens);
      if(Alien.isPositionAliensBonus() && aliensBonus != undefined){
        Alien.moveAlienBonus(aliensBonus, gameConfig.scene);
      }
      if(element.isMissileActive()){
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

function removeScene(){
  gameConfig.scene.remove(aliens);
  Alien.alienTab.length = 0;
  gameConfig.scene.remove(aliensBonus);
  Alien.alienBonusTab.length = 0;
  Alien.setMissileAliensTire(false);
  Alien._missileAliens.visible = false;
  Player.bunkerTab.length = 0;
  gameConfig.scene.remove(missileObject);
  gameConfig.scene.remove(bunkObject);
  gameConfig.setPartieActive(true);
}


function playerShoot(){
  element.moveMissilePlayer();
  element.playerTouchBunk();
  element.touchAliens(aliens);
  element.touchAlienBonus();
  if(Alien.alienTab == 0){
    removeScene();
    gameConfig.level++;
    document.getElementById('level').innerHTML = "Level: " + gameConfig.level;
    Level.changementLevel(gameConfig.level);
    newGameAlien();
  }
}

function aliensShoot(){
  Alien.moveMissileAliens();
  Alien.aliensTouchBunk();
  nbLives = Alien.aliensTouchSpaceship(gameConfig.spaceshipObject, nbLives,renderer,gameConfig.scene,camera);
  if(nbLives == 0){
    console.log('les aliens ont gagnés');
    removeScene();
    Level.gameOver("Game Over !");
    nbLives = 3;
    newGameLoose();
    gameConfig.level = 1;
  }
  else if(aliens.position.z == gameConfig.spaceshipObject.position.z){
    console.log('les aliens ont gagnés(raquette)');
    gameConfig.setPartieActive(true);
    //Level.gameOver("Game Over !");
  }
}

function triche(){
  document.addEventListener('keydown', (e) => {
    if(e.key == "k" || e.key == 'K'){
      console.log(Level.isActive());
      if(Level.isActive()){
        removeScene();
        gameConfig.level++;
        document.getElementById('level').innerHTML = "Level: " + gameConfig.level;
        Level.changementLevel(gameConfig.level);
        newGameAlien();
      }
    }
    if(e.key == "i" || e.key == 'I'){
      console.log('mode invincible');
      gameConfig.setInvincible(!gameConfig.invincible);
      Sound.boolSound = !Sound.boolSound;
      if(gameConfig.invincible){
        if(Sound.boolSound){
          Sound.audioLives.pause();
          document.getElementById('invincible').innerHTML = "Invincible: oui";
        }else{
          Sound.audioLives.play();
        }
      }else{
        document.getElementById('invincible').innerHTML = "Invincible: non";
      }
    }
  });
}

//Créer une nouvelle vague d'alien + reset position spaceship + enlève triche et affiche bandeau niveau
async function newGameAlien(){
  gameConfig.spaceshipObject.position.x = 0;
  await Player.createBunker().then((value) => {
    bunkObject = value;
    gameConfig.scene.add(value);
  })
  await Alien.createAlien(6, 30).then((value) => {
    aliens = value;
    gameConfig.scene.add(value);
  });
  await Player.createMissilePlayer().then((value) => {
    missileObject = value;
    gameConfig.scene.add(value);
  });
  /*await Alien.createAlienBonus().then((value) => {
    aliensBonus = value;
    scene.add(value);
  });*/
  gameConfig.setPartieActive(false);
  gameConfig.setInvincible(false);
  document.getElementById('invincible').innerHTML = "Invincible: " + gameConfig.invincible;
  Menu.setActive(true);
  setTimeout(() => {
    Menu.setActive(false);
  }, 3000);
}

//Permet de réinitialiser la scene si la partie est perdue
async function newGameLoose(){
  gameConfig.spaceshipObject.position.x = 0;
  await Player.createBunker().then((value) => {
    bunkObject = value;
    gameConfig.scene.add(value);
  })
  await Alien.createAlien(6, 30).then((value) => {
    aliens = value;
    gameConfig.scene.add(value);
  });
  await Player.createMissilePlayer().then((value) => {
    missileObject = value;
    gameConfig.scene.add(value);
  });
  /*await Alien.createAlienBonus().then((value) => {
    aliensBonus = value;
    scene.add(value);
  });*/
  gameConfig.setInvincible(false);
}

//Menu Pause 
function pauseMenu(){
  document.addEventListener('keydown', (e) => {
    if(e.key == "Escape"){
      if(Level.isActive() && !Menu.isActive()){
        gameConfig.setPauseGame(!gameConfig.pause);
        if(gameConfig.pause){
          document.getElementById('pause').style.display = 'block';

          document.getElementById('continuer').onclick = () =>{
            document.getElementById('pause').style.display = 'none';
            gameConfig.setPauseGame(false);
          };

          document.getElementById('recom').onclick = () =>{
            //document.getElementById('pause').style.display = 'none';
            document.getElementById('recom-alert').style.display = "block";
            document.getElementById('recom-non').onclick = () =>{
              document.getElementById('recom-alert').style.display = "none";
            }
            document.getElementById('recom-oui').onclick = () =>{
              document.getElementById('recom-alert').style.display = "none";
              document.getElementById('pause').style.display = 'none';
              removeScene();
              gameConfig.resetLives();
              gameConfig.level = 1;
              Level.changementLevel(gameConfig.level);
              gameConfig.scoreTotal = 0;
              newGameAlien();
              gameConfig.setPauseGame(false);
            }
          };

          document.getElementById('quit').onclick = () =>{
            document.getElementById('pause').style.display = 'none';
            let menu = new Menu();
            menu.loadMenu();
            removeScene();
            nbLives = 3;
            newGameLoose();
            gameConfig.level = 1;
            gameConfig.vitesseAliens = gameConfig.level/20;
            gameConfig.vitesseMissileAlien = gameConfig.level/10;
            gameConfig.scoreTotal = 0;
            gameConfig.setPauseGame(false);
          };
        }else{
          document.getElementById('pause').style.display = 'none';
        }
      }
    }
  });
}


