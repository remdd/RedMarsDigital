var gameEffects = new Howl({
	src: ['snd/GameEffects3.ogg', 'snd/GameEffects3.mp3'],
	volume: 0.6,
	sprite: {
		playerDamage: [0, 750],
		criticalHit: [1000, 750],
		playerDeath: [2000, 1500],
		badMushroom: [4000, 750],
		goodMushroom: [5000, 750],
		healthHeart: [6000, 750],
		playerItem: [7000, 1000],
		door1: [8500, 1000],
		door2: [10000, 1000],
		trapdoor: [11500, 2000],
		swish1: [13500, 750],
		swish2: [14500, 750],
		exitKey: [15500, 750],
		startCoin: [16500, 750],
		crossbow: [17500, 750],
		bigSwish1: [18500, 750],
		bigSwish2: [19500, 750],
		littleSwish1: [20500, 750],
		littleSwish2: [21500, 750],
		menuChange: [22500, 750],
		gem1: [23500, 750],
		gem2: [24500, 750],
		gem3: [25500, 750],
		gem4: [26500, 750],
		charmed: [27500, 750],
		menuAccept: [23500, 750],	//	copy of gem1
		goldHeart: [29500, 500]
	}
});

var urkGrunts = new Howl({
	src: ['snd/Urk3.ogg', 'snd/Urk3.mp3'],
	volume: 0.6,
	sprite: {
		grunt1: [0, 500],
		grunt2: [1500, 500],
		grunt3: [3000, 500],
		grunt4: [4500, 500],
		grunt5: [6000, 500],
		grunt6: [7500, 500],
		grunt7: [9000, 500],
		death1: [10500, 1000],
		death2: [12500, 1000]
	}
});

var goblinNoises = new Howl({
	src: ['snd/Goblins4.ogg', 'snd/Goblins4.mp3'],
	volume: 0.5,
	sprite: {
		noise1: [0, 500],
		noise2: [1000, 500],
		noise3: [2000, 500],
		noise4: [3000, 500],
		noise5: [4000, 500],
		noise6: [5000, 500],
		death1: [6000, 500],
		death2: [7000, 750],
		death3: [8000, 750]
	}
});


var hulkingUrkGrunts = new Howl({
	src: ['snd/HulkingUrk.ogg', 'snd/HulkingUrk.mp3'],
	volume: 0.8,
	sprite: {
		grunt1: [0, 1500],
		grunt2: [2000, 1500],
		grunt3: [4000, 1500],
		grunt4: [6000, 1500],
		grunt5: [8000, 1500],
		death: [10000, 2000],
		bezerk1: [12500, 1500],
		bezerk2: [14500, 1500]
	}
});

var sludgieNoises = new Howl({
	src: ['snd/Sludgie3.ogg', 'snd/Sludgie3.mp3'],
	volume: 1,
	sprite: {
		noise1: [0, 300],
		noise2: [1000, 200],
		noise3: [2000, 200],
		noise4: [3000, 200],
		noise5: [4000, 200],
		death1: [5000, 1250],
		death2: [6500, 1250]
	}
});

var skeltonNoises = new Howl({
	src: ['snd/Skelton.ogg', 'snd/Skelton.mp3'],
	volume: 0.6,
	sprite: {
		noise1: [0, 1000],
		noise2: [1000, 1000],
		noise3: [2000, 1000],
		noise4: [3000, 1000],
		death1: [4000, 1500]
	}
});


var grimlinNoises = new Howl({
	src: ['snd/Grimlin2.ogg', 'snd/Grimlin2.mp3'],
	volume: 0.9,
	sprite: {
		noise1: [0, 500],
		noise2: [1000, 500],
		noise3: [2000, 500],
		noise4: [3000, 500],
		noise5: [4000, 500],
		death1: [5000, 750],
		death2: [6000, 750],
		bite1: [7000, 500],
		bite2: [8000, 500],
		bite3: [9000, 500]
	}
});

