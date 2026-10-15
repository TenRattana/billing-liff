import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/action-button";
import { BottomBar } from "@/components/bottom-bar";
import { Panel, PanelContent } from "@/components/panel";
import { ProfileCard } from "@/components/profile-card";
import { SectionHeader } from "@/components/section-header";
import { SegmentedControl } from "@/components/segmented-control";
import { SelectableCard } from "@/components/selectable-card";
import { TotalRow } from "@/components/total-row";
import type { useSelection } from "@/hooks/use-selection";
import type { Customer } from "@/lib/api";
import { formatMoney } from "@/lib/format";

const MODE_OPTIONS = [
  { value: "single", label: "เลือกบิลเดียว" },
  { value: "multiple", label: "เลือกหลายบิล" },
] as const;

type SelectInvoicesPageProps = {
  customer: Customer;
  selection: ReturnType<typeof useSelection>;
  total: number;
  onNext: () => void;
};

export function SelectInvoicesPage({
  customer,
  selection,
  total,
  onNext,
}: SelectInvoicesPageProps) {
  const { invoices } = customer;

  return (
    <>
      <Panel>
        <PanelContent className="space-y-4">
          <ProfileCard
            title={customer.customer_name}
            description={`รหัสลูกค้า ${customer.customer_code}`}
          />

          <div>
            <h2 className="text-xl font-bold">เลือกบิลที่ต้องการส่ง</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              เลือกรายการใบแจ้งหนี้เพื่อดำเนินการต่อ
            </p>
          </div>

          <SegmentedControl
            value={selection.mode}
            onValueChange={selection.setMode}
            options={MODE_OPTIONS}
          />
        </PanelContent>
      </Panel>

      <SectionHeader
        title="รายการใบแจ้งหนี้"
        count={invoices.length}
        action={
          selection.mode === "multiple" &&
          invoices.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-line hover:bg-green-50 hover:text-line-dark"
              onClick={selection.toggleAll}
            >
              {selection.allSelected ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด"}
            </Button>
          )
        }
      />

      {invoices.length === 0 ? (
        <p className="rounded-2xl bg-white py-8 text-center text-sm text-slate-400">
          ไม่มีใบแจ้งหนี้
        </p>
      ) : (
        <div className="space-y-2">
          {invoices.map((invoice) => (
            <SelectableCard
              key={invoice.id}
              checked={selection.isSelected(invoice.id)}
              onClick={() => selection.toggle(invoice.id)}
              label={`เลือก ${invoice.id}`}
              title={invoice.id}
              description={`วันที่ ${invoice.date}`}
              trailing={
                <p className="font-bold tabular-nums">
                  {formatMoney(invoice.amount)}
                </p>
              }
            />
          ))}
        </div>
      )}

      <BottomBar>
        <TotalRow
          amount={total}
          hint={`เลือกแล้ว ${selection.selected.length} รายการ`}
        />
        <ActionButton
          disabled={selection.selected.length === 0}
          onClick={onNext}
        >
          ดำเนินการต่อ
          <ArrowRight data-icon="inline-end" />
        </ActionButton>
      </BottomBar>
    </>
  );
}
