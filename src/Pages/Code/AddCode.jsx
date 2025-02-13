import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import { API_URL } from "../../../constants";

function AddCode() {
  const [code, setCode] = useState("");
  const [stock, setStock] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code || !stock) {
      setMessage("يرجى ملء جميع الحقول");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/code/addcode`,
        { code, stock: Number(stock) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("تمت إضافة الكود بنجاح!");
      setCode("");
      setStock("");
    } catch (error) {
      setMessage(error.response?.data?.message || "حدث خطأ أثناء إضافة الكود");
    }
  };

  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar activeTab="اكواد التحقق" />
      <div className="flex flex-col flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">اكواد التحقق</h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md "
        >
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">الكود:</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="ادخل الكود"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">المخزون:</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="ادخل عدد المخزون"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
          >
            إضافة الكود
          </button>

          {message && (
            <p className="mt-4 text-center text-red-500">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddCode;
