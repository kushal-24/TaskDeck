import React from 'react'
import LoadingSpinner from './LoadingSpinner'

function Trial() {
    return (
        <>
        <div className=" h-screen flex justify-center items-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">            
            <LoadingSpinner message="Loading..." size="lg" />
        </div>
        </> 
    )
}

export default Trial