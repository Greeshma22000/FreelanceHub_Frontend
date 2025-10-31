import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export const useSocket = () => {
  const socketRef = useRef(null);
  const { token, user } = useAuth();

  useEffect(() => {
    if (token && user) {
      // Initialize socket connection
      socketRef.current = io(import.meta.env.VITE_SERVER_URI || {/*'http://localhost:5000'*/}, {
        auth: {
          token
        }
      });

      const socket = socketRef.current;

      socket.on('connect', () => {
        console.log('Connected to server');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [token, user]);

  const joinConversation = (conversationId) => {
    socketRef.current?.emit('join_conversation', conversationId);
  };

  const leaveConversation = (conversationId) => {
    socketRef.current?.emit('leave_conversation', conversationId);
  };

  const joinOrderRoom = (orderId) => {
    socketRef.current?.emit('join_order_room', orderId);
  };

  const leaveOrderRoom = (orderId) => {
    socketRef.current?.emit('leave_order_room', orderId);
  };

  const startTyping = (conversationId, receiverId) => {
    socketRef.current?.emit('typing_start', { conversationId, receiverId });
  };

  const stopTyping = (conversationId, receiverId) => {
    socketRef.current?.emit('typing_stop', { conversationId, receiverId });
  };

  const markNotificationRead = (notificationId) => {
    socketRef.current?.emit('mark_notification_read', notificationId);
  };

  const onNewMessage = (callback) => {
    socketRef.current?.on('new_message', callback);
  };

  const onMessageRead = (callback) => {
    socketRef.current?.on('message_read', callback);
  };

  const onUserTyping = (callback) => {
    socketRef.current?.on('user_typing', callback);
  };

  const onUserStoppedTyping = (callback) => {
    socketRef.current?.on('user_stopped_typing', callback);
  };

  const onNewNotification = (callback) => {
    socketRef.current?.on('new_notification', callback);
  };

  const offNewMessage = () => {
    socketRef.current?.off('new_message');
  };

  const offMessageRead = () => {
    socketRef.current?.off('message_read');
  };

  const offUserTyping = () => {
    socketRef.current?.off('user_typing');
  };

  const offUserStoppedTyping = () => {
    socketRef.current?.off('user_stopped_typing');
  };

  const offNewNotification = () => {
    socketRef.current?.off('new_notification');
  };

  return {
    socket: socketRef.current,
    joinConversation,
    leaveConversation,
    joinOrderRoom,
    leaveOrderRoom,
    startTyping,
    stopTyping,
    markNotificationRead,
    onNewMessage,
    onMessageRead,
    onUserTyping,
    onUserStoppedTyping,
    onNewNotification,
    offNewMessage,
    offMessageRead,
    offUserTyping,
    offUserStoppedTyping,
    offNewNotification
  };
};