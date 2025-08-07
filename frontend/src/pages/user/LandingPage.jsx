import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Brain,
  Users,
  Zap,
  Search,
  BarChart3,
  Sparkles,
  GraduationCap,
  Library,
  ArrowRight,
  Play,
  User,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import ModeToggle from "@/components/common/ModeToggle";
import { useNavigate } from "react-router-dom";

const taglines = [
  "NexLib: Smart Library for Smart Classrooms",
  "Fueling Young Minds with Smarter Access to Books at NexLib",
  "Where Every Book at NexLib Finds Its Reader",
  "NexLib: The AI Library Experience for Your School",
];

const features = [
  {
    icon: Brain,
    title: "AI-Powered Cataloging",
    description:
      "NexLib intelligently organizes and discovers books using advanced AI algorithms, making your search easy and effective.",
  },
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Find any book in NexLib instantly, thanks to our cutting-edge search and recommendation engine.",
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    description:
      "See what's popular and how the NexLib collection is being enjoyed across the school.",
  },
  {
    icon: Users,
    title: "Student-Friendly Experience",
    description:
      "NexLib's interface ensures that exploring, borrowing, and enjoying books is seamless for every student.",
  },
];

const PARTICLE_COUNT = 20;
const getParticles = () =>
  Array.from({ length: PARTICLE_COUNT }).map(() => {
    const startX = Math.random() * 100 - 50;
    const startY = Math.random() * 100 - 50;
    const endX = Math.random() * 100 - 50;
    const endY = Math.random() * 100 - 50;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const duration = Math.random() * 3 + 2;
    return { startX, startY, endX, endY, left, top, duration };
  });

const LandingPage = () => {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const navigate = useNavigate();

  const { scrollYProgress } = useScroll();

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Particles are pre-calculated once for consistent animation:
  const [particles] = useState(getParticles);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Twak Chatbot
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/6894221cd923c71926e01dc2/1j21aagrt";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  // Mouse move listener on window to track cursor position relative to viewport
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="min-h-screen bg-white dark:bg-[#09090b] text-gray-900 dark:text-white overflow-hidden relative transition-colors duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated Grid Background */}
      <motion.div
        className="fixed inset-0 opacity-30"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.2),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
      </motion.div>

      {/* Cursor Glow */}
      <div
        className="fixed pointer-events-none z-40 w-96 h-96 rounded-full opacity-20 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Cursor White Glow on Hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="white-glow"
            className="fixed pointer-events-none z-50 w-96 h-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 50%)",
              left: mousePosition.x - 192,
              top: mousePosition.y - 192,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500 dark:bg-blue-400 rounded-full opacity-60"
            animate={{
              x: [p.startX, p.endX],
              y: [p.startY, p.endY],
              opacity: [0.6, 0.2, 0.6],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.nav
        className="relative z-20 flex items-center justify-between p-4 lg:px-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center sm:space-x-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <BookOpen className="hidden sm:flex w-8 h-8 text-blue-600 dark:text-customblue" />
          </motion.div>
          <span className="text-2xl font-bold">NexLib</span>
        </div>

        {/* Desktop Buttons */}
        <div className="flex items-center space-x-3">
          <ModeToggle />
          <Button
            onClick={() => navigate("/signin")}
            variant="outline"
            className="px-4 py-2 rounded-md font-semibold transition-colors"
          >
            Sign In
          </Button>
          <Button
            onClick={() => navigate("/signup")}
            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2"
          >
            Sign Up
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        className="relative z-10 px-6 lg:px-12 pt-20 pb-32"
        style={{ y: heroY }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30 dark:hover:bg-blue-500/30 transition-colors">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Library Management
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-blue-800 dark:from-white dark:via-blue-100 dark:to-purple-200 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Welcome to NexLib — Your Smart School Library
          </motion.h1>

          <motion.p
            className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            NexLib is your school's very own intelligent library, designed to
            make discovering and enjoying books effortless.
          </motion.p>

          <motion.p
            className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            With AI-powered cataloging, seamless book tracking, and
            student-friendly interfaces, NexLib helps educators and librarians
            focus on what matters most: inspiring young minds.
          </motion.p>

          {/* Dynamic Taglines */}
          <motion.div
            className="h-16 mb-12 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={currentTagline}
                className="text-2xl font-semibold text-blue-600 dark:text-blue-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {taglines[currentTagline]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate("/signin")}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-blue-600/25"
              >
                <BookOpen strokeWidth={3} className="w-7 h-7 mr-2" />
                Explore Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => navigate("/admin/signin")}
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800 px-8 py-6 text-lg font-semibold rounded-xl"
              >
                <User className="w-5 h-5 mr-1" />
                Admin Sign In
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        className="relative z-10 px-6 lg:px-12 py-32"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-600 to-blue-800 dark:from-white dark:via-blue-100 dark:to-purple-200 bg-clip-text text-transparent">
              Why NexLib Is the Ultimate School Library
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              Discover how Libnex revolutionizes library management with
              cutting-edge technology
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-white/80 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm h-full">
                  <CardContent className="p-6">
                    <motion.div
                      className="w-12 h-12 bg-blue-100 dark:bg-blue-600/20 rounded-lg flex items-center justify-center mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        id="mission"
        className="relative z-10 px-6 lg:px-12 py-32"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center mb-8">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <GraduationCap className="w-16 h-16 text-blue-600 dark:text-blue-400 mb-4" />
              </motion.div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-600 to-blue-800 dark:from-white dark:via-blue-100 dark:to-purple-200 bg-clip-text text-transparent">
              Empowering Schools Through Smarter Libraries
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              At NexLib, our mission is to foster curiosity, creativity, and
              lifelong learning through a smarter, more engaging school library.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="relative z-10 border-t border-gray-200 dark:border-gray-800 px-6 lg:px-12 py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-customblue" />
            <span className="text-xl font-bold">NexLib</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            © 2025 NexLib. Transforming library, inspiring minds.
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
