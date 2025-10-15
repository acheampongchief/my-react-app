import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/welcomePage";
import DashboardPage from "./pages/dashboard";

const App = () => {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
    </div>
  );
};

export default App;
