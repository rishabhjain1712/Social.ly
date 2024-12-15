import React, { useEffect, useState } from 'react'
import HomeLayout from '../../Layout/HomeLayout'
import "../../styles/Notifications.css";
import { useDispatch, useSelector } from 'react-redux';
import { myNotifications } from '../../redux/Actions/userActions';
import { toast } from 'react-toastify';
import toastOptions from '../../constants/toast';

const NotificationPage = () => {
  // const notifications = [
  //   {
  //     id: 1,
  //     avatar: "https://via.placeholder.com/40",
  //     message: "John Doe liked your post.",
  //     time: "2h ago",
  //   },
  //   {
  //     id: 2,
  //     avatar: "https://via.placeholder.com/40",
  //     message: "Jane Smith commented: 'Great post!'",
  //     time: "4h ago",
  //   },
  //   {
  //     id: 3,
  //     avatar: "https://via.placeholder.com/40",
  //     message: "Alice Johnson started following you.",
  //     time: "1d ago",
  //   },
  //   {
  //     id: 4,
  //     avatar: "https://via.placeholder.com/40",
  //     message: "David Williams liked your comment.",
  //     time: "3d ago",
  //   },
  // ];

  const [notifs, setNotifs] = useState([]);
  const [message, setMesssage] = useState("");
  const dispatch = useDispatch();
  const { error, notifications } = useSelector(state => state.notification);

  useEffect(() => {
    dispatch(myNotifications());
  }, [dispatch]);

  const getMsg = (notifications) => {

    let mssge=[], msg;
    notifications.forEach((notification) => {
      if(notification.activity === "follow") {
        msg = `${notification?.owner?.username} started following you`
      } else if(notification.activity === "unfollow") {
        msg = `${notification?.owner?.username} unfollowed you`
      } else if(notification.activity === "comment") {
        msg = `${notification?.owner?.username} commented on your post`
      } else if(notification.activity === "reply") {
        if(notification.entity === "Comment") {
          msg = `${notification?.owner?.username} replied to your comment ${notification?.comment?.comment}`
        } else {
          msg = `${notification?.owner?.username} replied to a comment on your post`
        }
      } else {
        if(notification.entity === "Post") {
          msg = `${notification?.owner?.username} liked your post`
        } else if(notification.entity === "Comment") {
          msg = `${notification?.owner?.username} liked your comment ${notification?.comment?.comment}`
        } else {
          msg = `${notification?.owner?.username} liked your reply ${notification?.reply?.reply}`
        }
      }
      mssge.push(msg);
    })
    // return msg;
    setMesssage(mssge);
  }

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
      dispatch({ type: "CLEAR_ERROR" });
    }
    if(notifications) {
      setNotifs(notifications);
      getMsg(notifications);
    }
  }, [error, dispatch, notifications, toastOptions]);

  return (
    <div className="notification-page">
      <h3 className="notification-title">Notifications</h3>
      <ul className="notification-list">
        {notifs && notifs.length>0 && notifications.map((notification, index) => {
        return (
          <li key={notification._id} className="notification-item">
            <div className="notification-info">
              <div
                className="notification-avatar"
                style={{ backgroundImage: `url(${notification?.owner?.avatar?.url})` }}
              ></div>
              <div className="notification-content">
                <p className="notification-message">{message[index]}</p>
                <span className="notification-time">{"3w"}</span>
              </div>
            </div>
            <div className='post-info'>
              <div
                className="post-avatar"
                style={{ backgroundImage: `url(${notification?.post?.image?.url})` }}
              ></div>
            </div>
          </li>
        )
      })}
      </ul>
    </div>
  );
};


const Notifications = () => (
    <HomeLayout>
        {<NotificationPage />}
    </HomeLayout>
)

export default Notifications
