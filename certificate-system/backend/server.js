require('dotenv').config();
const express = require('express'); const cors = require('cors'); const mongoose = require('mongoose');
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.get('/api/health', (_, res) => res.json({ ok: true }));
mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT || 5000, () => console.log('API running on port', process.env.PORT || 5000));
}).catch(e => { console.error('MongoDB error:', e.message); process.exit(1); });
