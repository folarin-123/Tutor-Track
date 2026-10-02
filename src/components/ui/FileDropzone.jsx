import React, { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";

export function FileDropzone({ onFileSelect, accept, maxKB = 5000, label = "Upload file" }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    if (f.size > maxKB * 1024) {
      setError(`File exceeds max size of ${Math.round(maxKB / 1024)}MB`);
      return;
    }
    setError("");
    setFile(f);
    onFileSelect?.(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-colors cursor-pointer text-center ${
          dragOver
            ? "border-primary-500 bg-primary-50/50 dark:bg-primary-950/20"
            : "border-[var(--border-strong)] bg-[var(--bg-surface-muted)] hover:border-primary-400"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {file ? (
          <div className="flex items-center gap-3">
            <FileText className="text-primary-500 shrink-0" size={24} />
            <div className="text-left">
              <p className="text-xs font-bold text-[var(--text-primary)]">{file.name}</p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                {Math.round(file.size / 1024)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
                onFileSelect?.(null);
              }}
              className="ml-2 rounded-full p-1 text-[var(--text-muted)] hover:bg-[var(--bg-surface)]"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <Upload className="mb-2 text-primary-500" size={24} />
            <p className="text-xs font-bold text-[var(--text-primary)]">{label}</p>
            <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
              Drag & drop or click to upload
            </p>
          </>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-bold text-danger-500">{error}</p>}
    </div>
  );
}
