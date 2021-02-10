let geometry, material;
let xaxis, yaxis, zaxis;
let three_axis = new THREE.Group();

// X-Axis
geometry = new THREE.CubeGeometry( 10, 0.1, 0.1 );
material = new THREE.MeshBasicMaterial({color: 'rgb(0,255,0)'}); // Green color
xaxis = new THREE.Mesh( geometry, material, );
xaxis.position.x += 5;

three_axis.add(xaxis);

// Y-Axis
geometry = new THREE.CubeGeometry( 0.1, 10, 0.1 );
material = new THREE.MeshBasicMaterial({color: 'rgb(255,0,0)'}); // Red color
yaxis = new THREE.Mesh( geometry, material, );
yaxis.position.y += 5;

three_axis.add(yaxis);

// Z-Axis
geometry = new THREE.CubeGeometry( 0.1, 0.1, 10 );
material = new THREE.MeshBasicMaterial({color: 'rgb(0,0,255)'}); // Blue color
zaxis = new THREE.Mesh( geometry, material, );
zaxis.position.z += 5;

three_axis.add(zaxis);

export{three_axis};