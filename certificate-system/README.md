# ລະບົບລົງທະບຽນຮັບໃບຢັ້ງຢືນຈົບການສຶກສາ
Stack: React + Tailwind (frontend) · Node.js/Express (backend) · MongoDB

## ເລີ່ມໃຊ້ງານ (ເຄື່ອງຕົນເອງ)
1. Backend
   cd backend && cp .env.example .env   # ແກ້ MONGO_URI, JWT_SECRET, ADMIN_PASSWORD
   npm install && npm run seed && npm run dev
2. Frontend
   cd frontend && cp .env.example .env
   npm install && npm run dev            # http://localhost:5173

## ໜ້າທີ່ມີ
- ໜ້າດຽວ: ຟອມລົງທະບຽນ (ສາທາລະນະ) + ລາຍງານ/ແກ້ໄຂ/ໃບຢັ້ງຢືນ/Excel (ຕ້ອງ login)

## ນຳຂຶ້ນ Online
- Database: MongoDB Atlas (ໃສ່ MONGO_URI)
- Backend: Render / Railway (ຕັ້ງ env ໃຫ້ຄົບ, CLIENT_URL = ໂດເມນ frontend)
- Frontend: Vercel / Netlify (VITE_API_URL = URL backend + /api; ເພີ່ມ rewrite ທຸກເສັ້ນທາງໄປ index.html)
- ປ່ຽນລະຫັດຜ່ານ admin ແລະ ໃຊ້ HTTPS ສະເໝີ
