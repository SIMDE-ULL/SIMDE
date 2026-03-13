import React from "react";
import ReactDOM from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

/**
 * Client entry point for React Router 7 framework mode.
 * Hydrates the server-rendered (or SPA pre-rendered) HTML with the React tree.
 * Providers and global styles are defined in root.tsx, not here.
 */
ReactDOM.hydrateRoot(
  document,
  <React.StrictMode>
    <HydratedRouter />
  </React.StrictMode>,
);
