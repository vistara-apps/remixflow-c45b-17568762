    'use client';

    import { FC, useState } from 'react';

    interface Royalty { recipient: string; percentage: number; }

    interface Props {
      onRoyaltiesChange: (royalties: Royalty[]) => void;
    }

    const RoyaltySplitter: FC<Props> = ({ onRoyaltiesChange }) => {
      const [royalties, setRoyalties] = useState<Royalty[]>([{ recipient: '', percentage: 0 }]);

      const addSplit = () => {
        setRoyalties([...royalties, { recipient: '', percentage: 0 }]);
        onRoyaltiesChange([...royalties]);
      };

      const updateSplit = (index: number, field: 'recipient' | 'percentage', value: string | number) => {
        const updated = [...royalties];
        updated[index][field] = typeof value === 'string' ? value : Number(value);
        setRoyalties(updated);
        onRoyaltiesChange(updated);
      };

      return (
        <div className="col-span-6 p-[--space-md] bg-surface rounded-[--radius-md] shadow-card transition duration-base ease-custom">
          <h2 className="text-heading mb-[--space-sm]">Royalty Splitter</h2>
          {royalties.map((split, index) => (
            <div key={index} className="flex mb-[--space-sm]">
              <input
                type="text"
                value={split.recipient}
                onChange={(e) => updateSplit(index, 'recipient', e.target.value)}
                placeholder="Recipient Address"
                className="flex-1 bg-bg border border-muted rounded-[--radius-sm] p-[--space-sm] mr-[--space-sm] text-text"
              />
              <input
                type="number"
                value={split.percentage}
                onChange={(e) => updateSplit(index, 'percentage', parseFloat(e.target.value))}
                placeholder="%"
                className="w-20 bg-bg border border-muted rounded-[--radius-sm] p-[--space-sm] text-text"
              />
            </div>
          ))}
          <button onClick={addSplit} className="text-primary underline">Add Split</button>
        </div>
      );
    };

    export default RoyaltySplitter;
  