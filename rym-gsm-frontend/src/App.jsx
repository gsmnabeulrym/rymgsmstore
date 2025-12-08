import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ComparisonProvider } from './contexts/ComparisonContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Chatbot from './components/Chatbot';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Wishlist from './pages/Wishlist';
import Notifications from './pages/Notifications';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminReviews from './pages/AdminReviews';
import AdminNotifications from './pages/AdminNotifications';
import AdminAnalytics from './pages/AdminAnalytics';
import ComparisonPage from './pages/ComparisonPage';

// Comparison Components
import ComparisonBar from './components/comparison/ComparisonBar';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <NotificationProvider>
              <ComparisonProvider>
              <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetails />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/reviews" element={<AdminReviews />} />
                  <Route path="/admin/notifications" element={<AdminNotifications />} />
                  <Route path="/admin/analytics" element={<AdminAnalytics />} />
                  <Route path="/compare" element={<ComparisonPage />} />
                </Routes>
              </main>
              <Footer />
              <ComparisonBar />
              <WhatsAppButton />
              <Chatbot />
              <Toaster position="top-right" />
            </div>
          </Router>
              </ComparisonProvider>
            </NotificationProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
