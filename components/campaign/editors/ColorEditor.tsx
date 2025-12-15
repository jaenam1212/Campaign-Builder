'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useCampaignStore } from '@/store/campaignStore';

export default function ColorEditor() {
    const { draftCampaign, updateDraftCampaign } = useCampaignStore();
    const [activeColor, setActiveColor] = useState<'primary' | 'secondary' | 'background' | 'text' | null>(null);

    if (!draftCampaign) return null;

    const colors = [
        { key: 'background' as const, label: '배경 색상', value: draftCampaign.colors.background },
        { key: 'text' as const, label: '텍스트 색상', value: draftCampaign.colors.text },
    ];

    const handleColorChange = (color: string) => {
        if (activeColor) {
            updateDraftCampaign({
                colors: {
                    ...draftCampaign.colors,
                    [activeColor]: color,
                },
            });
        }
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
            <label className="block text-sm font-medium text-gray-700">
                컬러 설정
            </label>
            <div className="mt-3 grid grid-cols-2 gap-2">
                {colors.map((color) => (
                    <div key={color.key}>
                        <label className="block text-xs font-medium text-gray-600">
                            {color.label}
                        </label>
                        <button
                            onClick={() => setActiveColor(activeColor === color.key ? null : color.key)}
                            className="mt-1 flex w-full items-center gap-2 rounded-md border border-gray-300 p-2 hover:bg-gray-50"
                        >
                            <div
                                className="h-8 w-8 rounded border border-gray-300"
                                style={{ backgroundColor: color.value }}
                            />
                            <span className="text-xs text-gray-700">{color.value}</span>
                        </button>
                    </div>
                ))}
            </div>
            {activeColor && (
                <div className="mt-3 rounded-md border border-gray-200 p-3">
                    <div className="mb-2 text-xs font-medium text-gray-700">
                        {colors.find((c) => c.key === activeColor)?.label}
                    </div>
                    <HexColorPicker
                        color={draftCampaign.colors[activeColor]}
                        onChange={handleColorChange}
                        className="mx-auto"
                        style={{ width: '100%', height: '150px' }}
                    />
                    <div className="mt-2">
                        <input
                            type="text"
                            value={draftCampaign.colors[activeColor]}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

