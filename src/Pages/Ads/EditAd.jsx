import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../Components/Sidebar";
import { toast } from "react-toastify";
import { API_URL } from "./../../../constants";

function EditAd() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingPhoto, setExistingPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_URL}/api/ads/onead/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const adData = response.data.ad;
        setLink(adData.link);
        setExistingPhoto(adData.photo); // Set existing photo
      } catch (error) {
        toast.error("فشل تحميل بيانات الإعلان");
      }
    };

    fetchAd();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file)); // Show image preview
    }
  };

  const handleUpdateAd = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("link", link);
      if (photo) formData.append("photos", photo);

      await axios.put(`${API_URL}/api/ads/editad/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("تم تعديل الإعلان بنجاح");
      navigate("/ads"); // Redirect to ads page
    } catch (error) {
      toast.error("فشل تعديل الإعلان");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar activeTab="اعلانات" />
      <div className="flex flex-col flex-1 px-24 py-8">
        <h1 className="text-2xl font-bold mb-6">تعديل الإعلان</h1>

        {/* Image Preview Section */}
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-lg font-semibold mb-2">الصورة الحالية</h2>
          {existingPhoto && (
            <img
              src={`${API_URL}${existingPhoto}`}
              alt="Current Ad"
              className="w-64 h-40 object-cover rounded border"
            />
          )}

          {preview && (
            <>
              <h2 className="text-lg font-semibold mt-4">
                معاينة الصورة الجديدة
              </h2>
              <img
                src={preview}
                alt="Preview"
                className="w-64 h-40 object-cover rounded border"
              />
            </>
          )}
        </div>

        <form onSubmit={handleUpdateAd} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold mb-1">
              رابط الإعلان
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold mb-1">
              تحديث الصورة
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border p-2 w-full rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "جارٍ التحديث..." : "حفظ التعديلات"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditAd;
