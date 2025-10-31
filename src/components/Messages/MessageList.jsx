import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Search, User, Clock } from 'lucide-react';
import { Conversation } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../hooks/useSocket';

export const MessageList = () => {
  const { user, token } = useAuth();
  const { onNewMessage, onNewNotification, offNewMessage, offNewNotification } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchConversations();

    // Listen for new messages
    onNewMessage((data) => {
      fetchConversations(); // Refresh conversations when new message arrives
    });

    return () => {
      offNewMessage();
      offNewNotification();
    };
  }, [token]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_URI}/api/messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const data = await response.json();
      setConversations(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    if (!searchTerm) return true;
    
    const otherParticipant = conv.participants.find(p => p.id !== user?.id);
    return otherParticipant?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           otherParticipant?.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatLastActivity = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with clients and freelancers</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Conversations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {filteredConversations.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredConversations.map((conversation) => {
                const otherParticipant = conversation.participants.find(p => p.id !== user?.id);
                
                return (
                  <Link
                    key={conversation._id}
                    to={`/messages/${conversation._id}`}
                    className="block p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {otherParticipant?.avatar ? (
                        <img
                          src={otherParticipant.avatar}
                          alt={otherParticipant.fullName}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {otherParticipant?.fullName || 'Unknown User'}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {conversation.unreadCount && conversation.unreadCount > 0 && (
                              <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                                {conversation.unreadCount}
                              </span>
                            )}
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatLastActivity(conversation.lastActivity)}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">@{otherParticipant?.username}</p>
                        
                        {conversation.gig && (
                          <p className="text-sm text-blue-600 mb-2">
                            Re: {conversation.gig.title}
                          </p>
                        )}
                        
                        {conversation.lastMessage && (
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage.content}
                          </p>
                        )}
                        
                        {otherParticipant?.isOnline && (
                          <div className="flex items-center mt-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-xs text-green-600">Online</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <MessageCircle className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No conversations yet</h3>
              <p className="text-gray-500">
                Start a conversation by messaging a freelancer or client
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};