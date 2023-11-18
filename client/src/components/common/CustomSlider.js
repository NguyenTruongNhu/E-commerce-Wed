import ArticleCard from 'components/blogs/ArticleCard'
import Product from 'components/products/Product'
import React, { memo } from 'react'
import Slider from 'react-slick'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1
}
//flex flex-wrap gap-4 mt-4 justify-between
const CustomSlider = ({ products, blogs, activedTab, normal }) => {
  return (
    <div>
      <>
        {products && (
          <Slider className="custom-slider cursor-pointer" {...settings}>
            {products?.map((el, index) => (
              <Product
                key={index}
                pid={el._id}
                productData={el}
                isNew={activedTab === 1 ? false : true}
                normal={normal}
                className=""
              />
            ))}
          </Slider>
        )}
        {blogs && (
          <Slider className="custom-slider" {...settings}>
            {blogs?.map((el, index) => (
              <ArticleCard key={index} bid={el._id} blogData={el} />
            ))}
          </Slider>
        )}
      </>
    </div>
  )
}

export default memo(CustomSlider)
