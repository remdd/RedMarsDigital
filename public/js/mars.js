// Constants
var LIGHT_POS_X = 800;
var LIGHT_POS_Y = 300;
var LIGHT_POS_Z = 100;

var CAMERA_POS_X = 1800;
var CAMERA_POS_Y = 0;

var POS_Z = 1800;

var WIDTH = $('#globe').width();
var HEIGHT = WIDTH * 0.6;

var RADIUS = 600;

var FOV = 45;
var NEAR = 1;
var FAR = 4000;

var timer = 0;

var speed = 0.002;

var points_geography = [];
var points_missions = [];
var point_full_opacity = 0.7;
var point_fade_time = 300;

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
    timer += speed;
    camera.position.x = (Math.cos( timer ) *  1800);
    camera.position.z = (Math.sin( timer ) *  1800);
   	light.position.x = (Math.cos( timer + 0.75 ) *  1800);
    light.position.z = (Math.sin( timer + 0.75 ) *  1800);
    camera.lookAt( scene.position );
    light.lookAt(scene.position);
    renderer.render( scene, camera );
    requestAnimationFrame( render );
    TWEEN.update();
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
    for(var i = 0; i < points.length; i++) {
        var x = points[i].long;
        var y = points[i].lat;
        var position = latLongToVector3(y, x, points[i].height);

        if(points[i].type === 'geography') {
            var geometry = new THREE.SphereGeometry(12, 8, 8);
            var material = new THREE.MeshLambertMaterial({
                color: 0xffc132,
                transparent: true,
                opacity: point_full_opacity
            });
        } else if(points[i].type === 'mission') {
            var geometry = new THREE.BoxGeometry(15, 15, 15);
            var material = new THREE.MeshLambertMaterial({
                color: 0x8ad4fc,
                transparent: true,
                opacity: point_full_opacity
            });
        } else if(points[i].type === 'newest') {
            var geometry = new THREE.BoxGeometry(20, 10, 10);
            var material = new THREE.MeshLambertMaterial({
                color: 0xFFFFFF,
                transparent: true,
                opacity: point_full_opacity
            });
        }
        var point = new THREE.Mesh(geometry, material);
        point.marsname = points[i].name;
        point.receiveShadow = true;
        point.position.copy(position);
        point.lookAt( new THREE.Vector3(0, 0, 0) );
        scene.add(point);

        if(points[i].type === 'geography') {
            points_geography.push(point);
        } else if(points[i].type === 'mission') {
            points_missions.push(point);
        }
    }

}

// convert the positions from a lat, lon to a position on a sphere.
function latLongToVector3(lat, lon, height) {
    var radius = RADIUS;

    var phi = (lat)*Math.PI/180;
    var theta = (lon-180)*Math.PI/180;
    var x = -(radius+height) * Math.cos(phi) * Math.cos(theta);
    var y = (radius+height) * Math.sin(phi);
    var z = (radius+height) * Math.cos(phi) * Math.sin(theta);
    return new THREE.Vector3(x,y,z);
}

$('.gbut').click(function() {
    $('.gbut').removeClass('selecti');
    $(this).addClass('selecti');
    var but = $(this).attr('id');
    switch(but) {
        case 'gbutb3':
            speed = -0.015
            break;
        case 'gbutb2':
            speed = -0.006
            break;
        case 'gbutb1':
            speed = -0.002
            break;
        case 'gbutp':
            speed = 0
            break;
        case 'gbutf1':
            speed = 0.002
            break;
        case 'gbutf2':
            speed = 0.006
            break;
        case 'gbutf3':
            speed = 0.015
            break;
        default:
            speed = 0.002
    }
});

