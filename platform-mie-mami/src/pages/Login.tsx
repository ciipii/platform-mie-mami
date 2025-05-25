import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // For demo purposes - simulate successful login if email is "demo@test.com"
      if (formData.email === 'demo@test.com' && formData.password === 'password') {
        const mockToken = 'demo-token-' + Date.now();
        login(mockToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        navigate('/');
        return;
      }

      const response = await loginUser(formData);

      // Handle different possible token field names
      const token = response.access_token || response.token;

      if (!token) {
        setErrors({ general: 'No authentication token received from server.' });
        return;
      }

      // Simpan token dan set default header
      login(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redirect ke main menu
      navigate('/');

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Handle network errors
        if (!error.response) {
          setErrors({ general: 'Network error. Please check your connection and try again.' });
        } else if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response?.data?.message) {
          setErrors({ general: error.response.data.message });
        } else if (error.response?.status === 401) {
          setErrors({ general: 'Invalid email or password.' });
        } else if (error.response?.status === 422) {
          setErrors({ general: 'Please check your input and try again.' });
        } else {
          setErrors({ general: 'Login failed. Please try again.' });
        }
      } else {
        setErrors({ general: 'Unexpected error occurred.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-center mb-6">Log In to Your Account</h2>

            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {errors.general}
              </div>
            )}

            {/* Demo credentials info */}
            <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
              <p className="text-sm">
                <strong>Demo Login:</strong><br />
                Email: demo@test.com<br />
                Password: password
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.email && (
                  <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-gray-700 font-medium">
                    Password
                  </label>
                  <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.password && (
                  <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-md transition-colors flex items-center justify-center`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Logging in...
                  </>
                ) : 'Log In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-indigo-600 hover:text-indigo-800">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
