var count = 0;

function heroAnimations() {
	var heroDetails = document.querySelectorAll('.slider__details');
	for (i=0; i<heroDetails.length; i++) {
		heroDetails[i].setAttribute('style', 'display: none');
	}
	var navDot = document.querySelectorAll('.slider__navigation--dot');
	for (i=0; i<navDot.length; i++) {
		navDot[i].setAttribute('style', 'background: #CE2A2A');
	}
	var sliderImage = document.querySelectorAll('.slider__image');
	for (i=0; i<sliderImage.length; i++) {
		sliderImage[i].setAttribute('style', 'opacity: 0');
	}
	count++;
	if (count > heroDetails.length) {
      count = 1;
   	}
	sliderImage[count-1].setAttribute('style', 'opacity: 1');
	heroDetails[count-1].setAttribute('style', 'display: block');
	var sliderFront = document.querySelector('.slider__background--front');
	var sliderDetails = document.querySelectorAll('.slider__details');
	setTimeout(function() {
		for (i=0; i<sliderDetails.length;i++) {
			sliderDetails[i].classList.add('fade-out');
		}
		for (i=0; i<sliderImage.length;i++) {
			sliderImage[i].classList.add('slider-image__animation');
		}
		sliderFront.classList.add('slider-front__animation');
		heroAnimations();
	}, 6000);
	
}

heroAnimations();
