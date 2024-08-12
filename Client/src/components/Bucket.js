import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import InputMask from 'react-input-mask';
import SushiBG from '../images/1625260162_1-kartinkin-com-p-fon-dlya-menyu-sushi-krasivie-foni-1.jpg';

function Bucket({ cart, setCart, removeFromCart, increaseQuantity }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const isEmpty = cart.length === 0;
  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
  }, [cart]);

  const handleOrder = () => {
    setShowModal(true);
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Za-zА-Яа-яЁё\s]+$/;
    return nameRegex.test(name);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+380\(\d{2}\)\d{7}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;

    if (!validateName(name)) {
      setNameError('Имя может содержать только буквы');
      valid = false;
    } else {
      setNameError('');
    }

    if (!validatePhone(phone)) {
      setPhoneError('Телефон должен быть в формате +380(xx)xxxxxxx');
      valid = false;
    } else {
      setPhoneError('');
    }

    if (!valid) return;

    const orderData = {
      name,
      phone,
      products: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
      })),
    };
    console.log('Отправляемые данные:', orderData);

    try {
      await axios.post('http://localhost:5000/api/users', orderData);

      Cookies.remove('cart');
      clearCart();

      setShowModal(false);
      setName('');
      setPhone('');
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      alert('Ошибка при оформлении заказа. Пожалуйста, попробуйте позже.');
    }
  };

  return (
    <div className="flex flex-col justify-center mt-36">
      {isEmpty ? (
        <div className="fixed top-0 h-screen w-full overflow-hidden">
          <img
            src={SushiBG}
            alt="Background GIF"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div className="flex justify-center items-center h-full w-full text-bold text-6xl pt-6 relative z-10 text-white">
            <p>Корзина Пуста</p>
          </div>
        </div>
      ) : (
        <>
          <div className="text-4xl font-bold mt-4 mb-4">
            <p>Корзина</p>
          </div>
          <ul className='flex flex-wrap justify-center space-x-10 space-y-10 mr-10 mb-10'>
            {cart.map(item => (
              <li key={item.id} className="flex flex-col items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 shadow-lg rounded-xl bg-gray-100 ml-10 mt-10">
                <img src={`/images/${item.srcImg}`} alt="BucketItem" className='h-full pt-3 pr-3 pl-3'/>
                <p>Вес : {item.weight} г</p>
                <p className='font-bold mt-2 mb-2'>{item.name}</p>
                <p className='font-bold mt-2 mb-2'>{item.price} грн</p>
                <div className="flex flex-row mb-4 mt-2">
                  <button
                    className='flex w-[40px] h-[40px] justify-center items-center font-bold bg-green-300 border-2 border-gray-500 rounded-md'
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </button>
                  <p className='flex w-[50px] h-[40px] justify-center items-center font-bold border-2 border-gray-500 ml-2 mr-2'>
                    x {item.quantity !== undefined ? item.quantity : 0}
                  </p>
                  <button
                    className='flex w-[40px] h-[40px] justify-center items-center font-bold bg-red-300 border-2 border-gray-500 rounded-md'
                    onClick={() => removeFromCart(item.id)}
                  >
                    -
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {cart.length > 0 && (
            <>
              <div className="flex justify-center items-center mb-10 mt-4 rounded-full bg-gray-300 p-4 m-auto">
                <p>
                  Всего: {cart.reduce((total, item) => total + (item.price * item.quantity), 0)} грн
                </p>
              </div>
              <button
                className="flex fixed top-28 right-4 bg-red-400 text-white p-4 rounded-xl shadow-xl"
                onClick={handleOrder}
              >
                Оформить заказ
              </button>
            </>
          )}
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Оформление заказа</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-left mb-2" htmlFor="name">Имя</label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                {nameError && <p className="text-red-500">{nameError}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-left mb-2" htmlFor="phone">Номер телефона</label>
                <InputMask
                  mask="+380(99)9999999"
                  id="phone"
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                {phoneError && <p className="text-red-500">{phoneError}</p>}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
                  onClick={() => setShowModal(false)}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Оформить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bucket;
