$("[data-toggle='collapse']").on('click', function () {
      $("[data-toggle='collapse']").removeClass('current');
      $(this).addClass("current");
  $(this).toggleClass("oppened"); 
       $("[data-toggle='collapse']").not('.current').removeClass('oppened');
});



// Collapse accordion every time dropdown is shown
$('.dropdown-accordion').on('show.bs.dropdown', function (event) {
  var accordion1 = $(this).find($(this).data('accordion'));
  accordion1.find('.panel-collapse.in').collapse('hide');
  $("[data-toggle='collapse']").removeClass('oppened');
});

// Prevent dropdown to be closed when we click on an accordion link
$('.dropdown-accordion').on('click', 'a[data-toggle="collapse"]', function (event) {
  event.preventDefault();
  event.stopPropagation();
  $($(this).data('parent')).find('.panel-collapse.in').collapse('hide');
  $($(this).attr('href')).collapse('show');
  
});



// Close Nav When Link Is Selected
$('.panel-body a[href^="#section"], a[href^="#section"]').on('click', function(){
    $('.navbar-collapse').collapse('hide');
	$('.dropdown-toggle').click();
});


//Smooth Scrolling For Internal Page Links
$(function() {
  $('.list-group a[href*=#]:not([href=#]), a[href="#toTop"]').click(function() {
	if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	  var target = $(this.hash);
	  target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
	  if (target.length) {
		$('html,body').animate({
		  scrollTop: target.offset().top
		}, 1000);
		return false;
	  }
	}
  });
});
