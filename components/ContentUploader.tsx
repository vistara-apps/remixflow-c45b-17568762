    'use client';

    import { FC, useState, ChangeEvent } from 'react';

    interface Props {
      onFileChange: (file: File | null) => void;
      type: 'audio' | 'video';
      onTypeChange: (type: 'audio' | 'video') => void;
    }

    const ContentUploader: FC<Props> = ({ onFileChange, type, onTypeChange }) => {
      const [preview, setPreview] = useState<string | null>(null);

      const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          onFileChange(file);
          setPreview(URL.createObjectURL(file));
        }
      };

      return (
        <div className="col-span-12 p-[--space-md] bg-surface rounded-[--radius-md] shadow-card transition duration-base ease-custom">
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value as 'audio' | 'video')}
            className="mb-[--space-sm] bg-bg border border-muted rounded-[--radius-sm] p-[--space-sm] text-text"
          >
            <option value="audio">Audio</option>
            <option value="video">Video</option>
          </select>
          <input type="file" accept={`${type}/*`} onChange={handleFile} className="block w-full mb-[--space-sm]" />
          {preview && (
            type === 'audio' ? <audio src={preview} controls className="w-full" /> : <video src={preview} controls className="w-full" />
          )}
        </div>
      );
    };

    export default ContentUploader;
  