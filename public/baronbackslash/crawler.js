var level;											//	Current level object, loaded from levels.js

var BBMaster = {
	interactDistance: 15,							//	Distance at which player can interact with interactables
	defaultDropFrequency: 3,						//	Average number of default death drops per pickup drop
	defaultMushroomFactor: 90000,					//	Multiplier for default mushroom effect duration
	defaultMushroomMin: 30000,						//	Base minimum default mushroom effect duration
	dropFrequency: [
		[EnumItem.HEALTH_HEART, 5],
		[EnumItem.GOLD_HEART, 1],
		[EnumItem.PURPLE_MUSHROOM, 3],
		[EnumItem.GREEN_MUSHROOM, 1],
		[EnumItem.LOOT_NECKLACE, 1],
		[EnumItem.LOOT_BLUE_JEWEL, 2],
		[EnumItem.LOOT_GREEN_JEWEL, 1]
	],
	debugs: false,
	flags: {
		metBaron: false,
		defeatedBaron: false,
		baronOrbs: 5,
		regenerateBaronDeemons: true,
		lastLevelUrks: 0,
		lastLevelSkeltons: 0,
		lastLevelKobs: 0,
		lastLevelOgrs: 0,
		sessionEnded: false
	}
}

var session = {
	loaded: false,
	// seed: Math.floor(Math.random() * 1000000),		//	Holds level seed
	// seed: 617547,
	focused: true,									//	Track whether browser tab is focused by user
	levelNumber: 1,									//	Initial level
	loadingLevel: false,
	score: 0,
	vars: {
		musicVol: 0.6,
		soundVol: 1,
		musicIsMuted: false
	},
	playing: false
}

var game = {
	scoreStartTime: 0,
	scoreOffset: 0,
	redrawBackground: false,				//	Set to true only when background redraw is required - on viewport move or animated obstacle
	viewport_offset_x: 0,					//	Holds current horizontal viewport offset
	viewport_offset_y: 0,					//	Holds current vertical viewport offset
	creatures: [],							//	Holds creatures currently present in game
	attacks: [],							//	Holds attacks currently present in game
	projectiles: [],						//	Holds projectiles currently present in game
	colliders: [],							//	Holds *all* collision boxes currently present in game - player, creatures, obstacles etc
	nearbyColliders: [],					//	Holds any colliders near to the player for collision detection every tick
	items: [],								//	Holds any contact-collected pickups and items
	debugs: [],								//	Holds any objects to be passed to debug canvas
	drawables: [],							//	Holds creatures, obstacles or players to be drawn on canvas
	drawOnTop: []							//	Holds drawables to be drawn on top of canvas
}


setViewportOffset = function() {
	game.redrawBackground = false;
	if(game.viewport_offset_x < Math.floor(player.position.x - CANVAS_WIDTH * 0.65)) {
		game.viewport_offset_x = Math.floor(player.position.x - CANVAS_WIDTH * 0.65);
		game.redrawBackground = true;
	} else if(game.viewport_offset_x > Math.floor(player.position.x - CANVAS_WIDTH * 0.35)) {
		game.viewport_offset_x = Math.floor(player.position.x - CANVAS_WIDTH * 0.35);
		game.redrawBackground = true;
	}
	if(game.viewport_offset_x < 0) {
		game.viewport_offset_x = 0;
	} else if(game.viewport_offset_x > (level.terrainArray[0].length * TILE_SIZE) - CANVAS_WIDTH) {
		game.viewport_offset_x = (level.terrainArray[0].length * TILE_SIZE) - CANVAS_WIDTH;
	}

	if(game.viewport_offset_y < Math.floor(player.position.y - CANVAS_HEIGHT * 0.65)) {
		game.viewport_offset_y = Math.floor(player.position.y - CANVAS_HEIGHT * 0.65);
		game.redrawBackground = true;
	} else if(game.viewport_offset_y > Math.floor(player.position.y - CANVAS_HEIGHT * 0.35)) {
		game.viewport_offset_y = Math.floor(player.position.y - CANVAS_HEIGHT * 0.35);
		game.redrawBackground = true;
	}
	if(game.viewport_offset_y < 0) {
		game.viewport_offset_y = 0;
	} else if(game.viewport_offset_y > (level.terrainArray.length * TILE_SIZE) - CANVAS_HEIGHT) {
		game.viewport_offset_y = (level.terrainArray.length * TILE_SIZE) - CANVAS_HEIGHT;
	}
}

//	***NEED TO IMPROVE ON IF LARGER SPRITES ARE EVER USED***
inViewport = function(x, y) {
	if(	x > game.viewport_offset_x - TILE_SIZE * 4 && x < game.viewport_offset_x + CANVAS_WIDTH + TILE_SIZE * 4 && 
		y > game.viewport_offset_y - TILE_SIZE * 4 && y < game.viewport_offset_y + CANVAS_HEIGHT + TILE_SIZE * 4) {
		return true;
	} else {
		return false;
	}
}

fadeOutCanvases = function(callback) {
	if(callback && typeof callback === 'function') {
		$.when($('canvas').fadeOut('slow')).then(function() {
			callback()
		});
	} else {
		$('canvas').fadeOut('slow');
	}
}

fadeInCanvases = function(callback) {
	if(callback && typeof callback === 'function') {
		$.when($('canvas').fadeIn('slow')).then(callback());
	} else {
		$('canvas').fadeIn('slow');
	}
}

//	Player controls
//	Keyboard input helper object to manage held down keys
var Key = {
	_pressed: {},
	MOVE_LEFT: 'KeyA',
	MOVE_RIGHT: 'KeyD',
	MOVE_UP: 'KeyW',
	MOVE_DOWN: 'KeyS',
	ATTACK_LEFT: 'ArrowLeft',
	ATTACK_RIGHT: 'ArrowRight',
	ATTACK_UP: 'ArrowUp',
	ATTACK_DOWN: 'ArrowDown',
	isDown: function(keyCode) {
		return this._pressed[keyCode];
	},
	noneDown: function() {
		return $.isEmptyObject(this._pressed); 
	},
	onKeydown: function(event) {
		this._pressed[event.code] = true;
	},
	onKeyup: function(event) {
		delete this._pressed[event.code];
	},
	clearPressed: function() {
		this._pressed = {};
	} 
}

//	Input control event listeners
window.addEventListener('keyup', function(event) {
	Key.onKeyup(event);
}, false);
window.addEventListener('keydown', function(event) {
	if(MainLoop.isRunning()) {
		if(event.code === 'Space') {
			event.preventDefault();
			interact();
		} else {
			if(
				event.code === 'KeyA' || event.code === 'KeyD' || event.code === 'KeyW' || event.code === 'KeyS' || 
				event.code === 'ArrowLeft' || event.code === 'ArrowRight' || event.code === 'ArrowUp' || event.code === 'ArrowDown'
			) {
				event.preventDefault();
			}
			Key.onKeydown(event);
		}
	}
}, false);


//	Level setup
function addBackground() {
	var background = $('<div id="background">');
	background.css('background', level.tiles.solidColor);
	background.css('width', CANVAS_WIDTH * SCALE_FACTOR);
	background.css('height', CANVAS_HEIGHT * SCALE_FACTOR);
	background.appendTo('body');
}

function setUpLevel() {
	level.obstacles.forEach(function(obstacle) {
		if(!obstacle.drawY) {
			obstacle.drawY = obstacle.box.bottomRight.y;
		}
		if(obstacle.box) {
			game.colliders.push(obstacle);								//	If obstacle has a collider, push to the collider array
		}
	});
	for(var i = 0; i < level.terrainArray.length; i++) {
		for(var j = 0; j < level.terrainArray[0].length; j++) {
			if(level.itemArray[i][j] !== undefined) {
				var item = new Item(itemTemplates[level.itemArray[i][j]], j, i);
				item.position.x = j * TILE_SIZE + TILE_SIZE / 2;
				item.position.y = i * TILE_SIZE + TILE_SIZE / 2;
			}
		}
	}
}

function drawOverlays() {											
	for(var i = 0; i < level.terrainArray.length; i++) {			//	Draw inert overlay tile decorators
		for(var j = 0; j < level.terrainArray[i].length; j++) {
			if(inViewport(TILE_SIZE * j + (TILE_SIZE / 2), TILE_SIZE * i + (TILE_SIZE / 2))) {
				if(level.overlayArray[i][j] !== undefined && level.overlayArray[i][j] !== 0) {
					var overlay = level.overlayArray[i][j];
					bgCtx.drawImage(level.img, 						//	Image to load
						overlay.x * TILE_SIZE, 						//	x-coord to start clipping
						overlay.y * TILE_SIZE, 						//	y-coord to start clipping
						TILE_SIZE, 									//	width of clipped image
						TILE_SIZE, 									//	height of clipped image
						TILE_SIZE * j - game.viewport_offset_x, 			//	x-coord of canvas placement
						TILE_SIZE * i - game.viewport_offset_y, 			//	y-coord of canvas placement
						TILE_SIZE, 									//	width of image on canvas
						TILE_SIZE									//	height of image on canvas
					);
				}
			}
		}
	}
}

//	Set up player
function setUpPlayer() {
	player = {};
	var playerType = 0;																						//	Set playerType template
	player = new Creature(playerTemplates[playerType], level.playerStart.x, level.playerStart.y);			//	Construct player from playerType
	player.weapon = new Weapon(playerWeapons[EnumPlayerWeapon.KNIFE], player);								//	Assign starting weapon
	player.weapon.type = EnumPlayerWeapon.KNIFE;
	player.weapon.setUpLode();
	player.vars.lastAttackTime = 0;																			//	Initialize to zero
	player.vars.attackRate = playerTemplates[playerType].vars.attackRate;									//	Time between attacks
	// player.movement.bounceOff = true;
	player.box.type = EnumBoxtype.PLAYER;
	player.weapon.reset();
	player.updateGear();
	player.items = [];
	player.helmet = undefined;
	player.effects = [];
	$('.healthSpan').text(player.vars.currentHP + ' / ' + player.vars.maxHP);
	player.addItem = function(item) {
		player.items.push(item);
		// console.log(player.items);
		if(item.name === "Exit Key") {
			$('#exitkeyimg').fadeIn('slow');
		}
	}
	// player.lode = EnumLode.WATER;
	// new Item(itemTemplates[EnumItem.CRYSTAL_SWORD], player.grid.x-1,player.grid.y);
	// new Item(itemTemplates[EnumItem.ACID_HELMET], player.grid.x+1,player.grid.y+1);
	// new Item(itemTemplates[EnumItem.CRYSTAL_HELMET], player.grid.x+1,player.grid.y+2);
	// new Item(itemTemplates[EnumItem.SHADOW_HELMET], player.grid.x+1,player.grid.y+3);
	// new Item(itemTemplates[EnumItem.FIRE_HELMET], player.grid.x+2,player.grid.y+1);
	// new Item(itemTemplates[EnumItem.WATER_HELMET], player.grid.x+2,player.grid.y+2);
	// new Item(itemTemplates[EnumItem.LIGHTNING_HELMET], player.grid.x+2,player.grid.y+3);
}

function setUpCreatures() {
	// for(var i = 0; i < level.creatureArray.length; i++) {
	// 	for(var j = 0; j < level.creatureArray[i].length; j++) {
	// 		level.creatureArray[i][j] = undefined;
	// 	}
	// };
	// level.creatureArray[player.grid.y+2][player.grid.x] = EnumCreature.GREEN_SLUDGIE;
	// level.creatureArray[player.grid.y+2][player.grid.x+2] = EnumCreature.YELLOW_SLUDGIE;
	// level.creatureArray[player.grid.y][player.grid.x+2] = EnumCreature.BADBUG;
	// level.creatureArray[player.grid.y+2][player.grid.x+1] = EnumCreature.BADBUG;
	// level.creatureArray[player.grid.y][player.grid.x+1] = EnumCreature.BADBUG;
	// level.creatureArray[player.grid.y][player.grid.x+2] = EnumCreature.BADBUG;
	// level.creatureArray[player.grid.y+1][player.grid.x+1] = EnumCreature.BADBUG;
	// level.creatureArray[player.grid.y+1][player.grid.x+2] = EnumCreature.BADBUG;

	for(var i = 0; i < level.creatureArray.length; i++) {
		for(var j = 0; j < level.creatureArray[i].length; j++) {
			if(level.creatureArray[i][j]) {
				var creature = new Creature(creatureTemplates[level.creatureArray[i][j]]);
				creature.position.x = j * TILE_SIZE + TILE_SIZE / 2;
				creature.position.y = i * TILE_SIZE + TILE_SIZE / 2;
				creature.grid.x = j;
				creature.grid.y = i;
				creature.updateBox();
				creature.type = level.creatureArray[i][j];
				if(level.bossRoom && creature.type === level.boss && i >= level.bossRoom.origin.y && i <= level.bossRoom.origin.y + level.bossRoom.height &&
				j >= level.bossRoom.origin.x && j <= level.bossRoom.origin.x + level.bossRoom.width) {
					creature.deathDrop = level.bossDrop;
				}
				game.creatures.push(creature);
			}
		}
	}
	// console.log(game.creatures);
}

