import { useEffect, useState } from "react";
import liff from "@line/liff";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ReceiptText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

import "./global.css";

type Invoice = {
  id: string;
  customer: string;
  amount: number;
  date: string;
};

const invoices: Invoice[] = [
  { id: "INV-001", customer: "บริษัท ABC จำกัด", amount: 1500, date: "10/10/2026" },
  { id: "INV-002", customer: "บริษัท ABC จำกัด", amount: 2800, date: "11/10/2026" },
  { id: "INV-003", customer: "บริษัท XYZ จำกัด", amount: 950, date: "12/10/2026" },
  { id: "INV-004", customer: "บริษัท XYZ จำกัด", amount: 4200, date: "13/10/2026" },
];

const LIFF_OK = "เชื่อมต่อ LINE สำเร็จ";

const money = (value: number) =>
  value.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function App() {
  const [liffStatus, setLiffStatus] = useState("กำลังเชื่อมต่อ LINE...");
  const [mode, setMode] = useState<"single" | "multiple">("multiple");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState<"select" | "confirm">("select");

  useEffect(() => {
    let active = true;

    liff
      .init({ liffId: import.meta.env.VITE_LIFF_ID })
      .then(() => {
        if (active) setLiffStatus(LIFF_OK);
      })
      .catch((error: unknown) => {
        if (active) {
          setLiffStatus(`LIFF init failed: ${String(error)}`);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const toggleInvoice = (id: string) => {
    if (mode === "single") {
      setSelected([id]);
      return;
    }

    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const total = invoices
    .filter((invoice) => selected.includes(invoice.id))
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  const allSelected = selected.length === invoices.length;

  const selectAll = () => {
    setSelected(allSelected ? [] : invoices.map((invoice) => invoice.id));
  };

  const liffOk = liffStatus === LIFF_OK;
  const liffFailed = liffStatus.startsWith("LIFF init failed");

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-gradient-to-br from-[#06C755] to-[#04a345] px-5 pt-6 pb-14 text-white">
        <div className="mx-auto flex max-w-lg items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <ReceiptText className="size-6" />
            </div>
            <div>
              <h1 className="text-lg leading-tight font-bold">LINE Billing</h1>
              <p className="text-xs text-white/80">ระบบจัดการใบแจ้งหนี้</p>
            </div>
          </div>

          <span
            className="flex max-w-[45%] items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] backdrop-blur"
            title={liffStatus}
          >
            <span
              className={`size-2 shrink-0 rounded-full ${
                liffOk
                  ? "bg-white"
                  : liffFailed
                    ? "bg-red-300"
                    : "animate-pulse bg-yellow-200"
              }`}
            />
            <span className="truncate">{liffStatus}</span>
          </span>
        </div>
      </header>

      <main className="relative mx-auto -mt-10 max-w-lg space-y-4 px-4 pb-36">
        {page === "select" ? (
          <>
            <Card className="rounded-2xl border-0 shadow-lg shadow-slate-900/5">
              <CardContent className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold">เลือกบิลที่ต้องการส่ง</h2>
                  <p className="mt-0.5 text-sm text-slate-500">
                    เลือกรายการใบแจ้งหนี้เพื่อดำเนินการต่อ
                  </p>
                </div>

                <RadioGroup
                  value={mode}
                  onValueChange={(value) => {
                    if (value !== "single" && value !== "multiple") return;
                    setMode(value);
                    setSelected([]);
                  }}
                  className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1"
                >
                  {(
                    [
                      ["single", "เลือกบิลเดียว"],
                      ["multiple", "เลือกหลายบิล"],
                    ] as const
                  ).map(([value, label]) => (
                    <label
                      key={value}
                      className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all ${
                        mode === value
                          ? "bg-white text-[#06C755] shadow-sm"
                          : "text-slate-500"
                      }`}
                    >
                      <RadioGroupItem value={value} className="sr-only" />
                      {label}
                    </label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between px-1 pt-2">
              <h3 className="text-sm font-semibold text-slate-700">
                รายการใบแจ้งหนี้{" "}
                <span className="font-normal text-slate-400">
                  ({invoices.length})
                </span>
              </h3>

              {mode === "multiple" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#06C755] hover:bg-green-50 hover:text-[#05b34c]"
                  onClick={selectAll}
                >
                  {allSelected ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด"}
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {invoices.map((invoice) => {
                const checked = selected.includes(invoice.id);

                return (
                  <Card
                    key={invoice.id}
                    size="sm"
                    className={`cursor-pointer rounded-2xl shadow-none transition-all active:scale-[0.99] ${
                      checked
                        ? "bg-green-50 ring-2 ring-[#06C755]"
                        : "ring-slate-200 hover:ring-slate-300"
                    }`}
                    onClick={() => toggleInvoice(invoice.id)}
                  >
                    <CardContent className="flex-row items-center gap-3">
                      <div className="pointer-events-none">
                        <Checkbox
                          checked={checked}
                          aria-label={`เลือก ${invoice.id}`}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{invoice.id}</p>
                        <p className="truncate text-xs text-slate-500">
                          {invoice.customer}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="font-bold tabular-nums">
                          ฿{money(invoice.amount)}
                        </p>
                        <p className="text-xs text-slate-400">{invoice.date}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/90 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-lg">
              <div className="mx-auto max-w-lg space-y-3">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-500">
                      เลือกแล้ว {selected.length} รายการ
                    </p>
                    <p className="text-sm font-semibold">ยอดรวม</p>
                  </div>
                  <span className="text-2xl font-bold text-[#06C755] tabular-nums">
                    ฿{money(total)}
                  </span>
                </div>

                <Button
                  size="lg"
                  className="h-12 w-full rounded-xl bg-[#06C755] text-base hover:bg-[#05b34c]"
                  disabled={selected.length === 0}
                  onClick={() => setPage("confirm")}
                >
                  ดำเนินการต่อ
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <Card className="rounded-2xl border-0 shadow-lg shadow-slate-900/5">
            <CardContent className="space-y-5">
              <div className="flex flex-col items-center gap-2 pt-2 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-green-50 text-[#06C755]">
                  <CheckCircle2 className="size-8" />
                </div>
                <h2 className="text-xl font-bold">ยืนยันรายการบิล</h2>
                <p className="text-sm text-slate-500">
                  ตรวจสอบรายการก่อนยืนยัน ({selected.length} รายการ)
                </p>
              </div>

              <div className="space-y-2 rounded-xl bg-slate-50 p-4">
                {invoices
                  .filter((invoice) => selected.includes(invoice.id))
                  .map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-medium">{invoice.id}</p>
                        <p className="truncate text-xs text-slate-400">
                          {invoice.customer}
                        </p>
                      </div>
                      <span className="tabular-nums">
                        ฿{money(invoice.amount)}
                      </span>
                    </div>
                  ))}

                <Separator className="my-3 border-dashed" />

                <div className="flex items-center justify-between">
                  <span className="font-semibold">ยอดรวม</span>
                  <span className="text-2xl font-bold text-[#06C755] tabular-nums">
                    ฿{money(total)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  size="lg"
                  className="h-12 w-full rounded-xl bg-[#06C755] text-base hover:bg-[#05b34c]"
                  onClick={() => {
                    // Demo only: ยังไม่ส่งข้อมูลไป Backend
                    window.alert(
                      `รายการที่เลือก:\n${selected.join("\n")}\n\nยอดรวม ฿${money(total)}`
                    );
                  }}
                >
                  ยืนยันรายการ (Demo)
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  className="h-12 w-full rounded-xl text-slate-600"
                  onClick={() => setPage("select")}
                >
                  <ArrowLeft data-icon="inline-start" />
                  กลับไปแก้ไข
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default App;
