import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { JobProvider } from "@/context/JobContext";
import { ChatProvider } from "@/context/ChatContext";
import { InfiniteGridBackground } from "@/components/ui/infinite-grid-background";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CreateJob from "./pages/CreateJob";
import Jobs from "./pages/Jobs";
import MyAds from "./pages/MyAds";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <JobProvider>
          <ChatProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <InfiniteGridBackground>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/create-job" element={<CreateJob />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/my-ads" element={<MyAds />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </InfiniteGridBackground>
              </BrowserRouter>
            </TooltipProvider>
          </ChatProvider>
        </JobProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
