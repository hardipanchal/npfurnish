export default function OrderSuccess() {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 px-4 bg-green-50">
        <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md">
          <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Order Confirmed!</h2>
          <p className="text-gray-700 mb-6">
            Thank you! Your order has been placed successfully. Our team will deliver it soon.
          </p>
          <a
            href="/"
            className="inline-block mt-4 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }
  