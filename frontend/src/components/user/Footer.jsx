import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#09090B]">
      {/* Main Footer Content */}
      <div className="px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 lg:gap-12">
          {/* Library Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
                BooksNest
              </h3>
              <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                Empowering minds through knowledge. Our library offers a wide
                range of books, journals, and digital resources to support
                learning and research.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  booksnest.app@gmail.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  +91 98765 43210
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  Rohini Sector-22, New Delhi, India
                </span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h5 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
                Follow Us
              </h5>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, href: "#", label: "Facebook" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Instagram, href: "#", label: "Instagram" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Github, href: "#", label: "GitHub" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors duration-200 group"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4 text-zinc-600 dark:text-zinc-300 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Footer */}
      <div className="px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-zinc-700 dark:text-zinc-400">
            © 2025 Central Library. All rights reserved.
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
            {[
              "Privacy Policy",
              "Terms of Use",
              "Library Rules",
              "Help Desk",
            ].map((item) => (
              <a
                key={item}
                href="#"
                className="text-zinc-700 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
