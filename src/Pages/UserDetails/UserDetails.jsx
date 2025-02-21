import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import { API_URL } from "../../../constants";
import Loading from "../../Components/Loader/Loading";

function UserDetails() {
  const { userId } = useParams(); // Get userId from URL params
  const token = localStorage.getItem("token"); // Get token from Redux store
  const [userData, setUserData] = useState(null);
  const [isDeleteing, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/users/getuser/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in headers
            },
          }
        );
        setUserData(response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (token) fetchUserData();
  }, [userId, token]);

  if (!userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }
  const deleteUser = async () => {
    try {
      const token = localStorage.getItem("token");
      setIsDeleting(true);
      const response = await axios.delete(`${API_URL}/api/users/deleteuser/${userData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/users');
    } catch (err) {
      console.log(err);

    }
  }
  return (
    <div className="flex min-h-screen" dir="rtl">
      {/* Sidebar */}
      <Sidebar activeTab="المستخدمين" />

      {/* Main Content */}
      <div className="flex flex-col flex-1 px-4 py-8">
        <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-6">
          {/* User Profile */}
          <div className="flex lg:flex-row flex-col items-center gap-6">
            <img
              src={
                `${API_URL}${userData.profilepicture}` || "/default-avatar.png"
              }
              alt="User Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
            <div>
              <h2 className="text-lg font-bold">{userData.fullname}</h2>
              <p className="text-black">{userData.email}</p>
            </div>
          </div>

          {/* User Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
            <div>
              <p className="text-sm text-gray-400">اسم المستخدم</p>
              <p className="font-semibold">{userData.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">الوضع</p>
              <p
                className={
                  userData.status === "يعمل" ? "text-green-500" : "text-red-500"
                }
              >
                {userData.status || "غير متوفر"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">البريد الإلكتروني</p>
              <p>{userData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">رقم الهاتف</p>
              <p>{userData.phonenumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">تاريخ الميلاد</p>
              <p>{userData.birthdate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">الطول</p>
              <p>{userData.height} cm</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">الرقم الخاص</p>
              <p>{userData.privatenumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">الاسم الوظيفي</p>
              <p>{userData.jobtitle}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">السكن</p>
              <p>{userData.jobtitle}</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-700">
              بيانات إضافية
            </h3>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <p className="text-sm text-gray-400">رقم الأب</p>
                <p>{userData.fathernumber || "غير متوفر"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">رقم الأخ الأكبر</p>
                <p>{userData.brothernumber || "غير متوفر"}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-center">
            <button onClick={deleteUser} className="bg-red-500 text-white py-2 px-2 rounded-md font-semibold cursor-pointer">{isDeleteing ? "يتم الحذف" : "حذف المستخدم"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
