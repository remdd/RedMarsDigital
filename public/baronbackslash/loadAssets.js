
loader.on('progress', function(progress) {
	console.log(progress);
});
loader.on('complete', function() {
	console.log('all content loaded!');
	//	Show game start screen on load
	firstLoad();
});
loader.add('/snd/GameEffects2.ogg', {
	onComplete: function() {
		console.log("Music loaded!");
	}
});
loader.load();
