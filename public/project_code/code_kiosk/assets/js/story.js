$('document').ready(function() {
	$('body').fadeIn('slow', function(){

		// Fade out on main menu btn
		$('#mainMenuBtnLink').click(function(event) {
			event.preventDefault();
			newLocation = this.href;
			$('html').fadeOut('slow', newpage);
		});
		function newpage() {
			window.location = newLocation;
		}

		var slides = $('.slide').toArray();
		var timeStops = $('.timeStop').toArray();
		var slideNo = 0;		// Starting slide to display, updated as user moves through slides
		showSlide();
		selectTimeStop();

		var dinasSlideNo = 0;
		var plantlifeSlideNo = 0;
		var firstleafletSlideNo = 0;
		var fireworksPlayed = false;
		var leopardOpeningSlideNo = 0;
		var cubsSlideNo = 0;
		var floodsSlideNo = 0;

		// Timeline navigation events
		$('#downTimeBtn').click(function(){
			if(slideNo !== slides.length - 1) {
				hideSlide();
				deselectTimeStop();
				slideNo++;
				showSlide();		
				selectTimeStop();
				checkSlideEnds();
			}
		});
		$('#upTimeBtn').click(function(){
			if(slideNo !== 0) {
				hideSlide();
				deselectTimeStop();
				slideNo--;
				showSlide();		
				selectTimeStop();	
				checkSlideEnds();
			}
		});
		$('.timeStop').click(function(){
			hideSlide();
			deselectTimeStop();
			slideNo = $(this).attr('data-timeStop');
			showSlide();
			selectTimeStop();
			checkSlideEnds();
		});

		// Slide & timeline management functions
		function checkSlideEnds () {
			if(slideNo === 0) {
				disableDownPointer();
				disableUpPointer();
				enableDownPointer();
			} else if(slideNo === slides.length -1) {
				disableUpPointer();
				disableDownPointer();
				enableUpPointer();
			} else {
				if(slideNo === 5 && fireworksPlayed === false) {
					startFireworks();
					fireworksPlayed = true;
				};
				disableUpPointer();
				disableDownPointer();
				enableUpPointer();
				enableDownPointer();
			}
		}
		function disableUpPointer () {
			$('.upPointer').removeClass('flashUpPointer');
			$('.upScrollBtn').removeClass('flashBtn');
			reflow();
			$('.upScrollBtn').addClass('disabledBtnText');
		}
		function disableDownPointer () {
			$('.downPointer').removeClass('flashDownPointer');
			$('.downScrollBtn').removeClass('flashBtn');
			reflow();
			$('.downScrollBtn').addClass('disabledBtnText');
		}
		function enableUpPointer () {
			$('.upScrollBtn').removeClass('disabledBtnText');
			reflow();
			$('.upPointer').addClass('flashUpPointer');
			$('.upScrollBtn').addClass('flashBtn');
		}
		function enableDownPointer () {
			$('.downScrollBtn').removeClass('disabledBtnText');
			reflow();
			$('.downPointer').addClass('flashDownPointer');
			$('.downScrollBtn').addClass('flashBtn');
		}
		function reflow(){
 			document.querySelector('.upPointer').offsetHeight;
 			document.querySelector('.upScrollBtn').offsetHeight;
 			document.querySelector('.downPointer').offsetHeight;
 			document.querySelector('.downScrollBtn').offsetHeight;
		}

		function hideSlide () {
			$(slides[slideNo]).removeClass('revealedSlide');
			$(slides[slideNo]).addClass('hiddenSlide');
		}
		function showSlide () {
			$(slides[slideNo]).removeClass('hiddenSlide');
			$(slides[slideNo]).addClass('revealedSlide');
			$(slides[slideNo]).children(".revealDiv").addClass('reveal');
		}
		function selectTimeStop () {
			$(timeStops[slideNo]).addClass('selected');
			$(timeStops[slideNo]).ScrollTo();
		}
		function deselectTimeStop () {
			$(timeStops[slideNo]).removeClass('selected');
		}
		function openModal () {
			$('#overlay').removeClass('noOverlay');
			$('#overlay').addClass('activeOverlay');
			$('body').addClass('disableBody');
		}

		function closeModal () {
			$('#overlay').removeClass('activeOverlay');
			$('#overlay').addClass('noOverlay');
			$('body').removeClass('disableBody');
		}

		// Popup link click listeners
		$('#popuplink-chimp').click(function(){
			openModal();
			$('#popup-chimp').removeClass('animated zoomOut activePopup');
			$('#popup-chimp').addClass('animated zoomIn activePopup');
		});
		$('#popuplink-giraffe').click(function(){
			openModal();
			$('#popup-giraffe').removeClass('animated zoomOut activePopup');
			$('#popup-giraffe').addClass('animated zoomIn activePopup');
		});

		$('#popuplink-dinasmap').click(function(){
			openModal();
			$('#popup-dinasmap').removeClass('animated zoomOut activePopup');
			$('#popup-dinasmap').addClass('animated zoomIn activePopup');
		});

		$('#popuplink-dinaspics').click(function(){
			openModal();
			$('#popup-dinaspics').removeClass('animated zoomOut activePopup');
			$('#popup-dinaspics').addClass('animated zoomIn activePopup');
		});
		$('#dinasGalNextBtn').click(function(){
			$("#popup-dinaspics > div.picGallery > div.gallerySlide").eq(dinasSlideNo).removeClass('activeGalSlide');
			dinasSlideNo++;
			if(dinasSlideNo === $("#popup-dinaspics > div.picGallery > div.gallerySlide").length) {
				dinasSlideNo = 0;
			}
			$("#popup-dinaspics > div.picGallery > div.gallerySlide").eq(dinasSlideNo).addClass('activeGalSlide');
		});
		$('#dinasGalPrevBtn').click(function(){
			$("#popup-dinaspics > div.picGallery > div.gallerySlide").eq(dinasSlideNo).removeClass('activeGalSlide');
			dinasSlideNo--;
			if(dinasSlideNo < 0) {
				dinasSlideNo = $("#popup-dinaspics > div.picGallery > div.gallerySlide").length -1;
			}
			$("#popup-dinaspics > div.picGallery > div.gallerySlide").eq(dinasSlideNo).addClass('activeGalSlide');
		});

		$('#popuplink-plantlifepics').click(function(){
			openModal();
			$('#popup-plantlifepics').removeClass('animated zoomOut activePopup');
			$('#popup-plantlifepics').addClass('animated zoomIn activePopup');
		});
		$('#plantlifeGalNextBtn').click(function(){
			$("#popup-plantlifepics > div.picGallery > div.gallerySlide").eq(plantlifeSlideNo).removeClass('activeGalSlide');
			plantlifeSlideNo++;
			if(plantlifeSlideNo === $("#popup-plantlifepics > div.picGallery > div.gallerySlide").length) {
				plantlifeSlideNo = 0;
			}
			$("#popup-plantlifepics > div.picGallery > div.gallerySlide").eq(plantlifeSlideNo).addClass('activeGalSlide');
		});
		$('#plantlifeGalPrevBtn').click(function(){
			$("#popup-plantlifepics > div.picGallery > div.gallerySlide").eq(plantlifeSlideNo).removeClass('activeGalSlide');
			plantlifeSlideNo--;
			if(plantlifeSlideNo < 0) {
				plantlifeSlideNo = $("#popup-plantlifepics > div.picGallery > div.gallerySlide").length -1;
			}
			$("#popup-plantlifepics > div.picGallery > div.gallerySlide").eq(plantlifeSlideNo).addClass('activeGalSlide');
		});

		$('#popupLink-firstLeaflet').click(function(){
			openModal();
			$('#popup-firstLeafletPics').removeClass('animated zoomOut activePopup');
			$('#popup-firstLeafletPics').addClass('animated zoomIn activePopup');
		});
		$('#firstLeafletGalFlipBtn').click(function(){
			$("#popup-firstLeafletPics > div.picGallery > div.gallerySlide").eq(firstleafletSlideNo).removeClass('activeGalSlide');
			firstleafletSlideNo++;
			if(firstleafletSlideNo === $("#popup-firstLeafletPics > div.picGallery > div.gallerySlide").length) {
				firstleafletSlideNo = 0;
			}
			$("#popup-firstLeafletPics > div.picGallery > div.gallerySlide").eq(firstleafletSlideNo).addClass('activeGalSlide');
		});

		$('#popupLink-fruitBats').click(function(){
			openModal();
			$('#popup-fruitBats').removeClass('animated zoomOut activePopup');
			$('#popup-fruitBats').addClass('animated zoomIn activePopup');
		});

		$('#popupLink-phase2clipping').click(function(){
			openModal();
			$('#popup-phase2clipping').removeClass('animated zoomOut activePopup');
			$('#popup-phase2clipping').addClass('animated zoomIn activePopup');
		});

		$('#popupLink-mara').click(function(){
			openModal();
			$('#popup-mara').removeClass('animated zoomOut activePopup');
			$('#popup-mara').addClass('animated zoomIn activePopup');
		});

		$('#popupLink-golden').click(function(){
			openModal();
			$('#popup-golden').removeClass('animated zoomOut activePopup');
			$('#popup-golden').addClass('animated zoomIn activePopup');
		});

		$('#popupLink-meerkatBabies').click(function(){
			openModal();
			$('#popup-meerkatBabies').removeClass('animated zoomOut activePopup');
			$('#popup-meerkatBabies').addClass('animated zoomIn activePopup');
		});

		$('#popupLink-waldrapp').click(function(){
			openModal();
			$('#popup-waldrapp').removeClass('animated zoomOut activePopup');
			$('#popup-waldrapp').addClass('animated zoomIn activePopup');
		});

		$('#popupLink-pigeon').click(function(){
			openModal();
			$('#popup-pigeon').removeClass('animated zoomOut activePopup');
			$('#popup-pigeon').addClass('animated zoomIn activePopup');
		});

		$('#popupLink-cafeClipping').click(function(){
			openModal();
			$('#popup-cafeClipping').removeClass('animated zoomOut activePopup');
			$('#popup-cafeClipping').addClass('animated zoomIn activePopup');
		});

		$('#popupLink-fossa').click(function(){
			openModal();
			$('#popup-fossa').removeClass('animated zoomOut activePopup');
			$('#popup-fossa').addClass('animated zoomIn activePopup');
		});

		$('#popupLink-squirrelMonkey').click(function(){
			openModal();
			$('#popup-squirrelMonkey').removeClass('animated zoomOut activePopup');
			$('#popup-squirrelMonkey').addClass('animated zoomIn activePopup');
		});

		$('#popupLink-agouti').click(function(){
			openModal();
			$('#popup-agouti').removeClass('animated zoomOut activePopup');
			$('#popup-agouti').addClass('animated zoomIn activePopup');
		});

		$('#popupLink-ringtail').click(function(){
			openModal();
			$('#popup-ringtail').removeClass('animated zoomOut activePopup');
			$('#popup-ringtail').addClass('animated zoomIn activePopup');
		});

		$('#popupLink-brownLemur').click(function(){
			openModal();
			$('#popup-brownLemur').removeClass('animated zoomOut activePopup');
			$('#popup-brownLemur').addClass('animated zoomIn activePopup');
		});

		$('#popuplink-leopardOpening').click(function(){
			openModal();
			$('#popup-leopardOpening').removeClass('animated zoomOut activePopup');
			$('#popup-leopardOpening').addClass('animated zoomIn activePopup');
		});
		$('#leopardOpeningGalNextBtn').click(function(){
			$("#popup-leopardOpening > div.picGallery > div.gallerySlide").eq(leopardOpeningSlideNo).removeClass('activeGalSlide');
			leopardOpeningSlideNo++;
			if(leopardOpeningSlideNo === $("#popup-leopardOpening > div.picGallery > div.gallerySlide").length) {
				leopardOpeningSlideNo = 0;
			}
			$("#popup-leopardOpening > div.picGallery > div.gallerySlide").eq(leopardOpeningSlideNo).addClass('activeGalSlide');
		});
		$('#leopardOpeningGalPrevBtn').click(function(){
			$("#popup-leopardOpening > div.picGallery > div.gallerySlide").eq(leopardOpeningSlideNo).removeClass('activeGalSlide');
			leopardOpeningSlideNo--;
			if(leopardOpeningSlideNo < 0) {
				leopardOpeningSlideNo = $("#popup-leopardOpening > div.picGallery > div.gallerySlide").length -1;
			}
			$("#popup-leopardOpening > div.picGallery > div.gallerySlide").eq(leopardOpeningSlideNo).addClass('activeGalSlide');
		});

		$('#popupLink-pavan').click(function(){
			openModal();
			$('#popup-pavan').removeClass('animated zoomOut activePopup');
			$('#popup-pavan').addClass('animated zoomIn activePopup');
		});

		$('#popuplink-cubs').click(function(){
			openModal();
			$('#popup-cubs').removeClass('animated zoomOut activePopup');
			$('#popup-cubs').addClass('animated zoomIn activePopup');
		});
		$('#cubsGalNextBtn').click(function(){
			$("#popup-cubs > div.picGallery > div.gallerySlide").eq(cubsSlideNo).removeClass('activeGalSlide');
			cubsSlideNo++;
			if(cubsSlideNo === $("#popup-cubs > div.picGallery > div.gallerySlide").length) {
				cubsSlideNo = 0;
			}
			$("#popup-cubs > div.picGallery > div.gallerySlide").eq(cubsSlideNo).addClass('activeGalSlide');
		});
		$('#cubsGalPrevBtn').click(function(){
			$("#popup-cubs > div.picGallery > div.gallerySlide").eq(cubsSlideNo).removeClass('activeGalSlide');
			cubsSlideNo--;
			if(cubsSlideNo < 0) {
				cubsSlideNo = $("#popup-cubs > div.picGallery > div.gallerySlide").length -1;
			}
			$("#popup-cubs > div.picGallery > div.gallerySlide").eq(cubsSlideNo).addClass('activeGalSlide');
		});

		$('#popuplink-floods').click(function(){
			openModal();
			$('#popup-floods').removeClass('animated zoomOut activePopup');
			$('#popup-floods').addClass('animated zoomIn activePopup');
		});
		$('#floodsGalNextBtn').click(function(){
			$("#popup-floods > div.picGallery > div.gallerySlide").eq(floodsSlideNo).removeClass('activeGalSlide');
			floodsSlideNo++;
			if(floodsSlideNo === $("#popup-floods > div.picGallery > div.gallerySlide").length) {
				floodsSlideNo = 0;
			}
			$("#popup-floods > div.picGallery > div.gallerySlide").eq(floodsSlideNo).addClass('activeGalSlide');
		});
		$('#floodsGalPrevBtn').click(function(){
			$("#popup-floods > div.picGallery > div.gallerySlide").eq(floodsSlideNo).removeClass('activeGalSlide');
			floodsSlideNo--;
			if(floodsSlideNo < 0) {
				floodsSlideNo = $("#popup-floods > div.picGallery > div.gallerySlide").length -1;
			}
			$("#popup-floods > div.picGallery > div.gallerySlide").eq(floodsSlideNo).addClass('activeGalSlide');
		});

		$('#popupLink-kowari').click(function(){
			openModal();
			$('#popup-kowari').removeClass('animated zoomOut activePopup');
			$('#popup-kowari').addClass('animated zoomIn activePopup');
		});

		$('#popupLink-rhea').click(function(){
			openModal();
			$('#popup-rhea').removeClass('animated zoomOut activePopup');
			$('#popup-rhea').addClass('animated zoomIn activePopup');
		});



		// Generic close button listener
		$('.closeBtn').click(function(){
			$(this).parent().removeClass('animated zoomIn activePopup');
			$(this).parent().addClass('animated zoomOut');
			closeModal();
		})



	});

});


