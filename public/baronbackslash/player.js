var playerTemplates = [
	{
		name: 'Hero',
		lode: EnumLode.NONE,
		currentSprite: { x: 0, y: 0 },
		vars: {
			speed: 1.2,
			maxHP: 15,
			currentHP: 15,
			restingWeaponAnimation: true,
			invulnerableTime: 1000,						//	Time that player remains immune after taking damage
			invulnerableTo: 0,							//	Time at which player stops being invulnerable
			attackRate: 1,
			moving: false
		},
		sprite: { 
			spriteSheet: playerSprite,
			size: { x: 1, y: 1 },
			y_padding: 2,
			frames: [
				{ x: 0, y: 0 },		//	0	Resting 0 - facing R
				{ x: 1, y: 0 },		//	1	Resting 1 - facing R
				{ x: 2, y: 0 },		//	2	Walking 0 - facing R
				{ x: 3, y: 0 },		//	3	Walking 1 - facing R
				{ x: 4, y: 0 },		//	4	Walking 2 - facing R
				{ x: 5, y: 0 },		//	5	Walking 3 - facing R
				{ x: 0, y: 1 },		//	6	Resting 0 - facing L
				{ x: 1, y: 1 },		//	7	Resting 1 - facing L
				{ x: 2, y: 1 },		//	8	Walking 0 - facing L
				{ x: 3, y: 1 },		//	9	Walking 1 - facing L
				{ x: 4, y: 1 },		//	10	Walking 2 - facing L
				{ x: 5, y: 1 },		//	11	Walking 3 - facing L
				{ x: 0, y: 2 },		//	12	Resting Hitflash 0 - facing R
				{ x: 1, y: 2 },		//	13	Resting Hitflash 1 - facing R
				{ x: 0, y: 3 },		//	14	Resting Hitflash 0 - facing L
				{ x: 1, y: 3 },		//	15	Resting Hitflash 1 - facing L
				{ x: 2, y: 2 },		//	16	Walking Hitflash 0 - facing R
				{ x: 3, y: 2 },		//	17	Walking Hitflash 1 - facing R
				{ x: 4, y: 2 },		//	18	Walking Hitflash 2 - facing R
				{ x: 5, y: 2 },		//	19	Walking Hitflash 3 - facing R
				{ x: 2, y: 3 },		//	20	Walking Hitflash 0 - facing L
				{ x: 3, y: 3 },		//	21	Walking Hitflash 1 - facing L
				{ x: 4, y: 3 },		//	22	Walking Hitflash 2 - facing L
				{ x: 5, y: 3 },		//	23	Walking Hitflash 3 - facing L
				{ x: 6, y: 0 },		//	24	Death 1 - facing R
				{ x: 7, y: 0 },		//	25	Death 2 - facing R
				{ x: 8, y: 0 },		//	26	Death 3 - facing R
				{ x: 9, y: 0 },		//	27	Death 4 - facing R
				{ x: 6, y: 1 },		//	28	Death 1 - facing L
				{ x: 7, y: 1 },		//	29	Death 2 - facing L
				{ x: 8, y: 1 },		//	30	Death 3 - facing L
				{ x: 9, y: 1 }		//	31	Death 4 - facing L
			],
			animations: [													//	Format: Loop time in ms, end time of each frame in ms, frame numbers
				[ 1000, [600, 1000], [0, 1] ],								//	Resting, facing R
				[ 1000, [600, 1000], [6, 7] ],								//	Resting, facing L
				[ 400, [100, 200, 300, 400], [2, 3, 4, 5 ] ],				//	Moving, facing R
				[ 400, [100, 200, 300, 400], [8, 9, 10,11] ],				//	Moving, facing L
				[ 1000, [67, 134, 200, 267, 334, 400, 467, 534, 600, 667, 734, 800, 867, 934, 1000 ], [ 12, 0, 12, 0, 12, 0, 12, 0, 12, 1, 13, 1, 13, 1, 13 ] ],	//	Resting Hitflash, facing R
				[ 1000, [67, 134, 200, 267, 334, 400, 467, 534, 600, 667, 734, 800, 867, 934, 1000 ], [ 14, 6, 14, 6, 14, 6, 14, 6, 14, 7, 15, 7, 15, 7, 15 ] ],	//	Resting Hitflash, facing L
				[ 400, [100, 200, 300, 400], [2, 17, 4, 19] ],				//	Moving Hitflash, facing R
				[ 400, [100, 200, 300, 400], [8, 21, 10,23] ],				//	Moving Hitflash, facing L
				[ 50000, [500, 1000, 1500, 50000], [24, 25, 26, 27] ],		//	Death, facing R
				[ 50000, [500, 1000, 1500, 50000], [28, 29, 30, 31] ]		//	Death, facing L
			]
		},
		box: {
			width: 10, 
			height: 14,
			y_padding: 2,
			type: EnumBoxtype.PLAYER
		},
		movement: {
			moving: false,
			direction: 0,
			speed: 0,
			bounceOff: false
		},
		inflictDamage: function(damage) {
			var hit = true;
			if(player.vars.charmed) {
				var charm = Math.floor(Math.random() * 2);
				if(charm < 1) {
					hit = false;
					gameEffects.play('charmed');
				}
			}
			if(hit && performance.now() > this.vars.invulnerableTo) {
				gameEffects.play('playerDamage');
				this.vars.currentHP -= damage;
				this.vars.invulnerableTo = performance.now() + this.vars.invulnerableTime;
				$('.healthSpan').text(this.vars.currentHP + ' / ' + this.vars.maxHP);
				if(this.vars.facingRight) {
					this.vars.animation = EnumState.HITFLASH_R;
				} else {
					this.vars.animation = EnumState.HITFLASH_L;
				}
				this.vars.lastDamageTime = performance.now();
				if(this.vars.currentHP <= 0) {
					this.deathResponse();
				}
			}
		},
		deathResponse: function() {	
			gameEffects.play('playerDeath');
			playerDeath();
		}
	}
];

function colorPlayer(color) {
	player.vars.color = color;
	switch(color) {
		case EnumColor.NORMAL: {
			for(var i = 0; i < 2; i++) {
				for(var j = 0; j < 6; j++) {
					player.sprite.frames[j+i*6].x = j;
					player.sprite.frames[j+i*6].y = i;
				}
			}
			break;
		}
		case EnumColor.PURPLE: {
			for(var i = 0; i < 2; i++) {
				for(var j = 0; j < 6; j++) {
					player.sprite.frames[j+i*6].x = j+10;
					player.sprite.frames[j+i*6].y = i;
				}
			}
			break;
		}
		case EnumColor.GREEN: {
			for(var i = 0; i < 2; i++) {
				for(var j = 0; j < 6; j++) {
					player.sprite.frames[j+i*6].x = j+10;
					player.sprite.frames[j+i*6].y = i+2;
				}
			}
			break;
		}
		case EnumColor.ORANGE: {
			for(var i = 0; i < 2; i++) {
				for(var j = 0; j < 6; j++) {
					player.sprite.frames[j+i*6].x = j+10;
					player.sprite.frames[j+i*6].y = i+4;
				}
			}
			break;
		}
		default: {
			for(var i = 0; i < 2; i++) {
				for(var j = 0; j < 6; j++) {
					player.sprite.frames[j+i*6].x = j;
					player.sprite.frames[j+i*6].y = i;
				}
			}
			break;
		}
	}
} 