//  Constants
var WIDTH = $('#globe').width();
var HEIGHT = WIDTH * 0.6;

var RADIUS = 600;

var FOV = 45;
var NEAR = 1;
var FAR = 4000;

//  Global vars
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

var timer = 0;
var speed = 0.001;
var points_geography = [];
var points_missions = [];
var point_full_opacity = 0.7;
var point_fade_time = 300;
var camera_angle_time = 1000;
var point_labelled;

//  basic renderer
var renderer = new THREE.WebGLRenderer( { alpha: true });
renderer.setSize(WIDTH,HEIGHT);
renderer.setClearColor(0x000000, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;

//  add renderer to DOM
var mapDiv = document.getElementById("globe");
mapDiv.appendChild(renderer.domElement);
var $canvas = $('canvas').first();
window.addEventListener('mousemove', onMouseMove, false);

//  setup a camera that points to the origin
var camera = new THREE.PerspectiveCamera(FOV,WIDTH/HEIGHT,NEAR,FAR);
camera.position.set(camera_pos.x, camera_pos.y, camera_pos.z);
camera.lookAt(new THREE.Vector3(0,0,0));

//  create a basic scene and add the camera
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
        console.log(intersects[0].object.mars_name);
        console.log(intersects[0].object);
        scene.remove(scene.getObjectByName('highlight'));
        highlightPoint(intersects[0].object);
    }
    // console.log("cam x: " + camera.position.x + ", cam y: " + camera.position.y + ", cam z: " + camera.position.z);
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
    $('.pointDetails').fadeOut('fast', function() {
        if(point.mars_img) {
            $('#pointImg img').attr('src', '/img/' + point.mars_img);
        } else {
            $('#pointImg img').attr('src', '');
        }
        if(point.mars_caption) {
            $('#pointImg div').text(point.mars_caption);
        } else {
            $('#pointImg div').text('');
        }
        $('#pointInfo h4').text(point.mars_name);
        $('#pointInfo div').text(point.mars_description);
        $(this).fadeIn('fast');
        $('.closeSpan').fadeIn('fast');
    });
}

$('.closeSpan').click(function() {
    scene.remove(scene.getObjectByName('highlight'));
    $('.pointDetails').fadeOut('fast'); 
});

