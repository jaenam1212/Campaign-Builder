'use client';

import { ElementType, useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import './TextType.css';

interface TextTypeProps {
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string | React.ReactNode;
  cursorBlinkDuration?: number;
  cursorClassName?: string;
  text: string | string[];
  as?: ElementType;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
}

const TextType = ({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}: TextTypeProps & React.HTMLAttributes<HTMLElement>) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return;
    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    }
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (!isVisible) return;

    let timeout: NodeJS.Timeout;

    const currentText = textArray[currentTextIndex];
    const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText;

    const executeTypingAnimation = () => {
      if (isDeleting) {
        if (displayedText === '') {
          setIsDeleting(false);
          if (currentTextIndex === textArray.length - 1 && !loop) {
            return;
          }

          if (onSentenceComplete) {
            onSentenceComplete(textArray[currentTextIndex], currentTextIndex);
          }

          setCurrentTextIndex(prev => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
          timeout = setTimeout(() => { }, pauseDuration);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (currentCharIndex < processedText.length) {
          timeout = setTimeout(
            () => {
              setDisplayedText(prev => prev + processedText[currentCharIndex]);
              setCurrentCharIndex(prev => prev + 1);
            },
            variableSpeed ? getRandomSpeed() : typingSpeed
          );
        } else if (textArray.length >= 1) {
          if (!loop && currentTextIndex === textArray.length - 1) return;
          timeout = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        }
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
      timeout = setTimeout(executeTypingAnimation, initialDelay);
    } else {
      executeTypingAnimation();
    }

    return () => clearTimeout(timeout);
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    loop,
    initialDelay,
    isVisible,
    reverseMode,
    variableSpeed,
    onSentenceComplete,
    getRandomSpeed
  ]);

  const shouldHideCursor =
    hideCursorWhileTyping && (currentCharIndex < textArray[currentTextIndex].length || isDeleting);

  // ref callback을 사용하여 렌더링 중 ref 접근 방지
  const refCallback = useCallback((node: HTMLElement | null) => {
    (containerRef as React.MutableRefObject<HTMLElement | null>).current = node;
  }, []);

  const children = (
    <>
      <span className="text-type__content" style={{ color: getCurrentTextColor() || 'inherit' }}>
        {displayedText}
      </span>
      {showCursor && (
        <span
          ref={cursorRef}
          className={`text-type__cursor ${cursorClassName} ${shouldHideCursor ? 'text-type__cursor--hidden' : ''}`}
        >
          {cursorCharacter}
        </span>
      )}
    </>
  );

  // Component가 문자열인 경우 (기본 HTML 요소) JSX로 렌더링
  if (typeof Component === 'string') {
    // 동적 태그를 위해 switch 문 사용하여 타입 복잡성 해결
    const baseProps = {
      ref: refCallback,
      className: `text-type ${className}`,
      ...props
    };

    switch (Component) {
      case 'h1': return <h1 {...(baseProps as React.HTMLAttributes<HTMLHeadingElement>)}>{children}</h1>;
      case 'h2': return <h2 {...(baseProps as React.HTMLAttributes<HTMLHeadingElement>)}>{children}</h2>;
      case 'h3': return <h3 {...(baseProps as React.HTMLAttributes<HTMLHeadingElement>)}>{children}</h3>;
      case 'h4': return <h4 {...(baseProps as React.HTMLAttributes<HTMLHeadingElement>)}>{children}</h4>;
      case 'h5': return <h5 {...(baseProps as React.HTMLAttributes<HTMLHeadingElement>)}>{children}</h5>;
      case 'h6': return <h6 {...(baseProps as React.HTMLAttributes<HTMLHeadingElement>)}>{children}</h6>;
      case 'p': return <p {...(baseProps as React.HTMLAttributes<HTMLParagraphElement>)}>{children}</p>;
      case 'span': return <span {...(baseProps as React.HTMLAttributes<HTMLSpanElement>)}>{children}</span>;
      default: return <div {...(baseProps as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
    }
  }

  // 커스텀 컴포넌트인 경우 createElement 사용 (ref 제거)
  return createElement(
    Component,
    {
      className: `text-type ${className}`,
      ...props
    },
    children
  );
};

export default TextType;

