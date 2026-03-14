import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Loader2, CheckCircle, ArrowLeft, Mail, Lock, User, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

type Tab = "login" | "signup" | "forgot";
type ForgotStep = "email" | "otp" | "reset" | "done";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: Tab;
  verifiedSuccess?: boolean;
}

export function AuthModal({ open, onOpenChange, defaultTab = "login", verifiedSuccess = false }: AuthModalProps) {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>(defaultTab);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginNeedsVerification, setLoginNeedsVerification] = useState(false);
  const [loginUnverifiedEmail, setLoginUnverifiedEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");

  // Signup state
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupVerified, setSignupVerified] = useState(false);

  // Forgot password state
  const [forgotStep, setForgotStep] = useState<ForgotStep>("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const [showSuccessSplash, setShowSuccessSplash] = useState(false);

  // Reset tab to login if verifiedSuccess is true
  useEffect(() => {
    if (open && verifiedSuccess) {
      setTab("login");
      setShowSuccessSplash(true);
    }
  }, [open, verifiedSuccess]);

  const resetAllState = () => {
    setLoginEmail(""); setLoginPassword(""); setLoginError(""); setLoginNeedsVerification(false); setLoginUnverifiedEmail(""); setResendSuccess("");
    setSignupUsername(""); setSignupEmail(""); setSignupPassword(""); setSignupConfirm(""); setSignupError(""); setSignupVerified(false);
    setForgotStep("email"); setForgotEmail(""); setForgotOtp(""); setResetToken("");
    setNewPassword(""); setConfirmNewPassword(""); setForgotError("");
    setShowSuccessSplash(false);
  };

  const handleClose = () => {
    resetAllState();
    onOpenChange(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    setLoginNeedsVerification(false);
    setResendSuccess("");
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (data.success) {
        login(data.user);
        handleClose();
        setLocation("/dashboard");
      } else if (data.needsVerification) {
        setLoginNeedsVerification(true);
        setLoginUnverifiedEmail(data.email || loginEmail);
        setLoginError(data.message || "Please verify your email.");
      } else {
        setLoginError(data.message || "Invalid credentials");
      }
    } catch {
      setLoginError("Network error. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendSuccess("");
    try {
      const res = await fetch("/api/users/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginUnverifiedEmail }),
      });
      const data = await res.json();
      setResendSuccess(data.message || "Verification email sent!");
      toast({
        title: "Email Sent",
        description: data.message || "Verification email has been resent to your inbox.",
      });
    } catch {
      setResendSuccess("Could not send. Please try again.");
      toast({
        title: "Error",
        description: "Failed to resend verification email. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match");
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters");
      return;
    }
    setSignupLoading(true);
    setSignupError("");
    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: signupUsername, email: signupEmail, password: signupPassword }),
      });
      const data = await res.json();
      if (data.success && data.needsVerification) {
        setSignupVerified(true);
        toast({
          title: "Account Created",
          description: "Please check your inbox to verify your email address.",
        });
      } else if (data.success) {
        login(data.user);
        handleClose();
        setLocation("/dashboard");
        toast({
          title: "Welcome!",
          description: "Your account has been created successfully.",
        });
      } else {
        setSignupError(data.message || "Error creating account");
      }
    } catch {
      setSignupError("Network error. Please try again.");
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSignupLoading(false);
    }
  };

  const handleForgotEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    try {
      const res = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setForgotStep("otp");
      } else {
        setForgotError(data.message || "Error sending OTP");
      }
    } catch {
      setForgotError("Network error. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    try {
      const res = await fetch("/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp }),
      });
      const data = await res.json();
      if (data.success) {
        setResetToken(data.resetToken);
        setForgotStep("reset");
      } else {
        setForgotError(data.message || "Invalid OTP");
      }
    } catch {
      setForgotError("Network error. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setForgotError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setForgotError("Password must be at least 6 characters");
      return;
    }
    setForgotLoading(true);
    setForgotError("");
    try {
      const res = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setForgotStep("done");
      } else {
        setForgotError(data.message || "Error resetting password");
      }
    } catch {
      setForgotError("Network error. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/60 focus:bg-white/10 transition-all duration-200 text-sm";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-premium rounded-3xl border border-orange-500/30 overflow-hidden shadow-2xl shadow-black/50">
              <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600" />

              <div className="p-8">
                <button
                  onClick={handleClose}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">ShopMyBarcode</p>
                    <p className="text-white/40 text-xs">Official Retail Codes</p>
                  </div>
                </div>

                {tab !== "forgot" && (
                  <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-8">
                    {(["login", "signup"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => { setTab(t); setLoginError(""); setSignupError(""); }}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          tab === t
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20"
                            : "text-white/50 hover:text-white/80"
                        }`}
                      >
                        {t === "login" ? "Sign In" : "Sign Up"}
                      </button>
                    ))}
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {tab === "login" && (
                    <motion.div
                      key="login-container"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {verifiedSuccess && showSuccessSplash ? (
                        <motion.div
                          key="success-splash"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-center py-8 space-y-6"
                        >
                          <div className="relative mx-auto w-24 h-24">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", damping: 12, delay: 0.1 }}
                              className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl"
                            />
                            <motion.div
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", damping: 12, delay: 0.2 }}
                              className="relative h-24 w-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-2xl shadow-emerald-500/40 border border-emerald-400/50"
                            >
                              <CheckCircle className="h-12 w-12 text-white" />
                            </motion.div>
                          </div>

                          <div className="space-y-2">
                            <h2 className="text-3xl font-black text-white tracking-tight">Verified Successfully!</h2>
                            <p className="text-emerald-400/80 font-medium">Your account is now active and ready to use.</p>
                          </div>

                          <button
                            onClick={() => setShowSuccessSplash(false)}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 group"
                          >
                            Continue to Sign In
                            <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                              <ArrowLeft className="h-5 w-5 rotate-180" />
                            </motion.div>
                          </button>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleLogin} className="space-y-4">
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
                            <p className="text-white/40 text-sm">Sign in to your account</p>
                          </div>

                          <div className="space-y-3 pt-2">
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                              <input
                                type="email"
                                placeholder="Email address"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                required
                                className={`${inputClass} pl-10`}
                              />
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                              <input
                                type={showLoginPass ? "text" : "password"}
                                placeholder="Password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                                className={`${inputClass} pl-10 pr-10`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowLoginPass(!showLoginPass)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                              >
                                {showLoginPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => { setTab("forgot"); setForgotEmail(loginEmail); setForgotError(""); }}
                              className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                            >
                              Forgot password?
                            </button>
                          </div>

                          {loginError && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 space-y-2">
                              <p className="text-red-400 text-xs">{loginError}</p>
                              {loginNeedsVerification && (
                                <div className="space-y-1">
                                  {resendSuccess ? (
                                    <p className="text-green-400 text-xs">{resendSuccess}</p>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={handleResendVerification}
                                      disabled={resendLoading}
                                      className="text-xs text-orange-400 hover:text-orange-300 underline transition-colors disabled:opacity-50 flex items-center gap-1"
                                    >
                                      {resendLoading ? <><Loader2 className="h-3 w-3 animate-spin" /> Sending...</> : "Resend verification email"}
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm hover:from-orange-400 hover:to-orange-500 transition-all duration-200 shadow-lg shadow-orange-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {loginLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : "Sign In"}
                          </button>

                          <p className="text-center text-xs text-white/40">
                            Don't have an account?{" "}
                            <button type="button" onClick={() => setTab("signup")} className="text-orange-400 hover:text-orange-300 font-medium">
                              Create one
                            </button>
                          </p>
                        </form>
                      )}
                    </motion.div>
                  )}

                  {tab === "signup" && (
                    <motion.div
                      key="signup-container"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {signupVerified ? (
                        <div className="text-center space-y-5 py-4">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto shadow-xl shadow-orange-500/30">
                              <Mail className="h-9 w-9 text-white" />
                            </div>
                          </motion.div>
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Check your inbox!</h2>
                            <p className="text-white/50 text-sm leading-relaxed">
                              We sent a verification link to<br />
                              <span className="text-orange-400 font-medium">{signupEmail}</span>
                            </p>
                            <p className="text-white/30 text-xs mt-3">Click the link in the email to activate your account, then sign in.</p>
                          </div>
                          <button
                            onClick={() => { setTab("login"); setSignupVerified(false); }}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm shadow-lg shadow-orange-500/30 hover:from-orange-400 hover:to-orange-500 transition-all"
                          >
                            Go to Sign In
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleSignup} className="space-y-4">
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
                            <p className="text-white/40 text-sm">Join thousands of businesses</p>
                          </div>

                          <div className="space-y-3 pt-2">
                            <div className="relative">
                              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                              <input
                                type="text"
                                placeholder="Username"
                                value={signupUsername}
                                onChange={(e) => setSignupUsername(e.target.value)}
                                required
                                className={`${inputClass} pl-10`}
                              />
                            </div>
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                              <input
                                type="email"
                                placeholder="Email address"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                required
                                className={`${inputClass} pl-10`}
                              />
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                              <input
                                type={showSignupPass ? "text" : "password"}
                                placeholder="Password (min. 6 characters)"
                                value={signupPassword}
                                onChange={(e) => setSignupPassword(e.target.value)}
                                required
                                className={`${inputClass} pl-10 pr-10`}
                              />
                              <button
                                type="button"
                                onClick={() => setShowSignupPass(!showSignupPass)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                              >
                                {showSignupPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                              <input
                                type="password"
                                placeholder="Confirm password"
                                value={signupConfirm}
                                onChange={(e) => setSignupConfirm(e.target.value)}
                                required
                                className={`${inputClass} pl-10`}
                              />
                            </div>
                          </div>

                          {signupError && (
                            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                              {signupError}
                            </p>
                          )}

                          <button
                            type="submit"
                            disabled={signupLoading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm hover:from-orange-400 hover:to-orange-500 transition-all duration-200 shadow-lg shadow-orange-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {signupLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : "Create Account"}
                          </button>

                          <p className="text-center text-xs text-white/40">
                            Already have an account?{" "}
                            <button type="button" onClick={() => setTab("login")} className="text-orange-400 hover:text-orange-300 font-medium">
                              Sign in
                            </button>
                          </p>
                        </form>
                      )}
                    </motion.div>
                  )}

                  {tab === "forgot" && (
                    <motion.div
                      key="forgot-container"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {forgotStep !== "done" && (
                        <button
                          onClick={() => { setTab("login"); setForgotStep("email"); setForgotError(""); }}
                          className="flex items-center gap-1.5 text-white/40 hover:text-white/80 text-xs mb-6 transition-colors"
                        >
                          <ArrowLeft className="h-3 w-3" /> Back to Sign In
                        </button>
                      )}

                      {forgotStep === "email" && (
                        <form onSubmit={handleForgotEmail} className="space-y-4">
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Reset password</h2>
                            <p className="text-white/40 text-sm">We'll send a 6-digit OTP to your email</p>
                          </div>
                          <div className="relative pt-2">
                            <Mail className="absolute left-3.5 top-1/2 mt-1 -translate-y-1/2 h-4 w-4 text-white/30" />
                            <input
                              type="email"
                              placeholder="Your email address"
                              value={forgotEmail}
                              onChange={(e) => setForgotEmail(e.target.value)}
                              required
                              className={`${inputClass} pl-10`}
                            />
                          </div>
                          {forgotError && (
                            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{forgotError}</p>
                          )}
                          <button type="submit" disabled={forgotLoading} className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30">
                            {forgotLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending OTP...</> : "Send OTP"}
                          </button>
                        </form>
                      )}

                      {forgotStep === "otp" && (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Enter OTP</h2>
                            <p className="text-white/40 text-sm">Check your email <span className="text-orange-400">{forgotEmail}</span></p>
                          </div>
                          <div className="pt-2">
                            <input
                              type="text"
                              placeholder="6-digit OTP"
                              value={forgotOtp}
                              onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                              required
                              maxLength={6}
                              className={`${inputClass} text-center text-2xl font-bold tracking-widest`}
                            />
                          </div>
                          {forgotError && (
                            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{forgotError}</p>
                          )}
                          <button type="submit" disabled={forgotLoading || forgotOtp.length !== 6} className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30">
                            {forgotLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</> : "Verify OTP"}
                          </button>
                          <button type="button" onClick={handleForgotEmail} className="w-full text-xs text-white/40 hover:text-white/70 transition-colors">
                            Didn't receive? Resend OTP
                          </button>
                        </form>
                      )}

                      {forgotStep === "reset" && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-1">New password</h2>
                            <p className="text-white/40 text-sm">Choose a strong new password</p>
                          </div>
                          <div className="space-y-3 pt-2">
                            <div className="relative">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                              <input
                                type={showNewPass ? "text" : "password"}
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className={`${inputClass} pl-10 pr-10`}
                              />
                              <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                                {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                              <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                required
                                className={`${inputClass} pl-10`}
                              />
                            </div>
                          </div>
                          {forgotError && (
                            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{forgotError}</p>
                          )}
                          <button type="submit" disabled={forgotLoading} className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30">
                            {forgotLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Resetting...</> : "Reset Password"}
                          </button>
                        </form>
                      )}

                      {forgotStep === "done" && (
                        <div className="text-center space-y-4 py-4">
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
                            <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
                          </motion.div>
                          <h2 className="text-2xl font-bold text-white">Password Reset!</h2>
                          <p className="text-white/50 text-sm">Your password has been updated successfully.</p>
                          <button
                            onClick={() => { setTab("login"); setForgotStep("email"); }}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm shadow-lg shadow-orange-500/30"
                          >
                            Sign In Now
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
