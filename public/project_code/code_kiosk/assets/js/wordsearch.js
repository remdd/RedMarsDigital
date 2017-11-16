$(document).ready(function() {

	$('body').fadeIn('slow');

	var sqHt = 58; 				// total height of individual grid square, including margin
	var ofSt = 5; 				// margin of rings around found words
	var animalObjects = 0; 		// counts instances of animal object
	var animalsFound = 0; 		// counts number of animals found by user
	var animals = []; 			// array of animal objects
	var colFirst;				// column of first selected square
	var rowFirst;				// row of first selected square
	var colSecond;				// column of second selected square
	var rowSecond;				// row of second selected square
	var colHover;				// column of square hovered after first square has been selected
	var rowHover;				// row of square hovered after first square has been selected
	var guess;					// guessed string
	var revGuess;				// guessed string reversed
	var found;					//
	var handle = '';			// timer handle
	var timer = 0;				// timer
	var grid = document.querySelectorAll(".square");
	var rows = document.querySelectorAll(".row").length;
	var overlay = document.getElementById("gridCanvas");
	var cols = document.querySelectorAll("#firstRow .square").length;
	var firstSelected = false;
	var commonLetters = ["E", "T", "A", "O", "I", "N", "S", "H", "R"];  // used for random letter generation in blank squares
	var uncommLetters = ["D", "L", "C", "U", "M", "W", "F", "G"];
	var rarestLetters = ["Y", "P", "B", "V", "K", "J", "X", "Q", "Z"];
	var gameNumber = 0;			// grid number to be played
	var numberOfGames = 7;		// need to manually increment when new grids are added, counts from zero
	var gameArray = [];			// holds an array of numbers from 0 to numberOfGames - this is shuffled on first load & used to load games by number 
	var startModal = document.getElementById("startPopup");
	var hintModal = document.getElementById("hintPopup");
	var winModal = document.getElementById("winPopup");
	var startBtn = document.getElementById("startBtn");
	var hintBtn = document.getElementById("hintBtn");
	var divAll = document.getElementById("divAll");
	var newGameBtn = document.getElementById("newGameBtn");

	// Navigation, fade page
	$('.mainMenuLink').click(function(event) {
		event.preventDefault();
		newLocation = this.href;
		$('html').fadeOut('slow', newpage);
	});
	$('#mainMenuBtnLink').click(function(event) {
		event.preventDefault();
		newLocation = this.href;
		$('html').fadeOut('slow', newpage);
	});
	function newpage() {
		window.location = newLocation;
	}

	//	Called on first load - shuffles array of available games into random order, then steps through sequentially
	function initialize() {
		newGameBtn.addEventListener("click", function() {
			gameNumber++;
			if(gameNumber > numberOfGames) {gameNumber = 0};
		clearDown();
		});
		for (var i = 0; i <= numberOfGames; i++) {
			gameArray[i] = i;
		}
		shuffle(gameArray);
		console.log(gameArray);
		startModal.style.display = "block";
		startBtn.addEventListener("click", newGame);
	}

	//	Shuffle array to random order
	function shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex;
	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {
	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;
	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }
	  return array;
	}

	function newGame() {
		startModal.style.display = "none";
		winModal.style.display = "none";
		animalObjects = 0;
		animalsFound = 0;
		animals = [];
		firstSelected = false;
		setupAnimals(gameArray[gameNumber]);
		addRandomLetters();
		hintBtn.onclick = function() {
			hintModal.style.display = "block";
			hint();
		};
		$('#divAll').fadeIn('slow');
	};

	// Wipes images from all canvases and removes letters from grid
	function clearDown() {
		$('#divAll').fadeOut('slow', function(){
			var canvas = document.getElementById("leftCanvas");
			var ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			canvas = document.getElementById("rightCanvas");
			ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			canvas = document.getElementById("gridCanvas");
			ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			grid = document.querySelectorAll(".square");
			for(var i = 0; i < grid.length; i++) {
				grid[i].textContent = "";
				grid[i].classList.remove("chosen");
			}
			for(var i = 0; i < animals.length; i++) {
				var hintAnimal = document.querySelector('[data-hintLi="' + i + '"]');
				hintAnimal.textContent = "";
				hintAnimal.classList.remove("foundName");
				hintAnimal.classList.remove("notFoundName");
			};
			newGame();
		});
	};

	function checkIfWon() {
		if(animalsFound === animals.length) {
			winModal.style.display = "block";
		};
	};

	var touchX;
	var touchY;
	var touchedElement;

	//	Handle touch drag & touch end events
	$('#gridDiv').on("touchmove", function(event) {
		stopHover();
		touchedElement = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
		if($(touchedElement).hasClass("square")) {
			secondHover(touchedElement);
		}
	});
	$('#gridDiv').on("touchend touchcancel", function(event) {
		stopHover();
		if($(touchedElement).hasClass("square")) {
			secondClick(touchedElement);
		}
	});

	// Cycle through divs to add click listeners
	for(var i = 0; i < grid.length; i++) {
		$(grid[i]).on("touchstart click", function(event) {
			if(!firstSelected) {
				stopHover();
				firstClick(this);
			} else {
				secondClick(this);
			}
		});
	};

	//	Display clues
	function hint(){
		for(var i = 0; i < animals.length; i++) {
			var hintAnimal = document.querySelector('[data-hintLi="' + i + '"]');
			hintAnimal.textContent = animals[i].displayName;
			if(animals[i].found === true) {
				hintAnimal.classList.remove("notFoundName");
				hintAnimal.classList.add("foundName");
			} else {
				hintAnimal.classList.add("notFoundName");
			};
		};
		hintModal.addEventListener("click", function() {
			hintModal.style.display = "none";
		});
	};

	function secondHover(obj){
		obj.classList.add("hovered");
		colHover = Number(obj.getAttribute("data-col"));
		rowHover = Number(obj.getAttribute("data-row"));
		var first = document.querySelector(".first");
		firstCol = Number(first.getAttribute("data-col"));
		firstRow = Number(first.getAttribute("data-row"));
		if(firstRow === rowHover) {
			if(firstCol < colHover) {
				for(var i = (firstCol + (firstRow * cols)); i <= (colHover + (rowHover * cols)); i++) {
					grid[i].classList.add("hovered");
				};
			} else if(firstCol > colHover) {
				for(var i = (firstCol + (firstRow * cols)); i >= (colHover + (rowHover * cols)); i--) {
					grid[i].classList.add("hovered");
				};
			};
		} else if(firstCol === colHover) {
			if(firstRow < rowHover) {
				for(var i = (firstCol + (firstRow * cols)); i <= (colHover + (rowHover * cols)); i += cols) {
					grid[i].classList.add("hovered");
				};
			} else if(firstRow > rowHover) {
				for(var i = (firstCol + (firstRow * cols)); i >= (colHover + (rowHover * cols)); i -= cols) {
					grid[i].classList.add("hovered");
				};
			};
		} else if(colHover - firstCol === rowHover - firstRow) {
			if(firstRow < rowHover) {
				for(var i = (firstCol + (firstRow * cols)); i <= (colHover + (rowHover * cols)); i += (cols + 1)) {
					grid[i].classList.add("hovered");
				};
			} else if(firstRow > rowHover) {
				for(var i = (firstCol + (firstRow * cols)); i >= (colHover + (rowHover * cols)); i -= (cols + 1)) {
					grid[i].classList.add("hovered");
				};
			};
		} else if(colHover - firstCol === firstRow - rowHover) {
			if(firstRow > rowHover) {
				for(var i = (firstCol + (firstRow * cols)); i >= (colHover + (rowHover * cols)); i -= (cols - 1)) {
					grid[i].classList.add("hovered");
				};
			} else if(firstRow < rowHover) {
				for(var i = (firstCol + (firstRow * cols)); i <= (colHover + (rowHover * cols)); i += (cols - 1)) {
					grid[i].classList.add("hovered");
				};
			};
		};		
	};

	function stopHover(){
		for(var i = 0; i < grid.length; i++) {
			grid[i].classList.remove("hovered");
		};
	};

	// Animal constructor
	function Animal(name, displayName, x1, y1, direction, imgSide, imgX, imgY) {
		this.name = name;
		this.displayName = displayName;
		this.upperName = this.name.toUpperCase();
		this.letters = this.upperName.split("");
		this.x1 = x1;					// col of first letter
		this.y1 = y1;					// row of first letter
		this.direction = direction;		// direction name is written in grid
		this.imgSide = imgSide;			// Image on left or right canvas
		this.id = animalObjects;
		animalObjects++;
		animals.push(this);
		this.imgX = imgX;				//	x co-ord of image on side canvas
		this.imgY = imgY;				//	y co-ord of image on side canvas
		this.found = false;				//	
		this.writeInGrid = function() {
			if(this.direction === "horizontal") {
				for(var i = 0; i < this.letters.length; i++){
					var square = document.querySelector('[data-rowno="' + (this.y1) + '"] [data-col="' + (this.x1 + i) + '"]');
					square.textContent = this.letters[i];
				};
			} else if(this.direction === "vertical") {
				for(var i = 0; i < this.letters.length; i++){
					var square = document.querySelector('[data-rowno="' + (this.y1 + i) + '"] [data-col="' + (this.x1) + '"]');
					square.textContent = this.letters[i];
				};
			} else if(this.direction === "diagonalUp") {
				for(var i = 0; i < this.letters.length; i++){
					var square = document.querySelector('[data-rowno="' + (this.y1 - i) + '"] [data-col="' + (this.x1 + i) + '"]');
					square.textContent = this.letters[i];
				};
			} else if(this.direction === "diagonalDown") {
				for(var i = 0; i < this.letters.length; i++){
					var square = document.querySelector('[data-rowno="' + (this.y1 + i) + '"] [data-col="' + (this.x1 + i) + '"]');
					square.textContent = this.letters[i];
				};
			};
		};
		this.writeInGrid();
		drawImage(this.name, this.imgSide, this.imgX, this.imgY);
		this.colourIn = function() {
			var canvas = document.getElementById(this.imgSide + "Canvas");
			var ctx = canvas.getContext("2d");
			var alpha = 0.0;
			var imageObj = new Image();
			imageObj.src = "assets/img/wordsearch/" + this.name + "-colour.png";
			var x = this.imgX;
			var y = this.imgY;
			function fadeIn() {
				if(alpha >= 1) {
					return;
				}
				requestAnimationFrame(fadeIn);
				ctx.globalAlpha = alpha;
				ctx.drawImage(imageObj, x, y);
				alpha += 0.03;
			};
			fadeIn();
		};
	};

	// Cycle through the grid and add a random letter to all empty squares
	function addRandomLetters() {
		for(var i = 0; i < grid.length; i++) {
			if(grid[i].textContent === "") {
				var rand = Math.floor(Math.random() * 10);
				if(rand <= 4) {
					var rand2 = Math.floor(Math.random() * 9);
					grid[i].textContent = commonLetters[rand2];
				} else if(rand <= 7) {
					var rand2 = Math.floor(Math.random() * 8);
					grid[i].textContent = uncommLetters[rand2];
				} else {
					var rand2 = Math.floor(Math.random() * 9);
					grid[i].textContent = rarestLetters[rand2];
				};
			};
		};
	};

	// Event listeners
	function firstClick(obj) {
		obj.classList.add("first");
		firstSelected = true;
		colFirst = Number(obj.getAttribute("data-col"));
		rowFirst = Number(obj.getAttribute("data-row"));
	};
	function secondClick(obj) {
		colSecond = Number(obj.getAttribute("data-col"));
		rowSecond = Number(obj.getAttribute("data-row"));
		obj.classList.remove("hovered");
		// logic to test whether letters between first and second choice are a winning word
		guess = "";
		if(rowFirst === rowSecond) {
			if(colFirst < colSecond) {
				for(var i = (colFirst + (rowFirst * cols)); i <= (colSecond + (rowSecond * cols)); i++) {
					guess += grid[i].textContent;
					grid[i].classList.add("chosen");
				};
				for(var i = 0; i < animals.length; i++) {
					if(guess === animals[i].upperName) {
						animals[i].found = true;
						found = animals[i];
						ringRoundHorizontal(colFirst, rowFirst, colSecond, rowSecond);
						animalsFound++;
						found.colourIn();
					};
				}; 
			} else {
				for(var i = (colFirst + (rowFirst * cols)); i >= (colSecond + (rowSecond * cols)); i--) {
					guess += grid[i].textContent;
					grid[i].classList.add("chosen");
				};
				revGuess = reverseGuess(guess);
				for(var i = 0; i < animals.length; i++) {
					if(revGuess === animals[i].upperName) {
						animals[i].found = true;
						found = animals[i];
						ringRoundHorizontal(colSecond, rowSecond, colFirst, rowFirst);
						animalsFound++;
						found.colourIn();
					};
				};
			};
		} else if(colFirst === colSecond) {
			if(rowFirst < rowSecond) {
				for(var i = (colFirst + (rowFirst * cols)); i <= (colSecond + (rowSecond * cols)); i += cols) {
					guess += grid[i].textContent;
					grid[i].classList.add("chosen");
				};
				for(var i = 0; i < animals.length; i++) {
					if(guess === animals[i].upperName) {
						animals[i].found = true;
						found = animals[i];
						ringRoundVertical(colFirst, rowFirst, colSecond, rowSecond);
						animalsFound++;
						found.colourIn();
					};
				};
			} else {
				for(var i = (colFirst + (rowFirst * cols)); i >= (colSecond + (rowSecond * cols)); i -= cols) {
					guess += grid[i].textContent;
					grid[i].classList.add("chosen");
				};
				revGuess = reverseGuess(guess);
				for(var i = 0; i < animals.length; i++) {
					if(revGuess === animals[i].upperName) {
						animals[i].found = true;
						found = animals[i];
						ringRoundVertical(colSecond, rowSecond, colFirst, rowFirst);
						animalsFound++;
						found.colourIn();
					};
				};
			};
		} else if(colSecond - colFirst === rowSecond - rowFirst) {
			if(rowFirst < rowSecond) {
				for(var i = (colFirst + (rowFirst * cols)); i <= (colSecond + (rowSecond * cols)); i += (cols + 1)) {
					guess += grid[i].textContent;
					grid[i].classList.add("chosen");
				};
				for(var i = 0; i < animals.length; i++) {
					if(guess === animals[i].upperName) {
						animals[i].found = true;
						found = animals[i];
						ringRoundDiagonalDown(colFirst, rowFirst, colSecond, rowSecond);
						animalsFound++;
						found.colourIn();
					};
				};
			} else {
				for(var i = (colFirst + (rowFirst * cols)); i >= (colSecond + (rowSecond * cols)); i -= (cols + 1)) {
					guess += grid[i].textContent;
					grid[i].classList.add("chosen");
				};
				revGuess = reverseGuess(guess);
				for(var i = 0; i < animals.length; i++) {
					if(revGuess === animals[i].upperName) {
						animals[i].found = true;
						found = animals[i];
						ringRoundDiagonalDown(colSecond, rowSecond, colFirst, rowFirst);
						animalsFound++;
						found.colourIn();
					};
				};
			};
		} else if(colSecond - colFirst === rowFirst - rowSecond) {
			if(rowFirst > rowSecond) {
				for(var i = (colFirst + (rowFirst * cols)); i >= (colSecond + (rowSecond * cols)); i -= (cols - 1)) {
					guess += grid[i].textContent;
					grid[i].classList.add("chosen");
				};
				for(var i = 0; i < animals.length; i++) {
					if(guess === animals[i].upperName) {
						animals[i].found = true;
						found = animals[i];
						ringRoundDiagonalUp(colFirst, rowFirst, colSecond, rowSecond);
						animalsFound++;
						found.colourIn();
					};
				};
			} else {
				for(var i = (colFirst + (rowFirst * cols)); i <= (colSecond + (rowSecond * cols)); i += (cols - 1)) {
					guess += grid[i].textContent;
					grid[i].classList.add("chosen");
				};
				revGuess = reverseGuess(guess);
				for(var i = 0; i < animals.length; i++) {
					if(revGuess === animals[i].upperName) {
						animals[i].found = true;
						found = animals[i];
						ringRoundDiagonalUp(colSecond, rowSecond, colFirst, rowFirst);
						animalsFound++;
						found.colourIn();
					};
				};
			};
		};
		firstSelected = false;
		for(var i = 0; i < grid.length; i++) {
			grid[i].classList.remove("first", "hovered");
		};
		setTimeout(clearSelected, 700);
		setTimeout(checkIfWon, 1500);
	};

	function clearSelected() {
		for(var i = 0; i < grid.length; i++) {
			grid[i].classList.remove("chosen");
		};
	};

	// Reverses the guessed string to test back-to-front selection
	function reverseGuess(guess) {
		var splitGuess = guess.split("");
		var reverseGuessArray = splitGuess.reverse();
		var revGuess = reverseGuessArray.join("");
		return revGuess;
	};

	// Ring drawing functions for found words
	function ringRoundHorizontal(x1, y1, x2, y2) {
		var ctx = overlay.getContext("2d");
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
		var ctx = overlay.getContext("2d");
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
		var ctx = overlay.getContext("2d");
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
		var ctx = overlay.getContext("2d");
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

	//	Draw initial shadowed animal image 
	function drawImage(name, imgSide, imgX, imgY) {
		var imgSide = imgSide;
		var name = name;
		var imgX = imgX;
		var imgY = imgY;
		var canvas = document.getElementById(imgSide + "Canvas");
		var ctx = canvas.getContext("2d");
		ctx.globalAlpha = 0.5;
		ctx.shadowColor = "#bbbbbb";
		ctx.shadowBlur = 3;
		var imageObj = new Image();
		imageObj.onload = function() {
			ctx.drawImage(imageObj, imgX, imgY);
			var w = imageObj.naturalWidth;
			var h = imageObj.naturalHeight;
		};
		imageObj.src = "assets/img/wordsearch/" + name + "-black.png";
	};

	// When adding a new grid, add in the order to appear in side canvases & help list: 1-6 left then 1-6 right
	function setupAnimals(num) {
		switch (num) {
			case 0:
				var mara = new Animal("mara", "Mara", 8, 2, "vertical", "left", 50, 80);
				var pacu = new Animal("pacu", "Pacu", 3, 5, "horizontal", "left", 210, 280);
				var leafcutterant = new Animal("leafcutterant", "Leafcutter Ant", 1, 1, "horizontal", "left", 5, 300);
				var redsquirrel = new Animal("redsquirrel", "Red Squirrel", 1, 0, "diagonalDown", "left", 200, 460);
				var bluepie = new Animal("bluepie", "Bluepie", 0, 6, "vertical", "left", 25, 540);
				var pygmymarmoset = new Animal("pygmymarmoset", "Pygmy Marmoset", 1, 13, "diagonalUp", "left", 160, 695);
				var turaco = new Animal("turaco", "Turaco", 5, 0, "diagonalDown", "right", 170, 50);
				var degu = new Animal("degu", "Degu", 1, 11, "horizontal", "right", 10, 60);
				var axolotl = new Animal("axolotl", "Axolotl", 2, 3, "vertical", "right", 165, 310);
				var chameleon = new Animal("chameleon", "Chameleon", 5, 13, "diagonalUp", "right", 60, 445);
				var snowleopard = new Animal("snowleopard", "Snow Leopard", 0, 3, "diagonalDown", "right", 135, 700);
				var canetoad = new Animal("canetoad", "Cane Toad", 13, 3, "vertical", "right", 20, 645);
				break;
			case 1:
				var cricket = new Animal("cricket", "Cricket", 13, 4, "vertical", "left", 205, 80);
				var lungfish = new Animal("lungfish", "Lungfish", 3, 0, "diagonalDown", "left", 0, 130);
				var canetoad = new Animal("canetoad", "Cane Toad", 12, 0, "vertical", "left", 0, 330);
				var millipede = new Animal("millipede", "Millipede", 0, 12, "diagonalUp", "left", 200, 460);
				var clownfish = new Animal("clownfish", "Clownfish", 5, 11, "horizontal", "left", 20, 580);
				var goldenpheasant = new Animal("goldenpheasant", "Golden Pheasant", 0, 2, "horizontal", "left", 10, 810);
				var waterdragon = new Animal("waterdragon", "Water Dragon", 2, 12, "diagonalUp", "right", 5, 40);
				var owlbutterfly = new Animal("owlbutterfly", "Owl Butterfly", 1, 2, "diagonalDown", "right", 245, 190);
				var tokaygecko = new Animal("tokaygecko", "Tokay Gecko", 1, 1, "vertical", "right", 25, 220);
				var mara = new Animal("mara", "Mara", 9, 1, "vertical", "right", 150, 460);
				var potoroo = new Animal("potoroo", "Potoroo", 0, 13, "horizontal", "right", 10, 650);
				var monal = new Animal("monal", "Monal", 5, 0, "vertical", "right", 170, 670);
				break;
			case 2:
				var snowleopard = new Animal("snowleopard", "Snow Leopard", 0, 12, "diagonalUp", "left", 100, 50);
				var pacu = new Animal("pacu", "Pacu", 11, 0, "vertical", "left", 0, 275);
				var leafcutterant = new Animal("leafcutterant", "Leafcutter Ant", 1, 0, "vertical", "left", 245, 350);
				var meerkat = new Animal("meerkat", "Meerkat", 6, 11, "diagonalUp", "left", 0, 430);
				var royalpython = new Animal("royalpython", "Royal Python", 2, 0, "diagonalDown", "left", 130, 600);
				var axolotl = new Animal("axolotl", "Axolotl", 11, 7, "vertical", "left", 25, 860);
				var turaco = new Animal("turaco", "Turaco", 7, 1, "diagonalDown", "right", 115, 50);
				var bluepie = new Animal("bluepie", "Bluepie", 4, 10, "horizontal", "right", 10, 100);
				var fruitbat = new Animal("fruitbat", "Fruit Bat", 13, 1, "vertical", "right", 280, 105);
				var cichlid = new Animal("cichlid", "Cichlid", 7, 13, "horizontal", "right", 130, 460);
				var chameleon = new Animal("chameleon", "Chameleon", 1, 4, "diagonalDown", "right", 10, 575);
				var fossa = new Animal("fossa", "Fossa", 1, 3, "horizontal", "right", 160, 755);
				break;
			case 3:
				var pygmymarmoset = new Animal("pygmymarmoset", "Pygmy Marmoset", 1, 1, "vertical", "left", 80, 70);
				var harvestmouse = new Animal("harvestmouse", "Harvest Mouse", 12, 2, "vertical", "left", 5, 100);
				var tarantula = new Animal("tarantula", "Tarantula", 3, 12, "horizontal", "left", 170, 330);
				var zebrahelicon = new Animal("zebrahelicon", "Zebra Helicon", 2, 10, "horizontal", "left", 5, 450);
				var mara = new Animal("mara", "Mara", 7, 2, "horizontal", "left", 170, 600);
				var degu = new Animal("degu", "Degu", 5, 0, "horizontal", "left", 0, 750);
				var brownlemur = new Animal("brownlemur", "Brown Lemur", 0, 9, "diagonalUp", "right", 40, 30);
				var stickinsect = new Animal("stickinsect", "Stick Insect", 11, 1, "vertical", "right", 260, 40);
				var meerkat = new Animal("meerkat", "Meerkat", 2, 11, "diagonalUp", "right", 5, 380);
				var clownfish = new Animal("clownfish", "Clownfish", 2, 0, "diagonalDown", "right", 180, 390);
				var potoroo = new Animal("potoroo", "Potoroo", 1, 1, "diagonalDown", "right", 240, 610);
				var tortoise = new Animal("tortoise", "Tortoise", 3, 12, "diagonalUp", "right", 20, 760);
				break;
			case 4:
				var waterdragon = new Animal("waterdragon", "Water Dragon", 11, 0, "vertical", "left", 0, 50);
				var fruitbat = new Animal("fruitbat", "Fruit Bat", 4, 13, "horizontal", "left", 50, 170);
				var brownlemur = new Animal("brownlemur", "Brown Lemur", 3, 4, "diagonalDown", "left", 270, 190);
				var tortoise = new Animal("tortoise", "Tortoise", 2, 7, "diagonalUp", "left", 170, 495);
				var millipede = new Animal("millipede", "Millipede", 1, 0, "horizontal", "left", 0, 645);
				var monal = new Animal("monal", "Monal", 0, 4, "diagonalDown", "left", 175, 730);
				var treefrog = new Animal("treefrog", "Tree Frog", 6, 6, "horizontal", "right", 70, 30);
				var scorpion = new Animal("scorpion", "Scorpion", 12, 0, "vertical", "right", 120, 240);
				var harvestmouse = new Animal("harvestmouse", "Harvest Mouse", 2, 12, "horizontal", "right", 15, 350);
				var cichlid = new Animal("cichlid", "Cichlid", 2, 2, "horizontal", "right", 140, 500);
				var redsquirrel = new Animal("redsquirrel", "Red Squirrel", 0, 10, "horizontal", "right", 195, 630);
				var tokaygecko = new Animal("tokaygecko", "Tokay Gecko", 1, 4, "vertical", "right", 10, 700);
				break;
			case 5:
				var cricket = new Animal("cricket", "Cricket", 4, 9, "horizontal", "left", 0, 60);
				var zebrahelicon = new Animal("zebrahelicon", "Zebra Helicon", 12, 2, "vertical", "left", 190, 190);
				var fossa = new Animal("fossa", "Fossa", 5, 0, "diagonalDown", "left", 0, 310);
				var turaco = new Animal("turaco", "Turaco", 0, 5, "diagonalDown", "left", 130, 510);
				var lungfish = new Animal("lungfish", "Lungfish", 1, 1, "diagonalDown", "left", 120, 640);
				var scorpion = new Animal("scorpion", "Scorpion", 4, 1, "horizontal", "left", 0, 830);
				var goldenpheasant = new Animal("goldenpheasant", "Golden Pheasant", 0, 13, "horizontal", "right", 0, 20);
				var owlbutterfly = new Animal("owlbutterfly", "Owl Butterfly", 0, 0, "vertical", "right", 30, 120);
				var treefrog = new Animal("treefrog", "Tree Frog", 1, 5, "horizontal", "right", 260, 230);
				var royalpython = new Animal("royalpython", "Royal Python", 0, 8, "horizontal", "right", 50, 420);
				var stickinsect = new Animal("stickinsect", "Stick Insect", 13, 3, "vertical", "right", 350, 630);
				var tarantula = new Animal("tarantula", "Tarantula", 10, 4, "vertical", "right", 20, 700);
				break;
			case 6:
				var bluepie = new Animal("bluepie", "Bluepie", 1, 5, "vertical", "left", 310, 20);
				var redsquirrel = new Animal("redsquirrel", "Red Squirrel", 3, 3, "diagonalDown", "left", 100, 120);
				var lungfish = new Animal("lungfish", "Lungfish", 9, 4, "vertical", "left", 0, 270);
				var fruitbat = new Animal("fruitbat", "Fruit Bat", 2, 3, "horizontal", "left", 0, 420);
				var snowleopard = new Animal("snowleopard", "Snow Leopard", 11, 2, "vertical", "left", 110, 610);
				var tarantula = new Animal("tarantula", "Tarantula", 0, 3, "diagonalDown", "left", 5, 825);
				var brownlemur = new Animal("brownlemur", "Brown Lemur", 1, 12, "horizontal", "right", 20, 0);
				var pacu = new Animal("pacu", "Pacu", 3, 8, "diagonalDown", "right", 220, 30);
				var monal = new Animal("monal", "Monal", 5, 0, "diagonalDown", "right", 180, 160);
				var clownfish = new Animal("clownfish", "Clownfish", 4, 1, "horizontal", "right", 180, 430);
				var cricket = new Animal("cricket", "Cricket", 13, 5, "vertical", "right", 20, 570);
				var royalpython = new Animal("royalpython", "Royal Python", 3, 3, "vertical", "right", 150, 680);
				break;
			case 7:
				var axolotl = new Animal("axolotl", "Axolotl", 4, 2, "vertical", "left", 0, 110);
				var harvestmouse = new Animal("harvestmouse", "Harvest Mouse", 0, 12, "horizontal", "left", 20, 250);
				var stickinsect = new Animal("stickinsect", "Stick Insect", 12, 2, "vertical", "left", 180, 310);
				var meerkat = new Animal("meerkat", "Meerkat", 3, 10, "horizontal", "left", 290, 320);
				var chameleon = new Animal("chameleon", "Chameleon", 2, 0, "diagonalDown", "left", 0, 660);
				var waterdragon = new Animal("waterdragon", "Water Dragon", 8, 3, "vertical", "left", 0, 830);
				var tortoise = new Animal("tortoise", "Tortoise", 5, 8, "diagonalUp", "right", 50, 30);
				var owlbutterfly = new Animal("owlbutterfly", "Owl Butterfly", 0, 9, "horizontal", "right", 30, 230);
				var potoroo = new Animal("potoroo", "Potoroo", 9, 1, "vertical", "right", 275, 240);
				var tokaygecko = new Animal("tokaygecko", "Tokay Gecko", 0, 0, "vertical", "right", 200, 420);
				var canetoad = new Animal("canetoad", "Cane Toad", 4, 0, "horizontal", "right", 210, 700);
				var degu = new Animal("degu", "Degu", 2, 3, "vertical", "right", 10, 700);
				break;
			default:
				break;
		};
	};

	hintBtn.addEventListener("mouseover", function() {
		document.getElementById("hintBulb").src = "assets/img/wordsearch/pawbulb-lit.png";
	});
	hintBtn.addEventListener("mouseout", function() {
		document.getElementById("hintBulb").src = "assets/img/wordsearch/pawbulb.png";
	});

	initialize();

});

