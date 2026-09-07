import { useId } from "react";

type WormProps = {
  className?: string;
  pose?: "desk" | "polaroid" | "wave" | "logo";
};

export function Worm({ className = "", pose = "desk" }: WormProps) {
  const uid = useId().replace(/:/g, "");
  const body = `${uid}-body`;
  const shine = `${uid}-shine`;

  return (
    <svg
      viewBox={pose === "logo" ? "40 0 200 200" : "0 0 280 240"}
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id={body} x1="40" y1="40" x2="220" y2="220">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="55%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>
        <linearGradient id={shine} x1="80" y1="30" x2="140" y2="120">
          <stop offset="0%" stopColor="#F5F3FF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#F5F3FF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {pose === "logo" ? (
        <>
          <circle cx="140" cy="118" r="78" fill={`url(#${body})`} />
          <ellipse cx="118" cy="92" rx="22" ry="14" fill={`url(#${shine})`} />
          <path
            d="M112 52c-10-28-2-42 12-44"
            stroke="#7C3AED"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M164 48c8-30 24-40 36-34"
            stroke="#7C3AED"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx="124" cy="10" r="10" fill="#C4B5FD" />
          <circle cx="202" cy="16" r="10" fill="#C4B5FD" />
          <circle cx="118" cy="114" r="16" fill="white" />
          <circle cx="162" cy="112" r="16" fill="white" />
          <circle cx="122" cy="117" r="8" fill="#0F172A" />
          <circle cx="166" cy="115" r="8" fill="#0F172A" />
          <circle cx="125" cy="114" r="2.4" fill="white" />
          <circle cx="169" cy="112" r="2.4" fill="white" />
          <path
            d="M128 142c10 12 24 12 34 0"
            stroke="#4C1D95"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="100" cy="136" r="6" fill="#F9A8D4" opacity="0.85" />
        </>
      ) : (
        <>
          {pose === "desk" && (
            <>
              <ellipse cx="150" cy="226" rx="86" ry="9" fill="#CBD5E1" opacity="0.45" />
              <rect x="78" y="148" width="148" height="68" rx="14" fill="#1E293B" />
              <rect x="88" y="158" width="128" height="40" rx="8" fill="#0F172A" />
              <path d="M128 198h48l10 20H118l10-20Z" fill="#334155" />
              <text
                x="124"
                y="184"
                fill="#F8FAFC"
                fontSize="18"
                fontWeight="700"
                fontFamily="ui-monospace, monospace"
              >
                {"</>"}
              </text>
            </>
          )}

          <ellipse cx="168" cy="148" rx="34" ry="22" fill={`url(#${body})`} />
          <ellipse cx="132" cy="136" rx="30" ry="24" fill={`url(#${body})`} />
          <ellipse cx="102" cy="118" rx="28" ry="26" fill={`url(#${body})`} />
          <circle cx="88" cy="78" r="42" fill={`url(#${body})`} />
          <ellipse cx="74" cy="62" rx="16" ry="10" fill={`url(#${shine})`} />

          <path
            d="M70 42c-8-22-2-34 8-36"
            stroke="#7C3AED"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M102 38c6-24 18-32 28-28"
            stroke="#7C3AED"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="78" cy="8" r="7" fill="#C4B5FD" />
          <circle cx="132" cy="10" r="7" fill="#C4B5FD" />

          <circle cx="76" cy="76" r="10" fill="white" />
          <circle cx="104" cy="74" r="10" fill="white" />
          <circle cx="78" cy="78" r="5" fill="#0F172A" />
          <circle cx="106" cy="76" r="5" fill="#0F172A" />
          <circle cx="80" cy="76" r="1.6" fill="white" />
          <circle cx="108" cy="74" r="1.6" fill="white" />
          <ellipse cx="76" cy="76" rx="13" ry="11" stroke="#1E1B4B" strokeWidth="2.4" />
          <ellipse cx="104" cy="74" rx="13" ry="11" stroke="#1E1B4B" strokeWidth="2.4" />
          <path d="M89 75h2.5" stroke="#1E1B4B" strokeWidth="2.2" />
          <path
            d="M84 94c6 8 16 8 22 0"
            stroke="#4C1D95"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="68" cy="90" r="4" fill="#F9A8D4" opacity="0.8" />

          {pose === "wave" && (
            <path
              d="M178 128c18-18 36-8 34 8"
              stroke={`url(#${body})`}
              strokeWidth="16"
              strokeLinecap="round"
            />
          )}

          {pose === "polaroid" && (
            <>
              <rect x="196" y="86" width="28" height="38" rx="6" fill="#86EFAC" />
              <circle cx="210" cy="78" r="10" fill="#FDE68A" />
              <path d="M210 70v-10M202 74l-8-6M218 74l8-6" stroke="#F59E0B" strokeWidth="2" />
            </>
          )}
        </>
      )}
    </svg>
  );
}
