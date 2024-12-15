import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {

    const [isAuth, setIsAuth] = useState(true)
    const { userLoading, isAuthenticated } = useSelector(state => state.userAuth)

    useEffect(() => {
        if(!isAuthenticated) {
            setIsAuth(false)
        }
    }, [isAuthenticated])

  return (
    userLoading===false && isAuth ? children : <Navigate to="/login" />
  )
}

export default ProtectedRoute
