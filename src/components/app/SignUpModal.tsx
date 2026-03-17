import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Crown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SignUpModalProps {
  open: boolean;
  onClose: () => void;
  creatorName?: string;
  creatorPrice?: string;
  creatorAvatar?: string;
}

const SignUpModal = ({ open, onClose, creatorName, creatorPrice, creatorAvatar }: SignUpModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock sign-up — navigate to home
    navigate("/home");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-card rounded-3xl w-full max-w-md shadow-lift overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header gradient */}
            <div className="relative gradient-promo px-6 pt-8 pb-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors"
              >
                <X size={16} className="text-primary-foreground" />
              </button>

              {creatorAvatar ? (
                <div className="flex items-center gap-4 mb-3">
                  <img src={creatorAvatar} alt="" className="w-14 h-14 rounded-full border-2 border-primary-foreground/30" />
                  <div>
                    <p className="text-primary-foreground/80 text-sm font-medium">Subscribe to</p>
                    <h2 className="text-xl font-bold text-primary-foreground">{creatorName}</h2>
                    {creatorPrice && (
                      <p className="text-primary-foreground/90 text-sm font-semibold">{creatorPrice}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mb-2">
                  <Sparkles size={28} className="text-primary-foreground mb-2" />
                  <h2 className="text-2xl font-bold text-primary-foreground">Join KEETH</h2>
                  <p className="text-primary-foreground/80 text-sm mt-1">
                    Get access to exclusive creator content
                  </p>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl gradient-promo text-primary-foreground font-bold text-[15px] hover:opacity-90 transition-all duration-200 hover:-translate-y-0.5 shadow-lift flex items-center justify-center gap-2"
              >
                <Crown size={18} />
                {mode === "signup" ? "Create Account & Subscribe" : "Log In"}
              </button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { navigate("/home"); onClose(); }}
                className="w-full py-3 rounded-xl border border-border text-foreground font-medium text-sm hover:bg-secondary transition-all flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>

              <p className="text-center text-sm text-muted-foreground">
                {mode === "signup" ? (
                  <>Already have an account?{" "}
                    <button type="button" onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">
                      Log in
                    </button>
                  </>
                ) : (
                  <>Don't have an account?{" "}
                    <button type="button" onClick={() => setMode("signup")} className="text-primary font-semibold hover:underline">
                      Sign up
                    </button>
                  </>
                )}
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignUpModal;
