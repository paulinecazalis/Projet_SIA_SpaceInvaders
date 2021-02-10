let gridHelper;

export default class Grid{
  constructor(){
    this.object = new THREE.Group();

    const size = 100;
    const divisions = 100;
    gridHelper = new THREE.GridHelper( size, divisions );

    this.object.add(gridHelper);
  }
}
