import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { formatPrice } from "../../utils/format";

const PropertySlider = ({ items = [] }) => (
  <Swiper modules={[Autoplay]} autoplay={{ delay: 2500 }} spaceBetween={12} slidesPerView={1.1} breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}>
    {items.map((item) => (
      <SwiperSlide key={item._id}>
        <Link to={`/properties/${item.slug}`} className="block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <img src={item.images?.[0]} alt={item.title} className="h-44 w-full object-cover" loading="lazy" />
          <div className="space-y-1 p-3">
            <p className="line-clamp-2 text-sm font-semibold text-slate-900">{item.title}</p>
            <p className="text-sm font-bold text-brand-700">{formatPrice(item.price)}</p>
          </div>
        </Link>
      </SwiperSlide>
    ))}
  </Swiper>
);

export default PropertySlider;
