import * as React from "react";
import { Routes, Route } from 'react-router';
import LandingPageComponent from "./components/LandingPage/LandingPageComponent";
import ProjectPage from "./components/LandingPage/ProjectPageComponent";
import { ClientOnly } from "./components/Common/ClientOnly";

import SuperscalarComponent from "./components/Superscalar/SuperscalarComponent";
import VLIWComponent from "./components/VLIW/VLIWComponent";

/**
 * Legacy application shell rendered inside the RR7 catchall route.
 * BrowserRouter removed — the framework now provides the router context.
 * Routes defined here will be migrated to individual route modules incrementally.
 */
const App = () => {
    return (
        <div className="pagebody">
            <Routes>
                <Route path="/" element={<LandingPageComponent/>} />
                <Route path="/superscalar" element={
                    <ClientOnly fallback={<div>Loading simulator...</div>}>
                        {() => <SuperscalarComponent />}
                    </ClientOnly>
                } />
                <Route path="/vliw" element={
                    <ClientOnly fallback={<div>Loading simulator...</div>}>
                        {() => <VLIWComponent />}
                    </ClientOnly>
                } />
                <Route path="/project" element={<ProjectPage />} />
            </Routes>
        </div>
   );
}

export default App;
