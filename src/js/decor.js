import * as THREE from '../lib/node_modules/three/build/three.module.js';
import gameConfig from './gameConfig.js';

export default class Decor{
    constructor() {
        this.geometry;
        this.material;
    }

    static createGround = () => {
        this.geometry = new THREE.PlaneGeometry( 60, 60, 60, 10);
        let loader = new THREE.TextureLoader();
        let groundTexture = loader.load( '../src/medias/images/plage3.png' );
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set( 2, 2 );
        //groundTexture.anisotropy = 16;
        groundTexture.encoding = THREE.sRGBEncoding;
        this.material = new THREE.MeshLambertMaterial( { map: groundTexture } );
        let plane = new THREE.Mesh( this.geometry, this.material );
        plane.rotation.x = THREE.Math.degToRad(-90);
        plane.position.y = -1;
        //stade.add( plane );
        return plane
    }

    static async createTree(){
        let treeGroup = new THREE.Group();
        for(let i = 0; i<= 5; i++){
            let tree = await gameConfig.chargerModeleDAE('../src/medias/models/Scene/Palm Tree/palmtree.dae');
            tree.scene.position.x = (i%5 - ((5-1)/2)) * 10;
            tree.scene.position.z = 29;
            tree.scene.position.y = -1;
            tree.scene.scale.set(0.05,0.05,0.05)
            treeGroup.add(tree.scene);
        }
        return treeGroup;
    }

    static async createTown(){
        let town = await gameConfig.chargerModeleDAE('../src/medias/models/Scene/Town Halls/officeA/sobj_officeA00.dae');
        town.scene.position.z = -20;
        town.scene.position.y = -1;
        town.scene.scale.set(0.08,0.08,0.08)
        return town.scene;
    }

    static async createCedarTree(){
        let cedar = await gameConfig.chargerModeleDAE('../src/medias/models/Scene/cedar/fg_treeB_4.dae');
        cedar.scene.position.z = -20;
        cedar.scene.position.x = 2;
        cedar.scene.position.y = -1;
        cedar.scene.scale.set(0.08,0.08,0.08)
        return cedar.scene;
    }

    
}

/*let geometry, material;
let stade;

stade = new THREE.Group();

//Création de la table de jeu
geometry = new THREE.PlaneGeometry( 60, 60, 60, 10);

//texture du sol
let loader = new THREE.TextureLoader();
let groundTexture = loader.load( '../src/medias/images/plage3.png' );
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set( 2, 2 );
//groundTexture.anisotropy = 16;
groundTexture.encoding = THREE.sRGBEncoding;
let groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );
let plane = new THREE.Mesh( geometry, groundMaterial );
plane.rotation.x = THREE.Math.degToRad(-90);
plane.position.y = -1;
stade.add( plane );
let essai2;
let tree = gameConfig.chargerModeleDAE('../src/medias/models/Scene/Palm Tree/palmtree.dae').then((value) =>{
    essai2 = value;
});
stade.add(essai2);








export {stade};*/