$('.obut').click(function() {
    $(this).toggleClass('selecti');
    var but = $(this).attr('id');
    switch(but) {
        case 'obutgeography': {
            if($(this).hasClass('selecti')) {
                $.each(points_geography, function(index, point) {
                    var tween = new TWEEN.Tween( point.material ).to( { opacity: point_full_opacity }, point_fade_time ).start();
                });
                break;
            } else {
                $.each(points_geography, function(index, point) {
                    var tween = new TWEEN.Tween( point.material ).to( { opacity: 0 }, point_fade_time ).start();
                });
                break;
            }
        }
        case 'obutmissions': {
            if($(this).hasClass('selecti')) {
                $.each(points_missions, function(index, point) {
                    var tween = new TWEEN.Tween( point.material ).to( { opacity: point_full_opacity }, point_fade_time ).start();
                });
                break;
            } else {
                $.each(points_missions, function(index, point) {
                    var tween = new TWEEN.Tween( point.material ).to( { opacity: 0 }, point_fade_time ).start();
                });
                break;
            }
        }
    }
});

//  Points of interest to display on the globe
var points = [
    {
        name: 'Airy-0 crater',
        description: 'This crater defines the prime meridian, or line of zero longitude, on Mars. It was named after the Astronomer Royal Sir ',
        type: 'geography',
        img: '',
        lat: -5.1,
        long: 0,
        height: 0
    },
    {
        name: 'Olympus Mons',
        description: 'The tallest mountain in the solar system, standing nearly 14 miles above its surroundings.',
        type: 'geography',
        lat: 18.4,
        long: 226.5,
        height: 0
    },
    {
        name: 'Isidis Planitia',
        description: "A vast plain in one of Mars' three particularly apparent 'impact basins', formed about 4 billion years ago by a collision with a large (perhaps 30 miles in diameter) asteroid or comet.",
        type: 'geography',
        lat: 12.9,
        long: 87,
        height: 0
    },
    {
        name: 'Hellas Planitia',
        description: '',
        type: 'geography',
        lat: -40,
        long: 160,
        height: 0
    },
    {
        name: 'Beagle 2',
        description: 'Landing site of the British spacecraft that failed to operate after landing, on Christmas Day 2003. Its fate was unknown at the time, until spotted by the Mars Reconnaissance Orbiter in late 2014.',
        type: 'mission',
        lat: 11.31,
        long: 90.25,
        height: 0
    },
    {
        name: 'Viking 1',
        description: "NASA's Viking 1, the first spacecraft to achieve a soft landing on Mars and complete its objectives, touched down here on July 20, 1976.",
        type: 'mission',
        lat: 22.27,
        long: 312.05,
        height: 0
    },
    {
        name: 'Mars 2',
        description: "The Soviet Union's Mars 2 probe was the first man-made object to reach the surface of Mars, on November 27 1971, but the descent module's parachute failed to deploy and it is presumed to have been destroyed on impact.",
        type: 'newest',
        lat: -45,
        long: 47,
        height: 0
    },
    {
        name: 'Mars 3',
        description: "Running from 1960 to 1973, the Soviet Mars programme suffered a very high failure rate - but their Mars 3 probe can claim mankind's first (and to date Russia's only) successful soft landing on Mars. Unforunately however it failed after just 14.5 seconds, having transmitted just a single partial image.",
        type: 'mission',
        lat: -45,
        long: 202,
        height: 0
    },
    {
        name: 'Curiosity',
        description: "The landing site of NASA's most recent and instrument-packed rover to date. Curiosity touched down on August 6, 2012, and is still returning incredibly valuable scientific data.",
        type: 'mission',
        lat: -4.59,
        long: 137.44,
        height: 0
    },
    {
        name: 'Spirit',
        description: "The second of NASA's pair of Mars Exploration Rovers to touch down in early 2004. After 5 years and 4 months of successful exploration, Spirit became stuck and immobilized in May 2009 and eventually stopped communicating the following year.",
        type: 'mission',
        lat: -14.57,
        long: 175.47,
        height: 0
    },
    {
        name: 'Opportunity',
        description: "NASA's pair of Mars Exploration Rovers were each planned to operate for 90 sols (about 92 Earth days). Instead, Spirit managed over 2,200 sols before getting stuck - and Opportunity is still going strong at the time of writing, over 14 years later.",
        type: 'mission',
        lat: -1.95,
        long: 354.47,
        height: 0
    }

];