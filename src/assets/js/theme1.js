import $ from "jquery";
import WOW from "wow.js";
import Swiper from "swiper";

// Initialize WOW.js
new WOW().init();

// Initialize Swiper
const swiper = new Swiper(".swiper-container", {
  loop: true,
  autoplay: {
    delay: 3000,
  },
});

// Example of using jQuery (only if necessary)
$(document).ready(function () {
  console.log("jQuery is working!");
});