function drawOnCanvas(entity, ctx) {
	if(inViewport(entity.position.x, entity.position.y)) {
		if(entity.vars.hasOwnProperty('rotation')) {
			ctx.save();
			ctx.translate(entity.position.x - game.viewport_offset_x, entity.position.y - game.viewport_offset_y);
			ctx.rotate(entity.vars.rotation);
			var drawPosition = {};
			drawPosition.x = Math.floor(entity.vars.drawOffset.x - TILE_SIZE * entity.sprite.size.x / 2); 
			drawPosition.y = Math.floor(entity.vars.drawOffset.y - TILE_SIZE * entity.sprite.size.y / 2);
			ctx.drawImage(entity.sprite.spriteSheet,
				entity.currentSprite.x * TILE_SIZE, 											//	x-coord to start clipping
				entity.currentSprite.y * TILE_SIZE, 											//	y-coord to start clipping
				entity.sprite.size.x * TILE_SIZE, 												//	width of clipped image
				entity.sprite.size.y * TILE_SIZE, 												//	height of clipped image
				drawPosition.x, 																//	x-coord of canvas placement
				drawPosition.y, 																//	y-coord of canvas placement
				entity.sprite.size.x * TILE_SIZE, 												//	width of image on canvas
				entity.sprite.size.y * TILE_SIZE												//	height of image on canvas
			);
			ctx.restore();
		} else {
			try {
				ctx.drawImage(entity.sprite.spriteSheet,
					entity.currentSprite.x * TILE_SIZE, 												//	x-coord to start clipping
					entity.currentSprite.y * TILE_SIZE, 												//	y-coord to start clipping
					entity.sprite.size.x * TILE_SIZE, 													//	width of clipped image
					entity.sprite.size.y * TILE_SIZE, 													//	height of clipped image
					Math.floor(entity.position.x - TILE_SIZE * entity.sprite.size.x / 2 - game.viewport_offset_x) + entity.vars.drawOffset.x, 	//	x-coord of canvas placement
					Math.floor(entity.position.y - TILE_SIZE * entity.sprite.size.y / 2 - game.viewport_offset_y) + entity.vars.drawOffset.y, 	//	y-coord of canvas placement
					entity.sprite.size.x * TILE_SIZE, 			//	width of image on canvas
					entity.sprite.size.y * TILE_SIZE			//	height of image on canvas
				);
			}
			catch(err) {
				// console.log(err);
				// console.log(entity);
				debugger;
			}
		}
	}
}

function Entity(entityTemplate, x, y) {
	this.name = entityTemplate.name;
	this.grid = {
		x: x,
		y: y
	}
	this.position = {
		x: x * TILE_SIZE + TILE_SIZE / 2,
		y: y * TILE_SIZE + TILE_SIZE / 2
	}
	this.sprite = entityTemplate.sprite;						//	Reference template sprite object (don't copy)
	this.vars = {};
	Object.assign(this.vars, entityTemplate.vars);				//	Copy vars object
	this.vars.drawOffset = { x: 0, y: 0 };
	this.box = {};
	this.box.topLeft = {}; this.box.bottomRight = {};
	Object.assign(this.box, entityTemplate.box);				//	Copy box object
	if(!this.box.base_offset) {
		this.box.base_offset = 0;
	}
	this.updateBox();											//	Update box co-ordinates
	this.vars.animStart = performance.now();
}
Entity.prototype.animate = function() {
	this.vars.pointInAnimLoop = Math.floor((performance.now() - this.vars.animStart) % this.sprite.animations[this.vars.animation][0]);			//	Find current point in anim loop in ms, from 0 to duaration of anim
	//	Need to generalize this
	if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][0]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][0]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][1]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][1]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][2]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][2]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][3]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][3]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][4]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][4]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][5]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][5]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][6]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][6]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][7]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][7]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][8]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][8]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][9]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][9]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][10]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][10]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][11]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][11]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][12]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][12]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][13]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][13]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][14]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][14]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][15]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][15]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][16]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][16]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][17]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][17]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][18]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][18]];
	} else if(this.vars.pointInAnimLoop <= this.sprite.animations[this.vars.animation][1][19]) {
		this.currentSprite = this.sprite.frames[this.sprite.animations[this.vars.animation][2][19]];
	}

}
Entity.prototype.updateBox = function() {
	this.box.topLeft.x = this.position.x - this.box.width / 2 + 1;
	this.box.topLeft.y = this.position.y + (this.sprite.size.y * TILE_SIZE / 2) - this.box.height + 1;
	this.box.bottomRight.x = this.position.x + this.box.width / 2 - 1;
	this.box.bottomRight.y = this.position.y + (this.sprite.size.y * TILE_SIZE / 2) - 1;
	this.box.bottomRight.y += this.box.base_offset;
	// debugs.push(this.box.topLeft, this.box.bottomRight);
}
Entity.prototype.getGridOffsetFromPlayer = function() {
	var offset = {
		x: this.grid.x - player.grid.x,
		y: this.grid.y - player.grid.y
	}
	if(offset.x < 0) { offset.x *= -1 };
	if(offset.y < 0) { offset.y *= -1 };
	return offset;
}

//	Assign Entity prototype
Item.prototype = Object.create(Entity.prototype);
Item.prototype.constructor = Item;

function Item(itemTemplate) {
	Entity.apply(this, arguments);
	this.dropTime = performance.now();
	this.pickup = itemTemplate.pickup;
	this.vars.background = true;
	this.vars.animStart = performance.now();
	this.vars.animation = 0;
	this.vars.drawOffset = {
		x: 0,
		y: 4
	}
	this.drawY = this.position.y + this.sprite.size.y * TILE_SIZE / 2;
	this.currentSprite = itemTemplate.currentSprite;
	if(itemTemplate.interact) {
		this.interact = itemTemplate.interact;
	}
	this.movement = {};
	this.movement.deceleration = 0.01;
	this.movement.bounceOff = true;
	game.items.push(this);
}

Helmet.prototype = Object.create(Entity.prototype);
Helmet.prototype.constructor = Helmet;

function Helmet(helmetTemplate) {
	Entity.apply(this, arguments);
	this.currentSprite = helmetTemplate.currentSprite;
	this.lode = helmetTemplate.lode;
}

//	Assign Entity prototype
Weapon.prototype = Object.create(Entity.prototype);
Weapon.prototype.constructor = Weapon;

function Weapon(weaponTemplate, holder) {
	Entity.apply(this, arguments);
	this.currentSprite = weaponTemplate.currentSprite;
	this.use = weaponTemplate.use;
	this.reset = weaponTemplate.reset;
	this.attack = weaponTemplate.attack;
	this.projectile = weaponTemplate.projectile;
	this.holder = holder;
	this.lode = weaponTemplate.lode;
	this.vars.attacking = false;
}
Weapon.prototype.swipe = function(direction) {
	this.vars.lastAttackTime = performance.now();
	this.vars.endAttackAnimationTime = performance.now() + this.vars.animTime;
	this.vars.lastAttackDirection = direction;
	var rand = Math.floor(Math.random() * 2);
	if(rand < 1) {
		this.vars.rotation = direction + 3 * this.attack.arc / 2;
	} else {
		this.vars.rotation = direction + 1 * this.attack.arc / 2;
	}
}
Weapon.prototype.chop = function(direction) {
	this.vars.lastAttackTime = performance.now();
	this.vars.endAttackAnimationTime = performance.now() + this.vars.animTime;
	this.vars.lastAttackDirection = direction;
	if(this.holder.vars.facingRight) {
		this.vars.rotation = direction + Math.PI/2 + this.attack.arc / 2;
	} else {
		this.vars.rotation = direction + Math.PI/2 - this.attack.arc / 2;
	}
}
Weapon.prototype.shoot = function(direction, projectile, pointInDirection, pointRightAngle) {
	this.vars.lastAttackTime = performance.now();
	this.vars.endAttackAnimationTime = performance.now() + this.vars.animTime;
	this.vars.lastAttackDirection = direction;
	if(pointInDirection) {
		if(this.holder.vars.facingRight) {
			this.currentSprite = this.sprite.frames[0];
			this.vars.rotation = direction;
		} else {
			this.currentSprite = this.sprite.frames[1];
			this.vars.rotation = direction + Math.PI;
		}
	} else if(pointRightAngle) {
		if(this.holder.vars.facingRight) {
			this.currentSprite = this.sprite.frames[0];
			this.vars.rotation = Math.PI / 2;
		} else {
			this.currentSprite = this.sprite.frames[1];
			this.vars.rotation = -Math.PI / 2;
		}
	}
	new Projectile(creatureProjectiles[projectile], this.holder, direction);
}
Weapon.prototype.setUpLode = function(lode) {
	if(lode) {
		this.lode = lode;
	}
	switch(this.lode) {
		case EnumLode.ACID: {
			this.attack.color1 = 'rgba(150,255,150,0)';
			this.attack.color2 = 'rgb(61,66,36)';
			this.attack.lode = EnumLode.ACID;
			break;
		}
		case EnumLode.CRYSTAL: {
			this.attack.color1 = 'rgba(255,255,255,0)';
			this.attack.color2 = 'rgb(200,200,230)';
			this.attack.lode = EnumLode.CRYSTAL;
			break;
		}
		case EnumLode.SHADOW: {
			this.attack.color1 = 'rgba(70,75,85,0)';
			this.attack.color2 = 'rgb(30,30,35)';
			this.attack.lode = EnumLode.SHADOW;
			break;
		}
		case EnumLode.FIRE: {
			this.attack.color1 = 'rgba(90,15,30,0)';
			this.attack.color2 = 'rgb(160,50,0)';
			this.attack.lode = EnumLode.FIRE;
			break;
		}
		case EnumLode.WATER: {
			this.attack.color1 = 'rgba(115,210,235,0)';
			this.attack.color2 = 'rgb(80,165,220)';
			this.attack.lode = EnumLode.WATER;
			break;
		}
		case EnumLode.LIGHTNING: {
			this.attack.color1 = 'rgba(180,135,165,0)';
			this.attack.color2 = 'rgb(120,75,110)';
			this.attack.lode = EnumLode.LIGHTNING;
			break;
		}

		case EnumLode.BONE: {
			this.attack.color1 = 'rgba(255,255,255,0)';
			this.attack.color2 = 'rgb(100,105,120)';
			this.attack.lode = EnumLode.NONE;
			break;
		}
		case EnumLode.CLAW: {
			this.attack.color1 = 'rgba(255,255,255,0)';
			this.attack.color2 = 'rgb(40,120,80)';
			this.attack.lode = EnumLode.NONE;
			break;
		}
		case EnumLode.BITE: {
			this.attack.color1 = 'rgba(255,255,255,0)';
			this.attack.color2 = 'rgb(170,95,50)';
			this.attack.lode = EnumLode.NONE;
			break;
		}
		case EnumLode.IRON: {
			this.attack.color1 = 'rgba(255,255,255,0)';
			this.attack.color2 = 'rgb(90,120,130)';
			this.attack.lode = EnumLode.NONE;
			break;
		}
		default : {
			this.attack.color1 = 'rgba(255,255,255,0)';
			this.attack.color2 = 'rgb(58,58,58)';
			this.attack.lode = EnumLode.NONE;
			break;
		}
	}
	if(this.holder === player) {
		this.setUpPlayerWeaponLode();
	}
}
Weapon.prototype.setUpPlayerWeaponLode = function() {
	switch(this.type) {
		case EnumPlayerWeapon.KNIFE: {
			switch(this.lode) {
				case EnumLode.IRON: {
					this.sprite.frames = [{x:0,y:4}, {x:0.5,y:4}];
					break;
				}
				case EnumLode.ACID: {
					this.sprite.frames = [{x:0,y:7}, {x:0.5,y:7}];
					break;
				}
				case EnumLode.CRYSTAL: {
					this.sprite.frames = [{x:1,y:7}, {x:1.5,y:7}];
					break;
				}
				case EnumLode.SHADOW: {
					this.sprite.frames = [{x:2,y:7}, {x:2.5,y:7}];
					break;
				}
				case EnumLode.FIRE: {
					this.sprite.frames = [{x:3,y:7}, {x:3.5,y:7}];
					break;
				}
				case EnumLode.WATER: {
					this.sprite.frames = [{x:4,y:7}, {x:4.5,y:7}];
					break;
				}
				case EnumLode.LIGHTNING: {
					this.sprite.frames = [{x:5,y:7}, {x:5.5,y:7}];
					break;
				}
			}
			break;
		}
		case EnumPlayerWeapon.SWORD: {
			switch(this.lode) {
				case EnumLode.IRON: {
					this.sprite.frames = [{x:1,y:4}, {x:1.5,y:4}];
					break;
				}
				case EnumLode.ACID: {
					this.sprite.frames = [{x:6,y:7}, {x:6.5,y:7}];
					break;
				}
				case EnumLode.CRYSTAL: {
					this.sprite.frames = [{x:7,y:7}, {x:7.5,y:7}];
					break;
				}
				case EnumLode.SHADOW: {
					this.sprite.frames = [{x:8,y:7}, {x:8.5,y:7}];
					break;
				}
				case EnumLode.FIRE: {
					this.sprite.frames = [{x:9,y:7}, {x:9.5,y:7}];
					break;
				}
				case EnumLode.WATER: {
					this.sprite.frames = [{x:10,y:7}, {x:10.5,y:7}];
					break;
				}
				case EnumLode.LIGHTNING: {
					this.sprite.frames = [{x:11,y:7}, {x:11.5,y:7}];
					break;
				}
			}
			break;
		}
	}
}

