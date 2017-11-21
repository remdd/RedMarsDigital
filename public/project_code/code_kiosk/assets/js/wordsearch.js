$(function() {

	//	Variables	
	var gamesToPlay = [];
	var grid = $('.square');
	var sqHt = 58; 										// 	Total height of individual grid square, including margin
	var ofSt = 5; 										// 	Margin of rings around found words
	var firstLetterSelected = false;					//	Track whether the first letter of a guess has been selected	
	var colFirst, rowFirst, colSecond, rowSecond;		//	Hold row & col of first & second letter selections
	var cols = $('#firstRow .square').length;			//	Count squares on first row to give total no of columns

	//	Set up game on first load
	function firstLoad() {
		populatePlayingArray();										//	Clone master game array to destructible playing array
		$('#startPopup').css('display', 'block');					//	Show introductory modal on first load
		$('#startBtn').click(newGame);								//	Click listener for 'start' button on intro modal
		$('body').fadeIn('slow');									//	Display page
	}

	//	Set up words and images for new game
	function newGame() {
		clearSelection();											//	Clear any letter highlights & firstSelected flag
		addRandomLetters();											//	Fill random letters around placed names
		console.log(gamesToPlay.length + " games left");
		console.log("Loading game: " + gamesToPlay[0]);
		if(gamesToPlay.length < 1) {								//	If no games remain in playing array,
			populatePlayingArray();
		}
		setupAnimals(gamesToPlay[0]);								//	Load game at position 0
		$('#startPopup').fadeOut('slow');							//	Fade out intro modal
		$('#winPopup').fadeOut('slow');								//	Fade out win game modal
		$('#divAll').fadeIn('slow');								//	Fade in page content
	}

	function populatePlayingArray() {
		gamesToPlay = JSON.parse(JSON.stringify(games));			//	deep clone master array & contained objects
		shuffle(gamesToPlay);										//	and shuffle it
	}

	//	Add animal names to grid & load images
	function setupAnimals(game) {
		for(var i = 0; i < game.length; i++) {						//	Iterate through animals in game array being loaded
			//	Write name into grid
			if(game[i].direction === 'horizontal') {				//	Add animal id text to grid in appropriate direction
				for(var j = 0; j < game[i].id.length; j++) {
					$('div[data-row="' + game[i].start_y + '"][data-col="' + (game[i].start_x + j) + '"]').text(game[i].id.charAt(j).toUpperCase());
				}
			} else if(game[i].direction === 'vertical') {
				for(var j = 0; j < game[i].id.length; j++) {
					$('div[data-row="' + (game[i].start_y + j) + '"][data-col="' + game[i].start_x + '"]').text(game[i].id.charAt(j).toUpperCase());
				}
			} else if(game[i].direction === 'diagonalUp') {
				for(var j = 0; j < game[i].id.length; j++) {
					$('div[data-row="' + (game[i].start_y - j) + '"][data-col="' + (game[i].start_x + j) + '"]').text(game[i].id.charAt(j).toUpperCase());
				}
			} else if(game[i].direction === 'diagonalDown') {
				for(var j = 0; j < game[i].id.length; j++) {
					$('div[data-row="' + (game[i].start_y + j) + '"][data-col="' + (game[i].start_x + j) + '"]').text(game[i].id.charAt(j).toUpperCase());
				}
			}
			//	Draw silhouette on side canvas
			drawSilhouette(game[i].id, game[i].side, game[i].img_x, game[i].img_y);			//	Draw animal silhouette on side canvas
			$('li[data-hintLi="' + i + '"]').text(game[i].name);							//	Add animal name to hint modal
		}
	}

	//	Draw initial shadowed animal image 
	function drawSilhouette(name, imgSide, imgX, imgY) {
		var ctx = $('#' + imgSide + 'Canvas')[0].getContext('2d');				//	Get context of appropriate side canvas
		ctx.globalAlpha = 0.5;													//	Set shadow opacity
		ctx.shadowColor = "#bbbbbb";											
		ctx.shadowBlur = 3;
		var imageObj = new Image();
		imageObj.onload = function() {
			ctx.drawImage(imageObj, imgX, imgY);
		};
		imageObj.src = "assets/img/wordsearch/" + name + "-black.png";
	};

	//	Colour in found animal image
	function colourAnimal(name, imgSide, imgX, imgY) {
		var ctx = $('#' + imgSide + 'Canvas')[0].getContext('2d');				//	Get context of appropriate side canvas
		var alpha = 0.0;														//	Set to zero opacity
		var imageObj = new Image();
		imageObj.onload = function() {
			ctx.drawImage(imageObj, imgX, imgY);
		};
		imageObj.src = "assets/img/wordsearch/" + name + "-colour.png";
		function fadeIn() {
			ctx.globalAlpha = alpha;
			ctx.drawImage(imageObj, imgX, imgY);
			alpha += 0.03;
			if(alpha >= 1) {
				return;
			}
			requestAnimationFrame(fadeIn);
		};
		fadeIn();
	};

	//	Event handling
	$('#gridDiv').on('touchstart', function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		var $touchedElement = $(evt.target);
		if($touchedElement.hasClass('square') && !firstLetterSelected) {
			firstClick($touchedElement);
		}
	});
	$('#gridDiv').on('touchmove', function(evt) {
		stopHover();
		evt.preventDefault();
		evt.stopPropagation();
		var moveTouch = evt.changedTouches[0];
		var $touchedElement = $(document.elementFromPoint(moveTouch.clientX, moveTouch.clientY));
		if($touchedElement.hasClass('square') && !$touchedElement.hasClass('first')) {
			secondHover($touchedElement);
		}
	});
	$('#gridDiv').on('touchend', function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		var endTouch = evt.changedTouches[0];
		var $touchedElement = $(document.elementFromPoint(endTouch.clientX, endTouch.clientY));
		if($touchedElement.hasClass('square') && !$touchedElement.hasClass('first')) {
			secondClick($touchedElement);
		}
	})
	$('#gridDiv').on('mousedown', function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		var $touchedElement = $(evt.target);
		if($touchedElement.hasClass('square') && !firstLetterSelected) {
			firstClick($touchedElement);
		} else if($touchedElement.hasClass('square')) {
			secondClick($touchedElement);
		}
	});
	$('#gridDiv').on('mousemove', function(evt) {
		if($('.chosen').length > 0) {					//	If a guessed word is already highlighted, stop flashing animations
			stopHover();
		} else if(firstLetterSelected) {				//	Else if a first letter has been selected...
			evt.preventDefault();
			evt.stopPropagation();
			var $touchedElement = $(evt.target);
			if($touchedElement.hasClass('square') && !$touchedElement.hasClass('first')) {
				secondHover($touchedElement);			//	...run 'secondHover' to determine whether a straight line exists from 1st to 2nd letter, and highlight it if so
			}
		}
	});
	$('#gridDiv').on('mouseup', function(evt) {
		stopHover();
		evt.preventDefault();
		evt.stopPropagation();
		var $touchedElement = $(evt.target);
		if($touchedElement.hasClass('square') && !$touchedElement.hasClass('first')) {
			secondClick($touchedElement);
		}
	});

	//	Hover listeners
	$('.square').mouseover(function() {
		if(firstLetterSelected) {								//	If first letter has been selected,
			secondHover($(this));								//	Run 'secondHover' to determine whether a straight line exists between it and hovered square
		} else {
			$(this).addClass('hovered');						//	Otherwise highlight hovered square only
		}
	});
	$('.square').mouseleave(function() {
		$(this).removeClass('hovered');							//	Remove hover highlight when mouse leaves a square
	});

	function buildGuessString(obj, guess) {						//	Build a 'guess' string from selected squares
		guess += obj.text();
		obj.addClass('chosen');
		return guess;
	}

	// Event listeners
	function firstClick(obj) {
		obj.addClass('first');									//	Highlight grid square with green styled class
		firstLetterSelected = true;								//	Set flag to indicate first letter has been selected
		colFirst = Number(obj.attr('data-col'));
		rowFirst = Number(obj.attr('data-row'));
	};
	function secondClick(obj) {
		console.log("Second");
		colSecond = Number(obj.attr('data-col'));
		rowSecond = Number(obj.attr('data-row'));
		//	Build 'guess' string of characters between first and second selections
		var guess = "";
		if(colFirst > colSecond) {								//	If last letter was selected first, swap first and second col and values (horizontal & diagonal guesses)
			var tmp = colFirst;
			colFirst = colSecond;
			colSecond = tmp;
			tmp = rowFirst;
			rowFirst = rowSecond;
			rowSecond = tmp;
		}
		if(rowFirst > rowSecond && colFirst === colSecond) {	//	If last letter was selected first, swap first and second row values (vertical guesses)
			var tmp = rowFirst;
			rowFirst = rowSecond;
			rowSecond = tmp;
		}
		if(rowFirst === rowSecond) {								//	If guess is horizontal
			for(var i = (colFirst + (rowFirst * cols)); i <= (colSecond + (rowSecond * cols)); i++) {
				guess = buildGuessString($(grid[i]), guess);
			}
		} else if(colFirst === colSecond) {							//	If guess is vertical
			for(var i = (colFirst + (rowFirst * cols)); i <= (colSecond + (rowSecond * cols)); i += cols) {
				guess = buildGuessString($(grid[i]), guess);
			}
		} else if(colSecond - colFirst === rowSecond - rowFirst) {	//	If guess is diagonal down
			for(var i = (colFirst + (rowFirst * cols)); i <= (colSecond + (rowSecond * cols)); i += (cols + 1)) {
				guess = buildGuessString($(grid[i]), guess);
			}
		} else if(colSecond - colFirst === rowFirst - rowSecond) {	//	If guess is diagonal up
			for(var i = (colFirst + (rowFirst * cols)); i >= (colSecond + (rowSecond * cols)); i -= (cols - 1)) {
				guess = buildGuessString($(grid[i]), guess);
			}
		}
		checkGuess(guess);											//	Check whether selected word is a valid guess
		setTimeout(clearSelection, 700);							//	Clear highlighting after 0.7 seconds
	};

	//	Hover around currently selected string when touch is dragged across grid
	function secondHover(obj){										//	Function is passed the square that user is currently touching
		stopHover();
		obj.addClass("hovered");									//	Set hover class on currently touched square
		colHover = Number(obj.attr("data-col"));					//	Get currently touched square col number...
		rowHover = Number(obj.attr("data-row"));					//	...and row number
		var first = $('.first');									//	Select square containing first selection first selection
		firstCol = Number(first.attr('data-col'));					//	Get first selection's col number...
		firstRow = Number(first.attr('data-row'));					//	...and row number
		if(firstRow === rowHover) {									//	Add highlights to span between selections if line is horizontal...
			if(firstCol < colHover) {
				for(var i = (firstCol + (firstRow * cols)); i <= (colHover + (rowHover * cols)); i++) {
					$(grid[i]).addClass('hovered');
				}
			} else if(firstCol > colHover) {
				for(var i = (firstCol + (firstRow * cols)); i >= (colHover + (rowHover * cols)); i--) {
					$(grid[i]).addClass('hovered');
				}
			}
		} else if(firstCol === colHover) {							//	...or vertical...
			if(firstRow < rowHover) {
				for(var i = (firstCol + (firstRow * cols)); i <= (colHover + (rowHover * cols)); i += cols) {
					$(grid[i]).addClass('hovered');
				}
			} else if(firstRow > rowHover) {
				for(var i = (firstCol + (firstRow * cols)); i >= (colHover + (rowHover * cols)); i -= cols) {
					$(grid[i]).addClass('hovered');
				}
			}
		} else if(colHover - firstCol === rowHover - firstRow) {	//	...or diagonal down...
			if(firstRow < rowHover) {
				for(var i = (firstCol + (firstRow * cols)); i <= (colHover + (rowHover * cols)); i += (cols + 1)) {
					$(grid[i]).addClass('hovered');
				}
			} else if(firstRow > rowHover) {
				for(var i = (firstCol + (firstRow * cols)); i >= (colHover + (rowHover * cols)); i -= (cols + 1)) {
					$(grid[i]).addClass('hovered');
				}
			}
		} else if(colHover - firstCol === firstRow - rowHover) {	//	...or diagonal up
			if(firstRow > rowHover) {
				for(var i = (firstCol + (firstRow * cols)); i >= (colHover + (rowHover * cols)); i -= (cols - 1)) {
					$(grid[i]).addClass('hovered');
				}
			} else if(firstRow < rowHover) {
				for(var i = (firstCol + (firstRow * cols)); i <= (colHover + (rowHover * cols)); i += (cols - 1)) {
					$(grid[i]).addClass('hovered');
				}
			}
		}
	}

	//	Clear highlighted letters after guess selection
	function clearSelection() {
		$('.square').removeClass('chosen first');				//	Remove selection highlighting
		stopHover();											//	And any flashing animation
		firstLetterSelected = false;							//	Reset flag to enable new guess to start
	};
	function stopHover() {										//	Remove flashing animation from any 'hovered' squares
		$('.hovered').removeClass('hovered');
	}

	function checkGuess(guess) {								//	Check whether 'guess' string matches an animal ID still present in gamesToPlay[0]
		stopHover();											//	Remove hover class (flashing squares)
		guess = guess.toLowerCase();							//	Case conversion (letters displayed in grid are uppercase)
		revGuess = reverseGuess(guess);							//	Reverse the guess string in case selection was made 'front to back'
		for(var i = 0; i < gamesToPlay[0].length; i++) {		//	Iterate through animal ID's remaining in gamesToPlay[0]
			if(gamesToPlay[0][i].id === guess || gamesToPlay[0][i].id === revGuess) {				//	If a match is found...
				colourAnimal(gamesToPlay[0][i].id, gamesToPlay[0][i].side, gamesToPlay[0][i].img_x, gamesToPlay[0][i].img_y);		//	...colour in the animal pic
				if(gamesToPlay[0][i].direction === 'horizontal') {									//	Draw a ring around the word if it is horizontal...
					ringRoundHorizontal(colFirst, rowFirst, colSecond, rowSecond);
				} else if(gamesToPlay[0][i].direction === 'vertical') {								//	...or vertical...
					ringRoundVertical(colFirst, rowFirst, colSecond, rowSecond);
				} else if(gamesToPlay[0][i].direction === 'diagonalDown') {							//	...or diagonal down...
					ringRoundDiagonalDown(colFirst, rowFirst, colSecond, rowSecond);
				} else if(gamesToPlay[0][i].direction === 'diagonalUp') {							//	...or diagonal up
					ringRoundDiagonalUp(colFirst, rowFirst, colSecond, rowSecond);
				}
				gamesToPlay[0].splice(gamesToPlay[0].indexOf(gamesToPlay[0][i]), 1);				//	Delete winning animal from gamesToPlay[0] array
			}
		}
		if(gamesToPlay[0].length === 0) {							//	Check if all animals have been found
			setTimeout(function() {
				$('#hintPopup').fadeOut('fast');					//	Fade out hint popup if displayed
				$('#winPopup').fadeIn('slow');						//	If so, display 'win modal'...
			}, 1500);												//	...after a 1.5 second delay
		}
	}

	//	Reverses a guess string to test 'back-to-front' selection
	function reverseGuess(guess) {
		var splitGuess = guess.split("");
		var reverseGuessArray = splitGuess.reverse();
		var revGuess = reverseGuessArray.join("");
		return revGuess;
	};

	//	Clear down completed game
	function clearDown(callback) {
		$('#divAll').fadeOut('slow', function() {
			gamesToPlay.splice(0, 1);									//	Remove game from position 0 of playing array
			var canvas = document.getElementById("leftCanvas");
			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			canvas = document.getElementById("rightCanvas");
			ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			canvas = document.getElementById("gridCanvas");
			ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			$('.square').text('');
			if(callback && typeof callback === 'function') {
				callback();
			}
		});
	}

	//	Add click listener to new game button (in win modal)
	$('#newGameBtn').click(function() {
		clearDown(newGame);
	});

	//	Shuffle game array to random order
	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) {
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
		}
		return array;
	}

	// Cycle through the grid and add a random letter to all empty squares
	function addRandomLetters() {
		var commonLetters = ["E", "T", "A", "O", "I", "N", "S", "H", "R"];
		var uncommLetters = ["D", "L", "C", "U", "M", "W", "F", "G"];
		var rarestLetters = ["Y", "P", "B", "V", "K", "J", "X", "Q", "Z"];
		for(var i = 0; i < grid.length; i++) {
			if(grid[i].textContent === "") {
				var rand = Math.floor(Math.random() * 10);								//	Pick random number 0-9
				if(rand <= 4) {
					var rand2 = Math.floor(Math.random() * commonLetters.length);		//	If 0-4, add common letter
					grid[i].textContent = commonLetters[rand2];
				} else if(rand <= 7) {
					var rand2 = Math.floor(Math.random() * uncommLetters.length);		//	If 5-7, add uncommon letter
					grid[i].textContent = uncommLetters[rand2];
				} else {
					var rand2 = Math.floor(Math.random() * rarestLetters.length);		//	If 8-9	add rare letter
					grid[i].textContent = rarestLetters[rand2];
				};
			};
		};
	};

	// Ring drawing functions for found words
	function ringRoundHorizontal(x1, y1, x2, y2) {
		var ctx = $('#gridCanvas')[0].getContext('2d');				//	Get context of letter grid canvas
		ctx.beginPath();
		ctx.moveTo(x1 * sqHt+ofSt, y1 * sqHt + sqHt/2);
		ctx.quadraticCurveTo(x1 * sqHt+ofSt, y1 * sqHt + sqHt-ofSt, x1 * sqHt + sqHt/2, y1 * sqHt + sqHt-ofSt);
		ctx.lineTo(x2 * sqHt + sqHt/2, y2 * sqHt + sqHt-ofSt);
		ctx.quadraticCurveTo(x2 * sqHt + sqHt-ofSt, y2 * sqHt + sqHt-ofSt, x2 * sqHt + sqHt-ofSt, y2 * sqHt + sqHt/2);
		ctx.quadraticCurveTo(x2 * sqHt + sqHt-ofSt, y2 * sqHt+ofSt, x2 * sqHt + sqHt/2, y2 * sqHt+ofSt);
		ctx.lineTo(x1 * sqHt + sqHt/2, y1 * sqHt+ofSt);
		ctx.quadraticCurveTo(x1 * sqHt+ofSt, y1 * sqHt+ofSt, x1 * sqHt+ofSt, y1 * sqHt + sqHt/2);
		ctx.strokeStyle = 'rgba(0,0,0,0.3)';
		ctx.lineWidth = 3;
		ctx.stroke();
	};
	function ringRoundVertical(x1, y1, x2, y2) {
		var ctx = $('#gridCanvas')[0].getContext('2d');
		ctx.beginPath();
		ctx.moveTo(x1 * sqHt + sqHt/2, y1 * sqHt+ofSt);
		ctx.quadraticCurveTo(x1 * sqHt+ofSt, y1 * sqHt+ofSt, x1 * sqHt+ofSt, y1 * sqHt + sqHt/2);
		ctx.lineTo(x2 * sqHt+ofSt, y2 * sqHt + sqHt/2);
		ctx.quadraticCurveTo(x2 * sqHt+ofSt, y2 * sqHt + sqHt-ofSt, x2 * sqHt + sqHt/2, y2 * sqHt + sqHt-ofSt);
		ctx.quadraticCurveTo(x2 * sqHt + sqHt-ofSt, y2 * sqHt + sqHt-ofSt, x2 * sqHt + sqHt-ofSt, y2 * sqHt + sqHt/2);
		ctx.lineTo(x1 * sqHt + sqHt-ofSt, y1 * sqHt + sqHt/2);
		ctx.quadraticCurveTo(x1 * sqHt + sqHt-ofSt, y1 * sqHt+ofSt, x1 * sqHt + sqHt/2, y1 * sqHt+ofSt);
		ctx.strokeStyle = 'rgba(0,0,0,0.3)';
		ctx.lineWidth = 3;
		ctx.stroke();
	};
	function ringRoundDiagonalDown(x1, y1, x2, y2) {
		var ctx = $('#gridCanvas')[0].getContext('2d');
		ctx.beginPath();
		ctx.moveTo(x1 * sqHt + sqHt*0.795, y1 * sqHt + sqHt*0.265);
		ctx.quadraticCurveTo(x1 * sqHt + sqHt/2, y1 * sqHt + 00, x1 * sqHt + sqHt*0.265, y1 * sqHt + sqHt*0.265);
		ctx.quadraticCurveTo(x1 * sqHt + 00, y1 * sqHt + sqHt/2, x1 * sqHt + sqHt*0.265, y1 * sqHt + sqHt*0.795);
		ctx.lineTo(x2 * sqHt + sqHt*0.265, y2 * sqHt + sqHt*0.795);
		ctx.quadraticCurveTo(x2 * sqHt + sqHt/2, y2 * sqHt + sqHt, x2 * sqHt + sqHt*0.795, y2 * sqHt + sqHt*0.795);
		ctx.quadraticCurveTo(x2 * sqHt + sqHt, y2 * sqHt + sqHt/2, x2 * sqHt + sqHt*0.795, y2 * sqHt + sqHt*0.265);
		ctx.lineTo(x1 * sqHt + sqHt*0.795, y1 * sqHt + sqHt*0.265);
		ctx.strokeStyle = 'rgba(0,0,0,0.3)';
		ctx.lineWidth = 3;
		ctx.stroke();
	};
	function ringRoundDiagonalUp(x1, y1, x2, y2) {
		var ctx = $('#gridCanvas')[0].getContext('2d');
		ctx.beginPath();
		ctx.moveTo(x1 * sqHt + sqHt*0.265, y1 * sqHt + sqHt*0.265);
		ctx.quadraticCurveTo(x1 * sqHt + 00, y1 * sqHt + sqHt/2, x1 * sqHt + sqHt*0.265, y1 * sqHt + sqHt*0.795);
		ctx.quadraticCurveTo(x1 * sqHt + sqHt/2, y1 * sqHt + sqHt, x1 * sqHt + sqHt*0.795, y1 * sqHt + sqHt*0.795);
		ctx.lineTo(x2 * sqHt + sqHt*0.795, y2 * sqHt + sqHt*0.795);
		ctx.quadraticCurveTo(x2 * sqHt + sqHt, y2 * sqHt + sqHt/2, x2 * sqHt + sqHt*0.795, y2 * sqHt + sqHt*0.265);
		ctx.quadraticCurveTo(x2 * sqHt + sqHt/2, y2 * sqHt + 00, x2 * sqHt + sqHt*0.265, y2 * sqHt + sqHt*0.265);
		ctx.lineTo(x1 * sqHt + sqHt*0.265, y1 * sqHt + sqHt*0.265);
		ctx.strokeStyle = 'rgba(0,0,0,0.3)';
		ctx.lineWidth = 3;
		ctx.stroke();
	};

	//	Hint button listeners
	$('#hintBtn').mouseover(function() {			//	Show lit bulb graphic on mouseover hint button
		$('#hintBulb').attr('src', 'assets/img/wordsearch/pawbulb-lit.png');
	});
	$('#hintBtn').mouseout(function() {				//	Revert to unlit bulb on mouseout
		$('#hintBulb').attr('src', 'assets/img/wordsearch/pawbulb.png');
	});
	$('#hintBtn').click(function() {				//	Display hint modal when button is pressed
		$('#hintPopup').fadeIn('slow');
		hint();										//	Check which animals are still to be found and update displayed list accordingly
	});
	function hint(){								//	Cross out found animal names in hint modal
		$('li').addClass('foundName notFoundName');
		for(var i = 0; i < gamesToPlay[0].length; i++) {
			$.each($('li'), function() {
				if($(this).text() === gamesToPlay[0][i].name) {
					$(this).removeClass('foundName');					
 				}
			});
		}
		$('#hintPopup').click(function() {
			$('#hintPopup').fadeOut('slow');
		});
	};

	//	Master game data
	var games = [
		[	//	Game 0
			{ id: 'mara', name: 'Mara', start_x: 8, start_y: 2, direction: 'vertical', side: 'left', img_x: 50, img_y: 80 },
			{ id: 'pacu', name: 'Pacu', start_x: 3, start_y: 5, direction: 'horizontal', side: 'left', img_x: 210, img_y: 280 },
			{ id: 'leafcutterant', name: 'Leafcutter Ant', start_x: 1, start_y: 1, direction: 'horizontal', side: 'left', img_x: 5, img_y: 300 },
			{ id: 'redsquirrel', name: 'Red Squirrel', start_x: 1, start_y: 0, direction: 'diagonalDown', side: 'left', img_x: 200, img_y: 460 },
			{ id: 'bluepie', name: 'Bluepie', start_x: 0, start_y: 6, direction: 'vertical', side: 'left', img_x: 25, img_y: 540 },
			{ id: 'pygmymarmoset', name: 'Pygmy Marmoset', start_x: 1, start_y: 13, direction: 'diagonalUp', side: 'left', img_x: 160, img_y: 695 },
			{ id: 'turaco', name: 'Turaco', start_x: 5, start_y: 0, direction: 'diagonalDown', side: 'right', img_x: 170, img_y: 50 },
			{ id: 'degu', name: 'Degu', start_x: 1, start_y: 11, direction: 'horizontal', side: 'right', img_x: 10, img_y: 60 },
			{ id: 'axolotl', name: 'Axolotl', start_x: 2, start_y: 3, direction: 'vertical', side: 'right', img_x: 165, img_y: 310 },
			{ id: 'chameleon', name: 'Chameleon', start_x: 5, start_y: 13, direction: 'diagonalUp', side: 'right', img_x: 60, img_y: 445 },
			{ id: 'snowleopard', name: 'Snow Leopard', start_x: 0, start_y: 3, direction: 'diagonalDown', side: 'right', img_x: 135, img_y: 700 },
			{ id: 'canetoad', name: 'Cane Toad', start_x: 13, start_y: 3, direction: 'vertical', side: 'right', img_x: 20, img_y: 645 }
		],
		[	//	Game 1
			{ id: 'cricket', name: 'Cricket', start_x: 13, start_y: 4, direction: 'vertical', side: 'left', img_x: 205, img_y: 80 },
			{ id: 'lungfish', name: 'Lungfish', start_x: 3, start_y: 0, direction: 'diagonalDown', side: 'left', img_x: 0, img_y: 130 },
			{ id: 'canetoad', name: 'Cane Toad', start_x: 12, start_y: 0, direction: 'vertical', side: 'left', img_x: 0, img_y: 330 },
			{ id: 'millipede', name: 'Millipede', start_x: 0, start_y: 12, direction: 'diagonalUp', side: 'left', img_x: 200, img_y: 460 },
			{ id: 'clownfish', name: 'Clownfish', start_x: 5, start_y: 11, direction: 'horizontal', side: 'left', img_x: 20, img_y: 580 },
			{ id: 'goldenpheasant', name: 'Golden Pheasant', start_x: 0, start_y: 2, direction: 'horizontal', side: 'left', img_x: 10, img_y: 810 },
			{ id: 'waterdragon', name: 'Water Dragon', start_x: 2, start_y: 12, direction: 'diagonalUp', side: 'right', img_x: 5, img_y: 40 },
			{ id: 'owlbutterfly', name: 'Owl Butterfly', start_x: 1, start_y: 2, direction: 'diagonalDown', side: 'right', img_x: 245, img_y: 190 },
			{ id: 'tokaygecko', name: 'Tokay Gecko', start_x: 1, start_y: 1, direction: 'vertical', side: 'right', img_x: 25, img_y: 220 },
			{ id: 'mara', name: 'Mara', start_x: 9, start_y: 1, direction: 'vertical', side: 'right', img_x: 150, img_y: 460 },
			{ id: 'potoroo', name: 'Potoroo', start_x: 0, start_y: 13, direction: 'horizontal', side: 'right', img_x: 10, img_y: 650 },
			{ id: 'monal', name: 'Monal', start_x: 5, start_y: 0, direction: 'vertical', side: 'right', img_x: 170, img_y: 670 },
		],
		[	//	Game 2
			{ id: 'snowleopard', name: 'Snow Leopard', start_x: 0, start_y: 12, direction: 'diagonalUp', side: 'left', img_x: 100, img_y: 50 },
			{ id: 'pacu', name: 'Pacu', start_x: 11, start_y: 0, direction: 'vertical', side: 'left', img_x: 0, img_y: 275 },
			{ id: 'leafcutterant', name: 'Leafcutter Ant', start_x: 1, start_y: 0, direction: 'vertical', side: 'left', img_x: 245, img_y: 350 },
			{ id: 'meerkat', name: 'Meerkat', start_x: 6, start_y: 11, direction: 'diagonalUp', side: 'left', img_x: 0, img_y: 430 },
			{ id: 'royalpython', name: 'Royal Python', start_x: 2, start_y: 0, direction: 'diagonalDown', side: 'left', img_x: 130, img_y: 600 },
			{ id: 'axolotl', name: 'Axolotl', start_x: 11, start_y: 7, direction: 'vertical', side: 'left', img_x: 25, img_y: 860 },
			{ id: 'turaco', name: 'Turaco', start_x: 7, start_y: 1, direction: 'diagonalDown', side: 'right', img_x: 115, img_y: 50 },
			{ id: 'bluepie', name: 'Bluepie', start_x: 4, start_y: 10, direction: 'horizontal', side: 'right', img_x: 10, img_y: 100 },
			{ id: 'fruitbat', name: 'Fruit Bat', start_x: 13, start_y: 1, direction: 'vertical', side: 'right', img_x: 280, img_y: 105 },
			{ id: 'cichlid', name: 'Cichlid', start_x: 7, start_y: 13, direction: 'horizontal', side: 'right', img_x: 130, img_y: 460 },
			{ id: 'chameleon', name: 'Chameleon', start_x: 1, start_y: 4, direction: 'diagonalDown', side: 'right', img_x: 10, img_y: 575 },
			{ id: 'fossa', name: 'Fossa', start_x: 1, start_y: 3, direction: 'horizontal', side: 'right', img_x: 160, img_y: 755 },
		],
		[	//	Game 3
			{ id: 'pygmymarmoset', name: 'Pygmy Marmoset', start_x: 1, start_y: 1, direction: 'vertical', side: 'left', img_x: 80, img_y: 70 },
			{ id: 'harvestmouse', name: 'Harvest Mouse', start_x: 12, start_y: 2, direction: 'vertical', side: 'left', img_x: 5, img_y: 100 },
			{ id: 'tarantula', name: 'Tarantula', start_x: 3, start_y: 12, direction: 'horizontal', side: 'left', img_x: 170, img_y: 330 },
			{ id: 'zebrahelicon', name: 'Zebra Helicon', start_x: 2, start_y: 10, direction: 'horizontal', side: 'left', img_x: 5, img_y: 450 },
			{ id: 'mara', name: 'Mara', start_x: 7, start_y: 2, direction: 'horizontal', side: 'left', img_x: 170, img_y: 600 },
			{ id: 'degu', name: 'Degu', start_x: 5, start_y: 0, direction: 'horizontal', side: 'left', img_x: 0, img_y: 750 },
			{ id: 'brownlemur', name: 'Brown Lemur', start_x: 0, start_y: 9, direction: 'diagonalUp', side: 'right', img_x: 40, img_y: 30 },
			{ id: 'stickinsect', name: 'Stick Insect', start_x: 11, start_y: 1, direction: 'vertical', side: 'right', img_x: 260, img_y: 40 },
			{ id: 'meerkat', name: 'Meerkat', start_x: 2, start_y: 11, direction: 'diagonalUp', side: 'right', img_x: 5, img_y: 380 },
			{ id: 'clownfish', name: 'Clownfish', start_x: 2, start_y: 0, direction: 'diagonalDown', side: 'right', img_x: 180, img_y: 390 },
			{ id: 'potoroo', name: 'Potoroo', start_x: 1, start_y: 1, direction: 'diagonalDown', side: 'right', img_x: 240, img_y: 610 },
			{ id: 'tortoise', name: 'Tortoise', start_x: 3, start_y: 12, direction: 'diagonalUp', side: 'right', img_x: 20, img_y: 760 },
		],
		[	//	Game 4
			{ id: 'waterdragon', name: 'Water Dragon', start_x: 11, start_y: 0, direction: 'vertical', side: 'left', img_x: 0, img_y: 50 },
			{ id: 'fruitbat', name: 'Fruit Bat', start_x: 4, start_y: 13, direction: 'horizontal', side: 'left', img_x: 50, img_y: 170 },
			{ id: 'brownlemur', name: 'Brown Lemur', start_x: 3, start_y: 4, direction: 'diagonalDown', side: 'left', img_x: 270, img_y: 190 },
			{ id: 'tortoise', name: 'Tortoise', start_x: 2, start_y: 7, direction: 'diagonalUp', side: 'left', img_x: 170, img_y: 495 },
			{ id: 'millipede', name: 'Millipede', start_x: 1, start_y: 0, direction: 'horizontal', side: 'left', img_x: 0, img_y: 645 },
			{ id: 'monal', name: 'Monal', start_x: 0, start_y: 4, direction: 'diagonalDown', side: 'left', img_x: 175, img_y: 730 },
			{ id: 'treefrog', name: 'Tree Frog', start_x: 6, start_y: 6, direction: 'horizontal', side: 'right', img_x: 70, img_y: 30 },
			{ id: 'scorpion', name: 'Scorpion', start_x: 12, start_y: 0, direction: 'vertical', side: 'right', img_x: 120, img_y: 240 },
			{ id: 'harvestmouse', name: 'Harvest Mouse', start_x: 2, start_y: 12, direction: 'horizontal', side: 'right', img_x: 15, img_y: 350 },
			{ id: 'cichlid', name: 'Cichlid', start_x: 2, start_y: 2, direction: 'horizontal', side: 'right', img_x: 140, img_y: 500 },
			{ id: 'redsquirrel', name: 'Red Squirrel', start_x: 0, start_y: 10, direction: 'horizontal', side: 'right', img_x: 195, img_y: 630 },
			{ id: 'tokaygecko', name: 'Tokay Gecko', start_x: 1, start_y: 4, direction: 'vertical', side: 'right', img_x: 10, img_y: 700 },
		],
		[	//	Game 5
			{ id: 'cricket', name: 'Cricket', start_x: 4, start_y: 9, direction: 'horizontal', side: 'left', img_x: 0, img_y: 60 },
			{ id: 'zebrahelicon', name: 'Zebra Helicon', start_x: 12, start_y: 2, direction: 'vertical', side: 'left', img_x: 190, img_y: 190 },
			{ id: 'fossa', name: 'Fossa', start_x: 5, start_y: 0, direction: 'diagonalDown', side: 'left', img_x: 0, img_y: 310 },
			{ id: 'turaco', name: 'Turaco', start_x: 0, start_y: 5, direction: 'diagonalDown', side: 'left', img_x: 130, img_y: 510 },
			{ id: 'lungfish', name: 'Lungfish', start_x: 1, start_y: 1, direction: 'diagonalDown', side: 'left', img_x: 120, img_y: 640 },
			{ id: 'scorpion', name: 'Scorpion', start_x: 4, start_y: 1, direction: 'horizontal', side: 'left', img_x: 0, img_y: 830 },
			{ id: 'goldenpheasant', name: 'Golden Pheasant', start_x: 0, start_y: 13, direction: 'horizontal', side: 'right', img_x: 0, img_y: 20 },
			{ id: 'owlbutterfly', name: 'Owl Butterfly', start_x: 0, start_y: 0, direction: 'vertical', side: 'right', img_x: 30, img_y: 120 },
			{ id: 'treefrog', name: 'Tree Frog', start_x: 1, start_y: 5, direction: 'horizontal', side: 'right', img_x: 260, img_y: 230 },
			{ id: 'royalpython', name: 'Royal Python', start_x: 0, start_y: 8, direction: 'horizontal', side: 'right', img_x: 50, img_y: 420 },
			{ id: 'stickinsect', name: 'Stick Insect', start_x: 13, start_y: 3, direction: 'vertical', side: 'right', img_x: 350, img_y: 630 },
			{ id: 'tarantula', name: 'Tarantula', start_x: 10, start_y: 4, direction: 'vertical', side: 'right', img_x: 20, img_y: 700 },
		],
		[	//	Game 6
			{ id: 'bluepie', name: 'Bluepie', start_x: 1, start_y: 5, direction: 'vertical', side: 'left', img_x: 310, img_y: 20 },
			{ id: 'redsquirrel', name: 'Red Squirrel', start_x: 3, start_y: 3, direction: 'diagonalDown', side: 'left', img_x: 100, img_y: 120 },
			{ id: 'lungfish', name: 'Lungfish', start_x: 9, start_y: 4, direction: 'vertical', side: 'left', img_x: 0, img_y: 270 },
			{ id: 'fruitbat', name: 'Fruit Bat', start_x: 2, start_y: 3, direction: 'horizontal', side: 'left', img_x: 0, img_y: 420 },
			{ id: 'snowleopard', name: 'Snow Leopard', start_x: 11, start_y: 2, direction: 'vertical', side: 'left', img_x: 110, img_y: 610 },
			{ id: 'tarantula', name: 'Tarantula', start_x: 0, start_y: 3, direction: 'diagonalDown', side: 'left', img_x: 5, img_y: 825 },
			{ id: 'brownlemur', name: 'Brown Lemur', start_x: 1, start_y: 12, direction: 'horizontal', side: 'right', img_x: 20, img_y: 0 },
			{ id: 'pacu', name: 'Pacu', start_x: 3, start_y: 8, direction: 'diagonalDown', side: 'right', img_x: 220, img_y: 30 },
			{ id: 'monal', name: 'Monal', start_x: 5, start_y: 0, direction: 'diagonalDown', side: 'right', img_x: 180, img_y: 160 },
			{ id: 'clownfish', name: 'Clownfish', start_x: 4, start_y: 1, direction: 'horizontal', side: 'right', img_x: 180, img_y: 430 },
			{ id: 'cricket', name: 'Cricket', start_x: 13, start_y: 5, direction: 'vertical', side: 'right', img_x: 20, img_y: 570 },
			{ id: 'royalpython', name: 'Royal Python', start_x: 3, start_y: 3, direction: 'vertical', side: 'right', img_x: 150, img_y: 680 },
		],
		[	//	Game
			{ id: 'axolotl', name: 'Axolotl', start_x: 4, start_y: 2, direction: 'vertical', side: 'left', img_x: 0, img_y: 110 },
			{ id: 'harvestmouse', name: 'Harvest Mouse', start_x: 0, start_y: 12, direction: 'horizontal', side: 'left', img_x: 20, img_y: 250 },
			{ id: 'stickinsect', name: 'Stick Insect', start_x: 12, start_y: 2, direction: 'vertical', side: 'left', img_x: 180, img_y: 310 },
			{ id: 'meerkat', name: 'Meerkat', start_x: 3, start_y: 10, direction: 'horizontal', side: 'left', img_x: 290, img_y: 320 },
			{ id: 'chameleon', name: 'Chameleon', start_x: 2, start_y: 0, direction: 'diagonalDown', side: 'left', img_x: 0, img_y: 660 },
			{ id: 'waterdragon', name: 'Water Dragon', start_x: 8, start_y: 3, direction: 'vertical', side: 'left', img_x: 0, img_y: 830 },
			{ id: 'tortoise', name: 'Tortoise', start_x: 5, start_y: 8, direction: 'diagonalUp', side: 'right', img_x: 50, img_y: 30 },
			{ id: 'owlbutterfly', name: 'Owl Butterfly', start_x: 0, start_y: 9, direction: 'horizontal', side: 'right', img_x: 30, img_y: 230 },
			{ id: 'potoroo', name: 'Potoroo', start_x: 9, start_y: 1, direction: 'vertical', side: 'right', img_x: 275, img_y: 240 },
			{ id: 'tokaygecko', name: 'Tokay Gecko', start_x: 0, start_y: 0, direction: 'vertical', side: 'right', img_x: 200, img_y: 420 },
			{ id: 'canetoad', name: 'Cane Toad', start_x: 4, start_y: 0, direction: 'horizontal', side: 'right', img_x: 210, img_y: 700 },
			{ id: 'degu', name: 'Degu', start_x: 2, start_y: 3, direction: 'vertical', side: 'right', img_x: 10, img_y: 700 },
		]
	];

	firstLoad();
});