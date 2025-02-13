import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaEdit, FaExternalLinkAlt } from "react-icons/fa";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import { API_URL } from "../../../constants";
import { IoIosAdd } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";

function Ads() {
  const [ads, setAds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAds();
  }, []);

  // Fetch Ads from API
  const fetchAds = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/ads`);
      setAds(response.data.ad.images || []);
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

  // Handle Delete Function
  const handleDelete = async (id) => {
    // const confirmDelete = window.confirm(
    //   "هل أنت متأكد أنك تريد حذف هذا الإعلان؟"
    // );
    // if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/ads/deletead/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted ad from state
      setAds((prevAds) => prevAds.filter((ad) => ad.id !== id));
      toast.success("تم حذف الاعلان بنجاح");
    } catch (error) {
      console.error("Error deleting ad:", error);
      toast.error("حدث خطأ");
    }
  };

  const handleEdit = (id) => {
    navigate(`/editad/${id}`); // Navigate to the edit page with the ad ID
  };

  return (
    <div className="flex min-h-screen" dir="rtl">
        <ToastContainer position="top-center" autoClose={3000} />
      <Sidebar activeTab="اعلانات" />
      <div className="flex flex-col flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">الإعلانات</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Add New Ad Button */}
          <Link
            to="/addad"
            className="flex bg-main justify-center items-center rounded-lg text-white font-semibold h-48"
          >
            <IoIosAdd />
            اضف اعلانا جديدا
          </Link>

          {ads.map((ad) => (
            <div key={ad.id} className="relative group">
              {/* Ad Image */}
              <img
                src={`${API_URL}${ad.photo}`}
                alt="Ad"
                className="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
              />

              {/* Hover Icons */}
              <div className="absolute inset-0 bg-black bg-opacity-80 flex justify-center items-center gap-4 opacity-0 group-hover:opacity-80 transition-opacity duration-300">
                {/* Delete Icon */}
                <button
                  onClick={() => handleDelete(ad.id)}
                  className="bg-red-600 p-2 rounded-full text-white hover:bg-red-700 transition"
                >
                  <FaTrash size={20} />
                </button>

                {/* Edit Icon */}
                <button
                  onClick={() => handleEdit(ad.id)}
                  className="bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 transition"
                >
                  <FaEdit size={20} />
                </button>

                {/* External Link Icon */}
                <Link
                  to={ad.link}
                  target="_blank"
                  className="bg-green-600 p-2 rounded-full text-white hover:bg-green-700 transition"
                >
                  <FaExternalLinkAlt size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Ads;