Projectile.prototype = Object.create(Entity.prototype);
Projectile.prototype.constructor = Projectile;

function Projectile(projectileTemplate, shooter, direction) {
	Entity.apply(this, arguments);
	this.vars = {};
	Object.assign(this.vars, projectileTemplate.vars);
	this.vars.shooter = shooter; 
	this.vars.drawOffset = { x: projectileTemplate.vars.drawOffset.x, y: projectileTemplate.vars.drawOffset.y };
	this.vars.rotation = direction + projectileTemplate.vars.rotation;
	this.vars.startY = shooter.grid.y;
	this.vars.animStart = performance.now();
	if(this.vars.expiry) {
		this.expireTime = performance.now() + this.vars.expiry;
	} else {
		this.expireTime = performance.now() + 2000;
	}
	if(projectileTemplate.vars.spinFactor) {
		spinOffProjectile(this, this.vars.spinFactor);
	}
	this.touchDamage = projectileTemplate.touchDamage;
	this.currentSprite = projectileTemplate.currentSprite;
	this.sprite = {};
	Object.assign(this.sprite, projectileTemplate.sprite);
	this.position = { x: shooter.weapon.position.x, y: shooter.weapon.position.y };
	this.movement = {};
	Object.assign(this.movement, projectileTemplate.movement);
	this.movement.direction = direction;
	this.grid.x = shooter.grid.x;
	this.grid.y = shooter.grid.y;
	game.projectiles.push(this);
}

function updateProjectiles() {
	game.projectiles.forEach(function(projectile) {
		//	If deleteTime has passed, splice the projectile from the projectile array
		if(performance.now() > projectile.deleteTime || performance.now() > projectile.expireTime) {
			game.projectiles.splice(game.projectiles.indexOf(projectile), 1);
		} else {
			//	If the projectile is animated, animate it
			if(projectile.vars.animated) {
				projectile.animate();
			}
			//	If the projectile has a spinOff value, apply it to its rotation and movement direction
			if(projectile.vars.spinOff) {
				projectile.vars.rotation += projectile.vars.spinOff;
				projectile.movement.direction += projectile.vars.spinOff;				
			}
			//	Move the projectile
			Creature.prototype.move.call(projectile, projectile.movement.direction, projectile.movement.speed);
			//	If the projectile collides with something and deleteTime is not set, set it to 'displayTime' ms in the future
			if(projectile.collidedWith && !projectile.deleteTime) {
				projectile.deleteTime = performance.now() + projectile.vars.displayTime;
			}
			//	If the projectile has not missed, is sticky and is not yet stuck to something and has collided with something other than terrain, add it to the object's 'stuckProjectiles' array
			if(!projectile.missed && projectile.vars.sticky && !projectile.stuckTo && projectile.collidedWith && projectile.collidedWith !== 1) {
				if(projectile.collidedWith.stuckProjectiles === undefined) {
					projectile.collidedWith.stuckProjectiles = [];
				}
				if(projectile.collidedWith === player && projectile.vars.damagePlayer) {
					resolveHit(projectile.touchDamage(), player);
				} else if(projectile.collidedWith.box.type === EnumBoxtype.CREATURE && projectile.vars.damageCreatures) {
					resolveHit(projectile.touchDamage(), projectile.collidedWith);
				}
				projectile.stuckTo = projectile.collidedWith;
				projectile.stuckOffset = {};
				if(projectile.position.x > projectile.stuckTo.position.x) {
					projectile.stuckOffset.x = projectile.position.x - projectile.stuckTo.position.x - 2;
				} else {
					projectile.stuckOffset.x = projectile.position.x - projectile.stuckTo.position.x + 2;
				}
				if(projectile.position.y > projectile.stuckTo.position.y) {
					projectile.stuckOffset.y = projectile.position.y - projectile.stuckTo.position.y - 2;
				} else {
					projectile.stuckOffset.y = projectile.position.y - projectile.stuckTo.position.y + 2;
				}
				projectile.collidedWith.stuckProjectiles.push(projectile);
			//	Else if projectile is sticky and hits terrain, set it to have missed
			} else if(projectile.vars.sticky && !projectile.stuckTo && projectile.collidedWith && projectile.collidedWith === 1) {
				projectile.missed = true;
			//	Else if projectile explodes on impact and collides with anything
			} else if(projectile.vars.explodeOnImpact && !projectile.exploded && projectile.collidedWith) {
				if(projectile.collidedWith !== 1) {
					if(projectile.collidedWith === player && projectile.vars.damagePlayer) {
						resolveHit(projectile.touchDamage(), player);
					} else if(projectile.collidedWith.box.type === EnumBoxtype.CREATURE && projectile.vars.damageCreatures) {
						resolveHit(projectile.touchDamage(), projectile.collidedWith);
					}
				}
				projectile.exploded = true;
				projectile.movement.speed = 0;
				if(projectile.vars.animated) {
					projectile.vars.animation = 1;
					projectile.vars.animStart = performance.now();
				}
				if(projectile.vars.spinOff) {
					projectile.vars.spinOff = 0;
				}
			}
			if(projectile.stuckTo) {
				projectile.movement.speed = 0;
				projectile.position.x = projectile.stuckTo.position.x + projectile.stuckOffset.x;
				projectile.position.y = projectile.stuckTo.position.y + projectile.stuckOffset.y;
			} else if(projectile.missed) {
				projectile.movement.speed = 0;
			}
		}
	});

}

//	Assign Entity prototype
Creature.prototype = Object.create(Entity.prototype);
Creature.prototype.constructor = Creature;

function Creature(creatureTemplate) {
	Entity.apply(this, arguments);
	if(!this.vars.attackRate) { this.vars.attackRate = 1 };
	this.vars.animation = 0;									//	Track animation number currently playing
	this.vars.animEnd = 0;
	this.vars.lastAttackTime = 0;								//	Track time of last attack
	this.vars.facingRight = true;
	this.vars.lastFacingChangeTime = 0;							//	Track time that facing direction last changed
	if(!this.vars.minFacingChangeTime) {
		this.vars.minFacingChangeTime = 200;					//	Minimum time to leave before allowing a change in facing direction (prevent 1 frame spins when trapped against walls)
	}
	this.vars.suspended = true;
	this.lode = creatureTemplate.lode;
	this.box.type = EnumBoxtype.CREATURE;
	this.ai = {};
	Object.assign(this.ai, creatureTemplate.ai);				//	Copy AI object for this creature template
	this.ai.startTime = 0;
	this.ai.endTime = 500;
	this.ai.action = 0;
	this.ai.nextAction = 0;		
	this.movement = {};
	this.movement.bounceOff = true;
	if(creatureTemplate.movement) {
		Object.assign(this.movement, creatureTemplate.movement);
	}
	this.currentSprite = creatureTemplate.currentSprite;
	if(creatureTemplate.movement) {
		Object.assign(this.movement, creatureTemplate.movement);
	}
	// this.movement.bounceRandom = true;
	if(creatureTemplate.addWeapon) {
		var weapon = new Weapon(creatureWeapons[creatureTemplate.addWeapon()], this);
		if(this.name === "Mumi" || this.name === "Grey Goblin") {
			weapon.lode = EnumLode.CRYSTAL;
		}
		weapon.setUpLode();
		this.weapon = weapon;
	}
	if(creatureTemplate.setAiType) {
		this.setAiType = creatureTemplate.setAiType;
		this.setAiType();
	}
	if(creatureTemplate.touchDamage) {
		this.touchDamage = creatureTemplate.touchDamage;
	}
	if(creatureTemplate.deathDrop) {
		this.deathDrop = creatureTemplate.deathDrop;
	} else {
		this.deathDrop = function() {
			//	First use the overall default death drop frequency to determine whether a drop is created.
			var rand = Math.floor(Math.random() * session.vars.defaultDropFrequency);
			if(rand < 1) {
				//	If it is, add up the individual drop frequencies of the various drop types in the master array
				var dropFrequencySum = 0;
				var dropTypes = cloneArray(session.vars.dropFrequency);
				dropTypes.forEach(function(droptype) {
					dropFrequencySum += droptype[1];
				});
				//	Then pick a random number between 0 and the frequency sum, and loop the drop types until that number is reached
				var rand2 = Math.floor(Math.random() * dropFrequencySum) + 1;
				while(rand2 > dropTypes[0][1]) {
					rand2 -= dropTypes[0][1];
					dropTypes.splice(0, 1);
				}
				//	When the type is identified, create a new item of that type and boost it away from the player
				var item = new Item(itemTemplates[dropTypes[0][0]], this.grid.x, this.grid.y);
				item.position.x = this.position.x;
				item.position.y = this.position.y + 2;
				item.movement.speed = 1;
				item.movement.direction = getPlayerDirection(this) + Math.PI;
			}
		}
	}
	this.inflictDamage = creatureTemplate.inflictDamage;		//	Set damage response function from template
	this.deathResponse = creatureTemplate.deathResponse;		//	Set death response function from template
	game.colliders.push(this);										//	Add creature to colliders array
}
Creature.prototype.move = function(direction, speed) {
	var tryX = this.position.x + (speed * Math.cos(direction));
	var tryY = this.position.y + (speed * Math.sin(direction));
	var newCoords = checkCollision(this, tryX, tryY);
	this.position.x = newCoords.x;
	this.position.y = newCoords.y;
	this.grid = {
		x: Math.floor(this.position.x / TILE_SIZE),
		y: Math.floor(this.position.y / TILE_SIZE),
	}
	this.collidedWith = newCoords.collidedWith;
	if(this.collidedWith && !sludgieNoises.playing() && this.ai && (this.ai.type === EnumAi.GREEN_SLUDGIE || this.ai.type === EnumAi.YELLOW_SLUDGIE)) {
		playSludgieNoise();
	}
	if(this.updateBox) {
		this.updateBox();
		this.drawY = this.box.bottomRight.y;
	}
}
Creature.prototype.attack = function(direction) {
	if(this.weapon && performance.now() > this.vars.lastAttackTime + this.weapon.vars.attackRate * this.vars.attackRate) {
		this.setFacing(direction);
		this.vars.lastAttackTime = performance.now();
		this.weapon.vars.attacking = true;
		//	Use weapon, and if it returns an attack object, create an attack with it
		if(this.weapon.use(direction)) {
			if(this === player && player.vars.attackLodeLottery) {
				player.vars.revertLode = player.weapon.lode;
				var lodes = [
					EnumLode.ACID,
					EnumLode.CRYSTAL,
					EnumLode.SHADOW,
					EnumLode.FIRE,
					EnumLode.WATER,
					EnumLode.LIGHTNING
				];
				var rand = Math.floor(Math.random() * lodes.length);
				player.weapon.lode = lodes[rand];
				player.weapon.setUpLode();
			}
			var attack = this.weapon.use(direction);
			attack.attacker = this;
			new Attack(attack, direction);
			if(this === player && player.vars.attackLodeLottery) {
				player.weapon.lode = player.vars.revertLode;
				player.weapon.setUpLode();
			}
		}
		if(this === player) {
			playSwish();
		}
	}
}
Creature.prototype.aim = function(direction) {
	if(this.weapon) {
		this.setFacing(direction);
		if(this.vars.facingRight) {
			this.weapon.currentSprite = this.sprite.frames[0];
			this.weapon.vars.rotation = direction;
		} else {
			this.weapon.currentSprite = this.sprite.frames[1];
			this.weapon.vars.rotation = direction + Math.PI;
		}
	}
}
Creature.prototype.setFacing = function(direction) {
	if(performance.now() > this.vars.lastFacingChangeTime + this.vars.minFacingChangeTime) {
		this.vars.lastFacingChangeTime = performance.now();
		if(Math.cos(direction) >= 0) {
			this.vars.facingRight = true;
			if(this.vars.animation === EnumState.MOVING_L) {
				this.vars.animation = EnumState.MOVING_R;
			} else if(this.vars.animation === EnumState.RESTING_L) {
				this.vars.animation = EnumState.RESTING_R;
			}
		} else {
			this.vars.facingRight = false;
			if(this.vars.animation === EnumState.MOVING_R) {
				this.vars.animation = EnumState.MOVING_L;
			} else if(this.vars.animation === EnumState.RESTING_L) {
				this.vars.animation = EnumState.RESTING_R;
			}
		}
	}
}
Creature.prototype.kill = function() {
	if(level.levelNumber === 99) {
		checkIfDropsExitKey();
	}
	if(!this.vars.dead) {
		this.vars.dead = true;
		addScore(this.vars.score);
		if(this.weapon) {
			delete this.weapon;															//	Delete creature's weapon property
		}
		game.colliders.splice(game.colliders.indexOf(this), 1);							//	Remove from the colliders array.
		this.ai.nextAction = -1;														//	Prevent further AI actions
		this.movement.speed = 0;														//	Zero speed
		this.movement.moving = false;													//	Stop moving
		this.position.x = Math.floor(this.position.x);									//	Round co-ords down to prevent blurred drawing on canvas
		this.position.y = Math.floor(this.position.y);
		this.vars.animStart = performance.now();										//	Set animation start time to now...
		if(this.vars.facingRight) {														//	...and set death animation
			this.vars.animation = 4;
		} else {
			this.vars.animation = 5;
		}
		if(this.deathDrop) {
			this.deathDrop();
		}
		this.vars.deathTime = performance.now() + this.sprite.animations[this.vars.animation][0] - 100;		//	Set deathTime to be current time plus duration of death animation minus 100ms
	}
	//	On final level, check whether to give exit key death drop to a surviving creature
}

