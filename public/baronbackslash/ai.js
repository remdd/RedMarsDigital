getPlayerDirection = function(creature) {					//	Returns angle in radians from creature position to player position vectors
	return Math.atan2((player.position.y - creature.position.y), (player.position.x - creature.position.x));
}

getPlayerCompassDirection = function(creature) {
	var direction = Math.atan2((player.position.y - creature.position.y), (player.position.x - creature.position.x));
	return direction;
}

getPlayerDistance = function(creature) {
	if(player) {
		return Math.sqrt(Math.pow(player.position.y - creature.position.y, 2) + Math.pow(player.position.x - creature.position.x, 2));
	}
}

getDistance = function(creature1, creature2) {
	return Math.sqrt(Math.pow(creature1.position.y - creature2.position.y, 2) + Math.pow(creature1.position.x - creature2.position.x, 2));
}

setAiAction = function(creature) {
	// console.log("Setting AI action...");
	if(!creature.vars.suspended) {
		switch(creature.ai.type) {

			case EnumAi.GREEN_GOBLIN: {
				switch(creature.ai.nextAction) {
					case 0: {
						//	Next action not specified
						if(getPlayerDistance(creature) < creature.weapon.attack.reach * 3 && creature.hasClearPathToPlayer()) {					//	If player is within 3x attack reach...
							var direction = getPlayerDirection(creature);
							ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, Math.PI / 8);	//	...attack in player's general direction...
							creature.ai.nextAction = 1;															//	...and set next action to 1.
						} else {
							var action = Math.floor(Math.random() * 3);											//	Otherwise, randomly choose to...
							if(action < 2) {
								ai.rest(creature, 500, 250);													//	...rest...
							} else {
								ai.moveRandomVector(creature, 1500, 100, 1);									//	...or move in a random direction.
							}
							creature.ai.nextAction = 0;
						}
						break;
					}
					case 1: {
						ai.moveAwayFromPlayer(creature, 0, 500, 1);											//	...move away from player for 500ms, at 1x speed
						creature.ai.nextAction = 0;
						break;
					}
					case 2: {
						ai.moveAwayFromPlayer(creature, 0, 500, 2);											//	...move away from player for 500ms, at 1x speed
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.MINI_GHOST: {
				switch(creature.ai.nextAction) {
					case 0: {
						creature.vars.touchDamage = true;
						ai.moveRandomVector(creature, 2500, 300, 1);
						break;
					}
					case 1: {				//	Fade out
						creature.vars.invisible = true;
						if(creature.vars.facingRight) {
							ai.moveRandomVector(creature, 0, 500, 1, 6);
						} else {
							ai.moveRandomVector(creature, 0, 500, 1, 7);
						}
						creature.ai.nextAction = 2;
						break;
					}
					case 2: {				//	Move while invisible
						ai.moveRandomVector(creature, 0, 10000, 1, 10);
						var rand = Math.floor(Math.random() * 10);
						if(rand < 1) {
							creature.ai.nextAction = 3;
						}
						break;
					}
					case 3: {
						creature.vars.invisible = false;
						if(creature.vars.facingRight) {
							ai.moveRandomVector(creature, 0, 500, 1, 8);
						} else {
							ai.moveRandomVector(creature, 0, 500, 1, 9);
						}
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.SKELTON: {
				if(creature.weapon) {
					creature.weapon.vars.hidden = false;													//	Show weapon for Ambush Skeltons once they have animated
				}
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE * 5 && creature.hasClearPathToPlayer()) {
							var action = Math.floor(Math.random() * 4)
							if(action < 3) {
								ai.moveTowardsPlayer(creature, 300, 350, 2);
								creature.ai.nextAction = 1;
							} else {
								ai.moveRandomVector(creature, 300, 350, 2);
							}
						} else {
							var action = Math.floor(Math.random() * 2);
							if(action < 1) {
								ai.moveRandomVector(creature, 1000, 500, 1);
							} else {
								ai.rest(creature, 1000, 500);
							}
						}
						break;				
					}
					case 1: {
						var direction = getPlayerCompassDirection(creature);
						ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, 0);					//	...attack in player's compass direction...
						creature.ai.nextAction = 2;
						break;
					}
					case 2: {
						ai.rest(creature, 1000, 500);
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {
						var rand = Math.floor(Math.random() * 3);
						if(rand < 1) {
							ai.moveAwayFromPlayer(creature, 500, 500, 2);									//	...move away from player for 0.5 - 1s, at 2x speed
							creature.ai.nextAction = 0;
						} else if(rand < 2) {
							ai.moveRandomVector(creature, 500, 500, 2);										//	...move away from player for 0.5 - 1s, at 2x speed
							creature.ai.nextAction = 0;
						} else {
							ai.rest(creature, 500, 0);
							creature.ai.nextAction = 1;
						}
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.SKELTON_ARCHER: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE * 8 && creature.hasClearPathToPlayer()) {
							var action = Math.floor(Math.random() * 4)
							if(action < 3) {
								ai.moveAwayFromPlayer(creature, 300, 350, 1);
								creature.ai.nextAction = 1;
							} else {
								ai.moveRandomVector(creature, 300, 350, 2);
							}
						} else {
							var action = Math.floor(Math.random() * 2);
							if(action < 1) {
								ai.moveRandomVector(creature, 1000, 500, 1);
							} else {
								ai.rest(creature, 1000, 500);
							}
						}
						break;				
					}
					case 1: {
						var direction = getPlayerCompassDirection(creature);
						ai.aim(creature, 0, creature.weapon.vars.aimTime, direction, Math.PI / 8);					//	...attack in player's compass direction...
						creature.ai.nextAction = 4;
						break;
					}
					case 2: {
						ai.rest(creature, 1000, 500);
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {
						var rand = Math.floor(Math.random() * 3);
						if(rand < 1) {
							ai.moveAwayFromPlayer(creature, 500, 500, 2);									//	...move away from player for 0.5 - 1s, at 2x speed
							creature.ai.nextAction = 0;
						} else if(rand < 2) {
							ai.moveRandomVector(creature, 500, 500, 2);										//	...move away from player for 0.5 - 1s, at 2x speed
							creature.ai.nextAction = 0;
						} else {
							ai.rest(creature, 200, 0);
							creature.ai.nextAction = 1;
						}
						break;
					}
					case 4: {
						ai.attack(creature, 0, creature.weapon.vars.attackRate, creature.vars.aimDirection, 0);
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.SNEAKY_SKELTON: {
				switch(creature.ai.nextAction) {
					case 0: {
						creature.weapon.vars.hidden = true;
						creature.vars.animation = 6;
						if(getPlayerDistance(creature) < TILE_SIZE * 2.5 && creature.hasClearPathToPlayer()) {
							ai.rest(creature, 0, 100, 6);
							creature.ai.nextAction = 1;
						} else {
							ai.rest(creature, 0, 200, 6);
						}
						break;
					}
					case 1: {
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
						ai.rest(creature, 0, 600, 4);
						creature.ai.type = EnumAi.SKELTON;
						creature.ai.nextAction = 1;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.MUMI: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE * 3.5 && creature.hasClearPathToPlayer()) {
							var action = Math.floor(Math.random() * 4)
							if(action < 3) {
								ai.moveTowardsPlayer(creature, 300, 350, 1.5);
								creature.ai.nextAction = 1;
							} else {
								ai.moveRandomVector(creature, 300, 350, 1.5);
							}
						} else {
							var action = Math.floor(Math.random() * 2);
							if(action < 1) {
								ai.moveRandomVector(creature, 1000, 500, 1);
							} else {
								ai.rest(creature, 1000, 500);
							}
						}
						break;				
					}
					case 1: {
						var direction = getPlayerCompassDirection(creature);
						ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, 0);					//	...attack in player's compass direction...
						var rand = Math.floor(Math.random() * 3);
						if(rand < 2) {
							creature.ai.nextAction = 4;
						} else {
							creature.ai.nextAction = 2;
						}
						break;
					}
					case 2: {
						ai.rest(creature, 1000, 500);
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {
						var rand = Math.floor(Math.random() * 4);
						if(rand < 2) {
							ai.moveAwayFromPlayer(creature, 500, 500, 1.5);									//	...move away from player for 0.5 - 1s, at 2x speed
							creature.ai.nextAction = 0;
						} else if(rand < 3) {
							ai.rest(creature, 250, 250);
							creature.ai.nextAction = 1;
						} else {
							ai.moveRandomVector(creature, 500, 500, 1.5);										//	...move away from player for 0.5 - 1s, at 2x speed
							creature.ai.nextAction = 0;
						}
						break;
					}
					case 4: {
						ai.moveTowardsPlayer(creature, 0, 200, 1.5);
						creature.ai.nextAction = 1;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.GREEN_SLUDGIE: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) > TILE_SIZE * 5) {
							ai.rest(creature, 1000, 500);
						} else {
							var action = Math.floor(Math.random() * 2);
							if(action < 1) {
								creature.vars.touchDamage = true;				//	Set to cause touch damage when moving
								ai.moveRandomVector(creature, 0, 1000, 1);
								creature.ai.nextAction = 1;
							} else {
								ai.rest(creature, 1000, 500);
							}
						}
						break;
					}
					case 1: {
						ai.rest(creature, 0, 1000);
						creature.ai.nextAction = 0;
						break;
					}
					case 2: {
						creature.vars.touchDamage = true;
						ai.moveAwayFromPlayer(creature, 0, 1000, 1);
						creature.ai.nextAction = 1;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.CAMP_VAMP: {
				switch(creature.ai.nextAction) {
					case 0: {
						creature.weapon.vars.hidden = false;											//	Redisplay dagger if hidden while flying
						if(getPlayerDistance(creature) < TILE_SIZE * 6 && creature.hasClearPathToPlayer()) {
							ai.moveTowardsPlayer(creature, 300, 350, 2);
							creature.ai.nextAction = 1;
						} else {
							var action = Math.floor(Math.random() * 3);
							if(action < 1) {
								ai.rest(creature, 500, 500);
							} else {
								ai.moveRandomVector(creature, 500, 500, 1);
							}
							creature.ai.nextAction = 0;
						}
						break;
					}
					case 1: {
						var direction = getPlayerCompassDirection(creature);
						ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, 0);		//	...attack in player's compass direction...
						creature.ai.nextAction = 2;
						break;
					}
					case 2: {
						ai.moveAwayFromPlayer(creature, 500, 500, 2);
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {				//	Transform into bat!
						creature.vars.transformEndTime = performance.now() + 2000 + Math.random() * 8000;	//	Set transformation duration
						ai.moveAwayFromPlayer(creature, 0, creature.sprite.animations[6][0], 1.5);			//	Set AI timing to last for duration of transformation animation
						creature.vars.animation = 6;														//	Transform to bat
						creature.ai.nextAction = 4;															//	Fly as bat
						creature.vars.isBat = true;
						creature.vars.foreground = true;
						creature.weapon.vars.hidden = true;
						creature.vars.moveThroughColliders = true;
						break;
					}
					case 4: {
						if(performance.now() > creature.vars.transformEndTime) {							//	If transform time has elapsed...
								creature.vars.moveThroughColliders = false;									//	...turn collider back on and check that it does not collide with any other...
							if(!creature.checkIfCollides()) {
								creature.ai.nextAction = 5;													//	...if it does not, set next action to be transform back from bat
								clearAiAction(creature);
							} else {
								creature.vars.transformEndTime += 200;										//	If it *does* collide, extend anim by another 200 ms and continue random movement
								creature.vars.moveThroughColliders = true;
								var action = Math.floor(Math.random() * 2);
								if(action < 1) {
									ai.moveAwayFromPlayer(creature, 200, 50, 3.5);
								} else {
									ai.moveRandomVector(creature, 200, 50, 3.5);
								}
								creature.vars.animation = 8;					//	Bat flying animation
							}
						} else {
							var action = Math.floor(Math.random() * 3);
							if(action < 1) {
								ai.moveAwayFromPlayer(creature, 200, 50, 3.5);
								creature.vars.animation = 8;					//	Bat flying animation
							} else {
								ai.moveRandomVector(creature, 200, 50, 3.5);
								creature.vars.animation = 8;					//	Bat flying animation
							}
						}
						break;
					}
					case 5: {
						ai.rest(creature, 0, creature.sprite.animations[7][0]);			//	Set AI timing to last for duration of transformation animation
						creature.vars.animation = 7;									//	Transform back to vamp
						creature.ai.nextAction = 0;
						creature.vars.foreground = false;
						creature.vars.isBat = false;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.URK: {
				switch(creature.ai.nextAction) {
					case 0: {
						//	Next action not specified
						if(getPlayerDistance(creature) < creature.weapon.attack.reach * 3 && creature.hasClearPathToPlayer()) {						//	If player is within 3x attack reach...
							var action = Math.floor(Math.random() * 2);
							var direction = getPlayerDirection(creature);
							if(action < 1) {
								ai.moveTowardsPlayer(creature, 250, 250, 1.5);
								creature.ai.nextAction = 3;
							} else {
								ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, Math.PI / 8);	//	...attack in player's general direction...
								creature.ai.nextAction = 1;															//	...and set next action to 1.
							}
						} else {
							var action = Math.floor(Math.random() * 4);												//	Otherwise, randomly choose to...
							if(action < 2) {
								ai.rest(creature, 500, 250);														//	...rest...
							} else if(action < 3) {
								ai.moveTowardsPlayer(creature, 250, 250, 1);
							} else {
								ai.moveRandomVector(creature, 1500, 100, 1);										//	...or move in a random direction.
							}
							creature.ai.nextAction = 0;
						}
						break;
					}
					case 1: {
						ai.rest(creature, 500, 250);																//	...rest for 250 - 750ms
						var rand = Math.floor(Math.random() * 10);
						if(rand < 1) {
							urkGrunts.play('grunt3');
						} else if(rand < 2) {
							urkGrunts.play('grunt4');
						}
						creature.ai.nextAction = 0;
						break;
					}
					case 2: {
						ai.moveAwayFromPlayer(creature, 250, 250, 1.5);												//	...move away from player for 250-500ms, at 1.5x speed
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {
						var direction = getPlayerDirection(creature);
						ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, Math.PI / 8);
						creature.ai.nextAction = 1;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.URK_VETERAN: {
				switch(creature.ai.nextAction) {
					case 0: {
						//	Next action not specified
						if(getPlayerDistance(creature) < creature.weapon.attack.reach * 2 && creature.hasClearPathToPlayer()) {						//	If player is within 3x attack reach...
							var action = Math.floor(Math.random() * 2);
							var direction = getPlayerDirection(creature);
							if(action < 1) {
								ai.moveTowardsPlayer(creature, 100, 100, 2.5);
								creature.ai.nextAction = 3;
							} else {
								ai.attack(creature, 0, creature.weapon.vars.attackRate * creature.vars.attackRate, direction, Math.PI / 8);	//	...attack in player's general direction...
								var rand = Math.floor(Math.random() * 2);
								if(rand < 1) {
									creature.ai.nextAction = 0;
								} else {
									creature.ai.nextAction = 1;
								}
							}
						} else if(getPlayerDistance(creature) < creature.weapon.attack.reach * 5 && creature.hasClearPathToPlayer()) {
							var rand = Math.floor(Math.random() * 2);
							var direction;
							if(rand < 1) {
								direction = getPlayerDirection(creature) + Math.PI / 4;
							} else {
								direction = getPlayerDirection(creature) - Math.PI / 4;
							}
							ai.moveInDirection(creature, 250, 250, 1.5, direction);
						} else {
							var action = Math.floor(Math.random() * 4);												//	Otherwise, randomly choose to...
							if(action < 2) {
								ai.rest(creature, 500, 250);														//	...rest...
							} else if(action < 3) {
								ai.moveTowardsPlayer(creature, 250, 250, 1);
							} else {
								ai.moveRandomVector(creature, 1500, 100, 1);										//	...or move in a random direction.
							}
							creature.ai.nextAction = 0;
						}
						break;
					}
					case 1: {
						ai.rest(creature, 500, 250);																//	...rest for 250 - 750ms
						var rand = Math.floor(Math.random() * 10);
						if(rand < 1) {
							urkGrunts.play('grunt3');
						} else if(rand < 2) {
							urkGrunts.play('grunt4');
						}
						creature.ai.nextAction = 0;
						break;
					}
					case 2: {
						ai.moveAwayFromPlayer(creature, 250, 250, 1.5);												//	...move away from player for 250-500ms, at 1.5x speed
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {
						var direction = getPlayerDirection(creature);
						ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, Math.PI / 8);
						if(rand < 1) {
							creature.ai.nextAction = 0;
						} else {
							creature.ai.nextAction = 1;
						}
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.URK_SHAMAN: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE * 10 && creature.hasClearPathToPlayer()) {
							var action = Math.floor(Math.random() * 4)
							if(action < 3) {
								ai.moveAwayFromPlayer(creature, 300, 350, 1);
								creature.ai.nextAction = 1;
							} else {
								ai.moveRandomVector(creature, 300, 350, 2);
							}
						} else {
							var action = Math.floor(Math.random() * 2);
							if(action < 1) {
								ai.moveRandomVector(creature, 1000, 500, 1);
							} else {
								ai.rest(creature, 1000, 500);
							}
						}
						break;				
					}
					case 1: {
						var direction = getPlayerCompassDirection(creature);
						ai.aim(creature, 0, creature.weapon.vars.aimTime, direction, 0);
						creature.ai.nextAction = 3;
						break;
					}
					case 2: {
						ai.moveAwayFromPlayer(creature, 300, 350, 2);
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {
						ai.attack(creature, 0, creature.weapon.vars.attackRate, creature.vars.aimDirection, 0);
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.HULKING_URK: {
				switch(creature.ai.nextAction) {
					case 0: {
						//	Next action not specified
						creature.weapon.vars.attackRate = 1200;														//	Reset to normal attack rate if resetting from bezerk
						creature.weapon.vars.animTime = 800;
						if(getPlayerDistance(creature) < creature.weapon.attack.reach * 3 && creature.hasClearPathToPlayer()) {						//	If player is within 3x attack reach...
							var action = Math.floor(Math.random() * 2);
							var direction = getPlayerDirection(creature);
							if(action < 1) {
								ai.moveTowardsPlayer(creature, 250, 250, 1.5);
								creature.ai.nextAction = 3;
							} else {
								ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, Math.PI / 8);	//	...attack in player's general direction...
								creature.ai.nextAction = 1;															//	...and set next action to 1.
							}
						} else {
							var action = Math.floor(Math.random() * 4);												//	Otherwise, randomly choose to...
							if(action < 3) {
								ai.rest(creature, 500, 250);														//	...rest...
							} else {
								ai.moveRandomVector(creature, 1500, 100, 1);										//	...or move in a random direction.
							}
							creature.ai.nextAction = 0;
						}
						break;
					}
					case 1: {
						ai.rest(creature, 500, 250);																//	...rest for 250 - 750ms
						creature.ai.nextAction = 0;
						break;
					}
					case 2: {
						ai.moveAwayFromPlayer(creature, 250, 250, 1.5);												//	...move away from player for 250-500ms, at 1.5x speed
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {
						var direction = getPlayerDirection(creature);
						ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, Math.PI / 8);
						creature.ai.nextAction = 1;
						break;
					}
					case 4: {																//	Bezerk!
						// creature.movement.bounceOff = true;
						creature.vars.bezerkAttacks = Math.floor(Math.random() * 5) + 5;
						creature.weapon.vars.attackRate = 200;
						creature.weapon.vars.animTime = 150;
						ai.rest(creature, 0, 600, 1);
						var direction = getPlayerDirection(creature);
						creature.setFacing(direction);
						if(creature.vars.facingRight) {
							creature.vars.animation = 6;
						} else {
							creature.vars.animation = 7;
						}
						creature.ai.nextAction = 5;
						break;
					}
					case 5: {																//	Bezerk!
						if(creature.vars.bezerkAttacks) {
							ai.moveTowardsPlayer(creature, 0, 200, 3);
							creature.ai.nextAction = 6;
						} else {
							creature.ai.nextAction = 7;
						}
						break;
					}
					case 6: {																//	Bezerk!
						var direction = getPlayerDirection(creature);
						ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, Math.PI / 8);
						creature.vars.bezerkAttacks--;
						creature.ai.nextAction = 5;
						break;
					}
					case 7: {																//	Exhausted...
						// creature.movement.bounceOff = false;
						if(creature.vars.facingRight) {
							animation = 8;
						} else {
							animation = 9;
						}
						ai.rest(creature, 3000, 3000, animation);
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.KOB: {
				switch(creature.ai.nextAction) {
					case 0: {
						//	Next action not specified
						if(getPlayerDistance(creature) < creature.weapon.attack.reach * 4 && creature.hasClearPathToPlayer()) {						//	If player is within 4x attack reach...
							var action = Math.floor(Math.random() * 2);
							var direction = getPlayerDirection(creature);
							if(action < 1) {
								ai.moveTowardsPlayer(creature, 250, 250, 1.5);
								creature.ai.nextAction = 3;
							} else {
								ai.moveAwayFromPlayer(creature, 250, 250, 1.5);
								creature.ai.nextAction = 0;															//	...and set next action to 1.
							}
						} else {
							var action = Math.floor(Math.random() * 3);												//	Otherwise, randomly choose to...
							if(action < 2) {
								ai.rest(creature, 500, 250);														//	...rest...
							} else {
								ai.moveRandomVector(creature, 1500, 100, 1);										//	...or move in a random direction.
							}
							creature.ai.nextAction = 0;
							var snd = Math.floor(Math.random() * 25);
							if(snd < 1) {
								if(creature.name === 'Kob') {
									playKobNoise();
								} else if(creature.name === 'Mini Kob') {
									playMiniKobNoise();
								} else if(creature.name === 'Giga Kob') {
									playGigaKobNoise();
								}
							}
						}
						break;
					}
					case 1: {
						ai.rest(creature, 500, 250);																//	...rest for 250 - 750ms
						creature.ai.nextAction = 0;
						break;
					}
					case 2: {
						ai.moveAwayFromPlayer(creature, 250, 250, 1.5);												//	...move away from player for 250-500ms, at 1.5x speed
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {
						var direction = getPlayerDirection(creature);
						ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, Math.PI / 8);
						creature.ai.nextAction = 2;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.ZOMBI: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE * 1 && creature.hasClearPathToPlayer()) {
							var direction = getPlayerCompassDirection(creature);
							creature.setFacing(direction);
							playZombiNoise(null, true);
							if(creature.vars.facingRight) {
								ai.attack(creature, 0, 400, direction, 0, 6);
							} else {
								ai.attack(creature, 0, 400, direction, 0, 7);
							}
						} else if(getPlayerDistance(creature) < TILE_SIZE * 10) {
							var direction = getPlayerCompassDirection(creature);
							ai.moveInDirection(creature, 0, 400, 1, direction, Math.PI / 2)
						} else {
							ai.moveRandomVector(creature, 0, 400, 1);
						}
						var snd = Math.floor(Math.random() * 10);
						if(snd < 1) {
							playZombiNoise();
						}
						break;
					}
					case 1: {
						if(creature.vars.facingRight) {
							ai.rest(creature, 0, 200, 8);
						} else {
							ai.rest(creature, 0, 200, 9);
						}
						break;
					}
					case 2: {
						console.log("Reanimating");
						if(creature.checkIfCollides()) {
							creature.ai.nextAction = 3;
						} else {
							playZombiNoise(true);
							creature.vars.moveThroughColliders = false;
							creature.vars.dead = false;
							creature.vars.currentHP = creature.vars.maxHP;
							if(creature.vars.facingRight) {
								ai.rest(creature, 0, 600, 10);
							} else {
								ai.rest(creature, 0, 600, 11);
							}
							creature.ai.nextAction = 0;
						}
						break;
					}
					case 3: {
						if(creature.vars.facingRight) {
							ai.rest(creature, 0, 200, 8);
						} else {
							ai.rest(creature, 0, 200, 9);
						}
						creature.ai.nextAction = 2;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.ZOMBI_MASTER: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE * 1.5 && creature.hasClearPathToPlayer()) {
							var direction = getPlayerDirection(creature);
							ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, 0);
							creature.ai.nextAction = 1;
						} else if(getPlayerDistance(creature) < TILE_SIZE * 3 && creature.hasClearPathToPlayer()) {
							ai.moveAwayFromPlayer(creature, 500, 500, 1.5);
							creature.ai.nextAction = 0;
						} else {
							var rand = Math.floor(Math.random() * 8);
							if(rand < 1) {
								console.log("Raising zombies!");
								game.creatures.forEach(function(zombi) {
									if(zombi.ai.type === EnumAi.ZOMBI && zombi.vars.dead && getDistance(creature, zombi) < TILE_SIZE * 10) {
										zombi.ai.nextAction = 2;
									}
								});
								ai.rest(creature, 500, 500);
							} else if(rand < 3) {
								ai.rest(creature, 500, 500);
							} else {
								ai.moveRandomVector(creature, 250, 250, 1);
							}
						}
						break;
					}
					case 1: {
						ai.moveAwayFromPlayer(creature, 500, 500, 1.5);
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.BLUE_SQUARK: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE * 2 && creature.hasClearPathToPlayer()) {
							var action = Math.floor(Math.random() * 3);
							if(action < 1) {
								creature.ai.nextAction = 1;
							} else {
								ai.moveAwayFromPlayer(creature, 500, 500, 1.5);
								creature.ai.nextAction = 0;
							}
						} else if(getPlayerDistance(creature) < TILE_SIZE * 8 && creature.hasClearPathToPlayer()) {
							var action = Math.floor(Math.random() * 4)
							if(action < 3) {
								ai.moveAwayFromPlayer(creature, 300, 350, 1);
								creature.ai.nextAction = 1;
							} else {
								ai.moveRandomVector(creature, 300, 350, 1);
							}
						} else {
							var action = Math.floor(Math.random() * 2);
							if(action < 1) {
								ai.moveRandomVector(creature, 1000, 500, 1);
							} else {
								ai.rest(creature, 1000, 500);
							}
						}
						break;				
					}
					case 1: {
						var direction = getPlayerCompassDirection(creature);
						ai.aim(creature, 0, creature.weapon.vars.aimTime, direction, Math.PI / 16);
						creature.ai.nextAction = 4;
						break;
					}
					case 2: {
						ai.moveAwayFromPlayer(creature, 500, 500, 1.5);
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {
						var rand = Math.floor(Math.random() * 3);
						if(rand < 1) {
							ai.moveAwayFromPlayer(creature, 500, 500, 1.5);
							creature.ai.nextAction = 0;
						} else if(rand < 2) {
							ai.moveRandomVector(creature, 500, 500, 1);
							creature.ai.nextAction = 0;
						} else {
							ai.rest(creature, 200, 0);
							creature.ai.nextAction = 1;
						}
						break;
					}
					case 4: {
						ai.attack(creature, 0, creature.weapon.vars.attackRate, creature.vars.aimDirection, 0);
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.BLACK_KNIGHT: {
				switch(creature.ai.nextAction) {
					case 0: {
						//	Next action not specified
						if(getPlayerDistance(creature) < creature.weapon.attack.reach * 2.5 && creature.hasClearPathToPlayer()) {						//	If player is within 3x attack reach...
							var action = Math.floor(Math.random() * 2);
							var direction = getPlayerDirection(creature);
							if(action < 1) {
								ai.moveTowardsPlayer(creature, 100, 100, 2);
								creature.ai.nextAction = 3;
							} else {
								ai.attack(creature, 0, creature.weapon.vars.attackRate * creature.vars.attackRate, direction, Math.PI / 8);	//	...attack in player's general direction...
								var rand = Math.floor(Math.random() * 2);
								if(rand < 1) {
									creature.ai.nextAction = 0;
								} else {
									creature.ai.nextAction = 1;
								}
							}
						} else if(getPlayerDistance(creature) < creature.weapon.attack.reach * 6 && creature.hasClearPathToPlayer()) {
							var rand = Math.floor(Math.random() * 2);
							var direction;
							if(rand < 1) {
								direction = getPlayerDirection(creature) + Math.PI / 4;
							} else {
								direction = getPlayerDirection(creature) - Math.PI / 4;
							}
							ai.moveInDirection(creature, 250, 250, 1.5, direction);
						} else {
							var action = Math.floor(Math.random() * 4);												//	Otherwise, randomly choose to...
							if(action < 2) {
								ai.rest(creature, 500, 250);														//	...rest...
							} else if(action < 3) {
								ai.moveTowardsPlayer(creature, 250, 250, 1);
							} else {
								ai.moveRandomVector(creature, 1500, 100, 1);										//	...or move in a random direction.
							}
							creature.ai.nextAction = 0;
						}
						break;
					}
					case 1: {
						ai.rest(creature, 500, 250);																//	...rest for 250 - 750ms
						creature.ai.nextAction = 0;
						break;
					}
					case 2: {
						delete creature.weapon.vars.rotation;
						creature.weapon.vars.endAttackAnimationTime = performance.now() - 1;
						creature.weapon.vars.attacking = false;
						creature.weapon.sprite.attackPositionOffset.y = TILE_SIZE * 8/16;
						ai.moveAwayFromPlayer(creature, 250, 250, 1.5);												//	...move away from player for 250-500ms, at 1.5x speed
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {
						var direction = getPlayerDirection(creature);
						ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, Math.PI / 8);
						var rand = Math.floor(Math.random() * 6);
						if(rand < 1) {
							creature.ai.nextAction = 0;
						} else if(rand < 3) {
							creature.ai.nextAction = 2;
						} else {
							creature.ai.nextAction = 4;
						}
						break;
					}
					case 4: {
						ai.rest(creature, 500, 1750);			
						creature.weapon.vars.attacking = true;
						creature.weapon.vars.endAttackAnimationTime = performance.now() + 3000;
						creature.weapon.sprite.attackPositionOffset.y = TILE_SIZE * 12/16;
						if(creature.vars.facingRight) {
							creature.weapon.vars.rotation = Math.PI / 2;
						} else {
							creature.weapon.vars.rotation = 3 * Math.PI / 2;
						}
						creature.ai.nextAction = 2;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}
 
			case EnumAi.BLACK_WIZ: {
				switch(creature.ai.nextAction) {
					case 0: {
						//	Next action not specified
						if(creature.checkIfCollides()) {
							creature.ai.nextAction = 4;
						} else if(getPlayerDistance(creature) < TILE_SIZE * 2 && performance.now() > creature.vars.nextTeleportTime) {
							creature.ai.nextAction = 4;
						} else {
							var action = Math.floor(Math.random() * 3);
							if(action < 1) {
								ai.moveRandomVector(creature, 500, 500, 1);
							} else if(action < 2) {
								ai.moveAwayFromPlayer(creature, 500, 500, 1);
							} else {		//	Cast a spell
								if(creature.vars.summoned < creature.vars.maxImps) {
									if(creature.vars.facingRight) {
										ai.rest(creature, 0, 600, 6);
									} else {
										ai.rest(creature, 0, 600, 7);
									}
									creature.ai.nextAction = 5;
								} else if(creature.hasClearPathToPlayer()) {
									if(creature.vars.facingRight) {
										ai.rest(creature, 0, 600, 6);
									} else {
										ai.rest(creature, 0, 600, 7);
									}
									creature.ai.nextAction = 3;
								} else {
									ai.moveRandomVector(creature, 500, 500, 1);
								}
							}
						}
						break;
					}
					case 1: {	//	Reappear
						var direction = getPlayerCompassDirection(creature);
						ai.teleportAwayFromPlayer(creature);
						ai.rest(creature, 0, 150, 10);
						creature.ai.nextAction = 2;
						break;
					}
					case 2: {	//	Rest
						ai.rest(creature, 0, 500, 0);
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {	//	Shoot lightning
						var direction = getPlayerDirection(creature);
						ai.attack(creature, 0, 1000, direction, Math.PI / 16);	
						creature.ai.nextAction = 0;
						break;
					}
					case 4: {	//	Teleport
						var snd = Math.floor(Math.random() * 2);
						if(snd < 1) {
							creatureSounds1.play('teleport1');
						} else {
							creatureSounds1.play('teleport2');
						}
						ai.rest(creature, 0, 150, 8);
						creature.ai.nextAction = 1;
						break;
					}
					case 5: {	//	Summon Black Imp
						summon(creature, EnumCreature.BLACK_IMP);
						creature.ai.nextAction = 2;
						break;
					}
					default: {
						break;
					}
				} break;
			}

			case EnumAi.RED_WIZ: {
				switch(creature.ai.nextAction) {
					case 0: {
						//	Next action not specified
						if(creature.checkIfCollides()) {
							creature.ai.nextAction = 4;
						} else if(getPlayerDistance(creature) < TILE_SIZE * 2 && performance.now() > creature.vars.nextTeleportTime) {
							creature.ai.nextAction = 4;
						} else {
							var action = Math.floor(Math.random() * 3);
							if(action < 1) {
								ai.moveRandomVector(creature, 500, 500, 1);
							} else if(action < 2) {
								ai.moveAwayFromPlayer(creature, 500, 500, 1);
							} else {		//	Cast a spell
								if(creature.vars.hasGrimlin && creature.vars.summoned < creature.vars.maxElementals) {
									if(creature.vars.facingRight) {
										ai.rest(creature, 0, 600, 6);
									} else {
										ai.rest(creature, 0, 600, 7);
									}
									creature.ai.nextAction = 5;
								} else if(creature.hasClearPathToPlayer()) {
									if(creature.vars.facingRight) {
										ai.rest(creature, 0, 600, 6);
									} else {
										ai.rest(creature, 0, 600, 7);
									}
									creature.ai.nextAction = 3;
								} else {
									ai.moveRandomVector(creature, 500, 500, 1);
								}
							}
						}
						break;
					}
					case 1: {	//	Reappear
						var direction = getPlayerCompassDirection(creature);
						ai.teleportAwayFromPlayer(creature);
						ai.rest(creature, 0, 150, 10);
						creature.ai.nextAction = 2;
						break;
					}
					case 2: {	//	Rest
						ai.rest(creature, 0, 500, 0);
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {	//	Shoot fireballs
						var direction = getPlayerDirection(creature);
						ai.attack(creature, 0, 1000, direction, Math.PI / 16);	
						creature.ai.nextAction = 0;
						break;
					}
					case 4: {	//	Teleport
						var snd = Math.floor(Math.random() * 2);
						if(snd < 1) {
							creatureSounds1.play('teleport1');
						} else {
							creatureSounds1.play('teleport2');
						}
						ai.rest(creature, 0, 150, 8);
						creature.ai.nextAction = 1;
						break;
					}
					case 5: {	//	Summon Fire Elemental
						summon(creature, EnumCreature.FIRE_ELEMENTAL);
						creature.ai.nextAction = 2;
						break;
					}
					default: {
						break;
					}
				} break;
			}

			case EnumAi.BLACK_IMP: {
				switch(creature.ai.nextAction) {
					case 0: {
						ai.rest(creature, 0, 400, 8);
						creature.ai.nextAction = 1;
						break;
					}
					case 1: {
						if(getPlayerDistance(creature) < TILE_SIZE * 1 && creature.hasClearPathToPlayer()) {
							var direction = getPlayerCompassDirection(creature);
							creature.setFacing(direction);
							if(creature.vars.facingRight) {
								ai.attack(creature, 0, 400, direction, 0, 6);
							} else {
								ai.attack(creature, 0, 400, direction, 0, 7);
							}
						} else if(getPlayerDistance(creature) < TILE_SIZE * 10 && creature.hasClearPathToPlayer()) {
							var direction = getPlayerCompassDirection(creature);
							ai.moveInDirection(creature, 0, 400, 1, direction, Math.PI / 2)
						} else {
							ai.moveRandomVector(creature, 0, 400, 1);
						}
						break;
					}
					default: {
						break;
					}
				}
				break;
			}


			case EnumAi.RED_IMP: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE * 3 && creature.hasClearPathToPlayer()) {
							ai.moveAwayFromPlayer(creature, 0, 400, 1.5);
						} else {
							ai.moveRandomVector(creature, 0, 400, 1);
						}
						break;
					}
					case 1: {
						ai.moveAwayFromPlayer(creature, 0, 400, 1.5);
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.GRIMLIN: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE * 2 && creature.hasClearPathToPlayer()) {
							var direction = getPlayerDirection(creature);
							creature.setFacing(direction);
							playGrimlinNoise(null, true);
							if(creature.vars.facingRight) {
								ai.attack(creature, 0, 400, direction, Math.PI / 8, 6);	//	...attack in player's general direction...
							} else {
								ai.attack(creature, 0, 400, direction, Math.PI / 8, 7);	//	...attack in player's general direction...
							}
						} else if(getPlayerDistance(creature) < TILE_SIZE * 4 && creature.hasClearPathToPlayer()) {
							ai.moveAwayFromPlayer(creature, 0, 400, 1.5);
						} else {
							var action = Math.floor(Math.random() * 3);
							if(action < 1) {
								ai.moveRandomVector(creature, 0, 400, 1);
							} else {
								ai.rest(creature, 400, 400);
							}
						}
						break;
					}
					case 1: {
						ai.moveAwayFromPlayer(creature, 0, 400, 1.5);
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.ELEMENTAL: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE * 7 && creature.hasClearPathToPlayer()) {
							var action = Math.floor(Math.random() * 4)
							if(action < 3) {
								ai.moveAwayFromPlayer(creature, 250, 250, 1);
								creature.ai.nextAction = 1;
							} else {
								ai.moveRandomVector(creature, 250, 250, 2);
							}
						} else {
							ai.moveRandomVector(creature, 250, 250, 1);
						}
						break;				
					}
					case 1: {
						var direction = getPlayerCompassDirection(creature);
						creature.setFacing(direction);
						if(creature.vars.facingRight) {
							ai.aim(creature, 0, creature.weapon.vars.aimTime, direction, 0, 6);
						} else {
							ai.aim(creature, 0, creature.weapon.vars.aimTime, direction, 0, 7);
						}
						creature.ai.nextAction = 3;
						break;
					}
					case 2: {
						ai.moveAwayFromPlayer(creature, 250, 250, 5);
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {
						ai.attack(creature, 0, creature.weapon.vars.attackRate, creature.vars.aimDirection, 0);
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.YELLOW_SLUDGIE: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) > TILE_SIZE * 6) {
							ai.rest(creature, 500, 500);
						} else {
							var action = Math.floor(Math.random() * 2);
							if(action < 1 && creature.hasClearPathToPlayer()) {
								creature.vars.touchDamage = true;				//	Set to cause touch damage when moving
								ai.moveTowardsPlayer(creature, 0, 1000, 1);
								creature.ai.nextAction = 1;
							} else {
								ai.rest(creature, 500, 500);
							}
						}
						break;
					}
					case 1: {
						ai.rest(creature, 0, 500);
						creature.ai.nextAction = 0;
						break;
					}
					case 2: {
						creature.vars.touchDamage = true;
						ai.moveAwayFromPlayer(creature, 0, 1000, 1);
						creature.ai.nextAction = 1;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.GREY_GOBLIN: {
				switch(creature.ai.nextAction) {
					case 0: {
						//	Next action not specified
						if(getPlayerDistance(creature) < creature.weapon.attack.reach * 2 && creature.hasClearPathToPlayer()) {					//	If player is within 3x attack reach...
							var direction = getPlayerDirection(creature);
							ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, Math.PI / 8);	//	...attack in player's general direction...
							creature.ai.nextAction = 1;															//	...and set next action to 1.
						} else if(getPlayerDistance(creature) < creature.weapon.attack.reach * 4 && creature.hasClearPathToPlayer()) {
							ai.moveTowardsPlayer(creature, 0, 200, 2);
						} else {							
							var action = Math.floor(Math.random() * 3);											//	Otherwise, randomly choose to...
							if(action < 2) {
								ai.rest(creature, 500, 250);													//	...rest...
							} else {
								ai.moveRandomVector(creature, 1500, 100, 1);									//	...or move in a random direction.
							}
							creature.ai.nextAction = 0;
						}
						break;
					}
					case 1: {
						ai.moveAwayFromPlayer(creature, 0, 500, 1);											//	...move away from player for 500ms, at 1x speed
						creature.ai.nextAction = 0;
						break;
					}
					case 2: {
						ai.moveAwayFromPlayer(creature, 0, 500, 2);											//	...move away from player for 500ms, at 1x speed
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.BADBUG: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE && creature.hasClearPathToPlayer()) {
							var direction = getPlayerDirection(creature);
							creature.setFacing(direction);
							if(creature.vars.facingRight) {
								ai.attack(creature, 0, 400, direction, Math.PI / 8, 6);	//	...attack in player's general direction...
							} else {
								ai.attack(creature, 0, 400, direction, Math.PI / 8, 7);	//	...attack in player's general direction...
							}
						} else {
							var action = Math.floor(Math.random() * 3);
							if(action < 1) {
								playBadbugNoise(true);
								ai.moveRandomVector(creature, 0, 400, 1);
							} else {
								ai.rest(creature, 0, 400);
							}
						}
						break;
					}
					case 1: {
						game.creatures.forEach(function(creature2) {
							if(creature2 !== creature && creature2.name === "Badbug") {
								clearAiAction(creature2);
								creature2.ai.nextAction = 2;
							}
						});
						playBadbugNoise(true);
						ai.moveAwayFromPlayer(creature, 0, 400, 1.5);
						creature.ai.nextAction = 0;
						break;
					}
					case 2: {
						playBadbugNoise(true);
						ai.moveTowardsPlayer(creature, 400, 400, 1.5);
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.WRONGWRAITH: {
				switch(creature.ai.nextAction) {
					case 0: {
						if(getPlayerDistance(creature) < TILE_SIZE * 8 && creature.hasClearPathToPlayer()) {
							ai.moveTowardsPlayer(creature, 0, 200, 1);
						} else {
							ai.moveRandomVector(creature, 0, 200, 1);
						}
						break;
					}
					case 1: {
						// debugger;
						if(creature.vars.facingRight) {
							ai.moveAwayFromPlayer(creature, 0, 600, 3, 6);
						} else {
							ai.moveAwayFromPlayer(creature, 0, 600, 3, 7);
						}
						creature.ai.nextAction = 0;
						break;						
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.DEEMON: {
				switch(creature.ai.nextAction) {
					case 0: {
						ai.rest(creature, 0, 100, 10);		//	Stay invisible
						break;
					}
					case 1: {
						creatureSounds1.play('summonImp')
						var rand = Math.floor(Math.random() * 2);
						if(rand < 1) {
							ai.rest(creature, 0, 400, 8);		//	Reappear facing R
						} else {
							ai.rest(creature, 0, 400, 9);		//	Reappear facing L
						}
						creature.ai.nextAction = 2;
						break;
					}
					case 2: {
						if(getPlayerDistance(creature) < TILE_SIZE * 1 && creature.hasClearPathToPlayer()) {
							var direction = getPlayerCompassDirection(creature);
							creature.setFacing(direction);
							if(creature.vars.facingRight) {
								ai.attack(creature, 0, 400, direction, 0, 6);
							} else {
								ai.attack(creature, 0, 400, direction, 0, 7);
							}
						} else if(getPlayerDistance(creature) < TILE_SIZE * 10) {
							var direction = getPlayerCompassDirection(creature);
							ai.moveInDirection(creature, 0, 400, 1, direction, Math.PI / 2)
						} else {
							ai.moveRandomVector(creature, 0, 400, 1);
						}
						break;
					}
					case 3: {
						if(creature.vars.facingRight) {
							ai.rest(creature, 0, 200, 8);
						} else {
							ai.rest(creature, 0, 200, 9);
						}
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.BARON: {
				switch(creature.ai.nextAction) {
					case 0: {
						ai.rest(creature, 0, 400);
						break;
					}
					case 1: {
						//	Next action not specified
						if(getPlayerDistance(creature) < creature.weapon.attack.reach * 2 && creature.hasClearPathToPlayer()) {						//	If player is within 3x attack reach...
							ai.moveTowardsPlayer(creature, 100, 100, 2.5);
							creature.ai.nextAction = 3;
						} else {
							var rand = Math.floor(Math.random() * 2);
							var direction;
							if(rand < 1) {
								direction = getPlayerDirection(creature) + Math.PI / 4;
							} else {
								direction = getPlayerDirection(creature) - Math.PI / 4;
							}
							ai.moveInDirection(creature, 250, 250, 1, direction);
						}
						break;
					}
					case 2: {
						ai.moveAwayFromPlayer(creature, 250, 250, 1.5);												//	...move away from player for 250-500ms, at 1.5x speed
						creature.ai.nextAction = 1;
						break;
					}
					case 3: {
						var direction = getPlayerDirection(creature);
						ai.attack(creature, 0, creature.weapon.vars.attackRate, direction, Math.PI / 8);
						if(rand < 1) {
							creature.ai.nextAction = 1;
						} else {
							creature.ai.nextAction = 2;
						}
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.BARON_ORB: {
				switch(creature.ai.nextAction) {
					case 0: {
						ai.rest(creature, 0, 4000);
						break;
					}
					case 1: {
						ai.rest(creature, 0, 600, 4);
						creature.ai.nextAction = 2;
						break;
					}
					case 2: {
						ai.rest(creature, 0, 1000, 6);
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.ROCKO: {
				switch(creature.ai.nextAction) {
					case 0: {
						//	Next action not specified
						if(getPlayerDistance(creature) < creature.weapon.attack.reach * 3 && creature.hasClearPathToPlayer()) {						//	If player is within 3x attack reach...
							ai.moveTowardsPlayer(creature, 250, 250, 3);
							creature.ai.nextAction = 3;
						} else {
							var action = Math.floor(Math.random() * 4);												//	Otherwise, randomly choose to...
							if(action < 2) {
								ai.rest(creature, 500, 250);														//	...rest...
							} else if(action < 3) {
								ai.moveTowardsPlayer(creature, 250, 250, 1);
							} else {
								ai.moveRandomVector(creature, 1500, 100, 2);										//	...or move in a random direction.
							}
							creature.ai.nextAction = 0;
						}
						break;
					}
					case 1: {
						ai.rest(creature, 500, 250);																//	...rest for 250 - 750ms
						creature.ai.nextAction = 0;
						break;
					}
					case 2: {
						ai.moveAwayFromPlayer(creature, 250, 250, 2);												//	...move away from player for 250-500ms, at 1.5x speed
						creature.ai.nextAction = 0;
						break;
					}
					case 3: {
						var direction = getPlayerDirection(creature);
						creature.setFacing(direction);							
						if(creature.vars.facingRight) {
							ai.attack(creature, 0, 800, direction, Math.PI / 8, 6);
						} else {
							ai.attack(creature, 0, 800, direction, Math.PI / 8, 7);
						}
						var action = Math.floor(Math.random() * 5);
						if(action < 1) {
							creature.ai.nextAction = 1;
						} else if(action < 2) {
							creature.ai.nextAction = 2;
						} else if(action < 3) {
							creature.ai.nextAction = 0;
						} else {
							creature.ai.nextAction = 3;
						}
						break;
					}
					default: {
						break;
					}
				}
				break;
			}

			case EnumAi.PEBBL: {
				switch(creature.ai.nextAction) {
					case 0: {
						creature.vars.touchDamage = false;
						if(getPlayerDistance(creature) < TILE_SIZE * 5 && creature.hasClearPathToPlayer()) {
							var action = Math.floor(Math.random() * 3);
							if(action < 1) {
								creature.vars.touchDamage = true;	
								playPebblNoise();
								var direction = getPlayerDirection(creature);
								creature.setFacing(direction);							
								if(creature.vars.facingRight) {
									ai.moveTowardsPlayer(creature, 0, 500, 3, 6);
								} else {
									ai.moveTowardsPlayer(creature, 0, 500, 3, 7);
								}
								creature.ai.nextAction = 2;
							} else {
								var action = Math.floor(Math.random() * 2);
								if(action < 1) {
									ai.rest(creature, 0, 500);
								} else {
									ai.moveRandomVector(creature, 0, 750, 1);
								}
								creature.ai.nextAction = 0;
							}
						} else {
							var action = Math.floor(Math.random() * 2);
							if(action < 1) {
								ai.rest(creature, 0, 500);
							} else {
								ai.moveRandomVector(creature, 0, 750, 1);
							}
							creature.ai.nextAction = 0;
						}
						break;
					}
					case 1: {
						ai.moveAwayFromPlayer(creature, 500, 500, 2);
						creature.ai.nextAction = 0;
						break;
					}
					case 2: {
						creature.vars.touchDamage = false;
						ai.rest(creature, 0, 1000);
						creature.ai.nextAction = 0;
						break;
					}
					default: {
						break;
					}
				}
				break;
			}


			default: {
				break;
			}
		}
	}
}



setAiTiming = function(creature, duration) {
	creature.ai.startTime = performance.now();
	creature.ai.endTime = performance.now() + duration;
	creature.vars.animStart = performance.now();
	creature.vars.animEnd = performance.now() + duration;
}
clearAiAction = function(creature) {
	creature.ai.endTime = performance.now();
}

summon = function(summoner, newCreature) {
	var foundSpace = false;
	var tries = 10;
	var summonX, summonY;

	while(!foundSpace && tries) {
		foundSpace = false;
		var summonX = summoner.grid.x + (Math.floor(Math.random() * 3) - 1);
		var summonY = summoner.grid.y + (Math.floor(Math.random() * 3) - 1);
		if(
			!((summonX <= player.grid.x + 1 && summonX >= player.grid.x-1) && (summonY <= player.grid.y + 1 && summonY >= player.grid.y-1)) &&
			level.terrainArray[summonY][summonX] === 0 && level.obstacleArray[summonY][summonX] === undefined
		) {
			foundSpace = true;
			game.drawables.forEach(function(drawable) {
				if(drawable.grid.x === summonX && drawable.grid.y === summonY) {
					foundSpace = false;
				}
			});
		}
		tries--;
	}
	if(foundSpace) {
		var summoned = new Creature(creatureTemplates[newCreature]);
		summoned.summoner = summoner;
		summoned.vars.score = 0;
		summoned.position.x = summonX * TILE_SIZE + TILE_SIZE / 2;
		summoned.position.y = summonY * TILE_SIZE + TILE_SIZE / 2;
		summoned.grid.x = summonX;
		summoned.grid.y = summonY;
		summoned.updateBox();
		summoned.type = newCreature;
		if(!summoned.checkIfCollides()) {
			summoner.vars.summoned ++;
			if(summoned.name === "Black Imp") {
				creatureSounds1.play('summonImp')
			} else if(summoned.name === "Fire Elemental") {
				creatureSounds1.play('summonElemental')
			}
			game.creatures.push(summoned);
		}
	}
}

var ai = {
	rest: function(creature, duration_factor, duration_min, animation) {
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.speed = 0;
		if(animation) {
			creature.vars.animation = animation;
		} else {
			if(creature.vars.facingRight) {
				creature.vars.animation = EnumState.RESTING_R;
			} else {
				creature.vars.animation = EnumState.RESTING_L;
			}
		}
	},
	aim: function(creature, duration_factor, duration_min, direction, accuracy, animation) {
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.speed = 0;
		direction += Math.random() * accuracy;
		direction -= Math.random() * accuracy;
		creature.aim(direction);
		creature.vars.aimDirection = direction;
		if(animation) {
			creature.vars.animation = animation;
		} else {
			if(creature.vars.facingRight) {
				creature.vars.animation = EnumState.RESTING_R;
			} else {
				creature.vars.animation = EnumState.RESTING_L;
			}
		}
	},
	attack: function(creature, duration_factor, duration_min, direction, accuracy, animation) {
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.speed = 0;
		direction += Math.random() * accuracy;
		direction -= Math.random() * accuracy;
		creature.attack(direction);
		if(animation) {
			creature.vars.animation = animation;
		} else {
			if(creature.vars.facingRight) {
				creature.vars.animation = EnumState.RESTING_R;
			} else {
				creature.vars.animation = EnumState.RESTING_L;
			}
		}
	},
	moveRandomVector: function(creature, duration_factor, duration_min, speed_multiplier, animation) {
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.direction = Math.random() * Math.PI * 2;
		creature.movement.speed = creature.vars.speed * speed_multiplier;
		creature.setFacing(creature.movement.direction);
		if(animation) {
			creature.vars.animation = animation;
		} else {
			if(creature.vars.facingRight) {
				creature.vars.animation = EnumState.MOVING_R;
			} else {
				creature.vars.animation = EnumState.MOVING_L;
			}
		}
	},
	moveAwayFromPlayer: function(creature, duration_factor, duration_min, speed_multiplier, animation) {
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.direction = getPlayerDirection(creature) + Math.PI;
		creature.movement.speed = creature.vars.speed * speed_multiplier;
		creature.setFacing(creature.movement.direction);
		if(animation) {
			creature.vars.animation = animation;
		} else {
			if(creature.vars.facingRight) {
				creature.vars.animation = EnumState.MOVING_R;
			} else {
				creature.vars.animation = EnumState.MOVING_L;
			}
		}
	},
	moveTowardsPlayer: function(creature, duration_factor, duration_min, speed_multiplier, animation) {
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.direction = getPlayerDirection(creature);
		creature.movement.speed = creature.vars.speed * speed_multiplier;
		creature.setFacing(creature.movement.direction);
		if(animation) {
			creature.vars.animation = animation;
		} else {
			if(creature.vars.facingRight) {
				creature.vars.animation = EnumState.MOVING_R;
			} else {
				creature.vars.animation = EnumState.MOVING_L;
			}
		}
	},
	moveInDirection: function(creature, duration_factor, duration_min, speed_multiplier, direction, accuracy, animation) {
		var duration = Math.random() * duration_factor + duration_min;
		setAiTiming(creature, duration);
		creature.movement.speed = creature.vars.speed * speed_multiplier;
		if(!accuracy) {
			accuracy = 1;
		}
		direction += Math.random() * accuracy;
		direction -= Math.random() * accuracy;
		creature.movement.direction = direction;
		creature.setFacing(creature.movement.direction);
		if(animation) {
			creature.vars.animation = animation;
		} else {
			if(creature.vars.facingRight) {
				creature.vars.animation = EnumState.MOVING_R;
			} else {
				creature.vars.animation = EnumState.MOVING_L;
			}
		}
	},
	bite: function(creature, duration, animation) {
		creature.setFacing(getPlayerDirection(creature));
		setAiTiming(creature, duration);
		if(animation) {
			creature.vars.animation = animation;
		}
		creature.movement.speed = 0;
	},
	teleportAwayFromPlayer: function(creature) {
		var startX = creature.grid.x;
		var startY = creature.grid.y;
		var teleport = ai.getTeleportDirection(creature);
		creature.vars.nextTeleportTime = performance.now() + creature.vars.teleportCooldown;
		switch (teleport.direction) {
			case 'right': {
				for(var i = teleport.distance; i >= 0; i--) {
					if(level.terrainArray[startY][startX+i] === 0 && level.obstacleArray[startY][startX+i] === undefined) {
						creature.grid.x = startX + i;
						break;
					}
				}
				break;
			}
			case 'left': {
				for(var i = teleport.distance; i >= 0; i--) {
					if(level.terrainArray[startY][startX-i] === 0 && level.obstacleArray[startY][startX-i] === undefined) {
						creature.grid.x = startX - i;
						break;
					}
				}
				break;
			}
			case 'down': {
				for(var i = teleport.distance; i >= 0; i--) {
					if(level.terrainArray[startY+i][startX] === 0 && level.obstacleArray[startY+i][startX] === undefined) {
						creature.grid.y = startY + i;
						break;
					}
				}
				break;
			}
			case 'up': {
				for(var i = teleport.distance; i >= 0; i--) {
					if(level.terrainArray[startY-i][startX] === 0 && level.obstacleArray[startY-i][startX] === undefined) {
						creature.grid.y = startY - i;
						break;
					}
				}
				break;
			}
		}
		creature.position.x = creature.grid.x * TILE_SIZE + creature.sprite.size.x * TILE_SIZE / 2;
		creature.position.y = creature.grid.y * TILE_SIZE + creature.sprite.size.y * TILE_SIZE / 2;
		creature.updateBox();
	},
	getTeleportDirection: function(creature) {
		var elbowRoom = {
			right: 0,
			left: 0,
			down: 0,
			up: 0
		}
		var startX = creature.grid.x;
		var startY = creature.grid.y;
		var teleport = {
			direction: 'right',
			distance: 0
		}
		for(var i = 1; i < 10; i++) {
			if(level.terrainArray[startY][startX+i] !== 0) {
				break;
			} else {
				elbowRoom.right++;
			}
		}
		teleport.distance = elbowRoom.right;
		for(var i = 1; i < 10; i++) {
			if(level.terrainArray[startY][startX-i] !== 0) {
				break;
			} else {
				elbowRoom.left++;
			}
		}
		if(elbowRoom.left > elbowRoom.right) {
			teleport.direction = 'left';
			teleport.distance = elbowRoom.left;
		}
		for(var i = 1; i < 10; i++) {
			if(level.terrainArray[startY+i][startX] !== 0) {
				break;
			} else {
				elbowRoom.down++;
			}
		}
		if(elbowRoom.down > elbowRoom.right && elbowRoom.down > elbowRoom.left) {
			teleport.direction = 'down';
			teleport.distance = elbowRoom.down;
		}
		for(var i = 1; i < 10; i++) {
			if(level.terrainArray[startY-i][startX] !== 0) {
				break;
			} else {
				elbowRoom.up++;
			}
		}
		if(elbowRoom.up > elbowRoom.right && elbowRoom.up > elbowRoom.left && elbowRoom.up > elbowRoom.down) {
			teleport.direction = 'up';
			teleport.distance = elbowRoom.up;
		}
		return teleport;
	}
}