var campVampNoises = new Howl({
	src: ['snd/CampVamp2.ogg', 'snd/CampVamp2.mp3'],
	volume: 0.5,
	sprite: {
		noise1: [0, 800],
		noise2: [1000, 800],
		noise3: [2000, 800],
		noise4: [3000, 800],
		noise5: [4000, 800],
		noise6: [5000, 800],
		death: [6000, 1500]
	}
});

var ogrNoises = new Howl({
	src: ['snd/Ogr2.ogg', 'snd/Ogr2.mp3'],
	volume: 0.8,
	sprite: {
		noise1: [0, 800],
		noise2: [1500, 1200],
		noise3: [3000, 1200],
		noise4: [4500, 1200],
		noise5: [6000, 1200],
		death: [7500, 1500]
	}
});

var squarkNoises = new Howl({
	src: ['snd/Squark3.ogg', 'snd/Squark3.mp3'],
	volume: 0.3,
	sprite: {
		noise1: [0, 1200],
		noise2: [1500, 1200],
		noise3: [3000, 1200],
		noise4: [4500, 1200],
		noise5: [6000, 1200],
		death: [7500, 2500]
	}
});

var rockoNoises = new Howl({
	src: ['snd/Rocko2.ogg', 'snd/Rocko2.mp3'],
	volume: 0.8,
	sprite: {
		noise1: [0, 700],
		noise2: [1000, 700],
		noise3: [2000, 700],
		noise4: [3000, 700],
		noise5: [4000, 700],
		noise6: [5000, 700],
		noise7: [6000, 700],
		noise8: [7000, 700],
		death1: [8000, 1750],
		death2: [10000, 1750]
	}
});

var pebblNoises = new Howl({
	src: ['snd/Pebbl.ogg', 'snd/Pebbl.mp3'],
	volume: 0.7,
	sprite: {
		noise1: [0, 700],
		noise2: [1000, 700],
		noise3: [2000, 700],
		noise4: [3000, 700],
		noise5: [4000, 700],
		noise6: [5000, 700],
		noise7: [6000, 700],
		noise8: [7000, 700],
		death1: [8000, 1750],
		death2: [10000, 1750]
	}
});

var kobNoises = new Howl({
	src: ['snd/Kobs4.ogg', 'snd/Kobs4.mp3'],
	volume: 0.5,
	sprite: {
		noise1: [0, 700],
		noise2: [1000, 700],
		noise3: [2000, 700],
		noise4: [3000, 700],
		noise5: [4000, 700],
		death1: [5000, 1250],
		death2: [6500, 1250],
	}
});

var miniKobNoises = new Howl({
	src: ['snd/MiniKobs.ogg', 'snd/MiniKobs.mp3'],
	volume: 0.4,
	sprite: {
		noise1: [0, 700],
		noise2: [1000, 700],
		noise3: [2000, 700],
		noise4: [3000, 700],
		noise5: [4000, 700],
		death1: [5000, 1250],
		death2: [6500, 1250],
	}
});

var gigaKobNoises = new Howl({
	src: ['snd/GigaKob.ogg', 'snd/GigaKob.mp3'],
	volume: 0.8,
	sprite: {
		noise1: [0, 1200],
		noise2: [1500, 1200],
		noise3: [3000, 1200],
		noise4: [4500, 1200],
		noise5: [6000, 1200],
		death1: [7500, 2000],
		death2: [10000, 2200]
	}
});


var zombiMasterNoises = new Howl({
	src: ['snd/ZombiMaster.ogg', 'snd/ZombiMaster.mp3'],
	volume: 0.9,
	sprite: {
		noise1: [0, 750],
		noise2: [1000, 750],
		noise3: [2000, 750],
		noise4: [3000, 750],
		death: [4000, 1000]
	}
});


