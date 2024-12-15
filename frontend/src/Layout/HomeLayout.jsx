import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar/Sidebar';
import RightSidebar from '../Components/RightSideBar/RightSideBar';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import toastOptions from '../constants/toast';

const HomeLayout = (props) => {

    const { children } = props;
    const [isHalf, setIsHalf] = useState(true);
    const [zInd, setZInd] = useState(0);
    const location = useLocation();

    const dispatch = useDispatch();
    const { message, error } = useSelector(state => state.createPost);

    const handleModal = (data) => {
        setZInd(data ? -1 : 0);
    }

    useEffect(() => {
        if(location.pathname.startsWith('/messages') || location.pathname === '/profile') {
            setIsHalf(false)
        }
    }, [location])

    useEffect(() => {
        if(message) {
            toast.success(message, toastOptions);
            dispatch({
                type: 'CLEAR_MESSAGE'
            })
        }
        if(error) {
            toast.error(error, toastOptions);
            dispatch({
                type: 'CLEAR_ERROR'
            })
        }
    }, [error, message])


  return (
    <div style={{ display: 'flex', height: '100vh', gap: 0, background: '#000', color: 'white' }}>

        <div style={{ width: '20%' }}>
            <Sidebar onClose={handleModal}
            />
        </div>
        
        <div style={{ width: isHalf ? '60%' : '80%', display: 'flex', height: '100%', overflowX: 'hidden', maxWidth: '100%', marginLeft: 0 }}>
                {/* {children} */}
                {React.cloneElement(children, { onClose: handleModal })}
        </div>

        {isHalf &&
        <div style={{ width: '20%' }}>
            <RightSidebar zInd={zInd} />
        </div>}
    </div>
  );
};

export default HomeLayout;
