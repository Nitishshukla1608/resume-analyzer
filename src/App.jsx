import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState("");

  const handleAnalyze = async () => {
    try {
      const formData = new FormData();
      formData.append("resume", file);
  
      const res = await axios.post(
        "http://localhost:5000/analyze",
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
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Resume Analyzer</h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />
      <br />

      <button onClick={handleAnalyze}>
        Analyze Resume
      </button>

      <br />
      <br />

      <pre>{analysis}</pre>
    </div>
  );
}

export default App;