var zombiNoises = new Howl({
	src: ['snd/Zombis.ogg', 'snd/Zombis.mp3'],
	volume: 0.2,
	sprite: {  
		noise1: [0, 1500],
		noise2: [2000, 1500],
		noise3: [4000, 1500],
		noise4: [6000, 1500], 
		noise5: [8000, 1500],
		noise6: [10000, 1500],
		death1: [12000, 1500],
		death2: [14000, 1500],
		death3: [16000, 1500],
		death4: [18000, 1500],
		bite1: [20000, 1000],
		bite2: [21500, 1000],
		bite3: [23000, 1000],
		bite4: [24500, 1000]
	}
});

var impBites = new Howl({
	src: ['snd/impBites2.ogg', 'snd/impBites2.mp3'],
	volume: 0.7,
	sprite: {
		bite1: [0, 500],
		bite2: [1000, 500],
		bite3: [2000, 500],
		bite4: [3000, 500],
		bite5: [4000, 500],
		bite6: [5000, 500]
	}
});

var badbugNoises = new Howl({
	src: ['snd/Badbugs2.ogg', 'snd/Badbugs2.mp3'],
	volume: 0.7,
	sprite: {
		movement1: [0,750],
		movement2: [1000,750],
		movement3: [2000,750],
		hit1: [3000,750],
		hit2: [4000,750],
		hit3: [5000,750],
		hit4: [6000,750],
		bite1: [7000,750],
		bite2: [8000,750],
		bite3: [9000,750],
		bite4: [10000,750],
		death1: [11000,750],
		death2: [12000,750],
		death3: [13000,750]
	}
});

var creatureSounds1 = new Howl({
	src: ['snd/creatureSounds1b.ogg', 'snd/creatureSounds1b.mp3'],
	volume: 0.6,
	sprite: {
		teleport1: [0, 1000],
		teleport2: [1500, 750],
		fireballShoot1: [2500, 1000],
		fireballShoot2: [4000, 1000],
		fireballShoot3: [5500, 1000],
		fireballHit1: [7000, 1000],
		fireballHit2: [8500, 1000],
		fireballHit3: [10000, 1000],
		waterballHit1: [11500, 1000],
		waterballHit2: [13000, 1000],
		waterballHit3: [14500, 1000],
		summonImp: [16000, 1000],
		mumiDeath: [17500, 2000],
		elementalDeath1: [20500, 1500],
		elementalDeath2: [22500, 1500],
		summonElemental: [24500, 1500],
		squarkKnife1: [26500, 500],
		squarkKnife2: [27500, 500],
		impDeath: [28500, 1000]
	}
});

var creatureSounds2 = new Howl({
	src: ['snd/creatureSounds2.ogg', 'snd/creatureSounds2.mp3'],
	volume: 0.6,
	sprite: {
		redWizDeath: [0,2500],
		blackWizDeath: [3000,2500],
		zombiMasterDeath: [6000,2500],
		blackKnightDeath: [9000,2500],
		baronDeath: [12000,3500],
		genericHit1: [16000, 500],
		genericHit2: [17000, 500],
		ghostVanish: [18000, 1200],
		ghostDamage: [19500,1200],
		ghostDeath: [21000,750],
		lightningShoot1: [22000,750],
		lightningShoot2: [23000,750],
		lightningShoot3: [24000,750],
		lightningHit1: [25000,1200],
		lightningHit2: [26500,750],
		lightningHit3: [27500,1250],
		lightningHit4: [29000,1500]
	}
});

var bgMusic = new Howl({
	src: ['snd/bgMusic.ogg', 'snd/bgMusic.mp3'],
	loop: true,
	volume: 1,
	html5: true,
	preload: false,
	sprite: {
		music1: [0, 166957],
		music2: [170000, 160000],
		music3: [335000, 160000],
		music4: [498000, 160000]
	},
	onfaded: function() {
		if(this.volume <= 0) {
			this.stop();
		}
	},
	onload: function() {
		//	Show game start screen on load
		playerName();
	}
});

var titleLoop = new Howl({
	src: ['snd/TitleLoop2.ogg', 'snd/TitleLoop2.mp3'],
	loop: true,
	volume: 1,
	html5: true,
	sprite: {
		titles: [0, 20000]
	},
	onfaded: function() {
		if(this.volume <= 0) {
			this.stop();
		}
	}
});

