import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar';
import { API_URL } from '../../../constants';

function OneCode() {
    const { id } = useParams();
    const [codeData, setCodeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCode = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_URL}/api/code/getonecode/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCodeData(response.data.code);
            } catch (err) {
                setError(err.response?.data?.message || 'حدث خطأ أثناء جلب البيانات');
            } finally {
                setLoading(false);
            }
        };
        fetchCode();
    }, [id]);

    if (loading) return <div className="flex min-h-screen items-center justify-center">جاري التحميل...</div>;
    if (error) return <div className="flex min-h-screen items-center justify-center text-red-500">{error}</div>;

    return (
        <div className="flex min-h-screen" dir="rtl">
            <Sidebar activeTab="اكواد التحقق" />
            <div className="flex-1 p-10">
                <h1 className="text-2xl font-bold mb-5">معلومات الكود</h1>
                <div className="bg-white shadow p-5 rounded-lg">
                    <p><strong>الكود:</strong> {codeData.code}</p>
                    <p><strong>المستخدم:</strong> {codeData.used}</p>
                    <p><strong>المتبقي:</strong> {codeData.stock}</p>
                    <p><strong>تاريخ الإنشاء:</strong> {new Date(codeData.createdAt).toLocaleDateString()}</p>
                </div>

                <h2 className="text-xl font-bold mt-10 mb-3">المستخدمين الذين استخدموا الكود:</h2>
                <div className="bg-white shadow p-5 rounded-lg">
                    {codeData.Users.length > 0 ? (
                        codeData.Users.map((user) => (
                            <div key={user.id} className="border-b py-2">
                                <p><strong>الاسم:</strong> {user.username}</p>
                                <p><strong>البريد الإلكتروني:</strong> {user.email}</p>
                                <p><strong>الرقم الخاص:</strong> {user.privatenumber}</p>
                            </div>
                        ))
                    ) : (
                        <p>لم يتم استخدام الكود من قبل أي مستخدم.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default OneCode;
