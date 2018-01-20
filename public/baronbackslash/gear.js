var playerWeapons = [
	{},
	{
		name: 'Knife',
		lode: EnumLode.IRON,
		currentSprite: { x: 0, y: 4},
		use: function(direction) {
			this.swipe(direction);
			return this.attack;
		},
		reset: function() {
			delete this.vars.rotation;
			this.vars.attacking = false;
		},
		vars: {
			animTime: 150,								//	Length of time the weapon stays animated after attack
			attackRate: 400,
			drawOffset: { x: 0, y: 0 },
			foreground: true
		},
		position: {},
		sprite: {
			spriteSheet: playerSprite,
			displayWhileResting: true,
			size: {
				x: 0.5,
				y: 1
			},
			frames: [
				{ x: 0, y: 4 },							//	Right facing
				{ x: 0.5, y: 4 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * -4/16,
				y: TILE_SIZE * -3/16
			},
			attackDrawOffset: {
				x: TILE_SIZE * 0,
				y: TILE_SIZE * -9/16
			}
		},
		attack: {
			reach: TILE_SIZE * 0.8,						//	Reach of attack from centre of player object position
			criticalMax: 2,
			damagePlayer: false,
			damageCreatures: true,
			type: EnumAttack.SWIPE,
			displayTime: 50,
			swipeThickness: 0.8,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 2,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	},
	{
		name: 'Sword',
		lode: EnumLode.IRON,
		currentSprite: { x: 1, y: 7},
		use: function(direction) {
			this.swipe(direction);
			return this.attack;
		},
		reset: function() {
			delete this.vars.rotation;
			this.vars.attacking = false;
		},
		vars: {
			animTime: 150,								//	Length of time the weapon stays animated after attack
			attackRate: 500,
			drawOffset: { x: 0, y: 0 },
			foreground: true
		},
		position: {},
		sprite: {
			spriteSheet: playerSprite,
			displayWhileResting: true,
			size: {
				x: 0.5,
				y: 1
			},
			frames: [
				{ x: 1, y: 7 },							//	Right facing
				{ x: 1.5, y: 7 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * -4/16,
				y: TILE_SIZE * -2/16
			},
			attackDrawOffset: {
				x: TILE_SIZE * 0,
				y: TILE_SIZE * -9/16
			}
		},
		attack: {
			reach: TILE_SIZE * 1,						//	Reach of attack from centre of player object position
			criticalMax: 3,
			damagePlayer: false,
			damageCreatures: true,
			type: EnumAttack.SWIPE,
			displayTime: 70,
			swipeThickness: 0.8,						//	0 -> 1 : 0: thick, 1: thin (nb values must be >0 and <1)
			lifespan: 1,
			arc: Math.PI / 2,							//	90 degree swipe
			maxHits: 1									//	Number of contact points per swipe that can successfully resolve as hits
		}
	}
];

var helmetTemplates = [
	{},
	{
		name: 'Acid Helmet',
		lode: EnumLode.ACID,
		currentSprite: { x: 6, y: 6},
		vars: {
			drawOffset: { x: 0, y: 0 },
			foreground: true
		},
		position: {},
		sprite: {
			spriteSheet: playerSprite,
			displayWhileResting: true,
			size: {
				x: 1,
				y: 0.5
			},
			frames: [
				{ x: 6, y: 6 },							//	Right facing
				{ x: 6, y: 6.5 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * 0/16,
				y: TILE_SIZE * -6/16
			}
		}
	},
	{
		name: 'Crystal Helmet',
		lode: EnumLode.CRYSTAL,
		currentSprite: { x: 7, y: 6},
		vars: {
			drawOffset: { x: 0, y: 0 },
			foreground: true
		},
		position: {},
		sprite: {
			spriteSheet: playerSprite,
			displayWhileResting: true,
			size: {
				x: 1,
				y: 0.5
			},
			frames: [
				{ x: 7, y: 6 },							//	Right facing
				{ x: 7, y: 6.5 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * 0/16,
				y: TILE_SIZE * -7/16
			}
		}
	},
	{
		name: 'Shadow Helmet',
		lode: EnumLode.SHADOW,
		currentSprite: { x: 8, y: 6},
		vars: {
			drawOffset: { x: 0, y: 0 },
			foreground: true
		},
		position: {},
		sprite: {
			spriteSheet: playerSprite,
			displayWhileResting: true,
			size: {
				x: 1,
				y: 0.5
			},
			frames: [
				{ x: 8, y: 6 },							//	Right facing
				{ x: 8, y: 6.5 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * 0/16,
				y: TILE_SIZE * -4/16
			}
		}
	},
	{
		name: 'Fire Helmet',
		lode: EnumLode.FIRE,
		currentSprite: { x: 9, y: 6},
		vars: {
			drawOffset: { x: 0, y: 0 },
			foreground: true
		},
		position: {},
		sprite: {
			spriteSheet: playerSprite,
			displayWhileResting: true,
			size: {
				x: 1,
				y: 0.5
			},
			frames: [
				{ x: 9, y: 6 },							//	Right facing
				{ x: 9, y: 6.5 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * 0/16,
				y: TILE_SIZE * -8/16
			}
		}
	},
	{
		name: 'Water Helmet',
		lode: EnumLode.WATER,
		currentSprite: { x: 10, y: 6},
		vars: {
			drawOffset: { x: 0, y: 0 },
			foreground: true
		},
		position: {},
		sprite: {
			spriteSheet: playerSprite,
			displayWhileResting: true,
			size: {
				x: 1,
				y: 0.5
			},
			frames: [
				{ x: 10, y: 6 },							//	Right facing
				{ x: 10, y: 6.5 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * 0/16,
				y: TILE_SIZE * -8/16
			}
		}
	},
	{
		name: 'Lightning Helmet',
		lode: EnumLode.LIGHTNING,
		currentSprite: { x: 11, y: 6},
		vars: {
			drawOffset: { x: 0, y: 0 },
			foreground: true
		},
		position: {},
		sprite: {
			spriteSheet: playerSprite,
			displayWhileResting: true,
			size: {
				x: 1,
				y: 0.5
			},
			frames: [
				{ x: 11, y: 6 },							//	Right facing
				{ x: 11, y: 6.5 }						//	Left facing
			],
			restingDrawOffset: {
				x: TILE_SIZE * 0/16,
				y: TILE_SIZE * -8/16
			}
		}
	}
];