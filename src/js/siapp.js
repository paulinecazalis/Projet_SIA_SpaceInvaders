import {three_axis} from '../../objects/axis.js';
//import {stade} from '../js/stade.js';

let container, w, h, scene, camera, controls, renderer, stats, light;
let loop = {}; // info de la boucle du jeu
let axis, grid
let keyboard = new THREEx.KeyboardState();

let geometry, material;

//camera
let lockCam = true;

//variables pour les aliens
let aliens;
let aliensColumns, aliensRows;
let posAlien = true; //position des aliens
let aliensSize;//taille en x, y, z
let alienTab = []; //contient le groupe d'alien dans un tableau
let missileAliens, missileAliensTire = false;
let cptAliens;
let nbLives = 3;

//variables pour le vaisseau
let spaceship;

//variables pour le missile
let missile;
let missileTire = false;
let vitesseMissAliens = 0.1;

//variables pour les bunkers
let bunk;
let bunkSize;
let bunkTab = [];

//Variables pour la partie
let partieFinie = false;

window.addEventListener('load', go);
window.addEventListener('resize', resize);

function createAlien(aliensColumns, nbAliens){
  cptAliens = nbAliens;
  let nbColumns = nbAliens/aliensColumns;
  aliens = new THREE.Group();
  for(let i = 0; i < nbAliens; i++){
    let posX, posZ;
    let nb = parseInt(i/aliensColumns);
    posZ = nb;
    posX = i%aliensColumns - ((aliensColumns-1)/2);
    /*if(nb == 0){
      let rounard;
      let loader = new THREE.ColladaLoader();
      loader.load('../src/medias/models/Crazy_Redd/Crazy_Redd.dae', (res) => {
        rounard = res.scene;
        rounard.scale.set(0.1,0.1,0.1);
        rounard.position.set( posX*2, 0, posZ*2 );
        rounard.rotation.z = 15.7;
        aliens.add(rounard);
        alienTab.push(rounard);
      });

    }else if(nb == 1){
      let tm;
      let loader = new THREE.ColladaLoader();
      loader.load('../src/medias/models/Timmy and Tommy/Timmy & Tommy Nook.dae', (res) => {
        tm = res.scene;
        tm.scale.set(0.1,0.1,0.1);
        tm.position.set( posX*2, 0, posZ*2 );
        tm.rotation.z = 15.7;
        aliens.add(tm);
        alienTab.push(tm);
      });
    }else{*/
      geometry = new THREE.BoxGeometry( 1, 1, 1 );
      material = new THREE.MeshLambertMaterial( {color: 0x00ff00, transparent : true, opacity: 1.0} );
      const cube = new THREE.Mesh( geometry, material );
      cube.position.set( posX*2, 0, posZ*2 );
      aliens.add(cube);
      alienTab.push(cube);
    //}
  }
  let xSize = aliensColumns * 2 - 1, ySize = 1, zSize = nbAliens / aliensColumns;
  aliensSize = {x: xSize, y: ySize, z: zSize};
  aliens.position.z = 10;
  scene.add(aliens);
}

function createMissileAliens(){
  geometry = new THREE.CubeGeometry(0.2,0.2,0.6);
  material = new THREE.MeshLambertMaterial( {color: 'rgb(255, 255, 0)'} );
  missileAliens = new THREE.Mesh(geometry, material);
  missileAliens.visible = false;
  scene.add(missileAliens);
}

function createSpaceship(){
  geometry = new THREE.BoxGeometry( 3, 0.8, 0.4 );
	material = new THREE.MeshLambertMaterial( {color: 0x660000} );
	spaceship = new THREE.Mesh( geometry, material );
	spaceship.position.y = 0;
  //raq1.rotation.x = THREE.Math.degToRad(-90
  spaceship.name = "spaceship";
  scene.add(spaceship);
}

function createBunker(){
  bunk = new THREE.Group();
  geometry = new THREE.BoxGeometry( 1, 1, 1 );
  material = new THREE.MeshLambertMaterial( {color: 'blue', transparent : true, opacity: 1.0} );
  const cubBunk = new THREE.Mesh( geometry, material );
  cubBunk.position.x = 4;
  bunk.add(cubBunk);

  geometry = new THREE.BoxGeometry( 1, 1, 1 );
  material = new THREE.MeshLambertMaterial( {color: 'blue', transparent : true, opacity: 1.0} );
  const cubBunk2 = new THREE.Mesh( geometry, material );
  cubBunk2.position.x = 0;
  bunk.add(cubBunk2);

  geometry = new THREE.BoxGeometry( 1, 1, 1 );
  material = new THREE.MeshLambertMaterial( {color: 'blue', transparent : true, opacity: 1.0} );
  const cubBunk3 = new THREE.Mesh( geometry, material );
  cubBunk3.position.x = -4;
  bunk.add(cubBunk3);
  bunk.position.z = 2;

  // 4 + 0,5 + 4 + 0,5
  let xSize = 9, ySize = 1, zSize = 1;
  bunkSize = {x: xSize, y: ySize, z: zSize};
  bunkTab.push(bunk);
  scene.add(bunk);
}

