import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/Auth.context";
import LoadingSpinner from "../Pages/LoadingSpinner";


const publicRoute=({children})=>{
    const{ isAuthenticated, loading}= useAuth();

    if(loading) 
        return (
    <>
    <div className="min-h-screen bg-linear-to-br flex-row justify-center items-center from-slate-950 via-slate-900 to-slate-950">
        <LoadingSpinner message="Fetching board..." size="lg" />
    </div>
    </> 
)

    if(isAuthenticated){
        return <Navigate to="/boards" replace />;
    }

    return children;
}

export default publicRoute;