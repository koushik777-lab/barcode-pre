import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Status = "loading" | "success" | "invalid" | "error";

export default function VerifyEmailPage() {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<Status>("loading");
  const { toast } = useToast();

  // Read ?token= from the URL query string
  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    fetch(`/api/users/verify-email-check/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          toast({
            title: "Email Verified!",
            description: "Your email has been successfully verified. You can now log in.",
          });
        } else if (data.message === "already_verified") {
          setStatus("success");
          toast({
            title: "Already Verified",
            description: "This email is already verified. Please sign in.",
          });
        } else {
          setStatus("invalid");
          toast({
            title: "Verification Failed",
            description: "The link is invalid or has expired.",
            variant: "destructive",
          });
        }
      })
      .catch(() => {
        setStatus("error");
        toast({
          title: "Error",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      });
  }, [token, toast]);

  type ContentMap = {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    color: string;
    glow: string;
    action?: React.ReactNode;
  };

  const content: Record<Status, ContentMap> = {
    loading: {
      icon: <Loader2 className="w-16 h-16 text-orange-400 animate-spin" />,
      title: "Verifying your email…",
      subtitle: "Please wait while we confirm your account.",
      color: "text-orange-400",
      glow: "rgba(249,115,22,0.3)",
    },
    success: {
      icon: <CheckCircle2 className="w-16 h-16 text-emerald-400" />,
      title: "Email Verified Successfully!",
      subtitle:
        "Your account is now active. You can log in and start using ShopMyBarcode.",
      color: "text-emerald-400",
      glow: "rgba(52,211,153,0.3)",
      action: (
        <Button
          onClick={() => navigate("/?verified=success")}
          className="mt-6 h-12 px-8 bg-emerald-600 hover:bg-emerald-500 text-white text-base rounded-lg transition-all hover:scale-105"
        >
          Go to Homepage
        </Button>
      ),
    },
    invalid: {
      icon: <XCircle className="w-16 h-16 text-red-400" />,
      title: "Invalid or Expired Link",
      subtitle:
        "This verification link has already been used or has expired. Request a new one from the login page.",
      color: "text-red-400",
      glow: "rgba(248,113,113,0.3)",
      action: (
        <Button
          onClick={() => navigate("/?verified=invalid")}
          className="mt-6 h-12 px-8 bg-orange-600 hover:bg-orange-500 text-white text-base rounded-lg transition-all hover:scale-105"
        >
          Back to Home
        </Button>
      ),
    },
    error: {
      icon: <XCircle className="w-16 h-16 text-red-400" />,
      title: "Something went wrong",
      subtitle:
        "We could not verify your email due to a server error. Please try again or contact support.",
      color: "text-red-400",
      glow: "rgba(248,113,113,0.3)",
      action: (
        <Button
          onClick={() => window.location.reload()}
          className="mt-6 h-12 px-8 bg-orange-600 hover:bg-orange-500 text-white text-base rounded-lg transition-all hover:scale-105"
        >
          Try Again
        </Button>
      ),
    },
  };

  const current = content[status];

  return (
    <div className="min-h-screen bg-[#0a0f1a] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: current.glow }}
      />

      {/* Brand header */}
      <div className="absolute top-6 left-8 flex items-center gap-2">
        <Mail className="text-orange-400 w-6 h-6" />
        <span className="text-white font-bold text-lg tracking-tight">
          ShopMyBarcode
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -20 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center max-w-md bg-white/5 border border-white/10 rounded-2xl p-10 backdrop-blur-xl shadow-2xl"
        >
          <div className="mb-6">{current.icon}</div>
          <h1 className={`text-3xl font-bold ${current.color} mb-3`}>
            {current.title}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            {current.subtitle}
          </p>
          {current.action}
          <p className="mt-8 text-xs text-gray-600">
            © {new Date().getFullYear()} ShopMyBarcode. All rights reserved.
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
