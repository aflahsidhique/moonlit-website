import StatCounter from "./StatCounter";

const STATS = [
  { icon: "users", count: 2000, label: <>Volunteers<br />Engaged</> },
  { icon: "droplet", count: 800, label: <>Blood Donors<br />Registered</> },
  { icon: "hand-holding-heart", count: 1000, label: <>Families<br />Supported</> },
  { icon: "box-open", count: 120, label: <>Relief<br />Campaigns</> },
  { icon: "leaf", count: 1000, label: <>Trees<br />Planted</> },
  { icon: "location-dot", count: 30, label: <>Communities<br />Reached</> },
];

// The "Our Impact" counter band reused on Home, Programs and Get Involved —
// same six live-counted stats, wrapped by the caller's own <section> for
// padding. `compact` drops the "Our Impact" heading column (Get Involved's
// version is just the bare stat grid).
export default function ImpactBand({ spark = true, compact = false }) {
  const grid = (
    <div className={"grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-y-8" + (compact ? " xl:[&>*:first-child]:border-0" : " flex-1 w-full")}>
      {STATS.map((s) => <StatCounter key={s.icon} {...s} />)}
    </div>
  );

  if (compact) return <div className="mf-band px-8 py-10">{grid}</div>;

  return (
    <div className="mf-band px-8 py-10 flex flex-col xl:flex-row gap-10 items-center">
      <div className="min-w-[220px]">
        <p className="text-xs tracking-widest uppercase text-[#c9d4ee] mb-2">Our Impact</p>
        <h2 className="text-2xl leading-snug">Creating change<br />that <span className="mf-hl mf-stroke">matters</span></h2>
        <p className="text-xs text-[#c9d4ee] mt-3">Real people. Real impact. {spark && <i className="fa-solid fa-arrow-turn-up mf-spark ml-1"></i>}</p>
      </div>
      {grid}
    </div>
  );
}
