function loadingScreen() {
	refreshHiScores();
	$('canvas').css('width', CANVAS_WIDTH * SCALE_FACTOR);
	$('canvas').css('height', CANVAS_HEIGHT * SCALE_FACTOR);
	$('canvas').attr('hidden', true);
	$('#gameMenuDiv').css('height', CANVAS_HEIGHT * SCALE_FACTOR);
	$('#gameMenuDiv').css('width', CANVAS_WIDTH * SCALE_FACTOR);
	$('#messageDiv').css('height', CANVAS_HEIGHT * SCALE_FACTOR);
	$('#messageDiv').css('width', CANVAS_WIDTH * SCALE_FACTOR);
	$('#loadingScreen').fadeIn('slow');
}

function firstLoad() {
	$('#loadingScreen').fadeOut('slow', function() {
	 	playerName();
	});
}

function playerName() {
	$('#playerNameScreen').fadeIn('slow');
}

function firstMainMenu() {
	$('#playerNameScreen').fadeOut('slow', function() {
		mainMenuEventListener();
		titleLoop.play('titles');
		mainMenu();
	});
}

function controlsScreen() {
	$('#startScreen').fadeOut('slow', function() {
		$('button').removeClass('selected');
		$('.mainMenuBtn').addClass('selected');
		menuState.menuScreen = 'How to play';
		menuState.button = 'Main menu';
		$('#gameMenuDiv').fadeIn('slow', function() {
			$('#controlsScreen').fadeIn('slow');
		});		
	});
}

function startGame() {
	if(!session.loadingLevel) {
		session.loadingLevel = true;
		menuState.menuVisible = false;
		if(titleLoop.playing()) {
			titleLoop.fade(titleLoop.volume(), 0, 2000);
		}
		if(bgMusic.playing()) {
			bgMusic.stop();
		}
	 	if(session.levelNumber === 7) {
	 		bgMusic.play('music4');
	 	} else if(session.levelNumber % 3 === 0) {
		 	bgMusic.play('music3');
	 	} else if(session.levelNumber % 3 === 1) {
		 	bgMusic.play('music1');
	 	} else {
		 	bgMusic.play('music2');
	 	}
	 	bgMusic.volume(0);
	 	bgMusic.fade(0, session.vars.musicVol, 2000);
		start(true);
	}
}

var menuState = {
	menuVisible: false,
	menuScreen: 'Main menu',
	button: 'New game'
};


function mainMenu() {
	$.when($('.gameMenuScreen').fadeOut('slow')).then(function() {
		menuState.menuVisible = true;
		menuState.menuScreen = 'Main menu';
		menuState.button = 'New game';
		$('button').removeClass('selected');
		$('.newGameBtn').addClass('selected');
		$('#interfaceDivLeft').fadeOut('slow');
		$('#gameMenuDiv').fadeIn('slow', function() {
			$('#startScreen').fadeIn('slow');
		});		
	});
}

function mainMenuEventListener() {
	window.addEventListener('keydown', function(e) {mainMenuChoice(e)}, true);
}

function mainMenuChoice(e) {
	if(menuState.menuVisible) {
		e.preventDefault();
		if(menuState.menuScreen === 'Main menu' && (e.code === 'KeyS' || e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'ArrowDown')) {
			gameEffects.play('menuChange');
			$('button').removeClass('selected');
			if(menuState.button === 'New game') {
				menuState.button = 'How to play';
				$('.howToPlayBtn').addClass('selected');
			} else {
				menuState.button = 'New game';
				$('.newGameBtn').addClass('selected');
			}
		} else if(menuState.menuScreen === 'Death screen' && (e.code === 'KeyS' || e.code === 'KeyW' || e.code === 'ArrowUp' || e.code === 'ArrowDown')) {
			gameEffects.play('menuChange');
			$('button').removeClass('selected');
			if(menuState.button === 'New game') {
				menuState.button = 'Main menu';
				$('.mainMenuBtn').addClass('selected');
			} else {
				menuState.button = 'New game';
				$('.newGameBtn').addClass('selected');
			}
		} else if(e.code === 'Space' || e.code === 'Enter') {
			switch(menuState.button) {
				case 'New game': {
					gameEffects.play('startCoin');
					startGame();
					break;
				}
				case 'How to play': {
					gameEffects.play('menuAccept');
					controlsScreen();
					break;
				}
				case 'Main menu': {
					gameEffects.play('menuAccept');
					mainMenu();
					break;
				}
				case 'Next level': {
					gameEffects.play('menuAccept');
					startNextLevel();
					break;
				}
				default: {
					break;
				}
			}
		}
	}
}

function deathScreen() {
	session.playing = false;
	$.when($('canvas').fadeOut('slow')).then(function() {
		$('#gameMenuDiv').fadeIn('slow', function() {
			$.when($('#deathScreen').fadeIn('slow')).then(function() {
				saveScore();
				menuState.menuVisible = true;
				menuState.menuScreen = 'Death screen';
				menuState.button = 'New game';
				clearCanvases();
			});
		});
	});
}

