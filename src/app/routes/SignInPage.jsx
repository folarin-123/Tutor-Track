
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { isStrongPassword, PASSWORD_HINT, useAuth } from "@/lib/auth";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate(`/${user.role}`, { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password to continue.");
      return;
    }
    if (!isStrongPassword(password)) {
      setError(PASSWORD_HINT);
      return;
    }
    setError("");
    setResetMessage("");
    setSubmitting(true);
    try {
      await signIn({ email: email.trim(), password });
      // Navigation happens automatically once `user` resolves, via the effect above.
    } catch {
      setError("Incorrect email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell eyebrow="Welcome back">
      <h1 className="mt-8 text-3xl font-extrabold tracking-tight">Sign in to your space</h1>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
        Sign in with the email and password you registered with.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-bold" htmlFor="signin-email">
          Email address
          <input
            id="signin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="mt-2 w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 font-normal outline-primary-500"
          />
        </label>
        <label className="block text-sm font-bold" htmlFor="signin-password">
          Password
          <div className="relative mt-2">
            <input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              className="w-full rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 pr-12 font-normal outline-primary-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-3 grid w-9 place-items-center text-[var(--text-secondary)]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
        <button
          type="button"
          onClick={async () => {
            setError("");
            setResetMessage("");
            if (!email.trim()) {
              setError("Enter your email first to reset your password.");
              return;
            }
            try {
              await resetPassword(email.trim());
            } catch {
              // Always show the same confirmation so we never reveal whether the email is registered.
            }
            setResetMessage("If an account exists for that email, a reset link has been sent.");
          }}
          className="text-sm font-bold text-primary-600"
        >
          Forgot password?
        </button>
        {error && <p className="text-sm font-semibold text-danger-500">{error}</p>}
        {resetMessage && <p className="text-sm font-semibold text-danger-500">{resetMessage}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary-500 py-3.5 font-bold text-white disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"} <ArrowRight size={17} />
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        New here?{" "}
        <Link to="/signup" className="font-bold text-primary-600">
          Get started
        </Link>
      </p>
    </AuthShell>
  );
}