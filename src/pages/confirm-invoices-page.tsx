import { useState } from "react";
import { ArrowLeft, CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { ActionButton } from "@/components/action-button";
import { Panel, PanelContent } from "@/components/panel";
import { TotalRow } from "@/components/total-row";
import type { Invoice } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";

type ConfirmInvoicesPageProps = {
  invoices: Invoice[];
  total: number;
  /** throw Error เพื่อแสดงข้อความ error ใต้การ์ด */
  onConfirm: () => Promise<void>;
  onBack: () => void;
};

export function ConfirmInvoicesPage({
  invoices,
  total,
  onConfirm,
  onBack,
}: ConfirmInvoicesPageProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    setPending(true);
    setError(null);
    try {
      await onConfirm();
    } catch (e) {
      setError(e instanceof Error ? e.message : "ส่งรายการไม่สำเร็จ");
    } finally {
      setPending(false);
    }
  };

  return (
    <Panel>
      <PanelContent className="space-y-5">
        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-green-50 text-line">
            <CheckCircle2 className="size-8" />
          </div>
          <h2 className="text-xl font-bold">ยืนยันรายการบิล</h2>
          <p className="text-sm text-slate-500">
            ตรวจสอบรายการก่อนยืนยัน ({invoices.length} รายการ)
          </p>
        </div>

        <div className="space-y-2 rounded-xl bg-slate-50 p-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.invoice_no}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <div className="min-w-0">
                <p className="font-medium">{invoice.invoice_no}</p>
                <p className="truncate text-xs text-slate-400">
                  วันออกบิล {formatDate(invoice.invoice_date)}
                </p>
                <p className="truncate text-xs text-slate-400">
                  ครบกำหนด {formatDate(invoice.due_date)}
                </p>
              </div>
              <span className="tabular-nums">
                {formatMoney(invoice.outstanding)}
              </span>
            </div>
          ))}

          <Separator className="my-3 border-dashed" />

          <TotalRow amount={total} className="items-center" />
        </div>

        {error && (
          <p className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600">
            <CircleAlert className="size-4 shrink-0" />
            {error}
          </p>
        )}

        <div className="space-y-2">
          <ActionButton disabled={pending} onClick={confirm}>
            {pending && <LoaderCircle className="animate-spin" data-icon="inline-start" />}
            {pending ? "กำลังส่ง..." : "ยืนยันรายการ"}
          </ActionButton>
          <ActionButton tone="secondary" disabled={pending} onClick={onBack}>
            <ArrowLeft data-icon="inline-start" />
            กลับไปแก้ไข
          </ActionButton>
        </div>
      </PanelContent>
    </Panel>
  );
}
