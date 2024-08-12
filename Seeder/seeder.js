const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://mongodb:27017/SushiDataBase')
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

const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    products: [{
        name: String,
        quantity: String,
    }] 
});

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

adminSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);

const items = [
    { srcImg: 'bonaqaBG-500x333.jpg', id: 1, weight: '500', name: 'Бонаква Н/Г', price: '20', category: 'Beverages' },
    { srcImg: 'coca-cola05-500x333.jpg', id: 2, weight: '500', name: 'Кока Кола classic', price: '35', category: 'Beverages' },
    { srcImg: 'rich_pack_orange_1l_600-500x333.png', id: 3, weight: '1000', name: 'Сок Рич Апельсин', price: '60', category: 'Beverages' },
    { srcImg: 'Абури-500x333.png', id: 4, weight: '280', name: 'Абури', price: '300', category: 'Rolls' },
    { srcImg: 'Аляска-500x333.png', id: 5, weight: '270', name: 'Аляска', price: '280', category: 'Rolls' },
    { srcImg: 'АмаЭби-500x333.png', id: 6, weight: '320', name: 'Ама Эби', price: '320', category: 'Rolls' },
    { srcImg: 'БигМаки-500x333.png', id: 7, weight: '310', name: 'Биг Маки', price: '300', category: 'Rolls' },
    { srcImg: 'БонитоЛосось-500x333.png', id: 8, weight: '340', name: 'Бонито Лосось', price: '333', category: 'Rolls' },
    { srcImg: 'БонитоТунец-500x333.png', id: 9, weight: '290', name: 'Бонито Тунец', price: '250', category: 'Rolls' },
    { srcImg: 'БонитоУнагиОкунь-500x333.png', id: 10, weight: '240', name: 'Бонито Унаги Окунь', price: '240', category: 'Rolls' },
    { srcImg: 'Бусидо-500x333.png', id: 11, weight: '250', name: 'Бусидо', price: '350', category: 'Rolls' },
    { srcImg: 'ВИП-500x333.png', id: 12, weight: '260', name: 'Вип', price: '290', category: 'HotRolls' },
    { srcImg: 'ДраконВКунжуте-500x333.png', id: 13, weight: '330', name: 'Дракон в Кунжуте', price: '310', category: 'Rolls' },
    { srcImg: 'тяханскурицей-500x333.png', id: 14, weight: '350', name: 'Тяхан с курицей', price: '180', category: 'Wok' },
    { srcImg: 'собасосвининой-500x333.png', id: 15, weight: '400', name: 'Соба с свининой', price: '170', category: 'Wok' },
    { srcImg: 'лапшапосингапурски-500x333.png', id: 16, weight: '370', name: 'Лапша по Сингапурски', price: '160', category: 'Wok' },
    { srcImg: 'собаскурицей-500x333.png', id: 17, weight: '330', name: 'Соба с курицей', price: '190', category: 'Wok' },
    { srcImg: 'zap_los-500x333.png', id: 18, weight: '290', name: 'Запеченный лосось', price: '300', category: 'Rolls' },
    { srcImg: 'zapechenij_rol_z_tigrovoyu_krevetkoyu_1000h668-500x333.png', id: 19, weight: '290', name: 'Запеченный с тигровой креветкой', price: '300', category: 'Rolls' },
    { srcImg: 'zapechenij-rol-z-bonito-1000h668-500x333.png', id: 20, weight: '290', name: 'Запеченный с тунцом', price: '300', category: 'Rolls' },
    { srcImg: 'ЗапеченныйРоллСЛососем-500x333.png', id: 21, weight: '290', name: 'Запеченный с лососем', price: '300', category: 'Rolls' },
    { srcImg: 'ЗапеченныйСКальмаром-500x333.png', id: 22, weight: '290', name: 'Запеченный с кальмаром', price: '300', category: 'Rolls' },
    { srcImg: 'ЗапеченныйСМидиями-500x333.png', id: 23, weight: '290', name: 'Запеченный с мидиями', price: '300', category: 'Rolls' },
    { srcImg: 'Итака-500x333.png', id: 24, weight: '290', name: 'Итака', price: '300', category: 'Rolls' },
    { srcImg: 'Канада-500x333.png', id: 25, weight: '290', name: 'Канада', price: '300', category: 'Rolls' },
    { srcImg: 'Киото-500x333.png', id: 26, weight: '290', name: 'Киото', price: '300', category: 'Rolls' },
    { srcImg: 'ТеплыйРоллСОкунем-500x333.png', id: 27, weight: '290', name: 'Ролл с окунем', price: '300', category: 'Rolls' },
    { srcImg: 'УнагиФурай-500x333.png', id: 28, weight: '290', name: 'Унаги фурай', price: '300', category: 'Rolls' },
    { srcImg: 'Фиджи-500x333.png', id: 29, weight: '290', name: 'Фиджи', price: '300', category: 'Rolls' },
];

const seedDB = async () => {
    try {
        await Product.deleteMany({});
        await User.deleteMany({});
        await Admin.deleteMany({});

        await Product.insertMany(items);

        await User.create({
            name: 'Test User',
            phone: '0000000000',
            products: [{
                name: 'Test',
                quantity: '1',
            }] 
        });

        await Admin.create({
            username: 'admin',
            password: 'qqq'
        });

        console.log('Database seeded!');
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        mongoose.connection.close();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});