function checkIfDropsExitKey() {
	session.flags.lastLevelUrks = 0;
	session.flags.lastLevelSkeltons = 0;
	session.flags.lastLevelKobs = 0;
	session.flags.lastLevelOgrs = 0;
	game.creatures.forEach(function(creature) {
		if(creature.grid.y >= level.urk_y -2) {
			session.flags.lastLevelUrks++;
		}
		if(creature.grid.y >= level.skelton_y -2) {
			session.flags.lastLevelSkeltons++;
		}
		if(creature.grid.y >= level.kob_y -2) {
			session.flags.lastLevelKobs++;
		}
		if(creature.grid.y >= level.ogr_y -2) {
			session.flags.lastLevelOgrs++;
		}
	});
	if(session.flags.lastLevelUrks < 2 && !session.flags.lastLevelUrkKey) {
		game.creatures.forEach(function(creature) {
			if(creature.grid.y >= level.urk_y -2) {
				creature.deathDrop = keyDrop;
			}
			session.flags.lastLevelUrkKey = true;
		});
	} else if(session.flags.lastLevelSkeltons < 2 && !session.flags.lastLevelSkeltonKey) {
		game.creatures.forEach(function(creature) {
			if(creature.grid.y >= level.skelton_y -2) {
				creature.deathDrop = keyDrop;
			}
			session.flags.lastLevelSkeltonKey = true;
		});
	} else if(session.flags.lastLevelKobs < 2 && !session.flags.lastLevelKobKey) {
		game.creatures.forEach(function(creature) {
			if(creature.grid.y >= level.kob_y -2) {
				creature.deathDrop = keyDrop;
			}
			session.flags.lastLevelKobKey = true;
		});
	} else if(session.flags.lastLevelOgrs < 2 && !session.flags.lastLevelOgrKey) {
		game.creatures.forEach(function(creature) {
			if(creature.grid.y >= level.ogr_y -2) {
				creature.deathDrop = keyDrop;
			}
			session.flags.lastLevelOgrKey = true;
		});
	}
}

function keyDrop() {
	var item = new Item(itemTemplates[EnumItem.EXIT_KEY], this.grid.x, this.grid.y);
	item.position.x = this.position.x;
	item.position.y = this.position.y + 2;
	item.movement.speed = 1;
	item.movement.direction = getPlayerDirection(this) + Math.PI;
}


Creature.prototype.hasClearPathToPlayer = function() {
	var x1, x2, y1, y2;
	if(this.grid.x > player.grid.x) {
		x1 = player.grid.x;
		x2 = this.grid.x;
	} else {
		x1 = this.grid.x;
		x2 = player.grid.x;
	}
	if(this.grid.y > player.grid.y) {
		y1 = player.grid.y;
		y2 = this.grid.y;
	} else {
		y1 = this.grid.y;
		y2 = player.grid.y;
	}
	var diffX = x2 - x1;
	var diffY = y2 - y1;
	// if(Math.abs(diffX) <= 1 && Math.abs(diffY) <= 1) {				//	If grid squares are adjacent, return clear
	// 	return true;
	if(
		(level.terrainArray[player.grid.y+1][player.grid.x] === 2 && this.grid.y > player.grid.y) ||
		(level.terrainArray[player.grid.y-1][player.grid.x] === 2 && this.grid.y < player.grid.y)
	) {
		// console.log("Blocked by a door!");
		return false;
	} else if(diffX === 0) {
		for(var i = 0; i < diffY; i++) {
			if(level.terrainArray[y1+i][x1] !== 0) {
				// console.log("Blocked vertically!");
				return false;
			}
		}
		// console.log("Clear path vertically");
		return true;
	} else if(diffY === 0) {
		for(var i = 0; i < diffX; i++) {
			if(level.terrainArray[y1][x1+i] !== 0) {
				// console.log("Blocked horizontally!");
				return false;
			}
		}
		// console.log("Clear path horizontally");
		return true;
	} else {
		var diff = 0;
		if(diffX === diffY) {
			for(var i = 0; i < diffX; i++) {
				if(level.terrainArray[y1+i][x1+i] !== 0) {
					// console.log("Blocked perfect diag!");
					return false;
				}
			}
			// console.log("Clear path perfect diag");
			return true;
		} else if(diffX >= diffY) {
			var stepY = diffY / diffX;
			var incY = 0;
			for(var i = 0; i < diffX; i++) {
				if(diff > 0.5) {
					diff--;
					incY++;
				}
				if(level.terrainArray[y1+incY][x1+i] !== 0) {
					// console.log("Blocked across diag!");
					return false;
				}
				diff += stepY;
			}
			// console.log("Clear path across diag");
			return true;
		} else {
			var stepX = diffX / diffY;
			var incX = 0;
			for(var i = 0; i < diffY; i++) {
				if(diff > 0.5) {
					diff--;
					incX++;
						}
				if(level.terrainArray[y1+i][x1+incX] !== 0) {
					// console.log("Blocked down diag!");
					return false;
				}
				diff += stepX;
			}
			// console.log("Clear path down diag");
			return true;
		}
	}
}
Creature.prototype.addHealth = function(health) {
	// console.log("Adding health!");
	this.vars.currentHP += health;
	if(this.vars.currentHP > this.vars.maxHP) {
		this.vars.currentHP = this.vars.maxHP;
	}
	if(this === player) {
		$('.healthSpan').text(player.vars.currentHP + ' / ' + player.vars.maxHP);
	}
}
Creature.prototype.checkIfCollides = function() {
	var collides = false;
	for(var i = 0; i < game.colliders.length; i++) {
		if(game.colliders[i] !== this && !game.colliders[i].vars.moveThroughColliders) {
			var top = this.box.topLeft.y;
			var btm = this.box.bottomRight.y;
			var left = this.box.topLeft.x;
			var right = this.box.bottomRight.x;

			var objTop = game.colliders[i].box.topLeft.y - 1;
			var objBtm = game.colliders[i].box.bottomRight.y + 1;
			var objL = game.colliders[i].box.topLeft.x - 1;
			var objR = game.colliders[i].box.bottomRight.x + 1;

			if(
			//	Check if obj overlaps any corner of the collider...
			(top <= objTop && btm >= objTop && left <= objL && right >= objL) ||
			(top <= objTop && btm >= objTop && left <= objR && right >= objR) ||
			(top <= objBtm && btm >= objBtm && left <= objL && right >= objL) ||
			(top <= objBtm && btm >= objBtm && left <= objR && right >= objR) ||
			//	...or if obj overlaps the top or bottom side of the collider...
			(top <= objTop && btm >= objTop && left >= objL && right <= objR) ||
			(top <= objBtm && btm >= objBtm && left >= objL && right <= objR) ||
			//	...or if obj overlaps the left or right side of the collider...
			(top >= objTop && btm <= objBtm && left <= objL && right >= objL) ||
			(top >= objTop && btm <= objBtm && left <= objR && right >= objR) ||
			//	...or falls fully inside the collider
			(top >= objTop && btm <= objBtm && left >= objL && right <= objR)
			) {
				collides = game.colliders[i];
			}
		}
		if(collides) {
			break;
		}
	}
	return collides;
}

interact = function() {
	if(MainLoop.isRunning()) {
		if(game.displayedMessage) {
			game.messageHideTime = performance.now();
		}
		level.obstacles.forEach(function(obstacle) {
			if(inViewport(obstacle.grid.x * TILE_SIZE, obstacle.grid.y * TILE_SIZE) && obstacle.interact) {
				if(getDistanceToPlayer(obstacle.position.x, obstacle.position.y) < BBMaster.interactDistance) {
					obstacle.interact();
				}
			}
		});
		game.items.forEach(function(item) {
			if(inViewport(item.position.x, item.position.y) && item.interact && performance.now() > item.dropTime + 500) {
				if(getDistanceToPlayer(item.position.x, item.position.y) < BBMaster.interactDistance) {
					item.interact();
				}
			}
		});
	}
}

function getDistanceToPlayer(x, y) {
	return Math.sqrt(((x - player.position.x) * (x - player.position.x)) + ((y - player.position.y) * (y - player.position.y)));
}

function leaveCorpse(creature) {
	var corpse = {
		position: {},
		vars: {
			drawOffset: {}
		},
		sprite: {}
	}
	Object.assign(corpse.sprite, creature.sprite);
	var lastFrame = creature.sprite.animations[creature.vars.animation][2].length - 1;				//	...get last frame of current animation (should be death animation!)...
	corpse.currentSprite = creature.sprite.frames[creature.sprite.animations[creature.vars.animation][2][lastFrame]];	//	...and set it as the creature's current sprite...
	corpse.position.x = Math.floor(creature.position.x);
	corpse.position.y = Math.floor(creature.position.y);
	corpse.vars.drawOffset.x = Math.floor(creature.vars.drawOffset.x);
	corpse.vars.drawOffset.y = Math.floor(creature.vars.drawOffset.y);
	drawOnCanvas(corpse, bgCtx);
	level.decor.push(corpse);
}

function Attack(attack, direction) {
	Object.assign(this, attack);
	this.direction = direction;
	this.created = performance.now();
	switch(this.type) {
		case(EnumAttack.SWIPE): {
			this.contactPoints = [
				{ x: this.attacker.position.x + Math.cos(this.direction - this.arc * 0.50) * this.reach, y: this.attacker.position.y + Math.sin(this.direction - this.arc * 0.50) * this.reach },
				{ x: this.attacker.position.x + Math.cos(this.direction - this.arc * 0.28) * this.reach, y: this.attacker.position.y + Math.sin(this.direction - this.arc * 0.28) * this.reach },
				{ x: this.attacker.position.x + Math.cos(this.direction - this.arc * 0.15) * this.reach, y: this.attacker.position.y + Math.sin(this.direction - this.arc * 0.15) * this.reach },
				{ x: this.attacker.position.x + Math.cos(this.direction) * this.reach, y: this.attacker.position.y + Math.sin(this.direction) * this.reach },
				{ x: this.attacker.position.x + Math.cos(this.direction + this.arc * 0.15) * this.reach, y: this.attacker.position.y + Math.sin(this.direction + this.arc * 0.15) * this.reach },
				{ x: this.attacker.position.x + Math.cos(this.direction + this.arc * 0.28) * this.reach, y: this.attacker.position.y + Math.sin(this.direction + this.arc * 0.28) * this.reach },
				{ x: this.attacker.position.x + Math.cos(this.direction + this.arc * 0.50) * this.reach, y: this.attacker.position.y + Math.sin(this.direction + this.arc * 0.50) * this.reach },

				{ x: this.attacker.position.x + Math.cos(this.direction - this.arc * 0.50) * this.reach / 2, y: this.attacker.position.y + Math.sin(this.direction - this.arc * 0.50) * this.reach / 2},
				{ x: this.attacker.position.x + Math.cos(this.direction - this.arc * 0.28) * this.reach / 2, y: this.attacker.position.y + Math.sin(this.direction - this.arc * 0.28) * this.reach / 2},
				{ x: this.attacker.position.x + Math.cos(this.direction) * this.reach / 2, y: this.attacker.position.y + Math.sin(this.direction) * this.reach / 2},
				{ x: this.attacker.position.x + Math.cos(this.direction + this.arc * 0.28) * this.reach / 2, y: this.attacker.position.y + Math.sin(this.direction + this.arc * 0.28) * this.reach / 2},
				{ x: this.attacker.position.x + Math.cos(this.direction + this.arc * 0.50) * this.reach / 2, y: this.attacker.position.y + Math.sin(this.direction + this.arc * 0.50) * this.reach / 2}
			];
			break;
		}
		case(EnumAttack.STAB): {
			this.contactPoints = [
				{ x: attacker.position.x + Math.cos(this.direction) * this.reach, y: attacker.position.y + Math.sin(this.direction) * this.reach }
			];
			break;
		}
		default:
			break;
	} 
	game.attacks.push(this);
	this.contactPoints.forEach(function(contactPoint) {
		game.debugs.push(contactPoint);
	});
}

