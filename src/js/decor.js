import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.module.js';
import gameConfig from './gameConfig.js';

/*-------------Class pour la gestion des décors -----------*/
export default class Decor{
    constructor() {
        this.geometry;
        this.material;
    }

    //Permet de changer le fond de la skybox suivant l'url passé en paramètre
    static createBackground = (path) =>{
        const format = '.png';
        const urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format,
        ];
        const reflectionCube = new THREE.CubeTextureLoader().load( urls );
        const refractionCube = new THREE.CubeTextureLoader().load( urls );
        refractionCube.mapping = THREE.CubeRefractionMapping;
        return reflectionCube;
    }

    //Permet de changer le sol du jeu suivant l'url passé en paramètre
    static createGround = (path) => {
        this.geometry = new THREE.PlaneGeometry( 60, 60, 60, 10);
        let loader = new THREE.TextureLoader();
        let groundTexture = loader.load(path);
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set( 2, 2 );
        groundTexture.encoding = THREE.sRGBEncoding;
        this.material = new THREE.MeshLambertMaterial( { map: groundTexture } );
        let plane = new THREE.Mesh( this.geometry, this.material );
        plane.rotation.x = THREE.Math.degToRad(-90);
        plane.position.y = -1;
        return plane;
    }

    //Permet de créer le sol en pavé derrière le joueur
    static createGroundTownHall = () =>{
        this.geometry = new THREE.PlaneGeometry( 50, 30, 30, 10);
        let loader = new THREE.TextureLoader();
        let groundTexture = loader.load( '../src/medias/images/mairie.png' );
        groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.encoding = THREE.sRGBEncoding;
        this.material = new THREE.MeshLambertMaterial( { map: groundTexture } );
        let plane = new THREE.Mesh( this.geometry, this.material );
        plane.rotation.x = THREE.Math.degToRad(-90);
        plane.position.y = -0.9;
        plane.position.z = -15;
        return plane;
    }

    //Permet de créer les arbres derrières les aliens
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

    //Permert de créer le batiment derriere le joueur
    static async createTown(){
        let town = await gameConfig.chargerModeleDAE('../src/medias/models/Scene/Town Halls/officeA/sobj_officeA00.dae');
        town.scene.position.z = -20;
        town.scene.position.y = -1;
        town.scene.scale.set(0.08,0.08,0.08)
        return town.scene;
    }

    //Permet de créer les arbres derrière le joueur
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

    //Permet de créer le magasin en bois derrière le joueur
    static async nookShop(){
        let shop = await gameConfig.chargerModeleGLTF('../src/medias/models/Scene/Nookling Junction/scene.gltf');
        shop.scene.scale.set(8,8,8);
        shop.scene.position.y = -5;
        shop.scene.position.z = -17;
        shop.scene.position.x = 20;
        return shop.scene;
    }

    //Permet de choisir le fond du jeu
    static async chooseBackground(){
        document.getElementById('checkbox-ile').checked = true;
        document.getElementById('checkbox-espace').checked = false;
        let groundTownHall = Decor.createGroundTownHall();
        let tree;
        if(document.getElementById('checkbox-ile').checked == true){
            gameConfig.scene.add(groundTownHall);
            await Decor.createTree().then((value) =>{
                tree = value;
                gameConfig.scene.add(tree);
            })
        }else{
            gameConfig.scene.remove(groundTownHall);
        }
        document.getElementById('checkbox-ile').onclick = () =>{
            if(document.getElementById('checkbox-ile').checked == true){
                document.getElementById('checkbox-espace').checked = false;
                let background = Decor.createBackground('../src/medias/images/skybox/ile/');
                gameConfig.scene.background = background;
                let ground = Decor.createGround('../src/medias/images/herbe.png');
                gameConfig.scene.add(ground);
                gameConfig.scene.add(groundTownHall);
                gameConfig.scene.add(tree);
            }else{
                document.getElementById('checkbox-espace').checked = true;
            }
        };
        document.getElementById('checkbox-espace').onclick = () =>{
            if(document.getElementById('checkbox-espace').checked == true){
                document.getElementById('checkbox-ile').checked = false;
                let background = Decor.createBackground('../src/medias/images/skybox/espace/');
                gameConfig.scene.background = background;
                let ground = Decor.createGround('../src/medias/images/plage3.png');
                gameConfig.scene.add(ground);
                gameConfig.scene.remove(groundTownHall)
                gameConfig.scene.remove(tree);
            }else{
                document.getElementById('checkbox-ile').checked = true;
            }
        };
        
    }
}