$(function() {
	$('.grid').masonry({
		// options
		itemSelector: '.gridItem',
		columnWidth: 0
	});

	// Instantiate EasyZoom instances
	var $easyzoom = $('.easyzoom').easyZoom({
		loadingNotice: 'Loading image (~5mb)'
	});
});