var victoryLoop = new Howl({
	src: ['snd/victoryLoop.ogg', 'snd/victoryLoop.mp3'],
	loop: true,
	volume: 0.6,
	html5: true,
	sprite: {
		victory: [0,69818]
	},
	onfaded: function() {
		if(this.volume <= 0) {
			this.stop();
		}
	}
});

function playMusic(level) {
	switch(level) {
		case 'titles': {
			if(bgMusic.playing()) {
				bgMusic.stop();
			} else if(victoryLoop.playing()) {
				victoryLoop.stop();
			}
			titleLoop.play('titles');
			titleLoop.volume(0);
			titleLoop.fade(0, session.vars.musicVol, 0);
			break;
		}
		case 1: {
			if(titleLoop.playing()) {
				titleLoop.stop();
			} else if(victoryLoop.playing()) {
				victoryLoop.stop();
			} else if(bgMusic.playing()) {
				bgMusic.stop();
			}
			bgMusic.play('music1');
			bgMusic.volume(0);
			bgMusic.fade(0, session.vars.musicVol, 2000);
			break;
		}
		case 2: {
			if(titleLoop.playing()) {
				titleLoop.stop();
			} else if(victoryLoop.playing()) {
				victoryLoop.stop();
			} else if(bgMusic.playing()) {
				bgMusic.stop();
			}
			bgMusic.play('music2');
			bgMusic.volume(0);
			bgMusic.fade(0, session.vars.musicVol, 2000);
			break;
		}
		case 3: {
			if(titleLoop.playing()) {
				titleLoop.stop();
			} else if(victoryLoop.playing()) {
				victoryLoop.stop();
			} else if(bgMusic.playing()) {
				bgMusic.stop();
			}
			bgMusic.play('music3');
			bgMusic.volume(0);
			bgMusic.fade(0, session.vars.musicVol, 2000);
			break;
		}
		case 4: {
			if(titleLoop.playing()) {
				titleLoop.stop();
			} else if(victoryLoop.playing()) {
				victoryLoop.stop();
			} else if(bgMusic.playing()) {
				bgMusic.stop();
			}
			bgMusic.play('music4');
			bgMusic.volume(0);
			bgMusic.fade(0, session.vars.musicVol, 2000);
			break;
		}
		case 'victory': {
			if(bgMusic.playing()) {
				bgMusic.stop();
			}
			victoryLoop.play('victory');
			bgMusic.volume(session.vars.musicVol);
			break;
		}
		default: {
			break;
		}
	}
}

function playSwish(size) {
	if(size === "big") {
		var snd = Math.floor(Math.random() * 2);
		if(snd < 1) {
			gameEffects.play('bigSwish1');
		} else {
			gameEffects.play('bigSwish1');
		}
	} else if(size === "little") {
		var snd = Math.floor(Math.random() * 2);
		if(snd < 1) {
			gameEffects.play('littleSwish1');
		} else {
			gameEffects.play('littleSwish1');
		}
	} else {
		var snd = Math.floor(Math.random() * 2);
		if(snd < 1) {
			gameEffects.play('swish1');
		} else {
			gameEffects.play('swish1');
		}
	}
}

function playUrkGrunt(death) {
	if(death) {
		var snd = Math.floor(Math.random() * 2);
		if(snd < 1) {
			urkGrunts.play('death1');
		} else {
			urkGrunts.play('death2');
		}
	} else {
		var snd = Math.floor(Math.random() * 7);
		if(snd < 1) {
			urkGrunts.play('grunt1');
		} else if(snd < 2) {
			urkGrunts.play('grunt2');
		} else if(snd < 3) {
			urkGrunts.play('grunt3');
		} else if(snd < 4) {
			urkGrunts.play('grunt4');
		} else if(snd < 5) {
			urkGrunts.play('grunt5');
		} else if(snd < 6) {
			urkGrunts.play('grunt6');
		} else {
			urkGrunts.play('grunt7');
		}
	}
}


