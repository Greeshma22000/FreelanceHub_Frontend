import React from 'react';
import { Star, User, ThumbsUp, Flag } from 'lucide-react';

export const ReviewCard = ({ 
  review, 
  showGig = false,
  onReport 
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const reviewer = review.reviewer;
  const gig = typeof review.gig === 'object' ? review.gig : null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start space-x-4">
        {reviewer.avatar ? (
          <img
            src={reviewer.avatar}
            alt={reviewer.fullName}
            className="w-12 h-12 rounded-full"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-600" />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">{reviewer.fullName}</h4>
              <p className="text-sm text-gray-600">@{reviewer.username}</p>
              {reviewer.country && (
                <p className="text-xs text-gray-500">{reviewer.country}</p>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-1">
                {renderStars(review.rating)}
                <span className="text-sm font-medium text-gray-900 ml-1">
                  {review.rating}
                </span>
              </div>
              <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
            </div>
          </div>

          {showGig && gig && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                {gig.title}
              </p>
            </div>
          )}

          <p className="text-gray-700 mb-4">{review.comment}</p>

          {review.categories && (
            <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  {renderStars(review.categories.communication)}
                </div>
                <p className="text-xs text-gray-600">Communication</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  {renderStars(review.categories.serviceAsDescribed)}
                </div>
                <p className="text-xs text-gray-600">Service as described</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  {renderStars(review.categories.buyAgain)}
                </div>
                <p className="text-xs text-gray-600">Would buy again</p>
              </div>
            </div>
          )}

          {review.response && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span className="text-sm font-medium text-blue-900">Seller Response</span>
                <span className="text-xs text-blue-600">
                  {formatDate(review.response.respondedAt)}
                </span>
              </div>
              <p className="text-blue-800">{review.response.content}</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 text-sm">
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful</span>
              </button>
            </div>
            
            {onReport && (
              <button
                onClick={() => onReport(review._id)}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 text-sm"
              >
                <Flag className="w-4 h-4" />
                <span>Report</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};