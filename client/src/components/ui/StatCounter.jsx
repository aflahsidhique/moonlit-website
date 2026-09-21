// Renders the data-count/data-suffix attributes useScrollFx's GSAP count-up
// effect looks for. Starts at "0" — the hook replaces the text once its
// ScrollTrigger fires. Styled for use inside a .mf-band (see index.css).
export default function StatCounter({ icon, count, suffix = "+", label }) {
  return (
    <div className="text-center px-3 xl:border-l border-white/15">
      <i className={`fa-solid fa-${icon} mf-gold-icon`}></i>
      <p className="mf-stat-num mt-2" data-count={count} data-suffix={suffix}>0</p>
      <p className="mf-stat-label">{label}</p>
    </div>
  );
}
