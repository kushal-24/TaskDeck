import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/Auth.context";

const publicRoute=({children})=>{
    const{ isAuthenticated, loading}= useAuth();

    if(loading) 
        return (
    <>
    <LoadingSpinner message="Loading..." size="lg" />
    </> 
)

    if(isAuthenticated){
        return <Navigate to="/boards" replace />;
    }

    return children;
}

export default publicRoute;