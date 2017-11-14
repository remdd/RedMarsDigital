$(document).ready(function(){

	var $brushPreview = $('#brushPreview');
	var stroke = {};													//	Hold current stroke
	var strokes = [];													//	Hold all strokes
	var paint = false;													//	Set to 'true' when drawing a brush stroke
	var eyedropperMode = false;
	var eyedropperPicking = false;

	//	Define canvas context
	var context = document.getElementById('canvas').getContext("2d");
	context.imageSmoothingEnabled = false;
	context.lineJoin = "round";											//	Brush shape
	context.lineCap = "round";											//	Brush shape

	//	Button click listeners
	$('#clearBtn').click(reset);										//	Clear button
	$('#undoBtn').click(undo);											//	Undo button
	$('#finishBtn').click(finish);										//	Finish button
	$('#typeEyedropperBtn').click(startEyeDropperMode);					//	Eyedropper mode button
	$('#typeBrushBtn').click(endEyeDropperMode);						//	Brush mode button

	wingTemplate(4, true, true);										//	Draw wing template
	$brushPreview.css('background', 'yellow');							//	Set initial brush colour

	function addClick(x, y)	{
		var click = { x: x, y: y }										//	Set latest click co-ordinates
		stroke.clicks.push(click);										//	Pushes latest click to current stroke
		drawStroke();													//	Updates canvas with latest click
	}

	function drawStroke() {
		context.beginPath();											//	Start path
		if(stroke.clicks.length > 1) {									//	Unless not the first click, set 'starting' co-ordinates to the previous click
			context.moveTo(stroke.clicks[stroke.clicks.length - 2].x, stroke.clicks[stroke.clicks.length - 2].y);
		}
		context.lineTo(stroke.clicks[stroke.clicks.length - 1].x, stroke.clicks[stroke.clicks.length - 1].y);		//	Draw line to most recent click position
		context.strokeStyle = stroke.color;								//	Set stroke colour
		context.lineWidth = stroke.size;								//	Set brush size
		context.closePath();											//	End path
		context.stroke();												//	Draw stroke on canvas
	}

	function redrawStroke() {
		context.beginPath();											//	Start path
		context.lineTo(stroke.clicks[0].x, stroke.clicks[0].y);			//	Start at position of first click in stroke's array
		for(var i = 0; i < stroke.clicks.length; i++) {					//	Iterate clicks in stroke's array
			if(i > 0) {													//	Unless this is the first click in array, start from position of previous click
				context.moveTo(stroke.clicks[i - 1].x, stroke.clicks[i - 1].y)
			}
			context.lineTo(stroke.clicks[i].x, stroke.clicks[i].y);		//	Draw line to current click position
		}
		context.strokeStyle = stroke.color;
		context.lineWidth = stroke.size;
		context.closePath();
		context.stroke();		
	}

	function newStroke(x, y) {											//	Called when starting a new 'stroke' object
		stroke = {
			color: $brushPreview.css('backgroundColor'),				//	Set colour
			size: $brushPreview.width(),								//	Set size
			clicks: [{"x": x, "y": y}]									//	Set co-ordinates of first click
		}
		console.log(stroke);
		drawStroke();													//	Draw on canvas
	}

	//	Called on mousedown & touchstart events
	function touchCanvas(x, y) {
		if(eyedropperMode) {
			eyedropperPicking = true;
			console.log("Getting canvas color from " + x + ", " + y);
			getCanvasColor(x, y);
		} else {
			paint = true;
			newStroke(x, y);
		}
	}

	//	Called on mousemove & touchmove events
	function dragCanvas(x, y) {
		if(eyedropperMode && eyedropperPicking) {
			getCanvasColor(x, y);
		} else if(paint){
			addClick(x, y);
		}
	}

	// Mouse controls
	$('#canvas').on("mousedown", function(e){
		var x = e.pageX - $(this).offset().left;
		var y = e.pageY - $(this).offset().top;
		console.log('touch: ' + x + ", " + y);
		touchCanvas(x, y);
	});
	$('#canvas').on("mousemove", function(e){
		var x = e.pageX - $(this).offset().left;
		var y = e.pageY - $(this).offset().top;
		dragCanvas(x, y);
	});
	// Touch controls
	$('#canvas').on("touchstart", function(e){
		var x = e.touches[0].pageX - $(this).offset().left;
		var y = e.touches[0].pageY - $(this).offset().top;
		touchCanvas(x, y);
	});
	$('#canvas').on("touchmove", function(e){
		var x = e.touches[0].pageX - $(this).offset().left;
		var y = e.touches[0].pageY - $(this).offset().top;
		dragCanvas(x, y);
	});
	// Mouse & touch controls
	$(document).on("mouseup touchend touchcancel", function(e){
		paint = false;
		eyedropperPicking = false;
		endEyeDropperMode();
		if(stroke.clicks && stroke.clicks.length > 0) {
			strokes.push(stroke); 										//	'stroke' object is pushed to 'strokes' array
			stroke = {};												//	'stroke' object is cleared ready for next newStroke
			console.log(strokes.length);
		}
	});
	$(window).on('touchmove', function(e) {
		if(paint) {
			e.preventDefault();
		}
	});

	//	Update brush preview colour (used by eyedropper mode as well as palettes)
	function getCanvasColor(mouseX, mouseY) {
		var touchData = context.getImageData(mouseX, mouseY, 1, 1);
		console.log(touchData);
		var touchColor = 'rgba(' + touchData.data[0] + ',' + touchData.data[1] +',' + touchData.data[2] + ',' + touchData.data[3] + ')';
		$brushPreview.css('backgroundColor', touchColor);
	}

	//	Clear canvas and redraw stored 'strokes' from array
	function redraw() {
		clearCanvas();
		if(strokes.length > 0) {
			for(var i = 0; i < strokes.length; i++) {
				console.log("Drawing stroke " + i);
				stroke = strokes[i];
				redrawStroke();
			}
		}
		stroke = {};
	}

	//	Pop last 'stroke' & redraw canvas
	function undo() {
		console.log("undo!");
		strokes.pop();
		redraw();
	}

	//	Clear and re-initialize canvas context
	function clearCanvas() {
		console.log("clearing down");
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		wingTemplate(4, true, true);
	}
	//	Clear all stored strokes & re-initialize canvas context
	function reset() {
		stroke = {};
		strokes = [];
		clearCanvas();
	}

	function startEyeDropperMode () {
		$('#typeBrushBtn').removeClass('active');
		$('#typeBrushBtn').addClass('inactive');
		$('#typeEyedropperBtn').removeClass('inactive');
		$('#typeEyedropperBtn').addClass('active');
		eyedropperMode = true;
	}
	function endEyeDropperMode () {
		$('#typeBrushBtn').removeClass('inactive');
		$('#typeBrushBtn').addClass('active');
		$('#typeEyedropperBtn').removeClass('active');
		$('#typeEyedropperBtn').addClass('inactive');
		eyedropperMode = false;
	}

	//	Export current canvas context to file, clear down & reset for next user
	function finish() {
		// console.log("finishing...");
		// wingTemplate(4, false, false);
		// canvas.toBlob(function(blob) {
	 	//		saveAs(blob, "NewButterfly.png");
	 	// });
		// reset();
	}

	// Brush size slider
	$('#brushSizeSlider').on('input', function(){
		$brushPreview.width(this.value);
		$brushPreview.height(this.value);
	});

	// Initialize color picker
	$('#colorPicker').show();
	var cp = ColorPicker(
		document.getElementById('slider'),
		document.getElementById('picker'),
		function(hex, hsv, rgb) {
			$brushPreview.css('backgroundColor', hex);
		}
	);
	cp.setHsv({ h: 180, s: 1, v: 1});

	//	Define wing outline as border of canvas context & clip strokes within it
	function wingTemplate(linewidth, fill, clip) {
		context.beginPath();
		context.lineWidth = linewidth;
		context.strokeStyle = "black";
		context.moveTo(162, 34);
		context.quadraticCurveTo(178, 38, 179, 53);
		context.quadraticCurveTo(168, 100, 166, 120);
		context.quadraticCurveTo(168, 135, 170, 138);
		context.quadraticCurveTo(207, 209, 211, 248);
		context.quadraticCurveTo(210, 266, 196, 275);
		context.quadraticCurveTo(116, 313, 116, 313);
		context.quadraticCurveTo(98, 322, 117, 318);
		context.quadraticCurveTo(167, 299, 179, 296);
		context.quadraticCurveTo(215, 289, 236, 328);
		context.quadraticCurveTo(251, 362, 254, 403);
		context.quadraticCurveTo(253, 420, 247, 441);
		context.quadraticCurveTo(231, 477, 211, 497);
		context.quadraticCurveTo(197, 509, 178, 509);
		context.quadraticCurveTo(134, 508, 100, 482);
		context.quadraticCurveTo(67, 454, 49, 431);
		context.quadraticCurveTo(11, 384, 3, 364);
		context.quadraticCurveTo(3, 343, 4, 339);
		context.quadraticCurveTo(13, 317, 15, 299);
		context.quadraticCurveTo(20, 269, 24, 242);
		context.quadraticCurveTo(39, 175, 65, 126);
		context.quadraticCurveTo(114, 43, 162, 34);
		context.stroke();
		if(fill) {
			context.fillStyle = "white";
			context.fill();
		}
		if(clip) {
			context.clip();
		}
	}

});
