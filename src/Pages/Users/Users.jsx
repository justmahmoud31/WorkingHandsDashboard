import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import { Pagination } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../../constants";
import TableComponent from "../../Components/Table";
import Loading from "../../Components/Loader/Loading";

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
        setFilteredUsers(response.data.users); // Initially, show all users
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(err.response?.data?.message || "حدث خطأ أثناء جلب البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, token]);

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(
      (user) =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.privatenumber?.toString().includes(searchTerm)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  const fieldMappings = {
    id: "المعرف",
    username: "اسم المستخدم",
    profilepicture: "الصورة الشخصية",
    fullname: "الاسم الكامل",
    email: "البريد الإلكتروني",
    privatenumber: "الرقم الخاص",
    phonenumber: "رقم الهاتف",
    height: "الطول",
    status: "الحالة",
    birthdate: "تاريخ الميلاد",
    jobtitle: "المسمى الوظيفي",
    livesin: "مكان الإقامة",
    fathernumber: "رقم الأب",
    brothernumber: "رقم الأخ",
    role: "النوع",
  };

  const userFields =
    filteredUsers.length > 0
      ? Object.keys(filteredUsers[0]).filter((field) => fieldMappings[field])
      : [];
  const arabicHeaders = userFields.map((field) => fieldMappings[field]);

  const formattedData = filteredUsers.map((user) => ({
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
    "تاريخ الميلاد": user.birthdate
      ? new Date(user.birthdate).toLocaleDateString("EG")
      : "-",
    "المسمى الوظيفي": user.jobtitle || "-",
    "مكان الإقامة": user.livesin || "-",
    "رقم الأب": user.fathernumber || "-",
    "رقم الأخ": user.brothernumber || "-",
    الحالة: user.status || "-",
    النوع: user.role || "-",
  }));

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar activeTab="المستخدمين" />

      <div className="flex flex-col flex-1 px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center my-4">
            <Loading />
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <>
            {/* Search Input */}
            <div className="mb-4 flex justify-center">
              <input
                type="text"
                placeholder="ابحث برقم الخاص أو اسم المستخدم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 rounded-md w-1/2 text-right"
              />
            </div>

            <TableComponent
              headers={arabicHeaders}
              data={formattedData}
              onRowClick={handleRowClick}
            />

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
