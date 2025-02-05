import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Sidebar from "../../Components/Sidebar";
import { Pagination } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../../constants";
import TableComponent from "../../Components/Table";
import Loading from "../../Components/Loader/Loading";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setError("غير مصرح: لا يوجد رمز مميز");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/users/getusers`, {
          params: { page, limit: 10 },
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(err.response?.data?.message || "حدث خطأ أثناء جلب البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, token]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Handle row click
  const handleRowClick = (userId) => {
    navigate(`/users/${userId}`); // Navigate to user details page
  };

  // Arabic Field Mapping
  const fieldMappings = {
    id: "المعرف",
    username: "اسم المستخدم",
    profilepicture: "الصورة الشخصية",
    fullname: "الاسم الكامل",
    email: "البريد الإلكتروني",
    privatenumber: "الرقم الخاص",
    phonenumber: "رقم الهاتف",
    height: "الطول",
    weight: "الوزن",
    status: "الحالة",
    birthdate: "تاريخ الميلاد",
    jobtitle: "المسمى الوظيفي",
    livesin: "مكان الإقامة",
    fathernumber: "رقم الأب",
    brothernumber: "رقم الأخ",
  };

  // Get only required fields dynamically
  const userFields =
    users.length > 0
      ? Object.keys(users[0]).filter((field) => fieldMappings[field]) // Exclude fields not in mappings
      : [];
  const arabicHeaders = userFields.map((field) => fieldMappings[field]);

  // Format users data to match Arabic headers
  const formattedData = users.map((user) => ({
    المعرف: user.id,
    "اسم المستخدم": user.username,
    "الصورة الشخصية": user.profilepicture ? (
      <img
        src={`${API_URL}${user.profilepicture}`}
        alt="الصورة الشخصية"
        className="w-10 h-10 rounded-full"
      />
    ) : (
      "-"
    ),
    "الاسم الكامل": user.fullname,
    "البريد الإلكتروني": user.email,
    "الرقم الخاص": user.privatenumber,
    "رقم الهاتف": user.phonenumber,
    الطول: user.height || "-",
    الوزن: user.weight || "-",
    "تاريخ الميلاد": user.birthdate
      ? new Date(user.birthdate).toLocaleDateString("EG")
      : "-",
    "المسمى الوظيفي": user.jobtitle || "-",
    "مكان الإقامة": user.livesin || "-",
    "رقم الأب": user.fathernumber || "-",
    "رقم الأخ": user.brothernumber || "-",
    الحالة: user.status || "-",
  }));

  return (
    <div className="flex min-h-screen" dir="rtl">
      {/* Sidebar */}
      <Sidebar activeTab="المستخدمين" />

      {/* Main Content */}
      <div className="flex flex-col flex-1 px-24 py-8">
        {loading ? (
          <div className="flex justify-center items-center my-4">
            <Loading />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            {/* Table Component */}
            <TableComponent
              headers={arabicHeaders}
              data={formattedData}
              onRowClick={handleRowClick} // Pass the click handler
            />

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="small"
                shape="rounded"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Users;