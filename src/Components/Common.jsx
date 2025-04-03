import React,{useEffect} from "react";

const Common = ({ title, pageHeaderBg, circleImg }) => {
    useEffect(() => {
        document.title = `${title} | Candid Creations`;
      }, [title]); 
    
  return (
    <div className="wptb-page-heading">
      <div
        className="wptb-item--inner"
        style={{ backgroundImage: `url(${pageHeaderBg})` }}
      >
        {/* Render Circle Image only if it is provided */}
        {circleImg && (
          <div className="wptb-item-layer wptb-item-layer-one">
            <img src={circleImg} alt="Circle" />
          </div>
        )}
        <h2 className="wptb-item--title">{title}</h2>
      </div>
    </div>
  );
};

export default Common;
