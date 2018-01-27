var creatureTemplates = [
	{},			//	Template 0 is not used - indicates no creature!

	//	1	GREEN GOBLIN
	{
		name: 'Green Goblin',
		lode: EnumLode.NONE,
		currentSprite: { x: 0, y: 0},
		vars: {
			speed: 0.6,
			maxHP: 3,
			currentHP: 3,
			score: 45
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 0 },	//	Facing R 1
				{ x: 1, y: 0 },	//	Facing R 2
				{ x: 2, y: 0 },	//	Facing R 3
				{ x: 3, y: 0 },	//	Facing R 4
				{ x: 0, y: 1 },	//	Facing L 1
				{ x: 1, y: 1 },	//	Facing L 2
				{ x: 2, y: 1 },	//	Facing L 3
				{ x: 3, y: 1 },	//	Facing L 4
				{ x: 4, y: 0 },	//	Death facing R 1
				{ x: 5, y: 0 },	//	Death facing R 2
				{ x: 4, y: 1 },	//	Death facing L 1
				{ x: 5, y: 1 }	//	Death facing L 2
			],
			animations: [
				[ 800, [600, 800], [ 0, 1] ],												//	Resting, facing R
				[ 800, [600, 800], [ 4, 5] ],												//	Resting, facing L
				[ 250, [50, 100, 150, 200, 250], [ 0, 1, 2, 3, 1 ] ],						//	Moving, facing R
				[ 250, [50, 100, 150, 200, 250], [ 4, 5, 6, 7, 5 ] ],						//	Moving, facing L
				[ 1000, [500, 1000], [8, 9] ],												//	Death, facing R
				[ 1000, [500, 1000], [10, 11] ]												//	Death, facing L
			]
		},
		box: {
			width: 10, 
			height: 10
		},
		ai: {
			type: EnumAi.GREEN_GOBLIN,
		},
		movement: {
			bounceOff: true,
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				playGoblinNoise();
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			playGoblinNoise(true);
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.GREEN_GOBLIN_CLAW;
		}	
	},

	//	2	MINI GHOST
	{
		name: 'Mini Ghost',
		lode: EnumLode.SHADOW,
		currentSprite: { x: 0, y: 2},
		vars: {
			speed: 0.2,
			maxHP: 1,
			currentHP: 1,
			moveThroughColliders: true,
			touchDamage: true,
			invisible: false,
			foreground: true,
			score: 100
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 2 },
				{ x: 1, y: 2 },
				{ x: 2, y: 2 },
				{ x: 0, y: 3 },
				{ x: 1, y: 3 },
				{ x: 2, y: 3 },
				{ x: 3, y: 2 },
				{ x: 4, y: 2 },
				{ x: 5, y: 2 },
				{ x: 3, y: 3 },
				{ x: 4, y: 3 },
				{ x: 5, y: 3 },
				{ x: 0, y: 7 },			//	Empty frame!
				{ x: 6, y: 2 },
				{ x: 7, y: 2 },
				{ x: 8, y: 2 },
				{ x: 6, y: 3 },
				{ x: 7, y: 3 },
				{ x: 8, y: 3 }
			],
			animations: [
				[ 400, [100, 200, 300, 400], [1, 2, 1, 0] ],						//	Resting, facing R
				[ 400, [100, 200, 300, 400], [4, 5, 4, 3] ],						//	Resting, facing L
				[ 400, [100, 200, 300, 400], [1, 2, 1, 0] ],						//	Moving, facing R
				[ 400, [100, 200, 300, 400], [4, 5, 4, 3] ],						//	Moving, facing L
				[ 2000, [100, 200, 300, 400, 2000], [1, 6, 7, 8, 12] ],				//	Death, facing R
				[ 2000, [100, 200, 300, 400, 2000], [4, 9, 10, 11, 12] ],			//	Death, facing L
				[ 600, [200, 400, 600], [13,14,15]],								//	Fade out, facing R
				[ 600, [200, 400, 600], [16,17,18]],								//	Fade out, facing L
				[ 600, [200, 400, 600], [15,14,13]],								//	Fade in, facing R
				[ 600, [200, 400, 600], [18,17,16]],								//	Fade in, facing L
				[ 1000, [1000], [12]]												//	Move while invisible
			]
		},
		box: {
			width: 8, 
			height: 14
		},
		ai: {
			type: EnumAi.MINI_GHOST,
		},
		touchDamage: function() {
			if(!this.vars.invisible) {
				var touchDamage = {
					onlyDamage: [
						EnumLode.WATER,
						EnumLode.FIRE,
						EnumLode.LIGHTNING,
						EnumLode.ACID
					],
					baseDamage: 1,
					attacker: 'Mini Ghost',
					lode: EnumLode.SHADOW
				}
				return touchDamage;
			}
		},
		inflictDamage: function(damage, lode) {
			if(lode !== EnumLode.CRYSTAL && lode !== EnumLode.SHADOW) {
				if(!this.vars.invisible) {
					creatureSounds2.play('ghostVanish');
					this.ai.nextAction = 1;
					clearAiAction(this);
				}
			} else {
				this.vars.currentHP -= damage;
				if(this.vars.currentHP <= 0) {
					this.deathResponse();
				}
			}
		},
		deathResponse: function() {
			creatureSounds2.play('ghostDeath');
			this.kill();
		}
	},

	//	3	SKELTON
	{
		name: 'Skelton',
		lode: EnumLode.NONE,
		currentSprite: { x: 3, y: 4 },
		vars: {
			speed: 0.5,
			maxHP: 5,
			currentHP: 5,
			restingWeaponAnimation: true,
			score: 50
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 4 },
				{ x: 1, y: 4 },
				{ x: 2, y: 4 },
				{ x: 3, y: 4 },
				{ x: 4, y: 4 },
				{ x: 5, y: 4 },
				{ x: 6, y: 4 },
				{ x: 0, y: 5 },
				{ x: 1, y: 5 },
				{ x: 2, y: 5 },
				{ x: 3, y: 5 },
				{ x: 4, y: 5 },
				{ x: 5, y: 5 },
				{ x: 6, y: 5 }
			],
			animations: [
				[ 1000, [1000], [0] ],									//	Resting, facing R
				[ 1000, [1000], [7] ],									//	Resting, facing L
				[ 400, [100, 200, 300, 400], [1, 3, 2, 0] ],			//	Moving, facing R
				[ 400, [100, 200, 300, 400], [8, 10, 9, 7] ],			//	Moving, facing L
				[ 2000, [500, 1000, 2000], [4, 5, 6]],					//	Death, facing R
				[ 2000, [500, 1000, 2000], [11, 12, 13]]				//	Death, facing L
			]
		},
		box: {
			width: 8, 
			height: 16
		},
		ai: {
			type: EnumAi.SKELTON,
		},
		movement: {
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				var rand = Math.floor(Math.random() * 3);
				if(rand < 1) {
					skeltonNoises.play('noise1');
				} else if(rand < 2) {
					skeltonNoises.play('noise2');
				} else if(rand < 3) {
					skeltonNoises.play('noise3');
				} else {
					skeltonNoises.play('noise4');
				}
				this.ai.nextAction = 3;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			skeltonNoises.play('death1');
			this.kill();
		},
		// deathDrop: function() {
		// 	console.log("Skelton death drop");
		// },
		addWeapon: function() {
			var rand = Math.floor(session.prng.nextFloat() * 4);
			if(rand < 1) {
				return EnumCreatureWeapon.BONE_AXE;
			} else if(rand < 2) {
				return EnumCreatureWeapon.BONE_CROSSBOW;
			} else {
				return EnumCreatureWeapon.BONE_SWORD;
			}
		},
		setAiType: function() {
			if(this.weapon.name === "Bone Crossbow") {
				this.ai.type = EnumAi.SKELTON_ARCHER;
			}
		}
	},

	//	4	GREEN SLUDGIE
	{
		name: 'Green Sludgie',
		lode: EnumLode.ACID,
		currentSprite: { x: 3, y: 4 },
		vars: {
			speed: 2,
			maxHP: 3,
			currentHP: 3,
			minFacingChangeTime: 50,
			score: 60
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{x:0,y:8}, {x:1,y:8}, {x:2,y:8}, {x:3,y:8}, {x:4,y:8}, {x:5,y:8},
				{x:0,y:9}, {x:1,y:9}, {x:2,y:9}, {x:3,y:9}, {x:4,y:9}, {x:5,y:9},
				{x:6,y:8}, {x:7,y:8}, {x:8,y:8}, {x:6,y:9},	{x:7,y:9}, {x:8,y:9}
			],
			animations: [
				[ 1800, [300, 600, 900, 1200, 1500, 1800], [0, 1, 2, 1, 0, 1] ],		//	Resting, facing R
				[ 1800, [300, 600, 900, 1200, 1500, 1800], [6, 7, 8, 7, 6, 7] ],		//	Resting, facing L
				[ 1000, [150, 300, 700, 850, 1000], [3, 4, 5, 4, 3] ],					//	Moving, facing R
				[ 1000, [150, 300, 700, 850, 1000], [9, 10, 11, 10, 9] ],				//	Moving, facing L
				[ 2400, [800, 1600, 2400], [12, 13, 14]],								//	Death, facing R
				[ 2400, [800, 1600, 2400], [15, 16, 17]]								//	Death, facing L
			]
		},
		box: {
			width: 14, 
			height: 7
		},
		ai: {
			type: EnumAi.GREEN_SLUDGIE,
		},
		movement: {
			bounceOff: true
		},
		touchDamage: function() {
			var touchDamage = {
				baseDamage: 1,
				criticalMax: 2,
				lode: EnumLode.ACID
			}
			return touchDamage;
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				this.ai.nextAction = 2;
				clearAiAction(this);
				playSludgieNoise();
			}
		},
		deathResponse: function() {
			var snd = Math.floor(Math.random() * 2);
			playSludgieNoise(true);
			this.kill();
		}
	},

	//	5	CAMP VAMP
	{
		name: 'Camp Vamp',
		lode: EnumLode.LIGHTNING,
		currentSprite: { x: 0, y: 10 },
		vars: {
			speed: 0.7,
			maxHP: 7,
			currentHP: 7,
			restingWeaponAnimation: true,
			minFacingChangeTime: 50,
			transformStartTime: 0,
			transformEndTime: 0,
			isBat: false,
			score: 250
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 10 },
				{ x: 1, y: 10 },
				{ x: 2, y: 10 },
				{ x: 3, y: 10 },
				{ x: 4, y: 10 },
				{ x: 5, y: 10 },
				{ x: 6, y: 10 },
				{ x: 7, y: 10 },
				{ x: 8, y: 10 },
				{ x: 9, y: 10 },
				{ x: 10, y: 10 },
				{ x: 11, y: 10 },
				{ x: 12, y: 10 },
				{ x: 13, y: 10 },
				{ x: 0, y: 11 },
				{ x: 1, y: 11 },
				{ x: 2, y: 11 },
				{ x: 3, y: 11 },
				{ x: 4, y: 11 },
				{ x: 5, y: 11 },
				{ x: 6, y: 11 },
				{ x: 7, y: 11 },
				{ x: 8, y: 11 },
				{ x: 9, y: 11 },
				{ x: 10, y: 11 },
				{ x: 11, y: 11 },
				{ x: 12, y: 11 },
				{ x: 13, y: 11 }
			],
			animations: [
				[ 500, [300, 500], [0, 1] ],																	//	Resting, facing R
				[ 500, [300, 500], [14, 15] ],																	//	Resting, facing L
				[ 400, [100, 200, 300, 400], [6, 8, 7, 9] ],													//	Moving, facing R
				[ 400, [100, 200, 300, 400], [20, 22, 21, 23] ],												//	Moving, facing L
				[ 2400, [1000, 1100, 1200, 1300, 1400, 1500, 1600, 2400], [10, 11, 12, 13, 24, 25, 26, 27]],		//	Death, facing R
				[ 2400, [1000, 1100, 1200, 1300, 1400, 1500, 1600, 2400], [10, 11, 12, 13, 24, 25, 26, 27]],		//	Death, facing R
				[ 600, [100, 200, 300, 400, 500, 600], [14, 15, 16, 17, 18, 19] ],								//	Transform into bat
				[ 600, [100, 200, 300, 400, 500, 600], [19, 18, 17, 16, 15, 14] ],								//	Transform back from bat
				[ 200, [50, 100, 150, 200], [2, 3, 4, 5] ]														//	Moving as bat
			]
		},
		box: {
			width: 8, 
			height: 16
		},
		movement: {
			bounceRandom: true
		},
		ai: {
			type: EnumAi.CAMP_VAMP,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else if(!this.vars.isBat) {
				var snd = Math.floor(Math.random() * 3);
				if(snd < 1) {
					campVampNoises.play('noise4')
				} else if(snd < 2) {
					campVampNoises.play('noise5')
				} else {
					campVampNoises.play('noise6')
				}
				this.ai.nextAction = 3;
				clearAiAction(this);
			} else {
				this.ai.nextAction = 4;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			campVampNoises.play('death')
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.VAMP_DAGGER;
		}
	},

	//	6	URK
	{
		name: 'Urk',
		lode: EnumLode.NONE,
		currentSprite: { x: 0, y: 12},
		vars: {
			speed: 0.5,
			maxHP: 5,
			currentHP: 5,
			restingWeaponAnimation: true,
			score: 60
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 12 },	//	Resting facing R 1
				{ x: 1, y: 12 },	//	Resting facing R 2
				{ x: 2, y: 12 },	//	Moving facing R 1
				{ x: 3, y: 12 },	//	Moving facing R 2
				{ x: 4, y: 12 },	//	Moving facing R 3
				{ x: 5, y: 12 },	//	Death facing R 1
				{ x: 6, y: 12 },	//	Death facing R 2
				{ x: 7, y: 12 },	//	Death facing R 3
				{ x: 0, y: 13 },	//	Resting facing L 1
				{ x: 1, y: 13 },	//	Resting facing L 2
				{ x: 2, y: 13 },	//	Moving facing L 1
				{ x: 3, y: 13 },	//	Moving facing L 2
				{ x: 4, y: 13 },	//	Moving facing L 3
				{ x: 5, y: 13 },	//	Death facing L 1
				{ x: 6, y: 13 },	//	Death facing L 2
				{ x: 7, y: 13 }		//	Death facing L 3
			],
			animations: [
				[ 800, [500, 800], [ 0, 1] ],											//	Resting, facing R
				[ 800, [500, 800], [ 8, 9] ],											//	Resting, facing L
				[ 600, [150, 300, 450, 600], [ 2, 3, 4, 1 ] ],							//	Moving, facing R
				[ 600, [150, 300, 450, 600], [ 10,11,12,9 ] ],							//	Moving, facing L
				[ 900, [300, 600, 900], [5, 6, 7 ] ],									//	Death, facing R
				[ 900, [300, 600, 900], [13,14,15] ]									//	Death, facing L
			]
		},
		movement: {
			bounceOff: true
		},
		box: {
			width: 10, 
			height: 16
		},
		ai: {
			type: EnumAi.URK,
		},
		movement: {
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				playUrkGrunt();
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			playUrkGrunt(true);
			this.kill();
		},
		addWeapon: function() {
			var rand = Math.floor(session.prng.nextFloat() * 3);
			if(rand < 2) {
				return EnumCreatureWeapon.URK_SWORD;
			} else {
				return EnumCreatureWeapon.URK_CHOPPA;
			}
		}	
	},

	//	7	URK WARRIOR
	{
		name: 'Urk Warrior',
		lode: EnumLode.NONE,
		currentSprite: { x: 0, y: 14},
		vars: {
			speed: 0.6,
			maxHP: 5,
			currentHP: 5,
			restingWeaponAnimation: true,
			attackRate: 0.8,
			score: 70
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 14 },	//	Resting facing R 1
				{ x: 1, y: 14 },	//	Resting facing R 2
				{ x: 2, y: 14 },	//	Moving facing R 1
				{ x: 3, y: 14 },	//	Moving facing R 2
				{ x: 4, y: 14 },	//	Moving facing R 3
				{ x: 5, y: 14 },	//	Death facing R 1
				{ x: 6, y: 14 },	//	Death facing R 2
				{ x: 7, y: 14 },	//	Death facing R 3
				{ x: 0, y: 15 },	//	Resting facing L 1
				{ x: 1, y: 15 },	//	Resting facing L 2
				{ x: 2, y: 15 },	//	Moving facing L 1
				{ x: 3, y: 15 },	//	Moving facing L 2
				{ x: 4, y: 15 },	//	Moving facing L 3
				{ x: 5, y: 15 },	//	Death facing L 1
				{ x: 6, y: 15 },	//	Death facing L 2
				{ x: 7, y: 15 }		//	Death facing L 3
			],
			animations: [
				[ 800, [500, 800], [ 0, 1] ],											//	Resting, facing R
				[ 800, [500, 800], [ 8, 9] ],											//	Resting, facing L
				[ 600, [150, 300, 450, 600], [ 2, 3, 4, 1 ] ],							//	Moving, facing R
				[ 600, [150, 300, 450, 600], [ 10,11,12,9 ] ],							//	Moving, facing L
				[ 900, [300, 600, 900], [5, 6, 7 ] ],									//	Death, facing R
				[ 900, [300, 600, 900], [13,14,15] ]									//	Death, facing L
			]
		},
		box: {
			width: 10, 
			height: 15
		},
		movement: {
			bounceRandom: true
		},
		ai: {
			type: EnumAi.URK,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				playUrkGrunt();
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			playUrkGrunt(true);
			this.kill();
		},
		addWeapon: function() {
			var rand = Math.floor(session.prng.nextFloat() * 3);
			if(rand < 2) {
				return EnumCreatureWeapon.URK_SWORD;
			} else {
				return EnumCreatureWeapon.URK_CHOPPA;
			}
		}	

	},

	//	8	HULKING URK
	{
		name: 'Hulking Urk',
		lode: EnumLode.NONE,
		currentSprite: { x: 0, y: 16},
		vars: {
			speed: 0.4,
			maxHP: 10,
			currentHP: 10,
			restingWeaponAnimation: true,
			score: 150
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 2, y: 2 },
			y_padding: 5,
			frames: [
				{ x: 0, y: 16 },	//	Resting facing R 1
				{ x: 2, y: 16 },	//	Resting facing R 2
				{ x: 4, y: 16 },	//	Moving facing R 1
				{ x: 6, y: 16 },	//	Moving facing R 2
				{ x: 8, y: 16 },	//	Moving facing R 3
				{ x: 10, y: 16 },	//	Moving facing R 4
				{ x: 12, y: 16 },	//	Death facing R 1
				{ x: 14, y: 16 },	//	Death facing R 2
				{ x: 16, y: 16 },	//	Death facing R 3
				{ x: 18, y: 16 },	//	Death facing R 3
				{ x: 0, y: 18 },	//	Resting facing L 1
				{ x: 2, y: 18 },	//	Resting facing L 2
				{ x: 4, y: 18 },	//	Moving facing L 1
				{ x: 6, y: 18 },	//	Moving facing L 2
				{ x: 8, y: 18 },	//	Moving facing L 3
				{ x: 10, y: 18 },	//	Moving facing L 4
				{ x: 12, y: 18 },	//	Death facing L 1
				{ x: 14, y: 18 },	//	Death facing L 2
				{ x: 16, y: 18 },	//	Death facing L 3
				{ x: 18, y: 18 },	//	Death facing L 3
				{ x: 20, y: 16 },	//	Bezerk facing R 1
				{ x: 22, y: 16 },	//	Bezerk facing R 2
				{ x: 20, y: 18 },	//	Bezerk facing L 1
				{ x: 22, y: 18 },	//	Bezerk facing L 2
				{ x: 24, y: 16 },	//	Exhausted facing R 1
				{ x: 26, y: 16 },	//	Exhausted facing R 2
				{ x: 24, y: 18 },	//	Exhausted facing L 1
				{ x: 26, y: 18 }	//	Exhausted facing L 2
			],
			animations: [
				[ 1000, [600, 800], [ 0, 1] ],									//	Resting, facing R
				[ 1000, [600, 800], [ 10, 11] ],								//	Resting, facing L
				[ 1000, [200, 400, 600, 800, 1000], [ 2, 3, 4, 0, 5 ] ],		//	Moving, facing R
				[ 1000, [200, 400, 600, 800, 1000], [ 12,13,14,10,15 ] ],		//	Moving, facing L
				[ 2000, [600, 1100, 1500, 2000], [6, 7, 8, 9 ] ],				//	Death, facing R
				[ 2000, [600, 1100, 1500, 2000], [16,17,18,19] ],				//	Death, facing L
				[ 200, [100, 200], [20, 21] ],									//	Bezerk, facing R
				[ 200, [100, 200], [22, 23] ],									//	Bezerk, facing L
				[ 700, [500, 700], [ 24, 25] ],									//	Exhausted, facing R
				[ 700, [500, 700], [ 26, 27] ],									//	Exhausted, facing L
			]
		},
		box: {
			width: 16, 
			height: 24
		},
		ai: {
			type: EnumAi.HULKING_URK,
		},
		movement: {
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				if(!this.vars.bezerkAttacks) {
					var action = Math.floor(Math.random() * 3);
					if(action < 1) {
						playHulkingUrkGrunt(null, true);
						this.ai.nextAction = 4;
					} else {
						playHulkingUrkGrunt();
						this.ai.nextAction = 2;
					}
					clearAiAction(this);
				}
			}
		},
		deathResponse: function() {
			playHulkingUrkGrunt(true);
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.HULKING_URK_HAMMA;
		}	
	},

	//	9	KOB
	{
		name: 'Kob',
		lode: EnumLode.NONE,
		currentSprite: { x: 0, y: 20},
		vars: {
			speed: 0.8,
			maxHP: 4,
			currentHP: 4,
			restingWeaponAnimation: true,
			score: 65
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 20 },	//	Resting facing R 1
				{ x: 1, y: 20 },	//	Resting facing R 2
				{ x: 2, y: 20 },	//	Moving facing R 1
				{ x: 3, y: 20 },	//	Moving facing R 2
				{ x: 4, y: 20 },	//	Moving facing R 3
				{ x: 5, y: 20 },	//	Death facing R 1
				{ x: 6, y: 20 },	//	Death facing R 2
				{ x: 7, y: 20 },	//	Death facing R 3
				{ x: 0, y: 21 },	//	Resting facing L 1
				{ x: 1, y: 21 },	//	Resting facing L 2
				{ x: 2, y: 21 },	//	Moving facing L 1
				{ x: 3, y: 21 },	//	Moving facing L 2
				{ x: 4, y: 21 },	//	Moving facing L 3
				{ x: 5, y: 21 },	//	Death facing L 1
				{ x: 6, y: 21 },	//	Death facing L 2
				{ x: 7, y: 21 }		//	Death facing L 3
			],
			animations: [
				[ 600, [400, 600], [ 0, 1] ],											//	Resting, facing R
				[ 600, [400, 600], [ 8, 9] ],											//	Resting, facing L
				[ 400, [100, 200, 300, 400], [ 2, 3, 4, 1 ] ],							//	Moving, facing R
				[ 400, [100, 200, 300, 400], [ 10,11,12,9 ] ],							//	Moving, facing L
				[ 900, [300, 600, 900], [5, 6, 7 ] ],									//	Death, facing R
				[ 900, [300, 600, 900], [13,14,15] ]									//	Death, facing L
			]
		},
		box: {
			width: 14, 
			height: 16
		},
		ai: {
			type: EnumAi.KOB,
		},
		movement: {
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				playKobNoise();
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			playKobNoise(true);
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.KOB_MACE;
		}	
	},

	//	10	MUMI
	{
		name: 'Mumi',
		lode: EnumLode.CRYSTAL,
		currentSprite: { x: 7, y: 4 },
		vars: {
			speed: 0.8,
			maxHP: 5,
			currentHP: 5,
			restingWeaponAnimation: false,
			score: 110
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 7, y: 4 },
				{ x: 8, y: 4 },
				{ x: 9, y: 4 },
				{ x: 10, y: 4 },
				{ x: 11, y: 4 },
				{ x: 12, y: 4 },
				{ x: 13, y: 4 },
				{ x: 14, y: 4 },
				{ x: 15, y: 4 },
				{ x: 7, y: 5 },
				{ x: 8, y: 5 },
				{ x: 9, y: 5 },
				{ x: 10, y: 5 },
				{ x: 11, y: 5 },
				{ x: 12, y: 5 },
				{ x: 13, y: 5 },
				{ x: 14, y: 5 },
				{ x: 15, y: 5 }
			],
			animations: [
				[ 800, [400, 800], [0, 1] ],							//	Resting, facing R
				[ 800, [400, 800], [9, 10] ],							//	Resting, facing L
				[ 400, [100, 200, 300, 400], [2, 3, 4, 1] ],			//	Moving, facing R
				[ 400, [100, 200, 300, 400], [11,12,13,10] ],			//	Moving, facing L
				[ 800, [200, 400, 600, 800], [5, 6, 7, 8]],				//	Death, facing R
				[ 800, [200, 400, 600, 800], [14,15,16,17]]				//	Death, facing L
			]
		},
		box: {
			width: 8, 
			height: 16
		},
		ai: {
			type: EnumAi.MUMI,
		},
		movement: {
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				this.ai.nextAction = 3;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			creatureSounds1.play('mumiDeath');
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.BONE_SWORD;
		}
	},

	//	11	SNEAKY SKELTON
	{
		name: 'Sneaky Skelton',
		lode: EnumLode.NONE,
		currentSprite: { x: 6, y: 4 },
		vars: {
			speed: 0.5,
			maxHP: 5,
			currentHP: 5,
			restingWeaponAnimation: true,
			score: 50
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 4 },
				{ x: 1, y: 4 },
				{ x: 2, y: 4 },
				{ x: 3, y: 4 },
				{ x: 4, y: 4 },
				{ x: 5, y: 4 },
				{ x: 6, y: 4 },
				{ x: 0, y: 5 },
				{ x: 1, y: 5 },
				{ x: 2, y: 5 },
				{ x: 3, y: 5 },
				{ x: 4, y: 5 },
				{ x: 5, y: 5 },
				{ x: 6, y: 5 }
			],
			animations: [
				[ 1000, [1000], [0] ],									//	Resting, facing R
				[ 1000, [1000], [7] ],									//	Resting, facing L
				[ 400, [100, 200, 300, 400], [1, 3, 2, 0] ],			//	Moving, facing R
				[ 400, [100, 200, 300, 400], [8, 10, 9, 7] ],			//	Moving, facing L
				[ 2000, [500, 1000, 2000], [4, 5, 6]],					//	Death, facing R
				[ 2000, [500, 1000, 2000], [11, 12, 13]],				//	Death, facing L
				[ 1000, [200, 400, 1000], [6, 5, 4]],					//	Ambush, facing R
				[ 1000, [200, 400, 1000], [13, 12, 11]],				//	Ambush, facing L
				[ 250, [250], [6]],										//	Lying in wait, facing R
				[ 250, [250], [13]]										//	Lying in wait, facing L
			]
		},
		box: {
			width: 8, 
			height: 16
		},
		ai: {
			type: EnumAi.SNEAKY_SKELTON,
		},
		movement: {
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				var rand = Math.floor(Math.random() * 3);
				if(rand < 1) {
					skeltonNoises.play('noise1');
				} else if(rand < 2) {
					skeltonNoises.play('noise2');
				} else if(rand < 3) {
					skeltonNoises.play('noise3');
				} else {
					skeltonNoises.play('noise4');
				}
				this.ai.nextAction = 3;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			skeltonNoises.play('death1');
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.BONE_SWORD;
		}
	},

	//	12	BLUE SQUARK
	{
		name: 'Blue Squark',
		lode: EnumLode.WATER,
		currentSprite: { x: 9, y: 2},
		vars: {
			speed: 1,
			maxHP: 4,
			currentHP: 4,
			restingWeaponAnimation: true,
			score: 125
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 9, y: 2 },		//	Resting facing R 1
				{ x: 10, y: 2 },	//	Resting facing R 2
				{ x: 11, y: 2 },	//	Moving facing R 1
				{ x: 12, y: 2 },	//	Moving facing R 2
				{ x: 13, y: 2 },	//	Moving facing R 3
				{ x: 14, y: 2 },	//	Death facing R 1
				{ x: 15, y: 2 },	//	Death facing R 2
				{ x: 16, y: 2 },	//	Death facing R 3
				{ x: 17, y: 2 },	//	Death facing R 4
				{ x: 9, y: 3 },		//	Resting facing L 1
				{ x: 10, y: 3 },	//	Resting facing L 2
				{ x: 11, y: 3 },	//	Moving facing L 1
				{ x: 12, y: 3 },	//	Moving facing L 2
				{ x: 13, y: 3 },	//	Moving facing L 3
				{ x: 14, y: 3 },	//	Death facing L 1
				{ x: 15, y: 3 },	//	Death facing L 2
				{ x: 16, y: 3 },	//	Death facing L 3
				{ x: 17, y: 3 }		//	Death facing L 4
			],
			animations: [
				[ 600, [400, 600], [ 0, 1] ],											//	Resting, facing R
				[ 600, [400, 600], [ 9, 10] ],											//	Resting, facing L
				[ 400, [100, 200, 300, 400], [ 2, 3, 4, 1 ] ],							//	Moving, facing R
				[ 400, [100, 200, 300, 400], [ 11,12,13,10 ] ],							//	Moving, facing L
				[ 1400, [800, 1000, 1200, 1400], [5, 6, 7, 8 ] ],									//	Death, facing R
				[ 1400, [800, 1000, 1200, 1400], [14,15,16,17] ]									//	Death, facing L
			]
		},
		box: {
			width: 10, 
			height: 14
		},
		ai: {
			type: EnumAi.BLUE_SQUARK,
		},
		movement: {
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				playSquarkNoise();
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			playSquarkNoise(true);
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.SQUARK_KNIFE;
		}	
	},

	//	13	ZOMBI
	{
		name: 'Zombi',
		lode: EnumLode.NONE,
		currentSprite: { x: 12, y: 0},
		vars: {
			speed: 0.4,
			maxHP: 3,
			currentHP: 3,
			restingWeaponAnimation: true,
			score: 50
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 12, y: 0 },	//	Moving facing R 1
				{ x: 13, y: 0 },	//	Moving facing R 2
				{ x: 14, y: 0 },	//	Moving facing R 3
				{ x: 15, y: 0 },	//	Moving facing R 4
				{ x: 16, y: 0 },	//	Death facing R 1
				{ x: 17, y: 0 },	//	Death facing R 2
				{ x: 18, y: 0 },	//	Death facing R 3
				{ x: 12, y: 1 },	//	Moving facing L 1
				{ x: 13, y: 1 },	//	Moving facing L 2
				{ x: 14, y: 1 },	//	Moving facing L 3
				{ x: 15, y: 1 },	//	Moving facing L 4
				{ x: 16, y: 1 },	//	Death facing L 1
				{ x: 17, y: 1 },	//	Death facing L 2
				{ x: 18, y: 1 },	//	Death facing L 3
				{ x: 19, y: 0 },	//	Biting facing R 1
				{ x: 20, y: 0 },	//	Biting facing R 2
				{ x: 19, y: 1 },	//	Biting facing L 1
				{ x: 20, y: 1 }		//	Biting facing L 2
			],
			animations: [
				[ 200, [200], [6] ],											//	Resting, facing R (dead!)
				[ 200, [200], [13] ],											//	Resting, facing L (dead!)
				[ 400, [100, 200, 300, 400], [ 0, 1, 2, 3 ] ],					//	Moving, facing R
				[ 400, [100, 200, 300, 400], [ 7, 8, 9,10 ] ],					//	Moving, facing L
				[ 600, [200, 400, 600], [4, 5, 6] ],							//	Death, facing R
				[ 600, [200, 400, 600], [11,12,13] ],							//	Death, facing L
				[ 400, [200, 300, 400], [14,15,0] ],							//	Biting, facing R
				[ 400, [200, 300, 400], [16,17,7] ],							//	Biting, facing L
				[ 200, [200], [6] ],											//	Dead, facing R
				[ 600, [200], [13] ],											//	Dead, facing L
				[ 600, [200, 400, 600], [6, 5, 4] ],							//	Reanimate, facing R
				[ 600, [200, 400, 600], [13,12,11] ],							//	Reanimate, facing L
				[ 200, [200], [0] ],											//	Standing, facing R
				[ 200, [200], [7] ],											//	Standing, facing L
			]
		},
		box: {
			width: 10, 
			height: 16
		},
		ai: {
			type: EnumAi.ZOMBI,
		},
		addWeapon: function() {
			return EnumCreatureWeapon.ZOMBI_BITE;
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				playZombiNoise();
			}
		},
		deathResponse: function() {
			if(!this.vars.dead) {
				playZombiNoise(true);
				addScore(this.vars.score);
				this.vars.score = 0;														//	Override score so repeat kills do not earn extra points
				this.vars.dead = true;
				this.vars.moveThroughColliders = true;
				this.ai.nextAction = 1;														//	Prevent further AI actions
				this.movement.speed = 0;													//	Zero speed
				this.movement.moving = false;												//	Stop moving
				this.position.x = Math.floor(this.position.x);								//	Round co-ords down to prevent blurred drawing on canvas
				this.position.y = Math.floor(this.position.y);
				this.vars.animStart = performance.now();									//	Set animation start time to now...
				if(this.vars.facingRight) {													//	...and set death animation
					this.vars.animation = 4;
				} else {
					this.vars.animation = 5;
				}
				this.ai.nextAction = 1;
				// this.vars.deathTime = performance.now() + this.sprite.animations[this.vars.animation][0] - 100;		//	Set deathTime to be current time plus duration of death animation minus 100ms
			}
		}
	},

	//	14	ZOMBI MASTER
	{
		name: 'Zombi Master',
		lode: EnumLode.ACID,
		currentSprite: { x: 21, y: 0},
		vars: {
			speed: 0.8,
			maxHP: 7,
			currentHP: 7,
			restingWeaponAnimation: true,
			score: 250
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 21, y: 0 },	//	Resting facing R 1
				{ x: 22, y: 0 },	//	Resting facing R 2
				{ x: 23, y: 0 },	//	Moving facing R 1
				{ x: 24, y: 0 },	//	Moving facing R 2
				{ x: 25, y: 0 },	//	Moving facing R 3
				{ x: 26, y: 0 },	//	Moving facing R 4
				{ x: 27, y: 0 },	//	Death facing R 1
				{ x: 28, y: 0 },	//	Death facing R 2
				{ x: 29, y: 0 },	//	Death facing R 3
				{ x: 30, y: 0 },	//	Death facing R 4
				{ x: 31, y: 0 },	//	Death facing R 5
				{ x: 21, y: 1 },	//	Resting facing L 1
				{ x: 22, y: 1 },	//	Resting facing L 2
				{ x: 23, y: 1 },	//	Moving facing L 1
				{ x: 24, y: 1 },	//	Moving facing L 2
				{ x: 25, y: 1 },	//	Moving facing L 3
				{ x: 26, y: 1 },	//	Moving facing L 4
				{ x: 27, y: 1 },	//	Death facing L 1
				{ x: 28, y: 1 },	//	Death facing L 2
				{ x: 29, y: 1 },	//	Death facing L 3
				{ x: 30, y: 1 },	//	Death facing L 4
				{ x: 31, y: 1 } 	//	Death facing L 5
			],
			animations: [
				[ 800, [500, 800], [0, 1] ],									//	Resting, facing R
				[ 800, [500, 800], [11,12] ],									//	Resting, facing L
				[ 400, [100, 200, 300, 400], [ 2, 3, 4, 5 ] ],					//	Moving, facing R
				[ 400, [100, 200, 300, 400], [ 13,14,15,16 ] ],					//	Moving, facing L
				[ 1500, [300, 600, 900, 1200, 1500], [6, 7, 8, 9, 10] ],		//	Death, facing R
				[ 1500, [300, 600, 900, 1200, 1500], [17,18,19,20,21] ]			//	Death, facing L
			]
		},
		box: {
			width: 12, 
			height: 16
		},
		ai: {
			type: EnumAi.ZOMBI_MASTER,
		},
		movement: {
			bounceRandom: true
		},
		addWeapon: function() {
			return EnumCreatureWeapon.ZOMBI_MASTER_STAFF;
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				var snd = Math.floor(Math.random() * 4);
				if(snd < 1) {
					zombiMasterNoises.play('noise1');
				} else if(snd < 2) {
					zombiMasterNoises.play('noise2');
				} else if(snd < 3) {
					zombiMasterNoises.play('noise3');
				} else {
					zombiMasterNoises.play('noise4');
				}
				this.ai.nextAction = 1;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			creatureSounds2.play('zombiMasterDeath');
			this.kill();
		}
	},

	//	15	WATER ELEMENTAL
	{
		name: 'Water Elemental',
		lode: EnumLode.WATER,
		currentSprite: { x: 8, y: 20},
		vars: {
			speed: 0.4,
			maxHP: 5,
			currentHP: 5,
			moveThroughColliders: true,
			foreground: true,
			score: 175
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 2 },
			y_padding: 2,
			frames: [
				{ x: 8, y: 20 },
				{ x: 9, y: 20 },
				{ x: 10, y: 20 },
				{ x: 11, y: 20 },
				{ x: 14, y: 20 },
				{ x: 15, y: 20 },
				{ x: 16, y: 20 },
				{ x: 8, y: 22 },
				{ x: 9, y: 22 },
				{ x: 10, y: 22 },
				{ x: 11, y: 22 },
				{ x: 14, y: 22 },
				{ x: 15, y: 22 },
				{ x: 16, y: 22 },
				{ x: -1, y: -1 },
				{ x: 12, y: 20},
				{ x: 13, y: 20},
				{ x: 12, y: 22},
				{ x: 13, y: 22}
			],
			animations: [
				[ 400, [100, 200, 300, 400], [0, 1, 2, 3 ] ],		//	Resting, facing R
				[ 400, [100, 200, 300, 400], [7, 8, 9, 10] ],		//	Resting, facing L
				[ 400, [100, 200, 300, 400], [0, 1, 2, 3 ] ],		//	Moving, facing R
				[ 400, [100, 200, 300, 400], [7, 8, 9, 10] ],		//	Moving, facing L
				[ 800, [200, 400, 600], [4, 5, 6 ,14] ],			//	Death, facing R
				[ 800, [200, 400, 600], [11,12,13,14] ],			//	Death, facing L
				[ 400, [100, 200, 300, 400], [0,15, 2,16 ] ],		//	Casting, facing R
				[ 400, [100, 200, 300, 400], [7,17, 9,18 ] ]		//	Casting, facing L
			]
		},
		box: {
			width: 10, 
			height: 25
		},
		ai: {
			type: EnumAi.ELEMENTAL,
		},
		touchDamage: function() {},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		addWeapon: function() {
			return EnumCreatureWeapon.WATER_ELEMENTAL_WEAPON;
		},
		deathResponse: function() {
			var snd = Math.floor(Math.random() * 2);
			if(snd < 1) {
				creatureSounds1.play('elementalDeath1');
			} else {
				creatureSounds1.play('elementalDeath2');
			}
			this.kill();
		}
	},

	//	16	URK VETERAN
	{
		name: 'Urk Veteran',
		lode: EnumLode.NONE,
		currentSprite: { x: 8, y: 12},
		vars: {
			speed: 0.5,
			maxHP: 6,
			currentHP: 6,
			restingWeaponAnimation: true,
			attackRate: 0.5,
			score: 130
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 8, y: 12 },	//	Resting facing R 1
				{ x: 9, y: 12 },	//	Resting facing R 2
				{ x: 10, y: 12 },	//	Moving facing R 1
				{ x: 11, y: 12 },	//	Moving facing R 2
				{ x: 12, y: 12 },	//	Moving facing R 3
				{ x: 13, y: 12 },	//	Death facing R 1
				{ x: 14, y: 12 },	//	Death facing R 2
				{ x: 15, y: 12 },	//	Death facing R 3
				{ x: 16, y: 12 },	//	Death facing R 4
				
				{ x: 8, y: 13 },	//	Resting facing L 1
				{ x: 9, y: 13 },	//	Resting facing L 2
				{ x: 10, y: 13 },	//	Moving facing L 1
				{ x: 11, y: 13 },	//	Moving facing L 2
				{ x: 12, y: 13 },	//	Moving facing L 3
				{ x: 13, y: 13 },	//	Death facing L 1
				{ x: 14, y: 13 },	//	Death facing L 2
				{ x: 15, y: 13 },	//	Death facing L 3
				{ x: 16, y: 13 }	//	Death facing L 4
			],
			animations: [
				[ 800, [500, 800], [ 0, 1] ],											//	Resting, facing R
				[ 800, [500, 800], [ 9, 10] ],											//	Resting, facing L
				[ 600, [150, 300, 450, 600], [ 2, 3, 4, 1 ] ],							//	Moving, facing R
				[ 600, [150, 300, 450, 600], [ 11,12,13,10 ] ],							//	Moving, facing L
				[ 1200, [300, 600, 900, 1200], [5, 6, 7, 8 ] ],									//	Death, facing R
				[ 1200, [300, 600, 900, 1200], [14,15,16,17] ]									//	Death, facing L
			]
		},
		box: {
			width: 12, 
			height: 15
		},
		ai: {
			type: EnumAi.URK_VETERAN,
		},
		movement: {
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				playUrkGrunt();
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			playUrkGrunt(true);
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.URK_SWORD;
		}	
	},

	//	17	URK SHAMAN
	{
		name: 'Urk Shaman',
		lode: EnumLode.FIRE,
		currentSprite: { x: 8, y: 14},
		vars: {
			speed: 0.7,
			maxHP: 7,
			currentHP: 7,
			restingWeaponAnimation: true,
			attackRate: 1,
			score: 200
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 8, y: 14 },	//	Resting facing R 1
				{ x: 9, y: 14 },	//	Resting facing R 2
				{ x: 10, y: 14 },	//	Moving facing R 1
				{ x: 11, y: 14 },	//	Moving facing R 2
				{ x: 12, y: 14 },	//	Moving facing R 3
				{ x: 13, y: 14 },	//	Death facing R 1
				{ x: 14, y: 14 },	//	Death facing R 2
				{ x: 15, y: 14 },	//	Death facing R 3
				{ x: 16, y: 14 },	//	Death facing R 4

				{ x: 8, y: 15 },	//	Resting facing L 1
				{ x: 9, y: 15 },	//	Resting facing L 2
				{ x: 10, y: 15 },	//	Moving facing L 1
				{ x: 11, y: 15 },	//	Moving facing L 2
				{ x: 12, y: 15 },	//	Moving facing L 3
				{ x: 13, y: 15 },	//	Death facing L 1
				{ x: 14, y: 15 },	//	Death facing L 2
				{ x: 15, y: 15 },	//	Death facing L 3
				{ x: 16, y: 15 }	//	Death facing L 4
			],
			animations: [
				[ 800, [500, 800], [ 0, 1] ],											//	Resting, facing R
				[ 800, [500, 800], [ 9, 10] ],											//	Resting, facing L
				[ 600, [150, 300, 450, 600], [ 2, 3, 4, 1 ] ],							//	Moving, facing R
				[ 600, [150, 300, 450, 600], [ 11,12,13,10 ] ],							//	Moving, facing L
				[ 1200, [300, 600, 900, 1200], [5, 6, 7, 8 ] ],							//	Death, facing R
				[ 1200, [300, 600, 900, 1200], [14,15,16,17] ]							//	Death, facing L
			]
		},
		box: {
			width: 10, 
			height: 15
		},
		ai: {
			type: EnumAi.URK_SHAMAN,
		},
		movement: {
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				playUrkGrunt();
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			playUrkGrunt(true);
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.URK_SHAMAN_STAFF;
		}	
	},

	//	18	BLACK KNIGHT
	{
		name: 'Black Knight',
		lode: EnumLode.SHADOW,
		currentSprite: { x: 18, y: 2},
		vars: {
			speed: 1,
			maxHP: 7,
			currentHP: 7,
			restingWeaponAnimation: true,
			attackRate: 1,
			score: 350
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 2 },
			y_padding: 2,
			frames: [
				{ x: 18, y: 2 },	//	Resting facing R 1
				{ x: 19, y: 2 },	//	Resting facing R 2
				{ x: 20, y: 2 },	//	Moving facing R 1
				{ x: 21, y: 2 },	//	Moving facing R 2
				{ x: 22, y: 2 },	//	Moving facing R 3
				{ x: 23, y: 2 },	//	Moving facing R 4
				{ x: 24, y: 2 },	//	Death facing R 1
				{ x: 25, y: 2 },	//	Death facing R 2
				{ x: 26, y: 2 },	//	Death facing R 3
				{ x: 27, y: 2 },	//	Death facing R 4
				{ x: 28, y: 2 },	//	Death facing R 5

				{ x: 18, y: 4 },	//	Resting facing L 1
				{ x: 19, y: 4 },	//	Resting facing L 2
				{ x: 20, y: 4 },	//	Moving facing L 1
				{ x: 21, y: 4 },	//	Moving facing L 2
				{ x: 22, y: 4 },	//	Moving facing L 3
				{ x: 23, y: 4 },	//	Moving facing L 4
				{ x: 24, y: 4 },	//	Death facing L 1
				{ x: 25, y: 4 },	//	Death facing L 2
				{ x: 26, y: 4 },	//	Death facing L 3
				{ x: 27, y: 4 },	//	Death facing L 4
				{ x: 28, y: 4 }		//	Death facing L 5
			],
			animations: [
				[ 400, [200, 400], [0, 1] ],								//	Resting, facing R
				[ 400, [200, 400], [11, 12] ],								//	Resting, facing L
				[ 400, [100, 200, 300, 400], [2, 3, 4, 5 ] ],				//	Moving, facing R
				[ 400, [100, 200, 300, 400], [13,14,15,16] ],				//	Moving, facing L
				[ 1000, [200, 400, 600, 800, 1000], [6, 7, 8, 9, 10] ],		//	Death, facing R
				[ 1000, [200, 400, 600, 800, 1000], [17,18,19,20,21] ]		//	Death, facing L
			]
		},
		box: {
			width: 10, 
			height: 15
		},
		ai: {
			type: EnumAi.BLACK_KNIGHT,
		},
		movement: {
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				var snd = Math.floor(Math.random() * 2);
				if(snd < 1) {
					creatureSounds2.play('genericHit1');
				} else {
					creatureSounds2.play('genericHit2');
				}
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			creatureSounds2.play('blackKnightDeath');
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.BLACK_KNIGHT_SWORD;
		}
	},

	//	19	OGR
	{
		name: 'Ogr',
		lode: EnumLode.WATER,
		currentSprite: { x: 17, y: 12},
		vars: {
			speed: 0.6,
			maxHP: 10,
			currentHP: 10,
			restingWeaponAnimation: true,
			attackRate: 1,
			score: 180
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1.5, y: 2 },
			y_padding: 2,
			frames: [
				{ x: 17, y: 12 },	//	Resting facing R 1
				{ x: 18.5, y: 12 },	//	Resting facing R 2
				{ x: 20, y: 12 },	//	Moving facing R 1
				{ x: 21.5, y: 12 },	//	Moving facing R 2
				{ x: 23, y: 12 },	//	Moving facing R 3
				{ x: 24.5, y: 12 },	//	Moving facing R 4
				{ x: 26, y: 12 },	//	Death facing R 1
				{ x: 27.5, y: 12 },	//	Death facing R 2
				{ x: 29, y: 12 },	//	Death facing R 3
				{ x: 30.5, y: 12 },	//	Death facing R 4

				{ x: 17, y: 14 },	//	Resting facing L 1
				{ x: 18.5, y: 14 },	//	Resting facing L 2
				{ x: 20, y: 14 },	//	Moving facing L 1
				{ x: 21.5, y: 14 },	//	Moving facing L 2
				{ x: 23, y: 14 },	//	Moving facing L 3
				{ x: 24.5, y: 14 },	//	Moving facing L 4
				{ x: 26, y: 14 },	//	Death facing L 1
				{ x: 27.5, y: 14 },	//	Death facing L 2
				{ x: 29, y: 14 },	//	Death facing L 3
				{ x: 30.5, y: 14 },	//	Death facing L 4

				{ x: 28, y: 16 },	//	Roaring facing R 1
				{ x: 29.5, y: 16 },	//	Roaring facing R 2
				{ x: 28, y: 18 },	//	Roaring facing L 1
				{ x: 29.5, y: 18 },	//	Roaring facing L 2

			],
			animations: [
				[ 1000, [600, 1000], [0, 1] ],								//	Resting, facing R
				[ 1000, [600, 1000], [10, 11] ],							//	Resting, facing L
				[ 600, [150, 300, 450, 600], [2, 5, 3, 4 ] ],				//	Moving, facing R
				[ 600, [150, 300, 450, 600], [12,15,13,14] ],				//	Moving, facing L
				[ 2500, [400, 1400, 2000, 2500], [6, 7, 8, 9] ],			//	Death, facing R
				[ 2500, [400, 1400, 2000, 2500], [16,17,18,19] ],			//	Death, facing L
				[ 1000, [600, 1000], [20, 21] ],							//	Roaring, facing R
				[ 1000, [600, 1000], [22, 23] ]								//	Roaring, facing L
			]
		},
		box: {
			width: 12, 
			height: 29
		},
		ai: {
			type: EnumAi.URK_VETERAN,
		},
		movement: {
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				var snd = Math.floor(Math.random() * 5);
				if(snd < 1) {
					ogrNoises.play('noise1')
				} else if(snd < 2) {
					ogrNoises.play('noise2')
				} else if(snd < 3) {
					ogrNoises.play('noise3')
				} else if(snd < 4) {
					ogrNoises.play('noise4')
				} else {
					ogrNoises.play('noise5')
				}
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			ogrNoises.play('death')
			this.kill();
		},
		addWeapon: function() {
			var rand = Math.floor(session.prng.nextFloat() * 2);
			if(rand < 1) {
				return EnumCreatureWeapon.OGR_AX;
			} else {
				return EnumCreatureWeapon.OGR_SWORD;
			}
		},

	},

	//	20	BLACK WIZ
	{
		name: 'Black Wiz',
		lode: EnumLode.LIGHTNING,
		currentSprite: { x: 18, y: 6},
		vars: {
			speed: 1.3,
			maxHP: 7,
			currentHP: 7,
			restingWeaponAnimation: false,
			attackRate: 1,
			nextTeleportTime: 0,
			teleportCooldown: 4000,
			summoned: 0,
			maxImps: 3,
			score: 500
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 18, y: 6 },	//	0	Resting facing R 1
				{ x: 19, y: 6 },	//	1	Resting facing R 2
				{ x: 20, y: 6 },	//	2	Moving facing R 1
				{ x: 21, y: 6 },	//	3	Moving facing R 2
				{ x: 22, y: 6 },	//	4	Moving facing R 3
				{ x: 23, y: 6 },	//	5	Moving facing R 4
				{ x: 24, y: 6 },	//	6	Casting facing R 1
				{ x: 25, y: 6 },	//	7	Casting facing R 2
				{ x: 26, y: 6 },	//	8	Death facing R 1
				{ x: 27, y: 6 },	//	9	Death facing R 2
				{ x: 28, y: 6 },	//	10	Death facing R 3
				{ x: 29, y: 6 },	//	11	Death facing R 4
				{ x: 30, y: 6 },	//	12	Death facing R 5
				{ x: 31, y: 6 },	//	13	Death facing R 6

				{ x: 18, y: 7 },	//	14	Resting facing L 1
				{ x: 19, y: 7 },	//	15	Resting facing L 2
				{ x: 20, y: 7 },	//	16	Moving facing L 1
				{ x: 21, y: 7 },	//	17	Moving facing L 2
				{ x: 22, y: 7 },	//	18	Moving facing L 3
				{ x: 23, y: 7 },	//	19	Moving facing L 4
				{ x: 24, y: 7 },	//	20	Casting facing L 1
				{ x: 25, y: 7 },	//	21	Casting facing L 2
				{ x: 26, y: 7 },	//	22	Death facing L 1
				{ x: 27, y: 7 },	//	23	Death facing L 2
				{ x: 28, y: 7 },	//	24	Death facing L 3
				{ x: 29, y: 7 },	//	25	Death facing L 4
				{ x: 30, y: 7 },	//	26	Death facing L 5
				{ x: 31, y: 7 },	//	27	Death facing L 6

				{ x: 29, y: 4 },	//	28	Teleport facing R 1
				{ x: 30, y: 4 },	//	29	Teleport facing R 2
				{ x: 31, y: 4 },	//	30	Teleport facing R 3
				{ x: 29, y: 5 },	//	31	Teleport facing L 1
				{ x: 30, y: 5 },	//	32	Teleport facing L 2
				{ x: 31, y: 5 }		//	33	Teleport facing L 3

			],
			animations: [
				[ 500, [300, 400], [0, 1] ],											//	Resting, facing R
				[ 500, [300, 400], [14, 15] ],											//	Resting, facing L
				[ 400, [100, 200, 300, 400], [2, 3, 4, 5 ] ],							//	Moving, facing R
				[ 400, [100, 200, 300, 400], [16,17,18,19] ],							//	Moving, facing L
				[ 1800, [300, 600, 900, 1200, 1500, 1800], [8 ,9 ,10,11,12,13] ],		//	Death, facing R
				[ 1800, [300, 600, 900, 1200, 1500, 1800], [22,23,24,25,26,27] ],		//	Death, facing L
				[ 600, [150, 300, 400, 450, 500, 525, 550, 575, 600], [6, 7, 6, 7, 6, 7, 6, 7, 6 ] ],	//	Casting, facing R
				[ 600, [150, 300, 400, 450, 500, 525, 550, 575, 600], [20,21,20,21,20,21,20,21,20] ],	//	Casting, facing L
				[ 150, [50, 100, 150], [28,29,30]],			//	Teleport, facing R
				[ 150, [50, 100, 150], [31,32,33]],			//	Teleport, facing L
				[ 150, [50, 100, 150], [28,29,30]],			//	Reappear, facing R
				[ 150, [50, 100, 150], [31,32,33]]			//	Reappear, facing L
			]
		},
		box: {
			width: 10, 
			height: 15
		},
		ai: {
			type: EnumAi.BLACK_WIZ,
		},
		movement: {
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				this.ai.nextAction = 4;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			creatureSounds2.play('blackWizDeath');
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.BLACK_WIZ_WEAPON;
		},
	},

	//	21	RED WIZ
	{
		name: 'Red Wiz',
		lode: EnumLode.FIRE,
		currentSprite: { x: 18, y: 8},
		vars: {
			speed: 1.3,
			maxHP: 7,
			currentHP: 7,
			restingWeaponAnimation: false,
			attackRate: 1,
			nextTeleportTime: 0,
			teleportCooldown: 4000,
			hasGrimlin: true,
			summoned: 0,
			maxElementals: 2,
			minFireballs: 5,
			score: 500
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 18, y: 8 },	//	0	Resting facing R 1
				{ x: 19, y: 8 },	//	1	Resting facing R 2
				{ x: 20, y: 8 },	//	2	Moving facing R 1
				{ x: 21, y: 8 },	//	3	Moving facing R 2
				{ x: 22, y: 8 },	//	4	Moving facing R 3
				{ x: 23, y: 8 },	//	5	Moving facing R 4
				{ x: 24, y: 8 },	//	6	Casting facing R 1
				{ x: 25, y: 8 },	//	7	Casting facing R 2
				{ x: 26, y: 8 },	//	8	Death facing R 1
				{ x: 27, y: 8 },	//	9	Death facing R 2
				{ x: 28, y: 8 },	//	10	Death facing R 3
				{ x: 29, y: 8 },	//	11	Death facing R 4
				{ x: 30, y: 8 },	//	12	Death facing R 5
				{ x: 31, y: 8 },	//	13	Death facing R 6

				{ x: 18, y: 9 },	//	14	Resting facing L 1
				{ x: 19, y: 9 },	//	15	Resting facing L 2
				{ x: 20, y: 9 },	//	16	Moving facing L 1
				{ x: 21, y: 9 },	//	17	Moving facing L 2
				{ x: 22, y: 9 },	//	18	Moving facing L 3
				{ x: 23, y: 9 },	//	19	Moving facing L 4
				{ x: 24, y: 9 },	//	20	Casting facing L 1
				{ x: 25, y: 9 },	//	21	Casting facing L 2
				{ x: 26, y: 9 },	//	22	Death facing L 1
				{ x: 27, y: 9 },	//	23	Death facing L 2
				{ x: 28, y: 9 },	//	24	Death facing L 3
				{ x: 29, y: 9 },	//	25	Death facing L 4
				{ x: 30, y: 9 },	//	26	Death facing L 5
				{ x: 31, y: 9 },	//	27	Death facing L 6

				{ x: 29, y: 2 },	//	28	Teleport facing R 1
				{ x: 30, y: 2 },	//	29	Teleport facing R 2
				{ x: 31, y: 2 },	//	30	Teleport facing R 3
				{ x: 29, y: 3 },	//	31	Teleport facing L 1
				{ x: 30, y: 3 },	//	32	Teleport facing L 2
				{ x: 31, y: 3 }		//	33	Teleport facing L 3

			],
			animations: [
				[ 500, [300, 400], [0, 1] ],											//	Resting, facing R
				[ 500, [300, 400], [14, 15] ],											//	Resting, facing L
				[ 400, [100, 200, 300, 400], [2, 3, 4, 5 ] ],							//	Moving, facing R
				[ 400, [100, 200, 300, 400], [16,17,18,19] ],							//	Moving, facing L
				[ 900, [150, 300, 450, 600, 750, 900], [8 ,9 ,10,11,12,13] ],		//	Death, facing R
				[ 900, [150, 300, 450, 600, 750, 900], [22,23,24,25,26,27] ],		//	Death, facing L
				[ 600, [150, 300, 400, 450, 500, 525, 550, 575, 600], [6, 7, 6, 7, 6, 7, 6, 7, 6 ] ],	//	Casting, facing R
				[ 600, [150, 300, 400, 450, 500, 525, 550, 575, 600], [20,21,20,21,20,21,20,21,20] ],	//	Casting, facing L
				[ 150, [50, 100, 150], [28,29,30]],			//	Teleport, facing R
				[ 150, [50, 100, 150], [31,32,33]],			//	Teleport, facing L
				[ 150, [50, 100, 150], [28,29,30]],			//	Reappear, facing R
				[ 150, [50, 100, 150], [31,32,33]]			//	Reappear, facing L
			]
		},
		box: {
			width: 10, 
			height: 15
		},
		ai: {
			type: EnumAi.RED_WIZ,
		},
		movement: {
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				this.ai.nextAction = 4;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			creatureSounds2.play('redWizDeath');
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.RED_WIZ_WEAPON;
		},
	},

	//	22	BLACK IMP
	{
		name: 'Black Imp',
		lode: EnumLode.SHADOW,
		currentSprite: { x: -1, y: -1},
		vars: {
			speed: 1.4,
			maxHP: 2,
			currentHP: 2,
			restingWeaponAnimation: false,
			score: 0
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 14, y: 10 },	//	Resting facing R 1
				{ x: 15, y: 10 },	//	Resting facing R 2
				{ x: 16, y: 10 },	//	Moving facing R 1
				{ x: 17, y: 10 },	//	Moving facing R 2
				{ x: 18, y: 10 },	//	Moving facing R 3
				{ x: 19, y: 10 },	//	Moving facing R 4
				{ x: 20, y: 10 },	//	Biting facing R 1
				{ x: 21, y: 10 },	//	Biting facing R 2
				{ x: 22, y: 10 },	//	Vanishing facing R 1
				{ x: 23, y: 10 },	//	Vanishing facing R 2
				{ x: 24, y: 10 },	//	Vanishing facing R 3
				{ x: 25, y: 10 },	//	Vanishing facing R 4

				{ x: 14, y: 11 },	//	Resting facing R 1
				{ x: 15, y: 11 },	//	Resting facing R 2
				{ x: 16, y: 11 },	//	Moving facing R 1
				{ x: 17, y: 11 },	//	Moving facing R 2
				{ x: 18, y: 11 },	//	Moving facing R 3
				{ x: 19, y: 11 },	//	Moving facing R 4
				{ x: 20, y: 11 },	//	Biting facing R 1
				{ x: 21, y: 11 },	//	Biting facing R 2
				{ x: 22, y: 11 },	//	Vanishing facing R 1
				{ x: 23, y: 11 },	//	Vanishing facing R 2
				{ x: 24, y: 11 },	//	Vanishing facing R 3
				{ x: 25, y: 11 },	//	Vanishing facing R 4

				{ x: -1, y: -1}		//	Dead (no sprite)
			],
			animations: [
				[ 400, [150, 400], [0, 1 ] ],									//	Resting, facing R
				[ 400, [150, 400], [12,13] ],									//	Resting, facing L
				[ 400, [100, 200, 300, 400], [ 2, 3, 4, 5 ] ],					//	Moving, facing R
				[ 400, [100, 200, 300, 400], [ 14,15,16,17] ],					//	Moving, facing L
				[ 500, [100, 200, 300, 400, 500], [ 8, 9, 10,11,24] ],			//	Death, facing R
				[ 500, [100, 200, 300, 400, 500], [ 20,21,22,23,24] ],			//	Death, facing L
				[ 400, [100, 200, 300, 400], [ 6, 7, 0, 1 ] ],					//	Biting, facing R
				[ 400, [100, 200, 300, 400], [ 18,19,12,13] ],					//	Biting, facing L
				[ 400, [100, 200, 300, 400], [ 23,22,21,20] ]					//	Reappearing
			]
		},
		box: {
			width: 6, 
			height: 12
		},
		ai: {
			type: EnumAi.BLACK_IMP,
		},
		movement: {
			bounceRandom: true
		},
		deathDrop: function() {
		},
		addWeapon: function() {
			return EnumCreatureWeapon.IMP_BITE;
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				var snd = Math.floor(Math.random() * 2);
				if(snd < 1) {
					creatureSounds1.play('squarkKnife1');
				} else {
					creatureSounds1.play('squarkKnife2');
				}
			}
		},
		deathResponse: function() {
			if(this.summoner) {
				this.summoner.vars.summoned--;
			}
			creatureSounds1.play('impDeath');
			this.kill();
		}
	},

	//	23	RED IMP
	{
		name: 'Red Imp',
		lode: EnumLode.SHADOW,
		currentSprite: { x: 0, y: 24},
		vars: {
			speed: 0.9,
			maxHP: 3,
			currentHP: 3,
			restingWeaponAnimation: false,
			attackRate: 1,
			moveThroughColliders: true,
			foreground: true,
			score: 0
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1.5, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 24 },	//	Moving facing R 1
				{ x: 1.5, y: 24 },	//	Moving facing R 2
				{ x: 3, y: 24 },	//	Moving facing R 3
				{ x: 4.5, y: 24 },	//	Moving facing R 4
				{ x: 6, y: 24 },	//	Death facing R 1
				{ x: 7.5, y: 24 },	//	Death facing R 2
				{ x: 9, y: 24 },	//	Death facing R 3
				{ x: 10.5, y: 24 },	//	Death facing R 4

				{ x: 0, y: 25 },	//	Moving facing R 1
				{ x: 1.5, y: 25 },	//	Moving facing R 2
				{ x: 3, y: 25 },	//	Moving facing R 3
				{ x: 4.5, y: 25 },	//	Moving facing R 4
				{ x: 6, y: 25 },	//	Death facing R 1
				{ x: 7.5, y: 25 },	//	Death facing R 2
				{ x: 9, y: 25 },	//	Death facing R 3
				{ x: 10.5, y: 25 }	//	Death facing R 4

			],
			animations: [
				[ 400, [100, 200, 300, 400], [0, 1, 2, 3] ],			//	Resting, facing R
				[ 400, [100, 200, 300, 400], [8, 9, 10,11] ],			//	Resting, facing L
				[ 400, [100, 200, 300, 400], [0, 1, 2, 3] ],			//	Moving, facing R
				[ 400, [100, 200, 300, 400], [8, 9, 10,11] ],			//	Moving, facing L
				[ 800, [200, 400, 600, 800], [4, 5, 6, 7] ],			//	Death, facing R
				[ 800, [200, 400, 600, 800], [12,13,14,15] ]			//	Death, facing L
			]
		},
		box: {
			width: 12, 
			height: 10
		},
		movement: {
			bounceOff: true
		},
		ai: {
			type: EnumAi.RED_IMP,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				var snd = Math.floor(Math.random() * 2);
				if(snd < 1) {
					creatureSounds1.play('squarkKnife1');
				} else {
					creatureSounds1.play('squarkKnife2');
				}
				this.ai.nextAction = 1;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			game.creatures.forEach(function(creature) {
				if(creature.name === 'Red Wiz') {
					creature.vars.minFireballs = 1;
				}
			});
			creatureSounds1.play('impDeath');
			this.kill();
		}
	},

	//	24	GRIMLIN
	{
		name: 'Grimlin',
		lode: EnumLode.ACID,
		currentSprite: { x: 12, y: 24},
		vars: {
			speed: 1,
			maxHP: 3,
			currentHP: 3,
			restingWeaponAnimation: false,
			attackRate: 1,
			score: 0
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 12, y: 24 },	//	Resting facing R 1
				{ x: 13, y: 24 },	//	Resting facing R 2
				{ x: 14, y: 24 },	//	Moving facing R 1
				{ x: 15, y: 24 },	//	Moving facing R 2
				{ x: 16, y: 24 },	//	Moving facing R 3
				{ x: 17, y: 24 },	//	Death facing R 1
				{ x: 18, y: 24 },	//	Death facing R 2
				{ x: 19, y: 24 },	//	Death facing R 3
				{ x: 20, y: 24 },	//	Death facing R 4

				{ x: 12, y: 25 },	//	Resting facing L 1
				{ x: 13, y: 25 },	//	Resting facing L 2
				{ x: 14, y: 25 },	//	Moving facing L 1
				{ x: 15, y: 25 },	//	Moving facing L 2
				{ x: 16, y: 25 },	//	Moving facing L 3
				{ x: 17, y: 25 },	//	Death facing L 1
				{ x: 18, y: 25 },	//	Death facing L 2
				{ x: 19, y: 25 },	//	Death facing L 3
				{ x: 20, y: 25 },	//	Death facing L 4

				{ x: 21, y: 24 },	//	Biting facing R 1
				{ x: 22, y: 24 },	//	Biting facing R 2
				{ x: 21, y: 25 },	//	Biting facing L 1
				{ x: 22, y: 25 }	//	Biting facing L 2
			],
			animations: [
				[ 400, [250, 400], [ 0, 1] ],							//	Resting, facing R
				[ 400, [250, 400], [ 9, 10] ],							//	Resting, facing L
				[ 400, [100, 200, 300, 400], [ 2, 3, 4, 1 ] ],			//	Moving, facing R
				[ 400, [100, 200, 300, 400], [ 11,12,13,10 ] ],			//	Moving, facing L
				[ 800, [200, 400, 600, 800], [5, 6, 7, 8 ] ],			//	Death, facing R
				[ 800, [200, 400, 600, 800], [14,15,16,17] ],			//	Death, facing L
				[ 400, [100, 200, 400], [18,19,0 ] ],					//	Biting, facing R
				[ 400, [100, 200, 400], [20,21,9 ] ]					//	Biting, facing L
			]
		},
		box: {
			width: 10, 
			height: 13
		},
		ai: {
			type: EnumAi.GRIMLIN,
		},
		movement: {
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				playGrimlinNoise();
				this.ai.nextAction = 1;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			playGrimlinNoise(true);
			game.creatures.forEach(function(creature) {
				if(creature.name === 'Red Wiz') {
					creature.vars.hasGrimlin = false;
				}
			});
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.ZOMBI_BITE;
		}	
	},

	//	25	FIRE ELEMENTAL
	{
		name: 'Fire Elemental',
		lode: EnumLode.FIRE,
		currentSprite: { x: 15, y: 20},
		vars: {
			speed: 0.4,
			maxHP: 5,
			currentHP: 5,
			moveThroughColliders: true,
			foreground: true,
			score: 175
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 2 },
			y_padding: 2,
			frames: [
				{ x: 17, y: 20 },
				{ x: 18, y: 20 },
				{ x: 19, y: 20 },
				{ x: 20, y: 20 },
				{ x: 23, y: 20 },
				{ x: 24, y: 20 },
				{ x: 25, y: 20 },
				{ x: 17, y: 22 },
				{ x: 18, y: 22 },
				{ x: 19, y: 22 },
				{ x: 20, y: 22 },
				{ x: 23, y: 22 },
				{ x: 24, y: 22 },
				{ x: 25, y: 22 },
				{ x: -1, y: -1 },
				{ x: 21, y: 20},
				{ x: 22, y: 20},
				{ x: 21, y: 22},
				{ x: 22, y: 22}
			],
			animations: [
				[ 400, [100, 200, 300, 400], [0, 1, 2, 3 ] ],		//	Resting, facing R
				[ 400, [100, 200, 300, 400], [7, 8, 9, 10] ],		//	Resting, facing L
				[ 400, [100, 200, 300, 400], [0, 1, 2, 3 ] ],		//	Moving, facing R
				[ 400, [100, 200, 300, 400], [7, 8, 9, 10] ],		//	Moving, facing L
				[ 800, [200, 400, 600, 800], [4, 5, 6 ,14] ],			//	Death, facing R
				[ 800, [200, 400, 600, 800], [11,12,13,14] ],			//	Death, facing L
				[ 400, [50, 100, 200, 250, 300, 400], [0,15,1 ,2 ,16, 3 ] ],	//	Casting, facing R
				[ 400, [50, 100, 200, 250, 300, 400], [7,17,8 ,9, 18,10 ] ]		//	Casting, facing L
			]
		},
		box: {
			width: 10, 
			height: 25
		},
		ai: {
			type: EnumAi.ELEMENTAL,
		},
		touchDamage: function() {},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			var snd = Math.floor(Math.random() * 2);
			if(snd < 1) {
				creatureSounds1.play('elementalDeath1');
			} else {
				creatureSounds1.play('elementalDeath2');
			}
			if(this.summoner) {
				this.summoner.vars.summoned--;				
			}
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.FIRE_ELEMENTAL_WEAPON;
		}	
	},

	//	26	YELLOW SLUDGIE
	{
		name: 'Yellow Sludgie',
		lode: EnumLode.ACID,
		currentSprite: { x: 9, y: 4 },
		vars: {
			speed: 2.5,
			maxHP: 3,
			currentHP: 3,
			minFacingChangeTime: 50,
			score: 100
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{x:9,y:8}, {x:10,y:8}, {x:11,y:8}, {x:12,y:8}, {x:13,y:8}, {x:14,y:8},
				{x:9,y:9}, {x:10,y:9}, {x:11,y:9}, {x:12,y:9}, {x:13,y:9}, {x:14,y:9},
				{x:15,y:8}, {x:16,y:8}, {x:17,y:8}, {x:15,y:9},	{x:16,y:9}, {x:17,y:9}
			],
			animations: [
				[ 1800, [300, 600, 900, 1200, 1500, 1800], [0, 1, 2, 1, 0, 1] ],		//	Resting, facing R
				[ 1800, [300, 600, 900, 1200, 1500, 1800], [6, 7, 8, 7, 6, 7] ],		//	Resting, facing L
				[ 1000, [150, 300, 700, 850, 1000], [3, 4, 5, 4, 3] ],					//	Moving, facing R
				[ 1000, [150, 300, 700, 850, 1000], [9, 10, 11, 10, 9] ],				//	Moving, facing L
				[ 2400, [800, 1600, 2400], [12, 13, 14]],								//	Death, facing R
				[ 2400, [800, 1600, 2400], [15, 16, 17]]								//	Death, facing L
			]
		},
		box: {
			width: 14, 
			height: 7
		},
		ai: {
			type: EnumAi.YELLOW_SLUDGIE,
		},
		movement: {
			bounceOff: true
		},
		touchDamage: function() {
			var touchDamage = {
				baseDamage: 1,
				criticalMax: 3,
				lode: EnumLode.ACID
			}
			return touchDamage;
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				this.ai.nextAction = 2;
				clearAiAction(this);
				playSludgieNoise();
			}
		},
		deathResponse: function() {
			playSludgieNoise(true);
			this.kill();
		}
	},

	//	27	GREY GOBLIN
	{
		name: 'Grey Goblin',
		lode: EnumLode.NONE,
		currentSprite: { x: 0, y: 0},
		vars: {
			speed: 0.8,
			maxHP: 3,
			currentHP: 3,
			score: 100
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 6, y: 0 },	//	Facing R 1
				{ x: 7, y: 0 },	//	Facing R 2
				{ x: 8, y: 0 },	//	Facing R 3
				{ x: 9, y: 0 },	//	Facing R 4
				{ x: 6, y: 1 },	//	Facing L 1
				{ x: 7, y: 1 },	//	Facing L 2
				{ x: 8, y: 1 },	//	Facing L 3
				{ x: 9, y: 1 },	//	Facing L 4
				{ x: 10, y: 0 },	//	Death facing R 1
				{ x: 11, y: 0 },	//	Death facing R 2
				{ x: 10, y: 1 },	//	Death facing L 1
				{ x: 11, y: 1 }	//	Death facing L 2
			],
			animations: [
				[ 800, [600, 800], [ 0, 1] ],												//	Resting, facing R
				[ 800, [600, 800], [ 4, 5] ],												//	Resting, facing L
				[ 250, [50, 100, 150, 200, 250], [ 0, 1, 2, 3, 1 ] ],						//	Moving, facing R
				[ 250, [50, 100, 150, 200, 250], [ 4, 5, 6, 7, 5 ] ],						//	Moving, facing L
				[ 1000, [500, 1000], [8, 9] ],												//	Death, facing R
				[ 1000, [500, 1000], [10, 11] ]												//	Death, facing L
			]
		},
		box: {
			width: 10, 
			height: 10
		},
		ai: {
			type: EnumAi.GREY_GOBLIN,
		},
		movement: {
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				playGoblinNoise();
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			playGoblinNoise(true);
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.GREEN_GOBLIN_CLAW;
		}	
	},

	//	28	ALBINO URK
	{
		name: 'Albino Urk',
		lode: EnumLode.CRYSTAL,
		currentSprite: { x: 23, y: 24},
		vars: {
			speed: 0.6,
			maxHP: 5,
			currentHP: 5,
			restingWeaponAnimation: true,
			attackRate: 0.8,
			score: 100
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 23, y: 24 },	//	Resting facing R 1
				{ x: 24, y: 24 },	//	Resting facing R 2
				{ x: 25, y: 24 },	//	Moving facing R 1
				{ x: 26, y: 24 },	//	Moving facing R 2
				{ x: 27, y: 24 },	//	Moving facing R 3
				{ x: 28, y: 24 },	//	Death facing R 1
				{ x: 29, y: 24 },	//	Death facing R 2
				{ x: 30, y: 24 },	//	Death facing R 3
				{ x: 23, y: 25 },	//	Resting facing L 1
				{ x: 24, y: 25 },	//	Resting facing L 2
				{ x: 25, y: 25 },	//	Moving facing L 1
				{ x: 26, y: 25 },	//	Moving facing L 2
				{ x: 27, y: 25 },	//	Moving facing L 3
				{ x: 28, y: 25 },	//	Death facing L 1
				{ x: 29, y: 25 },	//	Death facing L 2
				{ x: 30, y: 25 }		//	Death facing L 3
			],
			animations: [
				[ 800, [500, 800], [ 0, 1] ],											//	Resting, facing R
				[ 800, [500, 800], [ 8, 9] ],											//	Resting, facing L
				[ 600, [150, 300, 450, 600], [ 2, 3, 4, 1 ] ],							//	Moving, facing R
				[ 600, [150, 300, 450, 600], [ 10,11,12,9 ] ],							//	Moving, facing L
				[ 900, [300, 600, 900], [5, 6, 7 ] ],									//	Death, facing R
				[ 900, [300, 600, 900], [13,14,15] ]									//	Death, facing L
			]
		},
		box: {
			width: 10, 
			height: 15
		},
		movement: {
			bounceRandom: true
		},
		ai: {
			type: EnumAi.URK_VETERAN,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				playUrkGrunt();
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			playUrkGrunt(true);
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.ALBINO_URK_SWORD;
		}	
	},	

	//	29	MINI KOB
	{
		name: 'Mini Kob',
		lode: EnumLode.NONE,
		currentSprite: { x: 0, y: 22},
		vars: {
			speed: 1,
			maxHP: 3,
			currentHP: 3,
			restingWeaponAnimation: true,
			score: 50
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 22 },	//	Resting facing R 1
				{ x: 1, y: 22 },	//	Resting facing R 2
				{ x: 2, y: 22 },	//	Moving facing R 1
				{ x: 3, y: 22 },	//	Moving facing R 2
				{ x: 4, y: 22 },	//	Moving facing R 3
				{ x: 5, y: 22 },	//	Death facing R 1
				{ x: 6, y: 22 },	//	Death facing R 2
				{ x: 7, y: 22 },	//	Death facing R 3
				{ x: 0, y: 23 },	//	Resting facing L 1
				{ x: 1, y: 23 },	//	Resting facing L 2
				{ x: 2, y: 23 },	//	Moving facing L 1
				{ x: 3, y: 23 },	//	Moving facing L 2
				{ x: 4, y: 23 },	//	Moving facing L 3
				{ x: 5, y: 23 },	//	Death facing L 1
				{ x: 6, y: 23 },	//	Death facing L 2
				{ x: 7, y: 23 }		//	Death facing L 3
			],
			animations: [
				[ 400, [250, 400], [ 0, 1] ],											//	Resting, facing R
				[ 400, [250, 400], [ 8, 9] ],											//	Resting, facing L
				[ 400, [100, 200, 300, 400], [ 2, 3, 4, 1 ] ],							//	Moving, facing R
				[ 400, [100, 200, 300, 400], [ 10,11,12,9 ] ],							//	Moving, facing L
				[ 900, [300, 600, 900], [5, 6, 7 ] ],									//	Death, facing R
				[ 900, [300, 600, 900], [13,14,15] ]									//	Death, facing L
			]
		},
		box: {
			width: 8, 
			height: 11
		},
		movement: {
			bounceRandom: true
		},
		ai: {
			type: EnumAi.KOB,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				playMiniKobNoise();
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			playMiniKobNoise(true);
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.MINI_KOB_KNIFE;
		}	
	},
	//	30	GIGA KOB
	{
		name: 'Giga Kob',
		lode: EnumLode.NONE,
		currentSprite: { x: 0, y: 26},
		vars: {
			speed: 0.6,
			maxHP: 12,
			currentHP: 12,
			restingWeaponAnimation: true,
			score: 200
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 2, y: 2 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 26 },	//	Resting facing R 1
				{ x: 2, y: 26 },	//	Resting facing R 2
				{ x: 4, y: 26 },	//	Moving facing R 1
				{ x: 6, y: 26 },	//	Moving facing R 2
				{ x: 8, y: 26 },	//	Moving facing R 3
				{ x: 10, y: 26 },	//	Moving facing R 4
				{ x: 12, y: 26 },	//	Death facing R 1
				{ x: 14, y: 26 },	//	Death facing R 2
				{ x: 16, y: 26 },	//	Death facing R 3
				{ x: 18, y: 26 },	//	Death facing R 4
				{ x: 20, y: 26 },	//	Death facing R 5
				{ x: 22, y: 26 },	//	Death facing R 6
				{ x: 24, y: 26 },	//	Death facing R 7

				{ x: 0, y: 28 },	//	Resting facing R 1
				{ x: 2, y: 28 },	//	Resting facing R 2
				{ x: 4, y: 28 },	//	Moving facing R 1
				{ x: 6, y: 28 },	//	Moving facing R 2
				{ x: 8, y: 28 },	//	Moving facing R 3
				{ x: 10, y: 28 },	//	Moving facing R 4
				{ x: 12, y: 28 },	//	Death facing R 1
				{ x: 14, y: 28 },	//	Death facing R 2
				{ x: 16, y: 28 },	//	Death facing R 3
				{ x: 18, y: 28 },	//	Death facing R 1
				{ x: 20, y: 28 },	//	Death facing R 2
				{ x: 22, y: 28 },	//	Death facing R 3
				{ x: 24, y: 28 }	//	Death facing R 3
			],
			animations: [
				[ 800, [500, 800], [ 0, 1] ],											//	Resting, facing R
				[ 800, [500, 800], [ 13,14] ],											//	Resting, facing L
				[ 800, [150, 450, 600, 800], [ 2, 3, 4, 5 ] ],							//	Moving, facing R
				[ 800, [150, 450, 600, 800], [ 15,16,17,18] ],							//	Moving, facing L
				[ 2100, [300, 600, 900, 1200, 1500, 1800, 2100], [6, 7, 8, 9, 10,11,12] ],		//	Death, facing R
				[ 2100, [300, 600, 900, 1200, 1500, 1800, 2100], [19,20,21,22,23,24,25] ]		//	Death, facing L
			]
		},
		box: {
			width: 16, 
			height: 30
		},
		movement: {
			bounceRandom: true
		},
		ai: {
			type: EnumAi.URK_VETERAN,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				this.ai.nextAction = 2;
				clearAiAction(this);
				playGigaKobNoise();
			}
		},
		deathResponse: function() {
			playGigaKobNoise(true);
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.GIGA_KOB_AXE;
		}	
	},

	//	31	BADBUG
	{
		name: 'Badbug',
		lode: EnumLode.ACID,
		currentSprite: { x: 0, y: 30},
		vars: {
			speed: 1.2,
			maxHP: 3,
			currentHP: 3,
			restingWeaponAnimation: false,
			attackRate: 1,
			score: 50
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 30 },	//	Resting facing R 1
				{ x: 1, y: 30 },	//	Resting facing R 2
				{ x: 2, y: 30 },	//	Moving facing R 1
				{ x: 3, y: 30 },	//	Moving facing R 2
				{ x: 4, y: 30 },	//	Moving facing R 3
				{ x: 5, y: 30 },	//	Moving facing R 4
				{ x: 6, y: 30 },	//	Death facing R 1
				{ x: 7, y: 30 },	//	Death facing R 2
				{ x: 8, y: 30 },	//	Death facing R 3
				{ x: 9, y: 30 },	//	Death facing R 4
				{ x: 10, y: 30 },	//	Biting facing R 1
				{ x: 11, y: 30 },	//	Biting facing R 2

				{ x: 0, y: 31 },	//	Resting facing L 1
				{ x: 1, y: 31 },	//	Resting facing L 2
				{ x: 2, y: 31 },	//	Moving facing L 1
				{ x: 3, y: 31 },	//	Moving facing L 2
				{ x: 4, y: 31 },	//	Moving facing L 3
				{ x: 5, y: 31 },	//	Moving facing L 4
				{ x: 6, y: 31 },	//	Death facing L 1
				{ x: 7, y: 31 },	//	Death facing L 2
				{ x: 8, y: 31 },	//	Death facing L 3
				{ x: 9, y: 31 },	//	Death facing L 4
				{ x: 10, y: 31 },	//	Biting facing L 1
				{ x: 11, y: 31 },	//	Biting facing L 2

			],
			animations: [
				[ 200, [100, 200], [ 0, 1] ],							//	Resting, facing R
				[ 200, [100, 200], [ 12, 13] ],							//	Resting, facing L
				[ 400, [100, 200, 300, 400], [ 2, 3, 4, 5 ] ],			//	Moving, facing R
				[ 400, [100, 200, 300, 400], [ 14,15,16,17 ] ],			//	Moving, facing L
				[ 800, [200, 400, 600, 800], [6, 7, 8, 9 ] ],			//	Death, facing R
				[ 800, [200, 400, 600, 800], [18,19,20,21] ],			//	Death, facing L
				[ 400, [100, 200, 400], [10,11,0 ] ],					//	Biting, facing R
				[ 400, [100, 200, 400], [22,23,12] ]					//	Biting, facing L
			]
		},
		box: {
			width: 10, 
			height: 13
		},
		ai: {
			type: EnumAi.BADBUG,
		},
		movement: {
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				playBadbugNoise(false, true);
				this.ai.nextAction = 1;
				// clearAiAction(this);
			}
		},
		deathResponse: function() {
			playBadbugNoise(false, false, false, true);
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.BADBUG_BITE;
		}	
	},

	//	32	WRONGWRAITH
	{
		name: 'Wrongwraith',
		lode: EnumLode.SHADOW,
		currentSprite: { x: 0, y: 32},
		vars: {
			speed: 0.5,
			maxHP: 5,
			currentHP: 5,
			moveThroughColliders: true,
			touchDamage: true,
			foreground: true,
			score: 200
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 2, y: 2 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 32 },		//	70%	1 R
				{ x: 2, y: 32 },		//	70% 2 R
				{ x: 4, y: 32 },		//	40% 1 R
				{ x: 6, y: 32 },		//	40% 2 R
				{ x: 8, y: 32 },		//	20% 1 R
				{ x: 10, y: 32 },		//	20% 2 R
				{ x: 12, y: 32 },		//	Eyes 1 R
				{ x: 14, y: 32 },		//	Eyes 2 R
				{ x: 16, y: 32 },		//	Death R 1
				{ x: 18, y: 32 },		//	Death R 2
				{ x: 20, y: 32 },		//	Death R 3

				{ x: 0, y: 34 },		//	70%	1 L
				{ x: 2, y: 34 },		//	70% 2 L
				{ x: 4, y: 34 },		//	40% 1 L
				{ x: 6, y: 34 },		//	40% 2 L
				{ x: 8, y: 34 },		//	20% 1 L
				{ x: 10, y: 34 },		//	20% 2 L
				{ x: 12, y: 34 },		//	Eyes 1 L
				{ x: 14, y: 34 },		//	Eyes 2 L
				{ x: 16, y: 34 },		//	Death L 1
				{ x: 18, y: 34 },		//	Death L 2
				{ x: 20, y: 34 },		//	Death L 3

				{ x: -2, y: -2 },			//	Empty frame!
			],
			animations: [
				[ 200, [100, 200], [6, 7] ],						//	Resting, facing R (eyes)
				[ 200, [100, 200], [17, 18] ],						//	Resting, facing L (eyes)
				[ 200, [100, 200], [6, 7] ],						//	Moving, facing R (eyes)
				[ 200, [100, 200], [17, 18] ],						//	Moving, facing L (eyes)
				[ 800, [200, 400, 600, 800], [8, 9, 10,22] ],		//	Death, facing R
				[ 800, [200, 400, 600, 800], [19,20,21,22] ],		//	Death, facing L
				[ 600, [100, 200, 300, 400, 500, 600], [0, 1, 2, 3, 4, 5]],		//	Fade out, facing R
				[ 600, [100, 200, 300, 400, 500, 600], [11,12,13,14,15,16]]		//	Fade out, facing L
			]
		},
		box: {
			width: 12, 
			height: 16,
			base_offset: -10
		},
		ai: {
			type: EnumAi.WRONGWRAITH,
		},
		movement: {
			bounceRandom: true
		},
		touchDamage: function() {
			var touchDamage = {
				baseDamage: 3,
				criticalMax: 3,
				attacker: 'Wrongwraith',
				lode: EnumLode.SHADOW
			}
			this.ai.nextAction = 1;
			clearAiAction(this);
			return touchDamage;
		},
		inflictDamage: function(damage, lode) {
			if(lode === EnumLode.CRYSTAL || lode === EnumLode.SHADOW || lode === EnumLode.LIGHTNING) {
				this.ai.nextAction = 1;
				clearAiAction(this);
				this.vars.currentHP -= damage;
				if(this.vars.currentHP <= 0) {
					this.deathResponse();
				}
			}
		},
		deathResponse: function() {
			creatureSounds2.play('ghostDeath');
			this.kill();
		}
	},
	//	THE BARON
	{
		name: 'The Baron',
		lode: EnumLode.NONE,
		currentSprite: { x: 12, y: 30},
		vars: {
			speed: 1,
			maxHP: 5,
			currentHP: 5,
			restingWeaponAnimation: true,
			baronOrbs: 5,
			score: 2500
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 12, y: 30 },	//	Resting facing R 1
				{ x: 13, y: 30 },	//	Resting facing R 2
				{ x: 14, y: 30 },	//	Moving facing R 1
				{ x: 15, y: 30 },	//	Moving facing R 2
				{ x: 16, y: 30 },	//	Moving facing R 3
				{ x: 17, y: 30 },	//	Moving facing R 3
				{ x: 18, y: 30 },	//	Death facing R 1
				{ x: 19, y: 30 },	//	Death facing R 2
				{ x: 20, y: 30 },	//	Death facing R 3
				{ x: 21, y: 30 },	//	Death facing R 4
				{ x: 22, y: 30 },	//	Death facing R 5
				{ x: 23, y: 30 },	//	Death facing R 6
				{ x: 24, y: 30 },	//	Death facing R 7
				{ x: 25, y: 30 },	//	Death facing R 8

				{ x: 12, y: 31 },	//	Resting facing L 1
				{ x: 13, y: 31 },	//	Resting facing L 2
				{ x: 14, y: 31 },	//	Moving facing L 1
				{ x: 15, y: 31 },	//	Moving facing L 2
				{ x: 16, y: 31 },	//	Moving facing L 3
				{ x: 17, y: 31 },	//	Moving facing L 3
				{ x: 18, y: 31 },	//	Death facing L 1
				{ x: 19, y: 31 },	//	Death facing L 2
				{ x: 20, y: 31 },	//	Death facing L 3
				{ x: 21, y: 31 },	//	Death facing L 4
				{ x: 22, y: 31 },	//	Death facing L 5
				{ x: 23, y: 31 },	//	Death facing L 6
				{ x: 24, y: 31 },	//	Death facing L 7
				{ x: 25, y: 31 }	//	Death facing L 8
			],
			animations: [
				[ 400, [250, 400], [ 0, 1] ],											//	Resting, facing R
				[ 400, [250, 400], [ 14,15] ],											//	Resting, facing L
				[ 400, [100, 200, 300, 400], [ 2, 3, 4, 5 ] ],							//	Moving, facing R
				[ 400, [100, 200, 300, 400], [ 14,15,16,17 ] ],							//	Moving, facing L
				[ 2400, [300, 600, 900, 1200, 1500, 1800, 2100, 2400], [6, 7, 8, 9,10,11,12,13 ] ],									//	Death, facing R
				[ 2400, [300, 600, 900, 1200, 1500, 1800, 2100, 2400], [18,19,20,21,22,23,24,25] ]									//	Death, facing L
			]
		},
		box: {
			width: 10, 
			height: 14
		},
		movement: {
			bounceRandom: true
		},
		ai: {
			type: EnumAi.BARON,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				var snd = Math.floor(Math.random() * 2);
				if(snd < 1) {
					creatureSounds2.play('genericHit1');
				} else {
					creatureSounds2.play('genericHit2');
				}
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			baronDeath();
			session.flags.regenerateBaronDeemons = false;
			game.creatures.forEach(function(creature) {
				if(creature.ai.type === EnumAi.DEEMON) {
					creature.deathResponse();
				}
			});
			creatureSounds2.play('baronDeath');
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.BARON_SWORD;
		},
		deathDrop: function() {
			var item = new Item(itemTemplates[EnumItem.GOLD_KEY], this.grid.x, this.grid.y);
			item.position.x = this.position.x;
			item.position.y = this.position.y + 2;
			item.movement.speed = 1;
			item.movement.direction = getPlayerDirection(this) + Math.PI;
		}	
	},
	{
		name: 'Baron Orb',
		lode: EnumLode.NONE,
		currentSprite: { x: 22, y: 32},
		vars: {
			speed: 1,
			maxHP: 1,
			currentHP: 1,
			restingWeaponAnimation: false,
			score: 0,
			corpseBox: true
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 2 },
			y_padding: 2,
			frames: [
				{ x: 22, y: 32 },	//	Resting 1
				{ x: 23, y: 32 },	//	Resting 2
				{ x: 24, y: 32 },	//	Resting 3
				{ x: 25, y: 32 },	//	Sparking 1
				{ x: 26, y: 32 },	//	Sparking 2
				{ x: 27, y: 32 },	//	Sparking 3
				{ x: 28, y: 32 },	//	Death 1
				{ x: 29, y: 32 },	//	Death 2
				{ x: 30, y: 32 },	//	Death 3
			],
			animations: [
				[ 4000, [200, 250, 350, 600, 700, 725, 750, 775, 850, 925, 950, 975, 1400, 2000, 3000, 3025, 3400, 3425, 3450, 4000], [0,1,2,0,3,4,5,1,0,5,3,2,0,1,2,1,2,3,5,0] ],		//	Resting, facing R
				[ 4000, [200, 250, 350, 600, 700, 725, 750, 775, 850, 925, 950, 975, 1400, 2000, 3000, 3025, 3400, 3425, 3450, 4000], [0,1,2,0,3,4,5,1,0,5,3,2,0,1,2,1,2,3,5,0] ],		//	Resting, facing R
				[ 4000, [200, 250, 350, 600, 700, 725, 750, 775, 850, 925, 950, 975, 1400, 2000, 3000, 3025, 3400, 3425, 3450, 4000], [0,1,2,0,3,4,5,1,0,5,3,2,0,1,2,1,2,3,5,0] ],		//	Resting, facing R
				[ 4000, [200, 250, 350, 600, 700, 725, 750, 775, 850, 925, 950, 975, 1400, 2000, 3000, 3025, 3400, 3425, 3450, 4000], [0,1,2,0,3,4,5,1,0,5,3,2,0,1,2,1,2,3,5,0] ],		//	Resting, facing R
				[ 600, [200, 400, 600], [6, 7, 8 ] ],									//	Death, facing R
				[ 600, [200, 400, 600], [6, 7, 8 ] ],									//	Death, facing L
				[ 1000, [1000], [8]],						//	Dead
				[ 1000, [1000], [8]]						//	Dead
			]
		},
		box: {
			width: 10, 
			height: 14,
		},
		ai: {
			type: EnumAi.BARON_ORB,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			}
		},
		deathResponse: function() {
			if(!this.vars.destroyed) {
				lightningHitSound();
				this.vars.destroyed = true;
				clearAiAction(this);
				this.ai.nextAction = 1;														//	Prevent further AI actions
				session.flags.baronOrbs--;
				if(session.flags.baronOrbs < 1) {
					baronEncounter3();
				}
			}
		}
	},
	//	DEEMON 1
	{
		name: 'Deemon 1',
		lode: EnumLode.SHADOW,
		currentSprite: { x: -1, y: -1},
		vars: {
			speed: 1.7,
			maxHP: 3,
			currentHP: 3,
			restingWeaponAnimation: false,
			attackRate: 1,
			score: 0
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 36 },	//	Resting facing R 1
				{ x: 1, y: 36 },	//	Resting facing R 2
				{ x: 2, y: 36 },	//	Moving facing R 1
				{ x: 3, y: 36 },	//	Moving facing R 2
				{ x: 4, y: 36 },	//	Moving facing R 3
				{ x: 5, y: 36 },	//	Moving facing R 4
				{ x: 6, y: 36 },	//	Biting facing R 1
				{ x: 7, y: 36 },	//	Biting facing R 2
				{ x: 8, y: 36 },	//	Biting facing R 3
				{ x: 9, y: 36 },	//	Death facing R 1
				{ x: 10, y: 36 },	//	Death facing R 2
				{ x: 11, y: 36 },	//	Death facing R 3
				{ x: 12, y: 36 },	//	Death facing R 4
				{ x: 13, y: 36 },	//	Death facing R 5

				{ x: 0, y: 37 },	//	Resting facing L 1
				{ x: 1, y: 37 },	//	Resting facing L 2
				{ x: 2, y: 37 },	//	Moving facing L 1
				{ x: 3, y: 37 },	//	Moving facing L 2
				{ x: 4, y: 37 },	//	Moving facing L 3
				{ x: 5, y: 37 },	//	Moving facing L 4
				{ x: 6, y: 37 },	//	Biting facing L 1
				{ x: 7, y: 37 },	//	Biting facing L 2
				{ x: 8, y: 37 },	//	Biting facing L 3
				{ x: 9, y: 37 },	//	Death facing L 1
				{ x: 10, y: 37 },	//	Death facing L 2
				{ x: 11, y: 37 },	//	Death facing L 3
				{ x: 12, y: 37 },	//	Death facing L 4
				{ x: 13, y: 37 },	//	Death facing L 5

				{ x: -1, y: -1},	//	Dead

				{ x: 14, y: 36 },	//	Appearing, facing R 1
				{ x: 15, y: 36 },	//	Appearing, facing R 2
				{ x: 16, y: 36 },	//	Appearing, facing R 3
				{ x: 14, y: 37 },	//	Appearing, facing L 1
				{ x: 15, y: 37 },	//	Appearing, facing L 2
				{ x: 16, y: 37 }	//	Appearing, facing L 3
			],
			animations: [
				[ 200, [100, 200], [ 0, 1] ],							//	Resting, facing R
				[ 200, [100, 200], [ 14, 15] ],							//	Resting, facing L
				[ 400, [100, 200, 300, 400], [ 2, 3, 4, 5 ] ],			//	Moving, facing R
				[ 400, [100, 200, 300, 400], [ 16,17,18,19 ] ],			//	Moving, facing L
				[ 600, [100, 200, 300, 400, 500, 600 ], [ 9,10,11,12,13,28 ] ],			//	Death, facing R
				[ 600, [100, 200, 300, 400, 500, 600 ], [23,24,25,26,27,28 ] ],			//	Death, facing L
				[ 400, [100, 200, 400], [6 ,7 ,8 ] ],					//	Biting, facing R
				[ 400, [100, 200, 400], [20,21,22] ],					//	Biting, facing L
				[ 400, [100, 200, 300, 400], [29,30,31,0 ]],			//	Appearing, facing R				
				[ 400, [100, 200, 300, 400], [32,33,34,14]],			//	Appearing, facing L				
				[ 100, [100], [28]],									//	Invisible, facing R		
				[ 100, [100], [28]]										//	Invisible, facing L		
			]
		},
		box: {
			width: 10, 
			height: 13
		},
		ai: {
			type: EnumAi.DEEMON,
		},
		movement: {
			bounceOff: true,
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				var snd = Math.floor(Math.random() * 2);
				if(snd < 1) {
					creatureSounds1.play('squarkKnife1');
				} else {
					creatureSounds1.play('squarkKnife2');
				}
			}
		},
		deathResponse: function() {
			this.kill();
			creatureSounds1.play('impDeath');
			if(session.flags.regenerateBaronDeemons) {
				var rand = Math.floor(Math.random() * 2);
				var deemonType;
				if(rand < 1) {
					deemonType = EnumCreature.DEEMON_1;
				} else {
					deemonType = EnumCreature.DEEMON_2;
				}
				var newDeemon = new Creature(creatureTemplates[deemonType]);
				var isBlocked = true;
				while(isBlocked) {
					var y = 16;
					var side = Math.floor(Math.random() * 2);
					if(side < 1) {
						var x = Math.floor(Math.random() * 6) + 8;
					} else {
						var x = Math.floor(Math.random() * 6) + 19;
					}
					newDeemon.position.x = x * TILE_SIZE + TILE_SIZE / 2;
					newDeemon.position.y = y * TILE_SIZE + TILE_SIZE / 2;
					newDeemon.grid.x = x;
					newDeemon.grid.y = y;
					newDeemon.updateBox();
					if(!(newDeemon.checkIfCollides())) {
						isBlocked = false;
					}
				}
				newDeemon.type = deemonType;
				newDeemon.ai.nextAction = 1;
				newDeemon.ai.endTime = performance.now() + 1;
				// console.log(newDeemon);
				creatureSounds1.play('summonImp')
				game.creatures.push(newDeemon);
			}
		},
		deathDrop: function() {
		},
		addWeapon: function() {
			return EnumCreatureWeapon.DEEMON_BITE;
		}	
	},
	//	DEEMON 2
	{
		name: 'Deemon 2',
		lode: EnumLode.SHADOW,
		currentSprite: { x: -1, y: -1},
		vars: {
			speed: 1.7,
			maxHP: 3,
			currentHP: 3,
			restingWeaponAnimation: false,
			attackRate: 1,
			score: 0
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 38 },	//	Resting facing R 1
				{ x: 1, y: 38 },	//	Resting facing R 2
				{ x: 2, y: 38 },	//	Moving facing R 1
				{ x: 3, y: 38 },	//	Moving facing R 2
				{ x: 4, y: 38 },	//	Moving facing R 3
				{ x: 5, y: 38 },	//	Moving facing R 4
				{ x: 6, y: 38 },	//	Biting facing R 1
				{ x: 7, y: 38 },	//	Biting facing R 2
				{ x: 8, y: 38 },	//	Biting facing R 3
				{ x: 9, y: 38 },	//	Death facing R 1
				{ x: 10, y: 38 },	//	Death facing R 2
				{ x: 11, y: 38 },	//	Death facing R 3
				{ x: 12, y: 38 },	//	Death facing R 4
				{ x: 13, y: 38 },	//	Death facing R 5

				{ x: 0, y: 39 },	//	Resting facing L 1
				{ x: 1, y: 39 },	//	Resting facing L 2
				{ x: 2, y: 39 },	//	Moving facing L 1
				{ x: 3, y: 39 },	//	Moving facing L 2
				{ x: 4, y: 39 },	//	Moving facing L 3
				{ x: 5, y: 39 },	//	Moving facing L 4
				{ x: 6, y: 39 },	//	Biting facing L 1
				{ x: 7, y: 39 },	//	Biting facing L 2
				{ x: 8, y: 39 },	//	Biting facing L 3
				{ x: 9, y: 39 },	//	Death facing L 1
				{ x: 10, y: 39 },	//	Death facing L 2
				{ x: 11, y: 39 },	//	Death facing L 3
				{ x: 12, y: 39 },	//	Death facing L 4
				{ x: 13, y: 39 },	//	Death facing L 5

				{ x: -1, y: -1},	//	Dead

				{ x: 14, y: 38 },	//	Appearing, facing R 1
				{ x: 15, y: 38 },	//	Appearing, facing R 2
				{ x: 16, y: 38 },	//	Appearing, facing R 3
				{ x: 14, y: 39 },	//	Appearing, facing L 1
				{ x: 15, y: 39 },	//	Appearing, facing L 2
				{ x: 16, y: 39 }	//	Appearing, facing L 3
			],
			animations: [
				[ 200, [100, 200], [ 0, 1] ],							//	Resting, facing R
				[ 200, [100, 200], [ 14, 15] ],							//	Resting, facing L
				[ 400, [100, 200, 300, 400], [ 2, 3, 4, 5 ] ],			//	Moving, facing R
				[ 400, [100, 200, 300, 400], [ 16,17,18,19 ] ],			//	Moving, facing L
				[ 600, [100, 200, 300, 400, 500, 600 ], [ 9,10,11,12,13,28 ] ],			//	Death, facing R
				[ 600, [100, 200, 300, 400, 500, 600 ], [23,24,25,26,27,28 ] ],			//	Death, facing L
				[ 400, [100, 200, 400], [6 ,7 ,8 ] ],					//	Biting, facing R
				[ 400, [100, 200, 400], [20,21,22] ],					//	Biting, facing L
				[ 400, [100, 200, 300, 400], [29,30,31,0 ]],			//	Appearing, facing R				
				[ 400, [100, 200, 300, 400], [32,33,34,14]],			//	Appearing, facing L		
				[ 100, [100], [28]],									//	Invisible, facing R		
				[ 100, [100], [28]]										//	Invisible, facing L		
			]
		},
		box: {
			width: 10, 
			height: 13
		},
		ai: {
			type: EnumAi.DEEMON,
		},
		movement: {
			bounceOff: true,
			bounceRandom: true
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				var snd = Math.floor(Math.random() * 2);
				if(snd < 1) {
					creatureSounds1.play('squarkKnife1');
				} else {
					creatureSounds1.play('squarkKnife2');
				}
			}
		},
		deathResponse: function() {
			this.kill();
			creatureSounds1.play('impDeath');
			if(session.flags.regenerateBaronDeemons) {
				var rand = Math.floor(Math.random() * 2);
				var deemonType;
				if(rand < 1) {
					deemonType = EnumCreature.DEEMON_1;
				} else {
					deemonType = EnumCreature.DEEMON_2;
				}
				var newDeemon = new Creature(creatureTemplates[deemonType]);
				var isBlocked = true;
				while(isBlocked) {
					var y = 16;
					var side = Math.floor(Math.random() * 2);
					if(side < 1) {
						var x = Math.floor(Math.random() * 6) + 8;
					} else {
						var x = Math.floor(Math.random() * 6) + 19;
					}
					newDeemon.position.x = x * TILE_SIZE + TILE_SIZE / 2;
					newDeemon.position.y = y * TILE_SIZE + TILE_SIZE / 2;
					newDeemon.grid.x = x;
					newDeemon.grid.y = y;
					newDeemon.updateBox();
					if(!(newDeemon.checkIfCollides())) {
						isBlocked = false;
					}
				}
				newDeemon.type = deemonType;
				newDeemon.ai.nextAction = 1;
				newDeemon.ai.endTime = performance.now() + 1;
				// console.log(newDeemon);
				creatureSounds1.play('summonImp')
				game.creatures.push(newDeemon);
			}
		},
		deathDrop: function() {
		},
		addWeapon: function() {
			return EnumCreatureWeapon.DEEMON_BITE;
		}	
	},
	//	ROCKO
	{
		name: 'Rocko',
		lode: EnumLode.CRYSTAL,
		currentSprite: { x: 17, y: 36},
		vars: {
			speed: 0.4,
			maxHP: 6,
			currentHP: 6,
			restingWeaponAnimation: true,
			score: 90
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 17, y: 36 },	//	Resting facing R 1
				{ x: 18, y: 36 },	//	Resting facing R 2
				{ x: 19, y: 36 },	//	Moving facing R 1
				{ x: 20, y: 36 },	//	Moving facing R 2
				{ x: 21, y: 36 },	//	Moving facing R 3
				{ x: 22, y: 36 },	//	Moving facing R 4
				{ x: 23, y: 36 },	//	Attacking facing R 1
				{ x: 24, y: 36 },	//	Attacking facing R 2
				{ x: 25, y: 36 },	//	Death facing R 1
				{ x: 26, y: 36 },	//	Death facing R 2
				{ x: 27, y: 36 },	//	Death facing R 3
				{ x: 28, y: 36 },	//	Death facing R 4
				{ x: 29, y: 36 },	//	Death facing R 5
				{ x: 30, y: 36 },	//	Death facing R 6

				{ x: 17, y: 37 },	//	Resting facing L 1
				{ x: 18, y: 37 },	//	Resting facing L 2
				{ x: 19, y: 37 },	//	Moving facing L 1
				{ x: 20, y: 37 },	//	Moving facing L 2
				{ x: 21, y: 37 },	//	Moving facing L 3
				{ x: 22, y: 37 },	//	Moving facing L 4
				{ x: 23, y: 37 },	//	Attacking facing L 1
				{ x: 24, y: 37 },	//	Attacking facing L 2
				{ x: 25, y: 37 },	//	Death facing L 1
				{ x: 26, y: 37 },	//	Death facing L 2
				{ x: 27, y: 37 },	//	Death facing L 3
				{ x: 28, y: 37 },	//	Death facing L 4
				{ x: 29, y: 37 },	//	Death facing L 5
				{ x: 30, y: 37 },	//	Death facing L 6
			],
			animations: [
				[ 800, [500, 800], [ 0, 1] ],											//	Resting, facing R
				[ 800, [500, 800], [ 14,15] ],											//	Resting, facing L
				[ 600, [150, 300, 450, 600], [ 2, 3, 4, 5 ] ],							//	Moving, facing R
				[ 600, [150, 300, 450, 600], [ 16,17,18,19] ],							//	Moving, facing L
				[ 1800, [300, 600, 900, 1200, 1500, 1800], [8, 9, 10,11,12,13 ] ],									//	Death, facing R
				[ 1800, [300, 600, 900, 1200, 1500, 1800], [8, 9, 10,11,12,13 ] ],									//	Death, facing L
				[ 800, [300, 800], [6,7]],			//	Attacking R
				[ 800, [300, 800], [20,21]]			//	Attacking L
			]
		},
		movement: {
			bounceOff: true,
			bounceRandom: true
		},
		box: {
			width: 13, 
			height: 15
		},
		ai: {
			type: EnumAi.ROCKO,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				playRockoNoise();
				this.ai.nextAction = 2;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			playRockoNoise(true);
			this.kill();
		},
		addWeapon: function() {
			return EnumCreatureWeapon.ROCKO_CLUB;
		}	
	},
	//	Pebbl
	{
		name: 'Pebbl',
		lode: EnumLode.CRYSTAL,
		currentSprite: { x: 17, y: 38},
		vars: {
			speed: 0.6,
			maxHP: 3,
			currentHP: 3,
			restingWeaponAnimation: false,
			score: 70
		},
		sprite: {
			spriteSheet: monsterSprites,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 17, y: 38 },	//	Resting facing R 1
				{ x: 18, y: 38 },	//	Resting facing R 2
				{ x: 19, y: 38 },	//	Moving facing R 1
				{ x: 20, y: 38 },	//	Moving facing R 2
				{ x: 21, y: 38 },	//	Moving facing R 3
				{ x: 22, y: 38 },	//	Moving facing R 4
				{ x: 23, y: 38 },	//	Attacking facing R 1
				{ x: 24, y: 38 },	//	Attacking facing R 2
				{ x: 25, y: 38 },	//	Attacking facing R 3
				{ x: 26, y: 38 },	//	Attacking facing R 4
				{ x: 27, y: 38 },	//	Attacking facing R 5
				{ x: 28, y: 38 },	//	Death facing R 1
				{ x: 29, y: 38 },	//	Death facing R 2
				{ x: 30, y: 38 },	//	Death facing R 3
				{ x: 31, y: 38 },	//	Death facing R 4

				{ x: 17, y: 39 },	//	Resting facing L 1
				{ x: 18, y: 39 },	//	Resting facing L 2
				{ x: 19, y: 39 },	//	Moving facing L 1
				{ x: 20, y: 39 },	//	Moving facing L 2
				{ x: 21, y: 39 },	//	Moving facing L 3
				{ x: 22, y: 39 },	//	Moving facing L 4
				{ x: 23, y: 39 },	//	Attacking facing L 1
				{ x: 24, y: 39 },	//	Attacking facing L 2
				{ x: 25, y: 39 },	//	Attacking facing L 3
				{ x: 26, y: 39 },	//	Attacking facing L 4
				{ x: 27, y: 39 },	//	Attacking facing L 5
				{ x: 28, y: 39 },	//	Death facing L 1
				{ x: 29, y: 39 },	//	Death facing L 2
				{ x: 30, y: 39 },	//	Death facing L 3
				{ x: 31, y: 39 },	//	Death facing L 4
			],
			animations: [
				[ 500, [300, 500], [ 0, 1] ],									//	Resting, facing R
				[ 500, [300, 500], [ 15,16] ],									//	Resting, facing L
				[ 750, [150, 300, 450, 600, 750], [ 2, 3, 4, 5, 0 ] ],			//	Moving, facing R
				[ 750, [150, 300, 450, 600, 750], [ 17,18,19,20,15] ],			//	Moving, facing L
				[ 800, [200, 400, 600, 800], [11,12,13,14 ] ],					//	Death, facing R
				[ 800, [200, 400, 600, 800], [26,27,28,29 ] ],					//	Death, facing L
				[ 500, [100, 200, 300, 400, 500 ], [6,7,8,9,10]],				//	Attacking R
				[ 500, [100, 200, 300, 400, 500], [21,22,23,24,25]]				//	Attacking L
			]
		},
		movement: {
			bounceOff: true
		},
		box: {
			width: 9, 
			height: 9
		},
		ai: {
			type: EnumAi.PEBBL,
		},
		inflictDamage: function(damage) {
			this.vars.currentHP -= damage;
			if(this.vars.currentHP <= 0) {
				this.deathResponse();
			} else {
				playPebblNoise();
				this.ai.nextAction = 1;
				clearAiAction(this);
			}
		},
		deathResponse: function() {
			playPebblNoise(true);
			this.kill();
		},
		touchDamage: function() {
			var touchDamage = {
				baseDamage: 1,
				criticalMax: 2,
				lode: EnumLode.CRYSTAL
			}
			return touchDamage;
		}
	},

];
