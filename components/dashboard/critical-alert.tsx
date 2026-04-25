"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  X,
  MessageSquare,
  Navigation,
  Phone,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CriticalAlertProps {
  isOpen: boolean;
  onClose: () => void;
  alertType: "typhoon" | "flood" | "earthquake" | "heatwave";
  timeToImpact: string;
  message: string;
}

const alertStyles = {
  typhoon: {
    bg: "bg-red-950",
    border: "border-red-500",
    text: "text-red-400",
    icon: "text-red-500",
  },
  flood: {
    bg: "bg-blue-950",
    border: "border-blue-500",
    text: "text-blue-400",
    icon: "text-blue-500",
  },
  earthquake: {
    bg: "bg-orange-950",
    border: "border-orange-500",
    text: "text-orange-400",
    icon: "text-orange-500",
  },
  heatwave: {
    bg: "bg-yellow-950",
    border: "border-yellow-500",
    text: "text-yellow-400",
    icon: "text-yellow-500",
  },
};

export function CriticalAlert({
  isOpen,
  onClose,
  alertType,
  timeToImpact,
  message,
}: CriticalAlertProps) {
  const [sendingMessage, setSendingMessage] = useState<"safe" | "moving" | null>(null);
  const [messageSent, setMessageSent] = useState<"safe" | "moving" | null>(null);

  const styles = alertStyles[alertType];

  const handleSendMessage = (type: "safe" | "moving") => {
    setSendingMessage(type);
    setTimeout(() => {
      setSendingMessage(null);
      setMessageSent(type);
      setTimeout(() => setMessageSent(null), 3000);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={cn(
              "relative w-full max-w-lg rounded-xl border-2 p-4 sm:p-6 max-h-[90vh] overflow-y-auto scrollbar-auto-hide",
              styles.bg,
              styles.border
            )}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 text-white/70 hover:text-white h-8 w-8 sm:h-10 sm:w-10"
              onClick={onClose}
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Alert Icon */}
            <div className="flex justify-center mb-3 sm:mb-4">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <AlertTriangle className={cn("h-12 w-12 sm:h-16 sm:w-16", styles.icon)} />
              </motion.div>
            </div>

            {/* Alert Title */}
            <h2 className="text-center text-xl sm:text-2xl font-bold text-white mb-2">
              CRITICAL ALERT
            </h2>

            {/* Alert Type Badge */}
            <div className="flex justify-center mb-3 sm:mb-4">
              <Badge
                variant="outline"
                className={cn("text-xs sm:text-sm px-3 sm:px-4 py-1", styles.border, styles.text)}
              >
                {alertType.charAt(0).toUpperCase() + alertType.slice(1)} Warning
              </Badge>
            </div>

            {/* Time to Impact */}
            <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
              <Clock className={cn("h-4 w-4 sm:h-5 sm:w-5", styles.text)} />
              <span className={cn("text-base sm:text-lg font-semibold", styles.text)}>
                {timeToImpact} to impact
              </span>
            </div>

            {/* Message */}
            <p className="text-center text-white text-sm sm:text-lg mb-4 sm:mb-6">{message}</p>

            {/* Action Buttons */}
            <div className="space-y-2 sm:space-y-3">
              {/* Message Loved Ones */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  className={cn("gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm", styles.border, styles.text)}
                  onClick={() => handleSendMessage("safe")}
                  disabled={sendingMessage !== null}
                >
                  {messageSent === "safe" ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Sent!
                    </>
                  ) : sendingMessage === "safe" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      I Am Safe
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className={cn("gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm", styles.border, styles.text)}
                  onClick={() => handleSendMessage("moving")}
                  disabled={sendingMessage !== null}
                >
                  {messageSent === "moving" ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Sent!
                    </>
                  ) : sendingMessage === "moving" ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Navigation className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      I Am Moving
                    </>
                  )}
                </Button>
              </div>

              {/* Navigate to Safety */}
              <Button
                className="w-full gap-2 h-10 sm:h-12 text-sm sm:text-base bg-white text-black hover:bg-white/90"
                onClick={onClose}
              >
                <Navigation className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Navigate to Nearest Evacuation Center</span>
                <span className="sm:hidden">Navigate to Safety</span>
              </Button>

              {/* Emergency Call */}
              <div className="flex gap-2 sm:gap-3">
                <Button variant="outline" className="flex-1 gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm" asChild>
                  <a href="tel:911">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Call 911
                  </a>
                </Button>
                <Button variant="outline" className="flex-1 gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm" asChild>
                  <a href="tel:143">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Red Cross
                  </a>
                </Button>
              </div>
            </div>

            {/* Footer Note */}
            <p className="text-center text-xs text-white/60 mt-4">
              This alert was sent to your Family Circle via SMS
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
