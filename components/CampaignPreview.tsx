'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useCampaignStore } from '@/store/campaignStore';
import SignatureModal from './campaign/features/SignatureModal';
import SignatureTicker from './campaign/features/SignatureTicker';
import { AVAILABLE_FONTS } from './campaign/editors/FontEditor';
import { GRADIENT_PRESETS } from './campaign/editors/BackgroundGradientEditor';
import SplitText from './campaign/ui/SplitText';
import TextType from './campaign/ui/TextType';
import Shuffle from './campaign/ui/Shuffle';

interface CampaignPreviewProps {
  editable?: boolean;
}

export default function CampaignPreview({ editable = true }: CampaignPreviewProps) {
  const { draftCampaign, updateDraftCampaign } = useCampaignStore();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingActionItemIndex, setEditingActionItemIndex] = useState<number | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureModalView, setSignatureModalView] = useState<'form' | 'list'>('form');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!draftCampaign) return null;

  const colors = draftCampaign.colors;
  const actionItems = draftCampaign.actionItems || [];
  const actionItemsTitle = draftCampaign.actionItemsTitle || '행동강령';
  const showActionItems = draftCampaign.showActionItems !== false;

  // 폰트 설정
  const fontFamily = draftCampaign.font?.family || 'noto-sans-kr';
  const fontWeight = draftCampaign.font?.weight || 400;
  const selectedFont = AVAILABLE_FONTS.find((f) => f.value === fontFamily);
  const fontStyle = selectedFont?.style || 'var(--font-noto-sans-kr)';

  // 배경 그라데이션 설정
  const gradientPreset = draftCampaign.backgroundGradient || 'none';
  const selectedGradient = GRADIENT_PRESETS.find((g) => g.value === gradientPreset);
  const backgroundStyle = selectedGradient?.value === 'none'
    ? colors.background
    : selectedGradient?.gradient || colors.background;

  // 애니메이션 효과 설정
  const effects = draftCampaign.effects || {
    titleEffect: 'none',
    backgroundOverlay: 'none',
    signatureTicker: false,
  };

  // 배경 오버레이 스타일
  const getOverlayStyle = () => {
    switch (effects.backgroundOverlay) {
      case 'radial-red':
        return 'bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.25),transparent_50%)]';
      case 'radial-blue':
        return 'bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.25),transparent_50%)]';
      case 'radial-multi':
        return '';
      default:
        return '';
    }
  };

  const getMultiOverlayStyles = () => {
    if (effects.backgroundOverlay === 'radial-multi') {
      return (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.15),transparent_50%)] z-[1]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(251,146,60,0.15),transparent_50%)] z-[1]"></div>
        </>
      );
    }
    return null;
  };

  // 제목 애니메이션 클래스
  const getTitleAnimationClass = () => {
    if (!effects.titleEffect || effects.titleEffect === 'none') return '';
    return `animate-${effects.titleEffect}`;
  };

  const handleFieldClick = (field: string) => {
    if (editable) {
      setEditingField(field);
    }
  };

  const handleFieldBlur = () => {
    setEditingField(null);
    setEditingActionItemIndex(null);
  };

  const handleFieldChange = (field: string, value: string) => {
    if (field === 'title') {
      updateDraftCampaign({ title: value });
    } else if (field === 'subtitle') {
      updateDraftCampaign({ subtitle: value });
    } else if (field === 'content') {
      updateDraftCampaign({ content: value });
    } else if (field === 'actionItemsTitle') {
      updateDraftCampaign({ actionItemsTitle: value });
    }
  };

  const handleActionItemChange = (index: number, value: string) => {
    const newActionItems = [...actionItems];
    newActionItems[index] = value;
    updateDraftCampaign({ actionItems: newActionItems });
  };

  const handleAddActionItem = () => {
    const newActionItems = [...actionItems, ''];
    updateDraftCampaign({ actionItems: newActionItems });
    setEditingActionItemIndex(newActionItems.length - 1);
  };

  const handleRemoveActionItem = (index: number) => {
    const newActionItems = actionItems.filter((_, i) => i !== index);
    updateDraftCampaign({ actionItems: newActionItems });
  };

  const handleMoveActionItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === actionItems.length - 1) return;

    const newActionItems = [...actionItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newActionItems[index], newActionItems[targetIndex]] = [
      newActionItems[targetIndex],
      newActionItems[index],
    ];
    updateDraftCampaign({ actionItems: newActionItems });
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      updateDraftCampaign({ image: result });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (editable) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!editable) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleImageClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateDraftCampaign({ image: '' });
  };

  return (
    <div
      className="min-h-screen w-full relative"
      style={{
        background: backgroundStyle,
        color: colors.text,
        fontFamily: fontStyle,
        fontWeight: fontWeight,
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 서명 티커 배경 */}
      {effects.signatureTicker && (
        <SignatureTicker campaignId={draftCampaign.id} enabled={true} />
      )}

      {/* 배경 오버레이 */}
      {effects.backgroundOverlay !== 'none' && effects.backgroundOverlay !== 'radial-multi' && (
        <div className={`absolute inset-0 z-[1] ${getOverlayStyle()}`}></div>
      )}
      {getMultiOverlayStyles()}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <div className="mx-auto max-w-4xl px-4 py-12 text-center md:px-8 relative z-10">
        {editable && (
          <div className="mb-4 text-xs text-gray-400">
            클릭하여 편집할 수 있습니다 | 이미지를 드래그해서 추가하세요
          </div>
        )}

        {/* 타이틀 */}
        {editingField === 'title' && editable ? (
          <input
            type="text"
            value={draftCampaign.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            onBlur={handleFieldBlur}
            autoFocus
            className="mb-4 w-full text-5xl font-bold outline-none text-center"
            style={{
              background: backgroundStyle,
              color: colors.text,
              fontFamily: fontStyle,
              fontWeight: fontWeight,
              borderBottom: `2px solid ${colors.primary}`,
            }}
          />
        ) : effects.titleEffect === 'split-text' ? (
          <div
            onClick={() => handleFieldClick('title')}
            className={`mb-4 ${editable ? 'cursor-text hover:opacity-80' : ''} ${!draftCampaign.title && editable ? 'opacity-50' : ''}`}
          >
            <SplitText
              text={draftCampaign.title || '캠페인 제목을 입력하세요'}
              className="text-5xl font-bold"
              tag="h1"
              delay={100}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              style={{
                color: colors.text,
                fontFamily: fontStyle,
                fontWeight: fontWeight,
              }}
            />
          </div>
        ) : effects.titleEffect === 'text-type' ? (
          <div
            onClick={() => handleFieldClick('title')}
            className={`mb-4 text-5xl font-bold text-center ${editable ? 'cursor-text hover:opacity-80' : ''} ${!draftCampaign.title && editable ? 'opacity-50' : ''}`}
            style={{
              color: colors.text,
              fontFamily: fontStyle,
              fontWeight: fontWeight,
            }}
          >
            <TextType
              text={draftCampaign.title || '캠페인 제목을 입력하세요'}
              as="h1"
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
              loop={true}
              className="text-5xl font-bold"
            />
          </div>
        ) : effects.titleEffect === 'shuffle' ? (
          <div
            onClick={() => handleFieldClick('title')}
            className={`mb-4 ${editable ? 'cursor-text hover:opacity-80' : ''} ${!draftCampaign.title && editable ? 'opacity-50' : ''}`}
          >
            <Shuffle
              text={draftCampaign.title || '캠페인 제목을 입력하세요'}
              className="text-5xl font-bold"
              tag="h1"
              shuffleDirection="right"
              duration={0.35}
              animationMode="evenodd"
              shuffleTimes={1}
              ease="power3.out"
              stagger={0.03}
              threshold={0.1}
              triggerOnce={true}
              triggerOnHover={true}
              respectReducedMotion={true}
              textAlign="center"
              style={{
                color: colors.text,
                fontFamily: fontStyle,
                fontWeight: fontWeight,
              }}
            />
          </div>
        ) : (
          <h1
            onClick={() => handleFieldClick('title')}
            className={`mb-4 text-5xl font-bold transition-all ${getTitleAnimationClass()} ${editable ? 'cursor-text hover:opacity-80' : ''
              } ${!draftCampaign.title && editable ? 'opacity-50' : ''}`}
            style={{
              color: colors.text,
              fontFamily: fontStyle,
              fontWeight: fontWeight,
              ...(effects.titleEffect === 'gradient-animate' ? {
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.primary})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% auto',
              } : {})
            }}
          >
            {draftCampaign.title || '캠페인 제목을 입력하세요'}
          </h1>
        )}

        {/* 서브타이틀 */}
        {editingField === 'subtitle' && editable ? (
          <input
            type="text"
            value={draftCampaign.subtitle || ''}
            onChange={(e) => handleFieldChange('subtitle', e.target.value)}
            onBlur={handleFieldBlur}
            autoFocus
            className="mb-8 w-full text-2xl font-medium outline-none text-center"
            style={{
              background: backgroundStyle,
              color: colors.text,
              fontFamily: fontStyle,
              fontWeight: fontWeight,
              borderBottom: `2px solid ${colors.primary}`,
            }}
          />
        ) : (
          <h2
            onClick={() => handleFieldClick('subtitle')}
            className={`mb-8 text-2xl font-medium transition-all ${editable ? 'cursor-text hover:opacity-80' : ''
              } ${!draftCampaign.subtitle && editable ? 'opacity-50' : ''}`}
            style={{ color: colors.text }}
          >
            {draftCampaign.subtitle || '서브타이틀을 입력하세요'}
          </h2>
        )}

        {/* 이미지 */}
        <div className="mb-12 flex justify-center">
          {draftCampaign.image && draftCampaign.image.trim() ? (
            <div className="relative group">
              {editable && (
                <button
                  onClick={handleImageRemove}
                  className="absolute -top-2 -right-2 z-10 rounded-full bg-red-500 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ✕
                </button>
              )}
              <div
                onClick={handleImageClick}
                className={`relative cursor-pointer overflow-hidden rounded-lg transition-all ${editable ? 'hover:opacity-90' : ''
                  }`}
              >
                {draftCampaign.image.startsWith('data:') ? (
                  // data URL인 경우 일반 img 태그 사용
                  <img
                    src={draftCampaign.image}
                    alt="캠페인 이미지"
                    className="max-h-96 w-auto object-contain"
                    onError={(e) => {
                      console.error('Image load error:', e);
                    }}
                  />
                ) : (
                  // 일반 URL인 경우 Next.js Image 사용
                  <div className="relative h-96 w-full">
                    <Image
                      src={draftCampaign.image}
                      alt="캠페인 이미지"
                      fill
                      className="object-contain"
                      unoptimized
                      onError={(e) => {
                        console.error('Image load error:', e);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : editable ? (
            <div
              onClick={handleImageClick}
              className={`w-full cursor-pointer rounded-lg border-2 border-dashed p-12 transition-all ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              style={{ borderColor: isDragging ? colors.primary : undefined }}
            >
              <p className="text-gray-400">
                이미지를 드래그하거나 클릭하여 추가하세요
              </p>
            </div>
          ) : null}
        </div>

        {/* 서명하기 버튼 - 공개 페이지에서만 표시 */}
        {!editable && (
          <div className="mb-12">
            <button
              onClick={() => {
                setSignatureModalView('form');
                setShowSignatureModal(true);
              }}
              className="mb-6 rounded-lg px-8 py-4 text-lg font-semibold text-white transition-all hover:opacity-90"
              style={{
                backgroundColor: colors.primary,
              }}
            >
              서명하기
            </button>
            <div className="mt-4">
              <button
                onClick={() => {
                  setSignatureModalView('list');
                  setShowSignatureModal(true);
                }}
                className="text-sm opacity-70 hover:opacity-100 underline"
                style={{ color: colors.text }}
              >
                서명자 목록 보기
              </button>
            </div>
          </div>
        )}

        {/* 내용 */}
        {editingField === 'content' && editable ? (
          <textarea
            value={draftCampaign.content}
            onChange={(e) => handleFieldChange('content', e.target.value)}
            onBlur={handleFieldBlur}
            autoFocus
            rows={6}
            className="mb-12 w-full text-lg leading-relaxed outline-none text-center"
            style={{
              background: backgroundStyle,
              color: colors.text,
              fontFamily: fontStyle,
              fontWeight: fontWeight,
              borderBottom: `2px solid ${colors.primary}`,
            }}
          />
        ) : (
          <div
            onClick={() => handleFieldClick('content')}
            className={`mx-auto mb-12 max-w-2xl whitespace-pre-wrap text-lg leading-relaxed transition-all ${editable ? 'cursor-text hover:opacity-80' : ''
              } ${!draftCampaign.content && editable ? 'opacity-50' : ''}`}
            style={{ color: colors.text }}
          >
            {draftCampaign.content || '캠페인 내용을 입력하세요'}
          </div>
        )}

        {/* 행동강령 */}
        {showActionItems && (actionItems.length > 0 || editable) ? (
          <div className="mb-8">
            {editingField === 'actionItemsTitle' && editable ? (
              <input
                type="text"
                value={actionItemsTitle}
                onChange={(e) => handleFieldChange('actionItemsTitle', e.target.value)}
                onBlur={handleFieldBlur}
                autoFocus
                className="mb-6 w-full text-xl font-semibold outline-none text-center"
                style={{
                  background: backgroundStyle,
                  color: colors.text,
                  fontFamily: fontStyle,
                  fontWeight: fontWeight,
                  borderBottom: `2px solid ${colors.primary}`,
                }}
              />
            ) : (
              <h3
                onClick={() => handleFieldClick('actionItemsTitle')}
                className={`mb-6 text-xl font-semibold transition-all ${editable ? 'cursor-text hover:opacity-80' : ''
                  }`}
                style={{ color: colors.text }}
              >
                {actionItemsTitle}
              </h3>
            )}
            <div className="mx-auto max-w-2xl space-y-3 text-left">
              {actionItems.map((item, index) => (
                <div key={index} className="group flex items-start gap-3">
                  <span className="text-lg font-semibold">{index + 1}.</span>
                  {editingActionItemIndex === index && editable ? (
                    <textarea
                      value={item}
                      onChange={(e) => handleActionItemChange(index, e.target.value)}
                      onBlur={handleFieldBlur}
                      autoFocus
                      rows={2}
                      className="flex-1 text-base outline-none"
                      style={{
                        background: backgroundStyle,
                        color: colors.text,
                        fontFamily: fontStyle,
                        fontWeight: fontWeight,
                        borderBottom: `2px solid ${colors.primary}`,
                      }}
                    />
                  ) : (
                    <div
                      onClick={() => editable && setEditingActionItemIndex(index)}
                      className={`flex-1 transition-all ${editable ? 'cursor-text hover:opacity-80' : ''
                        } ${!item && editable ? 'opacity-50' : ''}`}
                      style={{ color: colors.text }}
                    >
                      {item || `행동강령 ${index + 1}을 입력하세요`}
                    </div>
                  )}
                  {editable && (
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {index > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveActionItem(index, 'up');
                          }}
                          className="text-gray-400 hover:text-gray-600"
                          title="위로"
                        >
                          ↑
                        </button>
                      )}
                      {index < actionItems.length - 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveActionItem(index, 'down');
                          }}
                          className="text-gray-400 hover:text-gray-600"
                          title="아래로"
                        >
                          ↓
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveActionItem(index);
                        }}
                        className="text-red-400 hover:text-red-600"
                        title="삭제"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {editable && (
                <button
                  onClick={handleAddActionItem}
                  className="mt-4 text-sm opacity-70 hover:opacity-100"
                  style={{ color: colors.primary }}
                >
                  + 행동강령 추가
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {showSignatureModal && (
        <SignatureModal 
          onClose={() => setShowSignatureModal(false)} 
          initialView={signatureModalView}
        />
      )}
    </div>
  );
}
