import * as THREE from '../lib/node_modules/three/build/three.module.js';
import Stats from '../lib/node_modules/three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from '../lib/node_modules/three/examples/jsm/controls/OrbitControls.js';
export default class Scene{
    constructor(){}
    static camera;
    static scene;
    static renderer;

    static initScene = () =>{
        let container = document.querySelector('#SIApp');
        let w = container.clientWidth;
        let h = container.clientHeight;

        Scene.scene = new THREE.Scene();

        Scene.camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 100);
        Scene.camera.position.set(0, 8, -20);
        //camera.add( Sound.listener );

        let controls = new OrbitControls(Scene.camera, container);
        controls.target = new THREE.Vector3(0, 0, 0);
        controls.panSpeed = 0.3;

        const renderConfig = {antialias: true, alpha: true};
        Scene.renderer = new THREE.WebGLRenderer(renderConfig);
        Scene.renderer.setPixelRatio(window.devicePixelRatio);
        Scene.renderer.setSize(w, h);
        //renderer.sortObjects = false;
        container.appendChild(Scene.renderer.domElement);

        let grid = new THREE.GridHelper( 100, 100 );
        scene.add(grid);

        let light = new THREE.AmbientLight( 0xFFFFFF);
        scene.add(light);

        Scene.stats();
    }

    static stats = () =>{
        let stats = new Stats();
        stats.domElement.style.removeProperty('top');
        stats.domElement.style.bottom = '0px';
        document.body.appendChild( stats.domElement );
    }
}