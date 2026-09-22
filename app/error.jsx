import { Link } from "react-router-dom";

export default function ErrorPage({ reset }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--bg-page)] px-6 text-center text-[var(--text-primary)]">
      <div className="max-w-md">
        <p className="text-sm font-bold uppercase tracking-[.16em] text-primary-600">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">This page needs a quick reset.</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          The app hit an unexpected problem. Try the page again or return to the home screen.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-primary-500 px-5 py-3 text-sm font-bold text-white"
          >
            Try again
          </button>
          <Link
            to="/"
            className="rounded-full border border-[var(--border-default)] px-5 py-3 text-sm font-bold"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
