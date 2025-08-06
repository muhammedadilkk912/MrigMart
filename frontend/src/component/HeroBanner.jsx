import { useState, useEffect } from 'react';
import axiosInstance from '../confiq/Axio';
import BannerSkelton from './skelton/BannerSkelton';

const HeroBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);

  // Auto-rotate banners
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length, isAutoPlaying]);

  // Fetch banners from backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axiosInstance.get('/getbanner');
        console.log("banner=",response)
        setLoading(true);
        setBanners(response?.data?.banner);
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }     
    };

    fetchBanners();
  }, []);  

  if (loading) return <BannerSkelton />;

  return (
    <section className="relative px-3 py-3 rounded-lg w-full h-[250px] sm:h-[350px] md:h-[500px] overflow-hidden mx-auto">
      {/* Banner Slides */}
      <div className="relative h-full w-full">
        {banners.length > 0 && (
          <>
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={banner?.image || "/banner.jpg"}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                
                {/* Overlay */}
                {/* <div className="absolute inset-0 bg-black bg-opacity-30"></div> */}
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 drop-shadow-lg">
                      {banner.title?.title || 'New Collection'}
                    </h1>
                    <p className="text-sm sm:text-base md:text-xl mb-4 sm:mb-8 drop-shadow-lg max-w-md sm:max-w-2xl mx-auto">
                      {banner.subtitle?.subtitle || "Summer"}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                      <a
                        href={banner?.link?.link || "#"}
                        className="bg-white text-blue-600 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-100 transition duration-300 text-sm sm:text-base"
                      >
                        Shop Now
                      </a>
                      <button 
                        className="bg-transparent border-2 border-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition duration-300 text-sm sm:text-base"
                        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      >
                        {isAutoPlaying ? 'Pause' : 'Play'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Navigation Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentSlide(index);
                setIsAutoPlaying(false);
              }}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-4 sm:w-6' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => {
              setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
              setIsAutoPlaying(false);
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-100 text-white p-1 sm:p-2 rounded-full z-10 transition-all"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => {
              setCurrentSlide((prev) => (prev + 1) % banners.length);
              setIsAutoPlaying(false);
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-100 text-white p-1 sm:p-2 rounded-full z-10 transition-all"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
};

export default HeroBanner;