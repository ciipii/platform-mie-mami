
import bgImage from '../assets/bg.png';

function Hero2() {
  return (
    <div className="relative overflow-hidden min-h-[90vh] flex flex-col justify-center">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Hero content */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 flex-grow flex flex-col items-center justify-center z-10">
        {/* Text content */}
        <div className="flex flex-col w-full max-w-3xl justify-center items-center text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mt-10">
            <span className="block">Mie Mami</span>
            <span className="block text-[#E64516]">Authentic Indonesian Taste</span>
          </h1>
          <p className="mt-4 md:mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-gray-300">
            Experience the finest Indonesian cuisine with our carefully crafted menu.
            Fresh ingredients, amazing flavors, and unforgettable moments.
          </p>
          <div className="mt-8 md:mt-12 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 z-10">
            <button
              onClick={() => {
                const menuSection = document.getElementById('menu');
                if (menuSection) {
                  menuSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-6 sm:px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#E64516] hover:bg-[#d13a0d] transition-colors"
            >
              View Menu
            </button>
            <button
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-6 sm:px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-[#441E1B] transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Decorative wave shape at bottom */}
      <div className="absolute -bottom-1 left-0 right-0 w-full z-0 overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250" className="w-full" preserveAspectRatio="none" style={{ height: '150px' }}>
          <path fill="#ffffff" fillOpacity="1" d="M0,160L48,144C96,128,192,96,288,90.7C384,85,480,107,576,122.7C672,139,768,149,864,144C960,139,1056,117,1152,112C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
}

export default Hero2