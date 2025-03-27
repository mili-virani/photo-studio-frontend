(function ($) {
	'use strict';
	
	jQuery(document).ready(function () {

        gsap.registerPlugin(ScrollTrigger);
        gsap.defaults({ease: "none", duration: 2});

        // create a sequence that moves 3 of the panels in from different directions 
        const tl = gsap.timeline();
        tl.from(".trigger-one", {yPercent: 100})
            .from(".trigger-two", {yPercent: 100})
            .from(".trigger-three", {yPercent: 100})
            .from(".trigger-four", {yPercent: 100})
            .from(".trigger-five", {yPercent: 100})
            .from(".trigger-six", {yPercent: 100});
        // tl.from(".scrolltrigger-slide", {yPercent: -100});

        // pin the container and link the animation to the scrollbar (scrub: true). We could easily embed this in the gsap.timeline() to shorten things a bit, but this is to show that you can create the ScrollTrigger separately if you prefer. 
        ScrollTrigger.create({
            animation: tl,
            trigger: "#wptb-triggerslider",
            start: "top top",
            end: "+=4000", 
            scrub: true,
            pin: true,
            anticipatePin: 1
        });

    });      
})(jQuery);