function playKobNoise(death) {
	if(death) {
		var snd = Math.floor(Math.random() * 2);
		if(snd < 1) {
			kobNoises.play('death1');
		} else {
			kobNoises.play('death2');
		}
	} else {
		var snd = Math.floor(Math.random() * 5);
		if(snd < 1) {
			kobNoises.play('noise1');
		} else if(snd < 2) {
			kobNoises.play('noise2');
		} else if(snd < 3) {
			kobNoises.play('noise3');
		} else if(snd < 4) {
			kobNoises.play('noise4');
		} else {
			kobNoises.play('noise5');
		}
	}
}

function playGoblinNoise(death) {
	if(death) {
		var snd = Math.floor(Math.random() * 3);
		if(snd < 1) {
			goblinNoises.play('death1');
		} else if(snd < 2) {
			goblinNoises.play('death2');
		} else {
			goblinNoises.play('death3');
		}
	} else {
		var snd = Math.floor(Math.random() * 6);
		if(snd < 1) {
			goblinNoises.play('noise1');
		} else if(snd < 2) {
			goblinNoises.play('noise2');
		} else if(snd < 3) {
			goblinNoises.play('noise3');
		} else if(snd < 4) {
			goblinNoises.play('noise4');
		} else if(snd < 5) {
			goblinNoises.play('noise5');
		} else {
			goblinNoises.play('noise6');
		}
	}
}

function playMiniKobNoise(death) {
	if(death) {
		var snd = Math.floor(Math.random() * 2);
		if(snd < 1) {
			miniKobNoises.play('death1');
		} else {
			miniKobNoises.play('death2');
		}
	} else {
		var snd = Math.floor(Math.random() * 5);
		if(snd < 1) {
			miniKobNoises.play('noise1');
		} else if(snd < 2) {
			miniKobNoises.play('noise2');
		} else if(snd < 3) {
			miniKobNoises.play('noise3');
		} else if(snd < 4) {
			miniKobNoises.play('noise4');
		} else {
			miniKobNoises.play('noise5');
		}
	}
}

function playGigaKobNoise(death) {
	if(death) {
		var snd = Math.floor(Math.random() * 2);
		if(snd < 1) {
			gigaKobNoises.play('death1');
		} else {
			gigaKobNoises.play('death2');
		}
	} else {
		var snd = Math.floor(Math.random() * 5);
		if(snd < 1) {
			gigaKobNoises.play('noise1');
		} else if(snd < 2) {
			gigaKobNoises.play('noise2');
		} else if(snd < 3) {
			gigaKobNoises.play('noise3');
		} else if(snd < 4) {
			gigaKobNoises.play('noise4');
		} else {
			gigaKobNoises.play('noise5');
		}
	}
}

function playImpBite() {
	var snd = Math.floor(Math.random() * 6);
	if(snd < 1) {
		impBites.play('bite1');
	} else if(snd < 2) {
		impBites.play('bite2');
	} else if(snd < 3) {
		impBites.play('bite3');
	} else if(snd < 4) {
		impBites.play('bite4');
	} else if(snd < 5) {
		impBites.play('bite5');
	} else {
		impBites.play('bite6');
	}
}

function playSquarkNoise(death) {
	if(death) {
		squarkNoises.play('death');
	} else {
		var snd = Math.floor(Math.random() * 5);
		if(snd < 1) {
			squarkNoises.play('noise1');
		} else if(snd < 2) {
			squarkNoises.play('noise2');
		} else if(snd < 3) {
			squarkNoises.play('noise3');
		} else if(snd < 4) {
			squarkNoises.play('noise4');
		} else {
			squarkNoises.play('noise5');
		}
	}
}