function go() {
  init();
  gameLoop();
}

function init() {
  container = document.querySelector('#SIApp');
  w = container.clientWidth;
  h = container.clientHeight;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 100);
  camera.position.set(0, 8, -20);

  controls = new THREE.OrbitControls(camera, container, container);
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
  stats.domElement.style.position	= 'absolute';
  stats.domElement.style.bottom	= '0px';
  stats.domElement.style.right = '0px';
  document.body.appendChild( stats.domElement );

  grid = new THREE.GridHelper( 100, 100 );
  scene.add(grid);

  /*axis = three_axis;
  scene.add(axis);*/

  light = new THREE.DirectionalLight( 0xFFFFFF, 0.8 );
  light.position.set( 10,10,-10 ).normalize();
  scene.add(light);

  light = new THREE.DirectionalLight( 0xFFFFFF, 0.8 );
  light.position.set( -10,10,-10 ).normalize();
  scene.add(light);

  //Création des aliens
  createAlien(6,12);

  //création du vaisseau
  createSpaceship();

  //création des bunkers
  createBunker();

  /*let rounard;

  let loader = new THREE.ColladaLoader();
  loader.load('../src/medias/models/Crazy_Redd/Crazy_Redd.dae', (res) => {
    rounard = res.scene;
    rounard.scale.set(0.3,0.3,0.3);
    rounard.rotation.z = 15.7;
    scene.add(rounard);
  });*/

  //Création du missile
  geometry = new THREE.CubeGeometry(0.2,0.2,0.6);
  material = new THREE.MeshLambertMaterial( {color: 'rgb(255, 255, 0)'} );
  missile = new THREE.Mesh(geometry, material);
  missile.visible = false;
  scene.add(missile);

  //Création du missile des aliens
  createMissileAliens();

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
  cameraBind();
  if(!partieFinie){
    moveSpaceShip();
    moveAlien();
    if(missileTire){
      moveMissile();
      touchBunker();
      touchAliens();
    }
    if(!missileAliensTire){
      aliensAttack();

    }else {
      moveMissileAliens();
      aliensTouchBunk();
      aliensTouchSpaceship();
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

function moveAlien(){
  if(posAlien){
    aliens.position.x += 0.1;
  }else{
    aliens.position.x -= 0.1;
  }

  if( aliens.position.x >= 10 || aliens.position.x <= -10){
    posAlien = !posAlien;
    aliens.position.z -= 1;
    finPartie();
  }

}

function moveSpaceShip(){
  if(keyboard.pressed("right")){
      spaceship.position.x -= 0.15;
      if(!lockCam){
        camera.position.set(spaceship.position.x, 1, -2);
        controls.target = new THREE.Vector3(spaceship.position.x, 0, 20);
      }
  }
  if(keyboard.pressed("left")){
    spaceship.position.x += 0.15;
    if(!lockCam){
      camera.position.set(spaceship.position.x, 1, -2);
      controls.target = new THREE.Vector3(spaceship.position.x, 0, 20);
    }
  }
  if(keyboard.pressed("space")){
    if(!missileTire){
      missileTire = true;
      missile.position.z = 0;
      missile.position.x = spaceship.position.x;
      missile.visible = true;
    }
  }
}

function cameraBind(){
  if(keyboard.pressed("0")){
    lockCam = true;
    camera.position.set(0, 8, -20);
    controls.target = new THREE.Vector3(0, 0, 0);
  }
  if(keyboard.pressed("1")){
    lockCam = false;
    camera.position.set(spaceship.position.x, 1, -2);
    controls.target = new THREE.Vector3(spaceship.position.x, 0, 20);
  }
}

function moveMissile(){
  missile.position.z += 0.5;
  if(missile.position.z >= 20){
    missile.position.z = 0;
    missile.visible = false;
    missileTire = false;
  }
}

function moveMissileAliens(){
  missileAliens.position.z -= vitesseMissAliens;
  if(missileAliens.position.z <= -3){
    missileAliens.visible = false;
    missileAliensTire = false;
  }
}

function touchAliens(){
  var ray = new THREE.Raycaster();
  var vect = new THREE.Vector3(1, 0, 1);
  ray.set(missile.position, vect);

  //Calcule les objets coupant le rayon de prélèvement
  var intersect = ray.intersectObjects(alienTab, true);
  if(intersect.length > 0){
    if(intersect[0].object.material.opacity != 0){
      intersect[0].object.material.opacity = 0;
      missileTire = false;
      missile.visible = false;
      if(intersect[0].object.material.opacity <= 0){
        scene.remove(intersect[0].object);
        alienTab.splice(alienTab.indexOf(intersect[0].object),1);
        cptAliens --;
        finPartie();
      }
    }
  }
}

function finPartie(){
  if(cptAliens == 0){
    console.log('Le joueur à gagné trop bien (pas eddy)');
    partieFinie = true;
  }
  if(nbLives == 0){
    console.log('les aliens ont gagnés (pas eddy)');
    partieFinie = true;
  }
  if(aliens.position.z == spaceship.position.z){
    console.log('les aliens ont gagnés(raquette) (pas eddy)');
    partieFinie = true;
  }
}

/*function touchAliens(){
  if(missileTire){
    if((missile.position.z + 0.3) >= aliens.position.z - aliensSize.z/2){
      if((missile.position.x - 0.1) < (aliens.position.x + aliensSize.x/2) && (missile.position.x + 0.1) > (aliens.position.x - aliensSize.x/2)){
        let x, z;
        x = missile.position.x - aliens.position.x;
        z = missile.position.z + missile.geometry.parameters.depth/2 - aliens.position.z;
        console.log('groupe touche', 'x='+x, 'z='+z);
        for(let i = 0; i < aliens.children.length; i++){
          if(aliens.children[i].material.opacity != 0){
            if((z + missile.geometry.parameters.depth/2) >= aliens.position.z){ // Si ca touche sa coule
              if(x - 0.1 < aliens.children[i].position.x + 0.5 && x + 0.1 > aliens.children[i].position.x - 0.5){
                // Refaire le cube avec moins d'opacite
                console.log(aliens.children[i]);
                aliens.children[i].material.opacity = 0;
                missileTire = false;
                missile.visible = false;
                break;
              }
            }
          }
        }
      }
    }
  }

}*/

function touchBunker(){
  if((missile.position.z + 0.3) >= (bunk.position.z - bunkSize.z/2)){
    if((missile.position.x - 0.1) < (bunk.position.x + bunkSize.x/2) && (missile.position.x + 0.1) > (bunk.position.x- bunkSize.x/2)){
      for(let i = 0; i < bunk.children.length; i++){
        if(bunk.children[i].material.opacity != 0){
          if((missile.position.z + missile.geometry.parameters.depth/2) >= 1.5){ // Si ca touche sa coule
            if(missile.position.x - 0.1 < bunk.children[i].position.x + 0.5 && missile.position.x + 0.1 > bunk.children[i].position.x - 0.5){
              // Refaire le cube avec moins d'opacite
              bunk.children[i].material.opacity -= 0.5;
              missileTire = false;
              missile.visible = false;
              break;
            }
          }
        }
      }
    }
  }
}

//Attaque des aliens
function aliensAttack(){
  //Permet de générer un chiffre entre 0 à 11 --> correspond au nb d'aliens
  var generAliens = Math.floor(Math.random() * alienTab.length);
  var random = Math.random();
  if(random > 0.8){
    missileAliens.visible = true;
    missileAliensTire = true;
    missileAliens.position.z = aliens.position.z + alienTab[generAliens].position.z;
    missileAliens.position.x = aliens.position.x + alienTab[generAliens].position.x;
    vitesseMissAliens += 0.01;
  }
}

function aliensTouchBunk(){
  var ray = new THREE.Raycaster();
  var vect = new THREE.Vector3(0, 0, 1);
  ray.set(missileAliens.position, vect);

  //Calcule les objets coupant le rayon de prélèvement
  var intersect = ray.intersectObjects(bunkTab, true);
  if(intersect.length > 0){
    if(intersect[0].object.material.opacity != 0){
      intersect[0].object.material.opacity -= 0.5;
      missileAliensTire = false;
      missileAliens.visible = false;
      if(intersect[0].object.material.opacity < 0){
        scene.remove(intersect[0].object);
        bunkTab.splice(bunkTab.indexOf(intersect[0].object),1);
      }
    }
  }
}

function aliensTouchSpaceship(){
  var ray = new THREE.Raycaster();
  var vect = new THREE.Vector3(0, 0, 1);
  ray.set(missileAliens.position, vect);

  var intersect = ray.intersectObject(spaceship);
  if(intersect.length > 0){
    missileAliensTire = false;
    missileAliens.visible = false;
    nbLives --;
    finPartie();
  }
}
