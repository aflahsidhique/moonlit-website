import PageFx from "../components/ui/PageFx";
import PageHero from "../components/ui/PageHero";
import Button from "../components/ui/Button";
import Img from "../components/ui/Img";

const VALUES = [
  { icon: "heart", accent: "red", title: "Compassion", text: "We lead with empathy — every person we serve is treated with dignity and warmth." },
  { icon: "scale-balanced", accent: "blue", title: "Integrity", text: "Every rupee, every relief kit and every promise is accounted for, openly." },
  { icon: "bolt", accent: "yellow", title: "Action", text: "We move fast when it matters — hours count in an emergency, not days." },
  { icon: "people-group", accent: "green", title: "Community", text: "Change is built together — with local people, for local people." },
];

const TIMELINE = [
  { year: "2021", title: "National Integration Camp, Bihar", text: "Youth programs in India that bring students together from different states to promote unity, cultural sharing, and leadership." },
  { year: "2022", title: "International Cultural Fest, NIFAA-Hariyana", text: "NIFAA organizes Haryana’s renowned international cultural festivals, uniting youth through vibrant traditions, arts, and cultural exchange." },
  { year: "2023", title: "Cultural Exchange Program, Tripura", text: "A cultural exchange program in Tripura promotes unity, friendship, and understanding by celebrating diverse traditions, customs, languages, arts, and heritage." },
  { year: "2024", title: "Adventure Camp, Odissa", text: "Adventure Camp in Odisha offers exciting experiences through trekking, nature exploration, outdoor activities, teamwork, and learning while enjoying the beautiful environment." },
  { year: "2025", title: "Workshop On Flagship Scheme, Keralam", text: "The workshop on flagship schemes in Kerala creates awareness about government initiatives, their benefits, implementation, and opportunities for public participation and development." },
  { year: "2026", title: "Project Sulaimani, Keralam", text: "Project Sulaimani is a community-driven coastal cleanup initiative launched in April 2026 by the Moonlight Foundation to remove plastic and marine litter from Kozhikode Beach." },
];

const TEAM = [
  { name: "Arjun Krishnan", role: "Founder & President", img: "https://randomuser.me/api/portraits/men/22.jpg", fallback: "https://placehold.co/200x200/14338C/fff?text=AK" },
  { name: "Nithya Menon", role: "Vice President", img: "https://randomuser.me/api/portraits/women/28.jpg", fallback: "https://placehold.co/200x200/14338C/fff?text=NM" },
  { name: "Rahul Suresh", role: "Blood Donation Lead", img: "https://randomuser.me/api/portraits/men/45.jpg", fallback: "https://placehold.co/200x200/14338C/fff?text=RS" },
  { name: "Fathima Ashraf", role: "Welfare Coordinator", img: "https://randomuser.me/api/portraits/women/51.jpg", fallback: "https://placehold.co/200x200/14338C/fff?text=FA" },
  { name: "Vishnu Prasad", role: "Disaster Response Lead", img: "https://randomuser.me/api/portraits/men/61.jpg", fallback: "https://placehold.co/200x200/14338C/fff?text=VP" },
  { name: "Anjali Thomas", role: "Environment Lead", img: "https://randomuser.me/api/portraits/women/62.jpg", fallback: "https://placehold.co/200x200/14338C/fff?text=AT" },
  { name: "Sreejith Nair", role: "Youth Programs Lead", img: "https://randomuser.me/api/portraits/men/72.jpg", fallback: "https://placehold.co/200x200/14338C/fff?text=SN" },
  { name: "Devika Raj", role: "Volunteer Coordinator", img: "https://randomuser.me/api/portraits/women/12.jpg", fallback: "https://placehold.co/200x200/14338C/fff?text=DR" },
];

