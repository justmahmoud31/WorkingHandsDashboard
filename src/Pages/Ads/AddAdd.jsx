import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import { API_URL } from "../../../constants";

function AddAdd() {
  const [photos, setPhotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]); // Stores preview images
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);

    // Generate preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    photos.forEach((photo) => formData.append("photos", photo));
    formData.append("link", link);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(`${API_URL}/api/ads/addad`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message || "تم إضافة الإعلان بنجاح!");
      setPhotos([]);
      setPreviewUrls([]);
      setLink("");
    } catch (error) {
      setMessage(error.response?.data?.message || "حدث خطأ أثناء الإضافة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar activeTab="اعلانات" />
      <div className="flex flex-col flex-1 px-24 py-8">
        <h1 className="text-2xl font-bold mb-4">اضف إعلان</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg">
          {/* Link Input */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700">رابط الإعلان</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="ضع رابط الإعلان هنا"
              required
            />
          </div>

          {/* File Upload Input */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700">رفع الصور</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          {/* Image Preview Section */}
          {previewUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt="Preview" className="w-full h-32 object-cover rounded-lg shadow-md" />
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "جاري الإرسال..." : "إضافة الإعلان"}
          </button>

          {/* Response Message */}
          {message && <p className="mt-4 text-center text-lg font-semibold">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default AddAdd;
