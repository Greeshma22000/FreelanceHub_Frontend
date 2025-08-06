import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, User } from 'lucide-react';

export const GigCard = ({ gig }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group">
      <Link to={`/gig/${gig._id}`}>
        <div className="relative overflow-hidden">
          <img
            src={gig.images[0]?.url || 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={gig.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-3">
          {gig.freelancer.avatar ? (
            <img
              src={gig.freelancer.avatar}
              alt={gig.freelancer.fullName}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          )}
          <span className="text-sm font-medium text-gray-900">{gig.freelancer.username}</span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">
              {gig.freelancer.rating.toFixed(1)} ({gig.freelancer.totalReviews})
            </span>
          </div>
        </div>
        
        <Link to={`/gig/${gig._id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {gig.title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 capitalize">
            {gig.category.replace('-', ' ')}
          </span>
          <div className="text-right">
            <div className="text-sm text-gray-500">Starting at</div>
            <div className="font-bold text-lg text-gray-900">${gig.pricing.basic.price}</div>
          </div>
        </div>
      </div>
    </div>
  );
};