import { three_axis } from "../../objects/axis";

function createAlien(){
    let alien;
    let alienGeometry, alienMaterial;

    alienGeometry = new THREE.BoxGeometry(2, 6, 5);
    alienMaterial = new THREE.MeshLambertMaterial({color: 'blue'});

    alien = new THREE.Mesh(alienMaterial, alienGeometry);
    alien.position.x = -11;
    alien.position.y = 8;
    alien.position.z = 0;
}