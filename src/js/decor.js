import * as THREE from '../lib/node_modules/three/build/three.module.js';

let geometry, material;
let stade;

stade = new THREE.Group();

//Création de la table de jeu
geometry = new THREE.PlaneGeometry( 100, 100, 100, 10);

//texture du sol
let loader = new THREE.TextureLoader();
let groundTexture = loader.load( '../src/medias/images/skybox/penguins/indigo_dn.jpg' );
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set( 2, 2 );
//groundTexture.anisotropy = 16;
groundTexture.encoding = THREE.sRGBEncoding;
let groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );
let plane = new THREE.Mesh( geometry, groundMaterial );
plane.rotation.x = THREE.Math.degToRad(-90);
plane.position.y = -1;
stade.add( plane );







export {stade};