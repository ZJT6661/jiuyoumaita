
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GoalDetail from "./pages/GoalDetail";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/goal/:id" element={<GoalDetail />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}
