import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ChatProvider } from "./contexts/ChatContext";
import { ThemeProvider } from "./contexts/ThemeContext";

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ChatProvider>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
