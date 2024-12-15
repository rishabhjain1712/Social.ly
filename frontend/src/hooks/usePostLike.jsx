import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import toastOptions from '../constants/toast'
import { likeAndUnlikePost } from '../redux/Actions/postActions'
import { Heart } from 'lucide-react'

const usePostLike = ({post}) => {
    const dispatch = useDispatch()
    const [liked, setLiked] = useState(false)
    const { message, error } = useSelector((state) => state.likePost)
    const { user } = useSelector((state) => state.userAuth)

    const likePost = (id) => {
        dispatch(likeAndUnlikePost(id))
    }

    const LikedIcon = () => {
        return (
            <Heart className="action-icon" style={{
                color: post?.likes?.some((like) => like._id === user?._id) ? 'red' : 'inherit',
                fill: post?.likes?.some((like) => like._id === user?._id) ? 'red' : 'inherit',
                transition: 'color 0.5s ease, fill 0.5s ease'
            }} />
        )
    }

    useEffect(() => {
        if (error) {
            toast.error(error, toastOptions)
            dispatch({ type: "CLEAR_ERROR" })
        }
        if(message) {
            setLiked(true)
            // toast.success(message, toastOptions)
            dispatch({ type: "CLEAR_MESSAGE" })
        }
    }, [error, message, dispatch, toastOptions])

    return { likePost, LikedIcon, liked, setLiked }
}

export default usePostLike
