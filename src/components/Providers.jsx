
import { ThemeProvider } from "@/lib/theme";
import { ToastProvider } from "@/lib/toast";
import { AuthProvider } from "@/lib/auth";
import { StoreProvider } from "@/lib/store";

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <ToastProvider>{children}</ToastProvider>
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
