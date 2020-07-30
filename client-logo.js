  $(document).ready(function() {
    $('#client-logos').owlCarousel({
        loop:true,
        margin:15,
        nav:true,
        responsive:{
            0:{
                items:2
            },
            600:{
                items:4
            },
            1000:{
                items:6
            }
        },
        navText: ["<img src='http://pixsector.com/cache/a8009c95/av8a49a4f81c3318dc69d.png'/>","<img src='http://pixsector.com/cache/81183b13/avcc910c4ee5888b858fe.png'/>"]
    });

  });
