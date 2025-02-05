import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../../../Components/Loader/Loading";
import {
  fetchMainContent,
  updateMainContent,
  updateMainImage,
} from "../../../redux/mainSlice";

const MainPage = () => {
  const dispatch = useDispatch();
  const { id, title, description, images, loading, error } = useSelector(
    (state) => state.main
  );
  const token = localStorage.getItem("token");

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const [previewImages, setPreviewImages] = useState({});
  const [editImageTitles, setEditImageTitles] = useState({});
  const [imageFiles, setImageFiles] = useState({});

  useEffect(() => {
    dispatch(fetchMainContent());
  }, [dispatch]);

  // Edit main content
  const handleEdit = async () => {
    if (token && id) {
      setIsUpdating(true);
      try {
        await dispatch(
          updateMainContent({
            id,
            title: editTitle,
            description: editDescription,
            token,
          })
        ).unwrap();
        toast.success("تم تحديث المحتوى بنجاح! ✅");
      } catch (error) {
        toast.error("حدث خطأ أثناء تحديث المحتوى! ❌");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Save image title only
  const handleSaveImageTitle = async (imageId) => {
    const pictureTitle = editImageTitles[imageId] || "";
    if (token && id) {
      try {
        await dispatch(
          updateMainImage({ id, imageId, formData: { pictureTitle }, token })
        ).unwrap();
        toast.success("تم تحديث عنوان الصورة بنجاح! ✅");
      } catch (error) {
        toast.error("حدث خطأ أثناء تحديث عنوان الصورة! ❌");
      }
    }
  };

  // Change image (with preview)
  const handleImageChange = async (imageId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImageLoading((prev) => ({ ...prev, [imageId]: true }));

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setPreviewImages((prev) => ({ ...prev, [imageId]: previewUrl }));

    setImageFiles((prev) => ({ ...prev, [imageId]: file }));

    setImageLoading((prev) => ({ ...prev, [imageId]: false }));
  };

  // Upload new image
  const handleUploadImage = async (imageId) => {
    const file = imageFiles[imageId];
    if (!file || !token || !id) return;

    setImageLoading((prev) => ({ ...prev, [imageId]: true }));

    const formData = new FormData();
    formData.append("mainpictures", file);

    try {
      await dispatch(
        updateMainImage({ id, imageId, formData, token })
      ).unwrap();
      toast.success("تم تحديث الصورة بنجاح! ✅");
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث الصورة! ❌");
    } finally {
      setImageLoading((prev) => ({ ...prev, [imageId]: false }));
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-center" autoClose={3000} />

      {loading && (
        <div className="flex justify-center items-center">
          <Loading />
        </div>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && (
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            {title}
          </h1>
          <p className="mt-3 text-lg text-gray-600 text-center">
            {description}
          </p>

          {/* Edit Title & Description */}
          <div className="mt-8 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
              تعديل المحتوى
            </h2>
            <input
              type="text"
              placeholder="تعديل العنوان"
              className="border p-3 rounded-md w-full mb-3 focus:ring focus:ring-blue-300"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              placeholder="تعديل الوصف"
              className="border p-3 rounded-md w-full mb-3 focus:ring focus:ring-blue-300"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <button
              className={`bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md w-full font-semibold transition ${
                isUpdating ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleEdit}
              disabled={isUpdating}
            >
              {isUpdating ? "جارٍ الحفظ..." : "حفظ التغييرات"}
            </button>
          </div>

          {/* Images Section */}
          <h2 className="text-xl font-semibold text-gray-700 mt-10 text-center">
            إدارة الصور
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {images.map((img) => (
              <div
                key={img.id}
                className="border p-4 rounded-lg shadow-sm bg-gray-50"
              >
                {/* Image Preview */}
                <img
                  src={
                    previewImages[img.id] || `http://localhost:3000/${img.url}`
                  }
                  alt={img.title}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="text-center">{img.title}</h3>
                {/* Edit Image Title */}
                <input
                  type="text"
                  className="border p-2 rounded-md w-full mt-3"
                  placeholder="تعديل عنوان الصورة"
                  onChange={(e) =>
                    setEditImageTitles((prev) => ({
                      ...prev,
                      [img.id]: e.target.value,
                    }))
                  }
                />
                <button
                  onClick={() => handleSaveImageTitle(img.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md w-full mt-2"
                >
                  حفظ العنوان
                </button>

                {/* Upload New Image */}
                <input
                  type="file"
                  className="mt-3 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={(event) => handleImageChange(img.id, event)}
                />
                <button
                  onClick={() => handleUploadImage(img.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md w-full mt-2"
                  disabled={imageLoading[img.id]}
                >
                  {imageLoading[img.id] ? "جارٍ التحميل..." : "رفع الصورة"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
