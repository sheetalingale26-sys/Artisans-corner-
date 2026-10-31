import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check, Link2, AlertCircle } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (dataUrlOrUrl: string) => void;
  helperText?: string;
  required?: boolean;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  helperText,
  required = false
}) => {
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/avif', 'image/webp'];
  const acceptedExtensions = '.png, .jpg, .jpeg, .avif, .webp';

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFile = (file: File) => {
    setUploadError(null);

    // Validate type (check MIME type or extension)
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isAcceptedExt = ext && ['png', 'jpg', 'jpeg', 'avif', 'webp'].includes(ext);
    const isAcceptedMime = supportedFormats.includes(file.type);

    if (!isAcceptedExt && !isAcceptedMime) {
      setUploadError('Unsupported format. Please select a PNG, JPG, AVIF, or WEBP image.');
      return;
    }

    // Size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image exceeds 10MB limit. Please choose a smaller file.');
      return;
    }

    setFileName(file.name);
    setFileSize(formatFileSize(file.size));

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClear = () => {
    onChange('');
    setFileName(null);
    setFileSize(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#28231F]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {/* Toggle Mode: Device File vs Image URL */}
        <div className="flex items-center gap-1 p-0.5 bg-[#FAF6F0] rounded-lg border border-[#E8DEC8] text-[11px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
              mode === 'upload' ? 'bg-[#28231F] text-white shadow-xs' : 'text-[#645D56] hover:text-[#28231F]'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>From Device</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
              mode === 'url' ? 'bg-[#28231F] text-white shadow-xs' : 'text-[#645D56] hover:text-[#28231F]'
            }`}
          >
            <Link2 className="w-3 h-3" />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {mode === 'upload' ? (
        <div className="space-y-3">
          {/* Hidden native input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedExtensions}
            onChange={handleFileChange}
            className="hidden"
          />

          {value ? (
            /* Uploaded Preview Card */
            <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#E8DEC8] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={value}
                  alt="Uploaded artifact"
                  className="w-14 h-14 rounded-xl object-cover border border-[#DDD1BE] shrink-0 shadow-xs"
                />
                <div className="text-xs truncate">
                  <div className="font-semibold text-[#28231F] truncate flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#6B7A52]" />
                    <span>{fileName || 'Image Selected from Device'}</span>
                  </div>
                  <div className="text-[11px] text-[#8A7E72] mt-0.5">
                    {fileSize ? `${fileSize} â€¢ ` : ''}PNG, JPG, AVIF, WEBP supported
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#DDD1BE] text-xs font-semibold text-[#28231F] hover:bg-[#F4EEE6] transition-colors cursor-pointer shadow-xs"
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Dropzone */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-[#A86F47] bg-[#F6EDE6]'
                  : 'border-[#DDD1BE] bg-[#FFFCF7] hover:border-[#A86F47]/60 hover:bg-[#FAF6F0]'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#F6EDE6] text-[#A86F47] mx-auto flex items-center justify-center mb-2.5 border border-[#E8DEC8]">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#28231F]">
                Drag and drop your craft photo here, or <span className="text-[#A86F47] underline">browse files</span>
              </p>
              <p className="text-[11px] text-[#8A7E72] mt-1">
                Supports: <strong>PNG, JPG, JPEG, AVIF, and WEBP</strong> (up to 10MB)
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Direct URL Mode */
        <div className="space-y-2">
          <div className="relative">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:border-[#A86F47]"
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {value && (
            <div className="flex items-center gap-3 p-2.5 bg-[#FAF6F0] rounded-xl border border-[#E8DEC8]">
              <img
                src={value}
                alt="URL Preview"
                className="w-12 h-12 rounded-lg object-cover border border-[#DDD1BE]"
                onError={(e) => {
                  (e.target as any).src = 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=300&q=80';
                }}
              />
              <span className="text-[11px] text-[#645D56] truncate">
                Preview active from web source
              </span>
            </div>
          )}
        </div>
      )}

      {helperText && <p className="text-[11px] text-[#8A7E72]">{helperText}</p>}
    </div>
  );
};