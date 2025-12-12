import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import { registerDocument } from '../services/api';

export default function RegisterDocument() {
  const [status, setStatus] = useState('idle');
  const [issuerName, setIssuerName] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('الرجاء اختيار ملف');
      return;
    }
    
    setStatus('loading');
    setError(null);
    
    try {
      const response = await registerDocument(issuerName, file);
      setResult(response);
      setStatus('done');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'حدث خطأ أثناء التسجيل');
      setStatus('error');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setIssuerName('');
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-saudi-green">تسجيل مستند</h2>
      
      {status === 'done' && result ? (
        <div className="space-y-4">
          <div className="p-6 bg-green-100 text-green-800 rounded-xl">
            <div className="text-center text-xl font-bold mb-4">✔ تم التسجيل بنجاح</div>
            <div className="bg-white p-4 rounded-lg text-sm space-y-2">
              <p><strong>معرّف المستند:</strong></p>
              <p className="text-xs break-all bg-gray-100 p-2 rounded font-mono">{result.document_hash || result.hash}</p>
              {result.issuer && <p><strong>جهة الإصدار:</strong> {result.issuer}</p>}
              {result.timestamp && <p><strong>وقت التسجيل:</strong> {new Date(result.timestamp).toLocaleString('ar-SA')}</p>}
            </div>
          </div>
          <button onClick={resetForm} className="w-full bg-gray-500 text-white py-3 rounded-lg">
            تسجيل مستند جديد
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم الجهة</label>
            <input 
              type="text"
              placeholder="مثال: وزارة التعليم" 
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-saudi-green focus:border-transparent" 
              value={issuerName}
              onChange={(e) => setIssuerName(e.target.value)}
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المستند الأصلي</label>
            <FileUpload 
              onFileSelect={(f) => setFile(f)} 
              label="ارفع المستند الأصلي (PDF أو صورة)" 
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <button 
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-saudi-green text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {status === 'loading' ? 'جاري التسجيل...' : 'تسجيل المستند'}
          </button>
        </form>
      )}
    </div>
  );
}
