import { useAuth } from "../Context/Auth.context";
import { Navigate } from "react-router-dom";

const privateRoute=({children})=>{
    const{isAuthenticated, loading}=useAuth();

    if(loading){
        return <p>Loading</p>
    }
    if(!isAuthenticated){
        return <Navigate to="/login" replace/> //“Replace the current URL in history instead of adding a new one.”
    }

    return children;
};

export default privateRoute;