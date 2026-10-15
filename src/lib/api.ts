// ตรงกับ GET /api/liff/customer ใน line-billing-bot (app/routes/liff.py) — ใส่เฉพาะ field ที่หน้าเว็บใช้
export type Invoice = {
  invoice_no: string;
  invoice_date: string; // YYYY-MM-DD
  due_date: string; // YYYY-MM-DD
  amount: number;
  outstanding: number; // ยอดค้างชำระ
  days_overdue: number;
};

export type Customer = {
  customer_code: string;
  customer_name: string;
  total_outstanding: number;
  invoices: Invoice[];
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// bot อยู่หลัง /line-oa-test/ บน domain เดียวกัน (nginx ตัด prefix ให้)
const API_URL = import.meta.env.VITE_API_URL ?? "/line-oa-test";

function parseCustomer(data: unknown): Customer {
  const d = data as Partial<Customer> | null;
  if (
    !d ||
    typeof d.customer_code !== "string" ||
    typeof d.customer_name !== "string" ||
    typeof d.total_outstanding !== "number" ||
    !Array.isArray(d.invoices) ||
    !d.invoices.every(
      (i) =>
        typeof i?.invoice_no === "string" &&
        typeof i.invoice_date === "string" &&
        typeof i.due_date === "string" &&
        typeof i.amount === "number" &&
        typeof i.outstanding === "number" &&
        typeof i.days_overdue === "number"
    )
  ) {
    throw new ApiError(0, "รูปแบบข้อมูลจากเซิร์ฟเวอร์ไม่ถูกต้อง");
  }
  return d as Customer;
}

export async function fetchCustomer(
  customerCode: string,
  idToken: string
): Promise<Customer> {
  const res = await fetch(
    `${API_URL}/api/liff/customer?customer_code=${encodeURIComponent(customerCode)}`,
    { headers: { Authorization: `Bearer ${idToken}` } }
  );

  if (!res.ok) {
    const message =
      res.status === 404
        ? "ไม่พบข้อมูลลูกค้า"
        : res.status === 401 || res.status === 403
          ? "ไม่มีสิทธิ์เข้าถึงข้อมูลลูกค้านี้"
          : "โหลดข้อมูลไม่สำเร็จ";
    throw new ApiError(res.status, message);
  }

  return parseCustomer(await res.json());
}
