import { MONTHS } from '../laos';
export default function CertificateModal({ s, onClose }) {
  const today = new Date().toLocaleDateString('en-GB');
  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-900/70 p-3 sm:p-6" onClick={onClose}>
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-slate-100 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between bg-slate-900 p-4 text-white">
          <h3 className="font-bold"><i className="fa-solid fa-award mr-2 text-yellow-400" />ຕົວຢ່າງ ໃບຢັ້ງຢືນຈົບການສຶກສາ</h3>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="btn-blue !py-2"><i className="fa-solid fa-print" />ພິມ</button>
            <button onClick={onClose} className="btn bg-white/10 !py-2 text-white hover:bg-white/20" aria-label="ປິດ"><i className="fa-solid fa-xmark" /></button>
          </div>
        </div>
        <div className="overflow-x-auto p-3 sm:p-6">
          <div id="printableCertificate" className="mx-auto min-w-[560px] border-[10px] border-double border-blue-900 bg-white p-8 text-center leading-relaxed">
            <p className="font-bold">ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ</p>
            <p className="text-sm">ສັນຕິພາບ ເອກະລາດ ປະຊາທິປະໄຕ ເອກະພາບ ວັດທະນາຖາວອນ</p>
            <p className="my-2 text-slate-400">--- 000 ---</p>
            <div className="mt-4 flex justify-between text-left text-sm">
              <div><p>ກະຊວງສຶກສາທິການ ແລະ ກິລາ</p><p>ສະຖາບັນການສຶກສາຊັ້ນສູງ / ວິທະຍາໄລ</p></div>
              <p>ເລກທີ: ...../ສສສ</p>
            </div>
            <h2 className="mt-8 text-3xl font-bold text-blue-900">ໃບຢັ້ງຢືນຈົບການສຶກສາ</h2>
            <p className="text-sm text-slate-500">(ລໍຖ້າຮັບໃບປະກາດສະນີຍະບັດ)</p>
            <div className="mt-8 space-y-4 text-left indent-8">
              <p>ຫົວໜ້າສະຖາບັນການສຶກສາ ຂໍຢັ້ງຢືນວ່າ: ທ້າວ/ນາງ <b>{s.firstName} {s.lastName}</b> ເກີດວັນທີ {s.birthDay} {MONTHS[s.birthMonth - 1]} {s.birthYear}, ທີ່ຢູ່ປັດຈຸບັນ: ບ້ານ {s.village}, ເມືອງ {s.district}, ແຂວງ {s.province}.</p>
              <p>ໄດ້ສຳເລັດການສຶກສາຕາມຫຼັກສູດ ລະດັບປະລິນຍາຕີ, ສາຂາວິຊາ: <b>{s.major}</b> ປະຈຳປີການສຶກສາ {s.gradYear}.</p>
              <p>ໃບຢັ້ງຢືນສະບັບນີ້ອອກໃຫ້ເພື່ອຢັ້ງຢືນວ່າ ຜູ້ກ່ຽວໄດ້ຈົບການສຶກສາແທ້ ແລະ ຢູ່ລະຫວ່າງ <b>ລໍຖ້າຮັບໃບປະກາດສະນີຍະບັດຢ່າງເປັນທາງການ</b>. ສາມາດໃຊ້ໃບຢັ້ງຢືນນີ້ຍື່ນສະໝັກວຽກ ຫຼື ປະກອບເອກະສານອື່ນໆ ໄດ້ຕາມກົດໝາຍ.</p>
            </div>
            <div className="mt-10 flex justify-between text-sm">
              <p className="font-bold">ຜູ້ກວດກາເອກະສານ</p>
              <div><p>ນະຄອນຫຼວງວຽງຈັນ, ວັນທີ {today}</p><p className="font-bold">ຫົວໜ້າສະຖາບັນການສຶກສາ</p><div className="h-16" /><p className="text-slate-500">(ລາຍເຊັນ ແລະ ປະທັບຕາ)</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
