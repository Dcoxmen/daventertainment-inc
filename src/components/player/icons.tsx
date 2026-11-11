// Drawn icons for the player. Text symbols like ▶ turn into emoji on some systems.
type IconProps = { className?: string };

export const PlayIcon = ({ className = "size-4" }: IconProps) => (
  <svg viewBox="0 0 16 16" aria-hidden className={className} fill="currentColor">
    <path d="M4 2.5v11l9-5.5z" />
  </svg>
);

export const PauseIcon = ({ className = "size-4" }: IconProps) => (
  <svg viewBox="0 0 16 16" aria-hidden className={className} fill="currentColor">
    <rect x="3.5" y="2.5" width="3" height="11" rx="0.5" />
    <rect x="9.5" y="2.5" width="3" height="11" rx="0.5" />
  </svg>
);

export const NextIcon = ({ className = "size-4" }: IconProps) => (
  <svg viewBox="0 0 16 16" aria-hidden className={className} fill="currentColor">
    <path d="M2 3v10l6-5zM8 3v10l6-5z" />
  </svg>
);

export const PrevIcon = ({ className = "size-4" }: IconProps) => (
  <svg viewBox="0 0 16 16" aria-hidden className={className} fill="currentColor">
    <path d="M14 3v10L8 8zM8 3v10L2 8z" />
  </svg>
);
