// Constants
var LIGHT_POS_X = 800;
var LIGHT_POS_Y = 300;
var LIGHT_POS_Z = 100;

var CAMERA_POS_X = 1800;
var CAMERA_POS_Y = 500;

var POS_Z = 1800;

var WIDTH = $('#globe').width();
var HEIGHT = WIDTH * 0.6;

var RADIUS = 600;

var FOV = 45;
var NEAR = 1;
var FAR = 4000;

var timer = 0;


// some global variables and initialization code
// simple basic renderer
var renderer = new THREE.WebGLRenderer( { alpha: true });
renderer.setSize(WIDTH,HEIGHT);
renderer.setClearColor(0x000000, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;


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
    addPoints();
    
    render();

    $(window).resize(function() {
        WIDTH = $('#globe').width();
        HEIGHT = WIDTH * 0.6;
        renderer.setSize(WIDTH,HEIGHT);
    });
});

//  animation
function render() {
    timer += 0.005;
    camera.position.x = (Math.cos( timer ) *  1800);
    camera.position.z = (Math.sin( timer ) *  1800);
   	light.position.x = (Math.cos( timer + 0.75 ) *  1800);
    light.position.z = (Math.sin( timer + 0.75 ) *  1800);
    camera.lookAt( scene.position );
    light.lookAt(scene.position);
    renderer.render( scene, camera );
    requestAnimationFrame( render );
}

// add Mars
function addMars() {
    var geometry = new THREE.SphereGeometry(RADIUS, 50, 50);
    var texture = THREE.ImageUtils.loadTexture( "/img/MarsMap.jpg" );
    var material =  new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 0.2 
    });
    mars = new THREE.Mesh(geometry, material);
    mars.castShadow = true;
    mars.position.set(0, 0, 0);
    return mars;
}

// add lighting
function addLight() {
    light = new THREE.DirectionalLight(0xffffff, 1, 500);
    light.castShadow = true;
    scene.add(light);
    light.position.set(LIGHT_POS_X,LIGHT_POS_Y,LIGHT_POS_Z);
}

//  add points of interest
function addPoints() {
    var geometry = new THREE.SphereGeometry(10, 8, 8);
    var material = new THREE.MeshPhongMaterial({
        color: 0xffd196,
        shininess: 0.4,
        opacity: 0.2
    });
    for(var i = 0; i < points.length; i++) {
        var x = points[i].long;
        var y = points[i].lat;
        console.log(x + ", " + y);
        var position = latLongToVector3(y, x, points[i].height);
        var point = new THREE.Mesh(geometry, material);
        point.receiveShadow = true;
        console.log(position);
        point.position.copy(position);
        console.log(point.position);

        point.lookAt( new THREE.Vector3(0, 0, 0) );
        scene.add(point);
        console.log(point);
    }

}

// convert the positions from a lat, lon to a position on a sphere.
function latLongToVector3(lat, lon, height) {
    var radius = RADIUS;

    var phi = (lat)*Math.PI/180;
    var theta = (lon-180)*Math.PI/180;

    console.log("phi: " + phi);
    console.log("theta: " + theta);

    var x = -(radius+height) * Math.cos(phi) * Math.cos(theta);
    var y = (radius+height) * Math.sin(phi);
    var z = (radius+height) * Math.cos(phi) * Math.sin(theta);

    console.log("x: " + x);
    console.log("y: " + y);
    console.log("z: " + z);

    return new THREE.Vector3(x,y,z);
}

var points = [
    {
        name: 'Site One',
        lat: 50,
        long: -20,
        height: 0,
    },
    {
        name: 'Site Two',
        lat: 0,
        long: 0,
        height: 0,
    },
    {
        name: 'Site Three',
        lat: -20,
        long: 165,
        height: 0,
    }

];