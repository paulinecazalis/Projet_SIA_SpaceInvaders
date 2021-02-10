let geometry, material;
let stade;

stade = new THREE.Group();
//Création de la table de jeu
geometry = new THREE.PlaneGeometry( 15, 22, 10, 10 );

//texture du sol
let loader = new THREE.TextureLoader();
let groundTexture = loader.load( 'css/sol.png' );
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set( 2, 2 );
groundTexture.anisotropy = 16;
groundTexture.encoding = THREE.sRGBEncoding;
let groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );
let plane = new THREE.Mesh( geometry, groundMaterial );
plane.rotation.x = THREE.Math.degToRad(-90);
plane.position.y = 0;
stade.add( plane );

//Ligne décoration centre
var centerlineGeometry = new THREE.PlaneGeometry( 15, 0.5, 10, 10 );
var centerlineMaterial = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
var centerline = new THREE.Mesh( centerlineGeometry, centerlineMaterial );
centerline.position.z = .02;
centerline.rotation.x = THREE.Math.degToRad(-90);
stade.add( centerline );

//Cercle décoration centre
var centerCircleGeometry = new THREE.CircleGeometry( 4.0, 50 );
var centerCircleMaterial = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
var centerCircle = new THREE.Mesh( centerCircleGeometry, centerCircleMaterial );
centerCircle.position.z = .01;
centerCircle.rotation.x = THREE.Math.degToRad(-90);
stade.add( centerCircle );

var centerCircleGeometry2 = new THREE.CircleGeometry( 3.5, 50 );
var centerCircleMaterial2 = new THREE.MeshPhongMaterial( {color: 0x006600} );
var centerCircle2 = new THREE.Mesh( centerCircleGeometry2, centerCircleMaterial2 );
centerCircle2.position.z = .015;
centerCircle2.rotation.x = THREE.Math.degToRad(-90);
stade.add( centerCircle2 );

//Création de la tribune
var leftWall1 = new THREE.BoxGeometry( 1, 22, 0.25 );
var wallMaterial = new THREE.MeshPhongMaterial( {color: 0xBBBBBB} );
var wall1 = new THREE.Mesh( leftWall1, wallMaterial );
wall1.position.x = -8;
wall1.position.z = 0.125;
wall1.rotation.x = THREE.Math.degToRad(-90);
stade.add( wall1 );
	
/*var edges1 = new THREE.EdgesHelper( wall1, 0x5555555 );
stade.add( edges1 );

var leftWall1_2 = new THREE.BoxGeometry( 0.75, 18, 0.25 );
var wallMaterial = new THREE.MeshPhongMaterial( {color: 0xBBBBBB} );
var wall1_2 = new THREE.Mesh( leftWall1_2, wallMaterial );
wall1_2.position.x = -5.125;
wall1_2.position.z = 0.375;
stade.add( wall1_2 );
	
var edges1_2 = new THREE.EdgesHelper( wall1_2, 0x5555555 );
stade.add( edges1_2 );

var leftWall1_3 = new THREE.BoxGeometry( 0.5, 18, 0.25 );
var wallMaterial = new THREE.MeshPhongMaterial( {color: 0xBBBBBB} );
var wall1_3 = new THREE.Mesh( leftWall1_3, wallMaterial );
wall1_3.position.x = -5.25;
wall1_3.position.z = 0.625;
stade.add( wall1_3 );
	
var edges1_3 = new THREE.EdgesHelper( wall1_3, 0x5555555 );
stade.add( edges1_3 );

var leftWall1_4 = new THREE.BoxGeometry( 0.25, 18, 0.25 );
var wallMaterial = new THREE.MeshPhongMaterial( {color: 0xBBBBBB} );
var wall1_4 = new THREE.Mesh( leftWall1_4, wallMaterial );
wall1_4.position.x = -5.375;
wall1_4.position.z = 0.875;
stade.add( wall1_4 );
	
var edges1_4 = new THREE.EdgesHelper( wall1_4, 0x5555555 );
stade.add( edges1_4 );*/
	
var rightWall1 = new THREE.BoxGeometry( 1, 22, 0.25 );
var wall2 = new THREE.Mesh( rightWall1, wallMaterial );
wall2.position.x = 8;
wall2.position.z = 0.125;
wall2.rotation.x = THREE.Math.degToRad(-90);
stade.add( wall2 );

/*var edges2 = new THREE.EdgesHelper( wall2, 0x555555 );
stade.add( edges2 );

var rightWall2_2 = new THREE.BoxGeometry( 0.75, 18, 0.25 );
var wallMaterial = new THREE.MeshPhongMaterial( {color: 0xBBBBBB} );
var wall2_2 = new THREE.Mesh( rightWall2_2, wallMaterial );
wall2_2.position.x = 5.125;
wall2_2.position.z = 0.375;
stade.add( wall2_2 );
	
var edges2_2 = new THREE.EdgesHelper( wall2_2, 0x5555555 );
stade.add( edges2_2 );

var rightWall2_3 = new THREE.BoxGeometry( 0.5, 18, 0.25 );
var wallMaterial = new THREE.MeshPhongMaterial( {color: 0xBBBBBB} );
var wall2_3 = new THREE.Mesh( rightWall2_3, wallMaterial );
wall2_3.position.x = 5.25;
wall2_3.position.z = 0.625;
stade.add( wall2_3 );
	
var edges2_3 = new THREE.EdgesHelper( wall2_3, 0x5555555 );
stade.add( edges2_3 );

var rightWall2_4 = new THREE.BoxGeometry( 0.25, 18, 0.25 );
var wallMaterial = new THREE.MeshPhongMaterial( {color: 0xBBBBBB} );
var wall2_4 = new THREE.Mesh( rightWall2_4, wallMaterial );
wall2_4.position.x = 5.375;
wall2_4.position.z = 0.875;
stade.add( wall2_4 );
	
var edges2_4 = new THREE.EdgesHelper( wall2_4, 0x5555555 );
stade.add( edges2_4 );*/

export {stade};