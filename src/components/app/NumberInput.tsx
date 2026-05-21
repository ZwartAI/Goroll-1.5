import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  className?: string;
  placeholder?: string;
  allowNegative?: boolean;
};

/**
 * Numeric input that lets the user clear the "0" and type a new value.
 * Internally tracks a string draft so an empty field is allowed while typing;
 * on blur we coerce back to `min` (or 0) if the field stayed empty.
 */
export function NumberInput({ value, onChange, min, max, className, placeholder, allowNegative }: Props) {
  const [draft, setDraft] = useState<string>(String(value ?? 0));

  useEffect(() => {
    const parsed = draft === "" || draft === "-" ? NaN : parseInt(draft, 10);
    if (parsed !== value) setDraft(String(value ?? 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const pattern = allowNegative ? /^-?\d*$/ : /^\d*$/;

  return (
    <input
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      value={draft}
      onFocus={(e) => e.currentTarget.select()}
      onChange={(e) => {
        const s = e.target.value;
        if (!pattern.test(s) && !(allowNegative && s === "-")) return;
        setDraft(s);
        if (s === "" || s === "-") return;
        let n = parseInt(s, 10);
        if (!Number.isFinite(n)) return;
        if (min !== undefined) n = Math.max(min, n);
        if (max !== undefined) n = Math.min(max, n);
        onChange(n);
      }}
      onBlur={(e) => {
        const s = e.target.value;
        if (s === "" || s === "-") {
          const fallback = min ?? 0;
          setDraft(String(fallback));
          onChange(fallback);
        } else {
          let n = parseInt(s, 10);
          if (min !== undefined) n = Math.max(min, n);
          if (max !== undefined) n = Math.min(max, n);
          setDraft(String(n));
          onChange(n);
        }
      }}
      className={cn(
        "w-full bg-secondary/40 border border-border rounded-md px-2 py-1.5 outline-none focus:border-[var(--gold)] text-sm",
        className,
      )}
    />
  );
}
