$(document).ready(function(){

	// Suppress swipe forward / back navigation in Chrome (may not work, can toggle in Chrome settings)
//	$(window).on('touchmove', function(e){e.preventDefault();});	

	// Suppress default multitouch zoom behaviour
	// ???? disable in browser

	//	Inactivity timeout - display landing page if no click / touch events for 10 mins
	var handler = '';
	function inactivityCountdown() {
		if(window.location.pathname.split('/').pop() != 'index.html') {					//	Check that index page is not already being displayed
			handler = setTimeout(function() {
				window.location.assign('index.html');
			}, 10000);																	//	Inactivity time in ms (10 mins)
		}					
	}
	document.querySelector('body').addEventListener('click', function() {
		clearTimeout(handler);
		inactivityCountdown();
	});
	document.querySelector('body').addEventListener('touchstart', function() {
		console.log('touch!');
		clearTimeout(handler);
		inactivityCountdown();
	});
	inactivityCountdown();

});