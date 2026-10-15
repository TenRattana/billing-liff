export const formatMoney = (value: number) =>
  `฿${value.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/** "2026-08-01" -> "01-08-2026" (รูปแบบอื่นคืนค่าเดิม) */
export const formatDate = (iso: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : iso;
};
