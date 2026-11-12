import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";

type Page = "about" | "edu-skill" | "project" | "blogs-extra" | "contact";

interface NavbarProps {
  activePage: Page;
}

const navItems: { id: Page; label: string; href: string }[] = [
  { id: "edu-skill", label: "Edu-Skill", href: "#education" },
  { id: "project", label: "Work", href: "#projects" },
  { id: "blogs-extra", label: "Blog", href: "#blogs" },
];

export default function Navbar({ activePage }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="site-nav fixed inset-x-0 top-0 z-50">
      <div className="site-nav-inner grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-10">
        <a
          href="#landing"
          className="flex min-w-0 items-center gap-2.5 justify-self-start rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--dusty-teal)]"
          aria-label="Raunak Pandey home"
        >
          <span className="site-nav-logo" aria-hidden="true">R</span>
          <span className="whitespace-nowrap font-sans text-sm font-bold tracking-tight text-[var(--cloud-white)] sm:text-lg">
            Raunak
          </span>
        </a>

        <div className="relative col-start-3 row-start-1 justify-self-end md:col-start-2 md:justify-self-center">
          <div className="hidden items-center gap-1 rounded-full border border-[var(--border-soft)] bg-white/70 p-1 shadow-sm backdrop-blur-md md:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                aria-current={activePage === item.id ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dusty-teal)] ${
                  activePage === item.id
                    ? "bg-[var(--cobalt)] text-white"
                    : "text-[var(--cloud-white)] hover:bg-blue-50 hover:text-[var(--cobalt)]"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="cursor-pointer rounded-full border border-[var(--border-soft)] bg-white/70 p-2.5 text-[var(--cloud-white)] shadow-sm backdrop-blur-md transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dusty-teal)] md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        <a href="#contact" className="connect-button hidden justify-self-end md:inline-flex">
          Connect
        </a>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute right-4 top-[calc(100%+0.5rem)] w-56 rounded-2xl border border-[var(--border-soft)] bg-white/95 p-2 text-[var(--cloud-white)] shadow-lg backdrop-blur-xl md:hidden"
          >
            <div className="space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={activePage === item.id ? "page" : undefined}
                  className={`block rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dusty-teal)] ${
                    activePage === item.id
                      ? "bg-blue-50 text-[var(--cobalt)]"
                      : "text-[var(--cloud-white)] hover:bg-blue-50"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="connect-button mt-2 flex justify-center"
            >
              Connect
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
