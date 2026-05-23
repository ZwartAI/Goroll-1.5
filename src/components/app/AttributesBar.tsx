import { useT } from "@/lib/i18n";
import { fmtMod, modifier } from "@/lib/game";
import attrEs from "@/assets/attributes-es.png";
import attrEn from "@/assets/attributes-en.png";

type Char = {
  fue: number; des: number; con: number; int_stat: number; wis: number; car: number;
};

const ATTRS = [
  { k: "fue",      color: "var(--stat-fue)", esLabel: "Fuerza",       enLabel: "Strength" },
  { k: "des",      color: "var(--stat-des)", esLabel: "Destreza",     enLabel: "Dexterity" },
  { k: "con",      color: "var(--stat-con)", esLabel: "Constitución", enLabel: "Constitution" },
  { k: "int_stat", color: "var(--stat-int)", esLabel: "Inteligencia", enLabel: "Intelligence" },
  { k: "wis",      color: "var(--stat-sab)", esLabel: "Sabiduría",    enLabel: "Wisdom" },
  { k: "car",      color: "var(--stat-car)", esLabel: "Carisma",      enLabel: "Charisma" },
] as const;

export function AttributesBar({ character }: { character: Char }) {
  const { t, lang } = useT();
  const asset = lang === "en" ? attrEn : attrEs;

  return (
    <div className="mb-3">
      <h2 className="font-display text-xs uppercase tracking-widest text-center mb-2 text-[var(--gold)]">
        {t("profile.attributes")}
      </h2>
      <div className="relative w-full select-none" style={{ WebkitUserSelect: "none", userSelect: "none" }}>
        <img
          src={asset}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="w-full h-auto block pointer-events-none select-none"
        />
        <div
          className="absolute inset-x-0 grid grid-cols-6"
          style={{ top: "62%", transform: "translateY(-50%)" }}
        >
          {ATTRS.map(({ k, color, esLabel, enLabel }) => {
            const v = (character as any)[k] as number;
            const mod = fmtMod(modifier(v));
            const label = lang === "en" ? enLabel : esLabel;
            const aria = lang === "en"
              ? `${label} modifier ${mod}`
              : `${label} modificador ${mod}`;
            return (
              <button
                key={k}
                type="button"
                aria-label={aria}
                className="flex items-center justify-center font-display font-bold leading-none transition-transform duration-100 ease-out active:scale-[0.92] active:translate-y-px focus:outline-none"
                style={{
                  color,
                  fontSize: "clamp(1.4rem, 5.5vw, 2.6rem)",
                  textShadow: `0 0 10px color-mix(in oklab, ${color} 55%, transparent), 0 0 2px color-mix(in oklab, ${color} 80%, transparent)`,
                  WebkitUserSelect: "none",
                  userSelect: "none",
                  WebkitTapHighlightColor: "transparent",
                  touchAction: "manipulation",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                }}
              >
                <span className="pointer-events-none">{mod}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
