import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const ReviewForm = ({
  orderId,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    categories: {
      communication: 0,
      serviceAsDescribed: 0,
      buyAgain: 0
    }
  });

  const [hoveredRating, setHoveredRating] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [hoveredCategoryRating, setHoveredCategoryRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (formData.comment.trim().length < 10) {
      alert('Please write at least 10 characters in your review');
      return;
    }

    await onSubmit({
      orderId,
      ...formData
    });
  };

  const renderStars = (
    rating,
    onRate,
    hovered = 0,
    onHover,
    onLeave
  ) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onRate(i + 1)}
        onMouseEnter={() => onHover?.(i + 1)}
        onMouseLeave={() => onLeave?.()}
        className="focus:outline-none"
      >
        <Star
          className={`w-6 h-6 transition-colors ${
            i < (hovered || rating)
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300 hover:text-yellow-200'
          }`}
        />
      </button>
    ));
  };

  const renderCategoryStars = (category) => {
    const rating = formData.categories[category];
    const hovered = hoveredCategory === category ? hoveredCategoryRating : 0;

    return renderStars(
      rating,
      (newRating) => setFormData(prev => ({
        ...prev,
        categories: {
          ...prev.categories,
          [category]: newRating
        }
      })),
      hovered,
      (newRating) => {
        setHoveredCategory(category);
        setHoveredCategoryRating(newRating);
      },
      () => {
        setHoveredCategory(null);
        setHoveredCategoryRating(0);
      }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Leave a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Overall Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating *
          </label>
          <div className="flex items-center space-x-1">
            {renderStars(
              formData.rating,
              (rating) => setFormData(prev => ({ ...prev, rating })),
              hoveredRating,
              setHoveredRating,
              () => setHoveredRating(0)
            )}
            <span className="ml-2 text-sm text-gray-600">
              {hoveredRating || formData.rating || 0} out of 5
            </span>
          </div>
        </div>

        {/* Category Ratings */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Rate specific aspects:</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Communication
              </label>
              <div className="flex items-center space-x-1">
                {renderCategoryStars('communication')}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service as described
              </label>
              <div className="flex items-center space-x-1">
                {renderCategoryStars('serviceAsDescribed')}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Would buy again
              </label>
              <div className="flex items-center space-x-1">
                {renderCategoryStars('buyAgain')}
              </div>
            </div>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share your experience with this service..."
            required
            minLength={10}
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum 10 characters ({formData.comment.length}/10)
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || formData.rating === 0 || formData.comment.trim().length < 10}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};