export const User = {
  id: String,
  username: String,
  email: String,
  role: ['client', 'freelancer'],
  fullName: String,
  avatar: String,
  description: { type: String, required: false },
  skills: { type: [String], required: false },
  languages: {
    type: [{
      language: String,
      level: ['basic', 'conversational', 'fluent', 'native']
    }],
    required: false
  },
  education: {
    type: [{
      school: String,
      degree: String,
      year: Number
    }],
    required: false
  },
  certifications: {
    type: [{
      name: String,
      from: String,
      year: Number
    }],
    required: false
  },
  rating: Number,
  totalReviews: Number,
  totalEarnings: { type: Number, required: false },
  completedOrders: { type: Number, required: false },
  isOnline: { type: Boolean, required: false },
  lastSeen: { type: String, required: false },
  country: { type: String, required: false },
  memberSince: { type: String, required: false },
  isVerified: { type: Boolean, required: false }
};

export const Gig = {
  _id: String,
  title: String,
  description: String,
  category: String,
  subcategory: String,
  searchTags: [String],
  pricing: {
    basic: {
      title: String,
      description: String,
      price: Number,
      deliveryTime: Number,
      revisions: Number,
      features: { type: [String], required: false }
    },
    standard: {
      type: {
        title: String,
        description: String,
        price: Number,
        deliveryTime: Number,
        revisions: Number,
        features: { type: [String], required: false }
      },
      required: false
    },
    premium: {
      type: {
        title: String,
        description: String,
        price: Number,
        deliveryTime: Number,
        revisions: Number,
        features: { type: [String], required: false }
      },
      required: false
    }
  },
  images: [{
    url: String,
    publicId: { type: String, required: false }
  }],
  video: {
    type: {
      url: String,
      publicId: { type: String, required: false }
    },
    required: false
  },
  freelancer: User,
  rating: Number,
  totalReviews: Number,
  isActive: Boolean,
  isPaused: { type: Boolean, required: false },
  totalOrders: Number,
  impressions: { type: Number, required: false },
  clicks: { type: Number, required: false },
  favorites: { type: [String], required: false },
  faqs: {
    type: [{
      question: String,
      answer: String
    }],
    required: false
  },
  requirements: {
    type: [{
      question: String,
      type: ['text', 'multiple-choice', 'file'],
      required: Boolean,
      options: { type: [String], required: false }
    }],
    required: false
  },
  createdAt: String,
  updatedAt: String
};

export const Order = {
  _id: String,
  buyer: [User, String],
  seller: [User, String],
  gig: [Gig, String],
  package: ['basic', 'standard', 'premium'],
  packageDetails: {
    title: String,
    description: String,
    price: Number,
    deliveryTime: Number,
    revisions: Number,
    features: [String]
  },
  customRequirements: {
    type: [{
      question: String,
      answer: String,
      type: String
    }],
    required: false
  },
  totalAmount: Number,
  serviceFee: Number,
  netAmount: Number,
  status: ['pending', 'requirements_pending', 'in_progress', 'delivered', 'revision_requested', 'completed', 'cancelled', 'disputed'],
  paymentStatus: ['pending', 'paid', 'refunded', 'failed'],
  paymentIntentId: String,
  stripeSessionId: { type: String, required: false },
  deliveryTime: Number,
  deliveryDate: { type: String, required: false },
  completedAt: { type: String, required: false },
  deliveries: {
    type: [{
      message: String,
      files: [{
        name: String,
        url: String,
        size: Number,
        type: String
      }],
      deliveredAt: String
    }],
    required: false
  },
  revisions: {
    type: [{
      message: String,
      requestedAt: String,
      response: { type: String, required: false },
      respondedAt: { type: String, required: false }
    }],
    required: false
  },
  cancellation: {
    type: {
      reason: String,
      requestedBy: String,
      requestedAt: String,
      approved: Boolean,
      approvedAt: { type: String, required: false }
    },
    required: false
  },
  dispute: {
    type: {
      reason: String,
      description: String,
      raisedBy: String,
      raisedAt: String,
      status: ['open', 'resolved', 'closed'],
      resolution: { type: String, required: false },
      resolvedAt: { type: String, required: false }
    },
    required: false
  },
  isReviewed: {
    buyer: Boolean,
    seller: Boolean
  },
  autoCompleteAt: { type: String, required: false },
  createdAt: String,
  updatedAt: String
};

export const AuthContextType = {
  user: [User, null],
  token: [String, null],
  login: Function,
  register: Function,
  logout: Function,
  loading: Boolean
};

export const RegisterData = {
  username: String,
  email: String,
  password: String,
  role: ['client', 'freelancer'],
  fullName: String
};

export const Message = {
  _id: String,
  conversation: String,
  sender: User,
  receiver: User,
  content: String,
  messageType: ['text', 'file', 'image', 'order_update', 'custom_offer'],
  attachments: {
    type: [{
      name: String,
      url: String,
      size: Number,
      type: String
    }],
    required: false
  },
  customOffer: {
    type: {
      title: String,
      description: String,
      price: Number,
      deliveryTime: Number,
      revisions: Number,
      expiresAt: String,
      status: ['pending', 'accepted', 'declined', 'expired']
    },
    required: false
  },
  isRead: Boolean,
  readAt: { type: String, required: false },
  isEdited: Boolean,
  editedAt: { type: String, required: false },
  isDeleted: Boolean,
  deletedAt: { type: String, required: false },
  createdAt: String,
  updatedAt: String
};

export const Conversation = {
  _id: String,
  participants: [User],
  order: { type: Order, required: false },
  gig: { type: Gig, required: false },
  lastMessage: { type: Message, required: false },
  lastActivity: String,
  unreadCount: { type: Number, required: false },
  isArchived: { type: Boolean, required: false },
  isBlocked: { type: Boolean, required: false },
  createdAt: String,
  updatedAt: String
};

export const Review = {
  _id: String,
  order: [Order, String],
  gig: [Gig, String],
  reviewer: User,
  reviewee: User,
  rating: Number,
  comment: String,
  categories: {
    type: {
      communication: Number,
      serviceAsDescribed: Number,
      buyAgain: Number
    },
    required: false
  },
  isPublic: Boolean,
  isReported: Boolean,
  reportReason: { type: String, required: false },
  response: {
    type: {
      content: String,
      respondedAt: String
    },
    required: false
  },
  createdAt: String,
  updatedAt: String
};

export const Notification = {
  _id: String,
  recipient: String,
  sender: { type: User, required: false },
  type: ['new_order', 'order_delivered', 'order_completed', 'order_cancelled', 'revision_requested', 'new_message', 'review_received', 'payment_received', 'gig_approved', 'gig_rejected', 'custom_offer', 'system'],
  title: String,
  message: String,
  data: {
    type: {
      orderId: { type: String, required: false },
      gigId: { type: String, required: false },
      messageId: { type: String, required: false },
      reviewId: { type: String, required: false },
      amount: { type: Number, required: false },
      url: { type: String, required: false }
    },
    required: false
  },
  isRead: Boolean,
  readAt: { type: String, required: false },
  createdAt: String,
  updatedAt: String
};