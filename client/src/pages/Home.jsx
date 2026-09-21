import { Link } from "react-router-dom";
import PageFx from "../components/ui/PageFx";
import Button from "../components/ui/Button";
import Img from "../components/ui/Img";
import ProgramCard from "../components/ui/ProgramCard";
import ImpactBand from "../components/ui/ImpactBand";
import TestimonialCarousel from "../components/ui/TestimonialCarousel";

const PROGRAMS = [
  { image: "https://images.unsplash.com/photo-1615461066159-fea0960485d5?w=600&q=80", fallback: "https://placehold.co/600x400/DC2626/fff?text=Blood+Donation", alt: "Blood donation drive", icon: "droplet", accent: "red", title: "Blood Donation", description: "Organizing blood donation drives and saving lives across communities.", to: "/programs#blood" },
  { image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80", fallback: "https://placehold.co/600x400/16A34A/fff?text=Community+Welfare", alt: "Volunteers distributing food and clothes", icon: "people-group", accent: "green", title: "Community Welfare", description: "Cloth donations, food distribution and supporting those in need.", to: "/programs#welfare" },
  { image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=80", fallback: "https://placehold.co/600x400/2563EB/fff?text=Disaster+Relief", alt: "Rescue boat during flood relief", icon: "shield-halved", accent: "blue", title: "Disaster Relief", description: "Immediate relief and rehabilitation support during emergencies.", to: "/programs#relief" },
  { image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=600&q=80", fallback: "https://placehold.co/600x400/F5B921/0A1F44?text=Environment", alt: "Beach cleanup volunteers", icon: "leaf", accent: "yellow", title: "Environment", description: "Cleanliness drives, tree plantation and environmental awareness.", to: "/programs#environment" },
  { image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80", fallback: "https://placehold.co/600x400/7C3AED/fff?text=Youth+Development", alt: "Youth leadership workshop", icon: "graduation-cap", accent: "purple", title: "Youth Development", description: "Empowering youth through leadership and skill development.", to: "/programs#youth" },
];

const TESTIMONIALS = [
  { img: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=600&q=80", fallback: "https://placehold.co/600x400/14338C/fff?text=Story", alt: "Smiling boy in a red shirt", quote: "Thanks to the blood donors, my son got a second chance at life.", name: "Ramesh, Father" },
  { img: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80", fallback: "https://placehold.co/600x400/14338C/fff?text=Story", alt: "Volunteer handing relief supplies to an elderly woman", quote: "Moonlit Foundation supported us when we had lost everything.", name: "Anitha, Flood Survivor" },
  { img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80", fallback: "https://placehold.co/600x400/16A34A/fff?text=Story", alt: "Hands planting a sapling in dark soil", quote: "They didn't just plant trees, they planted hope for our future.", name: "Volunteer" },
];

export default function Home() {
  return (
    <PageFx>
      {/* SECTION 1 — HERO */}
      <section className="overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-[55%_45%] items-center gap-10 py-14 lg:py-20">
          <div className="mf-fade">
            {/* <p className="mf-eyebrow mb-4">Together, We Create Hope</p> */}
            <h1 className="text-4xl md:text-5xl xl:text-[3.4rem] relative">
              Travel with Volunteering – <span className="mf-hl">An Initiative by Young Minds</span>
              <i className="fa-solid fa-star-of-life mf-spark absolute -right-2 top-2 text-xl hidden md:inline"></i>
            </h1>
            <div className="mf-divider my-6"></div>
            <p className="max-w-md text-[15px] leading-relaxed">Moonlit Foundation is a youth-led nonprofit organization committed to empowering communities through compassion, action, and sustainable change.</p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Button to="/get-involved#volunteer" variant="primary" icon="arrow-right">Join as a Volunteer</Button>
              <Button to="/get-involved#blood" variant="red" icon="droplet" iconPosition="left">Request for Blood</Button>
            </div>
            <div className="mt-9">
              <p className="text-xs font-medium mb-3 text-[#111827]">Trusted by people across Kerala</p>
              <div className="flex items-center gap-4">
                <div className="flex">
                  <Img className="mf-avatar" src="https://randomuser.me/api/portraits/men/32.jpg" fallback="https://placehold.co/88x88/14338C/fff?text=M" alt="Volunteer" />
                  <Img className="mf-avatar" src="https://randomuser.me/api/portraits/women/44.jpg" fallback="https://placehold.co/88x88/F5B921/0A1F44?text=M" alt="Volunteer" />
                  <Img className="mf-avatar" src="https://randomuser.me/api/portraits/men/54.jpg" fallback="https://placehold.co/88x88/14338C/fff?text=M" alt="Volunteer" />
                  <Img className="mf-avatar" src="https://randomuser.me/api/portraits/women/68.jpg" fallback="https://placehold.co/88x88/F5B921/0A1F44?text=M" alt="Volunteer" />
                  <Img className="mf-avatar" src="https://randomuser.me/api/portraits/men/76.jpg" fallback="https://placehold.co/88x88/14338C/fff?text=M" alt="Volunteer" />
                </div>
                <span className="bg-[#F5B921] text-[#0A1F44] font-bold text-sm px-3 py-1.5 rounded-full">500+</span>
                <span className="text-sm font-medium text-[#111827]">Volunteers</span>
              </div>
            </div>
          </div>

          <div className="relative mf-fade">
            <div className="mf-blob-frame">
              <div className="mf-blob relative h-[320px] md:h-[430px]">
                <Img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1000&q=80" fallback="https://placehold.co/900x700/14338C/fff?text=Moonlit+Volunteers" alt="Moonlit Foundation volunteers standing together facing the hills" />
              </div>
            </div>
            <div className="mf-dots absolute -bottom-4 -left-4 hidden md:block" aria-hidden="true"></div>
            <div className="mf-badge-circle absolute -bottom-8 right-4">Be the<span className="mf-hl">Change</span><i className="fa-solid fa-heart text-[#14338C] mt-1"></i></div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — IMPACT STATS STRIP */}
      <section className="max-w-7xl mx-auto px-5 mt-8 mf-fade">
        <ImpactBand />
      </section>

      {/* SECTION 3 — PROGRAMS */}
      <section className="max-w-7xl mx-auto px-5 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 items-end mb-12 mf-fade">
          <div>
            <p className="mf-eyebrow mb-3">What We Do</p>
            <h2 className="text-3xl md:text-4xl">Programs that<br />create <span className="mf-hl mf-stroke">Impact</span></h2>
          </div>
          <div className="lg:text-right">
            <p className="max-w-sm lg:ml-auto text-[15px] mb-5">From saving lives to empowering youth, our programs are designed to bring meaningful change to society.</p>
            <Button to="/programs" variant="outline" icon="arrow-right">Explore All Programs</Button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {PROGRAMS.map((p) => <ProgramCard key={p.title} {...p} />)}
        </div>
      </section>

      {/* SECTION 4 — TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-5 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-[32%_68%] gap-10 items-start">
          <div className="mf-fade">
            <p className="mf-eyebrow mb-3">Stories of Change</p>
            <h2 className="text-3xl md:text-4xl">Real Stories.<br />Real <span className="mf-hl mf-stroke">Impact.</span></h2>
            <p className="mt-4 text-[15px]">Every smile tells a story of hope and transformation.</p>
            <Button to="/gallery" variant="outline" icon="arrow-right" className="mt-6">View More Stories</Button>
          </div>
          <TestimonialCarousel items={TESTIMONIALS} />
        </div>
      </section>

      {/* SECTION 5 — CTA BAND */}
      <section className="max-w-7xl mx-auto px-5 pb-20 mf-fade">
        <div className="mf-band px-8 py-12 grid lg:grid-cols-[34%_1fr] gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl leading-snug">Be the <span className="mf-hl mf-stroke">Change.</span><br />Make an Impact. <i className="fa-solid fa-star-of-life mf-spark text-sm ml-1"></i></h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="sm:border-l border-white/15 sm:pl-6">
              <i className="fa-solid fa-users mf-gold-icon"></i>
              <h4 className="mt-3 mb-1 text-base">Become a Volunteer</h4>
              <p className="text-xs text-[#c9d4ee] mb-3">Join our team and make a difference.</p>
              <Link to="/get-involved#volunteer" className="text-[#F5B921] text-sm" aria-label="Become a volunteer"><i className="fa-solid fa-arrow-right"></i></Link>
            </div>
            <div className="sm:border-l border-white/15 sm:pl-6">
              <i className="fa-solid fa-droplet mf-gold-icon"></i>
              <h4 className="mt-3 mb-1 text-base">Request Blood</h4>
              <p className="text-xs text-[#c9d4ee] mb-3">Need blood support? We're here to help.</p>
              <Link to="/get-involved#blood" className="text-[#F5B921] text-sm" aria-label="Request blood"><i className="fa-solid fa-arrow-right"></i></Link>
            </div>
            <div className="sm:border-l border-white/15 sm:pl-6">
              <i className="fa-solid fa-hand-holding-heart mf-gold-icon"></i>
              <h4 className="mt-3 mb-1 text-base">Support Us Financially</h4>
              <p className="text-xs text-[#c9d4ee] mb-3">Your donation helps us impact more lives.</p>
              <Link to="/contact" className="text-[#F5B921] text-sm" aria-label="Support us"><i className="fa-solid fa-arrow-right"></i></Link>
            </div>
          </div>
        </div>
      </section>
    </PageFx>
  );
}
