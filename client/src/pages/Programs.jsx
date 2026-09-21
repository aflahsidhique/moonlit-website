import PageFx from "../components/ui/PageFx";
import PageHero from "../components/ui/PageHero";
import ProgramCard from "../components/ui/ProgramCard";
import ProgramDetail from "../components/ui/ProgramDetail";
import ImpactBand from "../components/ui/ImpactBand";

const OVERVIEW = [
  { image: "https://images.unsplash.com/photo-1615461066159-fea0960485d5?w=600&q=80", fallback: "https://placehold.co/600x400/14338C/fff?text=Blood+Donation", alt: "Blood donation camp in progress", icon: "droplet", accent: "red", title: "Blood Donation", description: "A single unit of blood can save up to three lives.", to: "/programs#blood" },
  { image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80", fallback: "https://placehold.co/600x400/14338C/fff?text=Community+Welfare", alt: "Volunteers packing food kits", icon: "people-group", accent: "green", title: "Community Welfare", description: "Hardship rarely announces itself.", to: "/programs#welfare" },
  { image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=80", fallback: "https://placehold.co/600x400/14338C/fff?text=Disaster+Relief", alt: "Rescue boat during flood response", icon: "shield-halved", accent: "blue", title: "Disaster Relief", description: "When floods or emergencies strike, hours matter.", to: "/programs#relief" },
  { image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&q=80", fallback: "https://placehold.co/600x400/14338C/fff?text=Environment", alt: "Volunteers cleaning a beach", icon: "leaf", accent: "yellow", title: "Environment", description: "We protect the Kerala we love — one sapling, one cleaned beach, one aware classroom at a time.", to: "/programs#environment" },
  { image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80", fallback: "https://placehold.co/600x400/14338C/fff?text=Youth+Development", alt: "Students in a leadership workshop", icon: "graduation-cap", accent: "purple", title: "Youth Development", description: "Every program we run is powered by young people — so we invest in them.", to: "/programs#youth" },
];

export default function Programs() {
  return (
    <PageFx>
      <PageHero
        crumb="Programs"
        eyebrow="What We Do"
        heading={<>Programs that create <span className="mf-hl mf-stroke">Impact</span></>}
        description="Five focused programs, one goal — meaningful, lasting change for the communities of Kerala."
      />

      {/* OVERVIEW GRID */}
      <section className="max-w-7xl mx-auto px-5 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {OVERVIEW.map((p) => <ProgramCard key={p.title} {...p} />)}
        </div>
      </section>

      <ProgramDetail
        id="blood" accent="red" eyebrow="Blood Donation Program" titleLead="Blood" titleHighlight="Donation"
        image="https://images.unsplash.com/photo-1615461066159-fea0960485d5?w=1000&q=80" fallback="https://placehold.co/900x700/14338C/fff?text=Blood+Donation" alt="Blood donation camp in progress"
        description="A single unit of blood can save up to three lives. Our donor network connects hospitals and families with verified, willing donors — often within hours of a request."
        checklist={["Donor registration drives in colleges and workplaces", "24/7 emergency donor response network across districts", "Blood group awareness camps and donor health checks"]}
        stats={[{ icon: "droplet", value: "1800+", label: "Donors Registered" }, { icon: "heart-pulse", value: "950+", label: "Emergency Requests Met" }]}
      />
      <ProgramDetail
        id="welfare" reverse accent="green" eyebrow="Community Welfare Program" titleLead="Community" titleHighlight="Welfare"
        image="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1000&q=80" fallback="https://placehold.co/900x700/14338C/fff?text=Community+Welfare" alt="Volunteers packing food kits"
        description="Hardship rarely announces itself. Our welfare wing runs steady, year-round support — food kits, clothing drives and education help for families working through difficult times."
        checklist={["Monthly food and grocery kit distribution", "Cloth donation drives with dignity-first distribution", "School kit and fee support for children in need"]}
        stats={[{ icon: "hand-holding-heart", value: "3500+", label: "Families Supported" }, { icon: "box-open", value: "120+", label: "Relief Campaigns" }]}
      />
      <ProgramDetail
        id="relief" accent="blue" eyebrow="Disaster Relief Program" titleLead="Disaster" titleHighlight="Relief"
        image="https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1000&q=80" fallback="https://placehold.co/900x700/14338C/fff?text=Disaster+Relief" alt="Rescue boat during flood response"
        description="When floods or emergencies strike, hours matter. Our trained response teams mobilize relief kits, shelter support and cleanup crews — then stay for the rebuilding."
        checklist={["Rapid-response relief kits: food, water, medicine, essentials", "Temporary shelter coordination with local authorities", "Post-disaster cleanup and home rebuilding support"]}
        stats={[{ icon: "truck-fast", value: "48hr", label: "Average Response Time" }, { icon: "house-chimney-crack", value: "30+", label: "Rebuilds Supported" }]}
      />
      <ProgramDetail
        id="environment" reverse accent="yellow" ctaDark eyebrow="Environment Program" titleLead="Environment" titleHighlight="Drives"
        image="https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=1000&q=80" fallback="https://placehold.co/900x700/14338C/fff?text=Environment" alt="Volunteers cleaning a beach"
        description="We protect the Kerala we love — one sapling, one cleaned beach, one aware classroom at a time. Our green drives pair action with education so the change outlives the event."
        checklist={["Tree plantation drives with schools and residents' groups", "Coastal and river cleanup campaigns", "Waste segregation and plastic-free awareness sessions"]}
        stats={[{ icon: "leaf", value: "5000+", label: "Trees Planted" }, { icon: "water", value: "40+", label: "Cleanup Drives" }]}
      />
      <ProgramDetail
        id="youth" accent="purple" eyebrow="Youth Development Program" titleLead="Youth" titleHighlight="Development"
        image="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1000&q=80" fallback="https://placehold.co/900x700/14338C/fff?text=Youth+Development" alt="Students in a leadership workshop"
        description="Every program we run is powered by young people — so we invest in them. Leadership camps, skill workshops and mentorship turn first-time volunteers into community organizers."
        checklist={["Leadership and public-speaking workshops", "Career and skill-development mentorship", "Campus volunteer chapters in colleges across Kerala"]}
        stats={[{ icon: "users", value: "2500+", label: "Volunteers Engaged" }, { icon: "chalkboard-user", value: "85+", label: "Workshops Conducted" }]}
      />

      {/* IMPACT STRIP */}
      <section className="max-w-7xl mx-auto px-5 py-16 mf-fade">
        <ImpactBand spark={false} />
      </section>
    </PageFx>
  );
}
