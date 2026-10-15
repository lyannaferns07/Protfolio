/**
 * Material Symbols Outlined icon.
 *
 * The icon font is loaded via <link> in index.html. The ligature
 * name is passed as children and substituted by the font at render.
 */
export function Icon({
  name,
  size = 18,
  filled = false,
  weight = 400,
  className,
  style,
}: {
  name: string;
  /** Font size in px */
  size?: number;
  filled?: boolean;
  weight?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined${className ? ` ${className}` : ''}`}
      style={{
        fontSize: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
        ...style,
      }}
    >
      {name}
    </span>
  );
}