function playSludgieNoise(death) {
	if(death) {
		var snd = Math.floor(Math.random() * 2);
		if(snd < 1) {
			sludgieNoises.play('death1');
		} else {
			sludgieNoises.play('death2');
		}
	} else {
		var snd = Math.floor(Math.random() * 4);
		if(snd < 1) {
			sludgieNoises.play('noise1');
		} else if(snd < 2) {
			sludgieNoises.play('noise2');
		} else if(snd < 3) {
			sludgieNoises.play('noise3');
		} else {
			sludgieNoises.play('noise4');
		}
	}
}

function playRockoNoise(death) {
	if(death) {
		var snd = Math.floor(Math.random() * 2);
		if(snd < 1) {
			rockoNoises.play('death1');
		} else {
			rockoNoises.play('death2');
		}
	} else {
		var snd = Math.floor(Math.random() * 8);
		if(snd < 1) {
			rockoNoises.play('noise1');
		} else if(snd < 2) {
			rockoNoises.play('noise2');
		} else if(snd < 3) {
			rockoNoises.play('noise3');
		} else if(snd < 4) {
			rockoNoises.play('noise4');
		} else if(snd < 5) {
			rockoNoises.play('noise5');
		} else if(snd < 6) {
			rockoNoises.play('noise6');
		} else if(snd < 7) {
			rockoNoises.play('noise7');
		} else {
			rockoNoises.play('noise8');
		}
	}
}

function playPebblNoise(death) {
	if(death) {
		var snd = Math.floor(Math.random() * 2);
		if(snd < 1) {
			pebblNoises.play('death1');
		} else {
			pebblNoises.play('death2');
		}
	} else {
		var snd = Math.floor(Math.random() * 8);
		if(snd < 1) {
			pebblNoises.play('noise1');
		} else if(snd < 2) {
			pebblNoises.play('noise2');
		} else if(snd < 3) {
			pebblNoises.play('noise3');
		} else if(snd < 4) {
			pebblNoises.play('noise4');
		} else if(snd < 5) {
			pebblNoises.play('noise5');
		} else if(snd < 6) {
			pebblNoises.play('noise6');
		} else if(snd < 7) {
			pebblNoises.play('noise7');
		} else {
			pebblNoises.play('noise8');
		}
	}
}

function playGrimlinNoise(death, bite) {
	if(death) {
		var snd = Math.floor(Math.random() * 2);
		if(snd < 1) {
			grimlinNoises.play('death1');
		} else {
			grimlinNoises.play('death2');
		}
	} else if(bite) {
		var snd = Math.floor(Math.random() * 3);
		if(snd < 1) {
			grimlinNoises.play('bite1');
		} else if(snd < 2) {
			grimlinNoises.play('bite2');
		} else {
			grimlinNoises.play('bite3');
		}
	} else {
		var snd = Math.floor(Math.random() * 5);
		if(snd < 1) {
			grimlinNoises.play('noise1');
		} else if(snd < 2) {
			grimlinNoises.play('noise2');
		} else if(snd < 3) {
			grimlinNoises.play('noise3');
		} else if(snd < 4) {
			grimlinNoises.play('noise4');
		} else {
			grimlinNoises.play('noise5');
		}
	}
}

function playZombiNoise(death, bite) {
	if(death) {
		var snd = Math.floor(Math.random() * 4);
		if(snd < 1) {
			zombiNoises.play('death1');
		} else if(snd < 2) {
			zombiNoises.play('death2');
		} else if(snd < 3) {
			zombiNoises.play('death3');
		} else {
			zombiNoises.play('death4');
		}
	} else if(bite) {
		var snd = Math.floor(Math.random() * 4);
		if(snd < 1) {
			zombiNoises.play('bite1');
		} else if(snd < 2) {
			zombiNoises.play('bite2');
		} else if(snd < 3) {
			zombiNoises.play('bite3');
		} else {
			zombiNoises.play('bite4');
		}
	} else {
		var snd = Math.floor(Math.random() * 6);
		if(snd < 1) {
			zombiNoises.play('noise1');
		} else if(snd < 2) {
			zombiNoises.play('noise2');
		} else if(snd < 3) {
			zombiNoises.play('noise3');
		} else if(snd < 4) {
			zombiNoises.play('noise4');
		} else if(snd < 5) {
			zombiNoises.play('noise5');
		} else {
			zombiNoises.play('noise6');
		}
	}
}

