// Swaps to a fallback image on load error — replaces the legacy site's
// global `img[data-fb]` error-listener delegation (assets/main.js) with a
// plain per-element handler, the React-idiomatic equivalent.
export default function Img({ src, fallback, alt = "", className, ...rest }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        if (fallback && e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
      }}
      {...rest}
    />
  );
}
