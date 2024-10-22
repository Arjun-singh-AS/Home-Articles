import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
const Banner = () => {
  const images = [
    '/data/t-shirt.jpg',
    '/data/t-shirt.jpg',
    '/data/t-shirt.jpg',
    '/data/t-shirt.jpg',
  ];
  const cl = ['cat1', 'cat2', 'cat3', 'cat4']
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
        }, 1000); // Delay to allow smooth scrolling of the last image
      }
    }
    // console.log(images)
  }, [currentIndex, images.length]);

  return (
    <>
      <div
        ref={bannerRef}
        className="flex overflow-hidden snap-x snap-mandatory h-auto sm:h-screen mt-20 pt-3" // Responsive height
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar
        onMouseEnter={() => setIsHovered(true)} // Stop rotation when hovered
        onMouseLeave={() => setIsHovered(false)} // Resume rotation when hover ends
      >
        {[...images, ...images].map((image, index) => ( // Duplicate the images for seamless scroll
          <div key={index} className="flex-shrink-0 w-full snap-center">
            <Link href={`product/${cl[index]}`}>
              <div className="relative w-full h-0 pb-[100%] sm:pb-[56.25%]"> {/* Square on small devices, 16:9 on larger */}
                <Image
                  src={image}
                  alt={`Banner Image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="w-full h-full"
                />
              </div>
            </Link>
          </div>
        ))}
      </div>

    </>
  );
};

export default Banner;