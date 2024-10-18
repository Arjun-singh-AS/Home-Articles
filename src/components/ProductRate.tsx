'use client'

import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

type ProductRateProps = {
  rate: number;
  count: number;
  className?: string; // Optional className prop
};

const ProductRateReact: React.FC<ProductRateProps> = ({ rate, count, className }) => {
  return (
    <div className={`flex flex-col sm:flex-row items-center text-black ${className}`}>
      <Rating style={{ maxWidth: 100 }} value={rate} readOnly />
      <span className="mt-2 sm:mt-0 sm:ml-2 text-sm sm:text-base">{count} reviews</span>
    </div>
  );
};
export default ProductRateReact;
