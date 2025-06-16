# RestaurantOS - Tablet & Phone Ordering System

A modern, full-stack MVP for restaurant tablet and phone-based ordering built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Guest Interface (Tablet/Phone Optimized)
- **QR Code Table Selection**: Customers scan table QR codes or manually select tables
- **Interactive Menu Browser**: Category-based menu with search, detailed item views
- **Smart Cart Management**: Add items with special instructions, quantity management
- **Real-time Order Tracking**: Live status updates from order placement to delivery

### Multi-Role Dashboards
- **Waiter Dashboard**: Table status monitoring, order assistance, service management
- **Kitchen Display**: Order queue management, preparation tracking, status updates
- **Admin Panel**: Menu management, table configuration, analytics dashboard

### Core Functionality
- **Order Management**: Complete order lifecycle from placement to payment
- **Table Management**: Dynamic table status tracking and QR code generation
- **Menu Management**: Full CRUD operations for menu items with categories
- **Real-time Updates**: WebSocket-ready architecture for live synchronization

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI elements (Button, Card, Badge)
│   ├── layout/         # Layout components
│   └── guest/          # Guest-specific components
├── pages/              # Page components by role
│   ├── guest/          # Customer-facing pages
│   ├── waiter/         # Waiter interface
│   ├── kitchen/        # Kitchen display system
│   └── admin/          # Administrative dashboard
├── services/           # API service layer
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Service Layer
- **MenuService**: Menu item management and retrieval
- **OrderService**: Order processing and status management
- **TableService**: Table management and QR code generation
- **QRCodeService**: QR code generation and scanning utilities

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **State Management**: React Hooks + Context API ready
- **Styling**: Tailwind CSS with custom design system

## 🎨 Design System

### Color Palette
- **Primary**: Orange (#F97316) - Call-to-action buttons, highlights
- **Secondary**: Teal (#0F766E) - Secondary actions, info states
- **Success**: Green (#16A34A) - Success states, completed orders
- **Warning**: Yellow (#EAB308) - Warnings, pending states
- **Danger**: Red (#DC2626) - Error states, urgent items
- **Neutral**: Gray scale for backgrounds and text

### Component Library
- **Button**: Multiple variants (primary, secondary, success, warning, danger, ghost)
- **Card**: Consistent container with hover states and padding options
- **Badge**: Status indicators with color-coded variants
- **Layout**: Responsive layout with role-based navigation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd restaurant-ordering-system

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
Create a `.env` file for environment variables:
```env
# Future backend integration
VITE_API_URL=http://localhost:3001
VITE_WEBSOCKET_URL=ws://localhost:3001
```

## 📱 Usage

### For Guests
1. **Table Selection**: Scan QR code or select table manually
2. **Menu Browsing**: Browse by category, view item details, add to cart
3. **Order Placement**: Review cart, add special instructions, place order
4. **Status Tracking**: Monitor order progress in real-time

### For Staff
- **Waiters**: Monitor table status, assist with orders, manage service requests
- **Kitchen**: View order queue, update preparation status, manage priorities
- **Admins**: Configure tables, update menu, view analytics and reports

## 🔮 Future Development Areas

### Backend Integration
- **API Development**: REST API with Node.js/Express or Python/FastAPI
- **Database**: PostgreSQL or MongoDB for data persistence
- **Authentication**: JWT-based auth for staff roles
- **Payment Processing**: Stripe or Square integration

### Real-time Features
- **WebSocket Integration**: Socket.io or native WebSockets for live updates
- **Push Notifications**: Order status notifications for staff and customers
- **Live Analytics**: Real-time dashboard updates and metrics

### Advanced Features
- **AI Integration**: Smart waiter agent using Hugging Face transformers
- **PWA Support**: Offline-first capabilities with service workers
- **Multi-language**: i18n support for international restaurants
- **Inventory Management**: Stock tracking and low-inventory alerts

### Mobile Optimization
- **Native Apps**: React Native conversion for iOS/Android
- **Camera Integration**: Built-in QR code scanning
- **Touch Gestures**: Swipe actions and touch-optimized interactions

## 🔒 Security Considerations

- **Input Validation**: All user inputs sanitized and validated
- **Role-based Access**: Proper authentication and authorization
- **Data Protection**: Secure handling of customer and payment data
- **API Security**: Rate limiting, CORS, and request validation

## 📊 Analytics & Monitoring

- **Order Analytics**: Revenue tracking, popular items, peak hours
- **Performance Metrics**: Order completion times, customer satisfaction
- **System Monitoring**: Error tracking, performance monitoring
- **Business Intelligence**: Sales reports, trend analysis

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For support and questions:
- Create an issue in the repository
- Check the documentation in `/docs`
- Review the code comments for implementation details

---

Built with ❤️ for the restaurant industry. Ready for production deployment and further customization.