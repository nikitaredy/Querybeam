"use client";

import { useState } from "react";
import { uploadPDF } from "@/lib/api";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    setStatus("Uploading...");
    const res = await uploadPDF(file);
    setStatus(res.status);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Upload PDF</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Upload
      </button>

      <p className="mt-4">{status}</p>
    </div>
  );
}
