//  Controls for three.js Mars map
//  Constants
var WIDTH = $('#globe').width();
var HEIGHT = WIDTH * 0.6;
const RADIUS = 600;
const FOV = 45;
const NEAR = 1;
const FAR = 4000;

//  three.js config vars
var camera_pos = {
    x: 1800,
    y: 0,
    z: 1800
}
var light_pos = {
    x: 1800,
    y: 200,
    z: 1800
}
//  Config variables
var point_full_opacity = 0.7;
var point_fade_time = 300;
var camera_angle_time = 1000;
var points_geography = [];
var points_missions = [];
var point_labelled;

//  Globe rotation variables
var timer = 0;
var speed = 0.001;

//  Basic three.js renderer
var renderer = new THREE.WebGLRenderer( { alpha: true });
renderer.setSize(WIDTH,HEIGHT);
renderer.setClearColor(0x000000, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;

//  Add renderer to DOM
var $globe = $('#globe');
$globe.append(renderer.domElement);
var $canvas = $('canvas').first();
window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('click', onTouch, false);

//  create a camera that always points to the origin (ie centre of globe)
var camera = new THREE.PerspectiveCamera(FOV,WIDTH / HEIGHT, NEAR, FAR);    //  Configure camera params
camera.position.set(camera_pos.x, camera_pos.y, camera_pos.z);              //  Initialize camera position
camera.lookAt(new THREE.Vector3(0,0,0));                                    //  Keeps camera pointing at centre of render space

//  create a basic scene and attach the camera
var scene = new THREE.Scene();
scene.add(camera);

//	run on document ready
$(() => {
    addLight();
    var mars = addMars();
    scene.add(mars);
    addPoints();
    render();
    setSize();
});

//  animation
function render() {
    timer += speed;
    camera.position.x = (Math.cos( timer ) *  camera_pos.x);
    camera.position.z = (Math.sin( timer ) *  camera_pos.z);
   	light.position.x = (Math.cos( timer + 0.75 ) *  light_pos.x);
    light.position.z = (Math.sin( timer + 0.75 ) *  light_pos.z);
    camera.lookAt( scene.position );
    light.lookAt(scene.position);
    renderer.render( scene, camera );
    requestAnimationFrame( render );
    TWEEN.update();
    raycaster.setFromCamera(mouseVector, camera);
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
    mars.name = 'Mars';
    mars.position.set(0, 0, 0);
    return mars;
}

// add lighting
function addLight() {
    light = new THREE.DirectionalLight(0xffffff, 1, 500);
    light.castShadow = true;
    scene.add(light);
    light.position.set(light_pos.x, light_pos.y, light_pos.z);
}

//  add points of interest
function addPoints() {
    for(var i = 0; i < points.length; i++) {
        var x = points[i].long;
        var y = points[i].lat;
        var height = 0;
        var position = latLongToVector3(y, x, height);

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
            //  Debug type for checking position of new points 
            var geometry = new THREE.BoxGeometry(20, 10, 10);
            var material = new THREE.MeshLambertMaterial({
                color: 0xFFFFFF,
                transparent: true,
                opacity: point_full_opacity
            });
        }
        var point = new THREE.Mesh(geometry, material);
        point.mars_name = points[i].name;
        point.mars_description = points[i].description;
        point.mars_img = points[i].img;
        point.mars_caption = points[i].caption;
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
    preloadImages(points);
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

//  Globe rotation button control
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
            speed = -0.001
            break;
        case 'gbutp':
            speed = 0
            break;
        case 'gbutf1':
            speed = 0.001
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

//  Overlay button control
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

//  Latitude button control
$('.lbut').click(function() {
    var startstate;
    if(camera.position.y > 0) {
        startstate = 'up';
    } else if(camera.position.y < 0) {
        startstate = 'down';
    }
    var but = $(this).attr('id');
    switch(but) {
        case 'lbutup':
            if(startstate === 'up') {
                break;
            } else if(startstate === 'down') {
                tweenmid();
            } else {
                tweenup();
            }
            $(this).addClass('selecti');
            $('.lbut').css('pointer-events', 'none');
            setTimeout(function() {
                $('.lbut').css('pointer-events', 'auto');
                $('.lbut').removeClass('selecti');
            }, camera_angle_time);
            break;
        case 'lbutdown':
            if(startstate === 'down') {
                break;
            } else if(startstate === 'up') {
                tweenmid();
            } else {
                tweendown();
            }
            $(this).addClass('selecti');
            $('.lbut').css('pointer-events', 'none');
            setTimeout(function() {
                $('.lbut').css('pointer-events', 'auto');
                $('.lbut').removeClass('selecti');
            }, camera_angle_time);
            break;
        default:
            var tween = new TWEEN.Tween( camera.position ).to( { y: 0 } , camera_angle_time ).start();
            var tween2 = new TWEEN.Tween( camera_pos ).to( { x: 1800, z: 1800 } , camera_angle_time ).easing(TWEEN.Easing.Quadratic.Out).start();
    }
});
function tweenup() {
    var tween = new TWEEN.Tween( camera.position ).to( { y: 1200 } , camera_angle_time ).start();
    var tween2 = new TWEEN.Tween( camera_pos ).to( { x: 1342, z: 1342 } , camera_angle_time ).easing(TWEEN.Easing.Quadratic.In).start();
    var tweenl = new TWEEN.Tween( light.position ).to( { y: 600 } , camera_angle_time ).start();
    var tweenl2 = new TWEEN.Tween( light_pos ).to( { x: 1342, z: 1342 } , camera_angle_time ).easing(TWEEN.Easing.Quadratic.In).start();
};
function tweendown() {
    var tween = new TWEEN.Tween( camera.position ).to( { y: -1200 } , camera_angle_time ).start();
    var tween2 = new TWEEN.Tween( camera_pos ).to( { x: 1342, z: 1342 } , camera_angle_time ).easing(TWEEN.Easing.Quadratic.In).start();
    var tweenl = new TWEEN.Tween( light.position ).to( { y: -600 } , camera_angle_time ).start();
    var tweenl2 = new TWEEN.Tween( light_pos ).to( { x: 1342, z: 1342 } , camera_angle_time ).easing(TWEEN.Easing.Quadratic.In).start();
};
function tweenmid() {
    var tween = new TWEEN.Tween( camera.position ).to( { y: 0 } , camera_angle_time ).start();
    var tween2 = new TWEEN.Tween( camera_pos ).to( { x: 1800, z: 1800 } , camera_angle_time ).easing(TWEEN.Easing.Quadratic.Out).start();
    var tweenl = new TWEEN.Tween( light.position ).to( { y: 100 } , camera_angle_time ).start();
    var tweenl2 = new TWEEN.Tween( light_pos ).to( { x: 1800, z: 1800 } , camera_angle_time ).easing(TWEEN.Easing.Quadratic.Out).start();
};

//  Projection vectors
var raycaster = new THREE.Raycaster();
var mouseVector = new THREE.Vector2();

//  Select point of interest on mouseover
function onMouseMove(e) {
    var offset = $canvas.offset();
    var canvasWidth = $canvas.width();
    var canvasHeight = $canvas.height();

    mouseVector.x = (e.pageX - offset.left) / (canvasWidth) * 2 - 1;
    mouseVector.y = (e.pageY - offset.top) / (canvasHeight) * -2 + 1;

    var intersects = raycaster.intersectObjects(scene.children);

    if(intersects.length > 0 && intersects[0].object.name != 'Mars' && intersects[0].object.name != 'highlight' && intersects[0].object.material.opacity > 0) {
        scene.remove(scene.getObjectByName('highlight'));
        highlightPoint(intersects[0].object);
    }
}

//  Select point of interest on click (for touchscreen support)
function onTouch(e) {
    var offset = $canvas.offset();
    var canvasWidth = $canvas.width();
    var canvasHeight = $canvas.height();

    mouseVector.x = (e.pageX - offset.left) / (canvasWidth) * 2 - 1;
    mouseVector.y = (e.pageY - offset.top) / (canvasHeight) * -2 + 1;

    var intersects = raycaster.intersectObjects(scene.children);

    if(intersects.length > 0 && intersects[0].object.name != 'Mars' && intersects[0].object.name != 'highlight' && intersects[0].object.material.opacity > 0) {
        scene.remove(scene.getObjectByName('highlight'));
        highlightPoint(intersects[0].object);
    }
}

function highlightPoint(point) {
    var geometry = new THREE.SphereGeometry(20, 8, 8);
    var material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.3
    });
    highlight = new THREE.Mesh(geometry, material);
    highlight.receiveShadow = true;
    highlight.position.copy(point.position);
    highlight.lookAt( new THREE.Vector3(0, 0, 0) );
    highlight.name = 'highlight';
    scene.add(highlight);
    highlightLabel(point);
}

