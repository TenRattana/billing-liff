export const formatMoney = (value: number) =>
  `฿${value.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/** "2026-08-01" -> "1 ส.ค. 2569" */
export const formatDate = (iso: string) => {
  const date = new Date(`${iso}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
};
