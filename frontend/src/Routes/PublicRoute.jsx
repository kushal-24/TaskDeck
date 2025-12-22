import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Auth.context";

const publicRoute=({children})=>{
    const{ isAuthenticated, loading}= useAuth();

    if(loading) return <p>Loading...</p>

    if(isAuthenticated){
        return <Navigate to="/boards" replace />;
    }

    return children;
}

export default publicRoute;