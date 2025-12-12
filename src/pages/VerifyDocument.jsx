import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ScoreBadge from '../components/ScoreBadge';
import { verifyDocument, analyzeDocument } from '../services/api';

export default function VerifyDocument() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [analysisMode, setAnalysisMode] = useState('verify');

  const handleCheck = async () => {
    if (!file) {
      setError('الرجاء اختيار ملف للتحقق');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      let response;
      if (analysisMode === 'analyze') {
        response = await analyzeDocument(file);
      } else {
        response = await verifyDocument(file);
      }
      setResult(response);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'حدث خطأ أثناء التحقق');
    } finally {
      setLoading(false);
    }
  };

  const resetCheck = () => {
    setResult(null);
    setFile(null);
    setError(null);
  };

  const isAuthentic = result?.is_registered || result?.authentic || result?.status === 'authentic';
  const isSuspicious = result?.is_forged || result?.suspicious || result?.status === 'suspicious' || result?.status === 'forged';
  const confidenceScore = result?.confidence_score || result?.forgery_score || result?.score || 0;
  const flags = result?.flags || result?.indicators || result?.analysis?.flags || [];

  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <h2 className="text-3xl font-bold mb-8 text-saudi-green">التحقق من المستندات</h2>
      
      {!result ? (
        <div className="bg-white p-8 rounded-xl shadow">
          <div className="mb-6">
            <div className="flex justify-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => setAnalysisMode('verify')}
                className={`px-6 py-2 rounded-lg transition ${
                  analysisMode === 'verify' 
                    ? 'bg-saudi-green text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                تحقق سريع
              </button>
              <button
                type="button"
                onClick={() => setAnalysisMode('analyze')}
                className={`px-6 py-2 rounded-lg transition ${
                  analysisMode === 'analyze' 
                    ? 'bg-saudi-green text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                تحليل عميق (AI)
              </button>
            </div>
            <p className="text-gray-500 text-sm">
              {analysisMode === 'verify' 
                ? 'التحقق من تسجيل المستند في السجل' 
                : 'تحليل شامل للمستند باستخدام الذكاء الاصطناعي'}
            </p>
          </div>
          
          <FileUpload onFileSelect={(f) => setFile(f)} label="ارفع المستند للتحقق" />
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <button 
            onClick={handleCheck} 
            disabled={loading || !file}
            className="mt-4 px-8 py-3 bg-saudi-green text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'جاري الفحص...' : 'تحقق'}
          </button>
        </div>
      ) : (
        <div className="animate-fade-in">
          {isAuthentic && !isSuspicious ? (
            <div className="bg-green-100 p-10 rounded-xl text-green-800">
              <div className="text-2xl font-bold mb-4">✔ المستند سليم ومسجل</div>
              {result.issuer && (
                <p className="text-lg">جهة الإصدار: {result.issuer}</p>
              )}
              {result.registered_at && (
                <p className="text-sm mt-2">تاريخ التسجيل: {new Date(result.registered_at).toLocaleString('ar-SA')}</p>
              )}
            </div>
          ) : isSuspicious ? (
            <div className="bg-white border-t-8 border-red-500 p-8 rounded-xl shadow">
              <div className="flex items-center gap-8 text-right">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-red-600 mb-4">⚠ اشتباه تزوير</h3>
                  
                  {result.message && (
                    <p className="text-gray-700 mb-4">{result.message}</p>
                  )}
                  
                  {flags.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-bold text-gray-700 mb-2">المؤشرات المكتشفة:</h4>
                      <ul className="list-disc pr-5 text-gray-600 space-y-1">
                        {flags.map((flag, idx) => (
                          <li key={idx}>{typeof flag === 'string' ? flag : flag.description || flag.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {result.analysis && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
                      <h4 className="font-bold text-gray-700 mb-2">تفاصيل التحليل:</h4>
                      {result.analysis.metadata && (
                        <p>تحليل البيانات الوصفية: {result.analysis.metadata.status || 'تم'}</p>
                      )}
                      {result.analysis.ela && (
                        <p>تحليل مستوى الخطأ (ELA): {result.analysis.ela.status || 'تم'}</p>
                      )}
                      {result.analysis.ai_detection && (
                        <p>كشف AI: {result.analysis.ai_detection.result || 'تم'}</p>
                      )}
                    </div>
                  )}
                </div>
                
                {confidenceScore > 0 && (
                  <ScoreBadge score={confidenceScore} />
                )}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-100 p-10 rounded-xl text-yellow-800">
              <div className="text-2xl font-bold mb-4">⚡ المستند غير مسجل</div>
              <p>لم يتم العثور على هذا المستند في السجل</p>
              {result.message && <p className="mt-2 text-sm">{result.message}</p>}
            </div>
          )}
          
          <button 
            onClick={resetCheck} 
            className="mt-6 text-gray-500 underline hover:text-gray-700"
          >
            فحص مستند آخر
          </button>
        </div>
      )}
    </div>
  );
}