function drawAttack(attack) {
	switch(attack.type) {
		case(EnumAttack.SWIPE): {
			var origin_x = attack.attacker.position.x - game.viewport_offset_x;
			var origin_y = attack.attacker.position.y - game.viewport_offset_y;
			if(attack.attackPositionOffset) {
				origin_x += attack.attackPositionOffset.x;
				origin_y += attack.attackPositionOffset.y;
			}
			attackCtx.moveTo(origin.x,origin.y);
			attackCtx.beginPath();
			attackCtx.arc(origin_x, origin_y, attack.reach, attack.direction - attack.arc / 2, attack.direction + attack.arc / 2);
			attackCtx.lineTo(origin_x, origin_y);
			attackCtx.closePath();
			var grd = attackCtx.createRadialGradient(origin_x, origin_y, attack.reach * attack.swipeThickness, origin_x, origin_y, attack.reach);
			grd.addColorStop(0, attack.color1);
			grd.addColorStop(1, attack.color2);
			attackCtx.fillStyle = grd;
			attackCtx.fill();
			break;
		}
		case(EnumAttack.STAB): {
			attackCtx.beginPath();
			attackCtx.moveTo(attack.attacker.x, attack.attacker.y + attack.stabOffset_y);
			attackCtx.lineTo(attack.contactPoints[0].x, attack.contactPoints[0].y);
			attackCtx.strokeStyle = attack.stabColor1;
			attackCtx.lineWidth = attack.stabWidth;
			attackCtx.stroke();
			break;
		}
	}
}

function drawWeapons() {
	game.creatures.forEach(function(creature) {
		if(creature.weapon && !creature.vars.hideWeapon && creature.weapon.vars.foreground) {
			if(creature.weapon.sprite.displayWhileResting || performance.now() < creature.vars.lastAttackTime + creature.weapon.vars.animTime) {
				drawOnCanvas(creature.weapon, attackCtx);
			}
		} else if(creature.weapon && !creature.vars.hideWeapon && !creature.weapon.vars.foreground) {
			if(creature.weapon.sprite.displayWhileResting || creature.vars.lastAttackTime !== 0 && performance.now() < creature.vars.lastAttackTime + creature.weapon.vars.animTime) {
				drawOnCanvas(creature.weapon, attackCtx);
				// drawOnCanvas(creature, attackCtx);
			}
		}

	});
}

function drawAttacks() {
	game.attacks.forEach(function(attack) {
		drawAttack(attack);
	});
}

//	Add any drawable non-BG objects to drawables array and sort by y position for drawing on canvas
function updateDrawables() {
	game.drawables.length = 0;
	game.drawOnTop.length = 0;
	game.drawables.push(player);
	game.creatures.forEach(function(creature) {
		creature.drawY = creature.box.bottomRight.y;
		if(inViewport(creature.position.x, creature.position.y)) {
			if(creature.vars.foreground) {
				game.drawOnTop.push(creature);
			} else {
				game.drawables.push(creature);
			}
		}
	});
	game.projectiles.forEach(function(projectile) {
		if(inViewport(projectile.position.x, projectile.position.y)) {
			if(projectile.vars.foreground) {
				game.drawOnTop.push(projectile);
			} else {
				game.drawables.push(projectile);
			}
		}
	});
	level.obstacles.forEach(function(obstacle) {
		if(inViewport(obstacle.position.x, obstacle.position.y)) {
			game.drawables.push(obstacle);
		}
	});
	game.items.forEach(function(item) {
		if(inViewport(item.position.x, item.position.y)) {
			game.drawables.push(item);
		}
	});
	game.drawables = sort_by_key_value(game.drawables, 'drawY');
}

function sort_by_key_value(arr, key) {
  var to_s = Object.prototype.toString;
  var valid_arr = to_s.call(arr) === '[object Array]';
  var valid_key = typeof key === 'string';

  if (!valid_arr || !valid_key) {
    return;
  }

  arr = arr.slice();

  return arr.sort(function(a, b) {
    var a_key = String(a[key]);
    var b_key = String(b[key]);
    var n = a_key - b_key;
    return !isNaN(n) ? n : a_key.localeCompare(b_key);
  });
}

//	Update player movement
function updatePlayer() {
	//	Assign current player animation
	if(player.vars.dead) {
		if(game.playerDeathTime && performance.now() > game.playerDeathTime + 3000) {
			$('.finalScoreSpan').text(session.score);
			MainLoop.stop();
			if(!session.flags.sessionEnded) {
				deathScreen();
			}
			session.flags.sessionEnded = true;
		} else {
			if(player.vars.facingRight) {
				player.vars.animation = EnumState.DYING_R;
			} else {
				player.vars.animation = EnumState.DYING_L;
			}
		}
	} else {
		var moving = player.vars.moving;

		if(!player.vars.immobilized) {
			if(Key.isDown(Key.MOVE_UP)) { player.move(Math.PI * 1.5, player.vars.speed); player.vars.moving = true; };
			if(Key.isDown(Key.MOVE_DOWN)) { player.move(Math.PI * 0.5, player.vars.speed); player.vars.moving = true; }
			if(Key.isDown(Key.MOVE_LEFT)) { player.move(Math.PI * 1, player.vars.speed); player.vars.moving = true; if(player.vars.facingRight) { player.vars.facingRight = false }}
			if(Key.isDown(Key.MOVE_RIGHT)) { player.move(0, player.vars.speed); player.vars.moving = true; if(!player.vars.facingRight) { player.vars.facingRight = true }}

			if(Key.isDown(Key.ATTACK_UP)) { player.attack(Math.PI * 1.5); }
			if(Key.isDown(Key.ATTACK_DOWN)) { player.attack(Math.PI / 2); }
			if(Key.isDown(Key.ATTACK_LEFT)) { player.attack(Math.PI); }
			if(Key.isDown(Key.ATTACK_RIGHT)) { player.attack(0); }
		} else {
			player.vars.moving = false;
		}

		if(Key.isDown(Key.INTERACT)) { interact(); }

		if(!Key.isDown(Key.MOVE_UP) && !Key.isDown(Key.MOVE_DOWN) && !Key.isDown(Key.MOVE_LEFT) && !Key.isDown(Key.MOVE_RIGHT)) { player.vars.moving = false; }
		if(moving != player.vars.moving) { 
			player.vars.animStart = performance.now();
		}
		if(performance.now() < player.vars.invulnerableTo) {						//	+ length of time to flash after taking damage
			if(!player.vars.moving && player.vars.facingRight) { player.vars.animation = EnumState.RESTING_HITFLASH_R; }
			else if(!player.vars.moving && !player.vars.facingRight) { player.vars.animation = EnumState.RESTING_HITFLASH_L; }
			else if(player.vars.moving && player.vars.facingRight) { player.vars.animation = EnumState.MOVING_HITFLASH_R; }
			else if(player.vars.moving && !player.vars.facingRight) { player.vars.animation = EnumState.MOVING_HITFLASH_L; }
		} else {
			if(!player.vars.moving && player.vars.facingRight) { player.vars.animation = EnumState.RESTING_R; }
			else if(!player.vars.moving && !player.vars.facingRight) { player.vars.animation = EnumState.RESTING_L; }
			else if(player.vars.moving && player.vars.facingRight) { player.vars.animation = EnumState.MOVING_R; }
			else if(player.vars.moving && !player.vars.facingRight) { player.vars.animation = EnumState.MOVING_L; }
		}

	}

	if(player.effects.length > 0) {
		//	If player is not colored to match last effect in array, color the player accordingly 
		if(player.vars.color !== player.effects[player.effects.length-1].color) {
			colorPlayer(player.effects[player.effects.length-1].color);
		}
		//	Iterate effects and remove if endTime has passed, or apply if not yet applied
		for(var i = player.effects.length-1; i >= 0; i--) {
			if(performance.now() > player.effects[i].endTime) {
				player.effects[i].remove();
				player.effects.splice(i, 1);
			} else if(!player.effects[i].applied) {
				player.effects[i].applied = true;
				player.effects[i].endTime = performance.now() + player.effects[i].duration;
				player.effects[i].apply();
				// console.log(player.effects[i].name);
			}
		}
	} else if(player.vars.color !== EnumColor.NORMAL) {
		//	If effect array is empty, color the player normally
		colorPlayer(EnumColor.NORMAL);
	}
	player.animate();
	player.updateGear();
	if(level.levelNumber === 99 && !session.flags.metBaron && player.grid.y <= 24) {
		session.flags.metBaron = true;
		baronEncounter();
	} else if(level.levelNumber === 99 && !session.flags.metBaron2 && (player.grid.y <= 19 || (player.grid.y <=24 && player.grid.x <= 11) || (player.grid.y <=24 && player.grid.x >= 22))) {
		session.flags.metBaron2 = true;
		baronEncounter2();
	} else if(level.levelNumber === 99 && !victoryLoop.playing() && session.flags.victoryMusicTime && performance.now() > session.flags.victoryMusicTime) {
		playMusic('victory');
	}
}

