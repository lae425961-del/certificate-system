import { useState } from 'react';
import { DAYS, MONTHS, YEARS, GEO, PROVINCES, GRAD_YEARS } from '../laos';
const empty = { firstName: '', lastName: '', birthDay: '', birthMonth: '', birthYear: '', village: '', province: '', district: '', major: '', gradYear: GRAD_YEARS[0] };

export default function StudentForm({ initial, onSubmit, onCancel, busy }) {
  const [f, setF] = useState(initial || empty);
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value, ...(k === 'province' ? { district: '' } : {}) }));
  const submit = (e) => { e.preventDefault(); onSubmit({ ...f, birthDay: +f.birthDay, birthMonth: +f.birthMonth, birthYear: +f.birthYear, gradYear: +f.gradYear }, () => !initial && setF(empty)); };
  const Sel = ({ k, ph, opts, disabled }) => (
    <select required disabled={disabled} className="field" value={f[k]} onChange={set(k)}>
      <option value="">{ph}</option>
      {opts.map((o) => <option key={o.v ?? o} value={o.v ?? o}>{o.t ?? o}</option>)}
    </select>
  );
  return (
    <form onSubmit={submit} className="space-y-4 p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div><label className="label">ຊື່ <b className="text-red-500">*</b></label><input required className="field" value={f.firstName} onChange={set('firstName')} placeholder="ປ້ອນຊື່" /></div>
        <div><label className="label">ນາມສະກຸນ <b className="text-red-500">*</b></label><input required className="field" value={f.lastName} onChange={set('lastName')} placeholder="ປ້ອນນາມສະກຸນ" /></div>
      </div>
      <div>
        <label className="label">ວັນເດືອນປີເກີດ <b className="text-red-500">*</b></label>
        <div className="grid grid-cols-3 gap-2">
          <Sel k="birthDay" ph="ວັນທີ" opts={DAYS} />
          <Sel k="birthMonth" ph="ເດືອນ" opts={MONTHS.map((t, i) => ({ v: i + 1, t: `${t} (${i + 1})` }))} />
          <Sel k="birthYear" ph="ປີ ຄ.ສ" opts={YEARS} />
        </div>
      </div>
      <div className="space-y-3 border-t border-slate-100 pt-3">
        <span className="text-xs font-bold text-blue-700">ທີ່ຢູ່ປັດຈຸບັນ</span>
        <div><label className="label">ເລືອກແຂວງ <b className="text-red-500">*</b></label><Sel k="province" ph="-- ເລືອກແຂວງ --" opts={PROVINCES} /></div>
        <div><label className="label">ເລືອກເມືອງ <b className="text-red-500">*</b></label><Sel k="district" ph={f.province ? '-- ເລືອກເມືອງ --' : 'ເລືອກແຂວງກ່ອນ'} opts={GEO[f.province] || []} disabled={!f.province} /></div>
        <div><label className="label">ປ້ອນບ້ານ <b className="text-red-500">*</b></label><input required className="field" value={f.village} onChange={set('village')} placeholder="ປ້ອນຊື່ບ້ານ" /></div>
      </div>
      <div className="grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div><label className="label">ສາຂາວິຊາ <b className="text-red-500">*</b></label><input required className="field" value={f.major} onChange={set('major')} placeholder="ເຊັ່ນ: ວິທະຍາສາດຄອມພິວເຕີ" /></div>
        <div><label className="label">ປີຈົບການສຶກສາ <b className="text-red-500">*</b></label><Sel k="gradYear" ph="ເລືອກປີ" opts={GRAD_YEARS} /></div>
      </div>
      <div className="flex gap-2 pt-2">
        <button disabled={busy} className="btn-blue flex-1"><i className="fa-solid fa-floppy-disk" />{busy ? 'ກຳລັງບັນທຶກ...' : initial ? 'ອັບເດດຂໍ້ມູນ' : 'ບັນທຶກຂໍ້ມູນ'}</button>
        {initial && <button type="button" onClick={onCancel} className="btn-ghost">ຍົກເລີກ</button>}
      </div>
    </form>
  );
}
