import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  // Local → localhost:5000
  // Production (Vercel) → same domain
  const API_URL = import.meta.env.DEV
    ? "http://localhost:5000"
    : "";

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
        `${API_URL}/api/analyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("SUCCESS:", res.data);

      setAnalysis(res.data.analysis);

    } catch (error) {
      console.log("FULL ERROR:", error);

      if (error.response) {
        console.log(
          "STATUS:",
          error.response.status
        );

        console.log(
          "SERVER DATA:",
          error.response.data
        );

        alert(
          error.response.data.error ||
          "Server Error"
        );
      } else {
        alert(error.message);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-slate-50 font-sans overflow-hidden">

      {/* Left Sidebar */}
      <div className="w-full md:w-[450px] bg-white border-b md:border-b-0 md:border-r border-slate-200 p-8 flex flex-col justify-between shrink-0">

        <div>

          {/* Header */}
          <div className="mb-8">

            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-4">

              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />

              </svg>

            </div>

            <h1 className="text-2xl font-bold text-red-900">
              Resume Analyzer
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Upload your PDF resume to receive a comprehensive analysis.
            </p>

          </div>

          {/* Upload Box */}
          <div className="group relative border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/30 rounded-xl p-6 text-center cursor-pointer transition-all duration-200">

            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setFile(
                  e.target.files[0]
                )
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            <div className="space-y-2">

              <div className="text-4xl">

                {file ? "📄" : "📤"}

              </div>

              <div className="text-sm font-medium">

                {file
                  ? file.name
                  : "Click to upload PDF"}

              </div>

            </div>

          </div>

        </div>

        {/* Button */}
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white mt-8
          ${
            loading
              ? "bg-slate-400"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >

          {loading
            ? "Analyzing..."
            : "Analyze Resume"}

        </button>

      </div>

      {/* Right Panel */}
      <div className="flex-1 p-8 overflow-auto">

        {analysis ? (

          <div className="bg-white p-6 rounded-xl shadow">

            <h2 className="text-lg font-bold text-blue-500 mb-4">

              Analysis Report

            </h2>

            <div className="whitespace-pre-wrap">

              {analysis}

            </div>

          </div>

        ) : (

          <div className="h-full flex flex-col items-center justify-center text-slate-400">

            <div className="text-5xl mb-4">

              📊

            </div>

            <p>
              Upload a resume and analyze it
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default App;