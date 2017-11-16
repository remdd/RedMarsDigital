$(document).ready(function(){

	//	Fade out on link clicks
	$('a').click(function(event) {
		event.preventDefault();
		newLocation = this.href;
		$('html').fadeOut('slow', newpage);
	});
	function newpage() {
		window.location = newLocation;
	}

	//	Filenames to be loaded to image carousel
	var carouselImages = ["Bird", "Butterfly", "Crane", "Dragon", "Flowers", "Frog", "Insect", "Leopards", "Mara", "Meerkats", "Millipede", "Plant", "Python", "Shrew", "Squirrel", "Toad"];
	shuffle(carouselImages);

	//	Load carousel images to right div (transition animations are handled in css)
	for (var i = 0; i < carouselImages.length; i++) {
		var img = $('<img />', { 
			class: 'galleryImg',
			src: 'assets/img/home/Carousel_' + carouselImages[i] + '.jpg',
		});
		img.appendTo($('.rightDiv'));
	}

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

	$('.rightDiv').imagesLoaded(function() {
		$('body').fadeIn('slow');
	});

});