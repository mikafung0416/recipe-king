$(() => {
    // navbar
    $(window).scroll(() => {
        let winScroll = $(this).scrollTop();
        if (winScroll > 0 && winScroll <= 600) {
            // when starting to scroll down: navbar becomes semi-transparent
            $('#nav').css({'opacity': '50%', 'transition': 'all .3s ease'});
        } else if (winScroll > 600) {
            // scrolling down to two columns of options: navbar disappears
            $('#nav').css('display', 'none');
        } else if (winScroll <= 0) {
            // scrolling back to the top: navbar is shown again with original background colour
            $('#nav').css({'display': 'flex', 'opacity': '100%', 'transition': 'all .3s ease'});
        }
        // console.log(winScroll);
    });

})