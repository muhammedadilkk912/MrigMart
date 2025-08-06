const BannerSkelton = () => {
  return (
    <div className="w-full h-[400px] md:h-[500px] bg-gray-200 animate-pulse overflow-hidden">
      {/* Content area skeleton */}
      <div className="container mx-auto px-4 h-full w-full flex flex-col items-center justify-center relative">
        {/* Title skeleton */}
        <div className="h-10 w-3/4 md:w-1/2 bg-gray-300 rounded mb-4"></div>
        
        {/* Subtitle skeleton */}
        <div className="h-6 w-2/3 md:w-1/3 bg-gray-300 rounded mb-8"></div>
        
        {/* Buttons skeleton */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full max-w-md">
          <div className="h-12 w-32 bg-gray-300 rounded-lg"></div>
          <div className="h-12 w-32 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default BannerSkelton;