Creature.prototype.updateGear = function() {
	if(this.weapon) {																									//	If creature has a weapon...
		this.weapon.position.x = this.position.x;																		//	Set weapon position to that of holder..
		this.weapon.position.y = this.position.y;
		if(this.weapon.vars.attacking && performance.now() > this.weapon.vars.endAttackAnimationTime) {					//	If its attack animation time has expired...
			this.weapon.vars.attacking = false;																			//	...reset its 'attacking' flag...
			this.weapon.reset();																						//	...and run its reset function.
		}
		if(this.weapon.vars.attacking) {																				//	If *still* attacking...
			this.weapon.vars.drawOffset.y = this.weapon.sprite.attackDrawOffset.y;										//	Set its y draw offset to the 'attacking' value...
			if(this.weapon.sprite.attackPositionOffset) {
				this.weapon.position.y += this.weapon.sprite.attackPositionOffset.y;
			}
			if(this.vars.facingRight) {
				this.weapon.vars.drawOffset.x = this.weapon.sprite.attackDrawOffset.x;									//	...and the x offset +ve or -ve depending on facing.
				if(this.weapon.sprite.attackPositionOffset) {
					this.weapon.position.x += this.weapon.sprite.attackPositionOffset.x;
				}
			} else {
				this.weapon.vars.drawOffset.x = -this.weapon.sprite.attackDrawOffset.x;
				if(this.weapon.sprite.attackPositionOffset) {
					this.weapon.position.x -= this.weapon.sprite.attackPositionOffset.x;
				}
			}
		} else if(!this.weapon.vars.hidden) {
			this.weapon.vars.drawOffset.y = this.weapon.sprite.restingDrawOffset.y;										//	If *not* attacking...
			if(this.vars.facingRight) {																					//	...if holder is facing right...
				this.weapon.currentSprite = this.weapon.sprite.frames[0];													//	...set the weapon's right-facing sprite...
				this.weapon.vars.drawOffset.x = this.weapon.sprite.restingDrawOffset.x;									//	...and set +ve offset x
			} else {
				this.weapon.currentSprite = this.weapon.sprite.frames[1];
				this.weapon.vars.drawOffset.x = -this.weapon.sprite.restingDrawOffset.x;								//	If facing left, set -ve offset x
			}
			if(this !== player && this.vars.restingWeaponAnimation && this.vars.pointInAnimLoop > this.sprite.animations[0][1][0]) {
				this.weapon.vars.drawOffset.y += 1;
			} else if(this === player) {
				if(this.vars.animation === EnumState.RESTING_L || this.vars.animation === EnumState.RESTING_R) {
					if(this.vars.pointInAnimLoop > this.sprite.animations[0][1][0]) {
						this.weapon.vars.drawOffset.y += 1;
					}
				} else if(this.vars.animation === EnumState.MOVING_L || this.vars.animation === EnumState.MOVING_R) {
					if(this.vars.pointInAnimLoop < this.sprite.animations[2][1][0]) {
						this.weapon.vars.drawOffset.y += 0;
					} else if(this.vars.pointInAnimLoop < this.sprite.animations[2][1][1]) {
						this.weapon.vars.drawOffset.y -= 1;
					} else if(this.vars.pointInAnimLoop < this.sprite.animations[2][1][2]) {
						this.weapon.vars.drawOffset.y += 0;
					} else if(this.vars.pointInAnimLoop < this.sprite.animations[2][1][3]) {
						this.weapon.vars.drawOffset.y += 1;
					}
				}
			}
		}
	}
	if(this.helmet) {
		this.helmet.position.x = this.position.x;
		this.helmet.position.y = this.position.y;
		this.helmet.vars.drawOffset.y = this.helmet.sprite.restingDrawOffset.y;
		if(this.vars.facingRight) {
			this.helmet.currentSprite = this.helmet.sprite.frames[0];
			this.helmet.vars.drawOffset.x = this.helmet.sprite.restingDrawOffset.x;
		} else {
			this.helmet.currentSprite = this.helmet.sprite.frames[1];
			this.helmet.vars.drawOffset.x = -this.helmet.sprite.restingDrawOffset.x;
		}
		if(this !== player && this.vars.pointInAnimLoop > this.sprite.animations[0][1][0]) {
			this.helmet.vars.drawOffset.y += 1;
		} else if(this === player) {
			if(
				this.vars.animation === EnumState.RESTING_L || this.vars.animation === EnumState.RESTING_R || 
				this.vars.animation === EnumState.RESTING_HITFLASH_L || this.vars.animation === EnumState.RESTING_HITFLASH_R
			) {
				if(this.vars.pointInAnimLoop > this.sprite.animations[0][1][0]) {
					this.helmet.vars.drawOffset.y += 1;
				}
			} else if(
				this.vars.animation === EnumState.MOVING_L || this.vars.animation === EnumState.MOVING_R || 
				this.vars.animation === EnumState.MOVING_HITFLASH_L || this.vars.animation === EnumState.MOVING_HITFLASH_R
			) {
				if(this.vars.pointInAnimLoop < this.sprite.animations[2][1][0]) {
					this.helmet.vars.drawOffset.y += 0;
				} else if(this.vars.pointInAnimLoop < this.sprite.animations[2][1][1]) {
					this.helmet.vars.drawOffset.y -= 1;
				} else if(this.vars.pointInAnimLoop < this.sprite.animations[2][1][2]) {
					this.helmet.vars.drawOffset.y += 0;
				} else if(this.vars.pointInAnimLoop < this.sprite.animations[2][1][3]) {
					this.helmet.vars.drawOffset.y += 1;
				}
			} else if(this.vars.animation === EnumState.DYING_R) {
				if(this.vars.pointInAnimLoop < this.sprite.animations[8][1][0]) {
					this.helmet.vars.drawOffset.y += 0;
				} else if(this.vars.pointInAnimLoop < this.sprite.animations[8][1][1]) {
					this.helmet.vars.drawOffset.y += 1;
					this.helmet.vars.drawOffset.x += 1;
				} else if(this.vars.pointInAnimLoop < this.sprite.animations[8][1][2]) {
					this.helmet.vars.drawOffset.y += 2;
					this.helmet.vars.drawOffset.x += 2;
				} else if(this.vars.pointInAnimLoop < this.sprite.animations[8][1][3]) {
					this.helmet.vars.drawOffset.y += 5;
					this.helmet.vars.drawOffset.x += 3;
				}
			} else if(this.vars.animation === EnumState.DYING_L) {
				if(this.vars.pointInAnimLoop < this.sprite.animations[9][1][0]) {
					this.helmet.vars.drawOffset.y += 0;
				} else if(this.vars.pointInAnimLoop < this.sprite.animations[9][1][1]) {
					this.helmet.vars.drawOffset.y += 1;
					this.helmet.vars.drawOffset.x -= 1;
				} else if(this.vars.pointInAnimLoop < this.sprite.animations[9][1][2]) {
					this.helmet.vars.drawOffset.y += 2;
					this.helmet.vars.drawOffset.x -= 2;
				} else if(this.vars.pointInAnimLoop < this.sprite.animations[9][1][3]) {
					this.helmet.vars.drawOffset.y += 5;
					this.helmet.vars.drawOffset.x -= 3;
				}
			}
		}
	}
}

function updateCreatures() {
	game.creatures.forEach(function(creature) {
		if(performance.now() > creature.vars.deathTime) {							//	If creature's deathTime has passed...
			leaveCorpse(creature);
			game.creatures.splice(game.creatures.indexOf(creature), 1);				//	...and remove the creature from creatures array...
		}
		var offset = creature.getGridOffsetFromPlayer();
		if(offset.x > CANVAS_WIDTH / TILE_SIZE - 1 || offset.y > CANVAS_HEIGHT / TILE_SIZE - 1) {
			creature.vars.suspended = true;
			creature.movement.speed = 0;
		} else {
			creature.vars.suspended = false;
		}
		if(performance.now() > creature.ai.endTime) {								//	If creature's ai action has run its duration...
			setAiAction(creature);													//	...assign a new one.
		}
		creature.animate();															//	Animate creature
		creature.updateGear();
		if(creature.movement.speed > 0) {											//	If creature has a current movement speed...
			creature.move(creature.movement.direction, creature.movement.speed);	//	...move it accordingly
		}
	});
}

function addScore(score) {
	session.score += score;
	$('.scoreSpan').text('Score: ' + session.score);
}

function updateScoreDisplay() {
	if(session.flags.defeatedBaron) {
		session.score -= game.scoreOffset;
		game.scoreOffset = 0;
		$('.scoreSpan').text('Score: ' + (session.score));
	} else if(!player.vars.dead && session.score - Math.floor((performance.now() - game.scoreStartTime) / 1000) > 0) {
		game.scoreOffset = Math.floor((performance.now() - game.scoreStartTime) / 1000);
		$('.scoreSpan').text('Score: ' + (session.score - game.scoreOffset));
	} else if(player.vars.dead) {
		session.score -= game.scoreOffset;
		game.scoreOffset = 0;
		$('.scoreSpan').text('Score: ' + (session.score));
	} else {
		game.scoreStartTime = performance.now();
		game.scoreOffset = 0;
		session.score = 0;
		$('.scoreSpan').text('Score: ' + (session.score));
	}
}

function updateAttacks() {
	resolveAttacks();
	game.attacks.forEach(function(attack) {
		if(performance.now() > attack.created + attack.displayTime) {
			game.attacks.splice(game.attacks.indexOf(attack), 1);
		}
	});
}

function resolveAttacks() {
	game.attacks.forEach(function(attack) {																							//	For each attack...
		var hits = 0;																											//	Count successful hits
		attack.contactPoints.forEach(function(contactPoint) {																	//	...iterate contact points...
			if(attack.damagePlayer) {																					//	...and if attacker was not player...
				if(contactPoint.x >= player.box.topLeft.x - 1 && contactPoint.x <= player.box.bottomRight.x + 1 				//	...check if attack falls within player's box...
				&& contactPoint.y >= player.box.topLeft.y - 1 && contactPoint.y <= player.box.bottomRight.y + 1) {
					hits++;
					resolveHit(attack, player);				//	If so, resolve hit
				}
				if(hits >= attack.maxHits) {														//	If maxHits for Attack is reached...
					attack.contactPoints.splice(0, attack.contactPoints.length);					//	...clear all contactPoints
				}
				// if(performance.now() > attack.created + attack.lifespan) {
				// 	attack.contactPoints.splice(attack.contactPoints.indexOf(contactPoint), 1);
				// }
			}
			game.creatures.forEach(function(creature) {
				if(!creature.vars.dead && attack.damageCreatures) {
					//	Check whether contactPoint falls within bounding box of any creature
					if(contactPoint.x >= creature.box.topLeft.x && contactPoint.x <= creature.box.bottomRight.x
					&& contactPoint.y >= creature.box.topLeft.y && contactPoint.y <= creature.box.bottomRight.y) {
						hits++;
						resolveHit(attack, creature);				//	If so, resolve hit
					}
					if(hits >= attack.maxHits) {														//	If maxHits for Attack is reached...
						attack.contactPoints.splice(0, attack.contactPoints.length);					//	...clear all contactPoints
					}
					// if(performance.now() > attack.created + attack.lifespan) {
					// 	attack.contactPoints.splice(attack.contactPoints.indexOf(contactPoint), 1);
					// }
				}
			});
		});
	});
}

function resolveHit(attack, target) {
	resolve = true;
	if(!attack) {
		resolve = false;
	} else if(attack.onlyDamage) {
		if(!(attack.onlyDamage.includes(target.lode))) {
			resolve = false;
		}
	}
	if(resolve) {
		var damage = 1;
		if(attack.baseDamage) {
			damage = attack.baseDamage;
		}
		var criticalMax = 1;
		if(attack.criticalMax) {
			criticalMax = attack.criticalMax;
		}
		var criticalChance = 0;
		//	Switch the *defender's* lode type
		switch (target.lode) {
			case EnumLode.NONE: {
				if(attack.lode === EnumLode.ACID || attack.lode === EnumLode.CRYSTAL || attack.lode === EnumLode.SHADOW ||
					attack.lode === EnumLode.FIRE || attack.lode === EnumLode.WATER || attack.lode === EnumLode.LIGHTNING) {
					criticalChance = 0.2;
				} else {
					criticalChance = 0.1;
				}
				break;
			}
			case EnumLode.ACID: {
				switch(attack.lode) {
					case EnumLode.FIRE: {
						criticalChance = 0.4;
						break;
					}
					case EnumLode.ACID:
					case EnumLode.WATER:
					case EnumLode.LIGHTNING: {
						criticalChance = 0.15;
						break;
					}
					default: {break;}
				}
			}
			case EnumLode.CRYSTAL: {
				switch(attack.lode) {
					case EnumLode.ACID: {
						criticalChance = 0.4;
						break;
					}
					case EnumLode.CRYSTAL:
					case EnumLode.LIGHTNING: {
						criticalChance = 0.15;
						break;
					}
					default: {break;}
				}
			}
			case EnumLode.SHADOW: {
				switch(attack.lode) {
					case EnumLode.CRYSTAL: {
						criticalChance = 0.4;
						break;
					}
					case EnumLode.SHADOW:
					case EnumLode.LIGHTNING: {
						criticalChance = 0.15;
						break;
					}
				}
			}
			case EnumLode.FIRE: {
				switch(attack.lode) {
					case EnumLode.WATER: {
						criticalChance = 0.4;
						break;
					}
					case EnumLode.SHADOW: {
						criticalChance = 0.2;
						break;
					}
					case EnumLode.FIRE: {
						criticalChance = 0.15;
						break;
					}
				}
			}
			case EnumLode.WATER: {
				switch(attack.lode) {
					case EnumLode.LIGHTNING: {
						criticalChance = 0.4;
						break;
					}
					case EnumLode.SHADOW: {
						criticalChance = 0.2;
						break;
					}
					case EnumLode.CRYSTAL:
					case EnumLode.WATER: {
						criticalChance = 0.15;
						break;
					}
				}
			}
			case EnumLode.LIGHTNING: {
				switch(attack.lode) {
					case EnumLode.FIRE: {
						criticalChance = 0.4;
						break;
					}
					case EnumLode.SHADOW: {
						criticalChance = 0.2;
						break;
					}
					case EnumLode.LIGHTNING: {
						criticalChance = 0.15;
						break;
					}
				}
			}
		}
		var critHit = false;
		if(criticalChance > 0) {
			var critRoll = Math.random();
			if(critRoll < criticalChance) {
				damage += Math.floor(Math.random() * criticalMax) + 1;
				critHit = true;
			}
		}
		if(attack.attacker && attack.attacker === "Mini Ghost" && target === player && damage > 0) {
			if(!creatureSounds2.playing()) {
				creatureSounds2.play('ghostDamage');
			}
		} else if(attack.attacker && attack.attacker === "Wrongwraith" && target === player && damage > 0) {
			if(!creatureSounds2.playing()) {
				creatureSounds2.play('ghostDamage');
			}
		} else if(critHit) {
			gameEffects.play('criticalHit');
		}
		target.inflictDamage(damage, attack.lode);
		// console.log(target.name + " has " + target.vars.currentHP + " HP remaining.");
	}
}

function checkCollision(obj, tryX, tryY) {
	var returnCoords = { x: tryX, y: tryY };
	returnCoords = checkTerrainCollision(obj, returnCoords.x, returnCoords.y);
	returnCoords = checkColliderCollision(obj, returnCoords.x, returnCoords.y, returnCoords.collidedWith);
	return returnCoords;
}


function bounceOff(obj, bounceX, bounceY) {
	// console.log(obj.name + " bouncing - bounceX: " + bounceX + ", bounceY: " + bounceY);
	if(obj.movement.bounceRandom) {
		var rand = Math.floor(Math.random() * 4);
		if(rand < 1) {
			obj.movement.direction = 0;
		} else if(rand < 2) {
			obj.movement.direction = Math.PI / 2;
		} else if(rand < 3) {
			obj.movement.direction = Math.PI;
		} else {
			obj.movement.direction = 3 * Math.PI / 2;
		}
	} else if(bounceX && bounceY) {
		obj.movement.direction += Math.PI;
	} else if(bounceX) {
		if(obj.movement.direction < Math.PI) {								//	Else if obj is moving down and left or down and right
			obj.movement.direction = Math.PI - obj.movement.direction;
		} else {															//	Else if obj is moving up and left or up and right
			var angle = obj.movement.direction - (Math.PI);
			obj.movement.direction = (2 * Math.PI) - angle;
		}
	} else if(bounceY) {
		obj.movement.direction = (2 * Math.PI) - obj.movement.direction;
	}

	if(obj.movement.direction > (2 * Math.PI)) {
		obj.movement.direction -= (2 * Math.PI);
	}

	if(obj.setFacing) {
		obj.setFacing(obj.movement.direction);
	}

}

