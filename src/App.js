import './App.css';
import Blog from './Blog/Blog';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute'; // Import it

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login />} />
        <Route
          path='/blog'
          element={
            <ProtectedRoute>
              <Blog />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
