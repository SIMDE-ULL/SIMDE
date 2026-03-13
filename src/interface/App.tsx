import * as React from "react";
import { BrowserRouter, Routes, Route } from 'react-router';
import LandingPageComponent from "./components/LandingPage/LandingPageComponent";
import ProjectPage from "./components/LandingPage/ProjectPageComponent";

import SuperscalarComponent from "./components/Superscalar/SuperscalarComponent";
import VLIWComponent from "./components/VLIW/VLIWComponent";


/**
 * Legacy application shell with BrowserRouter.
 * Rendered inside the catchall route during migration.
 * Routes defined here are moved to individual route modules incrementally.
 */
const App = () => {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL} >
            <div className="pagebody">
            <React.Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<LandingPageComponent/>} />
                    <Route path="/superscalar" element={<SuperscalarComponent />} />
                    <Route path="/vliw" element={<VLIWComponent />} />
                    <Route path="/project" element={<ProjectPage />} />
                </Routes>
            </React.Suspense>
            </div>
        </BrowserRouter>
   );
}

export default App;
