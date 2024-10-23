import React, { SetStateAction, useEffect, useRef, useState } from 'react';
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

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0); // Explicitly type currentIndex as a number
  const [selectedImage,setSelectedImage]=useState(0)

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

  

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleImage=(index:SetStateAction<number>)=>{
    setSelectedImage(index)
  }
  return (
    <>

<div className="container mx-auto px-4">
      {/* For large devices, show products in a grid */}
      <div className="hidden lg:grid grid-cols-4 gap-6">
        <div>
          {images.map((image, index) => (
            <div
              key={index}
              
            >
              <button onClick={() => handleImage(index)} className={`${
                selectedImage === index ? 'border-4 border-blue-500' : ''
              }`}>
                <Image
                  src={image} // dynamic image from the map
                  alt={`Product ${index}`}
                  width={100} // optimized width
                  height={100} // optimized height
                  objectFit="cover" // maintain aspect ratio
                  className="rounded-md shadow-sm m-2"
                />
              </button>
            </div>
          ))}
        </div>

        {/* Large screen selected image */}
        <div>
          <Image
            src={images[selectedImage]}
            alt="Selected Product"
            width={450}
            height={600}
            objectFit="cover"
            className="rounded-md shadow-sm"
          />
        </div>
      </div>

      {/* For small devices, show a swipeable carousel */}
      <div className="lg:hidden flex items-center justify-center overflow-hidden relative">
        {/* Previous Button */}
        <button
          onClick={prevImage}
          className="absolute left-0 z-10 p-2 text-white bg-gray-800 rounded-full"
        >
          &#10094; {/* Left arrow */}
        </button>

        {/* Display the current image */}
        <div className="snap-center shrink-0 w-full">
          <Image
            src={images[currentImageIndex]}
            alt={`Product ${currentImageIndex}`}
            width={450}
            height={600}
            objectFit="cover"
            className="rounded-md shadow-sm"
          />
        </div>

        {/* Next Button */}
        <button
          onClick={nextImage}
          className="absolute right-0 z-10 p-2 text-white bg-gray-800 rounded-full"
        >
          &#10095; {/* Right arrow */}
        </button>
      </div>
    </div>


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