function playBadbugNoise(movement, hit, bite, death) {
	if(movement) {
		var snd = Math.floor(Math.random() * 3);
		if(snd < 1) {
			badbugNoises.play('movement1');
		} else if(snd < 2) {
			badbugNoises.play('movement2');
		} else {
			badbugNoises.play('movement3');
		}
	} else if(hit) {
		var snd = Math.floor(Math.random() * 4);
		if(snd < 1) {
			badbugNoises.play('hit1');
		} else if(snd < 2) {
			badbugNoises.play('hit2');
		} else if(snd < 3) {
			badbugNoises.play('hit3');
		} else {
			badbugNoises.play('hit4');
		}
	} else if(bite) {
		var snd = Math.floor(Math.random() * 4);
		if(snd < 1) {
			badbugNoises.play('bite1');
		} else if(snd < 2) {
			badbugNoises.play('bite2');
		} else if(snd < 3) {
			badbugNoises.play('bite3');
		} else {
			badbugNoises.play('bite4');
		}
	} else if(death) {
		var snd = Math.floor(Math.random() * 3);
		if(snd < 1) {
			badbugNoises.play('death1');
		} else if(snd < 2) {
			badbugNoises.play('death2');
		} else {
			badbugNoises.play('death3');
		}
	}
}

function playHulkingUrkGrunt(death, bezerk) {
	if(death) {
		hulkingUrkGrunts.play('death');
	} else if(bezerk) {
		var snd = Math.floor(Math.random() * 2);
		if(snd < 1) {
			hulkingUrkGrunts.play('bezerk1');
		} else {
			hulkingUrkGrunts.play('bezerk2');
		}
	} else {
		var snd = Math.floor(Math.random() * 5);
		if(snd < 1) {
			hulkingUrkGrunts.play('grunt1');
		} else if(snd < 2) {
			hulkingUrkGrunts.play('grunt2');
		} else if(snd < 3) {
			hulkingUrkGrunts.play('grunt3');
		} else if(snd < 4) {
			hulkingUrkGrunts.play('grunt4');
		} else {
			hulkingUrkGrunts.play('grunt5');
		}
	}
}

function shootFireballSound() {
	var snd = Math.floor(Math.random() * 3);
	if(snd < 1) {
		creatureSounds1.play('fireballShoot1');
	} else if(snd < 2) {
		creatureSounds1.play('fireballShoot2');
	} else {
		creatureSounds1.play('fireballShoot3');
	}
}

function shootLightningSound() {
	var snd = Math.floor(Math.random() * 3);
	if(snd < 1) {
		creatureSounds2.play('lightningShoot1');
	} else if(snd < 2) {
		creatureSounds2.play('lightningShoot2');
	} else {
		creatureSounds2.play('lightningShoot3');
	}
}

function fireballHitSound() {
	var snd = Math.floor(Math.random() * 3);
	if(snd < 1) {
		creatureSounds1.play('fireballHit1');
	} else if(snd < 2) {
		creatureSounds1.play('fireballHit2');
	} else {
		creatureSounds1.play('fireballHit3');
	}
}

function waterballHitSound() {
	var snd = Math.floor(Math.random() * 3);
	if(snd < 1) {
		creatureSounds1.play('waterballHit1');
	} else if(snd < 2) {
		creatureSounds1.play('waterballHit2');
	} else {
		creatureSounds1.play('waterballHit3');
	}
}

function lightningHitSound() {
	var snd = Math.floor(Math.random() * 4);
	if(snd < 1) {
		creatureSounds2.play('lightningHit1');
	} else if(snd < 2) {
		creatureSounds2.play('lightningHit2');
	} else if(snd < 3) {
		creatureSounds2.play('lightningHit3');
	} else {
		creatureSounds2.play('lightningHit4');
	}
}

