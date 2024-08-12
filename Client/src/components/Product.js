import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { categoryTranslations } from '../translations';

function Product({ addToCart, cartCoordinates }) {
  const [flyingProduct, setFlyingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const buttonRefs = useRef([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const categoryFilter = query.get('category') || '';

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products', {
          params: { 
            category: categoryFilter, 
            page: currentPage,
            limit: 9 
          }
        });
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [categoryFilter, currentPage]);

  const handleAddToCart = async (product, index) => {
    if (isLoading) return;

    setIsLoading(true);

    const productButton = buttonRefs.current[index];
    if (productButton) {
      const rect = productButton.getBoundingClientRect();
      const startX = rect.left + window.scrollX + rect.width / 2;
      const startY = rect.top + window.scrollY + rect.height / 2;
      const endX = cartCoordinates.x;
      const endY = cartCoordinates.y;

      setFlyingProduct({
        product,
        startX,
        startY,
        endX,
        endY,
      });

      addToCart(product);

      setTimeout(() => {
        setFlyingProduct(null);
        setIsLoading(false);
      }, 1500);
    }
  };

  const flyingProps = useSpring({
    from: { transform: 'translate(0px, 0px) scale(1)' },
    to: {
      transform: flyingProduct
        ? `translate(${flyingProduct.endX - flyingProduct.startX}px, ${flyingProduct.endY - flyingProduct.startY}px) scale(0)`
        : 'translate(0px, 0px) scale(1)',
    },
    config: { duration: 800 },
    onRest: () => {
      if (!flyingProduct) {
        setIsLoading(false);
      }
    },
  });

  const translatedCategory = categoryTranslations[categoryFilter] || categoryFilter;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center mt-36">
        <div className="flex justify-center text-4xl font-bold mt-4 mb-4">
          <p>{translatedCategory}</p>
        </div>
        <ul className="flex flex-wrap justify-center space-x-10 space-y-10 mb-10 w-full pr-10">
          {products.map((product, index) => (
            <li key={product.id} className="flex flex-col items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 shadow-lg rounded-xl bg-gray-100 ml-10 mt-10">
              <img ref={(el) => (buttonRefs.current[index] = el)} src={`/images/${product.srcImg}`} alt={product.name} className='h-full w-auto pt-3 pl-3 pr-3' />
              <p>Вес: {product.weight} г</p>
              <p className="font-bold mt-2 mb-2">{product.name}</p>
              <p className="font-bold mt-2 mb-2">{product.price} грн</p>
              <button
                onClick={() => handleAddToCart(product, index)}
                className={`w-1/2 flex mt-2 mb-4 mr-6 ml-6 pt-3 pb-3 justify-center items-center rounded-xl shadow-lg font-bold border-2 border-transparent ${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-300 hover:border-gray-300'}`}
                disabled={isLoading}
              >
                {isLoading ? <ClipLoader size={24} color="#ffffff" /> : 'В корзину'}
              </button>
            </li>
          ))}
        </ul>
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 mb-12">
            {currentPage > 1 && (
              <button
                onClick={handlePreviousPage}
                className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-full mr-2"
              >
                <span className="text-xl">&larr;</span>
              </button>
            )}
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-12 h-12 flex items-center justify-center border border-gray-300 rounded-full ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            {currentPage < totalPages && (
              <button
                onClick={handleNextPage}
                className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-full ml-2"
              >
                <span className="text-xl">&rarr;</span>
              </button>
            )}
          </div>
        )}
        {flyingProduct && (
          <animated.div
            style={{
              ...flyingProps,
              position: 'absolute',
              top: flyingProduct.startY - 90,
              left: flyingProduct.startX - 90,
              pointerEvents: 'none',
              zIndex: 100
            }}
          >
            <img src={`/images/${flyingProduct.product.srcImg}`} alt={flyingProduct.product.name} className="w-48 h-48 rounded-full" />
          </animated.div>
        )}
      </div>
    </>
  );
}

export default Product;