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
    <footer className="w-full border-t text-slate-300">
      {/* Main Footer Content */}
      <div className="px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 lg:gap-12">
          {/* Library Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">BooksNest</h3>
              <p className="text-slate-400 leading-relaxed">
                Empowering minds through knowledge. Our library offers a wide
                range of books, journals, and digital resources to support
                learning and research.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-sm">booksnest.app@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm">
                  Rohini Sector-22, New Delhi, India
                </span>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h5 className="text-sm font-medium text-white mb-3">Follow Us</h5>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, href: "#", label: "Facebook" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Instagram, href: "#", label: "Instagram" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                  { icon: Github, href: "#", label: "GitHub" },
                ].map(({ icon: Icon, href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 group"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4 text-slate-400 group-hover:text-white" />
                  </Link>
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
          <div className="text-sm text-slate-500">
            © 2025 Central Library. All rights reserved.
          </div>

          <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
            {[
              "Privacy Policy",
              "Terms of Use",
              "Library Rules",
              "Help Desk",
            ].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-slate-500 hover:text-white transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
