import { Routes, Route } from 'react-router';
import LandingPageComponent from "./components/LandingPage/LandingPageComponent";
import ProjectPage from "./components/LandingPage/ProjectPageComponent";

import SuperscalarComponent from "./components/Superscalar/SuperscalarComponent";
import VLIWComponent from "./components/VLIW/VLIWComponent";

/**
 * Legacy application shell rendered inside the RR7 catchall route.
 * BrowserRouter removed — the framework now provides the router context.
 * Routes defined here are migrated to individual route modules incrementally.
 */
const App = () => {
    return (
        <div className="pagebody">
            <Routes>
                <Route path="/" element={<LandingPageComponent/>} />
                <Route path="/superscalar" element={<SuperscalarComponent />} />
                <Route path="/vliw" element={<VLIWComponent />} />
                <Route path="/project" element={<ProjectPage />} />
            </Routes>
        </div>
   );
}

export default App;
