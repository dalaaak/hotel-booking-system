import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineMarkEmailRead, MdDriveFileRenameOutline, MdOutlinePassword } from "react-icons/md";
import { FaPhoneVolume } from "react-icons/fa6";
import { SiLastpass } from "react-icons/si";
import './CreateAccont.css';

function CreateAccount() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        email: '',
        phone: '',
        gender: '', // إضافة حقل الجنس
        password: '',
        confirmPassword: '' // يبقى هنا للتحقق، لكن لا يُرسل للـ API
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const { full_name, username, email, phone, gender, password, confirmPassword } = formData;
        if (!full_name || !username || !email || !phone || !gender || !password || !confirmPassword) {
            return false;
        }
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            setTimeout(() => setErrorMessage(''), 5000);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setErrorMessage('الرجاء ملء جميع الحقول بشكل صحيح');
            return;
        }

        // إزالة `confirmPassword` قبل إرسال البيانات إلى الـ backend
        const { confirmPassword, ...dataToSend } = formData;

        try {
            const response = await fetch('http://127.0.0.1:8000/user/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend) // إرسال البيانات بدون `confirmPassword`
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('تم إنشاء الحساب بنجاح!');
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/Homepageclient');
                }, 3000);
            } else {
                throw new Error(data.message || 'فشل في إنشاء الحساب');
            }
        } catch (error) {
            setErrorMessage(error.message || 'حدث خطأ أثناء إنشاء الحساب');
            setTimeout(() => setErrorMessage(''), 5000);
        }
    };

    return (
        <div className="auth-container1">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group1">
                    <label> <MdDriveFileRenameOutline /> Full Name:</label>
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} required />
                </div>
                <div className="form-group1">
                    <label> <MdDriveFileRenameOutline /> Username:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} required />
                </div>
                <div className="form-group1">
                    <label> <MdOutlineMarkEmailRead /> Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="form-group1">
                    <label> <FaPhoneVolume /> Phone Number:</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div className="form-group1">
                    <label> Gender:</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div className="form-group1">
                    <label> <MdOutlinePassword /> Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                </div>
                <div className="form-group1">
                    <label> <SiLastpass /> Confirm Password:</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
                </div>
                <button type="submit">Register</button>
            </form>
            <p className="register-link1">
                Already have an account? <a href="/loginto">Login</a>
            </p>
        </div>
    );
}

export default CreateAccount;
