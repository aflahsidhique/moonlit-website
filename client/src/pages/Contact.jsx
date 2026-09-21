import PageFx from "../components/ui/PageFx";
import PageHero from "../components/ui/PageHero";
import MfForm from "../components/ui/MfForm";
import { TextField, TextareaField, SelectField } from "../components/ui/FormField";

const INFO_CARDS = [
  { icon: "location-dot", accent: "bg-[#14338C]", title: "Visit Us", body: <>Moonlit Foundation, Kozhikode,<br />Kerala, India</> },
  { icon: "phone", accent: "bg-acc-yellow !text-[#0A1F44]", title: "Call Us", body: <><a className="text-[#14338C] font-semibold" href="tel:+919995123456">+91 9995 123 456</a><br />Emergency blood line: 24/7</> },
  { icon: "envelope", accent: "bg-[#14338C]", title: "Email Us", body: <><a className="text-[#14338C] font-semibold" href="mailto:info@moonlitfoundation.org">info@moonlitfoundation.org</a><br />We reply within 2 working days</> },
  { icon: "clock", accent: "bg-acc-yellow !text-[#0A1F44]", title: "Office Hours", body: <>Mon – Sat, 9:30 AM – 6:00 PM<br />Volunteers on call around the clock</> },
];

export default function Contact() {
  return (
    <PageFx>
      <PageHero
        crumb="Contact Us"
        eyebrow="Contact Us"
        heading={<>Let's <span className="mf-hl mf-stroke">Connect</span></>}
        description="Questions, ideas, requests — we read everything and reply fast. Reach us any way that suits you."
      />

      {/* CONTACT INFO + FORM */}
      <section className="max-w-7xl mx-auto px-5 py-16 grid lg:grid-cols-[42%_1fr] gap-12 items-start">
        <div className="space-y-5 mf-fade">
          {INFO_CARDS.map((c) => (
            <div key={c.title} className="mf-card p-6 flex gap-5 items-start">
              <span className={`mf-icon-bubble ${c.accent}`}><i className={`fa-solid fa-${c.icon}`}></i></span>
              <div><h4 className="mb-1">{c.title}</h4><p className="text-[14px]">{c.body}</p></div>
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <a className="mf-social !border-[#14338C]/30 !text-[#14338C]" href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
            <a className="mf-social !border-[#14338C]/30 !text-[#14338C]" href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
            <a className="mf-social !border-[#14338C]/30 !text-[#14338C]" href="#" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
            <a className="mf-social !border-[#14338C]/30 !text-[#14338C]" href="#" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>

        <MfForm endpoint="/contact" successMessage="Message sent! We'll get back to you within 2 working days." className="mf-form-card mf-fade">
          <h3 className="text-xl mb-6">Send us a message</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            <TextField label="Name" name="name" required placeholder="Your name" />
            <TextField label="Phone" name="phone" type="tel" placeholder="+91 ..." />
            <TextField label="Email" name="email" type="email" required span placeholder="you@example.com" />
            <SelectField label="Subject" name="subject" required span error="Please choose a subject.">
              <option value="">Choose a topic</option>
              <option>Volunteering</option><option>Blood request</option><option>Partnership / CSR</option><option>Media inquiry</option><option>Something else</option>
            </SelectField>
            <TextareaField label="Message" name="message" required span rows={5} placeholder="How can we help?" error="Please write a message." />
          </div>
          <button className="mf-btn mf-btn-primary mt-6 w-full justify-center">Send Message <i className="fa-solid fa-arrow-right"></i></button>
        </MfForm>
      </section>

      {/* MAP */}
      <section className="max-w-7xl mx-auto px-5 pb-20 mf-fade">
        <div className="rounded-3xl overflow-hidden" style={{ boxShadow: "var(--mf-shadow)" }}>
          <iframe
            title="Moonlit Foundation location — Kozhikode, Kerala"
            src="https://maps.google.com/maps?q=Kozhikode,Kerala,India&z=12&output=embed"
            width="100%" height="420" style={{ border: 0, display: "block" }} loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" allowFullScreen
          />
        </div>
      </section>
    </PageFx>
  );
}
