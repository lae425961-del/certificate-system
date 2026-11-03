import { useState } from 'react'; import api from '../api';
export default function LoginModal({ onClose, onSuccess }) {
  const [f, setF] = useState({ username: '', password: '' }); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try { const { data } = await api.post('/auth/login', f); localStorage.setItem('token', data.token); onSuccess(); }
    catch (e) { setErr(e.response?.data?.message || 'ເຊື່ອມຕໍ່ເຊີເວີບໍ່ໄດ້'); }
    setBusy(false);
  };
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-900/60 p-4" onClick={onClose}>
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between bg-slate-900 p-4 text-white">
          <h3 className="font-bold"><i className="fa-solid fa-lock mr-2 text-blue-400" />ເຂົ້າສູ່ລະບົບ</h3>
          <button onClick={onClose} aria-label="ປິດ"><i className="fa-solid fa-xmark" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4 p-5">
          {err && <div role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{err}</div>}
          <div><label className="label">ຊື່ຜູ້ໃຊ້</label><input required autoFocus autoComplete="username" className="field" value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} /></div>
          <div><label className="label">ລະຫັດຜ່ານ</label><input required type="password" autoComplete="current-password" className="field" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></div>
          <button disabled={busy} className="btn-blue w-full">{busy ? 'ກຳລັງກວດສອບ...' : 'ຢືນຢັນເຂົ້າສູ່ລະບົບ'}</button>
        </form>
      </div>
    </div>
  );
}
