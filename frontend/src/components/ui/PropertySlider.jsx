import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const PropertySlider = ({ items = [] }) => (
  <Swiper modules={[Autoplay]} autoplay={{ delay: 2500 }} spaceBetween={12} slidesPerView={1.1} breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}>
    {items.map((item) => (
      <SwiperSlide key={item._id}>
        <img src={item.images?.[0]} alt={item.title} className="h-44 w-full rounded-xl object-cover" loading="lazy" />
      </SwiperSlide>
    ))}
  </Swiper>
);

export default PropertySlider;