function highlightLabel(point) {
    $('.pointDetails').fadeTo('fast', 0, function() {
        var $that = $(this);
        if(point.mars_img) {
            $('.pointImg img').attr('src', '/img/' + point.mars_img);
        } else {
            $('.pointImg img').attr('src', '');
        }
        if(point.mars_caption) {
            $('.pointImg div').text(point.mars_caption);
            $('.pointImg p').text(point.mars_caption);
        } else {
            $('.pointImg div').text('');
            $('.pointImg p').text('');
        }
        $('.pointInfo h4').text(point.mars_name);
        $('.pointInfo div').text(point.mars_description);
        $('.pointInfo p').text(point.mars_description);
        $('.pointImg').imagesLoaded(function() {
            $that.fadeTo('fast', 1);
            $('.closeSpan').fadeIn('fast');
        });
    });
}

//  Click to close info overlay for points of interest
$('.closeSpan').click(() => {
    scene.remove(scene.getObjectByName('highlight'));
    $('.pointDetails').fadeOut('fast'); 
});

//  Determine whether 'point info' panes should be displayed overlaying or below the globe on window resize
$(window).resize(() => {
    setSize();
});
function setSize() {
    WIDTH = $('#globe').width();
    HEIGHT = WIDTH * 0.6;
    renderer.setSize(WIDTH,HEIGHT);
    if($(window).width() < 1152) {
        $('.globeOverlayLeft').addClass('hiddenOverlay');
        $('.globeOverlayRight').addClass('hiddenOverlay');
        $('.footerInfo').show();
    } else {
        $('.globeOverlayLeft').removeClass('hiddenOverlay');
        $('.globeOverlayRight').removeClass('hiddenOverlay');
        $('.footerInfo').hide();
    }
}

//  Preload images
function preloadImages(points) {
    var images = [];
    for(var i = 0; i < points.length; i++) {
        images[i] = new Image();
        images[i].src = '/img/' + points[i].img;
    }
}
