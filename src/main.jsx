import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 全局预激活移动端 Safari/Chrome Web Audio 音频通道
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        if (!window._dd_audio_ctx) window._dd_audio_ctx = new AudioCtx();
        if (window._dd_audio_ctx.state === 'suspended') {
          window._dd_audio_ctx.resume();
        }
      }
    } catch (e) {}
  };
  window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
  window.addEventListener('click', unlockAudio, { once: true, passive: true });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
