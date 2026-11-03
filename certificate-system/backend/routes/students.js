const router = require('express').Router();
const ExcelJS = require('exceljs');
const Student = require('../models/Student');
const { auth } = require('../middleware');
const MONTHS = ['ມັງກອນ','ກຸມພາ','ມີນາ','ເມສາ','ພຶດສະພາ','ມິຖຸນາ','ກໍລະກົດ','ສິງຫາ','ກັນຍາ','ຕຸລາ','ພະຈິກ','ທັນວາ'];
const FIELDS = ['firstName','lastName','birthDay','birthMonth','birthYear','village','district','province','major','gradYear'];
const pick = (b, extra = []) => Object.fromEntries([...FIELDS, ...extra].filter(f => b[f] !== undefined).map(f => [f, b[f]]));

const buildFilter = (q) => {
  const f = {};
  if (q.province) f.province = q.province;
  if (q.district) f.district = q.district;
  if (q.status) f.status = q.status;
  if (q.search) { const r = new RegExp(q.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); f.$or = [{ firstName: r }, { lastName: r }, { major: r }, { village: r }]; }
  return f;
};

// ສະຖິຕິລວມ (ສາທາລະນະ, ບໍ່ມີຂໍ້ມູນສ່ວນຕົວ)
router.get('/stats', async (_, res) => {
  const total = await Student.countDocuments();
  const issued = await Student.countDocuments({ status: 'ອອກໃບຢັ້ງຢືນແລ້ວ' });
  res.json({ total, issued, pending: total - issued });
});

// ລົງທະບຽນ (ສາທາລະນະ) — ສະຖານະເປັນ "ລໍຖ້າ" ສະເໝີ
router.post('/', async (req, res) => {
  try { await Student.create(pick(req.body)); res.status(201).json({ ok: true }); }
  catch { res.status(400).json({ message: 'ຂໍ້ມູນບໍ່ຄົບຖ້ວນ ຫຼື ບໍ່ຖືກຕ້ອງ' }); }
});

router.get('/', auth, async (req, res) => {
  const filter = buildFilter(req.query);
  const items = await Student.find(filter).sort({ createdAt: -1 });
  res.json({ total: items.length, items });
});

router.get('/export', auth, async (req, res) => {
  const items = await Student.find(buildFilter(req.query)).sort({ createdAt: -1 });
  const wb = new ExcelJS.Workbook(); const ws = wb.addWorksheet('ລາຍຊື່ນັກສຶກສາ');
  ws.columns = [
    { header: 'ລ/ດ', key: 'no', width: 6 }, { header: 'ຊື່', key: 'firstName', width: 18 },
    { header: 'ນາມສະກຸນ', key: 'lastName', width: 20 }, { header: 'ວັນເດືອນປີເກີດ', key: 'birth', width: 22 },
    { header: 'ບ້ານ', key: 'village', width: 18 }, { header: 'ເມືອງ', key: 'district', width: 18 },
    { header: 'ແຂວງ', key: 'province', width: 18 }, { header: 'ສາຂາວິຊາ', key: 'major', width: 26 },
    { header: 'ປີຈົບ', key: 'gradYear', width: 10 }, { header: 'ສະຖານະ', key: 'status', width: 20 },
  ];
  items.forEach((s, i) => ws.addRow({ no: i + 1, firstName: s.firstName, lastName: s.lastName,
    birth: `${s.birthDay} ${MONTHS[s.birthMonth - 1]} ${s.birthYear}`, village: s.village, district: s.district,
    province: s.province, major: s.major, gradYear: s.gradYear, status: s.status }));
  const head = ws.getRow(1); head.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  head.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
  ws.views = [{ state: 'frozen', ySplit: 1 }];
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');
  await wb.xlsx.write(res); res.end();
});

router.put('/:id', auth, async (req, res) => {
  try { const s = await Student.findByIdAndUpdate(req.params.id, pick(req.body, ['status']), { new: true, runValidators: true });
    s ? res.json(s) : res.status(404).json({ message: 'ບໍ່ພົບຂໍ້ມູນ' }); }
  catch { res.status(400).json({ message: 'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ' }); }
});
router.delete('/:id', auth, async (req, res) => { await Student.findByIdAndDelete(req.params.id); res.json({ ok: true }); });
module.exports = router;
