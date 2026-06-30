import { Link } from "@/lib/i18n/routing";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className ?? ""}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="shrink-0"
      >
        <path
          d="M8 32V8L20 8C26 8 30 12 30 18C30 22 27.5 25.5 24 27L32 32H24L18 28.5V32H8Z"
          fill="#C9A227"
        />
        <path
          d="M14 14V26H18.5C21.5 26 23.5 24 23.5 20C23.5 16 21.5 14 18.5 14H14Z"
          fill="#000A1A"
        />
        <path
          d="M22 8L32 8V14H26L22 11V8Z"
          fill="#3B82F6"
        />
        <path
          d="M26 18H32V24H28L26 22.5V18Z"
          fill="#FFFFFF"
          fillOpacity="0.9"
        />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-wide text-white">RSC</span>
        <span className="mt-0.5 text-[9px] font-medium tracking-[0.18em] text-white/70 uppercase">
          Economia Global
        </span>
      </div>
    </Link>
  );
}
