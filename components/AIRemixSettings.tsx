    'use client';

    import { FC, useState } from 'react';

    interface Props {
      onSettingsChange: (settings: { transformation: string; params: Record<string, any> }) => void;
    }

    const AIRemixSettings: FC<Props> = ({ onSettingsChange }) => {
      const [transformation, setTransformation] = useState('dubbing');
      const [language, setLanguage] = useState('en');

      const handleChange = () => {
        onSettingsChange({ transformation, params: { language } });
      };

      return (
        <div className="col-span-6 p-[--space-md] bg-surface rounded-[--radius-md] shadow-card transition duration-base ease-custom">
          <h2 className="text-heading mb-[--space-sm]">AI Remix Settings</h2>
          <select
            value={transformation}
            onChange={(e) => { setTransformation(e.target.value); handleChange(); }}
            className="mb-[--space-sm] bg-bg border border-muted rounded-[--radius-sm] p-[--space-sm] w-full text-text"
          >
            <option value="dubbing">Dubbing</option>
            <option value="styleTransfer">Style Transfer</option>
          </select>
          <input
            type="text"
            value={language}
            onChange={(e) => { setLanguage(e.target.value); handleChange(); }}
            placeholder="Target Language"
            className="w-full bg-bg border border-muted rounded-[--radius-sm] p-[--space-sm] text-text"
          />
        </div>
      );
    };

    export default AIRemixSettings;
  