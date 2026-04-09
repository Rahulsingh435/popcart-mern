import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <Routes>
        {/* '/' par naya Shadcn wala Home page khulega */}
        <Route path="/" element={<Home />} />
        
        {/* '/admin' par aapka yeh form wala Admin Dashboard khulega */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;