function saveScore() {
	var score = {
		name: session.playerName,
		score: session.score,
		defeatedBaron: session.flags.defeatedBaron,
		level: session.levelNumber,
		date: Date.now()
	}
	$.ajax({
		type: "POST",
		url: '/baronbackslash/score',
		data: score, 
		success: function() {
			console.log("Score successfully posted!");
			refreshHiScores();
		},
		error: function() {
			console.log("Error - score not posted!")
		}
	});
}

function endLevelScreen() {
	session.playing = false;
	$.when($('canvas').fadeOut('slow')).then(function() {
		$('#gameMenuDiv').fadeIn('slow', function() {
			$('#endLevelScreen').fadeIn('slow', function() {
				menuState.menuVisible = true;
				menuState.menuScreen = 'End level screen',
				menuState.button = 'Next level'
				$('.nextLevelBtn').addClass('selected');
				clearCanvases();
			});
		});
	});
}

function gameCompleteScreen() {
	session.playing = false;
	session.loadingLevel = false;
	$('.playerNameSpan').text(session.playerName);
	$('.finalScoreSpan').text(session.score);
	saveScore();
	$.when($('canvas').fadeOut('slow')).then(function() {
		$('#gameMenuDiv').fadeIn('slow', function() {
			$('#gameCompleteScreen').fadeIn('slow', function() {
				clearCanvases();
				initializeSession();
				$('button').removeClass('selected');
				$('.mainMenuBtn').addClass('selected');
				menuState.menuVisible = true;
				menuState.menuScreen = 'Game Complete';
				menuState.button = 'Main menu';
			});
		});
	});	
}

function refreshHiScores() {
	console.log("Refreshing scores...");
	$.ajax({
		type: "GET",
		url: '/baronbackslash/todayscores',
		success: function(hiScores) {
			$('#todayScoreboard').empty();
			var headers = $('<tr><th>Name</th><th>Score</th><th>Level</th><th></th></tr>');
			headers.appendTo('#todayScoreboard');
			hiScores.forEach(function(hiScore) {
				if(hiScore.defeatedBaron) {
					var item = $('<tr><td>' + hiScore.name + "</td><td>" + hiScore.score + '</td><td>' + hiScore.level + 
						'</td><td><img class="deadBaron" src="img/DefeatedBaron.png"></td></tr>');
				} else {
					var item = $('<tr><td>' + hiScore.name + "</td><td>" + hiScore.score + '</td><td>' + hiScore.level + '</td><td></td></tr>');
				}
				item.appendTo('#todayScoreboard');
			});
		}
	});
	$.ajax({
		type: "GET",
		url: '/baronbackslash/alltimescores',
		success: function(hiScores) {
			$('#allTimeScoreboard').empty();
			var headers = $('<tr><th>Name</th><th>Score</th><th>Level</th><th></th></tr>');
			headers.appendTo('#allTimeScoreboard');
			hiScores.forEach(function(hiScore) {
				if(hiScore.defeatedBaron) {
					var item = $('<tr><td>' + hiScore.name + "</td><td>" + hiScore.score + '</td><td>' + hiScore.level + 
						'</td><td><img class="deadBaron" src="img/DefeatedBaron.png"></td></tr>');
				} else {
					var item = $('<tr><td>' + hiScore.name + "</td><td>" + hiScore.score + '</td><td>' + hiScore.level + '</td><td></td></tr>');
				}
				item.appendTo('#allTimeScoreboard');
			});
		}
	});
}

function startNextLevel() {
	if(bgMusic.playing()) {
		bgMusic.stop();
	}
 	if(session.levelNumber === 7) {
 		bgMusic.play('music4');
 	} else if(session.levelNumber % 3 === 0) {
	 	bgMusic.play('music3');
 	} else if(session.levelNumber % 3 === 1) {
	 	bgMusic.play('music1');
 	} else {
	 	bgMusic.play('music2');
 	}
 	bgMusic.volume(0);
 	bgMusic.fade(0, session.vars.musicVol, 2000);
	menuState.menuVisible = false;
	start();
}

$('.enterNameBtn').click(function(event) {
	event.preventDefault();
	session.playerName = $('#playerName').val();
	if($('#playerName').val() === '') {
		session.playerName = "Anonymous Victim";
	}
	gameEffects.play('menuAccept');
	firstMainMenu();
});


$('.mainMenuBtn').click(function() {
	gameEffects.play('menuAccept');
	$('button').removeClass('selected');
	$('.mainMenuBtn').addClass('selected');
	mainMenu();
});

$('.howToPlayBtn').click(function() {
	gameEffects.play('menuAccept');
	$('button').removeClass('selected');
	$('.howToPlayBtn').addClass('selected');
	controlsScreen();
});

$('.newGameBtn').click(function() {
	gameEffects.play('startCoin');
	$('button').removeClass('selected');
	$('.newGameBtn').addClass('selected');
	startGame();
});

$('.nextLevelBtn').click(function() {
	gameEffects.play('menuAccept');
	$('button').removeClass('selected');
	$('.nextLevelBtn').addClass('selected');
	startNextLevel();
});


//	Show loading screen on first load
loadingScreen();
