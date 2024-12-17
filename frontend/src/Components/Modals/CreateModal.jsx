import React, { useEffect, useState } from 'react'
import '../../styles/Modal.css'
import { X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { createPost } from '../../redux/Actions/postActions'

const CreateModal = ({onClose}) => {
    const [postDetails, setPostDetails] = useState({
        image: null,
        caption: '',
        location: '',
        mentions: ''
    })

    const dispatch = useDispatch();
    const { loading, message } = useSelector(state => state.createPost);
    const { user } = useSelector(state => state.userAuth);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostDetails({
            ...postDetails,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setPostDetails({
                    ...postDetails,
                    image: reader.result // Set the base64 image result
                });
            }
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const details = {...postDetails};
        details.mentions = details.mentions.trim().split(/\s+/);
        console.log("Det:", details);
        // setPostDetails(details);
        console.log("Post:", postDetails);
        dispatch(createPost(details));
        // onClose(false);
    };

    useEffect(() => {
        if(message) {
            onClose(false);
        }
    }, [message])

  return (
    <section className='modal-container'>
        <div className="modal-cont">
            <div className="modal" 
            >
                {
                    !postDetails.image ? (
                        <div className="inptBx">
                            <div className="close" onClick={() => onClose(false)} style={{ top: '12px', right: '12px'}}>
                                    <X className="close" />
                            </div>
                            <div className="upload-container">
                                <h2>Upload Your Picture</h2>
                                <p className="instructions">Choose a picture to upload. Preview will be shown below.</p>
                            </div>
                            <input
                                type="file"
                                id="fileInput"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }} // Hide the default input
                            />
                            <label
                                htmlFor="fileInput"
                                className="customFileInput"
                            >
                                Upload File
                            </label>
                        </div>
                    ) : (
                        <>
                            <div className="imgBx">
                                <img src={postDetails.image} alt="" />
                            </div>
                            <div className="content">
                                <div className="close" onClick={() => onClose(false)}>
                                    <X className="close" />
                                </div>
                                <div className="create">
                                    <div className="user">
                                        <img src={user?.avatar?.url} alt="" />
                                        <div className="info">
                                            <p>{user?.username}</p>
                                            {/* <p>Software Engineer</p> */}
                                        </div>
                                    </div>
                                    <div className="caption">
                                        <textarea 
                                        name="caption" id="" cols="30" rows="10" 
                                        placeholder='Write a caption...' 
                                        value={postDetails.caption} 
                                        onChange={handleChange}
                                        />
                                    </div>
                                    <div className="location">
                                        <input 
                                        type="text" 
                                        name="location"
                                        placeholder='Add location'
                                        value={postDetails.location}
                                        onChange={handleChange}
                                        />
                                    </div>
                                    <div className="location">
                                        <input 
                                        type="text" 
                                        name="mentions"
                                        placeholder='@'
                                        value={postDetails.mentions}
                                        onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className='post-btn' onClick={handleSubmit}>
                                    <button disabled={loading} >
                                        {loading===true ? <span className="spinner"></span> : "Post"}
                                    </button>
                                </div>
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    </section>
  )
}

export default CreateModal
