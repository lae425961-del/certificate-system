require('dotenv').config();
const mongoose = require('mongoose'); const bcrypt = require('bcryptjs'); const Admin = require('./models/Admin');
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@12345', 10);
  await Admin.findOneAndUpdate({ username }, { username, password }, { upsert: true });
  console.log('Admin ready:', username); process.exit(0);
})();
