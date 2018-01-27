var CANVAS_WIDTH = 272;								//	Size of viewport in **native pixels** - scale up **in CSS** to avoid antialiasing artefacts
var CANVAS_HEIGHT = 200;
// var CANVAS_WIDTH = 240;								//	Size of viewport in **native pixels** - scale up **in CSS** to avoid antialiasing artefacts
// var CANVAS_HEIGHT = 168;
var SCALE_FACTOR = 3;								//	Factor by which pixels are scaled up for display

var TILE_SIZE = 16;									//	Native tile size in spriteSheet

var player = {};

var EnumState = { 
	RESTING_R: 0, 
	RESTING_L: 1, 
	MOVING_R: 2, 
	MOVING_L: 3,
	RESTING_HITFLASH_R: 4,
	RESTING_HITFLASH_L: 5, 
	MOVING_HITFLASH_R: 6,
	MOVING_HITFLASH_L: 7,
	DYING_R: 8,
	DYING_L: 9 
}

var EnumColor = {
	NORMAL: 0,
	PURPLE: 1,
	GREEN: 2
}

var EnumAttack = { 
	SWIPE: 0,
	STAB: 1,
	ARROW: 2,
	FIREBALL: 3
}

var EnumCreature = {
	GREEN_GOBLIN: 1,
	MINI_GHOST: 2,
	SKELTON: 3,
	GREEN_SLUDGIE: 4,
	CAMP_VAMP: 5,
	URK: 6,
	URK_WARRIOR: 7,
	HULKING_URK: 8,
	KOB: 9,
	MUMI: 10,
	SNEAKY_SKELTON: 11,
	BLUE_SQUARK: 12,
	ZOMBI: 13,
	ZOMBI_MASTER: 14,
	WATER_ELEMENTAL: 15,
	URK_VETERAN: 16,
	URK_SHAMAN: 17,
	BLACK_KNIGHT: 18,
	OGR: 19,
	BLACK_WIZ: 20,
	RED_WIZ: 21,
	BLACK_IMP: 22,
	RED_IMP: 23,
	GRIMLIN: 24,
	FIRE_ELEMENTAL: 25,
	YELLOW_SLUDGIE: 26,
	GREY_GOBLIN: 27,
	ALBINO_URK: 28,
	MINI_KOB: 29,
	GIGA_KOB: 30,
	BADBUG: 31,
	WRONGWRAITH: 32,
	BARON: 33,
	BARON_ORB: 34,
	DEEMON_1: 35,
	DEEMON_2: 36,
	ROCKO: 37,
	PEBBL: 38
}

var EnumAi = {
	GREEN_GOBLIN: 1,
	MINI_GHOST: 2,
	SKELTON: 3,
	GREEN_SLUDGIE: 4,
	CAMP_VAMP: 5,
	URK: 6,
	URK_WARRIOR: 7,
	SKELTON_ARCHER: 8,
	HULKING_URK: 9,
	MUMI: 10,
	SNEAKY_SKELTON: 11,
	ZOMBI: 12,
	ZOMBI_MASTER: 13,
	KOB: 14,
	BLUE_SQUARK: 15,
	URK_VETERAN: 16,
	URK_SHAMAN: 17,
	BLACK_KNIGHT: 18,
	OGR: 19,
	BLACK_WIZ: 20,
	RED_WIZ: 21,
	BLACK_IMP: 22,
	RED_IMP: 23,
	GRIMLIN: 24,
	ELEMENTAL: 25,
	YELLOW_SLUDGIE: 26,
	GREY_GOBLIN: 27,
	BADBUG: 28,
	WRONGWRAITH: 29,
	BARON: 30,
	BARON_ORB: 31,
	DEEMON: 32,
	ROCKO: 33,
	PEBBL: 34
}

var EnumCreatureWeapon = {
	GREEN_GOBLIN_CLAW: 1,
	BONE_SWORD: 2,
	BONE_AXE: 3,
	VAMP_DAGGER: 4,
	URK_SWORD: 5,
	BONE_CROSSBOW: 6,
	HULKING_URK_HAMMA: 7,
	KOB_MACE: 8,
	ZOMBI_BITE: 9,
	ZOMBI_MASTER_STAFF: 10,
	SQUARK_KNIFE: 11,
	URK_SHAMAN_STAFF: 12,
	BLACK_KNIGHT_SWORD: 13,
	OGR_AX: 14,
	OGR_SWORD: 15,
	BLACK_WIZ_WEAPON: 16,
	RED_WIZ_WEAPON: 17,
	IMP_BITE: 18,
	FIRE_ELEMENTAL_WEAPON: 19,
	WATER_ELEMENTAL_WEAPON: 20,
	ALBINO_URK_SWORD: 21,
	MINI_KOB_KNIFE: 22,
	BADBUG_BITE: 23,
	GIGA_KOB_AXE: 24,
	DEEMON_BITE: 25,
	BARON_SWORD: 26,
	URK_CHOPPA: 27,
	ROCKO_CLUB: 28
}

