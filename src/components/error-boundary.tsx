import { Component, type ErrorInfo, type ReactNode } from "react";

type State = { error: Error | null; componentStack: string };

/**
 * แอปล้มระหว่างวาดหน้า: แสดงข้อความ error ให้แคปจอส่งมา แทนจอขาว
 * ใช้ HTML + inline style ล้วน เพื่อให้แสดงได้แม้ component หรือ CSS ของแอปพัง
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null, componentStack: "" };

  static getDerivedStateFromError(error: unknown): Partial<State> {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error(error);
    this.setState({ componentStack: info.componentStack ?? "" });
  }

  render() {
    const { error, componentStack } = this.state;
    if (!error) return this.props.children;

    const detail = [
      `${error.name}: ${error.message}`,
      ...(error.stack ?? "").split("\n").slice(1, 7),
      ...componentStack.trim().split("\n").slice(0, 6),
      navigator.userAgent,
    ].join("\n");

    return (
      <div style={{ padding: 16, fontFamily: "sans-serif", color: "#0f172a" }}>
        <p style={{ fontSize: 18, fontWeight: 700, margin: "8px 0" }}>เกิดข้อผิดพลาด</p>
        <p style={{ fontSize: 14, margin: "0 0 12px" }}>
          กรุณาแคปหน้าจอนี้ส่งให้ผู้ดูแลระบบ แล้วกด "ลองใหม่"
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            fontSize: 16,
            borderRadius: 10,
            border: 0,
            background: "#06c755",
            color: "#fff",
          }}
        >
          ลองใหม่
        </button>
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            fontSize: 11,
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
            background: "#f1f5f9",
            borderRadius: 8,
          }}
        >
          {detail}
        </pre>
      </div>
    );
  }
}
