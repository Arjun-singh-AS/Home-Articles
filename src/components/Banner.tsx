import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import FileUpload from './Fileupload';
// import { useEdgeStore } from '@/lib/edgestore';
const Banner = () => {
  const images = [
    '/banner/1.jfif',
    '/banner/2.jfif',
    '/banner/3.jfif',
    '/banner/4.jfif',
  ];
  const cl=['cat1','cat2','cat3','cat4']
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  

  useEffect(() => {
    if (!isHovered) { // Only change images when not hovered
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1); // Increase index without cycling
      }, 1000); // Change image every 1 second

      return () => clearInterval(intervalId); // Cleanup on component unmount
    }
  }, [isHovered]);

  useEffect(() => {
    const banner = bannerRef.current;
    if (banner) {
      // Scroll to the current index (seamless scrolling)
      banner.scrollTo({
        left: currentIndex * banner.clientWidth, // Scroll to the next image
        behavior: 'smooth',
      });

      // Check if we reached the duplicated end, reset to the beginning
      if (currentIndex >= images.length) {
        setTimeout(() => {
          banner.scrollTo({ left: 0, behavior: 'auto' }); // Instantly reset to start
          setCurrentIndex(0); // Reset index to 0
        }, 500); // Delay to allow smooth scrolling of the last image
      }
    }
    // console.log(images)
  }, [currentIndex, images.length]);

  return (
    <>
    <div
      ref={bannerRef}
      className="flex overflow-hidden snap-x snap-mandatory h-screen"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar
      onMouseEnter={() => setIsHovered(true)} // Stop rotation when hovered
      onMouseLeave={() => setIsHovered(false)} // Resume rotation when hover ends
    >
      {[...images, ...images].map((image, index) => ( // Duplicate the images for seamless scroll

        <div key={index} className="flex-shrink-0 w-full snap-center">
          <Link href={`product/${cl[index]}`}>
          <Image
            src={image}
            alt={`Banner Image ${index + 1}`}
            layout="responsive"
            width={1920} // Specify a ratio
            height={1080}
            className="w-full h-full object-cover"
          />
          </Link>
        </div>
      ))}
    </div>
    </>
  );
};

export default Banner;