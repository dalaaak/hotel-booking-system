import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { FaUserEdit } from "react-icons/fa";
import { TbPhotoHeart } from "react-icons/tb";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { BiObjectsHorizontalLeft } from "react-icons/bi";
import { GrSave } from "react-icons/gr";
import { RiLockPasswordLine } from "react-icons/ri";


function Profile() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        name: 'اسم افتراضي',
        email: 'example@example.com',
        phoneNumber: '1234567890',
        bio: 'هذا هو السيرة الذاتية الافتراضية.',
        profilePicture: '/assets/images/h4.jpg',
        password: '',
    });
    const [newName, setNewName] = useState('');
    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [newBio, setNewBio] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // محاكاة جلب بيانات المستخدم من الخادم (مثل API)
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/users/profile', {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const userData = await response.json();
                setUserInfo(userData);
                setNewName(userData.name);
                setNewBio(userData.bio);
            } catch (error) {
                setErrorMessage('Failed to load user data');
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleProfilePictureChange = (e) => {
        setNewProfilePicture(e.target.files[0]);
    };

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    const handleBioChange = (e) => {
        setNewBio(e.target.value);
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            if (newPassword && newPassword !== confirmPassword) {
                setErrorMessage('Passwords do not match');
                setTimeout(() => setErrorMessage(''), 5000);
                return;
            }

            const formData = new FormData();
            formData.append('name', newName);
            formData.append('bio', newBio);
            if (newProfilePicture) {
                formData.append('profilePicture', newProfilePicture);
            }
            if (newPassword) {
                formData.append('oldPassword', oldPassword);
                formData.append('newPassword', newPassword);
            }

            const response = await fetch('http://localhost:5000/api/users/update-profile', {
                method: 'PUT',
                credentials: 'include',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const updatedData = await response.json();
            setUserInfo(updatedData);
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);

            // Reset password fields
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setErrorMessage(error.message || 'Error updating profile. Please try again.');
            setTimeout(() => setErrorMessage(''), 5000);
        }
    };

    return (
        <div className="profile-container">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <h2 className='user'>User Profile</h2>
            <div className="profile-info">
                <img
                    src={userInfo.profilePicture}
                    alt="Profile"
                    className="profile-picture"
                />
                <div className='profile'>
                    <h3> <FaUserEdit /> Name: {userInfo.name}</h3>
                    <h4> <MdOutlineAlternateEmail /> Email: {userInfo.email}</h4>
                    <h4> <FaPhoneAlt /> Phone Number: {userInfo.phoneNumber}</h4>
                    <p> <BiObjectsHorizontalLeft /> Bio: {userInfo.bio}</p>
                </div>
            </div>
            <div className='d1'>
            <form onSubmit={handleSaveChanges}>
                <div className="form-group">
                    <label htmlFor="name"> <FaUserEdit /> Edit Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={newName}
                        onChange={handleNameChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="profilePicture"> <TbPhotoHeart /> Change Profile Picture:</label>
                    <input
                        type="file"
                        id="profilePicture"
                        onChange={handleProfilePictureChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="bio">
                        <BiObjectsHorizontalLeft /> Edit Bio:
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={newBio}
                        onChange={handleBioChange}
                    />
                </div>
                <div className="password-section">
                    <h3><RiLockPasswordLine /> Change Password</h3>
                    <div className="form-group">
                        <label htmlFor="oldPassword">Current Password:</label>
                        <input
                            type="password"
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm New Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>
                <button type="submit"> <GrSave /> Save Changes</button>
            </form>
            </div>
        </div>
    );
}

export default Profile;
