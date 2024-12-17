import React, { useEffect, useState } from 'react';
import {
  Home, User, Bell, MessageCircle, Settings, Search, SquarePlusIcon, NotebookPenIcon
} from 'lucide-react';
import '../../styles/Sidebar.css';
import Logo from '../Logo/Logo';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CreateModal from '../Modals/CreateModal';
import { logoutUser } from '../../redux/Actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import LogoutModal from '../Modals/LogoutModal';
import ContactModal from '../Modals/ContactModal';
import { toast } from 'react-toastify';
import toastOptions from '../../constants/toast';

const postData = {
    image: "https://via.placeholder.com/600",
    ownerAvatar: "https://via.placeholder.com/100",
    ownerName: "John Doe",
    caption: "Enjoying the beach vibes! 🌊 But eventually this is not enough to keep it continue jsbdshjds djsd hsd hsdhsds ksdbhsds ksdsds ksdksdks skdksdks ndksdksd sdksdskd sdksdnjksd sndskdsd nsdjndjsndjsd skjndjsndjkd dwjkdwjd sdsjkdnjdnjwd kjdjwndjwd wdkjkdnwjdnwjkd",
    likes: 120,
    comments: [
      {
        id: 1,
        avatar: "https://via.placeholder.com/50",
        username: "JaneSmith",
        text: "Wow! This looks amazing! Or may be you can try something else",
        likes: 10,
        replies: [
          {
            id: 1.1,
            avatar: "https://via.placeholder.com/40",
            username: "MarkJ",
            text: "Totally agree! Or whatver you want to say",
            likes: 5,
          },
          {
            id: 1.2,
            avatar: "https://via.placeholder.com/40",
            username: "MarkJ",
            text: "Just fantastic! Really loved it",
            likes: 5,
          },
        ],
      },
      {
        id: 2,
        avatar: "https://via.placeholder.com/50",
        username: "JaneSmith",
        text: "Wow! This looks amazing!",
        likes: 10,
        replies: [
          {
            id: 1.1,
            avatar: "https://via.placeholder.com/40",
            username: "MarkJ",
            text: "Totally agree!",
            likes: 5,
          },
        ],
      },
      {
        id: 3,
        avatar: "https://via.placeholder.com/50",
        username: "JaneSmith",
        text: "Wow! This looks amazing!",
        likes: 10,
        replies: [
          {
            id: 1.1,
            avatar: "https://via.placeholder.com/40",
            username: "MarkJ",
            text: "Totally agree!",
            likes: 5,
          },
        ],
      },
    ],
};

const Sidebar = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openContactModal, setOpenContactModal] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  const [username, setUsername] = useState('');

  const [selectedItem, setSelectedItem] = useState({ label: 'Home', route: '/' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();

  const { isAuthenticated, user } = useSelector(state => state.userAuth);
  const { message, error } = useSelector(state => state.contact);

  const menuItems = [
    { icon: Home, label: 'Home', route: '/' },
    { icon: Search, label: 'Search', route: '/search' },
    { icon: SquarePlusIcon, label: 'Create' },
    { icon: MessageCircle, label: 'Messages', route: '/messages' },
    { icon: Bell, label: 'Notifications', route: '/notifications' },
    { icon: User, label: 'Profile', route: '/profile' },
    { icon: Settings, label: 'Settings', route: '/settings' },
    { icon: NotebookPenIcon, label: 'Contact' },
  ];

  const handleItemClick = (item) => {
    if(item.label === 'Create') {
      setOpenCreateModal(true);
      onClose(true)
    } else if(item.label === 'Contact') {
      setOpenContactModal(true);
      onClose(true)
    }
    if(item.label !== 'Create') {
        setSelectedItem({ label: item.label, route: item.route });
        navigate(item.route); 
    } 
  };

  const handleLogoutOpenModal = () => {
    setOpenLogoutModal(true);
    // dispatch(logoutUser());
  }

  const handleCloseModal = (e) => {
    // e.stopPropagation(); // Prevent event bubbling
    setOpenCreateModal(false);
    onClose(false);
  };

  const handleContactCloseModal = (e) => {
    // e.stopPropagation(); // Prevent event bubbling
    setOpenContactModal(false);
    onClose(false);
  };

  const handleLogoutCloseModal = (e) => {
    // e.stopPropagation(); // Prevent event bubbling
    setOpenLogoutModal(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (message) {
      toast.success(message, toastOptions);
      dispatch({ type: "CLEAR_MESSAGE" })
    }
    if(error) {
      toast.error(error, toastOptions);
      dispatch({ type: "CLEAR_ERROR" })
    }
  }, [message, error, dispatch, toastOptions]);

  useEffect(() => {
      if (openCreateModal || openLogoutModal) {
          document.body.style.overflow = "hidden"; // Disable scroll
      } else {
          document.body.style.overflow = ""; // Restore scroll
      }

      // Cleanup when the component unmounts
      return () => {
          document.body.style.overflow = "";
      };
  }, [openCreateModal, openLogoutModal]);


  return (
    <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
        <aside className={`sidebar ${isOpen ? 'expanded' : 'collapsed'}`}>
            <nav className="sidebar-nav">
            <Logo size="2rem" />
            <ul className="menu-list">
                {menuItems.map((item, index) => (
                    <li
                        key={index} 
                        className={`menu-item ${
                            item.route === '/' 
                              ? location.pathname === '/' ? 'selected' : '' 
                              : location.pathname.startsWith(item.route) ? 'selected' : ''
                        }`}
                        onClick={() => handleItemClick(item)}
                    >
                        <div className="menu-link">
                            <item.icon className="menu-icon" />
                            {isOpen && <span className="menu-text">{item.label}</span>}
                        </div>
                    </li>
                ))}
            </ul>
            <div className="logout-section" onClick={handleLogoutOpenModal}>
                <Link href="#" className="menu-link">
                <User className="menu-icon" />
                    <span className="menu-text">{username}</span>
                </Link>
            </div>
            </nav>
        </aside>
        {openCreateModal && (
            <div className="overlay" >
                <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <CreateModal onClose={handleCloseModal} />
                </div>
            </div>
            
            )
        }
        {openContactModal && (
            <div className="overlay" onClick={handleCloseModal}>
                <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ContactModal onClose={handleContactCloseModal} />
                </div>
            </div>
            
            )
        }
        {openLogoutModal && (
            <div className="overlay" onClick={handleCloseModal}>
                <div
                    className="modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <LogoutModal onClose={handleLogoutCloseModal} onConfirm={handleLogout} />
                </div>
            </div>
            
            )
        }
    </div>
    );
};

export default Sidebar;
