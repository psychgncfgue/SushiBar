import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (!token) {
      navigate('/adminlogin');
    }
  }, [token, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/reset-password', { token, newPassword });
      setMessage(response.data.message);
      if (response.data.message === 'Пароль успешно изменен') {
        navigate('/adminlogin');
      }
    } catch (error) {
      setMessage('Ошибка при сбросе пароля.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleResetPassword} className="bg-white p-8 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Смена пароля</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Новый пароль</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">Сменить пароль</button>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </form>
    </div>
  );
}

export default ResetPassword;