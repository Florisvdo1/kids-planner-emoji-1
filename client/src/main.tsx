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

// Enhanced touch detection
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Touch backend options for better handling
const touchBackendOptions = {
  enableMouseEvents: true,
  enableTouchEvents: true,
  enableKeyboardEvents: true,
  delayTouchStart: 0,
  enableHoverOutsideTarget: true,
  ignoreContextMenu: true,
  preview: true,
  getNextTargetElementFromXY: true,
  scrollAngleRanges: [
    { start: 30, end: 150 },
    { start: 210, end: 330 }
  ]
};

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
      <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend} options={isTouchDevice ? touchBackendOptions : undefined}>
        <Router />
        <Toaster />
      </DndProvider>
    </QueryClientProvider>
  </StrictMode>,
);
