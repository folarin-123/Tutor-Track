export default function GlobalErrorPage({ reset }) {
  return (
    <html lang="en">
      <body className="bg-[#f7f6f4] text-[#171613]">
        <main className="grid min-h-screen place-items-center px-6 text-center">
          <div className="max-w-md">
            <p className="text-sm font-bold uppercase tracking-[.16em] text-[#254c7a]">TutorTrack</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight">TutorTrack needs a restart.</h1>
            <p className="mt-3 text-sm leading-6 text-[#57544c]">
              An unexpected error stopped the app from loading. Try restarting this view.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              className="mt-6 rounded-full bg-[#2f5f97] px-5 py-3 text-sm font-bold text-white"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
