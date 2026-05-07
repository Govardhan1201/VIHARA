'use client';
import { useState } from 'react';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([
    { role: 'bot', text: 'Namaste! How can I help you find your next hidden gem in India?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    const currentInput = input;
    setInput('');

    // Mock AI response
    setTimeout(() => {
      let botReply = "I can definitely help with that! Tell me more about what kind of experience you are looking for.";
      if (currentInput.toLowerCase().includes('recommend') || currentInput.toLowerCase().includes('suggest')) {
        botReply = "I'd highly recommend Ziro Valley in Arunachal Pradesh or Gurez Valley in Kashmir if you're looking for untouched nature.";
      }
      setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-500 text-white rounded-full shadow-lg shadow-primary-500/30 flex items-center justify-center z-50 transition-transform transform hover:scale-110"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] max-h-[80vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden glass-effect">
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-500/20 text-primary-400 rounded-full flex items-center justify-center">🤖</div>
              <div>
                <h3 className="font-bold text-sm">Vihara AI Guide</h3>
                <p className="text-xs text-primary-400">Online</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything..." 
              className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-sm outline-none focus:border-primary-500"
            />
            <button type="submit" className="w-10 h-10 bg-primary-600 hover:bg-primary-500 text-white rounded-full flex items-center justify-center transition-colors">
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
