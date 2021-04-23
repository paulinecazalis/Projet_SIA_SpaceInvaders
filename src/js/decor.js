import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.js';
import gameConfig from './gameConfig.js';

export default class Decor{
    constructor() {
        this.geometry;
        this.material;
    }

    static createGround = () => {
        this.geometry = new THREE.PlaneGeometry( 60, 60, 60, 10);
        let loader = new THREE.TextureLoader();
        let groundTexture = loader.load( '../src/medias/images/herbe.png' );
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set( 2, 2 );
        //groundTexture.anisotropy = 16;
        groundTexture.encoding = THREE.sRGBEncoding;
        this.material = new THREE.MeshLambertMaterial( { map: groundTexture } );
        let plane = new THREE.Mesh( this.geometry, this.material );
        plane.rotation.x = THREE.Math.degToRad(-90);
        plane.position.y = -1;
        //stade.add( plane );
        return plane;
    }

    static createGroundTownHall = () =>{
        this.geometry = new THREE.PlaneGeometry( 50, 30, 30, 10);
        let loader = new THREE.TextureLoader();
        let groundTexture = loader.load( '../src/medias/images/mairie.png' );
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        //groundTexture.repeat.set( 2, 2 );
        //groundTexture.anisotropy = 16;
        groundTexture.encoding = THREE.sRGBEncoding;
        this.material = new THREE.MeshLambertMaterial( { map: groundTexture } );
        let plane = new THREE.Mesh( this.geometry, this.material );
        plane.rotation.x = THREE.Math.degToRad(-90);
        plane.position.y = -0.9;
        plane.position.z = -15;
        //stade.add( plane );
        return plane;
    }

    static async createTree(){
        let treeGroup = new THREE.Group();
        for(let i = 0; i<= 5; i++){
            let tree = await gameConfig.chargerModeleGLTF('../src/medias/models/Scene/Tree/tree2.gltf');
            tree.scene.position.x = (i%5 - ((5-1)/2)) * 10;
            tree.scene.position.z = 29;
            tree.scene.position.y = -1;
            tree.scene.rotation.x = 20.4;
            tree.scene.rotation.z = 9.5;
            tree.scene.scale.set(35,35,35)
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

    static async createHouse(){
        let house = await gameConfig.chargerModeleGLTF('../src/medias/models/Scene/animal_crossing_house/scene.gltf');
        house.scene.position.z = -20;
        house.scene.position.x = -15;
        house.scene.position.y = -1;
        house.scene.rotation.y = 29.8;
        house.scene.scale.set(0.03,0.03,0.03)
        return house.scene;
    }

    static async createTreeTown(){
        let treeGroup = new THREE.Group();
        for(let i = 0; i<= 1; i++){
            let tree = await gameConfig.chargerModeleGLTF('../src/medias/models/Scene/Tree/tree2.gltf');
            tree.scene.position.x = (i%2 - ((2-1)/2)) * 20;
            tree.scene.position.z = -15;
            tree.scene.position.y = -1;
            tree.scene.rotation.x = 20.4;
            tree.scene.rotation.z = 0;
            tree.scene.scale.set(35,35,35)
            treeGroup.add(tree.scene);
        }
        return treeGroup;
        
    }

    static async nookShop(){
        let shop = await gameConfig.chargerModeleGLTF('../src/medias/models/Scene/Nookling Junction/scene.gltf');
        shop.scene.scale.set(8,8,8);
        shop.scene.position.y = -5;
        shop.scene.position.z = -17;
        shop.scene.position.x = 20;
        //shop.scene.rotation.y = 4.7;
        return shop.scene;
    }

    
}