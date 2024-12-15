import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import LoadingPage from '../Components/Loading/Loading';
import VerifyOtp from '../pages/Otp/VerifyOtp';
import LoginOtp from '../pages/Otp/LoginOtp';
import HomeLayout from '../Layout/HomeLayout';
import Search from '../pages/Search';
import Message from '../pages/Messages';
import Notification from '../pages/Notifications';
import Profile from '../pages/Profile';
import UserProfile from '../pages/User/UserProfile'
import Settings from '../pages/Settings';
import CreateModal from '../Components/Modals/CreateModal';
import Counter from '../Components/Test/Test';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';
import AuthRoute from './AuthRoute';
import { loadUser } from '../redux/Actions/userActions';
import { toast } from 'react-toastify';
import toastOptions from '../constants/toast';
import Test from '../pages/Test/Test';
import ForgotPassword from '../pages/Password/Forgot';
import ResetPassword from '../pages/Password/Reset';

const Path = () => {

    const dispatch = useDispatch();
    const { userLoading, logoutMessage } = useSelector(state => state.userAuth)

    useEffect(() => {
        dispatch(loadUser());
    }, [])

    useEffect(() => {
        if(logoutMessage){
            toast.success(logoutMessage, toastOptions);
            dispatch({ type: "CLEAR_LOGOUT_MESSAGE" })
        }
    }, [logoutMessage])

    return (
        <Router>
            {
            userLoading===undefined || userLoading===true ? (
                <LoadingPage />
            ) : (
                <Routes>
                    <Route path="/" element={
                        <ProtectedRoute redirect="/">
                            <Home />
                        </ProtectedRoute>
                        } 
                    />

                    <Route path="/modal" element={<CreateModal />} />

                    <Route path="/search" element={
                        <ProtectedRoute redirect="/search">
                            <Search />
                        </ProtectedRoute>
                        } 
                    />

                    <Route path="/messages" element={
                        <ProtectedRoute>
                            <Message />
                        </ProtectedRoute>
                        } 
                    />

                    <Route path="/messages/:id" element={
                        <ProtectedRoute>
                            <Message />
                        </ProtectedRoute>
                        } 
                    />

                    <Route path="/notifications" element={
                        <ProtectedRoute>
                            <Notification />
                        </ProtectedRoute>
                        } 
                    />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                        } 
                    />

                    <Route path="/settings" element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                        } 
                    />

                    <Route path="/test" element={
                        <Test />
                        } 
                    />

                    <Route path="/user/:id" element={
                        <UserProfile />
                        } 
                    />

                    <Route path="/forgot-password" element={
                        <ForgotPassword />
                        } 
                    />

                    <Route path="/reset-password" element={
                        <ResetPassword />
                        } 
                    />



                    <Route path="/login" element={
                        <AuthRoute redirect="/">
                            <Login />
                        </AuthRoute>
                        } 
                    />
                    <Route path="/register" element={
                        <AuthRoute redirect="/">
                            <Register />
                        </AuthRoute>
                        } 
                    />
                    <Route path="/login/:id" element={
                        <AuthRoute redirect="/">
                            <LoginOtp />
                        </AuthRoute>
                        } 
                    />
                    <Route path="/verify/:id" element={
                        <AuthRoute redirect="/">
                            <VerifyOtp />
                        </AuthRoute>
                        } 
                    />

                </Routes>
            )}
        </Router>
    )
}

export default Path