export default function About() {
  return (
    <PageFx>
      <PageHero
        crumb="About Us"
        eyebrow="Who We Are"
        heading={<>Driven by Compassion,<br />Powered by <span className="mf-hl mf-stroke">Youth</span></>}
        description="We are a collective of young volunteers from Kerala who believe small acts of service, repeated across communities, can light up thousands of lives."
      />

      {/* OUR STORY */}
      <section className="max-w-7xl mx-auto px-5 py-16 lg:py-24 grid lg:grid-cols-2 gap-14 items-center">
        <div className="relative mf-fade">
          <div className="mf-blob-frame">
            <div className="mf-blob h-[300px] md:h-[400px]">
              <Img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1000&q=80" fallback="https://placehold.co/900x700/14338C/fff?text=Our+Story" alt="Volunteers stacking hands together" />
            </div>
          </div>
          <div className="mf-dots absolute -bottom-4 -right-2 hidden md:block" aria-hidden="true"></div>
          <div className="mf-badge-circle absolute -top-6 -left-2 !w-[110px] !h-[110px] text-sm">Since<span className="mf-hl text-xl">2021</span></div>
        </div>
        <div className="mf-fade">
          <p className="mf-eyebrow mb-3">Our Story</p>
          <h2 className="text-3xl md:text-4xl">A spark that became a <span className="mf-hl mf-stroke">movement</span></h2>
          <div className="mf-divider my-6"></div>
          <p className="text-[15px] leading-relaxed mb-4">Moonlit Foundation, founded in 2021, is a youth development and non-governmental organization based in Kerala, India, with initiatives extending to other states. The organization focuses on empowering young people through rural internships, leadership development, community engagement, and opportunities to build global friendships. It actively contributes to society by organizing blood donation drives, cloth donation campaigns, and disaster relief activities.</p>
          <p className="text-[15px] leading-relaxed"> Moonlit Foundation also conducts camps and events, including the National Integration Camp, which promotes cultural exchange, national unity, and appreciation of India’s rich heritage. Through these initiatives, the foundation strives to nurture responsible, socially aware, confident, and compassionate young leaders.</p>
          <Button to="/get-involved" variant="primary" icon="arrow-right" className="mt-8">Join Our Journey</Button>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="max-w-7xl mx-auto px-5 pb-16">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="mf-card p-8 mf-fade">
            <span className="mf-icon-bubble bg-acc-yellow !text-[#0A1F44] mb-5"><i className="fa-solid fa-bullseye"></i></span>
            <h3 className="text-xl mb-3">Our Mission</h3>
            <p className="text-[14.5px] leading-relaxed">To inspire young individuals to travel with a purpose — combining exploration with compassion by engaging in community development, women empowerment, education and child protection activities across rural and underprivileged areas of India. </p>
          </div>
          <div className="mf-card p-8 mf-fade">
            <span className="mf-icon-bubble bg-[#14338C] mb-5"><i className="fa-solid fa-eye"></i></span>
            <h3 className="text-xl mb-3">Our Vision</h3>
            <p className="text-[14.5px] leading-relaxed">To create a compassionate and inclusive society where youth-led volunteerism drives social change, uplifts marginalized communities and restores dignity and opportunity for all — especially women, children and the rural and urban poor.</p>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="max-w-7xl mx-auto px-5 pb-16 lg:pb-24">
        <div className="text-center mb-12 mf-fade">
          <p className="mf-eyebrow mb-3">What Guides Us</p>
          <h2 className="text-3xl md:text-4xl">Our Core <span className="mf-hl mf-stroke">Values</span></h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="mf-card p-7 text-center mf-fade">
              <span className={`mf-icon-bubble bg-acc-${v.accent} mx-auto mb-4`}><i className={`fa-solid fa-${v.icon}`}></i></span>
              <h4 className="mb-2">{v.title}</h4>
              <p className="text-[13px] leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* JOURNEY TIMELINE */}
      <section className="max-w-7xl mx-auto px-5 pb-16 lg:pb-24 grid lg:grid-cols-[38%_1fr] gap-12">
        <div className="mf-fade">
          <p className="mf-eyebrow mb-3">Our Journey</p>
          <h2 className="text-3xl md:text-4xl">Milestones that shaped <span className="mf-hl mf-stroke">us</span></h2>
          <p className="mt-5 text-[15px]">From one blood camp to twenty-five communities — each year taught us something new about service.</p>
        </div>
        <div className="mf-timeline mf-fade">
          {TIMELINE.map((t) => (
            <div key={t.year} className="mf-tl-item">
              <p className="mf-tl-year">{t.year}</p>
              <h4 className="mb-1">{t.title}</h4>
              <p className="text-[14px]">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="max-w-7xl mx-auto px-5 pb-16 lg:pb-24">
        <div className="text-center mb-12 mf-fade">
          <p className="mf-eyebrow mb-3">The People Behind the Mission</p>
          <h2 className="text-3xl md:text-4xl">Meet the <span className="mf-hl mf-stroke">Team</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TEAM.map((m) => (
            <div key={m.name} className="mf-card p-6 text-center mf-fade">
              <Img className="w-24 h-24 rounded-full object-cover mx-auto mb-4 ring-4 ring-[#F5B921]/40" src={m.img} fallback={m.fallback} alt={m.name} />
              <h4 className="text-base">{m.name}</h4>
              <p className="text-xs text-[#14338C] font-semibold mt-1">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MINI CTA BAND */}
      <section className="max-w-7xl mx-auto px-5 pb-20 mf-fade">
        <div className="mf-band px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <h2 className="text-2xl md:text-3xl">Ready to be part of the <span className="mf-hl mf-stroke">story?</span></h2>
          <div className="flex gap-4 flex-wrap">
            <Button to="/get-involved#volunteer" variant="donate" icon="arrow-right">Become a Volunteer</Button>
            <Button to="/contact" variant="white">Talk to Us</Button>
          </div>
        </div>
      </section>
    </PageFx>
  );
}
