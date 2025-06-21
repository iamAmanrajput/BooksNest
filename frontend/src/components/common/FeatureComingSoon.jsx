import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ModeToggle from "@/components/common/ModeToggle";

const FeatureComingSoon = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-100 to-white dark:from-zinc-900 dark:to-zinc-800 px-4 relative">
      {/* Mode Toggle */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <Card className="w-full max-w-xl shadow-xl rounded-2xl border-none bg-white dark:bg-zinc-900 text-center animate-fade-in">
        <CardContent className="py-14 px-6 space-y-6">
          {/* Icon + Title */}
          <div className="flex flex-col items-center space-y-3">
            <Wrench className="w-14 h-14 text-customblue animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              Feature Coming Soon
            </h1>
            <p className="text-muted-foreground text-sm max-w-sm">
              We're building something awesome for you! This feature will be
              available very soon.
            </p>
          </div>

          {/* CTA Button */}
          <Link to="/">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureComingSoon;
