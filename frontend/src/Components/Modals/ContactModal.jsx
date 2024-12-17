import React, { useEffect, useState } from 'react'
import '../../styles/ContactModal.css'
import { X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { contactUs } from '../../redux/Actions/userActions'

const ContactModal = ({onClose}) => {
    const [contact, setContact] = useState({
        fullName: '',
        email: '',
        mobile: '',
        subject: 'Suggestion',
        msg: ''
    })

    const dispatch = useDispatch();
    const { loading, message } = useSelector(state => state.contact);
    const { user } = useSelector(state => state.userAuth);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContact({
            ...contact,
            [name]: value
        });
    };

    useEffect(() => {
        if(user) {
            setContact({
                ...contact,
                fullName: user?.firstName + ' ' + user?.middleName + ' ' + user?.lastName,
                email: user?.email,
                mobile: user?.mobile,
                subject: `Suggestion from ${user?.username}`,
            })
        }
    }, [user])

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(contactUs(contact));
    };

    useEffect(() => {
        if(message) {
            onClose(false);
        }
    }, [message])

  return (
    <section className='modal-container'>
        <div className="modal-contact">
            <div className="modal"
            >
                {
                    (
                        <>
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
                                    <div className='info'>
                                        <div className="location">
                                            <input 
                                            type="text" 
                                            name="fullName"
                                            placeholder='Full Name'
                                            value={contact.fullName}
                                            onChange={handleChange}
                                            readOnly
                                            />
                                        </div>
                                        <div className="location">
                                            <input 
                                            type="email" 
                                            name="email"
                                            placeholder='Email'
                                            value={contact.email}
                                            onChange={handleChange}
                                            readOnly
                                            />
                                        </div>

                                    </div>
                                    <div className="info">
                                        <div className="location">
                                            <input 
                                            type="number" 
                                            name="mobile"
                                            placeholder='Phone No.'
                                            value={contact.mobile}
                                            onChange={handleChange}
                                            readOnly
                                            />
                                        </div>
                                        <div className="location">
                                            <input 
                                            type="text" 
                                            name="subject"
                                            placeholder='Subject'
                                            value={contact.subject}
                                            onChange={handleChange}
                                            required
                                            />
                                        </div>
                                    </div>
                                    <div className="caption">
                                        <textarea 
                                        name="msg" id="" cols="30" rows="10" 
                                        placeholder='Write a message...' 
                                        value={contact.msg} 
                                        onChange={handleChange}
                                        style={{width: '97%'}}
                                        required
                                        />
                                    </div>
                                </div>
                                <div className='post-btn' onClick={handleSubmit}>
                                    <button disabled={loading} >
                                        {loading===true ? <span className="spinner"></span> : "Send Message"}
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

export default ContactModal
