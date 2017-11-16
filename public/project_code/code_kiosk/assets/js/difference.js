$(document).ready(function(){

	$('#mainMenuBtnLink').click(function(event) {
		event.preventDefault();
		newLocation = this.href;
		$('html').fadeOut('slow', newpage);
	});
	function newpage() {
		window.location = newLocation;
	}

	var difference = {}
	difference.allImageSets = [];
	difference.rightSvg = document.getElementById("rightSvg");
	difference.winModal = document.getElementById("winModal");
	difference.newGameModal = document.getElementById("newGameModal");
	difference.handle = "";
	difference.spanTime = document.getElementById("spanTime");
	difference.caption1 = document.getElementById("caption1");
	difference.caption2 = document.getElementById("caption2");
	difference.newGameBtn = document.getElementById("newGameBtn");
	difference.timer = 0;
	difference.diffs = 0;						//	Variable tracks number of differences found in current game
	difference.numberOfDiffs = 0;				//	Number of differences to find in current game

	//	Called on first start to perform initial setup & load images
	difference.start = function() {
		preloadImages(difference.allImageSets);
		difference.newGameBtn.addEventListener("click", function() {
			difference.winModal.style.display = "none";
			difference.newGameModal.style.display = "block";
		});
		document.getElementById("crownedcrane").addEventListener("click", function() {difference.setUp(difference.crownedcrane)});
		document.getElementById("woodnymph").addEventListener("click", function() {difference.setUp(difference.woodnymph)});
		document.getElementById("cockroaches").addEventListener("click", function() {difference.setUp(difference.cockroaches)});
		document.getElementById("frogs").addEventListener("click", function() {difference.setUp(difference.frogs)});
		difference.newGameModal.style.display = "block";
		$('body').fadeIn('slow');
	}

	//	Assign ID name to each image set & push to array on first load
	difference.imageSet = function(id) {
		this.id = id;
		difference.allImageSets.push(this);
	};

	//  Preload images
	function preloadImages(imageSets) {
	    var images = [];
	    for(var i = 0; i < imageSets.length; i++) {
	        var original = new Image();
	        original.src = 'assets/img/difference/' + imageSets[i].id + 'Original.jpg';
	        images.push(original);
	        var edited = new Image();
	        edited.src = 'assets/img/difference/' + imageSets[i].id + 'Edited.jpg';
	        images.push(edited);
	        var small = new Image();
	        small.src = 'assets/img/difference/' + imageSets[i].id + 'Sm.jpg';
	        images.push(small);
	    }
	}

	//	Set up a 'game' - display images, add 'difference' zones & paw icons etc
	difference.setUp = function(obj) {
		var originalImg = document.getElementById("originalImg");
		originalImg.setAttribute("src", "assets/img/difference/" + obj.id + "Original.jpg");
		var editedImg = document.getElementById("editedImg");
		editedImg.setAttribute("src", "assets/img/difference/" + obj.id + "Edited.jpg");
		difference.caption1.textContent = obj.caption1;
		difference.caption2.textContent = obj.caption2;
		difference.numberOfDiffs = obj.diff.length;
		difference.diffs = obj.diff.length;
		for(var i = 0; i < difference.numberOfDiffs; i++) {
			var cx = obj.diff[i][0];
			var cy = obj.diff[i][1];
			var rx = obj.diff[i][2];
			var ry = obj.diff[i][3];
			var diff = document.getElementById("diff" + i);
			var paw = document.getElementById("paw" + i);
			paw.classList.remove("foundCluePaw");
			diff.setAttribute("cx", cx);
			diff.setAttribute("cy", cy);
			diff.setAttribute("rx", rx);
			diff.setAttribute("ry", ry);
			diff.addEventListener("click", function(obj) {
				this.classList.remove("hidden");
				difference.diffs--;
				var pawIcon = document.getElementById("paw" + difference.diffs);
				pawIcon.classList.add("foundCluePaw");
				if(difference.diffs === 0) {
					difference.win(obj);
				}
				this.removeEventListener("click", arguments.callee);
			});
		}
		difference.handle = setInterval(function() {
			difference.timer++;
		}, 1000);
		difference.newGameModal.style.display = "none";
		$('#mainPane').removeClass('hidden');
	}

	difference.clearDown = function(obj) {
		difference.timer = 0;
		difference.diffs = 0;
		$('.diffEllipse').addClass('hidden');
		$('#mainPane').addClass('hidden');
	}

	difference.win = function(obj) {
		clearInterval(difference.handle);
		var s = "";
		if(difference.timer % 60 === 1) {
			s = " second.";
		} else {
			s = " seconds.";
		}
		if(difference.timer >= 120) {
			difference.spanTime.textContent = Math.floor(difference.timer / 60) + " minutes and " + Math.floor(difference.timer % 60) + s;
		} else if(difference.timer > 60) {
			difference.spanTime.textContent = Math.floor(difference.timer / 60) + " minute and " + Math.floor(difference.timer % 60) + s;
		} else {
			difference.spanTime.textContent = difference.timer + s;
		}
		setTimeout(function() {
			console.log(difference.timer);
			difference.winModal.style.display = "block";
			difference.clearDown(obj);
		}, 1000)
	}


	// center x, center y, width, height
	difference.woodnymph = new difference.imageSet("WoodNymph");
		difference.woodnymph.diff = [];
		difference.woodnymph.diff[0] = [555, 70, 60, 60];		//	Red box
		difference.woodnymph.diff[1] = [65, 150, 50, 35];		//	Leaf overlapping wing
		difference.woodnymph.diff[2] = [332, 480, 70, 25];		//	Lower central wing pattern removed
		difference.woodnymph.diff[3] = [150, 308, 60, 32];		//	Wing pattern
		difference.woodnymph.diff[4] = [625, 436, 80, 38];		//	Antennae
		difference.woodnymph.diff[5] = [290, 645, 40, 40];		//	3x white spots
		difference.woodnymph.diff[6] = [465, 668, 50, 42];		//	Yellow flower
		difference.woodnymph.diff[7] = [595, 310, 45, 45];		//	Left wing tip
		difference.woodnymph.caption1 = "Giant wood nymph in the butterfly hall at the Oasis.";
		difference.woodnymph.caption2 = "Giant wood nymphs, also known as Paper Kites, can be found across Southeast Asia, Northern Australia and Taiwan.";

	difference.frogs = new difference.imageSet("Frogs");
		difference.frogs.diff = [];
		difference.frogs.diff[0] = [645, 245, 60, 55];			// Right frog has blue eyes
		difference.frogs.diff[1] = [510, 220, 75, 50];			// Right frog has hump back
		difference.frogs.diff[2] = [275, 312, 80, 35];			// Middle frog has blue back
		difference.frogs.diff[3] = [145, 335, 30, 25];			// Left frog has shorter eye
		difference.frogs.diff[4] = [640, 340, 60, 35];			// Right frog toes moved 						
		difference.frogs.diff[5] = [355, 368, 30, 30];			// Middle frog has small, circular pupil
		difference.frogs.diff[6] = [510, 432, 30, 40];			// Right frog has extra toe
		difference.frogs.diff[7] = [160, 505, 50, 35];			// Left frog toes shrunk / removed
		difference.frogs.caption1 = "A trio of South American tree frogs at the Wildlife Oasis.";
		difference.frogs.caption2 = "There are over 800 known species of tree frog, found across the world - in every continent except Antarctica!";

	difference.crownedcrane = new difference.imageSet("CrownedCrane");
		difference.crownedcrane.diff = [];
		difference.crownedcrane.diff[0] = [475, 52, 70, 48];	//	Missing daisies at top
		difference.crownedcrane.diff[1] = [300, 243, 40, 35];	//	Thistle top
		difference.crownedcrane.diff[2] = [595, 320, 55, 28];	//	Longer white wing feathers
		difference.crownedcrane.diff[3] = [151, 313, 23, 42];	//	Red on face
		difference.crownedcrane.diff[4] = [325, 408, 90, 35];	//	Thistle leaves over body missing
		difference.crownedcrane.diff[5] = [710, 523, 38, 34];	//	Longer black wingtips
		difference.crownedcrane.diff[6] = [600, 413, 75, 39];	//	Orange tail feathers now yellow
		difference.crownedcrane.diff[7] = [75, 347, 45, 30];	//	Longer beak
		difference.crownedcrane.caption1 = "Grey crowned cranes are found in Eastern Africa and are listed as endangered by the IUCN.";
		difference.crownedcrane.caption2 = "These striking animals are the national bird of Uganda - one is even featured on the country's flag!";

	difference.cockroaches = new difference.imageSet("Cockroaches");
		difference.cockroaches.diff = [];
		difference.cockroaches.diff[0] = [40, 107, 40, 55];
		difference.cockroaches.diff[1] = [540, 135, 26, 35];
		difference.cockroaches.diff[2] = [210, 170, 30, 60];
		difference.cockroaches.diff[3] = [560, 344, 55, 23];
		difference.cockroaches.diff[5] = [90, 460, 45, 39];
		difference.cockroaches.diff[6] = [415, 490, 45, 70];
		difference.cockroaches.diff[4] = [415, 622, 38, 32];
		difference.cockroaches.diff[7] = [328, 720, 65, 35];
		difference.cockroaches.diff[8] = [65, 640, 55, 68];
		difference.cockroaches.diff[9] = [647, 635, 50, 28];
		difference.cockroaches.caption1 = "Madagascar hissing cockroaches. Both males and females will hiss when disturbed or threatened.";
		difference.cockroaches.caption2 = "Males will also hiss to attract females, or to establish dominance over other males.";

	difference.start();

});

