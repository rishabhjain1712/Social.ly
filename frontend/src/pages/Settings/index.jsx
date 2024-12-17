import React, { useEffect, useState } from 'react';
import HomeLayout from '../../Layout/HomeLayout'
import '../../styles/Settings.css';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { updatePassword, updateProfile } from '../../redux/Actions/userActions';
import { toast } from 'react-toastify';
import toastOptions from '../../constants/toast';

const SettingsPage = () => {

  const dispatch = useDispatch();
  const { user } = useSelector(state => state.userAuth)
  const { loading, passLoading, error, message } = useSelector(state => state.updateUser)

  const [profile, setProfile] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    avatar: '',
    email: '',
    dob: '',
    mobile: '',
    gender: '',
    isPic: false,
  });

  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
        if (reader.readyState === 2) {
            setProfile({
                ...profile,
                isPic: true,
                avatar: reader.result // Set the base64 image result
            });
        }
    };

    if (file) {
        reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    dispatch(updateProfile(profile));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (password.newPassword == password.confirmPassword) {
      dispatch(updatePassword(password));
    } else {
      toast.error('Passwords do not match', toastOptions);
    }
  };

  useEffect(() => {
    if (user) {
      const dobDate = format(new Date(user.dob), 'yyyy-MM-dd');
      setProfile({
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        avatar: user.avatar.url,
        email: user.email,
        dob: dobDate,
        mobile: user.mobile,
        gender: user.gender,
      });
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
      dispatch({ type: 'CLEAR_ERROR' });
    }
    if (message) {
      toast.success(message, toastOptions);
      dispatch({ type: 'CLEAR_MESSAGE' });
    }
  }, [error, message, dispatch, toastOptions]);

  return (
    <div className="settings-page">
      <h2 className="settings-title">Settings</h2>

      <div className="profile-section">
        <h3 className="section-title">Update Profile</h3>
        <form onSubmit={handleUpdateProfile}>
            <div className="avatar-wrapper">
            <img src={profile.avatar} alt="Avatar" className="profile-avatar" />
            
            <input
                type="file"
                accept="image/*"
                name="avatar"
                // value={profile.avatar}
                placeholder="Avatar URL"
                onChange={handleImageChange}
                className="input-field"
            />
            </div>
            <div className="profile-fields">
            <input
                type="text"
                name="firstName"
                value={profile.firstName}
                placeholder="First Name"
                onChange={handleProfileChange}
                className="input-field"
            />
            <input
                type="text"
                name="middleName"
                value={profile.middleName}
                placeholder="Middle Name"
                onChange={handleProfileChange}
                className="input-field"
            />
            <input
                type="text"
                name="lastName"
                value={profile.lastName}
                placeholder="Last Name"
                onChange={handleProfileChange}
                className="input-field"
            />
            <input
                type="email"
                name="email"
                value={profile.email}
                placeholder="Email"
                onChange={handleProfileChange}
                className="input-field"
            />
            <input
                type="date"
                name="dob"
                value={profile.dob}
                onChange={handleProfileChange}
                className="input-field"
            />
            <input
                type="tel"
                name="mobile"
                value={profile.mobile}
                placeholder="Mobile"
                onChange={handleProfileChange}
                className="input-field"
            />
            <select
                name="gender"
                value={profile.gender}
                onChange={handleProfileChange}
                className="input-field"
                style={{ width: '100%' }}
            >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
            </select>
            </div>
            <button type='submit' className="update-btn" disabled={loading}>
              {loading===true ? <span className="spinner"></span> : "Update Profile"}
            </button>
        </form>
      </div>

      <div className="password-section">
        <form onSubmit={handleChangePassword}>
            <h3 className="section-title">Change Password</h3>
            <input
            type="password"
            name="currentPassword"
            value={password.currentPassword}
            placeholder="Current Password"
            onChange={handlePasswordChange}
            className="input-field"
            autoComplete='currentPassword'
            />
            <input
            type="password"
            name="newPassword"
            value={password.newPassword}
            placeholder="New Password"
            onChange={handlePasswordChange}
            className="input-field"
            autoComplete='newPassword'
            />
            <input
            type="password"
            name="confirmPassword"
            value={password.confirmPassword}
            placeholder="Confirm Password"
            onChange={handlePasswordChange}
            className="input-field"
            autoComplete='confirmPassword'
            />
            <button type='submit' className="update-btn" disabled={passLoading}>
              {passLoading===true ? <span className="spinner"></span> : "Update Password"}
            </button>
        </form>
      </div>
    </div>
  );
};


const Settings = () => (
    <HomeLayout>
        {<SettingsPage />}
    </HomeLayout>
)

export default Settings
