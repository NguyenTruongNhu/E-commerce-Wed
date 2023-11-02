import React, { memo } from "react";

const Banner = () => {
  return (
    <div className="w-full">
      <img
        src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/online-shopping-banner-template-design-4becd222cad3ce1511f32e5cd53a7dd5_screen.jpg?ts=1624509601"
        alt="banner"
        className="h-[400px] w-full object-cover"
      />
    </div>
  );
};

export default memo(Banner);
