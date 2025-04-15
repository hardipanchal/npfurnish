import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HeroSection = () => {
  const image = '/hero.jpg';
  const title = 'Welcome to Our Store';
  const buttonText = 'Shop Here';
  const linkText = 'Know More About Us';

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const handleShopClick = () => {
    navigate('/featuredproducts'); // Make sure this route points to your FeaturedProducts component
  };

  return (
    <div className="relative min-h-[500px] overflow-hidden mt-16">
      {/* Background Image */}
      <img
        src={image}
        alt="Hero Background"
        className="w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
        <h1 className="text-4xl font-bold mb-4 text-shadow" data-aos="fade-up">
          {title}
        </h1>

        <button
          onClick={handleShopClick}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105"
          data-aos="zoom-in"
        >
          {buttonText}
        </button>

        <Link
          to="/aboutsection"
          className="mt-4 text-sm underline hover:text-blue-300 transition-all"
          data-aos="fade-up"
        >
          {linkText}
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
