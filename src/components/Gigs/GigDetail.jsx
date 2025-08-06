import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, RefreshCw, Check, User, MessageCircle, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../UI/LoadingSpinner';

export const GigDetail = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('basic');

  useEffect(() => {
    if (id) {
      fetchGig();
    }
  }, [id]);

  const fetchGig = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/gigs/${id}`);
      
      if (!response.ok) {
        throw new Error('Gig not found');
      }

      const data = await response.json();
      setGig(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch gig');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      // Redirect to login
      return;
    }

    if (!gig) return;

    try {
      const response = await fetch('http://localhost:5000/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          gigId: gig._id,
          packageType: selectedPackage
        })
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Purchase error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gig Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/gigs" className="text-blue-600 hover:text-blue-700">
            Browse All Gigs
          </Link>
        </div>
      </div>
    );
  }

  const currentPackage = gig.pricing[selectedPackage];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Gig Images */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
              <img
                src={gig.images[0]?.url || 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800'}
                alt={gig.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Gig Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{gig.title}</h1>
              
              {/* Freelancer Info */}
              <div className="flex items-center space-x-4 mb-6">
                {gig.freelancer.avatar ? (
                  <img
                    src={gig.freelancer.avatar}
                    alt={gig.freelancer.fullName}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{gig.freelancer.fullName}</h3>
                  <p className="text-gray-600">@{gig.freelancer.username}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{gig.freelancer.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-gray-500">({gig.freelancer.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Gig</h2>
                <p className="text-gray-700 leading-relaxed">{gig.description}</p>
              </div>

              {/* Tags */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {gig.searchTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              {/* Package Selection */}
              <div className="mb-6">
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setSelectedPackage('basic')}
                    className={`flex-1 py-3 px-4 text-sm font-medium ${
                      selectedPackage === 'basic'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Basic
                  </button>
                  {gig.pricing.standard && (
                    <button
                      onClick={() => setSelectedPackage('standard')}
                      className={`flex-1 py-3 px-4 text-sm font-medium ${
                        selectedPackage === 'standard'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Standard
                    </button>
                  )}
                  {gig.pricing.premium && (
                    <button
                      onClick={() => setSelectedPackage('premium')}
                      className={`flex-1 py-3 px-4 text-sm font-medium ${
                        selectedPackage === 'premium'
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Premium
                    </button>
                  )}
                </div>
              </div>

              {/* Package Details */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{currentPackage.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{currentPackage.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Delivery Time</span>
                    </div>
                    <span className="text-sm font-medium">{currentPackage.deliveryTime} days</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Revisions</span>
                    </div>
                    <span className="text-sm font-medium">{currentPackage.revisions}</span>
                  </div>
                </div>

                {/* Features */}
                {currentPackage.features && currentPackage.features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {currentPackage.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    ${currentPackage.price}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {user && user.id !== gig.freelancer.id ? (
                    <>
                      <button
                        onClick={handlePurchase}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Continue (${currentPackage.price})
                      </button>
                      <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                        <MessageCircle className="w-4 h-4" />
                        <span>Contact Seller</span>
                      </button>
                    </>
                  ) : user && user.id === gig.freelancer.id ? (
                    <div className="text-center text-gray-600 py-3">
                      This is your gig
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
                    >
                      Sign in to Purchase
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};