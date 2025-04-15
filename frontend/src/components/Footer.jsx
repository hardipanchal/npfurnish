import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-13">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-xl mb-4">NPFurnish</h4>
            <p className="text-gray-400">Your one-stop shop for stylish and affordable furniture.</p>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link to="/furniture" className="text-gray-400 hover:text-white transition-colors duration-200">Shop</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-200">About</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</Link>
              </li>
              <li>
                <Link to="/cancellation-refund" className="text-gray-400 hover:text-white transition-colors duration-200">Cancellation & Refund</Link>
              </li>
              <li>
                <Link to="/shipping-delivery" className="text-gray-400 hover:text-white transition-colors duration-200">Shipping & Delivery</Link>
              </li>
              <li>
                <Link to="/contact-us" className="text-gray-400 hover:text-white transition-colors duration-200">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xl mb-4">Contact</h4>
            <p className="text-gray-400">Email: npfurnish@gmail.com</p>
            <p className="text-gray-400">Phone: +91 9601380951</p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} NPFurnish. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
