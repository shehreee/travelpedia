type Props = {
  src: string | null | undefined;
  alt: string;
  sizeClass?: string;
};

export function HutProfilePhoto({ src, alt, sizeClass = "h-28 w-28 sm:h-36 sm:w-36" }: Props) {
  if (src?.trim()) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src.trim()}
        alt={alt}
        className={`${sizeClass} shrink-0 rounded-2xl border border-tp-border object-cover shadow-sm`}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-2xl border border-dashed border-tp-border bg-tp-surface text-sm font-semibold text-tp-muted`}
      aria-hidden
    >
      Logo
    </div>
  );
}
