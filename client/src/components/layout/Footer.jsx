import { Link } from "react-router-dom";
import MfForm from "../ui/MfForm";

export default function Footer() {
  return (
    <footer className="mf-footer pt-16">
      <div className="max-w-7xl mx-auto px-5 grid gap-10 md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr_1fr_1.3fr] pb-12">
        <div>
          <Link to="/" className="flex items-center gap-3 mb-5">
            <span className="w-11 h-11 rounded-full border-2 border-white flex items-center justify-center">
              <i className="fa-solid fa-fire-flame-curved text-white text-lg"></i>
            </span>
            <span className="leading-tight">
              <span className="block font-bold text-white tracking-wide">MOONLIT</span>
              <span className="block text-[9px] tracking-[.35em]">FOUNDATION</span>
            </span>
          </Link>
          <p className="text-sm leading-relaxed mb-6">Empowering communities and inspiring change through service, care and compassion.</p>
          <div className="flex gap-3">
            <a className="mf-social" href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
            <a className="mf-social" href="#" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
            <a className="mf-social" href="#" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
            <a className="mf-social" href="#" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>

        <div>
          <h5>Quick Links</h5>
          <ul className="space-y-2.5">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/programs">Programs</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h5>Get Involved</h5>
          <ul className="space-y-2.5">
            <li><Link to="/get-involved#volunteer">Become a Volunteer</Link></li>
            <li><Link to="/get-involved#blood">Request Blood</Link></li>
            <li><Link to="/get-involved#partner">Partner With Us</Link></li>
          </ul>
        </div>

        <div>
          <h5>Programs</h5>
          <ul className="space-y-2.5">
            <li><Link to="/programs#blood">Blood Donation</Link></li>
            <li><Link to="/programs#welfare">Community Welfare</Link></li>
            <li><Link to="/programs#relief">Disaster Relief</Link></li>
            <li><Link to="/programs#environment">Environment</Link></li>
            <li><Link to="/programs#youth">Youth Development</Link></li>
          </ul>
        </div>

        <div>
          <h5>Contact Us</h5>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><i className="fa-solid fa-location-dot text-[#F5B921] mt-1"></i> Kozhikode, Kerala, India</li>
            <li className="flex gap-3"><i className="fa-solid fa-phone text-[#F5B921] mt-1"></i> <a href="tel:+919995123456">+91 9995 123 456</a></li>
            <li className="flex gap-3"><i className="fa-solid fa-envelope text-[#F5B921] mt-1"></i> <a href="mailto:info@moonlitfoundation.org">info@moonlitfoundation.org</a></li>
          </ul>
          <h5 className="mt-6">Stay Updated</h5>
          <MfForm endpoint="/newsletter" successMessage="Subscribed! Welcome to the Moonlit family." className="flex bg-white rounded-full p-1">
            <label className="sr-only" htmlFor="nl-email">Email address</label>
            <input id="nl-email" name="email" required type="email" placeholder="Enter your email" className="flex-1 min-w-0 px-4 text-sm text-[#111827] bg-transparent focus:outline-none" />
            <button className="w-10 h-10 rounded-full bg-[#F5B921] text-[#0A1F44]" aria-label="Subscribe"><i className="fa-solid fa-arrow-right"></i></button>
          </MfForm>
        </div>
      </div>
      <div className="mf-footer-bottom py-4">
        <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row justify-between gap-2">
          <p>&copy; {new Date().getFullYear()} Moonlit Foundation. All rights reserved.</p>
          <p><a href="#">Privacy Policy</a> &nbsp;|&nbsp; <a href="#">Terms &amp; Conditions</a></p>
        </div>
      </div>
    </footer>
  );
}
