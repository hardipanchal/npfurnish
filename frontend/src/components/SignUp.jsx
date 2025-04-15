import { useState } from 'react';
import axios from 'axios';
import { CSpinner } from '@coreui/react'
import { Link } from 'react-router-dom';



const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true); // Start loading

    try {
        const response = await axios.post('http://localhost:8000/api/user/register', {
            name,
            email,
            password,
            phone
        });

        if (response.data?.success) {
            setSuccess('Signup successful! You can now login.');
            localStorage.setItem("userEmail", email); // Save email for verification
            setTimeout(() => {
                window.location.href = '/verifyemail'; // Redirect after 2 seconds
            }, 2000);
            
        } else {
            setError(response.data?.message || 'Signup failed. Please try again.');
        }
    } catch (err) {
        console.error('Signup Error:', err);
        setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
        setLoading(false); // Stop loading
    }
};

return (
  <div className="min-h-screen flex items-center justify-center pt-24 bg-gray-100 relative">
    {loading && (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50">
        <CSpinner color="primary" style={{ width: "3rem", height: "3rem" }} />
      </div>
    )}

    <div className={`bg-white p-8 rounded-lg shadow-lg w-full max-w-md ${loading ? 'opacity-50' : ''}`}>
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
            type="submit"
            className="w-full mt-4 text-white py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Sign up
          </button>
        <p className="text-center text-sm text-gray-600 mt-4">
          already have an account?{' '}
          <Link to="/login" className="text-blue-500 font-semibold hover:underline">
           Login
          </Link>
        </p>
        
      </form>
    </div>
  </div>
);
};

export default Signup;
