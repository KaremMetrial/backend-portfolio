import React, { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import api from "../utils/api";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  type: "hero" | "profile" | "project" | "experience";
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  type,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (file.size > 2 * 1024 * 1024) {
      setError("File size exceeds 2MB limit.");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);

      const response = await api.post("/upload-image", formData);

      if (response.data.success) {
        let url = response.data.data.url;
        // If the URL is relative (starts with /storage), prefix it
        if (url && url.startsWith("/storage")) {
          url = `http://localhost:8000${url}`;
        }
        onChange(url);
      } else {
        setError(response.data.message || "Upload failed");
      }
    } catch (err: any) {
      console.error("Upload Error:", err);
      // Access Laravel validation errors if present
      const serverError = err.response?.data;
      if (serverError?.errors) {
        const firstError = Object.values(serverError.errors)[0] as string[];
        setError(
          Array.isArray(firstError) ? firstError[0] : "Invalid file or type",
        );
      } else {
        setError(
          serverError?.message ||
            "Failed to upload image. Verify server connection.",
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-400">{label}</label>

      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/10 group">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Reliable gray base64 fallback
                (e.target as HTMLImageElement).src =
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8Ww8AAj8BXiS9p0AAAAABJRU5ErkJggg==";
              }}
            />
            <button
              onClick={removeImage}
              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center hover:border-purple-500/50 hover:bg-white/5 transition-all text-gray-500"
          >
            {uploading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <Upload size={24} />
                <span className="text-[10px] mt-1 font-bold">UPLOAD</span>
              </>
            )}
          </button>
        )}

        <div className="flex-1 space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ImageIcon size={16} className="text-gray-500" />
            </div>
            <input
              type="text"
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
              placeholder="Or paste image URL here..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
          <p className="text-[10px] text-gray-500 italic">
            Recommended: JPG, PNG or WebP. Max 2MB.
          </p>
          {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default ImageUpload;