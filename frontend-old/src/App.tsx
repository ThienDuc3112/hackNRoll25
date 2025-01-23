import { Routes, Route } from "react-router";
import Editor from "./pages/editor/editor";
import LandingPage from "./pages/landingPage/landingPage";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Account from "./pages/account";

function App() {
  return (
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path="/editor" element={<Editor />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/account" element={<Account />} />
    </Routes>
  );
}

export default App;
