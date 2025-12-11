'use client';

import { useState } from 'react';

interface SignatureModalProps {
  onClose: () => void;
  initialView?: 'form' | 'list';
}

interface Signature {
  id: string;
  name: string;
  content: string;
  date: string;
}

export default function SignatureModal({ onClose, initialView = 'form' }: SignatureModalProps) {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [showForm, setShowForm] = useState(initialView === 'form');
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  // TODO: 실제 서명 데이터는 Supabase에서 가져와야 함

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSignature: Signature = {
      id: Date.now().toString(),
      name: name.trim(),
      content: content.trim(),
      date: new Date().toLocaleDateString('ko-KR'),
    };

    setSignatures([...signatures, newSignature]);
    setName('');
    setContent('');
    setShowForm(false);
  };

  const handleViewList = () => {
    setShowForm(false);
  };

  const handleAddNew = () => {
    setShowForm(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {showForm ? '서명하기' : '서명자 목록'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="의견이나 메시지를 입력하세요 (선택사항)"
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                서명하기
              </button>
            </div>
            {signatures.length > 0 && (
              <div className="pt-4 border-t">
                <button
                  type="button"
                  onClick={handleViewList}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  서명자 목록 보기 ({signatures.length}명)
                </button>
              </div>
            )}
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={handleAddNew}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + 새로 서명하기
              </button>
            </div>
            {signatures.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                아직 서명이 없습니다.
              </p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {signatures.map((signature) => (
                  <div
                    key={signature.id}
                    className="rounded-md border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-900">{signature.name}</p>
                      <p className="text-xs text-gray-500">{signature.date}</p>
                    </div>
                    {signature.content && (
                      <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">
                        {signature.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={onClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
