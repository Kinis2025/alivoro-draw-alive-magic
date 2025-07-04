import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Generate from "./pages/Generate";
import DataDeletion from "./pages/DataDeletion";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ Importē stripe success un cancel lapas
import Success from "./pages/Success";
import CheckoutCancel from "./pages/CheckoutCancel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/data-deletion" element={<DataDeletion />} />

          {/* ✅ Stripe checkout success route */}
          <Route path="/checkout-success" element={<Success />} />

          {/* ✅ Stripe checkout cancel route */}
          <Route path="/checkout-cancel" element={<CheckoutCancel />} />

          {/* ✅ Protected generate route */}
          <Route
            path="/generate"
            element={
              <ProtectedRoute>
                <Generate />
              </ProtectedRoute>
            }
          />

          {/* ✅ Protected dashboard route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ✅ Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
