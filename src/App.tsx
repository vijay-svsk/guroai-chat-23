
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import LessonPlanAI from "./pages/LessonPlanAI";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={session ? <Navigate to="/dashboard" replace /> : <Index />} 
        />
        <Route 
          path="/dashboard" 
          element={session ? <Dashboard /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/lesson-plan-ai" 
          element={session ? <LessonPlanAI /> : <Navigate to="/" replace />} 
        />
        <Route path="/payment" element={<Payment />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
