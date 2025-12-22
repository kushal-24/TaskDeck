import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/Auth.context";

//routes
import privateRoute from "./Routes/PrivateRoute";
import publicRoute from "./Routes/PublicRoute";

//pages
import Login from "./pages/Login";
import Board from "./pages/Board";
import notFound from "./pages/notFound";
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
            <publicRoute>
              <Login/>
            </publicRoute>
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
          element= {<notFound/>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
