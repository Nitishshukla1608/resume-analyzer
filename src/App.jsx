import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a resume first!");
      return;
    }

    setLoading(true);
    setAnalysis("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await axios.post(
        "/api/analyze",
        formData
      );

      console.log("SUCCESS:", res.data);
      setAnalysis(res.data.analysis);

    } catch (error) {
      console.log("FULL ERROR:", error);

      if (error.response) {
        console.log("STATUS:", error.response.status);
        console.log("SERVER DATA:", error.response.data);
        alert(JSON.stringify(error.response.data));
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Left Sidebar: Controls & Upload */}
      <div className="w-full md:w-[450px] bg-white border-b md:border-b-0 md:border-r border-slate-200 p-8 flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-900 ">Resume Analyzer</h1>
            <p className="text-sm text-slate-500 mt-1">
              Upload your PDF resume to receive a comprehensive structural and keyword evaluation.
            </p>
          </div>

          {/* Drag & Drop File Upload Area */}
          <div className="group relative border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/30 rounded-xl p-6 text-center cursor-pointer transition-all duration-200">
            <input
              type="file"
              id="file-upload"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="space-y-2">
              <div className="text-4xl text-slate-400 group-hover:scale-110 transition-transform duration-200">
                {file ? "📄" : "📤"}
              </div>
              <div className="text-sm font-medium text-slate-700">
                {file ? file.name : "Click to upload or drag PDF"}
              </div>
              {!file && <p className="text-xs text-slate-400">PDF up to 10MB</p>}
            </div>
          </div>
        </div>

        {/* Action Button pinned to bottom of sidebar */}
        <div className="mt-8 md:mt-0">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-200 shadow-md ${
              loading 
                ? "bg-slate-400 cursor-not-allowed shadow-none" 
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-200"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing Profile...
              </span>
            ) : (
              "Analyze Resume"
            )}
          </button>
        </div>
      </div>

      {/* Right Side: Fullscreen Results Workspace */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {analysis ? (
          <div className="flex-1 flex flex-col p-6 md:p-10 overflow-hidden">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="flex w-2 h-2 rounded-full bg-emerald-500"></span>
                <p className="text-blue-500">Analysis Report</p>
              </h2>
              <span className="text-xs text-slate-400 bg-slate-200/60 px-2.5 py-1 rounded-md font-medium">
                Ready
              </span>
            </div>
            
            {/* Scrollable Output Box */}
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 overflow-y-auto overflow-x-auto shadow-sm text-slate-600 leading-relaxed text-sm whitespace-pre-wrap selection:bg-indigo-100 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
  {analysis}
</div>
          </div>
        ) : (
          /* Empty State Placeholder */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl mb-4">
              📊
            </div>
            <h3 className="text-base font-semibold text-slate-700">No Report Generated Yet</h3>
            <p className="text-sm text-slate-400 max-w-sm mt-1">
              Upload a resume and trigger the analyzer on the left panel to populate the analytics dashboard.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

export default App;