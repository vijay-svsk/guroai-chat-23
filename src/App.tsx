
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Payment from "./pages/Payment";
import Dashboard from "./pages/Dashboard";
import LearnMore from "./pages/LearnMore";
import NotFound from "./pages/NotFound";
import LessonPlanAI from "./pages/LessonPlanAI";
import Auth from "./pages/Auth";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/lesson-plan-ai" element={<LessonPlanAI />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </React.StrictMode>
  );
}

export default App;
