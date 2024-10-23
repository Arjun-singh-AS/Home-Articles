'use client';

import { useState } from 'react';

export default function ImageUpload() {
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setImage(reader.result);
  };

  const handleUpload = async () => {
    if (!image) return;

    setLoading(true);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: image }),
      });

      const data = await response.json();
      if (data.success) {
        setUploadedImageUrl(data.url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button
        onClick={handleUpload}
        disabled={!image || loading}
        className="mt-4 p-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      {uploadedImageUrl && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Uploaded Image:</h3>
          <img src={uploadedImageUrl} alt="Uploaded" className="mt-4 w-64 h-auto" />
          <p>{uploadedImageUrl}</p>
        </div>
      )}
    </div>
  );
}
