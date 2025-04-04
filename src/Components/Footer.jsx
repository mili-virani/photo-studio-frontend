import React from "react";
import { Link } from "react-router-dom"; // Import Link
import bg5 from "../assets/img/background/bg-5.png";
import logo from "../assets/img/logo.png";
import { FaFacebook, FaInstagram, FaLinkedin, FaBehance } from "react-icons/fa"; 

const Footer = () => {
  return (
    <footer className="footer style1 bg-image-2" style={{ backgroundImage: `url(${bg5})` }}>
      <div className="footer-top">
        <div className="container">
          <div className="footer--inner">
            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-6 mb-5 mb-md-0">
                <div className="footer-widget">
                  <div className="footer-nav">
                    <ul>
                      <li className="menu-item"><Link to="/about">About Us</Link></li>
                      <li className="menu-item"><Link to="/gallery">Gallery</Link></li>
                      <li className="menu-item"><Link to="/services">Services</Link></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-4 mb-5 mb-md-0 order-1 order-md-0">
                <div className="footer-widget text-center">
                  <div className="logo mr-bottom-55">
                    <Link to="/"><img src={logo} alt="logo" style={{height:"117px",width:"28px"}}/></Link>
                  </div>
                 
                </div>
              </div>

              <div className="col-lg-4 col-md-4 col-sm-6 mb-5 mb-md-0">
                <div className="footer-widget text-md-end">
                  <div className="footer-nav">
                    <ul>
                      <li className="menu-item"><Link to="/booking">Booking</Link></li>
                      <li className="menu-item"><Link to="/shop">Products</Link></li>
                      <li className="menu-item"><Link to="/contact">Contact Us</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Part */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <div className="copyright">
              <p><a href="https://photostudiobymili.netlify.app/">Candid Creations</a> photography, All Rights Reserved</p>
            </div>
            <div className="social-box style-oval">
              <ul>
                <li><a href="https://www.facebook.com/"><FaFacebook /></a></li>
                <li><a href="https://www.instagram.com/"><FaInstagram /></a></li>
                <li><a href="https://www.linkedin.com/"><FaLinkedin /></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
