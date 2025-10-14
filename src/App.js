import './App.css'; 
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import WelcomePage from './pages/welcomePage';
//import Dashboard from './pages/dashboard';
import UserName from './components/userInfo';

const App = () => {
return (
/*
  <Router>
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </Router>
*/
<div>
  <UserName />
</div>
);
}
export default App;