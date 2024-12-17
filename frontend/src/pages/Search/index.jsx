import React, { useState, useEffect, useRef } from 'react';
import HomeLayout from '../../Layout/HomeLayout'
import { Search as SearchIcon, MoreHorizontal } from 'lucide-react';
import '../../styles/SearchPage.css';
import PostCard from '../../Components/Cards/PostCard';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import toastOptions from '../../constants/toast';
import { getAllPosts } from '../../redux/Actions/postActions';
import axios from 'axios';
import { BACKEND_URL } from '../../constants/urls';
import { useNavigate } from 'react-router-dom';
import useModal from '../../hooks/useModal';
import ViewPostModal from '../../Components/Modals/ViewPostModal';

const SearchPage = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [postData, setPostData] = useState([]);

  const activeRequestRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts, error } = useSelector(state => state.allPosts)

  const { isModalOpen, activePost, handlePostClick, setIsModalOpen } = useModal();

  const onLoading = () => {
    dispatch(getAllPosts());
  }

  const handleLike = () => {
    dispatch(getAllPosts());
  };

  const handleSave = () => {
    dispatch(getAllPosts());
  };

  const handleCommentClick = (id) => {
    handlePostClick(id)
  };

  useEffect(() => {
    if (!query) {
      setSuggestedUsers([
        { id: 1, name: 'John Doe', location: 'New York', avatar: 'https://via.placeholder.com/40' },
        { id: 2, name: 'Jane Smith', location: 'London', avatar: 'https://via.placeholder.com/40' },
        { id: 3, name: 'Alice Johnson', location: 'Tokyo', avatar: 'https://via.placeholder.com/40' },
      ]);
    }
  }, [query]);

  useEffect(() => {
    if(error){
      toast.error(error, toastOptions);
      dispatch({ type: "CLEAR_ERROR" })
    }
    if(posts){
      setPostData(posts)
    }
  }, [error, dispatch, posts, toastOptions]);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [])

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous debounce timer
    if (activeRequestRef.current) {
      clearTimeout(activeRequestRef.current);
    }

    // Set up a new debounce timer
    activeRequestRef.current = setTimeout(() => {
      performSearch(value);
    }, 100);
  };

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]); // Clear results for empty query
      return;
    }

    // Create a cancel token for axios
    const source = axios.CancelToken.source();
    activeRequestRef.current = source;

    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/user/search?query=${query}`, {
        cancelToken: source.token, // Attach cancel token
      });
      setSearchResults(response.data.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Previous request canceled:', error.message);
      } else {
        console.error('Search error:', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (activeRequestRef.current) {
        clearTimeout(activeRequestRef.current); // Clear debounce timer
        activeRequestRef.current.cancel('Component unmounted'); // Cancel ongoing request
      }
    };
  }, []);

  useEffect(() => {
    if(isModalOpen){
      onClose(true);
    } else {
      onClose(false);
    }
  }, [isModalOpen])

  return (
    <div className="search-page">
      <div className="search-input-container">
        <SearchIcon className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search for users..."
          value={query}
          onChange={handleSearch}
        />
      </div>

      <div className="results-section">
        {query ? (
          <ul className="results-list">
            {searchResults.map((user) => (
              <li key={user._id} className="user-item" onClick={() => navigate(`/user/${user._id}`)}>
                <div className="user-avatar" style={{ backgroundImage: `url(${user?.avatar?.url})` }}></div>
                <div className="user-info">
                  <h4 className="user-name">{user.username}</h4>
                  <p className="user-location">{user.firstName} {user.middleName} {user.lastName}</p>
                </div>
                {/* <MoreHorizontal className="more-icon" /> */}
              </li>
            ))}
          </ul>
        ) : (
          <div className="card" style={{ 
            display: 'flex',
            justifyContent: 'center',
          }}>
            <PostCard posts={postData} onLike={handleLike} onSave={handleSave} onComment={handleCommentClick} />
          </div>
        )}
      </div>
      {
        isModalOpen && (
          <ViewPostModal
            post={activePost}
            onClose={() => setIsModalOpen(false)}
            onLoad={() => onLoading()}
          />
        )
      }
    </div>
  );
};



const Search = () => (
    <HomeLayout>
        {<SearchPage />}
    </HomeLayout>
)

export default Search
