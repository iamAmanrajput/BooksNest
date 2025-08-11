import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  RefreshCcw,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import ModeToggle from "@/components/common/ModeToggle";
import Loader from "@/components/common/Loader";
import axios from "axios";

const VerifyToken = () => {
  const [status, setStatus] = useState("loading"); // "loading", "success", "error"
  const [userData, setUserData] = useState(null);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const title = "Verify Your Email";

  const startVerify = async () => {
    if (!token) {
      setStatus("error");
      setUserData({ error: "No token found in URL" });
      return;
    }

    setStatus("loading");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/verify?token=${token}`
      );
      if (response?.data?.success) {
        setUserData(response?.data?.data);
        setStatus("success");
      }
    } catch (error) {
      setUserData({
        error: error?.response?.data?.message || "Internal Server Error",
      });
      setStatus("error");
    }
  };

  useEffect(() => {
    startVerify();
  }, [token]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-[#09090b] px-4 relative">
      {/* Mode Toggle Button in Top Right */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card className="border-muted/50 shadow-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl sm:text-3xl">{title}</CardTitle>
              <CardDescription>
                Securely checking your session with our backend.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <section aria-live="polite" aria-busy={status === "loading"}>
                <AnimatePresence mode="wait">
                  {status === "loading" && (
                    <div className="flex flex-col items-center gap-4 py-4">
                      <Loader width={8} height={35} />
                      <p className="text-sm text-muted-foreground text-center">
                        This will only take a moment...
                      </p>
                    </div>
                  )}

                  {status === "success" && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col items-center gap-4 py-4"
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 15,
                        }}
                        className="text-emerald-600 dark:text-emerald-400"
                        aria-hidden="true"
                      >
                        <CheckCircle2 className="h-12 w-12" />
                      </motion.div>
                      <div className="text-center space-y-1.5">
                        <p className="font-medium">
                          {`Welcome back${
                            userData ? `, ${userData?.fullName}` : ""
                          }!`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          You're all set! Please sign in to access your
                          dashboard.
                        </p>
                      </div>
                      <div className="pt-2">
                        <Link to="/signin">
                          <Button className="inline-flex items-center gap-2">
                            Continue
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  )}

                  {status === "error" && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col items-center gap-4 py-4"
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 280,
                          damping: 16,
                        }}
                        className="text-amber-600 dark:text-amber-400"
                        aria-hidden="true"
                      >
                        <ShieldAlert className="h-12 w-12" />
                      </motion.div>
                      <div className="text-center space-y-1.5">
                        <p className="font-medium">
                          We couldn't verify your session
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {userData?.error ??
                            "Please try again or login to continue."}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Button
                          variant="secondary"
                          onClick={startVerify}
                          className="inline-flex items-center gap-2"
                        >
                          <RefreshCcw className="h-4 w-4" />
                          Try again
                        </Button>
                        <Link to="/signup">
                          <Button className="inline-flex items-center gap-2">
                            Sign Up
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              <div className="mt-6 text-center text-xs text-muted-foreground">
                Tip: If your token has expired, please sign up again to get a
                new verification link.
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
};

export default VerifyToken;
