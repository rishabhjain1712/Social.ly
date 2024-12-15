import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import LoadingPage from '../Components/Loading/Loading'

const AuthRoute = ({children, redirect}) => {
    const [isAuth, setIsAuth] = useState(false)
    const { userLoading, isAuthenticated } = useSelector(state => state.userAuth)

    useEffect(() => {
        if(isAuthenticated) {
            setIsAuth(true)
        }
    }, [isAuthenticated])
    
  return (
    
      userLoading===false && 
        (!isAuth ? children : <Navigate to={redirect} />)
  )
}

export default AuthRoute
