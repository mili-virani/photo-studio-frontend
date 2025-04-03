import React, { useEffect } from "react";
import circleImg from "../assets/img/more/circle.png";

const Common = ({ title, pageHeaderBg }) => {
    useEffect(() => {
        document.title = `${title} | Candid Creations`;
    }, [title]);

    return (
        <div className="wptb-page-heading">
            <div
                className="wptb-item--inner"
                style={{ backgroundImage: `url(${pageHeaderBg})` }}
            >
                <div className="wptb-item-layer wptb-item-layer-one">
                    <img src={circleImg} />
                </div>

                <h2 className="wptb-item--title">{title}</h2>
            </div>
        </div>
    );
};

export default Common;
