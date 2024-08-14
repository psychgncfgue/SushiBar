const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'your_jwt_secret';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail(to, subject, text) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error('Ошибка при отправке почты:', error);
    throw new Error('Ошибка при отправке почты');
  }
}

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, '../Client/public/images')));

mongoose.connect('mongodb://localhost:27017/SushiDataBase')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const productSchema = new mongoose.Schema({
  srcImg: String,
  id: Number,
  weight: String,
  name: String,
  price: String,
  category: String
});

const Product = mongoose.model('Product', productSchema);

const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  products: [{
    name: String,
    quantity: String,
  }]
});

const User = mongoose.model('User', userSchema);

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  resetToken: { type: String, default: null },
});

const Admin = mongoose.model('Admin', adminSchema);

app.post('/api/admin/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Админ с таким email не найден' });
    }

    const resetToken = jwt.sign({ id: admin._id }, SECRET_KEY, { expiresIn: '1h' });
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    await sendMail(
      admin.email,
      'Сброс пароля',
      `Нажмите на ссылку для сброса пароля: ${resetLink}`
    );

    admin.resetToken = resetToken;
    await admin.save();

    res.json({ message: 'Ссылка для сброса пароля отправлена на ваш email' });
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    res.status(500).json({ message: 'Ошибка при отправке ссылки для сброса пароля' });
  }
});

app.post('/api/admin/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const admin = await Admin.findById(decoded.id);

    if (!admin || admin.resetToken !== token) {
      return res.status(400).json({ message: 'Неверный токен или срок действия истек' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.resetToken = null;
    await admin.save();

    res.json({ message: 'Пароль успешно изменен' });
  } catch (error) {
    res.status(400).json({ message: 'Ошибка при сбросе пароля' });
  }
});

app.post('/api/adminlogin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: admin._id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/api/admindashboard', authenticateToken, (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard' });
});

app.get('/api/products', async (req, res) => {
  try {
    const category = req.query.category || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;

    const query = category ? { category } : {};
    
    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      totalPages,
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { name, phone, products } = req.body;

  if (!name || !phone || !products) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newUser = new User({ name, phone, products });
    await newUser.save();
    res.status(200).json({ message: 'Order received successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});