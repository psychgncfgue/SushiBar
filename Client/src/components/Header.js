import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LogoSushi from '../images/logoSushi.jpg';
import Point from '../images/location_53876-25530.avif';
import Phone from '../images/360_F_105690295_weFR0LI9W0d4gCyjQAReMUrAe1z07tgt.jpg';
import Bucket from '../images/shopping-backet-icon-buy-sign-sale-web-site-shop-retail-market-commerce-store-symbol_87543-11803.avif';
import rolls from '../images/uramaki.png';
import wok from '../images/006-noodles-1.png';
import beverages from '../images/005-drink-1.png';
import MenuIcon from '../images/Hamburger_icon.svg.png';
import close from '../images/png-transparent-computer-icons-christian-cross-pin-up-miscellaneous-angle-logo-thumbnail.png'
import '../App.css';

function Header({ cart, setCartCoordinates }) {
  const cartRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    const updateCartCoordinates = () => {
      if (cartRef.current) {
        const rect = cartRef.current.getBoundingClientRect();
        const newCoordinates = {
          x: rect.left + window.scrollX + rect.width / 2,
          y: rect.top + window.scrollY + rect.height / 2,
        };
        setCartCoordinates(newCoordinates);
      }
    };

    updateCartCoordinates();
    window.addEventListener('resize', updateCartCoordinates);
    window.addEventListener('scroll', updateCartCoordinates);

    return () => {
      window.removeEventListener('resize', updateCartCoordinates);
      window.removeEventListener('scroll', updateCartCoordinates);
    };
  }, [setCartCoordinates]);

  const handleMouseEnter = () => {
    if (timerId) {
      clearTimeout(timerId);
      setTimerId(null);
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    const newTimerId = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 400);
    setTimerId(newTimerId);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
    <div className="fixed top-0 left-0 w-full bg-white z-50 header flex flex-row justify-between shadow-lg h-16 md:h-20 lg:h-24 rounded-b-xl">
      <button
        className="block md:hidden pl-6"
        onClick={toggleMenu}
      >
        <img className="h-6 w-auto" src={MenuIcon} alt="Menu" />
      </button>
      <Link to="/" className="flex">
        <button>
          <img className="h-full w-auto rounded-xl" src={LogoSushi} alt="Logo" />
        </button>
      </Link>
      <nav className='hidden md:flex flex-row items-center'>
        <div
          className='flex justify-center h-1/2 mr-3 ml-3 relative'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className='flex flex-row justify-center items-center h-full relative group'>
            <img className='h-1/2 w-auto' src={rolls} alt='Роллы' />
            <p className='ml-2 relative'>
              Роллы
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </p>
          </button>
          {isDropdownOpen && (
            <div
              className="absolute flex flex-row top-full left-0 bg-white shadow-lg rounded-lg p-2 group mt-5 font-bold"
            >
              <span className="absolute left-0 top-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              <Link to="/products?category=Rolls" className="relative flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 underline-animation">
                Классические роллы
              </Link>
              <Link to="/products?category=HotRolls" className="relative flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 underline-animation">
                Горячие роллы
              </Link>
            </div>
          )}
        </div>
        <Link to="/products?category=Wok" className='flex justify-center h-1/2 pr-3 pl-3 border-l-2 border-r-2 border-gray-300'>
          <button className='flex flex-row justify-center items-center h-full relative group'>
            <img className='h-1/2 w-auto' src={wok} alt='Вок' />
            <p className='ml-2 relative'>
              Вок
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </p>
          </button>
        </Link>
        <Link to="/products?category=Beverages" className='flex justify-center h-1/2 mr-3 ml-3'>
          <button className='flex flex-row justify-center items-center h-full relative group'>
            <img className='h-1/2 w-auto' src={beverages} alt='Напитки' />
            <p className='ml-2 relative'>
              Напитки
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
            </p>
          </button>
        </Link>
      </nav>
      <div
        className={`flex flex-col fixed top-0 left-0 w-64 bg-white shadow-lg transition-transform transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} h-full z-40 md:hidden`}
      >
        <button
          className="flex h-12 pt-4 justify-center items-center text-right"
          onClick={toggleMenu}
        ><img className='h-full w-auto' src={close} alt='Закрыть' />
        </button>
        <nav className="flex justify-start flex-col p-4">
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex py-2 border-b-2 border-blue-500">Роллы</button>
          {isDropdownOpen && (
            <div className="flex flex-col bg-white mt-2 w-full pl-2 pr-2">
              <Link
                onClick={toggleMenu}
                to="/products?category=Rolls" className="flex py-2 text-sm text-gray-700 border-b-2 border-gray-500">
                Классические роллы
              </Link>
              <Link
                onClick={toggleMenu}
                to="/products?category=HotRolls" className="flex py-2 text-sm text-gray-700 border-b-2 border-gray-500">
                Горячие роллы
              </Link>
            </div>
          )}
          <Link onClick={toggleMenu} to="/products?category=Wok" className="flex py-2 border-b-2 border-blue-500">Вок</Link>
          <Link onClick={toggleMenu} to="/products?category=Beverages" className="flex py-2 border-b-2 border-blue-500">Напитки</Link>
        </nav>
      </div>

      <div className="hidden md:flex flex-col lg:flex-row sm:justify-center justify-center items-center lg:ml-auto p-2">
        <img className="h-1/3 w-auto" src={Point} alt="Location" />
        <p className="text-xs sm:text-base">Текущий адрес</p>
      </div>
      <div className="hidden md:flex flex-col lg:flex-row sm:justify-center justify-center items-center lg:ml-5 lg:mr-5 p-2">
        <img className="h-1/4 w-auto" src={Phone} alt="Phone" />
        <p className="text-xs pl-0 lg:pl-2 sm:text-base">+3805050500</p>
      </div>
      <button className='flex md:hidden w-16 justify-center items-center'>
        <img className="h-1/2 w-auto" src={Phone} alt="Phone" />
      </button>
      <Link to="/Bucket" className="flex p-2 md:p-4">
        <button
          ref={cartRef}
          className={'cart-icon h-full w-auto shadow-lg rounded-lg border-2 hover:border-blue-100'}
        >
          <img className="h-full w-auto rounded-lg" src={Bucket} alt="Bucket" />
          {cart.length > 0 && (
            <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </div>
          )}
        </button>
      </Link>
    </div>
    </>
  );
}

export default Header;
