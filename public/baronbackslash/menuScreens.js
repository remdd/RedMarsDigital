function firstLoad() {
	setUpCanvases();
	refreshHiScores();
	ieCheck();
}

function setUpCanvases() {
	$('canvas').css('width', CANVAS_WIDTH * SCALE_FACTOR);
	$('canvas').css('height', CANVAS_HEIGHT * SCALE_FACTOR);
	$('canvas').attr('hidden', true);
	$('#gameMenuDiv').css('height', CANVAS_HEIGHT * SCALE_FACTOR);
	$('#gameMenuDiv').css('width', CANVAS_WIDTH * SCALE_FACTOR);
	$('#messageDiv').css('height', CANVAS_HEIGHT * SCALE_FACTOR);
	$('#messageDiv').css('width', CANVAS_WIDTH * SCALE_FACTOR);
}

function ieCheck() {
	var version = detectIE();
	if (version === false) {
		$('#loadingScreen').fadeIn('slow');
		bgMusic.load();							//	bgMusic calls playername() when audio is loaded
	} else if (version >= 12) {
	  document.getElementById('browserSpan').innerHTML = 'Edge ' + version;
	  $('#ieScreen').fadeIn('slow');
	} else {
	  document.getElementById('browserSpan').innerHTML = 'IE ' + version;
	  $('#ieScreen').fadeIn('slow');
	}
	// // add details to debug result
	// document.getElementById('details').innerHTML = window.navigator.userAgent;
	/**
	 * detect IE
	 * returns version of IE or false, if browser is not Internet Explorer
	 */
	function detectIE() {
	  var ua = window.navigator.userAgent;
	  // Test values; Uncomment to check result …

  	  // IE 10
	  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
  
	  // IE 11
	  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
	  
	  // Edge 12 (Spartan)
	  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
	  
	  // Edge 13
	  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

	  var msie = ua.indexOf('MSIE ');
	  if (msie > 0) {
	    // IE 10 or older => return version number
	    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	  }

	  var trident = ua.indexOf('Trident/');
	  if (trident > 0) {
	    // IE 11 => return version number
	    var rv = ua.indexOf('rv:');
	    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	  }

	  var edge = ua.indexOf('Edge/');
	  if (edge > 0) {
	    // Edge (IE 12+) => return version number
	    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
	  }

	  // other browser
	  return false;
	}
}

function playerName() {
	$('#loadingScreen').fadeOut('slow', function() {
		$('#playerNameScreen').fadeIn('slow');
	});
}

function firstMainMenu() {
	$('#playerNameScreen').fadeOut('slow', function() {
		mainMenuEventListener();
		playMusic('titles');
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

function startNewGame() {
	if(!session.loadingLevel) {
		session.loadingLevel = true;
		menuState.menuVisible = false;
		var musicOrder = Math.floor(Math.random() * 6);
		switch (musicOrder) {
			case 0: {
				session.vars.musicOrder = [1,2,3];
				break;
			}
			case 1: {
				session.vars.musicOrder = [1,3,2];
				break;
			}
			case 2: {
				session.vars.musicOrder = [2,1,3];
				break;
			}
			case 3: {
				session.vars.musicOrder = [2,3,1];
				break;
			}
			case 4: {
				session.vars.musicOrder = [3,1,2];
				break;
			}
			case 5: {
				session.vars.musicOrder = [3,2,1];
				break;
			}
			default: {
				break;
			}
		}
		console.log(session.vars.musicOrder);
		playMusic(session.vars.musicOrder[1]);
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
	e.preventDefault();
	if(menuState.menuVisible) {
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
					startNewGame();
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
	if(!session.hiScore || session.score > session.hiScore) {
		session.hiScore = session.score;
		$('.hiScoreSpan').text('Highest Score: ' + session.hiScore);
	}
	var score = {
		name: session.playerName,
		score: session.score,
		defeatedBaron: session.flags.defeatedBaron,
		level: session.levelNumber,
		seed: session.seed,
		date: Date.now()
	}
	$.ajax({
		type: "POST",
		url: '/baronbackslash/score',
		data: score, 
		success: function() {
			// console.log("Score successfully posted!");
			refreshHiScores();
		},
		error: function() {
			// console.log("Error - score not posted!")
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
	// console.log("Refreshing scores...");
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
	menuState.menuVisible = false;
	if(session.levelNumber === 7) {
		playMusic(4);
	} else {
		var track = session.levelNumber % 3;
		playMusic(session.vars.musicOrder[track]);
	}
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
	startNewGame();
});

$('.nextLevelBtn').click(function() {
	gameEffects.play('menuAccept');
	$('button').removeClass('selected');
	$('.nextLevelBtn').addClass('selected');
	startNextLevel();
});


//	Check browser on first load
firstLoad();
