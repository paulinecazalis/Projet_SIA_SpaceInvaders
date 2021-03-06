//import {three_axis} from '../../objects/axis.js';
//import {stade} from '../js/stade.js';
import * as THREE from '../lib/node_modules/three/build/three.module.js';
import { OrbitControls } from '../lib/node_modules/three/examples/jsm/controls/OrbitControls.js';
import Stats from '../lib/node_modules/three/examples/jsm/libs/stats.module.js';

import Menu from '../js/menu.js';
import PlayerClass from '../js/playerClass.js';
import Alien from '../js/alienClass.js';
import Level from '../js/level.js';
import Sound from '../js/sound.js';
import NewGame from '../js/newGame.js'


import {stade} from '../js/decor.js';


//import essai from './essai.js';

let container, w, h, scene, camera, controls, renderer, stats, light;
let loop = {}; // info de la boucle du jeu
let axis, grid

//camera
let lockCam = true;

//variables pour les aliens
let aliens;
let aliensObject;

//variables pour le vaisseau
let spaceship;
let spaceshipObject;
let nbLives = 3;

//variables pour le missile
let missileObject;

//variables pour les bunkers
let bunkObject;
let bunkTab = [];

let element = new PlayerClass();
let alienElement = new Alien();
//Variables pour la partie
//let partieFinie = false;

//variable menu
let menu;

//variable pour les niveaux
let lvl;
//let level = new Level();
let nbLevel = 1;

let keyboard = new THREEx.KeyboardState();

window.addEventListener('load', go);
window.addEventListener('resize', resize);

function go() {
  menu = new Menu();
  menu.loadMenu();
  Sound.volumeMusic();
  init();
  gameLoop();
}

async function init() {
  container = document.querySelector('#SIApp');
  w = container.clientWidth;
  h = container.clientHeight;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 100);
  camera.position.set(0, 8, -20);
  camera.add( Sound.listener );

  controls = new OrbitControls(camera, container);
  controls.target = new THREE.Vector3(0, 0, 0);
  controls.panSpeed = 0.3;

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

  grid = new THREE.GridHelper( 100, 100 );
  scene.add(grid);

  /*axis = three_axis;
  scene.add(axis);*/
  light = new THREE.AmbientLight( 0xFFFFFF);
  scene.add(light);

  //Background scene
  const path = '../src/medias/images/skybox/penguins/';
  const format = '.png';
  const urls = [
    path + 'indigo_ft' + format, path + 'indigo_bk' + format,
    path + 'indigo_up' + format, path + 'indigo_dn' + format,
    path + 'indigo_rt' + format, path + 'indigo_lf' + format,
  ];

  const reflectionCube = new THREE.CubeTextureLoader().load( urls );
  const refractionCube = new THREE.CubeTextureLoader().load( urls );
  refractionCube.mapping = THREE.CubeRefractionMapping;

  scene.background = reflectionCube;

  /*spaceshipObject = element.createSpaceship();
  scene.add(spaceshipObject);*/
  await element.createSpaceship().then((value) =>{
    spaceshipObject = value;
    scene.add(value);
  })
  light = new THREE.DirectionalLight( 0xFFFFFF, 1 );
  light.position.set( 10,10,10 ).normalize();
  scene.add(light);


  await PlayerClass.createBunker().then((value) => {
    bunkObject = value;
    scene.add(value);
  })

  /*bunkObject = element.createBunker();
  scene.add(bunkObject);*/
  
  initBunkTab();

  await element.createMissilePlayer().then((value) => {
    missileObject = value;
    scene.add(value);
  });

  await Alien.createAlien(6, 30).then((value) => {
    aliens = value;
    scene.add(value);
  });


  //scene.add(Alien.createMissileAliens());
  await Alien.createMissileAliens().then((value) => {
    scene.add(value);
  });

  scene.add(stade);

  const dir = new THREE.Vector3( 0, 0.5, 1 );

  //normalize the direction vector (convert to vector of length 1)
  dir.normalize();

  const origin = new THREE.Vector3( 0, 0, 0 );
  const length = 1;
  const hex = 0xffff00;

  const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
  scene.add( arrowHelper );
  triche();

  Sound.audioLoader();
  
  

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
  }
  renderer.render(scene, camera);  // rendu de la scène
  loop.last = loop.now;

  requestAnimationFrame(gameLoop); // relance la boucle du jeu

  controls.update();
  stats.update();
}

function update(step) {
  if(!menu.isActive()){
    element.cameraBind(camera, controls, spaceshipObject);
    if(!Level.isPartieActive()){
      element.moveSpaceShip(step, camera, controls);
      Alien.moveAlien(step, aliens);
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

function initBunkTab(){
  for(let i = 0; i < bunkObject.children.length; i++){
    bunkTab.push(bunkObject.children[i]);
  }
}


function playerShoot(){
  element.moveMissilePlayer();
  element.playerTouchBunk(bunkTab);
  element.touchAliens(Alien._alienTab, aliens);
  if(Alien._alienTab == 0){
    scene.remove(aliens);
    Alien._alienTab.length = 0;
    Alien.setMissileAliensTire(false);
    Alien._missileAliens.visible = false;
    bunkTab.length = 0;
    scene.remove(bunkObject);
    Level.setPartieActive(true);
    nbLevel++;
    Level.changementLevel(nbLevel);
    newGame();
  }
}

function aliensShoot(){
  Alien.moveMissileAliens();
  Alien.aliensTouchBunk(bunkTab);
  nbLives = Alien.aliensTouchSpaceship(spaceshipObject, nbLives);
  if(nbLives == 0){
    console.log('les aliens ont gagnés');
    Level.setPartieActive(true);
    scene.remove(aliens);
    Alien._alienTab.length = 0;
    Alien.setMissileAliensTire(false);
    Alien._missileAliens.visible = false;
    bunkTab.length = 0;
    scene.remove(bunkObject);
    Level.gameOver("Game Over !");
    nbLives = 3;
    //console.log(aliens.length);
    newGameMenu();
  }
  else if(aliens.position.z == spaceshipObject.position.z){
    console.log('les aliens ont gagnés(raquette)');
    Level.setPartieActive(true);
    //Level.gameOver("Game Over !");
  }
}

function triche(){
  document.addEventListener('keydown', (e) => {
    if(e.key == "k" || e.key == 'K'){
      scene.remove(aliens);
      Alien._alienTab.length = 0;
      Alien.setMissileAliensTire(false);
      Alien._missileAliens.visible = false;
      bunkTab.length = 0;
      scene.remove(bunkObject);
      Level.setPartieActive(true);
      nbLevel++;
      Level.changementLevel(nbLevel);
      newGame();
    }
  });
}


async function newGame(){
  spaceshipObject.position.x = 0;
  await PlayerClass.createBunker().then((value) => {
    bunkObject = value;
    scene.add(value);
  })
  //scene.add(bunkObject);
  initBunkTab();
  await Alien.createAlien(6, 30).then((value) => {
    aliens = value;
    scene.add(value);
  });
  Level.setPartieActive(false);
  menu.setActive(true);
  setTimeout(() => {
    menu.setActive(false);
  }, 3000);
}

async function newGameMenu(){
  spaceshipObject.position.x = 0;
  await PlayerClass.createBunker().then((value) => {
    bunkObject = value;
    scene.add(value);
  })
  //scene.add(bunkObject);
  initBunkTab();
  await Alien.createAlien(6, 30).then((value) => {
    aliens = value;
    scene.add(value);
  });
}


