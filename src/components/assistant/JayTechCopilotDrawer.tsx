import React, { useState } from 'react';
import { Wand2, X, Send, Sparkles, MessageSquare, Bot } from 'lucide-react';
import { Project } from '../../types/index.js';
import { api } from '../../services/api.js';

interface JayTechCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentProject: Project | null;
}

export const JayTechCopilotDrawer: React.FC<JayTechCopilotDrawerProps> = ({
  isOpen,
  onClose,
  currentProject,
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text: 'Hello! I am your JayTech AI Video Copilot. I can help refine your hooks, intensify scenes, or brainstorm episodic spin-offs. What are you working on?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const reply = await api.askAssistant(userText, currentProject);
      setMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: 'To boost retention on TikTok: Lead with a strong curiosity gap in scene 1 and increase camera movement speed during the transition.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Make scene 4 more intense',
    'Suggest 3 viral curiosity hooks',
    'Shorten narration for faster pacing',
    'Propose a sequel episode for Jafta',
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-[#12141A] border-l border-[#2A2F40] z-50 flex flex-col shadow-2xl animate-slide-left">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#2A2F40] flex items-center justify-between bg-[#161822]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] flex items-center justify-center border border-[#00F0FF]/30">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">JayTech Copilot</h3>
            <span className="text-[10px] text-[#64748B] font-mono">Gemini 3.8 Intelligence</span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-[#94A3B8] hover:text-white rounded-lg">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3 rounded-xl text-xs leading-relaxed max-w-[85%] ${
                m.sender === 'user'
                  ? 'bg-[#00F0FF] text-black font-medium'
                  : 'bg-[#1A1D26] text-[#F0F3F8] border border-[#2A2F40]'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-1.5 text-xs text-[#00F0FF] font-mono p-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-[#1E2330] flex gap-1.5 overflow-x-auto no-scrollbar">
        {quickPrompts.map(qp => (
          <button
            key={qp}
            onClick={() => setInput(qp)}
            className="text-[10px] text-[#94A3B8] hover:text-white bg-[#1A1D26] border border-[#2A2F40] px-2.5 py-1 rounded-md shrink-0 transition-colors"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 border-t border-[#2A2F40] bg-[#161822]">
        <div className="flex items-center gap-2 bg-[#090A0E] border border-[#2A2F40] focus-within:border-[#00F0FF] rounded-xl px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask copilot to refine your project..."
            className="flex-1 bg-transparent text-xs text-white outline-none"
          />
          <button type="submit" disabled={!input.trim() || loading} className="text-[#00F0FF] hover:text-white disabled:opacity-30">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
