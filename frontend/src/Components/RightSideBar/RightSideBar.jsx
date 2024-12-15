
import React, { useEffect } from "react";
import "../../styles/RightSidebar.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllOtherUsers } from "../../redux/Actions/userActions";
import { toast } from "react-toastify";
import toastOptions from "../../constants/toast";
import { useNavigate } from "react-router-dom";

const RightSidebar = ({zInd}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users, error } = useSelector((state) => state.getOtherUsers);

  useEffect(() => {
    dispatch(getAllOtherUsers());
  }, [dispatch]);

  useEffect(() => {
    if(error) {
      toast.error(error, toastOptions);
    }
  }, [error, toastOptions]);


  return (
    <div className="rightSidebar" style={{ zIndex: zInd }}>
      <h2 className="title">Recommended Users</h2>
      <ul className="userList">
        {users && users.map((user, index) => (
          <li key={index} className="userItem" onClick={() => navigate(`/user/${user._id}`)}>
            <img
              src={user.avatar.url}
              alt={`${user.username}'s profile`}
              className="profilePic"
            />
            <span className="username">{user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RightSidebar;
