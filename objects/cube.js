let geometry, material, obj;

export default class Cube{
  constructor(x, y, z, color, opa){
    this.object = new THREE.Group();
    if (typeof x !== 'number') {
      throw new Error('parameter X of Cube is not a number');
    }
    if (x < 0){
      throw new Error('parameter X of Cube must be higher than 0');
    }
    if (typeof y !== 'number') {
      throw new Error('parameter Y of Cube is not a number');
    }
    if (y < 0){
      throw new Error('parameter Y of Cube must be higher than 0');
    }
    if (typeof z !== 'number') {
      throw new Error('parameter Z of Cube is not a number');
    }
    if (z < 0){
      throw new Error('parameter Z of Cube must be higher than 0');
    }
    geometry = new THREE.BoxBufferGeometry(x, y, z);
    material = new THREE.MeshPhongMaterial({color: color, transparent: true, opacity: opa}); // Color
    obj = new THREE.Mesh(geometry, material);

    this.object.add(obj);
  }
}
