import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import toastOptions from '../constants/toast'
import { saveAndUnsavePost } from '../redux/Actions/postActions'
import { Bookmark } from 'lucide-react'

const usePostSave = ({post}) => {
    const dispatch = useDispatch()
    const [saved, setSaved] = useState(false)
    const { message, error } = useSelector((state) => state.savePost)
    const { user } = useSelector((state) => state.userAuth)

    const savePost = (id) => {
        dispatch(saveAndUnsavePost(id))
    }

    const SavedIcon = () => {
        return (
            <Bookmark className="action-icon" style={{
                color: post?.saved?.some((save) => save._id === user?._id) ? '#00bfff' : 'inherit',
                fill: post?.saved?.some((save) => save._id === user?._id) ? '#00bfff' : 'inherit',
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
            setSaved(true)
            // toast.success(message, toastOptions)
            dispatch({ type: "CLEAR_MESSAGE" })
        }
    }, [error, message, dispatch, toastOptions])

    return { savePost, SavedIcon, saved, setSaved }
}

export default usePostSave
