import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../constants";

const ADDADMIN_API_URL = `${API_URL}/api/users/addadmin`;

function AddAdmin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    privatenumber: "",
    height: "",
    birthdate: "",
    jobtitle: "",
    livesin: "",
    phonenumber: "",
  });

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("لم يتم العثور على رمز المصادقة!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(ADDADMIN_API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success("تم إضافة المسؤول بنجاح!");
      setFormData({
        username: "",
        fullname: "",
        email: "",
        password: "",
        privatenumber: "",
        height: "",
        birthdate: "",
        jobtitle: "",
        livesin: "",
        phonenumber: "",
      });
      navigate("/admins");
    } catch (error) {
      toast.error(error.response?.data?.message || "فشل في إضافة المسؤول.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar activeTab="المسؤلين" />
      <div className="flex flex-col flex-1 lg:px-24 pr-24 py-8">
        <h1 className="text-2xl font-bold mb-4">أضف مسؤول</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md "
        >
          <div className="mb-4">
            <label className="block text-gray-700">اسم المستخدم:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">الاسم الكامل:</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">البريد الإلكتروني:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">كلمة المرور:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">الرقم الخاص:</label>
            <input
              type="text"
              name="privatenumber"
              value={formData.privatenumber}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">الطول:</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">تاريخ الميلاد:</label>
            <input
              type="text"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">المسمى الوظيفي:</label>
            <input
              type="text"
              name="jobtitle"
              value={formData.jobtitle}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">مكان الإقامة:</label>
            <input
              type="text"
              name="livesin"
              value={formData.livesin}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">رقم الهاتف:</label>
            <input
              type="text"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full"
            disabled={loading}
          >
            {loading ? "جارٍ الإضافة..." : "إضافة المسؤول"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddAdmin;
