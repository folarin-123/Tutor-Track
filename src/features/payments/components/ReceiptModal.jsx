import { ReceiptText } from "lucide-react";
import { Modal, PrimaryButton } from "@/components/common/Primitives";
import { formatNaira } from "@/lib/formatters";

export default function ReceiptModal({ item, onClose }) {
  return (
    <Modal title="Payment receipt" onClose={onClose}>
      <div className="rounded-3xl bg-primary-900 p-5 text-white">
        <div className="flex items-center justify-between">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-400 text-primary-900">
            <ReceiptText size={18} />
          </span>
          <span className="rounded-full bg-primary-400/20 px-3 py-1 text-xs font-bold text-primary-100">
            PAID
          </span>
        </div>
        <p className="mt-7 text-sm text-primary-200">Received from</p>
        <p className="text-xl font-extrabold">{item.studentName}</p>
        <p className="mt-6 text-3xl font-extrabold">{formatNaira(item.amount)}</p>
        <div className="mt-6 border-t border-white/15 pt-4 text-sm text-primary-200">
          <p>{item.month} tuition, TutorTrack receipt</p>
          <p className="mt-1">Ref: TT-{item.id}</p>
        </div>
      </div>
      <PrimaryButton className="mt-4 w-full" onClick={onClose}>
        Done
      </PrimaryButton>
    </Modal>
  );
}
