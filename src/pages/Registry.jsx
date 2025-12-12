import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRegistry, getLedger, getRegistryStats } from '../services/api';

export default function Registry() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  
  const isLedger = location.pathname === '/ledger';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [registryData, statsData] = await Promise.all([
          isLedger ? getLedger() : getRegistry(),
          getRegistryStats().catch(() => null)
        ]);
        
        const items = registryData?.documents || registryData?.entries || registryData?.records || registryData || [];
        setData(Array.isArray(items) ? items : []);
        setStats(statsData);
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'حدث خطأ أثناء تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLedger]);

  const refreshData = () => {
    setLoading(true);
    const fetchFn = isLedger ? getLedger : getRegistry;
    fetchFn()
      .then(res => {
        const items = res?.documents || res?.entries || res?.records || res || [];
        setData(Array.isArray(items) ? items : []);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-saudi-green">
          {isLedger ? 'سجل التحليلات' : 'السجل العام'}
        </h2>
        <button 
          onClick={refreshData}
          disabled={loading}
          className="px-4 py-2 bg-saudi-green text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? 'جاري التحديث...' : 'تحديث'}
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <div className="text-3xl font-bold text-saudi-green">{stats.total_documents || stats.total || 0}</div>
            <div className="text-gray-500 text-sm">إجمالي المستندات</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <div className="text-3xl font-bold text-green-600">{stats.verified || stats.authentic || 0}</div>
            <div className="text-gray-500 text-sm">مستندات موثقة</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <div className="text-3xl font-bold text-red-600">{stats.suspicious || stats.forged || 0}</div>
            <div className="text-gray-500 text-sm">مستندات مشتبهة</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.issuers || stats.unique_issuers || 0}</div>
            <div className="text-gray-500 text-sm">جهات الإصدار</div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-saudi-green border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">جاري تحميل البيانات...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow">
          <p className="text-gray-500 text-lg">لا توجد سجلات بعد</p>
          <p className="text-gray-400 text-sm mt-2">قم بتسجيل مستند جديد للبدء</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">معرّف المستند</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">جهة الإصدار</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">التاريخ</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((item, idx) => (
                  <tr key={item.hash || item.id || idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {(item.hash || item.document_hash || item.id || '').substring(0, 16)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {item.issuer || item.issuer_name || 'غير محدد'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.timestamp || item.registered_at || item.created_at 
                        ? new Date(item.timestamp || item.registered_at || item.created_at).toLocaleString('ar-SA')
                        : 'غير محدد'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'revoked' 
                          ? 'bg-red-100 text-red-700'
                          : item.status === 'suspicious' || item.status === 'forged'
                          ? 'bg-yellow-100 text-yellow-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {item.status === 'revoked' ? 'ملغى' : 
                         item.status === 'suspicious' ? 'مشتبه' :
                         item.status === 'forged' ? 'مزور' :
                         'موثق'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
