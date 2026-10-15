export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" aria-hidden="true" focusable="false">
      <path
        d="M1.5 6h8.2M6.3 2.4 10 6l-3.7 3.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 15 13" aria-hidden="true" focusable="false">
      <path
        d="M7.5 1v10.2M3.3 7.3 7.5 11.5l4.2-4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M5 12.5 10 17.5 19 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <rect x="6" y="6" width="9.5" height="9.5" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 3.6A2.1 2.1 0 0 0 9.9 2H4.6A2.1 2.1 0 0 0 2.5 4.1v5.3c0 .9.55 1.67 1.34 1.98"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Brand glyphs, drawn inline so they inherit `currentColor` like the reference's masks. */
const PATHS: Record<string, string> = {
  instagram:
    'M8 1.5c2.1 0 2.4 0 3.2.05.83.04 1.34.17 1.78.36.46.18.8.4 1.15.74.35.35.56.7.74 1.14.19.45.32.96.36 1.79.05.8.05 1.05.05 3.17s0 2.37-.05 3.17c-.04.83-.17 1.34-.36 1.79-.18.45-.4.8-.74 1.14-.35.35-.7.56-1.15.74-.44.19-.95.32-1.78.36-.8.05-1.04.05-3.17.05s-2.37 0-3.17-.05c-.83-.04-1.34-.17-1.79-.36a3.1 3.1 0 0 1-1.14-.74 3.1 3.1 0 0 1-.74-1.14c-.19-.45-.32-.96-.36-1.79C1.55 11.87 1.5 11.62 1.5 9.5s0-2.37.05-3.17c.04-.83.17-1.34.36-1.79.18-.45.4-.8.74-1.14.35-.35.7-.56 1.15-.74.44-.19.95-.32 1.78-.36C5.63 1.55 5.9 1.5 8 1.5Zm0 4.09a3.41 3.41 0 1 0 0 6.82 3.41 3.41 0 0 0 0-6.82Zm0 5.62a2.21 2.21 0 1 1 0-4.42 2.21 2.21 0 0 1 0 4.42Zm4.33-5.76a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0Z',
  pinterest:
    'M8 0a8 8 0 0 0-3.04 15.4c-.07-.63-.13-1.6.03-2.29.14-.62.9-3.95.9-3.95s-.23-.46-.23-1.14c0-1.07.62-1.87 1.39-1.87.66 0 .97.49.97 1.08 0 .66-.42 1.64-.63 2.55-.18.77.38 1.39 1.14 1.39 1.37 0 2.42-1.44 2.42-3.53 0-1.85-1.33-3.14-3.22-3.14-2.2 0-3.48 1.64-3.48 3.34 0 .66.25 1.37.57 1.75.06.08.07.14.05.22l-.22.9c-.03.13-.13.16-.25.1-1.01-.47-1.64-1.94-1.64-3.12 0-2.53 1.84-4.86 5.3-4.86 2.78 0 4.94 1.98 4.94 4.63 0 2.76-1.74 4.98-4.16 4.98-.81 0-1.58-.42-1.84-.92l-.5 1.91c-.18.7-.67 1.58-1 2.11A8 8 0 1 0 8 0Z',
  x: 'M9.53 6.77 15.5 0h-1.4L8.9 5.9 4.77 0H.17l6.27 8.9L.17 16h1.4l5.5-6.24L11.8 16h4.6L9.53 6.77Zm-1.95 2.22-.64-.89L1.9 1h2.2l4.09 5.68.64.9 5.32 7.5h-2.2L7.58 9Z',
};

export function SocialIcon({ id, className }: { id: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d={PATHS[id] ?? ''} fill="currentColor" />
    </svg>
  );
}