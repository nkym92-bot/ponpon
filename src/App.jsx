import React, { useState } from 'react';
import PadButton from './components/PadButton';
import './App.css';

// Import Fixed Sounds
import sound1 from './assets/mp3/01_罠.MP3';
import sound2 from './assets/mp3/02_昨年中は大変お世話に.MP3';
import sound3 from './assets/mp3/03_新春.MP3';
import sound4 from './assets/mp3/04_あけまして.MP3';
import sound5 from './assets/mp3/05_あけまして.MP3';
import sound6 from './assets/mp3/06_pon.MP3';
import sound7 from './assets/mp3/07_いよー.MP3';

// Import Visual Assets
import mainVisual from './assets/img/スクリーンショット 2026-02-02 143550.png';
import logoImg from './assets/img/rogo.png';

function App() {
  // customRecordings: { [id]: blobUrl }
  const [customRecordings, setCustomRecordings] = useState({});
  const [mode, setMode] = useState('play'); // 'play' | 'record'

  // Shogun Bubble Logic
  const [shogunText, setShogunText] = useState('');
  const timeoutRef = React.useRef(null);

  const shogunLines = [
    "成敗！",
    "余の顔を見忘れたか？",
    "苦しゅうない",
    "あっぱれ！",
    "うむ",
    "上様！",
    "暴れん坊将軍推参！",
    "世直しじゃ！"
  ];

  const triggerShogun = () => {
    const randomLine = shogunLines[Math.floor(Math.random() * shogunLines.length)];
    setShogunText(randomLine);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShogunText('');
    }, 2000);
  };

  const handleUpdateAudio = (id, url) => {
    setCustomRecordings(prev => ({
      ...prev,
      [id]: url
    }));
  };

  const padConfig = [
    { id: 1, label: '罠', isFixed: true, fixedSrc: sound1 },
    { id: 2, label: '昨年中は', isFixed: true, fixedSrc: sound2 },
    { id: 3, label: '新春', isFixed: true, fixedSrc: sound3 },
    { id: 4, label: 'あけまして1', isFixed: true, fixedSrc: sound4 },
    { id: 5, label: 'あけまして2', isFixed: true, fixedSrc: sound5 },
    { id: 6, label: 'PON', isFixed: true, fixedSrc: sound6 },
    { id: 7, label: 'イヨー', isFixed: true, fixedSrc: sound7 },
    { id: 8, label: 'REC 1', isFixed: false },
    { id: 9, label: 'REC 2', isFixed: false },
  ];

  return (
    <div className="app-container">
      <header>
        {/* Main Visual Section with Bubble */}
        <div className="visual-section" style={{ position: 'relative', width: '48%' }}>
          <img src={mainVisual} alt="Main Visual" className="main-visual" style={{ width: '100%' }} />
          {shogunText && (
            <div className="speech-bubble">
              {shogunText}
            </div>
          )}
        </div>

        {/* Logo below text/visual - SIDE BY SIDE Layout */}
        <div className="logo-container">
          <img src={logoImg} alt="Shogun Sampler Logo" className="logo-img" />
        </div>

        {/* Hidden SEO title */}
        <h1 className="hidden-title">SHOGUN SAMPLER</h1>
      </header>

      <div className="controls">
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === 'play' ? 'active' : ''}`}
            onClick={() => setMode('play')}
          >
            PLAY
          </button>
          <button
            className={`mode-btn ${mode === 'record' ? 'active' : ''}`}
            onClick={() => setMode('record')}
          >
            RECORD
          </button>
        </div>
        <div className="status-text">
          {mode === 'play' ? 'ボタンを押してください。' : 'ボタン長押しで録音'}
        </div>
      </div>

      <div className="sampler-grid">
        {padConfig.map(pad => (
          <PadButton
            key={pad.id}
            id={pad.id}
            isFixed={pad.isFixed}
            label={pad.label}
            mode={mode}
            audioUrl={pad.isFixed ? pad.fixedSrc : customRecordings[pad.id]}
            onUpdateAudio={handleUpdateAudio}
            onInteraction={triggerShogun}
          />
        ))}
      </div>

      <footer>
        <p>Built with React & Vite</p>
      </footer>
    </div>
  );
}

export default App;
