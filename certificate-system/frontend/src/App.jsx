import { useCallback, useEffect, useState } from 'react';
import api from './api'; import { GEO, PROVINCES, MONTHS, PENDING, ISSUED } from './laos';
import StudentForm from './components/StudentForm'; import CertificateModal from './components/CertificateModal'; import LoginModal from './components/LoginModal';

const birth = (s) => `${s.birthDay} ${MONTHS[s.birthMonth - 1]} ${s.birthYear}`;
const Badge = ({ s }) => (
  <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${s === ISSUED ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${s === ISSUED ? 'bg-emerald-500' : 'bg-amber-500'}`} />{s}</span>
);
const Stat = ({ label, value, color, icon }) => (
  <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
    <div><p className="text-sm font-medium text-slate-500">{label}</p><h3 className={`mt-1 text-3xl font-bold ${color}`}>{value}</h3></div>
    <div className={`grid h-12 w-12 place-items-center rounded-xl text-xl ${color} bg-current/10`} style={{ backgroundColor: 'rgba(100,116,139,.08)' }}><i className={`fa-solid ${icon}`} /></div>
  </div>
);

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('token'));
  const [stats, setStats] = useState({ total: 0, pending: 0, issued: 0 });
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(false);
  const [q, setQ] = useState({ search: '', province: '', district: '' });
  const [editing, setEditing] = useState(null); const [cert, setCert] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false); const [busy, setBusy] = useState(false); const [toast, setToast] = useState(null);

  const notify = (text, type = 'ok') => { setToast({ text, type }); setTimeout(() => setToast(null), 3000); };
  const params = () => Object.fromEntries(Object.entries(q).filter(([, v]) => v));
  const loadStats = () => api.get('/students/stats').then((r) => setStats(r.data)).catch(() => {});
  const load = useCallback(async () => {
    if (!authed) return; setLoading(true);
    try { const { data } = await api.get('/students', { params: params() }); setItems(data.items); } catch {}
    setLoading(false);
  }, [authed, q]);
  useEffect(() => { loadStats(); }, []);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); }, [load]);

  const submit = async (data, reset) => {
    setBusy(true);
    try {
      if (editing) { await api.put(`/students/${editing._id}`, data); setEditing(null); notify('ແກ້ໄຂຂໍ້ມູນສຳເລັດແລ້ວ'); }
      else { await api.post('/students', data); reset(); notify('ບັນທຶກຂໍ້ມູນນັກສຶກສາສຳເລັດ'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      load(); loadStats();
    } catch (e) { notify(e.response?.data?.message || 'ບັນທຶກບໍ່ສຳເລັດ', 'err'); }
    setBusy(false);
  };
  const toggleIssued = async (s) => { await api.put(`/students/${s._id}`, { status: s.status === ISSUED ? PENDING : ISSUED }); load(); loadStats(); };
  const del = async (s) => { if (confirm(`ລຶບ ${s.firstName} ${s.lastName} ?`)) { await api.delete(`/students/${s._id}`); notify('ລຶບຂໍ້ມູນແລ້ວ'); load(); loadStats(); } };
  const exportXlsx = async () => {
    const { data } = await api.get('/students/export', { params: params(), responseType: 'blob' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(data); a.download = 'students.xlsx'; a.click();
  };
  const logout = () => { localStorage.removeItem('token'); setAuthed(false); setItems([]); setEditing(null); };
  const edit = (s) => { setEditing(s); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const Actions = ({ s }) => (<>
    <button className="icon-btn text-blue-600" title="ເບິ່ງໃບຢັ້ງຢືນ" onClick={() => setCert(s)}><i className="fa-solid fa-eye" /></button>
    <button className="icon-btn text-emerald-600" title={s.status === ISSUED ? 'ຍົກເລີກການອອກ' : 'ໝາຍວ່າອອກແລ້ວ'} onClick={() => toggleIssued(s)}><i className="fa-solid fa-check" /></button>
    <button className="icon-btn text-amber-600" title="ແກ້ໄຂ" onClick={() => edit(s)}><i className="fa-solid fa-pen" /></button>
    <button className="icon-btn text-red-600" title="ລຶບ" onClick={() => del(s)}><i className="fa-solid fa-trash" /></button>
  </>);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white shadow-lg print:hidden">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/20 bg-white/10 p-2.5"><i className="fa-solid fa-graduation-cap text-2xl text-yellow-400 sm:text-3xl" /></div>
            <div><h1 className="text-base font-bold leading-tight sm:text-xl">ລະບົບອອກໃບຢັ້ງຢືນຈົບການສຶກສາ</h1><p className="hidden text-xs text-blue-200 sm:block">Certificate Issuance & Student Management System</p></div>
          </div>
          <div className="flex items-center gap-2">
            {authed && <span className="hidden items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs sm:flex"><span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-emerald-400" />ຜູ້ບໍລິຫານ</span>}
            <button onClick={authed ? logout : () => setLoginOpen(true)} className="btn-blue !px-3 sm:!px-4"><i className={`fa-solid ${authed ? 'fa-right-from-bracket' : 'fa-lock'}`} /><span>{authed ? 'ອອກຈາກລະບົບ' : 'ເຂົ້າສູ່ລະບົບ'}</span></button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 sm:px-6 sm:py-8 print:hidden">
        <div className="grid gap-4 md:grid-cols-3">
          <Stat label="ນັກສຶກສາທັງໝົດ" value={stats.total} color="text-blue-600" icon="fa-users" />
          <Stat label="ລໍຖ້າຮັບໃບປະກາດ" value={stats.pending} color="text-amber-600" icon="fa-clock" />
          <Stat label="ອອກໃບຢັ້ງຢືນແລ້ວ" value={stats.issued} color="text-emerald-600" icon="fa-award" />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-5 xl:col-span-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:sticky lg:top-24">
              <div className="flex items-center justify-between bg-slate-900 p-4 text-white">
                <h2 className="flex items-center font-bold"><i className={`fa-solid ${editing ? 'fa-user-pen' : 'fa-user-plus'} mr-2.5 text-blue-400`} />{editing ? 'ແກ້ໄຂຂໍ້ມູນນັກສຶກສາ' : 'ຟອມບັນທຶກຂໍ້ມູນນັກສຶກສາ'}</h2>
                {editing && <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold">ໂໝດແກ້ໄຂ</span>}
              </div>
              <StudentForm key={editing?._id || 'new'} initial={editing} onSubmit={submit} onCancel={() => setEditing(null)} busy={busy} />
            </div>
          </section>

          <section className="space-y-4 lg:col-span-7 xl:col-span-8">
            {!authed ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <i className="fa-solid fa-lock mb-3 text-4xl text-slate-300" />
                <p className="font-medium">ລາຍງານ, ການແກ້ໄຂ ແລະ ການສົ່ງອອກ Excel ສຳລັບເຈົ້າໜ້າທີ່</p>
                <p className="mt-1 text-sm text-slate-500">ເຂົ້າສູ່ລະບົບເພື່ອເບິ່ງລາຍຊື່ນັກສຶກສາ</p>
                <button onClick={() => setLoginOpen(true)} className="btn-blue mt-4">ເຂົ້າສູ່ລະບົບ</button>
              </div>
            ) : (<>
              <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-[1fr_auto_auto_auto]">
                <div className="relative sm:col-span-2 xl:col-span-1"><i className="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-slate-400" />
                  <input className="field !pl-10" placeholder="ຄົ້ນຫາ ຊື່, ນາມສະກຸນ, ສາຂາ, ບ້ານ..." value={q.search} onChange={(e) => setQ({ ...q, search: e.target.value })} /></div>
                <select className="field xl:w-40" value={q.province} onChange={(e) => setQ({ ...q, province: e.target.value, district: '' })}><option value="">ທຸກແຂວງ</option>{PROVINCES.map((p) => <option key={p}>{p}</option>)}</select>
                <select className="field xl:w-40" disabled={!q.province} value={q.district} onChange={(e) => setQ({ ...q, district: e.target.value })}><option value="">ທຸກເມືອງ</option>{(GEO[q.province] || []).map((d) => <option key={d}>{d}</option>)}</select>
                <button onClick={exportXlsx} className="btn-green sm:col-span-2 xl:col-span-1"><i className="fa-solid fa-file-excel" />ສົ່ງອອກ Excel</button>
              </div>

              {loading && !items.length ? <p className="py-10 text-center text-slate-500">ກຳລັງໂຫຼດ...</p> : !items.length ? (
                <div className="rounded-2xl border border-slate-200 bg-white py-14 text-center text-slate-500"><i className="fa-solid fa-folder-open mb-2 text-4xl text-slate-300" /><p>ບໍ່ພົບຂໍ້ມູນນັກສຶກສາ</p></div>
              ) : (<>
                <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-600"><tr>{['ລຳດັບ','ຊື່ ແລະ ນາມສະກຸນ','ວັນເດືອນປີເກີດ','ທີ່ຢູ່ປັດຈຸບັນ','ສາຂາວິຊາ','ສະຖານະ','ຈັດການ'].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
                    <tbody>{items.map((s, i) => (
                      <tr key={s._id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3">{i + 1}</td><td className="px-4 py-3 font-medium">{s.firstName} {s.lastName}</td><td className="whitespace-nowrap px-4 py-3">{birth(s)}</td>
                        <td className="px-4 py-3">ບ. {s.village}, ມ. {s.district}, {s.province}</td><td className="px-4 py-3">{s.major} ({s.gradYear})</td>
                        <td className="px-4 py-3"><Badge s={s.status} /></td><td className="whitespace-nowrap px-2 py-3"><Actions s={s} /></td>
                      </tr>))}</tbody>
                  </table>
                </div>
                <div className="space-y-3 md:hidden">{items.map((s) => (
                  <div key={s._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-2"><h3 className="font-bold">{s.firstName} {s.lastName}</h3><Badge s={s.status} /></div>
                    <dl className="mt-2 space-y-0.5 text-sm text-slate-600"><div>ເກີດ: {birth(s)}</div><div>ບ. {s.village}, ມ. {s.district}, ແຂວງ {s.province}</div><div>{s.major} ({s.gradYear})</div></dl>
                    <div className="mt-2 flex justify-end border-t border-slate-100 pt-2"><Actions s={s} /></div>
                  </div>))}</div>
              </>)}
            </>)}
          </section>
        </div>
      </main>

      {cert && <CertificateModal s={cert} onClose={() => setCert(null)} />}
      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} onSuccess={() => { setAuthed(true); setLoginOpen(false); notify('ເຂົ້າສູ່ລະບົບສຳເລັດ'); }} />}
      {toast && <div role="status" className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-xl print:hidden ${toast.type === 'err' ? 'bg-red-600' : 'bg-slate-900'}`}><i className={`fa-solid ${toast.type === 'err' ? 'fa-circle-exclamation' : 'fa-circle-check text-emerald-400'} mr-2`} />{toast.text}</div>}
    </div>
  );
}
