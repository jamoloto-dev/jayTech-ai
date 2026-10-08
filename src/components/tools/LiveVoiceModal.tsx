import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Send, Headphones, Radio } from 'lucide-react';
import { api } from '../../services/api.js';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyVoiceSuggestion?: (suggestion: string) => void;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({
  isOpen,
  onClose,
  onApplyVoiceSuggestion,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Hey Jafta! I am your JayTech Live Voice Director. Speak into your mic or tell me what video you are brainstorming!',
    },
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    // Set up Web Speech recognition if supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text) {
          handleUserVoiceMessage(text);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech recognition start note:', err);
      }
    }
  };

  const handleUserVoiceMessage = async (text: string) => {
    const updatedHistory = [...messages, { role: 'user' as const, content: text }];
    setMessages(updatedHistory);
    setTranscript('');

    try {
      const res = await api.liveVoiceChat(text, updatedHistory);
      setMessages([...updatedHistory, { role: 'assistant', content: res.replyText }]);

      // Speak response out loud
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(res.replyText);
        utterance.pitch = 0.95;
        utterance.rate = 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error('Live voice error:', err);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    const msg = transcript;
    setTranscript('');
    handleUserVoiceMessage(msg);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#12141A] border border-[#2A2F40] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#2A2F40] flex items-center justify-between bg-[#161922]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF]">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Live Voice Director</span>
                <span className="text-[10px] text-[#00F0FF] font-mono font-semibold px-2 py-0.5 bg-[#00F0FF]/10 rounded border border-[#00F0FF]/20">
                  gemini-3.8-live
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8]">Real-time conversational voice assistance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#94A3B8] hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Animated Voice Sphere */}
        <div className="p-8 flex flex-col items-center justify-center bg-[#090A0E] border-b border-[#2A2F40]">
          <div className="relative">
            <div
              className={`w-28 h-28 rounded-full transition-all duration-300 flex items-center justify-center ${
                isSpeaking
                  ? 'bg-gradient-to-tr from-[#00F0FF] to-[#0088FF] shadow-[0_0_50px_rgba(0,240,255,0.6)] scale-110'
                  : isListening
                  ? 'bg-gradient-to-tr from-amber-500 to-red-500 shadow-[0_0_40px_rgba(245,158,11,0.5)] scale-105'
                  : 'bg-[#1A1D26] border-2 border-[#2A2F40]'
              }`}
            >
              {isSpeaking ? (
                <Volume2 className="w-10 h-10 text-black animate-pulse" />
              ) : isListening ? (
                <Mic className="w-10 h-10 text-black animate-pulse" />
              ) : (
                <Headphones className="w-10 h-10 text-[#64748B]" />
              )}
            </div>

            {/* Glowing rings */}
            {(isSpeaking || isListening) && (
              <div className="absolute inset-0 rounded-full border-2 border-[#00F0FF] animate-ping opacity-40 pointer-events-none" />
            )}
          </div>

          <div className="text-center mt-4 space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              {isSpeaking
                ? 'Gemini Live Speaking...'
                : isListening
                ? 'Listening to you...'
                : 'Tap microphone to speak'}
            </span>
            <p className="text-[11px] text-[#64748B]">
              Natural bidirectional voice director
            </p>
          </div>

          {/* Toggle Mic Button */}
          <button
            onClick={toggleListening}
            className={`mt-4 px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
              isListening
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-[#00F0FF] text-black hover:bg-[#33F3FF]'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isListening ? 'Stop Listening' : 'Start Voice Chat'}</span>
          </button>
        </div>

        {/* Conversation Dialog History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-56">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`p-3 rounded-xl text-xs leading-relaxed max-w-[85%] ${
                  m.role === 'user'
                    ? 'bg-[#00F0FF] text-black font-medium'
                    : 'bg-[#1A1D26] text-[#F0F3F8] border border-[#2A2F40]'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Text Input Fallback */}
        <form onSubmit={handleTextSubmit} className="p-3 border-t border-[#2A2F40] bg-[#161822]">
          <div className="flex items-center gap-2 bg-[#090A0E] border border-[#2A2F40] focus-within:border-[#00F0FF] rounded-xl px-3 py-2">
            <input
              type="text"
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              placeholder="Or type your question for Live Director..."
              className="flex-1 bg-transparent text-xs text-white outline-none"
            />
            <button
              type="submit"
              disabled={!transcript.trim()}
              className="text-[#00F0FF] hover:text-white disabled:opacity-30"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
