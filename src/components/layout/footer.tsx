import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram } from "lucide-react";
import { Logo } from "@/components/brand/logo";

const shop = [
  { to: "/shop" as const, search: { gender: "men" as const }, label: "Men" },
  { to: "/shop" as const, search: { gender: "women" as const }, label: "Women" },
];

const support = [
  { to: "/order-status" as const, label: "Order Status" },
  { to: "/support" as const, label: "Product Support" },
  { to: "/shipping" as const, label: "Shipping & Return Policy" },
  { to: "/complaint" as const, label: "Complaint Registration" },
];

const about = [
  { to: "/about" as const, label: "About Us" },
  { to: "/contact" as const, label: "Contact Us" },
  { to: "/privacy" as const, label: "Privacy Policy" },
  { to: "/terms" as const, label: "Terms of use" },
];

export function Footer() {
  return (
    <footer className="bg-navy text-paper">
      <div className="site-wrap flex flex-col items-center pt-12 pb-6">
        <Logo invert className="mb-10" />

        {/* Mobile: 2 col, md: 5 col */}
        <div className="grid w-full grid-cols-2 gap-8 sm:gap-10 md:grid-cols-5">
          <Col title="SHOP">
            {shop.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                search={l.search}
                className="block py-1 text-[13px] text-cloud/90 transition-colors duration-150 hover:text-paper"
              >
                {l.label}
              </Link>
            ))}
          </Col>
          <Col title="SUPPORT">
            {support.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block py-1 text-[13px] text-cloud/90 transition-colors duration-150 hover:text-paper"
              >
                {l.label}
              </Link>
            ))}
          </Col>
          <Col title="About Us">
            {about.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block py-1 text-[13px] text-cloud/90 transition-colors duration-150 hover:text-paper"
              >
                {l.label}
              </Link>
            ))}
          </Col>
          <div>
            <p className="mb-4 text-[13px] font-medium tracking-wide">Contact</p>
            <p className="text-[13px] text-cloud/90">
              Email :{" "}
              <a href="mailto:urbantick@gmail.com" className="hover:text-paper break-all">
                urbantick@gmail.com
              </a>
            </p>
            <p className="mt-2 text-[13px] text-cloud/90">
              Phone :{" "}
              <a href="tel:+918888888888" className="hover:text-paper">
                +91 8888888888
              </a>
            </p>
          </div>
          <div>
            <p className="mb-4 text-[13px] font-medium tracking-wide">Connect with us</p>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-paper transition-opacity duration-150 hover:opacity-70">
                <Instagram className="size-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-paper transition-opacity duration-150 hover:opacity-70">
                <Facebook className="size-4" />
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className="text-paper transition-opacity duration-150 hover:opacity-70">
                <XMark />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <p className="site-wrap py-4 text-[11px] text-cloud/70 text-center md:text-left">
          © 2024 UrbanTick. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

function Col({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-4 text-[13px] font-medium tracking-wide">{title}</p>
      {children}
    </div>
  );
}

function XMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true" fill="currentColor">
      <path d="M17.3 3H20l-6.2 7.1L21 21h-5.6l-4.4-5.8L6 21H3.3l6.6-7.6L3 3h5.7l4 5.3L17.3 3Zm-1 16.2h1.6L7.8 4.7H6.1l10.2 14.5Z" />
    </svg>
  );
}
