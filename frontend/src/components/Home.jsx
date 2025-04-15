import HeroSection from './HeroSection';
import FeaturedProducts from './FeaturedProducts';
import WhyChooseUsSection from './WhyChooseUsSection';
import Footer from './Footer';
import CategoriesSection from './CategoriesSection';

const Home = () => {
  return (
    <div className="bg-gray-100">
      <HeroSection />
      <CategoriesSection/>
      <FeaturedProducts />
         
      <WhyChooseUsSection />
      <Footer />
    </div>
  );
};

export default Home;   