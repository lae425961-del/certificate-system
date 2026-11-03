const router = require('express').Router();
const bcrypt = require('bcryptjs'); const jwt = require('jsonwebtoken'); const rateLimit = require('express-rate-limit');
const Admin = require('../models/Admin');
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { message: 'ພະຍາຍາມຫຼາຍເກີນໄປ, ກະລຸນາລໍຖ້າ 15 ນາທີ' } });
router.post('/login', limiter, async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin || !(await bcrypt.compare(password || '', admin.password)))
    return res.status(401).json({ message: 'ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ' });
  const token = jwt.sign({ id: admin._id, username }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, username });
});
module.exports = router;
