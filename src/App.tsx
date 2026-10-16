import { useEffect, useState } from "react";
import liff from "@line/liff";
import {
  CheckCircle2,
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
import { ApiError, submitSelection } from "@/lib/api";
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
  const [page, setPage] = useState<"select" | "confirm" | "done">("select");

  // เปลี่ยนหน้าแล้วให้เริ่มที่บนสุด ไม่ค้างตำแหน่ง scroll จากหน้าก่อน
  useEffect(() => window.scrollTo(0, 0), [page]);

  const customer =
    customerState.status === "ready" ? customerState.customer : null;
  const screen = customerState.status === "ready" ? customerState.screen : {};
  const invoices = customer?.invoices ?? [];
  const selection = useSelection(
    invoices.map((invoice) => invoice.invoice_no),
    "single"
  );

  const selectedInvoices = invoices.filter((invoice) =>
    selection.isSelected(invoice.invoice_no)
  );
  const total = selectedInvoices.reduce((sum, i) => sum + i.outstanding, 0);

  const liffStatus = LIFF_STATUS[liffState.status];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AppHeader
        icon={<ReceiptText />}
        title="ส่งบิล"
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
        ) : page === "done" ? (
          <StateCard
            tone="success"
            icon={<CheckCircle2 />}
            title="ส่งรายการแล้ว"
            description="กลับไปที่แชท LINE เพื่ออัปโหลดรูป"
          />
        ) : (
          <ConfirmInvoicesPage
            invoices={selectedInvoices}
            total={total}
            onBack={() => setPage("select")}
            onConfirm={async () => {
              const idToken = liff.getIDToken();
              if (!idToken) throw new Error("ไม่ได้รับ ID token กรุณาเปิดหน้านี้ใหม่");
              try {
                await submitSelection(
                  customer.customer_code,
                  selectedInvoices.map((invoice) => invoice.invoice_no),
                  screen,
                  idToken
                );
              } catch (error) {
                // 410: หน้าถูกแทนที่ระหว่างเปิด — โชว์ข้อความให้เห็นแป๊บหนึ่งแล้วปิด
                if (error instanceof ApiError && error.status === 410 && liff.isInClient()) {
                  setTimeout(() => liff.closeWindow(), 2000);
                }
                throw error;
              }
              // ปิด LIFF กลับไปแชท ให้ผู้ใช้เห็นข้อความขอรูปจาก bot ทันที
              if (liff.isInClient()) liff.closeWindow();
              else setPage("done");
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
