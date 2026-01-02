import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './Pages/LandingPage.jsx'
import Login from './Pages/Login.jsx'
import SignUp from './Pages/Signup.jsx'
import Boards from './Pages/Boards.jsx'
import CreateBoardModal from './Components/CreateBoardModal.jsx'
import BoardHeader from './Pages/Board.jsx'
import Board from './Pages/Board.jsx'

//ROUTES
import PrivateRoute from '../../frontend/src/Routes/PrivateRoute.jsx'
import PublicRoute from '../../frontend/src/Routes/PublicRoute.jsx'

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
                <SignUp />
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
            path="/boards/:boardId"
            element={
              <PrivateRoute>
                <Board />
              </PrivateRoute>
            }
          />

          <Route 
          path="*" 
          element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;