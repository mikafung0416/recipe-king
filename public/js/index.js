$(() => {
    // navbar
    $(window).scroll(() => {
        let winScroll = $(this).scrollTop();
        if (winScroll > 0 && winScroll <= 1200) {
            // when starting to scroll down: navbar becomes semi-transparent
            $('#nav').css({'opacity': '50%', 'transition': 'all .3s ease'});
        } else if (winScroll > 1200) {
            // scrolling down to two columns of options: navbar disappears
            $('#nav').css('display', 'none');
        } else if (winScroll <= 0) {
            // scrolling back to the top: navbar is shown again with original background colour
            $('#nav').css({'display': 'flex', 'opacity': '100%', 'transition': 'all .3s ease'});
        }
        // console.log(winScroll);
    });
    // hero image hovering
    // $('#hero-words').hover(
    //     () => {
    //         $('#hover-div').css({'display': 'block', 'transition': 'all .3s ease'});
    //     },
    //     () => {
    //         $('#hover-div').css({'display': 'none', 'transition': 'all .3s ease'});
    //     }
    // );

})