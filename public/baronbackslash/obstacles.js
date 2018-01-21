Obstacle = function(type, room, y, x, modifier, noOffset) {
	if(type === undefined) {
		debugger;
	}
	this.type = type;
	this.sprite = {
		spriteSheet: level.obstacleImg,
	};
	//	Initial type switch to determine size needed for placement - only needed if sprite is bigger than 1x1
	switch(type) {
		case EnumObstacle.DOOR:
		case EnumObstacle.GOLD_KEY_DOOR:
		case EnumObstacle.END_GAME_DOOR:
		case EnumObstacle.KEY_DOOR:
		{
			this.sprite.size = {y: 2, x: 1}
			break;
		}
		case EnumObstacle.SKULL_SPIKE:
		case EnumObstacle.FLAG_SPIKE:
		case EnumObstacle.FLAME_POT:
		{
			this.sprite.size = {y: 1, x: 0.5}
			break;
		}
		case EnumObstacle.FLAME_PILLAR:
		{
			this.sprite.size = {y: 2, x: 0.5}
			break;
		}
		case EnumObstacle.COFFIN: 
		case EnumObstacle.SACKx2:
		case EnumObstacle.NARROW_SHELVES:
		case EnumObstacle.MONOLITH:
		case EnumObstacle.WARRIOR_STATUE:
		case EnumObstacle.STONE_PILLAR:
		case EnumObstacle.BLUE_SPHERE:
		case EnumObstacle.RED_SPHERE:
		case EnumObstacle.COLUMN:
		{
			this.sprite.size = {y: 2, x: 1}
			break;
		}
		case EnumObstacle.DRAGON_STATUE:
		{
			this.sprite.size = {y:2, x: 1.5}
			break;
		}
		case EnumObstacle.WELL:
		case EnumObstacle.TORTURE_TABLE:
		case EnumObstacle.SPIT:
		case EnumObstacle.BARRELSx3:
		case EnumObstacle.BARRELSx2:
		case EnumObstacle.MUG_TABLE:
		case EnumObstacle.SWORD_TABLE:
		case EnumObstacle.WIDE_SHELVES:
		case EnumObstacle.EXIT_STAIRS:
		case EnumObstacle.BOOKCASE_WIDE:
		case EnumObstacle.BOOKCASE:
		case EnumObstacle.WEAPON_RACK:
		case EnumObstacle.DIRT_PILE:
		case EnumObstacle.SMASHED_TABLE:
		case EnumObstacle.BARRELS_AND_SACKS_2:
		{
			this.sprite.size = {y: 2, x: 2}
			 break;
		}
		case EnumObstacle.MEAT_RACK:
		case EnumObstacle.ZOMBI_MASTER_DESK: 
		case EnumObstacle.WIZ_DESK:
		case EnumObstacle.WIZ_DESK_2:
		case EnumObstacle.BARRELS_AND_SACKS_1:
		case EnumObstacle.BARONS_THRONE:
		{
			this.sprite.size = {y: 2, x: 3}
			break;
		}
		case EnumObstacle.DINING_TABLE: {
			this.sprite.size = {y: 4, x: 3}
			break;
		}
		case EnumObstacle.BLACK_KNIGHT_STATUE:
		case EnumObstacle.WIZ_DESK_3: 
		case EnumObstacle.ENTRANCE_STAIRS:
		case EnumObstacle.BIG_MONOLITH:
		{
			this.sprite.size = {y: 3, x: 2}
			break;
		}



		default: {
			this.sprite.size = {y: 1, x: 1}
			break;
		}
	}
	//	If grid co-ordinates are passed, use them - otherwise attempt to fit randomly in passed room 
	if(x && y) {
		this.grid = {
			x: x,
			y: y
		}
	} else {
		var attempts = levelGen.vars.addObstacleAttempts;
		var validPlacement = false;
		while(attempts && !validPlacement) {
			validPlacement = true;
			var padX, padY;
			if(this.sprite.size.x < 1) {
				padX = 1;
			} else {
				padX = this.sprite.size.x;
			}
			if(this.sprite.size.y < 1) {
				padY = 1;
			} else {
				padY = this.sprite.size.y;
			}
			tryY = Math.floor(session.prng.nextFloat() * (room.height - 1 - padY)) + 1 + room.origin.y;
			tryX = Math.floor(session.prng.nextFloat() * (room.width - 1 - padX)) + 1 + room.origin.x;
			for(var i = 0; i < this.sprite.size.y; i++) {
				for(var j = 0; j < this.sprite.size.x; j++) {
					if(level.obstacleArray[tryY + i][tryX + j] !== undefined) {
						validPlacement = false;
					}	
				}
			}
			attempts--;
		}
		if(validPlacement) {
			this.grid = {
				y: tryY,
				x: tryX
			}
		} else {
			this.grid = {
				y: 0,
				x: 0
			}
		}
	}

	//	Once size is known, switch type to populate obstacle array
	level.obstacleArray[Math.floor(this.grid.y)][Math.floor(this.grid.x)] = 1;
	switch(type) {
		case EnumObstacle.DOOR:
		case EnumObstacle.GOLD_KEY_DOOR:
		case EnumObstacle.END_GAME_DOOR:
		case EnumObstacle.KEY_DOOR:
		{
			level.obstacleArray[this.grid.y+1][this.grid.x] = 1;
			break;
		}
		case EnumObstacle.COFFIN: 
		case EnumObstacle.SACKx2:
		case EnumObstacle.NARROW_SHELVES:
		case EnumObstacle.MONOLITH:
		case EnumObstacle.WARRIOR_STATUE:
		case EnumObstacle.STONE_PILLAR:
		case EnumObstacle.BLUE_SPHERE:
		case EnumObstacle.RED_SPHERE:
		case EnumObstacle.COLUMN:
		case EnumObstacle.FLAME_PILLAR:
		{
			level.obstacleArray[this.grid.y+1][this.grid.x] = 1;
			break;
		}
		case EnumObstacle.WELL:
		case EnumObstacle.TORTURE_TABLE:
		case EnumObstacle.SPIT:
		case EnumObstacle.BARRELSx3:
		case EnumObstacle.BARRELSx2:
		case EnumObstacle.MUG_TABLE:
		case EnumObstacle.SWORD_TABLE:
		case EnumObstacle.WIDE_SHELVES:
		case EnumObstacle.EXIT_STAIRS:
		case EnumObstacle.DRAGON_STATUE:
		case EnumObstacle.BOOKCASE_WIDE:
		case EnumObstacle.BOOKCASE:
		case EnumObstacle.DIRT_PILE:
		case EnumObstacle.WEAPON_RACK:
		case EnumObstacle.SMASHED_TABLE:
		case EnumObstacle.BARRELS_AND_SACKS_2:
		{
			level.obstacleArray[this.grid.y+1][this.grid.x] = 1;
			level.obstacleArray[this.grid.y][this.grid.x+1] = 1;
			level.obstacleArray[this.grid.y+1][this.grid.x+1] = 1;
			 break;
		}
		case EnumObstacle.MEAT_RACK:
		case EnumObstacle.ZOMBI_MASTER_DESK: 
		case EnumObstacle.WIZ_DESK:
		case EnumObstacle.WIZ_DESK_2:
		case EnumObstacle.BARRELS_AND_SACKS_1:
		case EnumObstacle.BARONS_THRONE:
		{
			for(var i = 0; i < 2; i++) {
				for(var j = 0; j < 3; j++) {
					level.obstacleArray[this.grid.y+i][this.grid.x+j] = 1;
				}
			}
			break;
		}
		case EnumObstacle.DINING_TABLE: {
			for(var i = 0; i < 4; i++) {
				for(var j = 0; j < 2; j++) {
					level.obstacleArray[this.grid.y+i][this.grid.x+j] = 1;
				}
			}
			break;
		}
		case EnumObstacle.BLACK_KNIGHT_STATUE: 
		case EnumObstacle.WIZ_DESK_3:
		case EnumObstacle.ENTRANCE_STAIRS:
		case EnumObstacle.BIG_MONOLITH:
		{
			for(var i = 0; i < 3; i++) {
				for(var j = 0; j < 2; j++) {
					level.obstacleArray[this.grid.y+i][this.grid.x+j] = 1;
				}
			}
			break;
		}



		default: {
			break;
		}
	}

	this.vars = {
		drawOffset: {y:0,x:0}
	};
	this.position = {
		y: (this.grid.y * TILE_SIZE) + (TILE_SIZE * this.sprite.size.y / 2),
		x: (this.grid.x * TILE_SIZE) + (TILE_SIZE * this.sprite.size.x / 2)
	}
	this.box = {
		type: EnumBoxtype.OBSTACLE,
		topLeft: {},
		bottomRight: {}
	}
	this.maxOffset = {
		y: 0,
		x: 0
	}
	this.offsetSpace = {
		y: 0,
		x: 0
	}
	// this.interact = function() {};
	switch(this.type) {
		case EnumObstacle.DOOR: {
			this.doorType = Math.floor(session.prng.nextFloat() * level.tiles.door.length / 3);
			this.sprite.spriteSheet = level.img;
			this.closed = true;
			this.currentSprite = level.tiles.door[0 + this.doorType * 3];
			this.sprite.frames = [level.tiles.door[0 + this.doorType * 3], level.tiles.door[1 + this.doorType * 3], level.tiles.door[2 + this.doorType * 3]];
			this.sprite.animations = [[200, [1, 100, 200], [0, 1, 2]]];
			level.terrainArray[this.grid.y+1][this.grid.x] = 2;
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 1.2,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 1.2,
				x: this.grid.x * TILE_SIZE
			}
			this.interact = function() {
				if(!this.open) {
					var snd = Math.floor(Math.random() * 2);
					if(snd < 1) {
						gameEffects.play('door1');
					} else {
						gameEffects.play('door2');
					}
					this.open = true;
					this.animated = true;
					this.vars.animStart = performance.now();
					this.vars.animation = 0;
					this.vars.pointInAnimLoop = 0;
					this.animEnd = performance.now() + 200;
					level.terrainArray[this.grid.y+1][this.grid.x] = 0;
				}
			}
			this.interactionEnd = function() {
				this.animated = false;
				this.currentSprite = level.tiles.door[2 + this.doorType * 3];
			}
			this.position = {				//	Centre of sprite
				y: (this.grid.y * TILE_SIZE) + (TILE_SIZE * this.sprite.size.y / 2),
				x: (this.grid.x * TILE_SIZE) + (TILE_SIZE * this.sprite.size.x / 2)
			}
			break;
		}
		case EnumObstacle.GOLD_KEY_DOOR: {
			this.doorType = 2;
			this.sprite.spriteSheet = level.img;
			this.closed = true;
			this.currentSprite = level.tiles.door[0 + this.doorType * 3];
			this.sprite.frames = [level.tiles.door[0 + this.doorType * 3], level.tiles.door[1 + this.doorType * 3], level.tiles.door[2 + this.doorType * 3]];
			this.sprite.animations = [[200, [1, 100, 200], [0, 1, 2]]];
			level.terrainArray[this.grid.y+1][this.grid.x] = 2;
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 1.2,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 1.2,
				x: this.grid.x * TILE_SIZE
			}
			this.interact = function() {
				var hasKey = false;
				for(var i = 0; i < player.items.length; i++) {
					if(player.items[i].name === "Gold Key") {
						hasKey = true;
					}
				}
				// hasKey = true;
				if(!this.open && hasKey) {					var snd = Math.floor(Math.random() * 2);
					if(snd < 1) {
						gameEffects.play('door1');
					} else {
						gameEffects.play('door2');
					}
					this.open = true;
					this.animated = true;
					this.vars.animStart = performance.now();
					this.vars.animation = 0;
					this.vars.pointInAnimLoop = 0;
					this.animEnd = performance.now() + 200;
					level.terrainArray[this.grid.y+1][this.grid.x] = 0;
				} else {
					displayMessage(2000, "The door is locked!");
				}
			}
			this.interactionEnd = function() {
				this.animated = false;
				this.currentSprite = level.tiles.door[2 + this.doorType * 3];
			}
			this.position = {				//	Centre of sprite
				y: (this.grid.y * TILE_SIZE) + (TILE_SIZE * this.sprite.size.y / 2),
				x: (this.grid.x * TILE_SIZE) + (TILE_SIZE * this.sprite.size.x / 2)
			}
			break;
		}
		case EnumObstacle.END_GAME_DOOR: {
			this.sprite.spriteSheet = level.img;
			this.closed = true;
			this.currentSprite = level.tiles.endGameDoor[0];
			this.sprite.frames = [level.tiles.endGameDoor[0], level.tiles.endGameDoor[1], level.tiles.endGameDoor[2]];
			this.sprite.animations = [[1000, [1, 500, 1000], [0, 1, 2]]];
			level.terrainArray[this.grid.y+1][this.grid.x] = 2;
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 1.2,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 1.2,
				x: this.grid.x * TILE_SIZE
			}
			this.interact = function() {
				if(!this.open) {
					var snd = Math.floor(Math.random() * 2);
					if(snd < 1) {
						gameEffects.play('door1');
					} else {
						gameEffects.play('door2');
					}
					this.open = true;
					this.animated = true;
					this.vars.animStart = performance.now();
					this.vars.animation = 0;
					this.vars.pointInAnimLoop = 0;
					this.animEnd = performance.now() + 1000;
					level.terrainArray[this.grid.y+1][this.grid.x] = 0;
					completeGame();
				}
			}
			this.interactionEnd = function() {
				this.animated = false;
				this.currentSprite = level.tiles.endGameDoor[2];
			}
			this.position = {				//	Centre of sprite
				y: (this.grid.y * TILE_SIZE) + (TILE_SIZE * this.sprite.size.y / 2),
				x: (this.grid.x * TILE_SIZE) + (TILE_SIZE * this.sprite.size.x / 2)
			}
			break;
		}
		case EnumObstacle.KEY_DOOR: {
			this.doorType = Math.floor(session.prng.nextFloat() * level.tiles.door.length / 3);
			this.sprite.spriteSheet = level.img;
			this.closed = true;
			this.currentSprite = level.tiles.door[0 + this.doorType * 3];
			this.sprite.frames = [level.tiles.door[0 + this.doorType * 3], level.tiles.door[1 + this.doorType * 3], level.tiles.door[2 + this.doorType * 3]];
			this.sprite.animations = [[200, [1, 100, 200], [0, 1, 2]]];
			level.terrainArray[this.grid.y+1][this.grid.x] = 2;
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 1.2,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 1.2,
				x: this.grid.x * TILE_SIZE
			}
			this.interact = function() {
				var hasKey = false;
				for(var i = 0; i < player.items.length; i++) {
					if(player.items[i].name === "Exit Key") {
						hasKey = true;
					}
				}
				// hasKey = true;
				if(!this.open && hasKey) {					var snd = Math.floor(Math.random() * 2);
					if(snd < 1) {
						gameEffects.play('door1');
					} else {
						gameEffects.play('door2');
					}
					this.open = true;
					this.animated = true;
					this.vars.animStart = performance.now();
					this.vars.animation = 0;
					this.vars.pointInAnimLoop = 0;
					this.animEnd = performance.now() + 200;
					level.terrainArray[this.grid.y+1][this.grid.x] = 0;
					//	Get index of exit key in player's items and remove it
					var keyIndex = player.items.map(function(item) { 
						return item.name;
					}).indexOf('Exit Key');
					player.items.splice(keyIndex, 1);
					$('#exitkeyimg').fadeOut('slow');
				} else if(!this.open) {
					displayMessage(2000, "The door is locked!");
				}
			}
			this.interactionEnd = function() {
				this.animated = false;
				this.currentSprite = level.tiles.door[2 + this.doorType * 3];
			}
			this.position = {				//	Centre of sprite
				y: (this.grid.y * TILE_SIZE) + (TILE_SIZE * this.sprite.size.y / 2),
				x: (this.grid.x * TILE_SIZE) + (TILE_SIZE * this.sprite.size.x / 2)
			}
			break;
		}
		case EnumObstacle.EXIT_STAIRS: {
			this.closed = true;
			this.sprite.spriteSheet = level.img;
			this.sprite.frames = [level.tiles.exitStairs[0], level.tiles.exitStairs[1], level.tiles.exitStairs[2]]
			this.sprite.animations = [[1000, [1, 500, 1000], [0, 1, 2]]]
			this.currentSprite = level.tiles.exitStairs[0];
			this.interact = function() {
				var hasKey = false;
				for(var i = 0; i < player.items.length; i++) {
					if(player.items[i].name === "Exit Key") {
						hasKey = true;
					}
				}
				// hasKey = true;
				if(!this.open && hasKey) {
					gameEffects.play('trapdoor');
					displayMessage(3000, "Your key unlocks the trapdoor!");
					this.open = true;
					this.animated = true;
					this.vars.animStart = performance.now();
					this.vars.animation = 0;
					this.vars.pointInAnimLoop = 0;
					this.animEnd =  performance.now() + 1000;
					//	Get index of exit key in player's items and remove it
					var keyIndex = player.items.map(function(item) { 
						return item.name;
					}).indexOf('Exit Key');
					player.items.splice(keyIndex, 1);
					$('#exitkeyimg').fadeOut('slow');
				} else if(!this.open) {
					displayMessage(3000, "The trapdoor is locked!", "You need to find the key...");
				} else {
					endLevel();
				}
			}
			this.interactionEnd = function() {
				this.animated = false;
				this.ctx = bgCtx;
				this.currentSprite = level.tiles.exitStairs[2];
			}
			this.vars.drawOffset = {
				y: TILE_SIZE,
				x: 0
			}
			this.drawY = 1;
			this.position = {
				y: (this.grid.y * TILE_SIZE) + (TILE_SIZE * this.sprite.size.y / 2),
				x: (this.grid.x * TILE_SIZE) + (TILE_SIZE * this.sprite.size.x / 2)
			}
			break;
		}
		case EnumObstacle.ENTRANCE_STAIRS: {
			this.sprite.spriteSheet = level.img;
			this.currentSprite = level.tiles.entranceStairs[0];
			this.drawY = 1;
			this.position = {
				y: (this.grid.y * TILE_SIZE) + (TILE_SIZE * this.sprite.size.y / 2),
				x: (this.grid.x * TILE_SIZE) + (TILE_SIZE * this.sprite.size.x / 2)
			}
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE,
				x: this.grid.x * TILE_SIZE + 8
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 30,
				x: this.grid.x * TILE_SIZE + 23
			}
			break;
		}
		case EnumObstacle.SIGNPOST: {
			this.currentSprite = level.obstacleTiles[64];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 2,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 3,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 14/16
			}
			this.interact = function() {
				displayMessage(6000, "The sign reads:", "Welcome to the Baron's dungeons, victim!", "The only way out is down...");
			}
			this.interactionEnd = function() {
			}
			this.vars.drawOffset = {
				y: -8,
				x: 0
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE) + (TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE) + (TILE_SIZE / 2)
			}
			break;
		}
		case EnumObstacle.BARREL: {
			this.currentSprite = level.obstacleTiles[5];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE - 5,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 12/16
			}
			this.maxOffset = {y:0,x:3}
			break;
		}
		case EnumObstacle.BARREL_2: {
			this.currentSprite = level.obstacleTiles[11];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE - 6,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 12/16
			}
			this.maxOffset = {y:2,x:1}
			break;
		}
		case EnumObstacle.SMASHED_BARREL: {
			this.currentSprite = level.obstacleTiles[73];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE - 8,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 15/16
			}
			this.maxOffset = {y:2,x:0}
			break;
		}
		case EnumObstacle.DINING_TABLE: {		//	Occupy 2 tiles on x axis * 4 on y in obstacleArray
			this.currentSprite = level.obstacleTiles[0];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE * 3,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 2
			}
			this.vars.drawOffset = {y: TILE_SIZE * 1.75, x:0};
			this.position = {
				y: (this.grid.y * TILE_SIZE),
				x: (this.grid.x * TILE_SIZE) + (TILE_SIZE * this.sprite.size.x / 2)
			}
			break;
		}
		case EnumObstacle.DINING_CHAIR: {
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE + 2
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE - 5,
				x: this.grid.x * TILE_SIZE + TILE_SIZE - 5
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:0,x:3}
			if(modifier === 1) {
				this.currentSprite = level.obstacleTiles[1];
			} else if(modifier === 2) {
				this.currentSprite = level.obstacleTiles[2];
			} else if(modifier === 3) {
				this.maxOffset = {y:0,x:1};
				this.currentSprite = level.obstacleTiles[3];
				this.sprite.size.y = 2;
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE - TILE_SIZE / 2 + 12,
					x: this.grid.x * TILE_SIZE - TILE_SIZE / 2 -2
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + TILE_SIZE + 6,
					x: this.grid.x * TILE_SIZE + TILE_SIZE / 2 - 2
				}
				this.position = {
					y: (this.grid.y * TILE_SIZE + 6),
					x: (this.grid.x * TILE_SIZE)
				}
			}
			break;
		}
		case EnumObstacle.BUCKET: {
			this.currentSprite = level.obstacleTiles[6];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 4,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE - 7,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 12/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:3,x:3}
			break;
		}
		case EnumObstacle.WELL: {
			this.currentSprite = level.obstacleTiles[7];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 16,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 26,
				x: this.grid.x * TILE_SIZE + 15
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:2,x:8}
			break;
		}
		case EnumObstacle.COFFIN: {
			this.currentSprite = level.obstacleTiles[4];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 22,
				x: this.grid.x * TILE_SIZE + 15
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:5,x:0}
			break;
		}
		case EnumObstacle.TORTURE_TABLE: {
			this.currentSprite = level.obstacleTiles[8];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 25,
				x: this.grid.x * TILE_SIZE + 28
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:0,x:2}
			break;
		}
		case EnumObstacle.MEAT_RACK: {
			this.currentSprite = level.obstacleTiles[9];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 20,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 25,
				x: this.grid.x * TILE_SIZE + (TILE_SIZE * 2 - 1)
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE * 1.5)
			}
			this.maxOffset = {y:0,x:14}
			break;
		}
		case EnumObstacle.STOOL: {
			level.obstacleArray[this.grid.y][this.grid.x] = 1;
			this.currentSprite = level.obstacleTiles[10];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 8,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 10/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:3,x:5}
			break;
		}
		case EnumObstacle.SACK: {
			this.currentSprite = level.obstacleTiles[12];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 4,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 10,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 12/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:1,x:4}
			break;
		}
		case EnumObstacle.BLOOD_BUCKET: {
			this.currentSprite = level.obstacleTiles[13];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE + 2
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 8,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 12/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:2,x:1}
			break;
		}
		case EnumObstacle.ZOMBI_MASTER_DESK: {
			this.currentSprite = level.obstacleTiles[15];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 21,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 2
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE * 1.5)
			}
			this.maxOffset = {y:4,x:13}
			break;
		}
		case EnumObstacle.ZOMBI_HEAD: {
			this.currentSprite = level.obstacleTiles[16];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 11,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 14/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			break;
		}
		case EnumObstacle.STONES: {
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE
			}
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 2)
			}
			if(modifier < 1) {
				this.currentSprite = level.obstacleTiles[14];
				this.maxOffset = {y:5,x:0}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 7,
					x: this.grid.x * TILE_SIZE + 15
				}
			} else {
				this.currentSprite = level.obstacleTiles[39];
				this.maxOffset = {y:0,x:0}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 11,
					x: this.grid.x * TILE_SIZE + 15
				}
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			break;
		}
		case EnumObstacle.SPIT: {
			this.currentSprite = level.obstacleTiles[17];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + TILE_SIZE,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 19,
				x: this.grid.x * TILE_SIZE + 23
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:8,x:4}
			break;
		}
		case EnumObstacle.FILTH_BUCKET: {
			this.currentSprite = level.obstacleTiles[18];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE + 2
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 9,
				x: this.grid.x * TILE_SIZE + 14
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:1,x:0}
			break;
		}
		case EnumObstacle.BARRELSx3: {
			this.currentSprite = level.obstacleTiles[19];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 17,
				x: this.grid.x * TILE_SIZE + 21
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:10,x:10}
			break;
		}
		case EnumObstacle.BARRELSx2: {
			this.currentSprite = level.obstacleTiles[20];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 14,
				x: this.grid.x * TILE_SIZE + 19
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:13,x:10}
			break;
		}
		case EnumObstacle.SACK_2: {
			this.currentSprite = level.obstacleTiles[21];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 11,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 11/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:0,x:1}
			break;
		}
		case EnumObstacle.SACK_3: {
			this.currentSprite = level.obstacleTiles[74];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 9,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 12/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:0,x:2}
			break;
		}		case EnumObstacle.SACKx2: {
			this.currentSprite = level.obstacleTiles[22];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 17,
				x: this.grid.x * TILE_SIZE + TILE_SIZE * 14/16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:10,x:0}
			break;
		}
		case EnumObstacle.TIPPED_BARREL: {
			this.currentSprite = level.obstacleTiles[23];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 8,
				x: this.grid.x * TILE_SIZE + TILE_SIZE
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:4,x:0}
			break;
		}
		case EnumObstacle.SPLIT_SACK: {
			this.currentSprite = level.obstacleTiles[24];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE + 14
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:3,x:0}
			break;
		}
		case EnumObstacle.WATER_BUTT: {
			this.currentSprite = level.obstacleTiles[25];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 11,
				x: this.grid.x * TILE_SIZE + 12
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:0,x:4}
			break;
		}
		case EnumObstacle.GRAIN_BARREL: {
			this.currentSprite = level.obstacleTiles[26];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 11,
				x: this.grid.x * TILE_SIZE + 14
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			break;
		}
		case EnumObstacle.WOODEN_CHAIR: {
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:0,x:2};
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 3) + 1;
			}
			if(modifier === 1) {										//	R facing
				this.currentSprite = level.obstacleTiles[27];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 5,
					x: this.grid.x * TILE_SIZE + 3
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 11,
					x: this.grid.x * TILE_SIZE + 13
				}
			} else if(modifier === 2) {
				this.currentSprite = level.obstacleTiles[28];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 5,
					x: this.grid.x * TILE_SIZE
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 11,
					x: this.grid.x * TILE_SIZE + 10
				}
				this.maxOffset.x = 3;
			} else {
				this.currentSprite = level.obstacleTiles[67];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 5,
					x: this.grid.x * TILE_SIZE
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 7,
					x: this.grid.x * TILE_SIZE + 6
				}
				this.maxOffset.x = 1;
				this.maxOffset.y = 3;
			}
			break;
		}
		case EnumObstacle.WOODEN_BENCH: {
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			if(modifier === 1) {										//	Vertical
				this.currentSprite = level.obstacleTiles[29];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 3,
					x: this.grid.x * TILE_SIZE
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 9,
					x: this.grid.x * TILE_SIZE + 9
				}
				this.maxOffset = {y:1,x:6}
			} else {
				this.currentSprite = level.obstacleTiles[30];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 3,
					x: this.grid.x * TILE_SIZE
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 6,
					x: this.grid.x * TILE_SIZE + 15
				}
				this.maxOffset = {y:6,x:0}
			}
			break;
		}
		case EnumObstacle.MUG_TABLE: {
			this.currentSprite = level.obstacleTiles[31];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 17,
				x: this.grid.x * TILE_SIZE + 27
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:8,x:4}
			break;
		}
		case EnumObstacle.SWORD_TABLE: {
			this.currentSprite = level.obstacleTiles[32];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 20,
				x: this.grid.x * TILE_SIZE + 27
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:5,x:4}
			break;
		}
		case EnumObstacle.WIDE_SHELVES: {
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 2)
			}
			if(modifier < 1) {
				this.currentSprite = level.obstacleTiles[33];
			} else {
				this.currentSprite = level.obstacleTiles[35];
			}
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 24,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 25,
				x: this.grid.x * TILE_SIZE + 22
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:1,x:6}
			break;
		}
		case EnumObstacle.NARROW_SHELVES: {
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 2)
			}
			if(modifier < 1) {
				this.currentSprite = level.obstacleTiles[34];
			} else {
				this.currentSprite = level.obstacleTiles[36];
			}
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 24,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 25,
				x: this.grid.x * TILE_SIZE + 12
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:1,x:0}
			break;
		}
		case EnumObstacle.RUBBLE: {
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 2)
			}
			if(modifier < 1) {
				this.currentSprite = level.obstacleTiles[37];
			} else {
				this.currentSprite = level.obstacleTiles[38];
			}
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 7,
				x: this.grid.x * TILE_SIZE + 16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:1,x:0}
			break;
		}
		case EnumObstacle.SKULL_SPIKE: {
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 2)
			}
			if(modifier < 1) {
				this.currentSprite = level.obstacleTiles[40];
			} else {
				this.currentSprite = level.obstacleTiles[41];
			}
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 10,
				x: this.grid.x * TILE_SIZE + 7
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 4)
			}
			this.maxOffset = {y:0,x:0}
			break;
		}
		case EnumObstacle.FLAG_SPIKE: {
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 2)
			}
			if(modifier < 1) {
				this.currentSprite = level.obstacleTiles[42];
			} else {
				this.currentSprite = level.obstacleTiles[43];
			}
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 5,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 10,
				x: this.grid.x * TILE_SIZE + 4
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 4)
			}
			this.maxOffset = {y:0,x:0}
			break;
		}
		case EnumObstacle.MONOLITH: {
			this.currentSprite = level.obstacleTiles[44];
			this.box.type = EnumBoxtype.TALL_OBSTACLE;
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 21,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 27,
				x: this.grid.x * TILE_SIZE + 13
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			break;
		}
		case EnumObstacle.BIG_MONOLITH: {
			this.currentSprite = level.obstacleTiles[75];
			this.box.type = EnumBoxtype.TALL_OBSTACLE;
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 32,
				x: this.grid.x * TILE_SIZE + 5
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 40,
				x: this.grid.x * TILE_SIZE + 26
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE * 3/2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			break;
		}
		case EnumObstacle.WARRIOR_STATUE: {
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 2) + 1;
			}
			if(modifier < 2) {
				this.currentSprite = level.obstacleTiles[45];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 18,
					x: this.grid.x * TILE_SIZE + 5
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 22,
					x: this.grid.x * TILE_SIZE + 12
				}
			} else {
				this.currentSprite = level.obstacleTiles[46];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 18,
					x: this.grid.x * TILE_SIZE + 4
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 22,
					x: this.grid.x * TILE_SIZE + 11
				}
			}
			this.box.type = EnumBoxtype.TALL_OBSTACLE;
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			break;
		}
		case EnumObstacle.DRAGON_STATUE: {
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 2) + 1;
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.box.type = EnumBoxtype.TALL_OBSTACLE;
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 18,
				x: this.grid.x * TILE_SIZE + 9
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 24,
				x: this.grid.x * TILE_SIZE + 19
			}
			if(modifier < 2) {
				this.currentSprite = level.obstacleTiles[47];
			} else {
				this.currentSprite = level.obstacleTiles[48];
			}
			break;
		}
		case EnumObstacle.BLACK_KNIGHT_STATUE: {
			this.currentSprite = level.obstacleTiles[52];
			this.box.type = EnumBoxtype.TALL_OBSTACLE;
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 34,
				x: this.grid.x * TILE_SIZE + 0
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 42,
				x: this.grid.x * TILE_SIZE + 16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE * 3/2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			break;
		}
		case EnumObstacle.STONE_PILLAR: {
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 3) + 1;
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.box.type = EnumBoxtype.TALL_OBSTACLE;
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 20,
				x: this.grid.x * TILE_SIZE + 3
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 25,
				x: this.grid.x * TILE_SIZE + 12
			}
			if(modifier < 2) {
				this.currentSprite = level.obstacleTiles[49];
			} else if(modifier < 3) {
				this.currentSprite = level.obstacleTiles[50];
			} else {
				this.currentSprite = level.obstacleTiles[51];
			}
			break;
		}
		case EnumObstacle.WIZ_DESK: {
			this.currentSprite = level.obstacleTiles[53];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 10,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 23,
				x: this.grid.x * TILE_SIZE + 41
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + 3 * TILE_SIZE / 2)
			}
			this.maxOffset = {y:1,x:5}
			break;
		}
		case EnumObstacle.BOOKCASE_MINI: {
			this.currentSprite = level.obstacleTiles[54];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 8,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 12,
				x: this.grid.x * TILE_SIZE + 9
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:0,x:5}
			break;
		}
		case EnumObstacle.BOOKCASE: {
			this.currentSprite = level.obstacleTiles[55];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 18,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 24,
				x: this.grid.x * TILE_SIZE + 16
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:0,x:13}
			break;
		}
		case EnumObstacle.BOOKCASE_WIDE: {
			this.currentSprite = level.obstacleTiles[56];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 18,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 25,
				x: this.grid.x * TILE_SIZE + 21
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:0,x:8}
			break;
		}
		case EnumObstacle.CANDLES: {
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 2)
			}
			if(modifier < 1) {
				this.currentSprite = level.obstacleTiles[57];
			} else {
				this.currentSprite = level.obstacleTiles[58];
			}
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 9,
				x: this.grid.x * TILE_SIZE + 2
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 12,
				x: this.grid.x * TILE_SIZE + 7
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:0,x:6}
			break;
		}
		case EnumObstacle.BLUE_SPHERE: {
			this.currentSprite = level.obstacleTiles[59];
			this.box.type = EnumBoxtype.TALL_OBSTACLE;
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 17,
				x: this.grid.x * TILE_SIZE + 2
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 21,
				x: this.grid.x * TILE_SIZE + 12
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:4,x:2}
			break;
		}
		case EnumObstacle.RED_SPHERE: {
			this.currentSprite = level.obstacleTiles[60];
			this.box.type = EnumBoxtype.TALL_OBSTACLE;
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 17,
				x: this.grid.x * TILE_SIZE + 2
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 21,
				x: this.grid.x * TILE_SIZE + 12
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:4,x:2}
			break;
		}
		case EnumObstacle.WIZ_DESK_2: {
			this.currentSprite = level.obstacleTiles[61];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 13,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 25,
				x: this.grid.x * TILE_SIZE + 45
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + 3 * TILE_SIZE / 2)
			}
			this.maxOffset = {y:0,x:0}
			break;
		}
		case EnumObstacle.WIZ_DESK_3: {
			this.currentSprite = level.obstacleTiles[62];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 41,
				x: this.grid.x * TILE_SIZE + 22
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + 3 * TILE_SIZE / 2),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:0,x:7}
			break;
		}
		case EnumObstacle.COLUMN: {
			this.currentSprite = level.obstacleTiles[63];
			this.box.type = EnumBoxtype.TALL_OBSTACLE;
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 14,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 24,
				x: this.grid.x * TILE_SIZE + 13
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE / 2)
			}
			this.maxOffset = {y:1,x:0}
			break;
		}
		case EnumObstacle.WEAPON_RACK: {
			this.currentSprite = level.obstacleTiles[65];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 13,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 17,
				x: this.grid.x * TILE_SIZE + 28
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:9,x:1}
			break;
		}
		case EnumObstacle.DIRT_PILE: {
			if(!modifier) {
				modifier = Math.floor(session.prng.nextFloat() * 2)
			}
			if(modifier < 1) {
				this.currentSprite = level.obstacleTiles[66];
			} else {
				this.currentSprite = level.obstacleTiles[72];
			}
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE + 2
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 9,
				x: this.grid.x * TILE_SIZE + 30
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:14,x:0}
			break;
		}
		case EnumObstacle.BARRELS_AND_SACKS_1: {
			this.currentSprite = level.obstacleTiles[68];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 8,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 22,
				x: this.grid.x * TILE_SIZE + 43
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + 3 * TILE_SIZE / 2)
			}
			this.maxOffset = {y:0,x:1}
			break;
		}
		case EnumObstacle.BARRELS_AND_SACKS_2: {
			this.currentSprite = level.obstacleTiles[69];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 8,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 17,
				x: this.grid.x * TILE_SIZE + 23
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			this.maxOffset = {y:9,x:7}
			break;
		}
		case EnumObstacle.SMASHED_TABLE: {
			this.currentSprite = level.obstacleTiles[70];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 6,
				x: this.grid.x * TILE_SIZE + 1
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 26,
				x: this.grid.x * TILE_SIZE + 10
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + TILE_SIZE)
			}
			// this.maxOffset = {y:14,x:0}
			this.drawY = this.box.topLeft.y + 2;
			break;
		}
		case EnumObstacle.FLAME_POT: {
			this.currentSprite = level.tiles.flamePot[0];
			this.sprite.frames = [level.tiles.flamePot[0], level.tiles.flamePot[1], level.tiles.flamePot[2],level.tiles.flamePot[3], level.tiles.flamePot[4], level.tiles.flamePot[5]];
			this.sprite.animations = [[900, [75, 150, 225, 300, 375, 450, 525, 600, 675, 750, 825, 900], [0,1,2,3,4,5,1,4,3,0,4,5]]];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 10,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 12,
				x: this.grid.x * TILE_SIZE + 5
			}
			this.animated = true;
			this.vars.animStart = performance.now() - Math.random() * 900;
			this.vars.animation = 0;
			this.vars.pointInAnimLoop = 0;
			this.position = {				//	Centre of sprite
				y: (this.grid.y * TILE_SIZE) + (TILE_SIZE * this.sprite.size.y / 2),
				x: (this.grid.x * TILE_SIZE) + (TILE_SIZE * this.sprite.size.x / 4)
			}
			break;
		}
		case EnumObstacle.FLAME_PILLAR: {
			this.currentSprite = level.tiles.flamePillar[0];
			this.sprite.frames = [level.tiles.flamePillar[0], level.tiles.flamePillar[1], level.tiles.flamePillar[2],level.tiles.flamePillar[3], level.tiles.flamePillar[4], level.tiles.flamePillar[5]];
			this.sprite.animations = [[900, [75, 150, 225, 300, 375, 450, 525, 600, 675, 750, 825, 900], [0,1,2,3,4,5,1,4,3,0,4,5]]];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 20,
				x: this.grid.x * TILE_SIZE
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 22,
				x: this.grid.x * TILE_SIZE + 5
			}
			this.animated = true;
			this.vars.animStart = performance.now() - Math.random() * 900;
			this.vars.animation = 0;
			this.vars.pointInAnimLoop = 0;
			this.position = {				//	Centre of sprite
				y: (this.grid.y * TILE_SIZE) + (TILE_SIZE * this.sprite.size.y / 2),
				x: (this.grid.x * TILE_SIZE) + (TILE_SIZE * this.sprite.size.x / 2)
			}
			break;
		}
		case EnumObstacle.BARONS_THRONE: {
			this.currentSprite = level.obstacleTiles[71];
			this.box.topLeft = {
				y: this.grid.y * TILE_SIZE + 15,
				x: this.grid.x * TILE_SIZE + 15
			}
			this.box.bottomRight = {
				y: this.grid.y * TILE_SIZE + 27,
				x: this.grid.x * TILE_SIZE + 34
			}
			this.position = {
				y: (this.grid.y * TILE_SIZE + TILE_SIZE),
				x: (this.grid.x * TILE_SIZE + 3 * TILE_SIZE / 2)
			}
			this.maxOffset = {y:0,x:0}
			break;
		}
		case EnumObstacle.BARON_BARRIER: {
			if(modifier === 1) {
				this.currentSprite = level.tiles.baronBarrier[5];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE,
					x: this.grid.x * TILE_SIZE
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 12,
					x: this.grid.x * TILE_SIZE + 2
				}
			} else if(modifier === 2) {
				this.currentSprite = level.tiles.baronBarrier[6];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE,
					x: this.grid.x * TILE_SIZE + 14
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 12,
					x: this.grid.x * TILE_SIZE + 16
				}
			} else {
				this.currentSprite = level.tiles.baronBarrier[0];
				this.sprite.frames = [level.tiles.baronBarrier[0], level.tiles.baronBarrier[1], level.tiles.baronBarrier[2],level.tiles.baronBarrier[3], level.tiles.baronBarrier[4]];
				this.sprite.animations = [[900, [75, 150, 225, 300, 375, 450, 525, 600, 675, 750, 825, 900], [0,1,2,3,4,2,1,4,3,0,4,1]]];
				this.box.topLeft = {
					y: this.grid.y * TILE_SIZE + 10,
					x: this.grid.x * TILE_SIZE
				}
				this.box.bottomRight = {
					y: this.grid.y * TILE_SIZE + 12,
					x: this.grid.x * TILE_SIZE + 16
				}
				this.animated = true;
				this.vars.animStart = performance.now() - Math.random() * 900;
				this.vars.animation = 0;
				this.vars.pointInAnimLoop = 0;
				this.position = {				//	Centre of sprite
					y: (this.grid.y * TILE_SIZE) + (TILE_SIZE / 2),
					x: (this.grid.x * TILE_SIZE) + (TILE_SIZE / 2)
				}
			}
			this.destroy = function() {
				this.animated = false;
				this.currentSprite = {x: -1, y: -1};
				this.box = {
					topLeft: {
						x: 1,
						y: 1
					},
					bottomRight: {
						x: 1,
						y: 1
					}
				};
			}
			break;
		}



		default: {
			break;
		}
	}
	if(!noOffset) {
		this.offsetPosition();
	}
	//	If object was successfully placed, add it to the obstacles array
	if(this.grid.x !== 0 & this.grid.y !== 0) {
		level.obstacles.push(this);
	}
}

Obstacle.prototype.offsetPosition = function() {
	var offset_y = Math.floor(session.prng.nextFloat() * this.maxOffset.y);
	var offset_x = Math.floor(session.prng.nextFloat() * this.maxOffset.x);
	this.box.topLeft.y += offset_y;
	this.box.bottomRight.y += offset_y;
	this.position.y += offset_y;
	this.box.topLeft.x += offset_x;
	this.box.bottomRight.x += offset_x;
	this.position.x += offset_x;
}
