import React, { memo } from "react";
import { Product } from "components";
import Slider from "react-slick";

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
};

const CustomSlider = ({ products, activedTab, normal }) => {
  return (
    <div>
      <>
        {products && (
          <Slider className="custom-slider" {...settings}>
            {products?.map((el, index) => (
              <Product
                key={index}
                pid={el.id}
                productData={el}
                isNew={activedTab === 1 ? false : true}
                normal={normal}
              />
            ))}
          </Slider>
        )}
      </>
    </div>
  );
};

export default memo(CustomSlider);
