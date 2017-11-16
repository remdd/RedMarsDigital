$(document).ready(function(){

	$('body').fadeIn('slow');

	var whoAmI = {}				// whoAmI namespace declaration & variables

	whoAmI.allAnimals = [];		// array to hold available animal objects
	whoAmI.game = 0;			// number of game to load
	whoAmI.clueNo = 0;			// latest clue to display, increments on timer
	whoAmI.roundNumber = 0;		// game number within current round
	whoAmI.roundsToPlay = 5;	// number of games to play in a round
	whoAmI.wrongGuesses = 0;	// counts number of wrong guesses made for score calc
	whoAmI.roundScore = 0;		// score for current game
	whoAmI.totalScore = 0;		// total score for current round
	whoAmI.handle = "";			// timer handler
	whoAmI.rightChoice = 0;		// idenitifes correct button
	whoAmI.imgClue1 = 0;		// identifies no of clue on which first clue image is revealed
	whoAmI.imgClue2 = 0;		// identifies no of clue on which second clue image is revealed
	whoAmI.startBtn = document.querySelector("#startBtn");
	whoAmI.choiceBtns = document.querySelectorAll(".choiceBtn");
	whoAmI.photo = document.querySelector("#mainPhoto");
	whoAmI.clueList = document.querySelector("#clueList");
	whoAmI.clueImg1 = document.querySelector("#clueImg1");
	whoAmI.clueImg2 = document.querySelector("#clueImg2");
	whoAmI.clueImgDiv1 = document.querySelector("#clueImgDiv1");
	whoAmI.clueImgDiv2 = document.querySelector("#clueImgDiv2");
	whoAmI.firstLoadModal = document.getElementById("firstLoadModal");
	whoAmI.firstStartBtn = document.getElementById("firstStartBtn");	
	whoAmI.winRoundModal = document.getElementById("winRoundModal");
	whoAmI.endRoundModal = document.getElementById("endRoundModal");
	whoAmI.spanScore = document.getElementById("spanScore");
	whoAmI.spanRoundScore = document.getElementById("spanRoundScore");
	whoAmI.nextRoundNoSpan = document.getElementById("nextRoundNoSpan");
	whoAmI.lastRoundNoSpan = document.getElementById("lastRoundNoSpan");
	whoAmI.winModalNextBtn = document.getElementById("winModalNextBtn");
	whoAmI.lastGameFooterBtn = document.getElementById("lastGameFooterBtn");
	whoAmI.animalNameSpan = document.getElementById("animalNameSpan");
	whoAmI.timeBar = document.querySelector("#timeLeft");
	whoAmI.lastGameFooterBtn = document.querySelector("#lastGameFooterBtn");
	whoAmI.newGameBtn = document.querySelector("#newGameBtn");
	whoAmI.outOfTimeModal = document.querySelector("#outOfTimeModal");
	whoAmI.winModalNextBtnTimeout = document.getElementById("winModalNextBtnTimeout");
	whoAmI.lastGameFooterBtnTimeout = document.getElementById("lastGameFooterBtnTimeout");
	whoAmI.nextRoundNoSpanTimeout = document.getElementById("nextRoundNoSpanTimeout");
	whoAmI.animalNameSpanTimeout = document.getElementById("animalNameSpanTimeout");
	whoAmI.divAll = document.getElementById("divAll");

	// Navigation, fade page
	$('#mainMenuModalBtn').click(function(event) {
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

	function firstLoad() {
		whoAmI.firstLoadModal.style.display = "block";
		whoAmI.firstStartBtn.addEventListener("click", newRound);
	}

	function newRound() {
		whoAmI.firstLoadModal.style.display = "none";
		whoAmI.endRoundModal.style.display = "none";
		whoAmI.outOfTimeModal.style.display = "none";
		if(whoAmI.allAnimals.length < whoAmI.roundsToPlay) {
			whoAmI.allAnimals = loadAnimals();
		};
		console.log("new session!");
		whoAmI.roundNumber = 0;
		whoAmI.totalScore = 0;
		whoAmI.winModalNextBtn.addEventListener("click", newGame);
		whoAmI.winModalNextBtnTimeout.addEventListener("click", newGame);
		whoAmI.lastGameFooterBtn.addEventListener("click", function() {
			whoAmI.winRoundModal.style.display = "none";
			whoAmI.endRoundModal.style.display = "block";
		});
		whoAmI.lastGameFooterBtnTimeout.addEventListener("click", function() {
			whoAmI.outOfTimeModal.style.display = "none";
			whoAmI.endRoundModal.style.display = "block";
		});
		whoAmI.newGameBtn.addEventListener("click", newRound);
		document.querySelector("body").onload = newGame();
	}
	function newGame() {
		whoAmI.photo.classList.add("noPhoto");
		whoAmI.roundNumber++;
		whoAmI.winRoundModal.style.display = "none";
		whoAmI.outOfTimeModal.style.display = "none";
		console.log("new game!");
		clearDown();
		whoAmI.startBtn.classList.add("flashBtn");
		whoAmI.startBtn.addEventListener("click", startTimer);
	}
	function clearDown() {
		console.log("clearing down...");
		for(var i = 0; i < whoAmI.choiceBtns.length; i++) {
			whoAmI.choiceBtns[i].textContent = "?";
			whoAmI.choiceBtns[i].removeEventListener("click", correct);
			whoAmI.choiceBtns[i].removeEventListener("click", incorrect);
			whoAmI.choiceBtns[i].classList.remove("rightBtn");
			whoAmI.choiceBtns[i].disabled = true;
		};
		whoAmI.photo.classList.add("obscured");
		whoAmI.photo.classList.remove("revealed");
		whoAmI.startBtn.disabled = false;
		whoAmI.clueList.innerHTML = "";
		whoAmI.clueImgDiv1.classList.add("hiddenClueImgDiv");
		whoAmI.clueImgDiv2.classList.add("hiddenClueImgDiv");
		whoAmI.wrongGuesses = 0;
	}
	function fadeOut() {
		divAll.classList.remove("animated");
		divAll.classList.remove("fadeIn");
		divAll.classList.add("fadeOut");
		divAll.classList.add("animated");
	}
	function fadeIn() {
		divAll.classList.remove("animated");
		divAll.classList.remove("fadeOut");
		divAll.classList.add("fadeIn");
		divAll.classList.add("animated");
	}


	function startTimer() {
		whoAmI.startBtn.classList.remove("flashBtn");
		whoAmI.startBtn.disabled = true;
		whoAmI.photo.classList.remove("noPhoto");
		for(var i = 0; i < whoAmI.choiceBtns.length; i++) {
			whoAmI.choiceBtns[i].disabled = false;
		}
		whoAmI.game = Math.floor(Math.random() * whoAmI.allAnimals.length);
		//	Handle 'a' vs 'an' when displaying animal name
		switch(whoAmI.allAnimals[whoAmI.game].name.slice(0, 1)) {
			case "A": case "E": case "I": case "O": case "U":
				whoAmI.animalNameSpan.textContent = "n " + whoAmI.allAnimals[whoAmI.game].name;
				whoAmI.animalNameSpanTimeout.textContent = "n " + whoAmI.allAnimals[whoAmI.game].name;
				break;
			default:
				whoAmI.animalNameSpan.textContent = " " + whoAmI.allAnimals[whoAmI.game].name;
				whoAmI.animalNameSpanTimeout.textContent = " " + whoAmI.allAnimals[whoAmI.game].name;
				break;
		}
		loadAnimal(whoAmI.allAnimals[whoAmI.game]);
		whoAmI.timeLeft = 600;										//	Start timer in 10ths of seconds
		var timerHeight = (whoAmI.timeLeft * 1.4) + "px";
		whoAmI.timeBar.style.height = timerHeight;	
		whoAmI.timeBar.classList.remove("fadedTimer");
		whoAmI.clueNo = 0;
		whoAmI.handle = setInterval(function() {
			timerReduce();
			timeCheck();
			whoAmI.timeLeft -= 1;
		}, 120);
	};
	function timerReduce() {
		var timerHeight = (whoAmI.timeLeft * 1.4) + "px";
		whoAmI.timeBar.style.height = timerHeight;
	};
	function timeCheck() {
		if (whoAmI.timeLeft <= 0) {
			outOfTime();
		} else if(whoAmI.timeLeft % 100 === 0) {
			var clue = document.querySelector("#clueList").childNodes[whoAmI.clueNo];
			clue.classList.remove("hiddenClue");
			if(whoAmI.clueNo === whoAmI.imgClue1) {
				whoAmI.clueImgDiv1.classList.remove("hiddenClueImgDiv");
			} else if(whoAmI.clueNo === whoAmI.imgClue2)
				whoAmI.clueImgDiv2.classList.remove("hiddenClueImgDiv");
			whoAmI.clueNo++;
		};
	};

	function incorrect(but) {
		this.disabled = true;
		whoAmI.wrongGuesses++;
	};
	function correct(but) {
		this.classList.add("rightBtn");
		clearInterval(whoAmI.handle);
		calculateScore();
		whoAmI.timeBar.classList.add("fadedTimer");
		console.log("You win!");
		whoAmI.photo.classList.remove("obscured");
		whoAmI.photo.classList.add("revealed");
		for (var i = 0; i < whoAmI.choiceBtns.length; i++) {
			if(i !== whoAmI.rightChoice) {
				whoAmI.choiceBtns[i].disabled = true;
			}
		}
		setTimeout(function() {
			for (var i = 0; i < 6; i++) {
				whoAmI.clueList.childNodes[i].classList.remove("hiddenClue");
			}
			whoAmI.clueImgDiv1.classList.remove("hiddenClueImgDiv");
			whoAmI.clueImgDiv2.classList.remove("hiddenClueImgDiv");
		}, 2000);
		setTimeout(function() {
			displayModal();
		}, 2500);
	};

	function calculateScore() {
		whoAmI.roundScore = 120;
		console.log(whoAmI.roundScore);
		whoAmI.roundScore -= (60 - (Math.floor(whoAmI.timeLeft / 10))); 	// Subtracts 1pt per second taken to solve
		console.log(whoAmI.roundScore);
		switch(whoAmI.wrongGuesses) {
			case 1:
				whoAmI.roundScore *= 0.75;
				break;
			case 2:
				whoAmI.roundScore *= 0.6;
				break;
			case 3:
				whoAmI.roundScore *= 0.5;
				break;
			case 4:
				whoAmI.roundScore *= 0.4;
				break;
			case 5:
				whoAmI.roundScore *= 0.35;
				break;
			case 6:
				whoAmI.roundScore *= 0.3;
				break;
			case 7:
				whoAmI.roundScore *= 0.25;
				break;
			case 8:
				whoAmI.roundScore *= 0.2;
				break;
			case 9:
				whoAmI.roundScore *= 0.15;
				break;
			default:
				break;
			};
		whoAmI.roundScore = Math.floor(whoAmI.roundScore);
		console.log(whoAmI.roundScore);
		whoAmI.totalScore += whoAmI.roundScore;
	};
	function displayModal() {
		whoAmI.nextRoundNoSpan.textContent = whoAmI.roundNumber + 1;
		whoAmI.lastRoundNoSpan.textContent = whoAmI.roundNumber;
		whoAmI.spanScore.textContent = whoAmI.roundScore;
		if(whoAmI.roundNumber >= whoAmI.roundsToPlay) {
			whoAmI.spanRoundScore.textContent = whoAmI.totalScore;
			whoAmI.lastGameFooterBtn.classList.remove("hiddenModalBtn");
			whoAmI.winModalNextBtn.classList.add("hiddenModalBtn");
			whoAmI.winRoundModal.style.display = "block";
		} else {
			whoAmI.lastGameFooterBtn.classList.add("hiddenModalBtn");
			whoAmI.winModalNextBtn.classList.remove("hiddenModalBtn");
			whoAmI.winRoundModal.style.display = "block";
		};
	};
	function outOfTime(){
		clearInterval(whoAmI.handle);
		whoAmI.nextRoundNoSpanTimeout.textContent = whoAmI.roundNumber + 1;
		whoAmI.photo.classList.remove("obscured");
		whoAmI.photo.classList.add("revealed");
		if(whoAmI.roundNumber >= whoAmI.roundsToPlay) {
			whoAmI.spanRoundScore.textContent = whoAmI.totalScore;
			whoAmI.lastGameFooterBtnTimeout.classList.remove("hiddenModalBtn");
			whoAmI.winModalNextBtnTimeout.classList.add("hiddenModalBtn");
			whoAmI.outOfTimeModal.style.display = "block";
		} else {
			whoAmI.lastGameFooterBtnTimeout.classList.add("hiddenModalBtn");
			whoAmI.winModalNextBtnTimeout.classList.remove("hiddenModalBtn");
			whoAmI.outOfTimeModal.style.display = "block";
		};
	};
	function loadAnimal(obj) {
		var photo = document.querySelector("#mainPhoto");
		photo.classList.add("obscured");
		photo.setAttribute("src", "assets/img/whoAmI/" + obj.id + ".jpg")
		var wrongChoices = shuffle(obj.wrong);
		whoAmI.rightChoice = Math.floor(Math.random() * whoAmI.choiceBtns.length);
		for (var i = 0; i < whoAmI.choiceBtns.length; i++) {
			var but = whoAmI.choiceBtns[i];
			if (i === whoAmI.rightChoice) {
				but.textContent = obj.name;
				but.addEventListener("click", correct);
			} else {
				but.textContent = wrongChoices[i];
				but.addEventListener("click", incorrect);
			};
		};
		for(var i = 0; i < obj.clues.length; i++) {
			var node = document.createElement("LI");
			node.innerHTML = obj.clues[i];
			whoAmI.clueList.appendChild(node);
			whoAmI.clueList.lastElementChild.classList.add("hiddenClue");
		};
		img = "assets/img/whoAmI/" + obj.id + "-" + obj.clueImgs[0];
		whoAmI.clueImg1.setAttribute("src", img);
		img = "assets/img/whoAmI/" + obj.id + "-" + obj.clueImgs[1];
		whoAmI.clueImg2.setAttribute("src", img);
		whoAmI.imgClue1 = obj.imgClues[0];
		whoAmI.imgClue2 = obj.imgClues[1];
		// Removes animal from allAnimals array after loading
		var index = whoAmI.allAnimals.indexOf(obj);
		console.log(index);
		if(index > -1) {
			whoAmI.allAnimals.splice(index, 1);
		}
	};

	// Shuffle array
	function shuffle(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	    return array;
	};




	// Animal constructor
	function loadAnimals() {
		var allAnimals = [];
		function Animal(id, name) {
			this.name = name;
			this.id = id;
			this.clues = [];
			this.clueImgs = [];
			this.imgClues = [];
			this.used = false;
			allAnimals.push(this);
		};

		// Animal declarations -> easiest clues last
		var platypus = new Animal("platypus", "Platypus");
			platypus.wrong = ["Brushtail Possum", "Pine Marten", "Manatee", "Honey Badger", "Beaver", "Koala", "Wombat", "Spiny Anteater", "Pangolin", "Echidna"];
			platypus.clues = [
				"<p>I close my eyes when hunting, but have an extra sense I use instead! I can locate my prey by detecting the electric fields created by their muscle movements.</p>",
				'<p>I am a great swimmer and propel myself through the water by paddling my front feet. I hold my back feet flat against my tail.</p>',
				"<p>Very unusually for a mammal, males of my species have ankle spurs that can inject an incredibly painful venom.</p>",
				"<p>I am found in streams and small rivers in East Australia, and am crepuscular and nocturnal - meaning I'm mostly active in twilight and at night.</p>",
				"<p>After I was first discovered by Europeans in 1798, scientists back in Britain thought I was a hoax stitched together by a taxidermist!</p>",
				"<p>My scientific name <em>Ornithorhynchus anatinus</em> comes from the Greek for 'bird snout'.</p>"];
			platypus.clueImgs = ["PlatypusRange.png", "Wolpertinger.jpg"];
			platypus.imgClues = [2, 4];

		var seaotter = new Animal("seaotter", "Sea Otter");
			seaotter.wrong = ["Walrus", "Sea Lion", "Manatee", "Narwhal", "Beaver", "Platypus", "Polar Bear", "Hippopotamus", "Weddell Seal", "Killer Whale"];
			seaotter.clues = [
				'<p>I am considered a conservation success story. We now number over 100,000 in the wild, up from as few as 2,000 in the early 20th century.</p>',
				"<p>I'm very talkative! I can coo, grunt, whistle, hiss - or even scream a bit like a seagull.</p>",
				"<p>I'm <strong>diurnal</strong> and am most active around sunrise and the evening, but will also forage at night.</p>",
				"<p>I have a very high metabolism and must eat about 25% of my body weight in food each day, just to keep warm!</p>",
				"<p>I am a '<strong>keystone species</strong>', meaning I am of particular importantance to my ecosystem - mostly because I help to keep sea urchin numbers down (they're very tasty!).</p>",
				"<p>I sometimes use a stone as a hammer, or as an anvil resting on my chest, to help me crack open shellfish!</p>"];
			seaotter.clueImgs = ["SeaOtterRange.png", "SeaUrchin.jpg"];
			seaotter.imgClues = [0, 4];

		var honeybadger = new Animal("honeybadger", "Honey Badger");
			honeybadger.wrong = ["Weasel", "Wolverine", "Groundhog", "Snow Leopard", "Beaver", "Platypus", "Muskrat", "Chimpanzee", "Naked Mole-Rat", "Echidna"];
			honeybadger.clues = [
				'<p>I have a very wide-ranging diet, but am mainly carnivorous. I will eat insects, frogs, tortoises, eggs, roots, berries - and will even hunt dangerous snakes like cobras!</p>',
				"<p>I can be found throughout sub-Saharan Africa, Southwest Asia and the Indian subcontinent. The IUCN do not consider me to be under threat.</p>",
				"<p>I am a very fast digger and can dig myself a simple burrow to nest in (with an entrance tunnel a couple of metres long) in a matter of minutes.</p>",
				"<p>I am very intelligent and have been seen to use tools to reach food (and to escape captivity!).</p>",
				"<p>If I'm in danger, I have a gland at the base of my tail that can release a horrible smell - just like a skunk!</p>",
				"<p>Beekeepers don't like me! I'm an expert at breaking into their hives.</p>"];
			honeybadger.clueImgs = ["HoneyBadgerRange.png", "Beehives.jpg"];
			honeybadger.imgClues = [1, 5];

		var beaver = new Animal("beaver", "Beaver");
			beaver.wrong = ["Weasel", "Wolverine", "Groundhog", "Sea Otter", "Honey Badger", "Platypus", "Muskrat", "Chimpanzee", "Ocelot", "Brown Rat"];
			beaver.clues = [
				"<p>My eyes are covered by a transparent 'nictitating membrane', which acts like a pair of goggles and lets me see underwater. </p>",
				"<p>If I'm startled while swimming, I will warn my family by slapping the surface of the water hard with my tail to make a loud noise!</p>",
				'<p>The European colonists of North America nearly hunted me to extinction for my fur, which was used to make top hats and other clothing.</p>',
				"<p>I was nearly hunted to extinction in Europe too, but there have recently been successful reintroduction schemes in a number of countries - including some trials in the UK.</p>",
				"<p>I am the second-biggest type of rodent alive today, after the Capybara.</p>",
				'<p>I am an expert builder and lumberjack! Together with my family I will build a lodge for us to live in, and dams to protect it.</p>'];
			beaver.clueImgs = ["BeaverHat.jpg", "BeaverTree.jpg"];
			beaver.imgClues = [2, 5];

		var elk = new Animal("elk", "Elk");
			elk.wrong = ["Panther", "Grizzly Bear", "Coyote", "Raccoon", "Buffalo", "Walrus", "Impala", "Reindeer", "Wolverine", "Yak"];
			elk.clues = [
				"<p>Humans have hunted me since the Stone Age, and depictions of me can be seen in cave paintings and rock drawings that are more than 6,000 years old.</p>",
				"<p>Although I'm a herbivore, I can become aggressive when frightened.  In America, I am responsible for causing more injuries to humans each year than any other wild mammal!</p>",
				"<p>I am generally a solitary creature, but will stay with my mother for about 9 months after I'm born.</p>",
				'<p>Males of my species, "<strong>bulls</strong>", grow large, flat antlers.  Females, called "<strong>cows</strong>", do not.</p>',
				"<p>I am the largest living member of the deer family. When fully grown I usually stand 1.4 to 2.1 metres high at the shoulder, and weigh up to about 800kg.</p>",
				'<p>In North America, I am known by a different name. There, I am called a "<strong>Moose</strong>".</p>'];
			elk.clueImgs = ["RockDrawing.jpg", "ElkAntlers.jpg"];
			elk.imgClues = [0, 3];

		var redpanda = new Animal("redpanda", "Red Panda");
			redpanda.wrong = ["Honey Badger", "Tibetan Wolf", "Pangolin", "Slow Loris", "Muntjac", "Giant Panda", "Degu", "Amur Leopard", "Red Squirrel", "Echidna"];
			redpanda.clues = [
				"<p>I'm a solitary creature and rarely interact with others of my kind, except during mating season (mid-January to early March). </p>",
				"<p>My main natural predators are snow leopards, but I am classed as <strong>Endangered</strong> by the IUCN due to hunting, poaching and habitat loss resulting from human activity.</p>",
				"<p>I am mostly nocturnal and tend to sleep during the morning and most of the afternoon.</p>",
				"<p>When I'm hot, I will sleep stretched out on a branch with my legs dangling. When I'm cold, I cover my face with my bushy tail!</p>",
				'<p>Where I live, one of the nicknames the locals have for me is "<strong>Fire Fox</strong>". The logo of the Firefox web browser is (very loosely) based on me!</p>',
				"<p>Just like my much larger (but very very  distant) black-and-white cousin, I mostly eat bamboo - although I will also eat other plants, as well as small animals and birds.</p>"];
			redpanda.clueImgs = ["SnowLeopards.jpg", "Firefox.jpg"];
			redpanda.imgClues = [1, 4];

		var ringtail = new Animal("ringtail", "Ring-tailed Lemur");
			ringtail.wrong = ["Giant Panda", "Dwarf Mongoose", "Tenrec", "Pygmy Marmoset", "Golden Lion Tamarin", "Fossa", "Harvest Mouse", "Pine Marten", "Mouse Lemur", "Bushbaby"];
			ringtail.clues = [
				'<p>The local humans where I live call me <strong>Maky</strong>, or <strong>Hira</strong>.</p>',
				"<p>I'm very sociable and live in mixed-sex groups of up to 30 individuals, led by a dominant female. Males will leave a family group and join another every few years.</p>",
				'<p>I have good night vision and very striking bright yellow eyes, surrounded by triangular black patches.</p>',
				"<p>Although I thrive in captivity and reproduce often, I'm listed as <strong>Endangered</strong> by the IUCN. As of 2017 there are only about 2,000 of us left in the wild.<p>",
				"<p>I am endemic to the south of Madagascar, which has been dramatically deforested since the mid 20th century.</p>",
				"<p>My scientific name is <em>Lemur catta</em>. The <em>catta</em> part refers to my cat-like appearance!</p>" ];
			ringtail.clueImgs = ["RingtailedLemurEye.jpg", "RingtailedLemurRange.png"];
			ringtail.imgClues = [2, 4];

		var meerkat = new Animal("meerkat", "Meerkat");
			meerkat.wrong = ["Ocelot", "Silvery Gibbon", "Common Marmoset", "Golden Lion Tamarin", "Fossa", "Lynx", "Pine Marten", "Mouse Lemur", "Echidna", "Bushbaby"];
			meerkat.clues = [
				'<p>I have an immunity to several different types of venom, including some scorpion stings that would be deadly to other animals.</p>',
				'<p>My family groups are called "mobs", "gangs" or "clans". These generally have about 20 members, but the very biggest can have over 50!</p>',
				'<p>I am fairly widespread across much of southern Africa, particularly in the Kalahari and Namib deserts.</p>',
				'<p>I mostly eat insects, but will eat all sorts of other things too - including lizards, rodents, eggs and even some fungi.</p>',
				'<p>My scientific name is <em>Suricata suricatta</em>. My name in English comes from Afrikaans, and translates as "<strong>Marsh Cat</strong>".</p>',
				'<p>At least one of my mob is always keeping lookout for danger, and will bark to warn the rest of us if something scary is coming!</p>' ];
			meerkat.clueImgs = ["DesertScorpion.jpg", "Kalahari.jpg"];
			meerkat.imgClues = [0, 2];

		var squirrelmonkey = new Animal("squirrelmonkey", "Squirrel Monkey");
			squirrelmonkey.wrong = ["Spider Monkey", "Silvery Gibbon", "Common Marmoset", "Golden Lion Tamarin", "Buffalo", "Brown Rat", "Degu", "Chimpanzee", "Gorilla", "Ocelot", "Panther", "Orangutan", "Moose", "Bushbaby"];
			squirrelmonkey.clues =  [
				"<p>In 1957, one of my genus (called Miss Baker) was the first animal to return home alive from space as part of the United States space program. She went on to live to the ripe old age of 27!</p>",
				'<p>I live in the tropical forests of Central and South America, mostly in the Amazon Basin.</p>',
				"<p>Although other parts of me are black and white, most of my body is covered in yellow-orange fur.</p>",
				"<p>I have excellent colour eyesight and a very large brain for my size. I actually have the largest brain to body mass ratio of any primate (including you!)</p>",
				"<p>I am arboreal and spend virtually my whole life in the trees, eating fruit and insects and using my long tail to balance.</p>",
				"<p>Fully grown, my body is about 30cm long (not including my tail, which is another 40cm.)</p>" ];
			squirrelmonkey.clueImgs = ["JupiterRocket.jpg", "SquirrelMonkeyFur.jpg"];
			squirrelmonkey.imgClues = [0, 2];

		var hippo = new Animal("hippo", "Hippopotamus");
			hippo.wrong = ["White Rhino", "Elephant", "Manatee", "Buffalo", "Tiger", "Spectacled Bear", "Chimpanzee", "Gorilla", "Sloth Bear", "Elk"];
			hippo.clues = [
				'<p>A group of us (which can have up to 30 members) is known as a "pod", a "herd", a "dale" or a "bloat".</p>',
				"<p>I can be very aggressive and unpredictable towards humans, and am regarded as one of the most dangerous animals in the whole of Africa.</p>",
				"<p>Although I eat grass almost exclusively, the canine teeth of males of my species can grow up to 50cm long. Their only use is for fighting other males!</p>",
				"<p>Although I have relatively short legs and weigh as much as a small car, I can run at up to 19 miles per hour!</p>",
				'<p>My English name comes from ancient Greek and translates as "<strong>River Horse</strong>".</p>',
				"<p>I spend most of the daytime in water, but come out onto land at dusk to feed. I can eat nearly 70 kilograms of grass in a single night!</p>"];
			hippo.clueImgs = ["HippoSkull.jpg", "VWBeetle.jpg"];
			hippo.imgClues = [2, 3];

		var impala = new Animal("impala", "Impala");
			impala.wrong = ["White Rhino", "Elephant", "Pine Marten", "Manatee", "Buffalo", "Tiger", "Spectacled Bear", "Chimpanzee", "Gorilla", "Sloth Bear", "Panther", "Orangutan", "Moose", "Bushbaby"];
			impala.clues = [
				"<p>I'm often pestered by ticks, but have a symbiotic relationship with Oxpeckers who help me by eating them from the parts of my body I can't reach!</p>",
				"<p>I live in African woodlands, often right on the edges where they meet the savannah.</p>",
				"<p>I often live in a herd with others of my own sex, but dominant males will mark out and hold their own territory. </p>",
				"<p>I can jump up to 3 meters vertically, and 10 meters horizontally!</p>",
				'<p>Males of my species grow lyre-shaped horns that can be up to 90cm long.</p>',
				'<p>In Afrikaans my name is Rooibok, which means "Red Buck".</p>'];
			impala.clueImgs = ["Oxpecker.jpg", "ImpalaHorn.jpg"];
			impala.imgClues = [0, 4];

		var panda = new Animal("panda", "Giant Panda");
			panda.wrong = ["Spider Monkey", "Silvery Gibbon", "Common Marmoset", "Golden Lion Tamarin", "Buffalo", "Harvest Mouse", "Degu", "Chimpanzee", "Gorilla", "Ocelot", "Panther", "Orangutan", "Moose", "Bushbaby"];
			panda.clues = [
				"<p>I have an enlarged bone on my hand called a 'pseudo thumb', that helps me grip onto my food.</p>",
				"<p>My closest living relative is the spectacled bear of South America.</p>",
				"<p>I am normally an only child, and when I'm born I'm just 1/900th the size of my mother!</p>",
				'<p>My Latin name is <em>Ailuropoda melanoleuca</em>, which literally means "black and white cat-foot"</p>',
				"<p>In the wild, I can only be found in a few mountain areas in central China.</p>",
				"<p>My favorite food is bamboo. I hardly ever eat anything else!</p>"];
			panda.clueImgs = ["SpectacledBear.jpg", "Bamboo.jpg"];
			panda.imgClues = [1, 5];

		var snowleopard = new Animal("snowleopard", "Snow Leopard");
			snowleopard.wrong = ["Tiger", "Lion", "Jaguar", "Rhinoceros", "Hyena", "Jackal", "Baboon", "Gorilla", "Spectacled Bear", "Grey Wolf", "Fossa"];
			snowleopard.clues = [
				"<p>I have a flexible tail that can reach 80-100cm long and is relatively thick and furry, so I can use it as a blanket to keep my face warm at night!</p>",
				"<p>Females of my species can have a territory of nearly 50 square miles. Males can have a territory of 80 square miles!</p>",
				"<p>I am a fearsome predator and can bring down large animals such as horses or camels, but it is almost unheard of for me to attack humans.</p>",
				'<p>Where my territory edges onto human habitation, I will prey on domestic livestock - so am often at risk of being shot by farmers.</p>',
				"<p>Because of habitat loss due to global warming and poaching for my fur and body parts, I am classed as endangered by the IUCN. </p>",
				"<p>I live at high altitudes (up to 6 kilometers above sea level) in mountain ranges spanning 12 Asian countries.</p>"];
			snowleopard.clueImgs = ["WildHorses.jpg", "Himalayas.jpg"];
			snowleopard.imgClues = [2, 5];

		var jaguar = new Animal("jaguar", "Jaguar");
			jaguar.wrong = ["Tiger", "Lion", "Snow Leopard", "Cheetah", "Jackal", "Emperor Tamarin", "Coyote", "Grey Wolf", "Brown Bear", "Sea Otter"];
			jaguar.clues = [
				"<p>The people of the Maya civilization called me <em>b'alam</em>, and believed me to be a link between the worlds of the living and the dead.</p>",
				"<p>I am a fearsome hunter and will stalk and ambush my targets, on land and in water.</p>",
				"<p>I have an exceptionally powerful bite and can bring down almost any prey. I can even bite through a tortoise's shell!</p>",
				'<p>My fur coat is spotted with rosettes, and is usually yellow - but can sometimes be reddish brown or black.</p>',
				"<p>My current range includes parts of the southern USA and Mexico as well as much of Central America, and extends south as far as Paraguay and Northern Argentina.</p>",
				"<p>I am the largest native big cat in the Americas.</p>"];
			jaguar.clueImgs = ["Maya.jpg", "Tortoise.jpg"];
			jaguar.imgClues = [0, 2];

		var orangutan = new Animal("orangutan", "Orangutan");
			orangutan.wrong = ["Gorilla", "Chimpanzee", "Tapir", "Cheetah", "Jackal", "Emperor Tamarin", "Coyote", "Grey Wolf", "Brown Bear", "Snow Leopard"];
			orangutan.clues = [
				"<p>I stay with my mother until I'm 3-4 years old, then gradually move away to live on my own.</p>",
				"<p>Young females of my species tend to find a territory of their own, not far from their mother. Young males will wander much further afield and attempt to take over another male's territory.</p>",
				"<p>I start practicing building nests at 6 months old, and am usually very good at it by age 3.</p>",
				'<p>I communicate by making a variety of noises and can even blow raspberries!</p>',
				"<p>I used to be found across Indonesia and Malaysia, but am now only found in the rapidly shrinking rainforests of Borneo and Sumatra. </p>",
				"<p>I am critically endangered. The main threats to my survival are hunting, the pet trade, and habitat loss - my forests are being cleared to make way for palm oil plantations.</p>"];
			orangutan.clueImgs = ["Borneo.jpg", "PalmOil.jpg"];
			orangutan.imgClues = [1, 5];

		var weddellseal = new Animal("weddellseal", "Weddell Seal");
			weddellseal.wrong = ["Killer Whale", "Manatee", "Walrus", "Sea Otter", "Harbour Porpoise", "Blue Whale", "Beaver", "Polar Bear", "Arctic Fox", "Caribou"];
			weddellseal.clues = [
				"<p>My natural range is the most southern of any mammal, reaching as far as 77 degrees south.</p>",
				"<p>I can hold my breath for a long time and can stay underwater for 80 minutes at a time! </p>",
				"<p>My diet is made up of fish, squid, krill, prawns, octopuses and crustaceans - up to 50kg per day in total.</p>",
				'<p>My thin coat of fur is generally a mottled brown colour, with a lighter silvery grey around my belly. </p>',
				"<p>Fully grown, I am about 2.5 to 3.5m long. Females are usually a bit bigger and heavier than males.</p>",
				"<p>My pups are about half as long as their mother at birth, and will take their first swim when only one or two weeks old. Within less than 2 months they will start to hunt for themselves!</p>"];
			weddellseal.clueImgs = ["Antarctica.jpg", "Shrimp.jpg"];
			weddellseal.imgClues = [0, 2];

		var raccoon = new Animal("raccoon", "Raccoon");
			raccoon.wrong = ["Weasel", "Porcupine", "Capybara", "Elk", "Brown Bear", "Beaver", "Platypus", "Koala", "Buffalo", "Ocelot"];
			raccoon.clues = [
				"<p>The 30th President of the USA, Calvin Coolidge, kept one of my species (called Rebecca) as a pet. She was supposed to be served up for Thanksgiving dinner, but received a Presidential pardon instead!</p>",
				"<p>I am common throughout North America.  It is estimated that there were maybe 20 times more of us in the wild by the 1980s than there were in the 1930s.</p>",
				"<p>I have also been introduced to several countries in Europe and Asia, particularly Germany, Japan and the former USSR.</p>",
				'<p>My usual diet includes invertebrates, fruit and nuts, fish, frogs and bird eggs.</p>',
				"<p>I like to stand on a riverbank or lake shore and dabble for food underwater with my front paws.</p>",
				"<p>My eyes are surrounded by an area of black fur, but the rest of my face is lighter grey and white.  I look a bit like I'm wearing an eye mask!</p>"];
			raccoon.clueImgs = ["CalvinCoolidge.jpg", "BirdEggs.jpg"];
			raccoon.imgClues = [0, 3];

		var spottedhyena = new Animal("spottedhyena", "Spotted Hyena");
			spottedhyena.wrong = ["Chimpanzee", "Grey Wolf", "Cheetah", "Coyote", "Lion", "White Rhinoceros", "Tiger", "Mandrill", "Golden Jackal", "Buffalo"];
			spottedhyena.clues = [
				"<p>I used to be found across Europe from Spain to the Ural mountains, but for at least the past 11,000 years have been confined to Sub-Saharan Africa.</p>",
				"<p>I am a very efficient eater and can even crunch up and completely digest bones!</p>",
				"<p>Females of my species are significantly larger than males, and are dominant in our large family groups, called 'clans'.</p>",
				'<p>I commonly hunt large herbivores like wildebeest, zebra, giraffes and springbok. I will also sometimes scavenge.</p>',
				"<p>I am the most common large carnivore in Africa, largely as a result of my adaptability and opportunism.</p>",
				"<p>I can be very noisy! I will whoop, groan, grunt, yell and laugh hysterically!</p>"];
			spottedhyena.clueImgs = ["AnimalBones.jpg", "Wildebeest.jpg"];
			spottedhyena.imgClues = [1, 2];

		return allAnimals;
	};

	firstLoad();

});

