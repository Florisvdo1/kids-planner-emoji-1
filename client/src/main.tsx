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
  enableMouseEvents: false, // Desktop interactions disabled
  enableTouchEvents: true,
  delayTouchStart: 0,
  touchSlop: 10, // More forgiving touch detection
  enableHoverOutsideTarget: false,
  ignoreContextMenu: true,
  preview: true,
  getNextTargetElementFromXY: true,
  enableKeyboardEvents: false,
  enableTapClick: false,
  touchReleaseDelay: 100, // Increased delay for better drop handling
  anchors: ['button'],
  offsetTarget: { 
    x: 0, 
    y: -20 // Increased offset to prevent finger from blocking view
  },
  scrollAngleRanges: null, // Disable scroll detection
  onScheduleHover: () => {
    document.body.classList.add('dragging');
    // Prevent scroll during drag
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  },
  onEndDrag: () => {
    document.body.classList.remove('dragging');
    // Re-enable scroll after drag
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  },
  // Enhanced preview handling
  previewOptions: {
    captureDraggingState: true,
    showPreview: true
  }
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
// Register Service Worker with enhanced offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
        updateViaCache: 'none'
      });
      
      console.log('ServiceWorker registration successful with scope:', registration.scope);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available
              const notification = document.createElement('div');
              notification.className = 'fixed bottom-4 left-4 right-4 bg-primary text-white p-4 rounded-lg shadow-lg z-50 flex justify-between items-center';
              notification.innerHTML = `
                <span>New content is available! Click to update.</span>
                <button class="px-4 py-2 bg-white/20 rounded hover:bg-white/30 transition-colors">
                  Update
                </button>
              `;
              
              notification.querySelector('button')?.addEventListener('click', () => {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              });
              
              document.body.appendChild(notification);
            }
          });
        }
      });
      
      // Handle offline/online status changes
      window.addEventListener('online', () => {
        document.body.classList.remove('offline');
        registration.update(); // Check for updates when coming back online
      });
      
      window.addEventListener('offline', () => {
        document.body.classList.add('offline');
      });
      
    } catch (error) {
      console.error('ServiceWorker registration failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  });
}
