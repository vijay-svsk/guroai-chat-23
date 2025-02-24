
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Payment from "./pages/Payment";
import PaymentFailed from "./pages/PaymentFailed";
import Dashboard from "./pages/Dashboard";
import LearnMore from "./pages/LearnMore";
import NotFound from "./pages/NotFound";
import LessonPlanAI from "./pages/LessonPlanAI";
import FourAsAI from "./pages/FourAsAI";
import Auth from "./pages/Auth";
import SignUpNewAccount from "./pages/SignUpNewAccount";
import MyAccount from "./pages/MyAccount";
import DeviceRestricted from "./pages/DeviceRestricted";
import NewUserAccountLogin from "./pages/NewUserAccountLogin";
import MonthlySubscription from "./pages/MonthlySubscription";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/lesson-plan-ai" element={<LessonPlanAI />} />
          <Route path="/four-as-ai" element={<FourAsAI />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/signup-new-account" element={<SignUpNewAccount />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/device-restricted" element={<DeviceRestricted />} />
          <Route path="/newuseraccountlogin" element={<NewUserAccountLogin />} />
          <Route path="/monthlysubscription" element={<MonthlySubscription />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </React.StrictMode>
  );
}

export default App;