//	Terrain Collision Manager - check for contact with impassable terrain
function checkTerrainCollision(obj, tryX, tryY) {
	var returnCoords = {};

	var tryTerRX = Math.floor(((tryX + (obj.box.width / 2)) / TILE_SIZE));
	var tryTerLX = Math.floor(((tryX - (obj.box.width / 2) - 1) / TILE_SIZE));
	var tryTerY;
	var okY;

	var bounceY = false;
	var bounceX = false;

	if(obj.position.y === tryY) {																						//	If movement has no Y component...
		tryTerY = Math.floor(((obj.position.y - obj.sprite.y_padding) / TILE_SIZE) + (obj.sprite.size.y * 0.5));		//	...set tryTerY to current grid row...
		returnCoords.y = obj.position.y;																				//	...and set return Y coord to current position.
	} else {
		if(tryY >= obj.position.y) {																					//	Else if obj is trying to move down...
			if(obj.box.type === EnumBoxtype.PROJECTILE || obj.box.type === EnumBoxtype.FIREBALL) {						//	...and is a projectile...
				tryTerY = Math.floor(tryY / TILE_SIZE);																	//	...set tryTerY.
				if(level.terrainArray[tryTerY][obj.grid.x] === 1 && level.terrainArray[tryTerY+1][obj.grid.x] === 0) {
					okY = true;
				} else {
					tryTerY = Math.floor(((tryY + TILE_SIZE / 2) / TILE_SIZE) - 8/16);									//	...else set tryTerY to be 1/2 row below...
				}
			} else {
				tryTerY = Math.floor(((tryY + TILE_SIZE* obj.sprite.size.y / 2) / TILE_SIZE));							//	...else set tryTerY...
			}
		} else {																										//	...or if trying to move up...
			tryTerY = Math.floor(((tryY - obj.sprite.y_padding) / TILE_SIZE) + 8/16);									//	...set tryTerY.
		}
		if(okY) {
			returnCoords.y = tryY;
		} else {
			if(level.terrainArray[tryTerY] === undefined ||																	//	Check whether terrain in tryY direction does not exist...
			tryTerY === 0 ||																								//	...or is on top row of terrain grid...
			(level.terrainArray[tryTerY][tryTerRX] === undefined || level.terrainArray[tryTerY][tryTerRX] !== 0) || 		//	...or is impassable on the right...
			(level.terrainArray[tryTerY][tryTerLX] === undefined || level.terrainArray[tryTerY][tryTerLX] !== 0)) {			//	...or is impassable on the left.
				returnCoords.y = obj.position.y;																			//	If so, set y to return unchanged...
				if(level.terrainArray[tryTerY][tryTerLX] !== 0 && Math.cos(obj.movement.direction) > 0) {
					bounceY = true;
				} else if(level.terrainArray[tryTerY][tryTerRX] !== 0 && Math.cos(obj.movement.direction) < 0) {
					bounceY = true;					
				}
				returnCoords.collidedWith = 1;
				tryTerY = Math.floor(((obj.position.y - obj.sprite.y_padding) / TILE_SIZE) + 0.5);							//	...and reset TryTerY to current position
			} else {
				returnCoords.y = tryY;																						//	Otherwise, success - return tryY coord
			}																												//	Else if obj is trying to move up...
		}
	}
	if(level.terrainArray[tryTerY][tryTerRX] === undefined || level.terrainArray[tryTerY][tryTerRX] !== 0 || 			//	If terrain does not exist or is impassable on the right...
	level.terrainArray[tryTerY][tryTerLX] === undefined || level.terrainArray[tryTerY][tryTerLX] !== 0) {				//	...or on the left...
		returnCoords.x = obj.position.x;																				//	...set x to return unchanged
		bounceX = true;
		if(!okY) {
			returnCoords.collidedWith = 1;
		}
	} else {
		returnCoords.x = tryX;																							//	Otherwise, success - return tryX coord
	}
	if(obj !== player && obj.movement.bounceOff && (bounceX || bounceY)) {
		bounceOff(obj, bounceX, bounceY);
	}
	return returnCoords;																								//	Return final coordinates
}

//	Collider Collision Manager - check for contact with active box colliders
function checkColliderCollision(obj, tryX, tryY, collidedWith) {
	var returnCoords = { x: tryX, y: tryY, collidedWith: collidedWith };

	//	Check for impact between obj and any nearbyCollider 
	for(var i = 0; i < game.nearbyColliders.length; i++) {
		var pass = false;
		//	Check whether a collision check is required
		if(obj.vars.moveThroughColliders && obj.vars.touchDamage && game.nearbyColliders[i].box.type === EnumBoxtype.PLAYER) {
			pass = false;
		} else if(
			obj === game.nearbyColliders[i] ||
			obj.vars.moveThroughColliders ||
			game.nearbyColliders[i].vars.moveThroughColliders ||
			game.nearbyColliders[i] === obj.vars.shooter ||
			obj.box.type === EnumBoxtype.PICKUP && game.nearbyColliders[i].box.type === EnumBoxtype.CREATURE ||
			obj.box.type === EnumBoxtype.ITEM && game.nearbyColliders[i].box.type === EnumBoxtype.PLAYER ||
			obj.box.type === EnumBoxtype.ITEM && game.nearbyColliders[i].box.type === EnumBoxtype.CREATURE ||
			obj.box.type === EnumBoxtype.ITEM && game.nearbyColliders[i].box.type === EnumBoxtype.PROJECTILE ||
			obj.box.type === EnumBoxtype.ITEM && game.nearbyColliders[i].box.type === EnumBoxtype.FIREBALL ||
			obj.box.type === EnumBoxtype.PLAYER && game.nearbyColliders[i].box.type === EnumBoxtype.ITEM ||
			obj.box.type === EnumBoxtype.CREATURE && game.nearbyColliders[i].box.type === EnumBoxtype.PICKUP ||
			obj.box.type === EnumBoxtype.CREATURE && game.nearbyColliders[i].box.type === EnumBoxtype.ITEM ||
			obj.box.type === EnumBoxtype.CREATURE && game.nearbyColliders[i].box.type === EnumBoxtype.FIREBALL ||
			obj.box.type === EnumBoxtype.PROJECTILE && game.nearbyColliders[i].box.type === EnumBoxtype.OBSTACLE ||
			obj.box.type === EnumBoxtype.PROJECTILE && game.nearbyColliders[i].box.type === EnumBoxtype.PICKUP ||
			obj.box.type === EnumBoxtype.PROJECTILE && game.nearbyColliders[i].box.type === EnumBoxtype.ITEM ||
			obj.box.type === EnumBoxtype.FIREBALL && game.nearbyColliders[i].box.type === EnumBoxtype.OBSTACLE ||
			obj.box.type === EnumBoxtype.FIREBALL && game.nearbyColliders[i].box.type === EnumBoxtype.PICKUP ||
			obj.box.type === EnumBoxtype.FIREBALL && game.nearbyColliders[i].box.type === EnumBoxtype.ITEM ||
			obj.box.type === EnumBoxtype.FIREBALL && game.nearbyColliders[i].box.type === EnumBoxtype.CREATURE ||
			obj.box.type === EnumBoxtype.PICKUP && game.nearbyColliders[i].box.type === EnumBoxtype.PROJECTILE ||
			obj.box.type === EnumBoxtype.PICKUP && game.nearbyColliders[i].box.type === EnumBoxtype.FIREBALL ||
			game.nearbyColliders[i].box.type === EnumBoxtype.CREATURE && game.nearbyColliders[i].vars.dead
		) {
			pass = true;
		}

		//	If it is, perform collision check
		if(!pass) {
			if(obj.box.type === EnumBoxtype.PROJECTILE || obj.box.type === EnumBoxtype.FIREBALL) {
				var newTop = returnCoords.y - (obj.box.height / 2);
				var newBtm = returnCoords.y + (obj.box.height / 2);
				var newL = returnCoords.x - (obj.box.width / 2 );
				var newR = returnCoords.x + (obj.box.width / 2 );
			} else {
				var newTop = returnCoords.y + (obj.sprite.size.y * TILE_SIZE / 2) - obj.box.height + obj.box.base_offset;
				var newBtm = returnCoords.y + (obj.sprite.size.y * TILE_SIZE / 2) + obj.box.base_offset;
				var newL = returnCoords.x - (obj.box.width / 2 );
				var newR = returnCoords.x + (obj.box.width / 2 );
			}

			var objTop = game.nearbyColliders[i].box.topLeft.y;
			var objBtm = game.nearbyColliders[i].box.bottomRight.y;
			var objL = game.nearbyColliders[i].box.topLeft.x;
			var objR = game.nearbyColliders[i].box.bottomRight.x;

			var overlap = false;
			var bounceX = false;
			var bounceY = false;

			if(
				//	Check if obj overlaps any corner of the collider...
				(newTop <= objTop && newBtm >= objTop && newL <= objL && newR >= objL) ||
				(newTop <= objTop && newBtm >= objTop && newL <= objR && newR >= objR) ||
				(newTop <= objBtm && newBtm >= objBtm && newL <= objL && newR >= objL) ||
				(newTop <= objBtm && newBtm >= objBtm && newL <= objR && newR >= objR)
			) {
				overlap = true;
				bounceX = true;
				bounceY = true;
			} else if(
				//	...or if obj overlaps the top or bottom side of the collider...
				(newTop <= objTop && newBtm >= objTop && newL >= objL && newR <= objR) ||
				(newTop <= objBtm && newBtm >= objBtm && newL >= objL && newR <= objR)
			) {
				overlap = true;
				bounceY = true;
			} else if(
				//	...or if obj overlaps the left or right side of the collider...
				(newTop >= objTop && newBtm <= objBtm && newL <= objL && newR >= objL) ||
				(newTop >= objTop && newBtm <= objBtm && newL <= objR && newR >= objR)
			) {
				overlap = true;
				bounceX = true;
			} else if 				//	...or falls fully inside the collider
				(newTop >= objTop && newBtm <= objBtm && newL >= objL && newR <= objR)
			{
				overlap = true;
				bounceX = true;
				bounceY = true; 
			}

			if(overlap) {
				//	If player comes into contact with a collider dealing touch damage, execute its touchDamage function
				if(obj.vars.touchDamage && game.nearbyColliders[i] === player) {
					var touch = obj.touchDamage();
					resolveHit(touch, player);
				}
				//	If player comes into contact with a pickup, execute its pickup function
				if(obj === player && game.nearbyColliders[i].pickup) {
					game.nearbyColliders[i].pickup();
				} else {
					returnCoords.collidedWith = game.nearbyColliders[i];
					returnCoords.x = obj.position.x;
					returnCoords.y = obj.position.y;
					if(obj !== player && obj.movement.bounceOff && (bounceX || bounceY)) {
						bounceOff(obj, bounceX, bounceY);
					}
				}
			}
		}
	}
	return returnCoords;
}

function drawDrawables() {
	game.drawables.forEach(function(drawable) {
		if(drawable.weapon && !drawable.weapon.vars.hidden && !drawable.weapon.vars.foreground) {
			drawOnCanvas(drawable.weapon, drawableCtx);
		}
		drawOnCanvas(drawable, drawableCtx);
		if(drawable.helmet) {
			drawOnCanvas(drawable.helmet, drawableCtx);
		}
		if(drawable.weapon && !drawable.weapon.vars.hidden && drawable.weapon.vars.foreground) {
			drawOnCanvas(drawable.weapon, drawableCtx);
		}
	});
	game.drawOnTop.forEach(function(drawable) {
		if(drawable.weapon && !drawable.weapon.vars.hidden && !drawable.weapon.vars.foreground) {
			drawOnCanvas(drawable.weapon, drawableCtx);
		}
		drawOnCanvas(drawable, drawableCtx);
		if(drawable.helmet) {
			drawOnCanvas(drawable.helmet, drawableCtx);
		}
		if(drawable.weapon && !drawable.weapon.vars.hidden && drawable.weapon.vars.foreground) {
			drawOnCanvas(drawable.weapon, drawableCtx);
		}
	});
	game.projectiles.forEach(function(projectile) {
		drawOnCanvas(projectile, drawableCtx);
	});
}

function drawDecor() {
	level.decor.forEach(function(decor) {
		drawOnCanvas(decor, bgCtx);
	});
}

