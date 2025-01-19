import { Routes, Route } from "react-router";
import Editor from "./pages/editor/editor";
import LandingPage from "./pages/editor/landingpage";

function App() {
  return <Routes>
    <Route index element={<LandingPage />} />
    <Route path="/editor" element={<Editor />} />
  </Routes>;
}

export default App;
