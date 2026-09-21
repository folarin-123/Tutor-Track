import "./globals.css";
import Providers from "@/components/Providers";

export const metadata = {
  title: "TutorTrack",
  description: "The calm command centre for tutoring",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