function updateObstacles() {
	level.obstacles.forEach(function(obstacle) {
		if(obstacle.animated) {
			if(performance.now() > obstacle.animEnd) {
				obstacle.interactionEnd();
			} else {
				Entity.prototype.animate.call(obstacle);
			}
		}
	});
}

function updateItems() {
	game.items.forEach(function(item) {
		if(item.movement.speed > 0) {
			Creature.prototype.move.call(item, item.movement.direction, item.movement.speed);
			if(item.movement.deceleration) {
				item.movement.speed -= item.movement.deceleration;
			}
		}
		item.animate();
	});
}

function updateColliders() {
	game.nearbyColliders.length = 0;
	game.nearbyColliders.push(player);
	game.creatures.forEach(function(creature) {
		var offset = creature.getGridOffsetFromPlayer();
		if(offset.x >= CANVAS_WIDTH / TILE_SIZE + 1 || offset.y >= CANVAS_HEIGHT / TILE_SIZE + 1) {
			if(!creature.vars.suspended) {
				if(creature.checkIfCollides()) {
					// console.log(creature);
					// console.log("Collides with...");
					// console.log(creature.checkIfCollides());
				}
			}
		} else {
			game.nearbyColliders.push(creature);
		}
	});
	level.obstacles.forEach(function(obstacle) {
		var offset = Creature.prototype.getGridOffsetFromPlayer.call(obstacle);
		if(offset.x <= CANVAS_WIDTH / TILE_SIZE + 3 || offset.y <= CANVAS_HEIGHT / TILE_SIZE + 3) {
			game.nearbyColliders.push(obstacle);
		}
	});
	game.items.forEach(function(item) {
		var offset = Creature.prototype.getGridOffsetFromPlayer.call(item);
		if(offset.x <= CANVAS_WIDTH / TILE_SIZE + 3 || offset.y <= CANVAS_HEIGHT / TILE_SIZE + 3) {
			game.nearbyColliders.push(item);
		}
	});
	// console.log(nearbyColliders);
}

function updateInterface() {
	if(game.displayedMessage && performance.now() > game.messageHideTime) {
		hideMessage();
	}
	if(session.flags.gameCompletedTime && performance.now() > session.flags.gameCompletedTime + 2000) {
		gameCompleteScreen();
		MainLoop.stop();
	}
}

function displayMessage(duration, line1, line2, line3, callback) {
	if(line3) {
		$('#messageSpan').html(line1 + '<br>' + line2 + '<br>' + line3);
	} else if(line2) {
		$('#messageSpan').html(line1 + '<br>' + line2);
	} else if(line1) {
		$('#messageSpan').html(line1);
	}
	$('#messageDiv').fadeIn('fast');
	game.displayedMessage = true;
	game.messageHideTime = performance.now() + duration;
	if(callback && typeof callback === 'function') {
		game.callback = callback;
	}
}

function hideMessage() {
	$('#messageDiv').fadeOut('slow');
	if(game.callback && typeof game.callback === 'function') {
		game.callback();
		game.callback = undefined;
	}
}

function drawDebugCanvas() {
	game.projectiles.forEach(function(projectile) {
		var debug = { x: projectile.position.x, y: projectile.position.y, color: 'orange'};
		game.debugs.push(debug);
	});
	game.colliders.forEach(function(collider) {
		var debug = { x: collider.box.topLeft.x, y: collider.box.topLeft.y, color: 'blue'};
		game.debugs.push(debug);
		var debug2 = { x: collider.box.bottomRight.x, y: collider.box.bottomRight.y, color: 'blue'};
		game.debugs.push(debug2);
	});
	// game.attacks.forEach(function(attack) {
	// 	attack.contactPoints.forEach(function(contactPoint) {
	// 		var debug = { x: contactPoint.x, y: contactPoint.y, color: 'green'};
	// 		game.debugs.push(debug);
	// 	});
	// });
	level.obstacles.forEach(function(obstacle) {
		// var debug = { x: obstacle.position.x, y: obstacle.position.y, color: 'pink'};
		// game.debugs.push(debug);
		var debug2 = { x: obstacle.position.x, y: obstacle.drawY, color: 'blue'};
		game.debugs.push(debug2);
	});
	game.creatures.forEach(function(creature) {
		var debug = {x:creature.position.x, y:creature.drawY, color: 'red'}
		game.debugs.push(debug);
	});
	var debug = {x:player.position.x, y:player.drawY, color: 'orange'}
	game.debugs.push(debug);
	// game.creatures.forEach(function(creature) {
	// 	if(creature.weapon) {
	// 		var debug = { x: creature.weapon.position.x, y: creature.weapon.position.y, color: 'green'};
	// 		game.debugs.push(debug);
	// 	}
	// });
	game.debugs.forEach(function(debug) {
		debugCtx.strokeStyle = debug.color;
		debugCtx.strokeRect(debug.x - game.viewport_offset_x, debug.y - game.viewport_offset_y, 1, 1);
	});
	game.debugs.length = 0;
}

function playerDeath() {
	// console.log("The player has died!");
	// console.log(game.creatures);
	game.creatures.forEach(function(creature) {
		creature.ai.nextAction = -1;
		creature.movement.speed = 0;
		if(creature.name === "Zombi") {
			if(creature.vars.facingRight && creature.vars.dead) {
				creature.vars.animation = 0;
			} else if(creature.vars.facingRight && !creature.vars.dead) {
				creature.vars.animation = 12;
			} else if(!creature.vars.facingRight && creature.vars.dead) {
				creature.vars.animation = 1;
			} else {
				creature.vars.animation = 13;
			}
		} else {
			if(creature.vars.facingRight) {
				creature.vars.animation = 0;
			} else {
				creature.vars.animation = 1;
			}
		}
	});
	player.vars.dead = true;
	player.movement.speed = 0;
	delete player.weapon;
	session.loadingLevel = false;
	player.vars.animStart = performance.now();
	game.playerDeathTime = performance.now();
}

//	Master game update function
function update(delta) {
	updateColliders();
	setViewportOffset();
	updatePlayer();
	updateCreatures();
	updateAttacks();
	updateObstacles();
	updateItems();
	updateProjectiles();
	updateDrawables();
	updateInterface();
	updateScoreDisplay();
}

//	Master game draw function
function draw(interpolationPercentage) {
	if(game.redrawBackground) {
		bgCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		drawOverlays();
		drawDecor();
	}
	drawableCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	drawDrawables();
	attackCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	drawAttacks();
	if(BBMaster.debugs) {
		debugCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		drawDebugCanvas();
	}
	$('#fps').text("FPS: " + MainLoop.getFPS().toFixed(4));
}

function reDraw() {
	bgCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	drawOverlays();
	drawDecor();
	drawableCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	drawDrawables();
	attackCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	drawAttacks();
	if(BBMaster.debugs) {
		debugCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		drawDebugCanvas();
	}
	$('#fps').text("FPS: " + MainLoop.getFPS().toFixed(4));
}

function clearCanvases() {
	$('#exitkeyimg').hide();
	bgCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	drawableCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	attackCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	if(BBMaster.debugs) {
		debugCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}
}

function endLevel() {
	player.effects.forEach(function(effect) {
		effect.endTime = 1;
	});
	//	Stop main loop
	MainLoop.stop();
	$('#messageDiv').fadeOut('fast');
	$.when($('canvas').fadeOut('slow')).then(function() {
		$('#completedLevelSpan').text(session.levelNumber);
		$('#nextLevelSpan').text(session.levelNumber + 1);
		$('#gameMenuDiv').fadeIn('slow', function() {
			$('#endLevelScreen').fadeIn('slow');
			session.loadingLevel = false;
			session.levelNumber++;
			session.score -= game.scoreOffset;
			game.scoreOffset = 0;
			endLevelScreen();
		});
	});
}

function initializeGame() {
	// console.log("Initializing game");
	game.scoreStartTime = 0;
	game.scoreOffset = 0;
	game.redrawBackground = true;
	game.viewport_offset_x = 0;
	game.viewport_offset_y = 0;
	game.creatures.length = 0;
	game.attacks.length = 0;
	game.projectiles.length = 0;
	game.items.length = 0;
	game.colliders.length = 0;
	game.nearbyColliders.length = 0;
	game.debugs.length = 0;
	game.drawables.length = 0;
	game.drawOnTop.length = 0;
}

function initializeLevel() {
	// console.log("Initializing level");
	level = {
		height: 0,
		width: 0,
		terrainArray: [],
		creatureArray: [],
		obstacleArray: [],
		overlayArray: [],
		itemArray: [],
		fillArray: [],
		obstacles: [],
		rooms: [],
		decor: [],
		corridors: [],
		creatureCount: 0,
		playerStart: {
			x: 0,
			y: 0
		},
		bossStart: {
			x: 0,
			y: 0
		},
		exit: {
			x: 0,
			y: 0 
		},
		displayAsMap: false,
		validLevel: false
	}
}

//	Start routines
function start(newGame) {
	if(newGame) {
		initializeSession();
 	}
	// console.log("Seed: " + session.seed);
	initializeLevel();
	level = levelGen.loadLevel(session.levelNumber);
	initializeGame();
	// console.log(level);
	if(newGame) {
		setUpPlayer();
	} else {
		player.grid.x = level.playerStart.x;
		player.grid.y = level.playerStart.y;
		player.position.x = player.grid.x * TILE_SIZE + TILE_SIZE / 2;
		player.position.y = player.grid.y * TILE_SIZE + TILE_SIZE / 2;
	}
	setViewportOffset();
	// addBackground();
	setUpLevel();
	drawOverlays();
	setUpCreatures();
	game.creatures.forEach(function(creature) {
		if(creature.weapon) {
			creature.weapon.reset();
		}
	});
	game.scoreStartTime = performance.now();
	$('#gameMenuDiv').fadeOut('slow', function() {
		if(newGame) {
			$('.finalScoreSpan').text('');
		}
		// console.log("Starting game - level: " + level.levelNumber);
		// drawMap();
	 	session.playing = true;
		$('canvas').fadeIn('slow', function() {
			$('#interfaceDivLeft').fadeIn('slow');
			$('.gameMenuScreen').hide();
			MainLoop.setUpdate(update).setDraw(draw).start();
		});
	});
}

function initializeSession() {
	session.levelNumber = 1;
	session.score = 0;
	session.flags = {};
	Object.assign(session.flags, BBMaster.flags);
	session.vars.defaultDropFrequency = BBMaster.defaultDropFrequency;
	session.vars.defaultMushroomMin = BBMaster.defaultMushroomMin;
	session.vars.defaultMushroomFactor = BBMaster.defaultMushroomFactor;
	session.vars.dropFrequency = cloneArray(BBMaster.dropFrequency);
	$('.scoreSpan').text('');
	session.seed = Math.floor(Math.random() * 2147483647);
	// console.log("Session seed is: " + session.seed);
	session.prng = new Random(session.seed);
}

$('#musicBtn').click(function() {
	if(!session.vars.musicIsMuted) {
		session.vars.musicIsMuted = true;
		bgMusic.mute(session.vars.musicIsMuted);
		titleLoop.mute(session.vars.musicIsMuted);
		victoryLoop.mute(session.vars.musicIsMuted);
		$('#musicBtn').attr('src', 'img/NoMusic.png');
		// console.log("Muting music");
	} else {
		session.vars.musicIsMuted = false;
		bgMusic.mute(session.vars.musicIsMuted);
		titleLoop.mute(session.vars.musicIsMuted);
		victoryLoop.mute(session.vars.musicIsMuted);
		$('#musicBtn').attr('src', 'img/Music.png');
		// console.log("Un-Muting music");
	}
});

//	Pause & restart game when browser tab loses & regains focus
window.onfocus = function() {
	session.focused = true;
	if(session.playing) {
		MainLoop.start();
	}
	game.scoreStartTime = performance.now();
	if(player && player.vars && !player.vars.dead) {
		session.score -= 1;
	}
	Howler.mute(false);
}
window.onblur = function() {
	session.focused = false;
	Key.clearPressed();
	if(session.playing) {
		MainLoop.stop();
	}
	session.score -= (game.scoreOffset);
	Howler.mute(true);
}

function drawMap() {
	$('#mapDiv').remove();
	var mapDiv = $('<div id="mapDiv"></div>');
	mapDiv.appendTo('body');
	$('#mapDiv').height(level.height * 3);
	$('#mapDiv').width(level.width * 3);
	for(var i = 0; i < level.height; i++) {
		for(var j = 0; j < level.width; j++) {
			if(level.terrainArray[i][j] === 0 && level.fillArray[i][j] === 2) {
				var terrain = $('<div class="terrain filledRoom"></div>');
				terrain.appendTo('#mapDiv');
			} else if(level.terrainArray[i][j] === 0 && level.fillArray[i][j] !== 2) {
				var terrain = $('<div class="terrain room"></div>');
				terrain.appendTo('#mapDiv');
			} else {
				var terrain = $('<div class="terrain"></div>');
				terrain.appendTo('#mapDiv');
			}
		}
	}
}
