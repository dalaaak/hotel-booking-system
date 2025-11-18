import React, { useState } from 'react';
import { ImSearch } from "react-icons/im";
import { TbWorldPin } from "react-icons/tb";
import { FaHotel } from "react-icons/fa6";
import './SearchForm.css';

const SearchForm = ({ onSubmitSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            try {
                console.log("إرسال طلب البحث باستخدام:", searchTerm); // ✅ تحقق من إرسال `searchTerm`

                const response = await fetch(`http://127.0.0.1:8000/api/search/?q=${searchTerm}`);
                const data = await response.json();

                console.log("بيانات البحث المستلمة بالكامل:", data); // ✅ تحقق من البيانات المستلمة
                console.log("هل تحتوي البيانات على فنادق؟", data.hotels?.length > 0 ? "نعم" : "لا");

                onSubmitSearch(searchTerm, data.hotels || []); // ✅ تمرير `searchTerm` و `hotels`

            } catch (error) {
                console.error("حدث خطأ أثناء البحث:", error);
                onSubmitSearch(searchTerm, []);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    <TbWorldPin /> <FaHotel /> Search:
                </label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter hotel name or country"
                />
            </div>

            <button className='pp' type="submit">
                <ImSearch /> Search
            </button>
        </form>
    );
};

export default SearchForm;
