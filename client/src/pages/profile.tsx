import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { User, Phone, FileText, Lock, Save, Loader2, CheckCircle2, Eye, EyeOff, ArrowLeft, Calendar, Mail } from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated, login } = useAuth();
  const [, setLocation] = useLocation();

  // Profile state
  const [username, setUsername] = useState(user?.username ?? "");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  // Member since
  const [memberSince, setMemberSince] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
      return;
    }
    // Fetch full profile
    fetch(`/api/users/profile/${user!.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setUsername(data.user.username ?? "");
          setPhone(data.user.phone ?? "");
          setBio(data.user.bio ?? "");
          if (data.user.createdAt) {
            setMemberSince(new Date(data.user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }));
          }
        }
      })
      .catch(() => {});
  }, [isAuthenticated, user]);

  if (!isAuthenticated) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError("");
    setProfileSuccess("");
    try {
      const res = await fetch(`/api/users/profile/${user!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, phone, bio }),
      });
      const data = await res.json();
      if (data.success) {
        setProfileSuccess("Profile updated successfully!");
        // Update AuthContext user
        login({ ...user!, username: data.user.username });
      } else {
        setProfileError(data.message || "Error updating profile");
      }
    } catch {
      setProfileError("Network error. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPwError("New password must be at least 6 characters");
      return;
    }
    setPwLoading(true);
    setPwError("");
    setPwSuccess("");
    try {
      const res = await fetch(`/api/users/change-password/${user!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setPwSuccess("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPwError(data.message || "Error changing password");
      }
    } catch {
      setPwError("Network error. Please try again.");
    } finally {
      setPwLoading(false);
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/60 focus:bg-white/10 transition-all duration-200 text-sm";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="premium-bg opacity-60" />
      <div className="orb-extra-1" />
      <div className="orb-extra-2" />
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 container mx-auto px-4 md:px-6 max-w-3xl">
        {/* Back link */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setLocation("/dashboard")}
          className="flex items-center gap-2 text-white/40 hover:text-white/80 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </motion.button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-5 mb-10">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-orange-500/30">
            {user?.username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{user?.username}</h1>
            <p className="text-white/40 text-sm mt-1">{user?.email}</p>
          </div>
        </motion.div>

        {/* Account Info Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-premium rounded-2xl border border-white/10 p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><User className="h-4 w-4 text-orange-400" /> Account Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
              <Mail className="h-4 w-4 text-orange-400 shrink-0" />
              <div>
                <p className="text-xs text-white/40">Email (read-only)</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-white font-medium truncate">{user?.email}</p>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Verified
                  </span>
                </div>
              </div>
            </div>
            {memberSince && (
              <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                <Calendar className="h-4 w-4 text-orange-400 shrink-0" />
                <div>
                  <p className="text-xs text-white/40">Member Since</p>
                  <p className="text-sm text-white font-medium">{memberSince}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Edit Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-premium rounded-2xl border border-white/10 p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><User className="h-4 w-4 text-orange-400" /> Edit Profile</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className={`${inputClass} pl-10`} placeholder="Username" />
              </div>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={`${inputClass} pl-10`} placeholder="Phone number (optional)" />
              </div>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Bio</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={`${inputClass} pl-10 min-h-[90px] resize-none`}
                  placeholder="Tell us a bit about yourself (optional)"
                />
              </div>
            </div>

            {profileError && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{profileError}</p>}
            {profileSuccess && (
              <p className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> {profileSuccess}
              </p>
            )}

            <button type="submit" disabled={profileLoading} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm hover:from-orange-400 hover:to-orange-500 transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50">
              {profileLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Changes</>}
            </button>
          </form>
        </motion.div>

        {/* Change Password Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-premium rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Lock className="h-4 w-4 text-orange-400" /> Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input type={showOld ? "text" : "password"} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className={`${inputClass} pl-10 pr-10`} placeholder="Current password" />
                <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className={`${inputClass} pl-10 pr-10`} placeholder="New password (min. 6 characters)" />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={`${inputClass} pl-10`} placeholder="Confirm new password" />
              </div>
            </div>

            {pwError && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{pwError}</p>}
            {pwSuccess && (
              <p className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> {pwSuccess}
              </p>
            )}

            <button type="submit" disabled={pwLoading} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-sm hover:from-orange-400 hover:to-orange-500 transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50">
              {pwLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating...</> : <><Lock className="h-4 w-4" /> Update Password</>}
            </button>
          </form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
