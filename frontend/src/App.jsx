import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/Auth.context.jsx";

//routes
import PrivateRoute from "./Routes/PrivateRoute";
import PublicRoute from "./Routes/PublicRoute";

//pages
import Login from "./Pages/Login.jsx";
import Board from "./Pages/Board.jsx";
import Boards from "./Pages/Boards.jsx";
import Signup from "./Pages/Signup.jsx";
import CreateBoard from "./Pages/CreateBoard.jsx";
import LandingPage from "./Pages/LandingPage.jsx";
import InvalidRoute from "./Pages/InvalidRoute.jsx";
import Trial from "./Pages/Trial.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Private routes */}

          <Route
            path="/boards"
            element={
              <PrivateRoute>
                <Boards />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/boards/new"
            element={
              <PrivateRoute>
                <CreateBoard/>
              </PrivateRoute>
            }
          />

          <Route
            path="/trial"
            element={
              <PrivateRoute>
                <Trial/>
              </PrivateRoute>
            }
          />

          <Route
            path="/boards/:boardId"
            element={
              <PrivateRoute>
                <Board />
              </PrivateRoute>
            }
          />
          <Route 
          path="*" 
          element={<InvalidRoute />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
