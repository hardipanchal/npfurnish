const Contact = () => {
  return (
    <section className="bg-gray-100 min-h-screen min-w-screen flex items-center justify-center pt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Contact Us</h2>
          <p className="text-gray-600 mb-8">
            Have questions or need assistance? Were here to help! Reach out to us using the form
            below or through our contact information.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-md text-left">
            <form>
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Enter your message"
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
          <div className="mt-12 text-gray-600">
            <h3 className="text-xl font-semibold mb-4">Our Contact Information</h3>
            <p className="mb-2">Email: npfurnish@gmail.com</p>
            <p className="mb-2">Phone: +91 9601380951</p>
            <p>Address: 123 Furniture Street, ghatlodiya, ahmedabad.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 