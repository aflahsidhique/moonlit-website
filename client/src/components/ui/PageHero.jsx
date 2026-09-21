import { Link } from "react-router-dom";

// The inner-page hero banner reused (with different copy) across About,
// Programs, Events, Gallery, Get Involved and Contact.
export default function PageHero({ crumb, eyebrow, heading, description }) {
  return (
    <section className="mf-page-hero py-14 lg:py-20 relative overflow-hidden">
      <div className="mf-dots absolute top-8 right-8 hidden lg:block" aria-hidden="true"></div>
      <div className="max-w-7xl mx-auto px-5">
        <p className="mf-crumb mb-4"><Link to="/">Home</Link> &nbsp;/&nbsp; {crumb}</p>
        <p className="mf-eyebrow mb-3">{eyebrow}</p>
        <h1 className="text-4xl md:text-5xl max-w-2xl">{heading}</h1>
        <div className="mf-divider my-6"></div>
        {description && <p className="max-w-xl text-[15px]">{description}</p>}
      </div>
    </section>
  );
}
