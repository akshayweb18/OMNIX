"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import GalaxyLogo from "@/components/ui/GalaxyLogo";

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

function Starfield() {
  const [stars, setStars] = useState([]);

  /* Random layout must not run during SSR — server vs client Math.random() caused hydration mismatches. */
  useEffect(() => {
    setStars(
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 2.5 + 0.5,
        dur: `${Math.random() * 4 + 2}s`,
        delay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.6 + 0.2,
      }))
    );
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star-field-dot"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            "--dur": s.dur,
            "--delay": s.delay,
          }}
        />
      ))}
    </div>
  );
}

function ShootingStars() {
  const streaks = useMemo(() => [
    { top: "12%", left: "8%", delay: "1s", dur: "6s" },
    { top: "38%", left: "65%", delay: "4s", dur: "8s" },
    { top: "72%", left: "25%", delay: "9s", dur: "7s" },
  ], []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {streaks.map((s, i) => (
        <div key={i} className="shooting-star" style={{ top: s.top, left: s.left, animation: `shooting-star ${s.dur} ease-in-out ${s.delay} infinite` }} />
      ))}
    </div>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const { user, loading, signIn, signUp, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [user, loading, router]);

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) { setError("Email and password are required."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (isSignUp && !name.trim()) { setError("Name is required for sign up."); return; }

    setSubmitting(true);
    try {
      if (isSignUp) await signUp(email, password, name.trim());
      else await signIn(email, password);
      router.push("/");
    } catch (err) {
      const code = err.code || "";
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential")
        setError("Invalid email or password.");
      else if (code === "auth/email-already-in-use") setError("An account with this email already exists.");
      else if (code === "auth/invalid-email") setError("Please enter a valid email.");
      else setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setSubmitting(true);
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") setError("Google sign-in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300";
  const inputStyle = { background: "rgba(11,16,40,0.7)", border: "1px solid rgba(129,140,248,0.15)", color: "var(--t1)" };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-x-hidden overflow-y-auto" style={{ background: "var(--bg)" }}>
      <Starfield />
      <ShootingStars />

      {/* Nebula blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(79,70,229,0.3), transparent 65%)", animation: "nebula-drift-1 18s ease-in-out infinite" }} />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(192,38,211,0.25), transparent 65%)", animation: "nebula-drift-2 22s ease-in-out infinite" }} />
      <div className="pointer-events-none absolute top-1/4 right-1/4 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.18), transparent 65%)", animation: "nebula-drift-3 15s ease-in-out infinite" }} />

      <div className="relative z-10 w-full max-w-md px-4 sm:px-5">

        {/* Logo with orbital rings */}
        <div className="flex flex-col items-center mb-6 sm:mb-8" style={{ animation: "greeting-enter 0.8s cubic-bezier(.22,1,.36,1) both" }}>
          <div className="relative mb-4 sm:mb-5">
            {/* Outer orbit */}
            <div className="absolute -inset-4 sm:-inset-5 rounded-full animate-orbit pointer-events-none" style={{ border: "1px dashed rgba(129,140,248,0.15)" }}>
              <div className="absolute -top-1 left-1/2 h-2 w-2 rounded-full" style={{ background: "#818cf8", boxShadow: "0 0 8px #818cf8" }} />
            </div>
            {/* Inner orbit */}
            <div className="absolute -inset-2 sm:-inset-3 rounded-full animate-orbit-rev pointer-events-none" style={{ border: "1px dashed rgba(192,132,252,0.12)" }}>
              <div className="absolute -bottom-0.5 right-0 h-1.5 w-1.5 rounded-full" style={{ background: "#c084fc", boxShadow: "0 0 6px #c084fc" }} />
            </div>
            {/* Logo */}
            <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl flex items-center justify-center animate-float"
              style={{
                background: "linear-gradient(145deg, rgba(12,16,44,0.98), rgba(21,26,62,0.95))",
                border: "1px solid rgba(129,140,248,0.3)",
                boxShadow: "0 24px 60px -18px rgba(67,56,202,0.8), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 40px -10px rgba(99,102,241,0.3)",
              }}>
              <GalaxyLogo size={36} animate={false} />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-widest brand-gradient">OMNIX</h1>
          <p className="mt-1 text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: "var(--t3)" }}>
             AI Workspace
          </p>
          <p className="mt-3 text-sm" style={{ color: "var(--t2)" }}>
            {isSignUp ? "Create your account to begin" : "Welcome back, sign in to continue"}
          </p>
        </div>

        {/* Card with glowing border */}
        <div className="auth-glow-card animate-card-enter">
          <div className="rounded-[20px] p-5 sm:p-7"
            style={{
              background: "linear-gradient(155deg, rgba(13,19,47,0.92), rgba(10,14,38,0.88))",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}>

            {/* Google button */}
            <button onClick={handleGoogle} disabled={submitting}
              className="group flex w-full items-center justify-center gap-3 rounded-xl py-3 font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(129,140,248,0.18)", color: "var(--t1)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(167,139,250,0.45)"; e.currentTarget.style.boxShadow = "0 8px 30px -8px rgba(99,102,241,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(129,140,248,0.18)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(129,140,248,0.25), transparent)" }} />
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: "var(--t3)" }}>or use email</span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(129,140,248,0.25), transparent)" }} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div style={{ animation: "stagger-fade-up 0.4s ease both" }}>
                  <label htmlFor="auth-name" className="mb-1.5 block text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: "var(--t3)" }}>
                    Full Name
                  </label>
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--t3)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                    </svg>
                    <input id="auth-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Akshay Sharma" disabled={submitting} className={inputCls} style={{ ...inputStyle, paddingLeft: 40 }}
                      onFocus={(e) => { e.target.style.borderColor = "rgba(139,92,246,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12), 0 8px 24px -8px rgba(99,102,241,0.15)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "rgba(129,140,248,0.15)"; e.target.style.boxShadow = "none"; }} />
                  </div>
                </div>
              )}

              <div style={{ animation: "stagger-fade-up 0.4s ease 0.05s both" }}>
                <label htmlFor="auth-email" className="mb-1.5 block text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: "var(--t3)" }}>
                  Email Address
                </label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--t3)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <input id="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" disabled={submitting} className={inputCls} style={{ ...inputStyle, paddingLeft: 40 }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(139,92,246,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12), 0 8px 24px -8px rgba(99,102,241,0.15)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(129,140,248,0.15)"; e.target.style.boxShadow = "none"; }} />
                </div>
              </div>

              <div style={{ animation: "stagger-fade-up 0.4s ease 0.1s both" }}>
                <label htmlFor="auth-password" className="mb-1.5 block text-[10px] font-bold tracking-[0.15em] uppercase" style={{ color: "var(--t3)" }}>
                  Password
                </label>
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--t3)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <input id="auth-password" type={showPassword ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder={isSignUp ? "Min 6 characters" : "Your password"}
                    disabled={submitting} className={inputCls} style={{ ...inputStyle, paddingLeft: 40, paddingRight: 44 }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(139,92,246,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12), 0 8px 24px -8px rgba(99,102,241,0.15)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(129,140,248,0.15)"; e.target.style.boxShadow = "none"; }} />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "var(--t3)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#a5b4fc")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--t3)")}>
                    {showPassword ? (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm rounded-xl px-3.5 py-2.5 animate-fade-in"
                  style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {error}
                </div>
              )}

              <button type="submit" disabled={submitting}
                className="gradient-btn w-full rounded-xl py-3 font-bold text-sm text-white relative overflow-hidden"
                style={{ animation: "stagger-fade-up 0.4s ease 0.15s both" }}>
                <span className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)", animation: "shimmer 3s ease infinite" }} />
                {submitting ? (
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    {isSignUp ? "Creating account..." : "Signing in..."}
                  </span>
                ) : (
                  <span className="relative z-10">{isSignUp ? "Create Account" : "Sign In"}</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Toggle */}
        <p className="mt-6 text-center text-sm" style={{ color: "var(--t2)", animation: "stagger-fade-up 0.4s ease 0.3s both" }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => { setIsSignUp((v) => !v); setError(""); }}
            className="font-bold transition-colors duration-200"
            style={{ color: "#a5b4fc" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#c4b5fd")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#a5b4fc")}>
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>

        {/* Footer */}
        <p className="mt-8 text-center text-[10px] tracking-wide" style={{ color: "var(--t3)", animation: "stagger-fade-up 0.4s ease 0.4s both" }}>
          Secured by Firebase · Powered by Omnix
        </p>
      </div>
    </div>
  );
}