//  Points of interest to display on the globe
var points = [
    {
        name: 'Airy-0 crater',
        description: 'This crater defines the prime meridian, or line of zero longitude, on Mars.\n\nIt was named after the Astronomer Royal Sir George Biddell Airy, whose telescope at Greenwich observatory in London came to define the prime meridian on Earth.',
        type: 'geography',
        img: 'point_Airy0.jpg',
        caption: 'Airy-0 crater, as seen by the Mars Global Surveyor orbiter in 2001.',
        lat: -5.1,
        long: 0
    },
    {
        name: 'Olympus Mons',
        description: 'The tallest mountain in the solar system, standing nearly 14 miles above its surroundings.',
        type: 'geography',
        img: 'point_Olympus.jpg',
        caption: "Olympus Mons, as seen by Viking 1 in 1978.\n\nThe outer 'scarp' ringing the volcano is about 340 miles in diameter.",
        lat: 18.4,
        long: 226.5
    },
    {
        name: 'Isidis Planitia',
        description: "A vast plain in one of Mars' three particularly evident ancient 'impact basins', formed around 4 billion years ago in a collision with a large (probably about 30 miles in diameter) asteroid or comet.",
        type: 'geography',
        img: 'point_Isidis.jpg',
        caption: "Detail of a southern area within Isidis Planitia, thought to potentially indicate an ancient shoreline from Mars' watery past.",
        lat: 12.9,
        long: 87
    },
    {
        name: 'Hellas Planitia',
        description: 'Hellas basin is thought to be the largest known visible impact crater in the Solar System, with a diameter of around 1,400 miles.',
        type: 'geography',
        img: 'point_Hellas.jpg',
        caption: "The floor of Hellas crater is about 5.6 miles deep, with an atmospheric pressure more than twice that at the Martian datum (the equivalent of 'sea level').",
        lat: -42.4,
        long: 70.5
    },
    {
        name: 'North polar cap',
        description: "Mars' northern ice cap is largely formed of water ice.\n\nIn winter, this becomes covered by a layer of carbon dioxide frozen from the Martian atmosphere, which then sublimes back to a gas in the higher temperatures of the Martian summer.",
        type: 'geography',
        img: 'point_NorthCap.jpg',
        caption: "Mars' North pole in summer, at near-minimum ice levels.\n\nThe permanent ice cap shown here is around 620 miles in diameter.",
        lat: 90,
        long: 0
    },
    {
        name: 'South polar cap',
        description: "Mars' permanent south polar ice cap is considerably smaller than that at the north pole.\n\nDue to Mars' relatively eccentric (ie more oval than circular) oribt around the sun, winters in the southern hemisphere are however longer and colder than those in the north.",
        type: 'geography',
        img: 'point_SouthCap.jpg',
        caption: "Surface features known as 'Spiders', in Mars' far South.\n\nThese distinctive patterns form as dust is deposited by frozen carbon dioxide subliming back to a gas, whilst trapped under ice.",
        lat: -90,
        long: 0
    },
    {
        name: 'Valles Marineris',
        description: "This gigantic canyon system stretches for around 2,500 miles, dwarfing the 277 mile-long Grand Canyon on Earth.\n\nIt was discovered by (and takes its name from) NASA's Mariner 9 orbiter, which reached Mars in 1971 and became the first spacecraft to oribt a planet other than the Earth.",
        type: 'geography',
        img: 'point_Valles.jpg',
        caption: 'Recurring slope lineae in Valles Marineris.\n\nThese stripy features are believed to result from seasonal flows of liquid saltwater at warmer times of the Martian year.',
        lat: -9.9,
        long: 287
    },
    {
        name: 'Tharsis Montes',
        description: "The Tharsis Montes is a chain of three large shield volcanoes named (from southwest to northeast) Arsia Mons, Pavonis Mons and Ascraeus Mons.\n\nEach of these would utterly dwarf even the tallest mountains on Earth.",
        type: 'geography',
        img: 'point_Pavonis.jpg',
        caption: 'The summit caldera of Pavonis Mons.\n\nThe central crater is about 28 miles across and 2.8 miles deep.',
        lat: 1.3,
        long: 247.2
    },
    {
        name: 'Beagle 2',
        description: 'Landing site of the British spacecraft that failed to operate after landing, on Christmas Day 2003.\n\nIts fate was unknown at the time, until spotted by the Mars Reconnaissance Orbiter in late 2014.',
        type: 'mission',
        img: 'point_Beagle2.jpg',
        caption: 'On its rediscovery more than a decade after failing to communicate from the Martian surface, it was revealed that Beagle 2 had come agonizingly close to success - achieving a soft landing and a partial deployment to its operating configuration.',
        lat: 11.31,
        long: 90.25
    },
    {
        name: 'Viking 1',
        description: "NASA's Viking 1 mission included both an orbiter and a lander component.\n\nThe lander was the first vehicle to succesfully achieve a soft landing on Mars and complete its objectives, touching down here on July 20, 1976.",
        type: 'mission',
        img: 'point_Viking1.jpg',
        caption: 'The Viking 1 orbiter, which continued to return images until 1980.\n\nAfter the end of its mission it was left in a decaying orbit and may by now have crashed onto the planet, though it is thought more likely that this is yet to happen.',
        lat: 22.27,
        long: 312.05
    },
    {
        name: 'Mars 2',
        description: "The Soviet Union's Mars 2 probe was the first man-made object to reach the surface of Mars, on November 27 1971.\n\nUnfortunately the descent module's parachute failed to deploy and it is presumed to have been destroyed on impact.",
        type: 'mission',
        img: 'point_Mars2.jpg',
        caption: "A model of the Mars 2 lander in Moscow's Memorial Museum of Cosmonautics.\n\nThe orbiter component of the mission, on which the lander was mounted in transit, operated successfully - and remains in orbit today.",
        lat: -45,
        long: 47
    },
    {
        name: 'Mars 3',
        description: "Running from 1960 to 1973, the Soviet Mars programme suffered a very high failure rate - but their Mars 3 probe can claim mankind's first (and to date Russia's only) successful soft landing on Mars.\n\nUnforunately however it failed after just 14.5 seconds, having returned just one partial image.",
        type: 'mission',
        img: 'point_Mars3.png',
        caption: 'The first photograph ever returned from the surface of another planet.\n\nAccording to the Soviet Academy of Sciences, the image contains no horizon, terrain features or other usable information - just noise.',
        lat: -45,
        long: 202
    },
    {
        name: 'Curiosity',
        description: "The landing site of NASA's most recent and most scientifically capable rover mission to date.\n\nCuriosity touched down on August 6, 2012, and continues to return valuable scientific data.",
        type: 'mission',
        img: 'point_Curiosity.jpg',
        caption: "A section of a selfie taken by Curiosity's 'Mars Hand Lens Imager' instrument on August 5, 2015.",
        lat: -4.59,
        long: 137.44
    },
    {
        name: 'Pathfinder',
        description: "The 1996-97 Mars Pathfinder mission was made up of a lander, called the 'Carl Sagan Memorial Station', and a small 10.5kg rover named 'Sojourner'.",
        type: 'mission',
        img: 'point_Pathfinder.jpg',
        caption: 'Sojourner rover collecting an Alpha Particle X-ray Spectrometry measurement of a basaltic rock, a few metres away from the Pathfinder lander.',
        lat: 19.75,
        long: 326.9
    },
    {
        name: 'Spirit',
        description: "The second of NASA's pair of Mars Exploration Rovers touched down here in early 2004.\n\nAfter 5 years and 4 months of successful exploration, Spirit became stuck and immobilized in May 2009 and eventually stopped communicating the following year.",
        type: 'mission',
        img: 'point_Spirit.jpg',
        caption: 'A Delta II rocket with Spirit on board lifts off from Cape Canaveral on June 10, 2003, to begin the 6 months-long trip to Mars.',
        lat: -14.57,
        long: 175.47
    },
    {
        name: 'Opportunity',
        description: "NASA's pair of Mars Exploration Rovers (MERs) were each planned to operate for 90 sols (about 92 Earth days).\n\nInstead, Spirit managed over 2,200 sols before getting stuck - and at the time of writing Opportunity is still going strong, over 14 years later.",
        type: 'mission',
        img: 'point_Opportunity.jpg',
        caption: 'Each MER stands around 1.5 metres high and weighs about 180kg.\n\nOpportunity has so far travelled over 28 miles, with a top speed of about 5cm per second.',
        lat: -1.95,
        long: 354.47
    }

];