import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../Components/Sidebar";
import { API_URL } from "../../../constants";
import { Link } from "react-router-dom";

const ADMIN_API_URL = `${API_URL}/api/users/getadmins`;

function Admin() {
  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(ADMIN_API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAdmins(response.data.admins);
      } catch (err) {
        console.log(err);

        setError(err.response?.data?.message || "Failed to fetch admins.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Filter admins based on search query (private number or username)
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.privatenumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar activeTab="المسؤلين" />
      <div className="flex flex-col flex-1 px-24 py-8">
        <h1 className="text-2xl font-bold mb-4">المسؤلين</h1>

        {/* Search Input */}
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="ابحث باسم المستخحدم أو الرقم الخاص..."
            className="border p-2 rounded mb-4 w-1/2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Link to={"/addadmin"} className="bg-main px-3 py-2 text-white rounded-lg">
            اضف مسؤول
          </Link>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Admins Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-main text-white">
                  {/* <th className="border border-gray-300 p-2">الصورة</th> */}
                  <th className="border border-gray-300 p-2">الاسم</th>
                  <th className="border border-gray-300 p-2">اسم المستخدم</th>
                  <th className="border border-gray-300 p-2">
                    البريد الإلكتروني
                  </th>
                  <th className="border border-gray-300 p-2">الرقم الخاص</th>
                  <th className="border border-gray-300 p-2">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="text-center">
                    {/* <td className="border border-gray-300 p-2">
                      <img
                        src={`${API_URL}${admin.profilepicture}`}
                        alt={admin.fullname}
                        className="w-10 h-10 rounded-full object-cover mx-auto"
                      />
                    </td> */}
                    <td className="border border-gray-300 p-2">
                      {admin.fullname}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {admin.username}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {admin.email}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {admin.privatenumber}
                    </td>
                    <td
                      className={`border border-gray-300 p-2 font-semibold ${
                        admin.statusmode === "online"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {admin.statusmode === "online" ? "متصل" : "غير متصل"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAdmins.length === 0 && (
              <p className="mt-4 text-gray-600">
                لا يوجد مسؤولين مطابقين للبحث.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
