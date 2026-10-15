import { useEffect, useState } from "react";
import liff from "@line/liff";

import {
  ApiError,
  fetchCustomer,
  SCREEN_PARAMS,
  type Customer,
  type ScreenRef,
} from "@/lib/api";
import type { LiffState } from "@/hooks/use-liff";

export type CustomerState =
  | { status: "loading" }
  | { status: "no-customer" }
  | { status: "error"; message: string }
  | { status: "ready"; customer: Customer; screen: ScreenRef };

export function useCustomer(liffState: LiffState, param = "customer_code") {
  const [state, setState] = useState<CustomerState>({ status: "loading" });

  useEffect(() => {
    if (liffState.status === "loading") return;
    if (liffState.status === "error") {
      setState({ status: "error", message: "เชื่อมต่อ LINE ไม่สำเร็จ" });
      return;
    }

    let active = true;

    (async () => {
      // อ่านหลัง init เพราะ LIFF คืน query จริงให้หลัง init เสร็จ
      const query = new URLSearchParams(window.location.search);
      const code = query.get(param)?.trim();
      // ส่งเฉพาะตัวที่มีในลิงก์ ให้ bot ตัดสินเองว่าหมดอายุไหม
      const screen: ScreenRef = Object.fromEntries(
        SCREEN_PARAMS.flatMap((key) => {
          const value = query.get(key);
          return value ? [[key, value]] : [];
        })
      );
      if (!code) {
        setState({ status: "no-customer" });
        return;
      }

      // เปิดจาก browser นอก LINE ยังไม่ login -> ส่งไป login แล้วกลับมาหน้าเดิม (query ติดมาด้วย)
      if (!liff.isLoggedIn()) {
        liff.login({ redirectUri: window.location.href });
        return;
      }

      const idToken = liff.getIDToken();
      if (!idToken) {
        setState({
          status: "error",
          message: "ไม่ได้รับ ID token (ตรวจสอบว่า LIFF เปิด scope openid)",
        });
        return;
      }

      try {
        const customer = await fetchCustomer(code, screen, idToken);
        if (active) setState({ status: "ready", customer, screen });
      } catch (error) {
        // 410: bot ส่งข้อความหมดอายุเข้าแชทแล้ว ปิดกลับไปแชทเลย
        if (error instanceof ApiError && error.status === 410 && liff.isInClient()) {
          liff.closeWindow();
          return;
        }
        if (active) {
          setState({
            status: "error",
            message:
              error instanceof ApiError ? error.message : "โหลดข้อมูลไม่สำเร็จ",
          });
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [liffState.status, param]);

  return state;
}
