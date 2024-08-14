import React, { useState, useEffect, useCallback } from 'react';
import './index.css';
import Product from './components/Product';
import Header from './components/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Bucket from './components/Bucket';
import Cookies from 'js-cookie';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import ResetPassword from './components/ResetPassword';

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = Cookies.get('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
  }, [cart]);

  const [buttonCoordinates, setButtonCoordinates] = useState({ x: 0, y: 0 });
  const [cartCoordinates, setCartCoordinates] = useState({ x: 0, y: 0 });

  const updateButtonCoordinates = useCallback((ref) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setButtonCoordinates({
        x: rect.left + window.scrollX + rect.width / 2,
        y: rect.top + window.scrollY + rect.height / 2,
      });
    }
  }, []);

  const updateCartCoordinates = useCallback((ref) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCartCoordinates({
        x: rect.left + window.scrollX + rect.width / 2,
        y: rect.top + window.scrollY + rect.height / 2,
      });
    }
  }, []);

  useEffect(() => {
    const cartRef = document.querySelector('.cart-icon');
    if (cartRef) {
      updateCartCoordinates({ current: cartRef });

      const handleResize = () => updateCartCoordinates({ current: cartRef });
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [updateCartCoordinates]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === productId);
      if (existingProduct.quantity === 1) {
        return prevCart.filter((item) => item.id !== productId);
      } else {
        return prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
    });
  };

  const increaseQuantity = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  return (
    <Router>
      <div className="flex flex-col text-center min-h-screen">
        <Header
          cart={cart}
          cartCoordinates={cartCoordinates}
          setCartCoordinates={setCartCoordinates}
        />
        <Routes>
          <Route
            path="/products"
            element={
              <Product
                addToCart={addToCart}
                buttonCoordinates={buttonCoordinates}
                cartCoordinates={cartCoordinates}
                updateButtonCoordinates={updateButtonCoordinates}
              />
            }
          />
          <Route path="/" element={<HomePage />} />
          <Route
            path="/Bucket"
            element={
              <Bucket
                cart={cart}
                setCart={setCart}
                removeFromCart={removeFromCart}
                increaseQuantity={increaseQuantity}
              />
            }
          />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route
            path="/admindashboard"
            element={<PrivateRoute element={AdminDashboard} />}
          />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;