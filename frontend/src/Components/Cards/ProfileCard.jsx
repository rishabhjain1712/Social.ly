import React from 'react'
import '../../styles/ProfileCard.css'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ProfileCard = ({bio, user, isEdit, isFollow, isUnfollow, setFollow, setUnfollow}) => {
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.follow);
  return (
    <div className="profile-header">
        <div
          className="profile-dp"
          style={{
            backgroundImage: user?.avatar?.url != 'none' ? `url(${user?.avatar?.url})` : 'url(https://via.placeholder.com/150)',
          }}
        ></div>
        <div className="profile-info">

            <div className="profile-name-cont">
                <h2 className="profile-name">{`${user?.firstName} ${user?.middleName} ${user?.lastName}`}</h2>
                {isEdit && <button className="edit-profile-btn">Edit Profile</button>}
            </div>
            {/* <h2 className="profile-name">Jane Smith</h2> */}
            <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-value">{user?.posts?.length}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{user?.followers?.length}</span>
                  <span className="stat-label">Followers</span>
                  {user?.followers.length > 0 &&
                  <div className="follow-modal">
                    <div className="follow-list">
                      <div className="follow-item">
                        {user?.followers?.map((follower, index) => (
                            <div className="follow-user" key={follower._id} onClick={() => navigate(`/user/${follower._id}`)}>
                              <img src={follower?.avatar?.url} alt={follower.username} />
                              <span>{follower?.username}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                  </div>}
                </div>
                <div className="stat-item">
                  <span className="stat-value">{user?.following?.length}</span>
                  <span className="stat-label">Following</span>
                  {user?.following.length > 0 &&
                  <div className="follow-modal">
                    <div className="follow-list">
                      <div className="follow-item">
                        {user?.following?.map((following, index) => (
                            <div className="follow-user" key={following._id} onClick={() => navigate(`/user/${following._id}`)}>
                              <img src={following?.avatar?.url} alt={following.username} />
                              <span>{following?.username}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                  </div>}
                </div>
            </div>
            <div className='profile-bio-cont'>
                {bio.map((item,index)=>
                    <p key={index} className="profile-bio">{item}</p>
                )}
            </div>
            <div className="follow-cont">
                {isFollow && 
                  <button className="follow-btn" onClick={setFollow} disabled={loading}>
                    {loading===true ? <span className="spinner"></span> : "Follow"}
                  </button>
                }
            </div>
            {isUnfollow && <div className="unfollow-cont">
                <button className="unfollow-btn" disabled={loading} onClick={setUnfollow}>
                  {loading===true ? <span className="spinner"></span> : "Unfollow"}
                </button>
                <button className="msg-btn" onClick={() => navigate(`/messages/${user?._id}`)}>Message</button>
            </div>}
        </div>
    </div>
  )
}

export default ProfileCard
