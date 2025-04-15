import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const WhyChooseUsSection = () => {
  const reasons = [
    { title: 'Quality Materials', description: 'We use only the best materials for our furniture.' },
    { title: 'Modern Designs', description: 'Our designs are both functional and aesthetically pleasing.' },
    { title: 'Affordable Prices', description: 'Experience luxury without breaking the bank.' },
    { title: 'Excellent Support', description: 'Our customer service team is always here to help.' },
  ];

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800" data-aos="fade-up">
          Why Choose NPFurnish?
        </h2>

        {/* Reasons List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              data-aos="fade-up"
              data-aos-delay={index * 100}  // Adding slight delay for staggered animation
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{reason.title}</h3>
              <p className="text-gray-600">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
