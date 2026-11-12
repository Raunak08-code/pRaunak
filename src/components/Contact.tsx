import { Github, Instagram, Linkedin, MailOpen, PhoneCall } from "lucide-react";
import { resumeData } from "../data";

const contactMethods: {
  label: string;
  value: string;
  href: string;
  icon: typeof PhoneCall;
  openInNewTab?: boolean;
}[] = [
  {
    label: "Phone",
    value: resumeData.phone,
    href: `tel:${resumeData.phone.replace(/[^0-9+]/g, "")}`,
    icon: PhoneCall,
  },
  {
    label: "Email",
    value: resumeData.email,
    href: `mailto:${resumeData.email}`,
    icon: MailOpen,
    openInNewTab: true,
  },
  {
    label: "Instagram",
    value: "Instagram profile",
    href: resumeData.instagram,
    icon: Instagram,
    openInNewTab: true,
  },
  {
    label: "LinkedIn",
    value: "LinkedIn profile",
    href: resumeData.linkedin,
    icon: Linkedin,
    openInNewTab: true,
  },
  {
    label: "GitHub",
    value: "GitHub profile",
    href: resumeData.github,
    icon: Github,
    openInNewTab: true,
  },
].filter((method) => method.href !== undefined);

export default function Contact() {
  return (
    <section
      id="contact"
      className="connect-page"
    >
      <div className="connect-shell">
        <p className="connect-kicker">Let’s work together</p>
        <h1>Connect</h1>

        <div className="connect-copy">
          <p>Good ideas, bad ideas, everything is welcome.</p>
          <p>Let’s engineer outstanding software together.</p>
        </div>

        <div className="connect-methods">
          {contactMethods.map(({ label, value, href, icon: Icon, openInNewTab }) => (
            <a
              key={label}
              href={href}
              target={openInNewTab ? "_blank" : undefined}
              rel={openInNewTab ? "noopener noreferrer" : undefined}
              aria-label={`${label}: ${value}`}
              className="connect-method"
            >
              <span className="connect-method-icon">
                <Icon aria-hidden="true" />
              </span>
              <span className="connect-method-copy">
                <strong>{label}</strong>
                <span>{value}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
