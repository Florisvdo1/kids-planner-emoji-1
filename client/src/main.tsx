import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "./pages/Home";

// Detect touch device
const isTouchDevice = 'ontouchstart' in window;

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route>404 Page Not Found</Route>
    </Switch>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
        <Router />
        <Toaster />
      </DndProvider>
    </QueryClientProvider>
  </StrictMode>,
);