import React from "react";
import ReactDOM from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

/**
 * Client entry point for RR7 framework mode.
 * Hydrates the server-rendered (or SPA-prerendered) HTML with the React tree.
 * Providers and global styles are in root.tsx, not here.
 */
ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <HydratedRouter />
  </React.StrictMode>,
);
