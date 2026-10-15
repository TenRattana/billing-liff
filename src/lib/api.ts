// ponytail: shape เดาไว้ก่อน หลังบ้านยังไม่มี — ถ้า response จริงต่างจากนี้ แก้ type + parseCustomer ที่ไฟล์นี้ไฟล์เดียว
export type Invoice = {
  id: string;
  amount: number;
  date: string;
};

export type Customer = {
  customer_code: string;
  customer_name: string;
  invoices: Invoice[];
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const API_URL = import.meta.env.VITE_API_URL ?? "";

function parseCustomer(data: unknown): Customer {
  const d = data as Partial<Customer> | null;
  if (
    !d ||
    typeof d.customer_code !== "string" ||
    typeof d.customer_name !== "string" ||
    !Array.isArray(d.invoices) ||
    !d.invoices.every(
      (i) =>
        typeof i?.id === "string" &&
        typeof i.amount === "number" &&
        typeof i.date === "string"
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
