import { useState } from "react";

export type SelectionMode = "single" | "multiple";

export function useSelection(
  ids: string[],
  initialMode: SelectionMode = "multiple"
) {
  const [mode, setModeState] = useState<SelectionMode>(initialMode);
  const [selected, setSelected] = useState<string[]>([]);

  const isSelected = (id: string) => selected.includes(id);
  const allSelected = ids.length > 0 && ids.every(isSelected);

  const toggle = (id: string) => {
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

  const toggleAll = () => setSelected(allSelected ? [] : ids);

  // เปลี่ยนโหมดแล้วล้างที่เลือกไว้
  const setMode = (next: SelectionMode) => {
    setModeState(next);
    setSelected([]);
  };

  return {
    mode,
    setMode,
    selected,
    isSelected,
    allSelected,
    toggle,
    toggleAll,
    clear: () => setSelected([]),
  };
}