var EnumCreatureProjectile = {
	BONE_ARROW: 1,
	SQUARK_KNIFE: 2,
	URK_SHAMAN_FIREBALL: 3,
	BLACK_WIZ_LIGHTNING: 4,
	FIRE_ELEMENTAL_BLAST: 5,
	WATER_ELEMENTAL_BLAST: 6
}

var EnumItem = {
	HEALTH_HEART: 1,
	EXIT_KEY: 2,
	PURPLE_MUSHROOM: 3,
	GREEN_MUSHROOM: 4,
	ORANGE_MUSHROOM: 5,

	BASIC_KNIFE: 6,
	ACID_KNIFE: 7,
	CRYSTAL_KNIFE: 8,
	SHADOW_KNIFE: 9,
	FIRE_KNIFE: 10,
	WATER_KNIFE: 11,
	LIGHTNING_KNIFE: 12,

	BASIC_SWORD: 13,
	ACID_SWORD: 14,
	CRYSTAL_SWORD: 15,
	SHADOW_SWORD: 16,
	FIRE_SWORD: 17,
	WATER_SWORD: 18,
	LIGHTNING_SWORD: 19,

	ACID_HELMET: 20,
	CRYSTAL_HELMET: 21,
	SHADOW_HELMET: 22,
	FIRE_HELMET: 23,
	WATER_HELMET: 24,
	LIGHTNING_HELMET: 25,

	GOLD_HEART: 26,
	GOLD_KEY: 27,
	LOOT_NECKLACE: 28,
	LOOT_GREEN_JEWEL: 29,
	LOOT_BLUE_JEWEL: 30,
	LOOT_RED_JEWEL: 31
}

var EnumPlayerWeapon = {
	KNIFE: 1,
	SWORD: 2
}

var EnumPlayerHelmet = {
	ACID: 1,
	CRYSTAL: 2,
	SHADOW: 3,
	FIRE: 4,
	WATER: 5,
	LIGHTNING: 6
}

var	EnumLode = {
	NONE: 0,

	//	Affect damage / criticals
	ACID: 1,
	CRYSTAL: 2,
	SHADOW: 3,
	FIRE: 4,
	WATER: 5,
	LIGHTNING: 6,

	//	Affect colour only
	BONE: 7,
	CLAW: 8,
	BITE: 9,
	IRON: 10
}

var EnumBoxtype = {
	PLAYER: 0,
	CREATURE: 1,
	PROJECTILE: 2,
	OBSTACLE: 3,
	ITEM: 4,
	PICKUP: 5,
	FIREBALL: 6,
	TALL_OBSTACLE: 7
}

var EnumRoomtype = {
	BASIC_ROOM: 0,
	LIGHT_FLOOR_PATCH: 1,
	MUD_POOL: 2,
	RED_COBBLES: 3,
	GREY_STONE: 4,
	SQUARE_TILE: 5,
	PARQUET_FLOOR: 6,
	FLOORBOARDS: 7,
	PAVED_FLOOR: 8,
	BIG_SQUARE_TILE: 9,
	GREY_PAVED_FLOOR: 10,
	GREY_SQUARE_TILE: 11,
	PUDDLE: 12,
	GREY_COBBLES: 13
}

var EnumFloorpatch = {
	LIGHT_RED: 0,
	MUD_POOL: 1,
	PUDDLE: 2
}

var EnumObstacle = {
	DOOR: 0,
	EXIT_STAIRS: 1,
	BARREL: 2,
	BARREL_2: 3,
	DINING_TABLE: 4,
	DINING_CHAIR: 5,
	DINING_CHAIR: 6,
	BUCKET: 7,
	WELL: 8,
	COFFIN: 9,
	TORTURE_TABLE: 10,
	MEAT_RACK: 11,
	STOOL: 12,
	SACK: 13,
	BLOOD_BUCKET: 14,
	ZOMBI_MASTER_DESK: 15,
	ZOMBI_HEAD: 16,
	STONES: 17,
	SPIT: 18,
	FILTH_BUCKET: 19,
	BARRELSx3: 20,
	BARRELSx2: 21,
	SACK_2: 22,
	SACKx2: 23,
	TIPPED_BARREL: 24,
	SPLIT_SACK: 25,
	WATER_BUTT: 26,
	GRAIN_BARREL:27,
	BENCH: 28,
	WOODEN_CHAIR: 29,
	WOODEN_BENCH: 30,
	MUG_TABLE: 31,
	SWORD_TABLE: 32,
	WIDE_SHELVES: 33,
	NARROW_SHELVES: 34,
	RUBBLE: 35,
	SKULL_SPIKE: 36,
	FLAG_SPIKE: 37,
	MONOLITH: 38,
	WARRIOR_STATUE: 39,
	DRAGON_STATUE: 40,
	STONE_PILLAR: 41,
	BLACK_KNIGHT_STATUE: 42,
	WIZ_DESK: 43,
	BOOKCASE_MINI: 44,
	BOOKCASE: 45,
	BOOKCASE_WIDE: 46,
	CANDLES: 47,
	BLUE_SPHERE: 48,
	RED_SPHERE: 49,
	WIZ_DESK_2: 50,
	WIZ_DESK_3: 51,
	COLUMN: 52,
	SIGNPOST: 53,
	WEAPON_RACK: 54,
	DIRT_PILE: 55,
	TIPPED_CHAIR: 56,
	BARRELS_AND_SACKS_1: 57,
	BARRELS_AND_SACKS_2: 58,
	SMASHED_TABLE: 59,
	FLAME_POT: 60,
	END_GAME_DOOR: 61,
	BARONS_THRONE: 62,
	BARON_BARRIER: 63,
	GOLD_KEY_DOOR: 64,
	ENTRANCE_STAIRS: 65,
	KEY_DOOR: 66,
	BIG_MONOLITH: 67,
	SACK_3: 68,
	SMASHED_BARREL: 69,
	FLAME_PILLAR: 70
}

