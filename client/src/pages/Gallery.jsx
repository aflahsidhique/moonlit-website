import { useMemo, useState } from "react";
import PageFx from "../components/ui/PageFx";
import PageHero from "../components/ui/PageHero";
import Img from "../components/ui/Img";
import Lightbox from "../components/ui/Lightbox";

const CATEGORY_META = {
  blood: { label: "Blood Donation", chip: "bg-acc-red" },
  welfare: { label: "Community Welfare", chip: "bg-acc-green" },
  relief: { label: "Disaster Relief", chip: "bg-acc-blue" },
  environment: { label: "Environment", chip: "bg-acc-yellow !text-[#0A1F44]" },
  youth: { label: "Youth Development", chip: "bg-acc-purple" },
};

const FILTERS = [{ key: "all", label: "All" }, ...Object.entries(CATEGORY_META).map(([key, v]) => ({ key, label: v.label }))];

const PHOTOS = [
  { cat: "blood", thumb: "https://images.unsplash.com/photo-1615461066159-fea0960485d5?w=600&q=80", full: "https://images.unsplash.com/photo-1615461066159-fea0960485d5?w=1400&q=85", fallback: "https://placehold.co/600x460/14338C/fff?text=Blood+Donation", caption: "Donor day at the Medical College camp" },
  { cat: "welfare", thumb: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80", full: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1400&q=85", fallback: "https://placehold.co/600x460/14338C/fff?text=Community+Welfare", caption: "Packing monthly grocery kits" },
  { cat: "relief", thumb: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=80", full: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1400&q=85", fallback: "https://placehold.co/600x460/14338C/fff?text=Disaster+Relief", caption: "Boat team during the monsoon floods" },
  { cat: "environment", thumb: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&q=80", full: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=1400&q=85", fallback: "https://placehold.co/600x460/14338C/fff?text=Environment", caption: "Kappad Beach cleanup crew" },
  { cat: "youth", thumb: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80", full: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1400&q=85", fallback: "https://placehold.co/600x460/14338C/fff?text=Youth+Development", caption: "Leadership workshop, Kozhikode" },
  { cat: "youth", thumb: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80", full: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&q=85", fallback: "https://placehold.co/600x460/14338C/fff?text=Youth+Development", caption: "Hands in — annual volunteer meet" },
  { cat: "environment", thumb: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80", full: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1400&q=85", fallback: "https://placehold.co/600x460/14338C/fff?text=Environment", caption: "800 saplings in one morning" },
  { cat: "welfare", thumb: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80", full: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1400&q=85", fallback: "https://placehold.co/600x460/14338C/fff?text=Community+Welfare", caption: "Relief kits reaching elders first" },
  { cat: "youth", thumb: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80", full: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1400&q=85", fallback: "https://placehold.co/600x460/14338C/fff?text=Youth+Development", caption: "The team that started it all" },
  { cat: "welfare", thumb: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=600&q=80", full: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=1400&q=85", fallback: "https://placehold.co/600x460/14338C/fff?text=Community+Welfare", caption: "A smile worth every kilometre" },
  { cat: "blood", thumb: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&q=80", full: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1400&q=85", fallback: "https://placehold.co/600x460/14338C/fff?text=Blood+Donation", caption: "First-time donor, lifelong habit" },
  { cat: "relief", thumb: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80", full: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1400&q=85", fallback: "https://placehold.co/600x460/14338C/fff?text=Disaster+Relief", caption: "Community hands rebuild faster" },
];

export default function Gallery() {
  const [filter, setFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const visible = useMemo(() => (filter === "all" ? PHOTOS : PHOTOS.filter((p) => p.cat === filter)), [filter]);

  return (
    <PageFx>
      <PageHero
        crumb="Gallery"
        eyebrow="Gallery"
        heading={<>Captured Moments of <span className="mf-hl mf-stroke">Hope</span></>}
        description="A look at the hands, faces and moments behind our work across Kerala."
      />

      <section className="max-w-7xl mx-auto px-5 pt-14">
        <div className="flex flex-wrap gap-3 mf-fade">
          {FILTERS.map((f) => (
            <button key={f.key} className={"mf-pill" + (filter === f.key ? " is-active" : "")} onClick={() => { setFilter(f.key); setLightboxIndex(null); }}>{f.label}</button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {visible.map((p, i) => {
            const meta = CATEGORY_META[p.cat];
            return (
              <button key={p.caption} type="button" className="mf-gal-item mf-fade text-left" onClick={() => setLightboxIndex(i)}>
                <Img src={p.thumb} fallback={p.fallback} alt={p.caption} />
                <div className="mf-gal-overlay">
                  <span className={`mf-chip ${meta.chip} self-start mb-2`}>{meta.label}</span>
                  <p className="text-sm font-medium">{p.caption} <i className="fa-solid fa-magnifying-glass-plus ml-2 text-[#F5B921]"></i></p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <Lightbox items={visible} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNav={(i) => setLightboxIndex((i + visible.length) % visible.length)} />
    </PageFx>
  );
}
