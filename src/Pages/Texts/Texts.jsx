import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../../Components/Sidebar";
import { API_URL } from "../../../constants";

function Texts() {
  const [labels, setLabels] = useState([]);
  const [article, setArticle] = useState(null);
  const [privacyPolicy, setPrivacyPolicy] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editingLabel, setEditingLabel] = useState(null);
  const [newLabel, setNewLabel] = useState("");
  const [editingArticle, setEditingArticle] = useState(false);
  const [editingPrivacyPolicy, setEditingPrivacyPolicy] = useState(false);
  const [editingSuccessMessage, setEditingSuccessMessage] = useState(false);
  const [newArticleContent, setNewArticleContent] = useState("");
  const [newPrivacyPolicyContent, setNewPrivacyPolicyContent] = useState("");
  const [newSuccessMessage, setNewSuccessMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Labels
        const labelResponse = await axios.get(`${API_URL}/api/label`);
        setLabels(labelResponse.data.labels);

        // Fetch "Who We Are"
        const whoWeAreResponse = await axios.get(`${API_URL}/api/article/one/1`);
        setArticle(whoWeAreResponse.data.content);
        setNewArticleContent(whoWeAreResponse.data.content.text); // Set default edit value

        // Fetch "Privacy Policy"
        const privacyPolicyResponse = await axios.get(`${API_URL}/api/article/one/2`);
        setPrivacyPolicy(privacyPolicyResponse.data.content);
        setNewPrivacyPolicyContent(privacyPolicyResponse.data.content.text); // Set default edit value
        const succesMessageResponse = await axios.get(`${API_URL}/api/article/one/3`);
        setSuccessMessage(succesMessageResponse.data.content);
        setNewPrivacyPolicyContent(succesMessageResponse.data.content.text); // Set default edit value
      } catch (error) {
        toast.error("فشل تحميل البيانات");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Save Updated Label
  const handleSaveLabel = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/label/editlabel/${id}`,
        { newlabel: newLabel },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update State
      setLabels(labels.map((l) => (l.id === id ? { ...l, label: newLabel } : l)));
      toast.success("تم تحديث النص بنجاح");
      setEditingLabel(null);
    } catch (error) {
      toast.error("فشل تعديل النص");
      console.error("Error updating label:", error);
    }
  };

  // Update "Who We Are"
  const handleSaveArticle = async () => {
    try {
      await axios.put(
        `${API_URL}/api/article/editcontent/1`,
        { newContent: newArticleContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setArticle({ ...article, text: newArticleContent });
      toast.success("تم تحديث قسم 'من نحن' بنجاح");
      setEditingArticle(false);
    } catch (error) {
      toast.error("فشل تحديث 'من نحن'");
      console.error("Error updating article:", error);
    }
  };

  // Update "Privacy Policy"
  const handleSavePrivacyPolicy = async () => {
    try {
      await axios.put(
        `${API_URL}/api/article/editcontent/2`,
        { newContent: newPrivacyPolicyContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPrivacyPolicy({ ...privacyPolicy, text: newPrivacyPolicyContent });
      toast.success("تم تحديث سياسة الخصوصية بنجاح");
      setEditingPrivacyPolicy(false);
    } catch (error) {
      toast.error("فشل تحديث سياسة الخصوصية");
      console.error("Error updating privacy policy:", error);
    }
  };
  const handleSuccessMessage = async () => {
    try {
      await axios.put(
        `${API_URL}/api/article/editcontent/3`,
        { newContent: newSuccessMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage({ ...successMessage, text: newSuccessMessage });
      toast.success("تم تحديث رسالة النجاح بنجاح");
      setEditingSuccessMessage(false);
    } catch (error) {
      toast.error("فشل تحديث رسالة النجاح");
      console.error("Error updating success message:", error);
    }
  };
  return (
    <div className="flex min-h-screen" dir="rtl">
      <Sidebar activeTab="النصوص" />
      <div className="flex flex-col flex-1 px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">تحكم بالنصوص والحقول</h1>

        {/* Labels Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {labels.length === 0 ? (
            <p className="text-gray-500">لا توجد بيانات</p>
          ) : (
            labels.map((label) => (
              <div key={label.id} className="mb-4 flex items-center justify-between border-b pb-2">
                <span className="font-semibold text-lg">{label.label}</span>
                {editingLabel === label.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      className="border p-2 rounded"
                    />
                    <button onClick={() => handleSaveLabel(label.id)} className="bg-blue-500 text-white px-4 py-2 rounded">حفظ</button>
                    <button onClick={() => setEditingLabel(null)} className="bg-gray-400 text-white px-4 py-2 rounded">إلغاء</button>
                  </div>
                ) : (
                  <button onClick={() => setEditingLabel(label.id)} className="bg-green-500 text-white px-4 py-2 rounded">تعديل</button>
                )}
              </div>
            ))
          )}
        </div>

        {/* "Who We Are" Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-bold mb-2">من نحن</h2>
          {editingArticle ? (
            <div>
              <textarea
                className="w-full p-2 border rounded"
                rows="6"
                value={newArticleContent}
                onChange={(e) => setNewArticleContent(e.target.value)}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleSaveArticle} className="bg-blue-500 text-white px-4 py-2 rounded">حفظ</button>
                <button onClick={() => setEditingArticle(false)} className="bg-gray-400 text-white px-4 py-2 rounded">إلغاء</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 whitespace-pre-line">{article?.text}</p>
              <button onClick={() => setEditingArticle(true)} className="bg-green-500 text-white px-4 py-2 rounded mt-2">تعديل</button>
            </div>
          )}
        </div>

        {/* "Privacy Policy" Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-bold mb-2">سياسة الخصوصية</h2>
          {editingPrivacyPolicy ? (
            <div>
              <textarea
                className="w-full p-2 border rounded"
                rows="6"
                value={newPrivacyPolicyContent}
                onChange={(e) => setNewPrivacyPolicyContent(e.target.value)}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleSavePrivacyPolicy} className="bg-blue-500 text-white px-4 py-2 rounded">حفظ</button>
                <button onClick={() => setEditingPrivacyPolicy(false)} className="bg-gray-400 text-white px-4 py-2 rounded">إلغاء</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 whitespace-pre-line">{privacyPolicy?.text}</p>
              <button onClick={() => setEditingPrivacyPolicy(true)} className="bg-green-500 text-white px-4 py-2 rounded mt-2">تعديل</button>
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-bold mb-2">رسالة النجاح</h2>
          {editingSuccessMessage ? (
            <div>
              <textarea
                className="w-full p-2 border rounded"
                rows="6"
                value={newSuccessMessage}
                onChange={(e) => setNewSuccessMessage(e.target.value)}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleSuccessMessage} className="bg-blue-500 text-white px-4 py-2 rounded">حفظ</button>
                <button onClick={() => setEditingSuccessMessage(false)} className="bg-gray-400 text-white px-4 py-2 rounded">إلغاء</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 whitespace-pre-line">{successMessage?.text}</p>
              <button onClick={() => setEditingSuccessMessage(true)} className="bg-green-500 text-white px-4 py-2 rounded mt-2">تعديل</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Texts;
