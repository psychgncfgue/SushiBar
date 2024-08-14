import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Очистка сообщения при монтировании компонента
    setMessage('');
  }, [forgotPasswordMode]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/adminlogin', { username, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        navigate('/admindashboard');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage('Ошибка при входе. Пожалуйста, попробуйте позже.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/admin/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Неверный email');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form 
        onSubmit={forgotPasswordMode ? handleForgotPassword : handleLogin} 
        className="bg-white p-8 rounded shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">
          {forgotPasswordMode ? 'Сброс пароля' : 'Вход администратора'}
        </h2>

        {forgotPasswordMode ? (
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Имя пользователя</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded"
        >
          {forgotPasswordMode ? 'Отправить письмо для сброса' : 'Войти'}
        </button>

        {message && <p className="mt-4 text-red-500">{message}</p>}

        {!forgotPasswordMode && (
          <button
            type="button"
            onClick={() => setForgotPasswordMode(true)}
            className="mt-4 text-blue-500"
          >
            Забыл пароль?
          </button>
        )}
        
        {forgotPasswordMode && (
          <button
            type="button"
            onClick={() => {
              setForgotPasswordMode(false);
              setMessage(''); // Очистка сообщения при возврате к авторизации
            }}
            className="mt-4 text-blue-500"
          >
            Назад к авторизации
          </button>
        )}
      </form>
    </div>
  );
}

export default AdminLogin;