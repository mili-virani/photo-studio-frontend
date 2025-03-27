import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import "../assets/css/header.css";
import "../assets/css/global.css";
import "../assets/css/components.css";
import img3 from "../assets/img/slider/13.jpg";
import img2 from "../assets/img/slider/14.jpg";
import img1 from "../assets/img/slider/15.jpg";
import Navbar from "./Navbar";

const SliderSection = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("userEmail");
    if (storedEmail) {
      const extractedName = storedEmail.split("@")[0]; // Extracts name before '@'
      console.log(sessionStorage.getItem("email"));
      setUsername(extractedName);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="wrapper">
        {/* Welcome Message */}
        {username && (
          <div className="text-center mt-5 pt-5" >
            <h2 className="mb-0 wptb-item--title" style={{color:"white"}}>Welcome, {username}!</h2>
          </div>
        )}

        {/* Slider Section */}
        <section className="wptb-slider style6">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            pagination={{
              el: ".swiper-pagination",
              clickable: true,
            }}
            className="wptb-swiper-slider-six"
          >
            {[img1, img2, img3].map((img, index) => (
              <SwiperSlide key={index}>
                <div
                  className="wptb-slider--item"
                  style={{
                    backgroundImage: `url(${img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                  }}
                >
                  {/* Light Background Overlay */}
                  <div className="overlay"></div>

                  <div className="wptb-slider--inner">
                    <div className="wptb-heading">
                      <h6 className="wptb-item--subtitle">Fashion Portfolio</h6>
                      <h1 className="wptb-item--title">
                        Sinking Green Silk Linen
                      </h1>
                      <div className="wptb-item--button">
                      <Link className="btn btn-two white-opacity creative" to="/about">
                          <span className="btn-wrap">
                            <span className="text-first">Explore Now</span>
                            <span className="text-second">
                              <i className="bi bi-arrow-up-right"></i>
                              <i className="bi bi-arrow-up-right"></i>
                            </span>
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Left Pane */}
          <div className="wptb-left-pane justify-content-center">
            <div className="logo">
              <h6>Our Works</h6>
            </div>
          </div>

          {/* Right Pane */}
          <div className="wptb-right-pane">
            <div className="social-box style-square">
              <ul>
                {["facebook", "instagram", "twitter-x", "youtube", "dribbble"].map((social, i) => (
                  <li key={i}>
                    <a href={`https://www.${social}.com/`}>
                      <i className={`bi bi-${social}`}></i>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Pane */}
          <div className="wptb-bottom-pane justify-content-center">
            {/* Pagination Dots */}
            <div className="wptb-swiper-dots style2">
              <div className="swiper-pagination"></div>
            </div>

            {/* Swiper Navigation */}
            <div className="wptb-swiper-navigation style3">
              <div className="wptb-swiper-arrow swiper-button-prev"></div>
              <div className="wptb-swiper-arrow swiper-button-next"></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SliderSection;
