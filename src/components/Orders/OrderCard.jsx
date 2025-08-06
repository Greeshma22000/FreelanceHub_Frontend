import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, User, Package, Calendar, MessageCircle } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  requirements_pending: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  revision_requested: 'bg-orange-100 text-orange-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
  disputed: 'bg-gray-100 text-gray-800'
};

const statusLabels = {
  pending: 'Pending',
  requirements_pending: 'Requirements Pending',
  in_progress: 'In Progress',
  delivered: 'Delivered',
  revision_requested: 'Revision Requested',
  completed: 'Completed',
  cancelled: 'Cancelled',
  disputed: 'Disputed'
};

export const OrderCard = ({ order, userRole }) => {
  const otherUser = userRole === 'buyer' 
    ? (typeof order.seller === 'object' ? order.seller : null)
    : (typeof order.buyer === 'object' ? order.buyer : null);

  const gig = typeof order.gig === 'object' ? order.gig : null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = () => {
    if (!order.deliveryDate) return null;
    const deliveryDate = new Date(order.deliveryDate);
    const today = new Date();
    const diffTime = deliveryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {otherUser?.avatar ? (
            <img
              src={otherUser.avatar}
              alt={otherUser.fullName}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">
              {userRole === 'buyer' ? 'Seller' : 'Buyer'}: {otherUser?.fullName || 'Unknown'}
            </h3>
            <p className="text-sm text-gray-600">@{otherUser?.username || 'unknown'}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
          {statusLabels[order.status]}
        </span>
      </div>

      <div className="mb-4">
        <Link 
          to={gig ? `/gig/${gig._id}` : '#'}
          className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
        >
          {gig?.title || order.packageDetails.title}
        </Link>
        <p className="text-sm text-gray-600 mt-1">
          {order.packageDetails.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Package className="w-4 h-4" />
          <span className="capitalize">{order.package} Package</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>${order.totalAmount}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Ordered {formatDate(order.createdAt)}</span>
        </div>
        {daysRemaining !== null && order.status === 'in_progress' && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>
              {daysRemaining > 0 
                ? `${daysRemaining} days left`
                : daysRemaining === 0 
                  ? 'Due today'
                  : `${Math.abs(daysRemaining)} days overdue`
              }
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Link
          to={`/orders/${order._id}`}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          View Details
        </Link>
        <div className="flex items-center space-x-2">
          <Link
            to={`/messages?order=${order._id}`}
            className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message</span>
          </Link>
        </div>
      </div>
    </div>
  );
};