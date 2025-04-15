
const AboutSection = () => {
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center pt-24">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">About NPFurnish</h1>
        <p className="text-gray-700 mb-6">
          NPFurnish is a leading online furniture platform that specializes in selling
          high-quality wooden furniture for homes, offices, and shops. We also offer
          expert carpentry and installation services to ensure a seamless experience.
        </p>

        <h2 className="text-2xl font-semibold text-blue-500 mb-3">Our Services</h2>
        <ul className="list-disc pl-6 text-gray-700 mb-6">
          <li>High-quality wooden furniture sales</li>
          <li>Furniture installation for homes and offices</li>
          <li>Cabinet and kitchen fitting services</li>
          <li>Expert carpentry solutions</li>
        </ul>

        <h2 className="text-2xl font-semibold text-blue-500 mb-3">Why Choose Us?</h2>
        <p className="text-gray-700 mb-6">
          At NPFurnish, we prioritize customer satisfaction by offering premium
          products, seamless services, and a hassle-free online ordering experience.
        </p>

        <h2 className="text-2xl font-semibold text-blue-500 mb-3">Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions, feel free to reach out to us at  
          <span className="text-blue-600 font-medium"> contact@npfurnish.com</span>.
        </p>
      </div>
    </div>
  );
};

export default AboutSection;
