'use client';

import { useState } from 'react';
import { useCampaignStore } from '@/store/campaignStore';

export default function ActionItemsEditor() {
    const { draftCampaign, updateDraftCampaign } = useCampaignStore();
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState('');

    if (!draftCampaign) return null;

    const actionItems = draftCampaign.actionItems || [];
    const actionItemsTitle = draftCampaign.actionItemsTitle || '행동강령';
    const showActionItems = draftCampaign.showActionItems !== false;

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setEditingValue(actionItems[index] || '');
    };

    const handleSave = (index: number) => {
        const newActionItems = [...actionItems];
        newActionItems[index] = editingValue;
        updateDraftCampaign({ actionItems: newActionItems });
        setEditingIndex(null);
        setEditingValue('');
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setEditingValue('');
    };

    const handleAdd = () => {
        const newActionItems = [...actionItems, ''];
        updateDraftCampaign({ actionItems: newActionItems });
        setEditingIndex(newActionItems.length - 1);
        setEditingValue('');
    };

    const handleRemove = (index: number) => {
        const newActionItems = actionItems.filter((_, i) => i !== index);
        updateDraftCampaign({ actionItems: newActionItems });
        if (editingIndex === index) {
            setEditingIndex(null);
            setEditingValue('');
        } else if (editingIndex !== null && editingIndex > index) {
            setEditingIndex(editingIndex - 1);
        }
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === actionItems.length - 1) return;

        const newActionItems = [...actionItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newActionItems[index], newActionItems[targetIndex]] = [
            newActionItems[targetIndex],
            newActionItems[index],
        ];
        updateDraftCampaign({ actionItems: newActionItems });

        if (editingIndex === index) {
            setEditingIndex(targetIndex);
        } else if (editingIndex === targetIndex) {
            setEditingIndex(index);
        }
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                    행동강령
                </label>
                <div className="flex items-center gap-2">
                    <label className="flex cursor-pointer items-center gap-1">
                        <input
                            type="checkbox"
                            checked={showActionItems}
                            onChange={(e) =>
                                updateDraftCampaign({ showActionItems: e.target.checked })
                            }
                            className="h-3 w-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-600">표시</span>
                    </label>
                    <button
                        onClick={handleAdd}
                        className="text-xs text-blue-600 hover:text-blue-700"
                    >
                        + 추가
                    </button>
                </div>
            </div>

            {/* 제목 편집 */}
            <div className="mb-3">
                <label className="mb-1 block text-xs font-medium text-gray-600">
                    제목
                </label>
                <input
                    type="text"
                    value={actionItemsTitle}
                    onChange={(e) =>
                        updateDraftCampaign({ actionItemsTitle: e.target.value })
                    }
                    placeholder="행동강령"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
            </div>

            {actionItems.length === 0 ? (
                <p className="py-4 text-center text-xs text-gray-400">
                    행동강령이 없습니다. 추가 버튼을 눌러 추가하세요.
                </p>
            ) : (
                <div className="space-y-2">
                    {actionItems.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-md border border-gray-200 p-2"
                        >
                            {editingIndex === index ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-gray-500">
                                            {index + 1}.
                                        </span>
                                        <textarea
                                            value={editingValue}
                                            onChange={(e) => setEditingValue(e.target.value)}
                                            placeholder="행동강령을 입력하세요"
                                            rows={2}
                                            className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex justify-end gap-1">
                                        <button
                                            onClick={handleCancel}
                                            className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
                                        >
                                            취소
                                        </button>
                                        <button
                                            onClick={() => handleSave(index)}
                                            className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
                                        >
                                            저장
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-2">
                                    <span className="text-xs font-medium text-gray-500">
                                        {index + 1}.
                                    </span>
                                    <div className="flex-1">
                                        <p
                                            onClick={() => handleEdit(index)}
                                            className="cursor-text text-sm text-gray-700 hover:text-gray-900"
                                        >
                                            {item || '(비어있음)'}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        {index > 0 && (
                                            <button
                                                onClick={() => handleMove(index, 'up')}
                                                className="text-gray-400 hover:text-gray-600"
                                                title="위로"
                                            >
                                                ↑
                                            </button>
                                        )}
                                        {index < actionItems.length - 1 && (
                                            <button
                                                onClick={() => handleMove(index, 'down')}
                                                className="text-gray-400 hover:text-gray-600"
                                                title="아래로"
                                            >
                                                ↓
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleRemove(index)}
                                            className="text-red-400 hover:text-red-600"
                                            title="삭제"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

