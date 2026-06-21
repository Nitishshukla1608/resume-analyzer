import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  // Local → localhost:5000
  // Vercel → same domain + /api
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

      formData.append(
        "resume",
        file
      );

      const res = await axios.post(
        `${API_URL}/api/analyze`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "SUCCESS:",
        res.data
      );

      setAnalysis(
        res.data.analysis
      );

    } catch (error) {

      console.log(
        "FULL ERROR:",
        error
      );

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

        alert(
          error.message
        );

      }

    } finally {
      setLoading(false);
    }
  };

  return (
    // Keep your existing JSX exactly same
  );
}

export default App;