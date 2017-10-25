$(window).on('load', function($) {
	var csvid = document.getElementById('csvid');
	var csbtn = document.getElementById('csbtn');
	var csplaying = true;

	csclick = function() {
		if(csplaying) {
			csvid.pause();
			$('#csbtn').fadeOut(150, function() {
				csbtn.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
				$('#csbtn').fadeIn(150);
			});
		} else {
			csvid.play();
			$('#csbtn').fadeOut(150, function() {
				csbtn.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
				$('#csbtn').fadeIn(150);
			});
		}
		csplaying = !csplaying;
	};
});