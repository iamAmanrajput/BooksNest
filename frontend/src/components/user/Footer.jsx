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
  BookOpen,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      {/* Main Footer Content */}
      <div className="px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 lg:gap-12">
          {/* Library Info */}
          <div className="space-y-6">
            <div>
              <h3
                onClick={() => navigate("/")}
                className="text-2xl cursor-pointer flex gap-2 items-center font-bold text-zinc-900 dark:text-zinc-100 mb-4"
              >
                <BookOpen className="text-customblue" /> <span>BooksNest</span>
              </h3>
              <p className="text-zinc-700 text-sm font-bold dark:text-zinc-300 leading-relaxed">
                Empowering minds through knowledge. Our library offers a wide
                range of books, journals, and digital resources to support
                learning and research.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-500" />
                <a
                  href="mailto:booksnest.app@gmail.com"
                  className="text-sm text-zinc-700 dark:text-zinc-300"
                >
                  booksnest.app@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  +91 87007 36093
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
                  {
                    icon: Linkedin,
                    href: "https://www.linkedin.com/in/aman-kumar-910843327/",
                    label: "LinkedIn",
                  },
                  {
                    icon: Github,
                    href: "https://github.com/iamAmanrajput",
                    label: "GitHub",
                  },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  {
                    icon: Instagram,
                    href: "https://www.instagram.com/jaanirajput_0/",
                    label: "Instagram",
                  },
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
            © 2025 BooksNest Library. All rights reserved.
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
            {[
              "Privacy Policy",
              "Terms of Use",
              "Library Rules",
              "Help Desk",
            ].map((item) => (
              <Link
                key={item}
                to="#"
                className="text-zinc-700 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
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
