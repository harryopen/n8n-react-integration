import { useState } from "react";

export default function ResumeUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("⚠️ Please upload a valid PDF file.");
      e.target.value = ""; // reset the input
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a PDF file before submitting!");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch(
        "https://harryopen.app.n8n.cloud/webhook-test/submit-cv",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to upload file");

      const result = await res.text();
      console.log(result);
      alert("✅ Resume uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong while uploading.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6 border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          Upload Your Resume 📄
        </h1>

        <div>
          <label className="block text-gray-600 mb-2 text-sm">
            Upload PDF Resume
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        <button
          type="submit"
          disabled={!file || uploading}
          className={`w-full py-3 text-white font-semibold rounded-lg shadow-md transition-all ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
          }`}
        >
          {uploading ? "Uploading..." : "Submit Resume ✈️"}
        </button>
      </form>
    </div>
  );
}
