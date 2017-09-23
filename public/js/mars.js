// Constants
var LIGHT_POS_X = 800;
var LIGHT_POS_Y = 300;
var LIGHT_POS_Z = 100;

var CAMERA_POS_X = 1800;
var CAMERA_POS_Y = 500;

var POS_Z = 1800;

var WIDTH = $('#globe').width();
var HEIGHT = WIDTH * 0.8;

var FOV = 45;
var NEAR = 1;
var FAR = 4000;

var timer = 0;


// some global variables and initialization code
// simple basic renderer
var renderer = new THREE.WebGLRenderer( { alpha: true });
renderer.setSize(WIDTH,HEIGHT);
renderer.setClearColor(0x000000, 0);

// add it to the target element
var mapDiv = document.getElementById("globe");
mapDiv.appendChild(renderer.domElement);

// setup a camera that points to the center
var camera = new THREE.PerspectiveCamera(FOV,WIDTH/HEIGHT,NEAR,FAR);
camera.position.set(CAMERA_POS_X,CAMERA_POS_Y, POS_Z);
camera.lookAt(new THREE.Vector3(0,0,0));

// create a basic scene and add the camera
var scene = new THREE.Scene();
scene.add(camera);

//	run on document ready

$(document).ready(function()  {
    addLight();
    var mars = addMars();
    scene.add(mars);
    render();

    $(window).resize(function() {
        WIDTH = $('#globe').width();
        HEIGHT = WIDTH * 0.8;
        renderer.setSize(WIDTH,HEIGHT);
    });
});

//  animation
function render() {
    timer += 0.002;
    camera.position.x = (Math.cos( timer ) *  1800);
    camera.position.z = (Math.sin( timer ) *  1800);
   	light.position.x = (Math.cos( timer + 0.75 ) *  1800);
    light.position.z = (Math.sin( timer + 0.75 ) *  1800);
/*  console.log(camera.position.x + " - " + camera.position.z + " - " + light.position.x + " - " + light.position.z);*/
    camera.lookAt( scene.position );
    light.lookAt(scene.position);
    renderer.render( scene, camera );
    requestAnimationFrame( render );
}

// add Mars
function addMars() {
    var geometry = new THREE.SphereGeometry(600,40,40);
    var texture = THREE.ImageUtils.loadTexture( "/img/MarsMap.jpg" );
    var material =  new THREE.MeshPhongMaterial( {
    	// color: 0xbb0000,
        map: texture,
        shininess: 0.2 } );
    mars = new THREE.Mesh(geometry, material);
    return mars;
}

// add lighting
function addLight() {
    light = new THREE.DirectionalLight(0xffffff, 1, 500);
    scene.add(light);
    light.position.set(LIGHT_POS_X,LIGHT_POS_Y,LIGHT_POS_Z);
}

