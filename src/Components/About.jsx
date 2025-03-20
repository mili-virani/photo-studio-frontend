import { useEffect, useState } from "react";
import axios from "axios";

import "../assets/css/main.css"; // Import your CSS
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Bootstrap JS

import pageHeaderBg from "../assets/img/background/page-header-bg-4.jpg"; // Page header background
import circleImg from "../assets/img/more/circle.png"; // Circle image
import bgImage from "../assets/img/more/texture.png"; // About section background
import bg6 from "../assets/img/background/bg-6.jpg"; // Main image
import img1 from "../assets/img/more/1.jpg"; // Additional image 1
import img2 from "../assets/img/more/2.jpg"; // Additional image 2
import light1 from "../assets/img/more/light-1.png"; // Light overlay image
import bg from "../assets/img/background/bg-8.jpg"; // Background image
import img3 from "../assets/img/more/3.png"; // Image
import star from "../assets/img/more/star.png";
import starDark from "../assets/img/more/star-dark.png";
import bg7 from "../assets/img/background/bg-7.jpg";
import light3 from "../assets/img/more/light-3.png";
import { FaPlay } from "react-icons/fa"; // Assuming you're using react-icons for icons
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const About = () => {
  const [categoryCount, setCategoryCount] = useState(0);
  const [aboutData, setAboutData] = useState(null);
  const [feedbackStats, setFeedbackStats] = useState({
    positiveFeedback: 0,
    totalFeedback: 1, // Prevent divide by zero
  });
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/dashboard-counts`) // Adjust API URL
      .then((response) => {
        setCategoryCount(response.data.categories);
      })
      .catch((error) => {
        console.error("Error fetching category count:", error);
      });
  }, []);
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/aboutus`) // Tamari backend API URL muko
      .then((res) => res.json())
      .then((data) => setAboutData(data))
      .catch((error) => console.error("Error fetching About Us data:", error));
  }, []);

  useEffect(() => {
    // API Call to fetch feedback stats
    const fetchFeedbackData = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/feedback/feedback-stats`
        ); // Update with your API
        const data = await response.json();
        setFeedbackStats({
          positiveFeedback: data.positiveFeedback || 0,
          totalFeedback: data.totalFeedback || 1,
        });
      } catch (error) {
        console.error("Error fetching feedback stats:", error);
      }
    };

    fetchFeedbackData();
  }, []);
  const feedbackPercentage = Math.round(
    (feedbackStats.positiveFeedback / feedbackStats.totalFeedback) * 100
  );
  return (
    <div>
      {/* Page Header */}
      <div className="wptb-page-heading">
        <div
          className="wptb-item--inner"
          style={{ backgroundImage: `url(${pageHeaderBg})` }}
        >
          <div className="wptb-item-layer wptb-item-layer-one">
            <img src={circleImg} alt="Circle" />
          </div>
          <h2 className="wptb-item--title">  About Us</h2>
        </div>
      </div>

      {/* About Section */}
      <section
        className="wptb-about-one bg-image-2"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="container">
          {/* Top Image */}
          <div className="wptb-image-single mr-bottom-90 wow fadeInUp">
            <div className="wptb-item--inner">
              <div className="wptb-item--image">
                <img src={bg6} alt="Background" />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-8">
              <div className="row">
                {/* Left Image */}
                <div className="col-md-6">
                  <div className="wptb-image-single wow fadeInUp">
                    <div className="wptb-item--inner">
                      <div className="wptb-item--image">
                        <img src={img1} alt="More 1" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Text */}
                <div className="col-md-6 ps-md-0 mt-5">
                  <div className="wptb-about--text">
                    <p className="wptb-about--text-one mb-4">
                      {aboutData?.description1}
                    </p>
                    <p>{aboutData?.description2}</p>
                  </div>
                </div>
              </div>

              {/* Counter Section */}
              <div className="row wptb-about-funfact">
                <div className="row wptb-about-funfact">
                  {/* Customer Satisfaction */}
                  <div className="col-md-6 mb-4 mb-md-0">
                    <div className="wptb-counter1 style1 pd-right-60 wow skewIn">
                      <div className="wptb-item--inner">
                        <div className="wptb-item--holder d-flex align-items-center">
                          <div className="wptb-item--value">
                            <span className="odometer">
                              {feedbackPercentage}
                            </span>
                            <span className="suffix">%</span>
                          </div>
                          <div className="wptb-item--text">
                            Customer Satisfaction
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="wptb-counter1 style1 pd-right-60 wow skewIn">
                      <div className="wptb-item--inner">
                        <div className="wptb-item--holder d-flex align-items-center">
                          <div className="wptb-item--value flex-shrink-0">
                            <span className="odometer">{categoryCount}</span>
                            <span className="suffix">+</span>
                          </div>
                          <div className="wptb-item--text">
                            Photography Sessions
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Image */}
            <div className="col-xl-4 ps-xl-5 mt-5 mt-xl-0 d-none d-xl-block">
              <div className="wptb-image-single wow fadeInUp">
                <div className="wptb-item--inner">
                  <div className="wptb-item--image">
                    <img src={img2} alt="More 2" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Light Image */}
          <div className="wptb-item-layer wptb-item-layer-one">
            <img src={light1} alt="Light" />
          </div>
        </div>
      </section>

      <section
        className="wptb-faq-one bg-image pb-0"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="container">
          <div className="row d-flex align-items-center">
            {/* Left Side - Accordion Content */}
            <div className="col-lg-6">
              <div className="wptb-heading">
                <div className="wptb-item--inner">
                  <h1 className="wptb-item--title mb-lg-0">
                    {aboutData?.title}
                  </h1>
                </div>
              </div>
              <div className="wptb-accordion wptb-accordion2 wow fadeInUp">
                <div className="wptb--item active">
                  <h6 className="wptb-item-title">
                    <span>CC Missions</span>
                    <i className="plus bi bi-plus"></i>
                    <i className="minus bi bi-dash"></i>
                  </h6>
                  <div className="wptb-item--content">
                    {aboutData?.description3}
                  </div>
                </div>

                <div className="wptb--item">
                  <h6 className="wptb-item-title">
                    <span>Candid Creations Photography Features</span>
                    <i className="plus bi bi-plus"></i>
                    <i className="minus bi bi-dash"></i>
                  </h6>
                  <ul>
                    {aboutData?.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="wptb-agency-experience--item">
                <span>15+</span> Years Experience
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="col-lg-6 d-flex justify-content-end">
              <div className="wptb-image-single wow fadeInUp">
                <div className="wptb-item--inner">
                  <div className="wptb-item--image">
                    <img src={img3} alt="img" className="img-fluid" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="wptb-marquee pd-top-80">
        <div className="wptb-text-marquee1 wptb-slide-to-left">
          <div className="wptb-item--container">
            <div className="wptb-item--inner">
              <h4 className="wptb-item--text">
                <span className="wptb-text-backdrop">Candid Creations</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src={star} alt="img" />
                  <img src={starDark} alt="img" />
                </span>
              </h4>
              <h4 className="wptb-item--text text-outline">
                <span className="wptb-text-backdrop">Photography</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src={star} alt="img" />
                  <img src={starDark} alt="img" />
                </span>
              </h4>
              <h4 className="wptb-item--text">
                <span className="wptb-text-backdrop">Studio</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src={star} alt="img" />
                  <img src={starDark} alt="img" />
                </span>
              </h4>
              <h4 className="wptb-item--text text-outline">
                <span className="wptb-text-backdrop">Agency</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src={star} alt="img" />
                  <img src={starDark} alt="img" />
                </span>
              </h4>
              <h4 className="wptb-item--text">
                <span className="wptb-text-backdrop">Candid Creations</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src={star} alt="img" />
                  <img src={starDark} alt="img" />
                </span>
              </h4>
            </div>

            <div className="wptb-item--inner">
              <h4 className="wptb-item--text text-outline">
                <span className="wptb-text-backdrop">Photography</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src={star} alt="img" />
                  <img src={starDark} alt="img" />
                </span>
              </h4>
              <h4 className="wptb-item--text">
                <span className="wptb-text-backdrop">Studio</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src={star} alt="img" />
                  <img src={starDark} alt="img" />
                </span>
              </h4>
              <h4 className="wptb-item--text text-outline">
                <span className="wptb-text-backdrop">Agency</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src={star} alt="img" />
                  <img src={starDark} alt="img" />
                </span>
              </h4>
              <h4 className="wptb-item--text">
                <span className="wptb-text-backdrop">Candid Creations</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src={star} alt="img" />
                  <img src={starDark} alt="img" />
                </span>
              </h4>
              <h4 className="wptb-item--text text-outline">
                <span className="wptb-text-backdrop">Photography</span>
                <span className="wptb-item-layer both-version position-relative">
                  <img src={star} alt="img" />
                  <img src={starDark} alt="img" />
                </span>
              </h4>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div
          className="wptb-video-player1 wow zoomIn"
          style={{ backgroundImage: `url(${bg7})` }}
        >
          <div className="wptb-item--inner">
            <div className="wptb-item--holder">
              <div className="wptb-item--video-button">
                <a
                  className="btn"
                  data-fancybox
                  href="https://www.youtube.com/watch?v=SF4aHwxHtZ0"
                >
                  <span className="text-second">
                    <FaPlay />
                  </span>
                  <span className="line-video-animation line-video-1"></span>
                  <span className="line-video-animation line-video-2"></span>
                  <span className="line-video-animation line-video-3"></span>
                </a>
              </div>
            </div>
          </div>
          <div className="wptb-item-layer wptb-item-layer-one">
            <img src={light3} alt="img" />
          </div>
        </div>
        <div className="divider-line-hr mr-top-100"></div>
      </div>
    </div>
  );
};

export default About;