var EnumDecortype = {
	FILTH: 0,
	SPLATS: 1,
	PLANTS: 2,
	BONES: 3,
	MISC: 4
}

var EnumObstacletype = {
	BASIC_ROOM: 0,
	TILED_FLOOR: 1,
	STONE_FLOOR: 2,
	PUDDLE: 3
}

var playerSprite = document.getElementById('playerSpriteImg');
var monsterSprites = document.getElementById('monsterSprites');

$('#background').width(CANVAS_WIDTH);

var bgCanvas = $('<canvas id="bgCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
var bgCtx = bgCanvas.get(0).getContext('2d');
bgCanvas.appendTo('#container');

var attackCanvas = $('<canvas id="attackCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
var attackCtx = attackCanvas.get(0).getContext('2d');
attackCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
attackCanvas.appendTo('#container');

var drawableCanvas = $('<canvas id="drawableCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
var drawableCtx = drawableCanvas.get(0).getContext('2d');
drawableCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
drawableCanvas.appendTo('#container');

var debugCanvas = $('<canvas id="debugCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
var debugCtx = debugCanvas.get(0).getContext('2d');
debugCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
debugCanvas.appendTo('#container');

var interfaceCanvas = $('<canvas id="interfaceCanvas" width="' + CANVAS_WIDTH + '" height="' + CANVAS_HEIGHT + '"></canvas>');
var interfaceCtx = interfaceCanvas.get(0).getContext('2d');
interfaceCtx.imageSmoothingEnabled = false;			//	Preserve crisp edges of pixel art in active canvas context
interfaceCtx.font = "10pt dpcomic";
interfaceCtx.fillStyle = "white";
interfaceCanvas.appendTo('#container');

var background = $('<div id="background">');
background.css('background', '#1c1117');
background.css('width', CANVAS_WIDTH * SCALE_FACTOR);
background.css('height', CANVAS_HEIGHT * SCALE_FACTOR);
background.appendTo('#container');

//	Deep clone an array of objects
function cloneArray(existingArray) {
   var newObj = (existingArray instanceof Array) ? [] : {};
   for (i in existingArray) {
      if (i == 'clone') continue;
      if (existingArray[i] && typeof existingArray[i] == "object") {
         newObj[i] = cloneArray(existingArray[i]);
      } else {
         newObj[i] = existingArray[i]
      }
   }
   return newObj;
}

//	Performance.now() polyfill for Safari
if ("performance" in window == false) {
  window.performance = {};
}

Date.now = (Date.now || function () {  // thanks IE8
  return new Date().getTime();
});

if ("now" in window.performance == false){
	var nowOffset = Date.now();
	if (performance.timing && performance.timing.navigationStart){
	  nowOffset = performance.timing.navigationStart
	}
	window.performance.now = function now(){
	  return Date.now() - nowOffset;
	}
}

//	Object.assign polyfill for Safari
if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target, firstSource) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}

//	Hi score table toggle buttons
$('#todayBtn').click(function() {
	$('.hiScoreBtn').removeClass('hiScoreBtnSelected');
	$(this).addClass('hiScoreBtnSelected');
	if(!$('#todayScoreTableDiv').is(':visible')) {
		$('#allTimeScoreTableDiv').fadeOut('slow', function() {
			$('#todayScoreTableDiv').fadeIn('slow');
		});
	}
});
$('#allTimeBtn').click(function() {
	$('.hiScoreBtn').removeClass('hiScoreBtnSelected');
	$(this).addClass('hiScoreBtnSelected');
	if(!$('#allTimeScoreTableDiv').is(':visible')) {
		$('#todayScoreTableDiv').fadeOut('slow', function() {
			$('#allTimeScoreTableDiv').fadeIn('slow');
		});
	}
});