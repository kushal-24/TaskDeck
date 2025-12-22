import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/Auth.context";

//routes
import PrivateRoute from "./Routes/PrivateRoute";
import PublicRoute from "./Routes/PublicRoute";

//pages
import Login from "./pages/Login";
import Board from "./pages/Board";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";

function App() {
  const [count, setCount] = useState(0);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route
          path="/login"
          element= {
            <PublicRoute>
              <Login/>
            </PublicRoute>
          }
          />

          {/* Private routes */}
          <Route
          path="/board"
          element= {
            <privateRoute>
              <Board/>
            </privateRoute>
          }
          />


          <Route
          path="*"
          element= {<NotFound/>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
