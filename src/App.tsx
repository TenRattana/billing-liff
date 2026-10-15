import { useState } from "react";
import {
  CircleAlert,
  LoaderCircle,
  ReceiptText,
  RotateCw,
  UserRoundX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { StateCard } from "@/components/state-card";
import { StatusPill } from "@/components/status-pill";
import { useCustomer } from "@/hooks/use-customer";
import { useLiff } from "@/hooks/use-liff";
import { useSelection } from "@/hooks/use-selection";
import { formatMoney } from "@/lib/format";
import { ConfirmInvoicesPage } from "@/pages/confirm-invoices-page";
import { SelectInvoicesPage } from "@/pages/select-invoices-page";

import "./global.css";

const LIFF_STATUS = {
  loading: { tone: "pending", label: "กำลังเชื่อมต่อ LINE..." },
  ready: { tone: "success", label: "เชื่อมต่อ LINE สำเร็จ" },
  error: { tone: "error", label: "เชื่อมต่อ LINE ไม่สำเร็จ" },
} as const;

function App() {
  const liffState = useLiff();
  const customerState = useCustomer(liffState);
  const [page, setPage] = useState<"select" | "confirm">("select");

  const customer =
    customerState.status === "ready" ? customerState.customer : null;
  const invoices = customer?.invoices ?? [];
  const selection = useSelection(invoices.map((invoice) => invoice.id));

  const selectedInvoices = invoices.filter((invoice) =>
    selection.isSelected(invoice.id)
  );
  const total = selectedInvoices.reduce((sum, i) => sum + i.amount, 0);

  const liffStatus = LIFF_STATUS[liffState.status];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AppHeader
        icon={<ReceiptText />}
        title="LINE Billing"
        subtitle="ระบบจัดการใบแจ้งหนี้"
        action={
          <StatusPill
            tone={liffStatus.tone}
            title={
              liffState.status === "error"
                ? String(liffState.error)
                : liffStatus.label
            }
          >
            {liffStatus.label}
          </StatusPill>
        }
      />

      <main className="relative mx-auto -mt-10 max-w-lg space-y-4 px-4 pb-36">
        {customerState.status === "loading" ? (
          <StateCard
            icon={<LoaderCircle className="animate-spin" />}
            title="กำลังโหลด..."
          />
        ) : customerState.status === "error" ? (
          <StateCard
            tone="error"
            icon={<CircleAlert />}
            title={customerState.message}
            action={
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => window.location.reload()}
              >
                <RotateCw data-icon="inline-start" />
                ลองใหม่
              </Button>
            }
          />
        ) : !customer ? (
          <StateCard
            icon={<UserRoundX />}
            title="ยังไม่ได้เลือกลูกค้า"
            description="กรุณาเปิดลิงก์นี้จากรายการลูกค้าอีกครั้ง"
          />
        ) : page === "select" ? (
          <SelectInvoicesPage
            customer={customer}
            selection={selection}
            total={total}
            onNext={() => setPage("confirm")}
          />
        ) : (
          <ConfirmInvoicesPage
            invoices={selectedInvoices}
            total={total}
            onBack={() => setPage("select")}
            onConfirm={() => {
              // Demo only: ยังไม่ส่งข้อมูลไป Backend
              window.alert(
                `รายการที่เลือก:\n${selection.selected.join("\n")}\n\nยอดรวม ${formatMoney(total)}`
              );
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
