import React, { useState, useEffect } from 'react';

const PASSWORD = "favors123"; // Change this to your desired password
const DANGER_THRESHOLD = 7; // Change this to set when someone becomes a "mooch"

export default function FavorTracker() {
  // Load initial state from localStorage
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('favorBalance');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('favorHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState('');
  const [favorNote, setFavorNote] = useState('');

  // Save to localStorage whenever balance or history changes
  useEffect(() => {
    localStorage.setItem('favorBalance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('favorHistory', JSON.stringify(history));
  }, [history]);

  const isDangerZone = Math.abs(balance) >= DANGER_THRESHOLD;

  const handleUnlock = () => {
    if (passwordInput === PASSWORD) {
      setIsUnlocked(true);
      setShowPasswordModal(false);
      setPasswordInput('');
      setError('');
    } else {
      setError('Wrong password!');
    }
  };

  const addFavor = (amount, person) => {
    const description = favorNote.trim() ? `${person}: ${favorNote.trim()}` : `${person} did a favor`;
    setBalance(prev => prev + amount);
    setHistory(prev => [{
      id: Date.now(),
      amount,
      description,
      timestamp: new Date().toLocaleString()
    }, ...prev]);
    setFavorNote('');
  };

  const getBalanceText = () => {
    if (balance === 0) return "All square! 🤝";
    if (balance >= DANGER_THRESHOLD) return `Ariana owes Ryan ${Math.abs(balance)} favors — Ryan's a mooch!`;
    if (balance <= -DANGER_THRESHOLD) return `Ryan owes Ariana ${Math.abs(balance)} favors — Ariana's a mooch!`;
    if (balance > 0) return `Ariana owes Ryan ${Math.abs(balance)} favor${Math.abs(balance) !== 1 ? 's' : ''}`;
    return `Ryan owes Ariana ${Math.abs(balance)} favor${Math.abs(balance) !== 1 ? 's' : ''}`;
  };

  const getBalanceEmoji = () => {
    if (balance === 0) return "⚖️";
    if (isDangerZone) return "🚨";
    if (Math.abs(balance) >= 5) return "😬";
    if (Math.abs(balance) >= 3) return "🤔";
    return "👍";
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDangerZone ? 'bg-gradient-to-br from-red-900 via-red-800 to-orange-900' : 'bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-700'}`}>
      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Favor Tracker
          </h1>
          <p className="text-white/80 text-lg">Ryan & Ariana</p>
        </div>

        {/* Main Card */}
        <div className={`rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ${isDangerZone ? 'bg-red-950/90 ring-4 ring-red-500 animate-pulse' : 'bg-white/95'}`}>
          
          {/* Danger Zone Banner */}
          {isDangerZone && (
            <div className="bg-red-600 text-white text-center py-3 font-bold text-lg animate-bounce">
              🚨 DANGER ZONE! 🚨
              <p className="text-sm font-normal">Someone needs to pay up!</p>
            </div>
          )}

          {/* Balance Display */}
          <div className="p-8 text-center">
            <div className={`text-7xl font-bold mb-4 ${isDangerZone ? 'text-red-400' : balance > 0 ? 'text-emerald-600' : balance < 0 ? 'text-orange-500' : 'text-gray-600'}`}>
              {balance > 0 ? '+' : ''}{balance}
            </div>
            <div className="text-4xl mb-4">{getBalanceEmoji()}</div>
            <p className={`text-xl font-medium ${isDangerZone ? 'text-white' : 'text-gray-700'}`}>
              {getBalanceText()}
            </p>
            
            {/* Bidirectional Mooch Meter */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-1">
                <span className={`font-medium ${balance <= -DANGER_THRESHOLD ? 'text-red-400' : isDangerZone ? 'text-red-300' : 'text-orange-500'}`}>
                  ← Ariana's a Mooch
                </span>
                <span className={`font-medium ${balance >= DANGER_THRESHOLD ? 'text-red-400' : isDangerZone ? 'text-red-300' : 'text-emerald-500'}`}>
                  Ryan's a Mooch →
                </span>
              </div>
              <div className={`relative h-4 rounded-full overflow-hidden ${isDangerZone ? 'bg-red-900' : 'bg-gray-200'}`}>
                {/* Center marker */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-400 z-10" />
                
                {/* The fill bar */}
                <div 
                  className={`absolute top-0 bottom-0 transition-all duration-500 ${
                    Math.abs(balance) >= DANGER_THRESHOLD ? 'bg-red-500' :
                    Math.abs(balance) >= 5 ? 'bg-orange-500' :
                    Math.abs(balance) >= 3 ? 'bg-yellow-500' : 
                    balance > 0 ? 'bg-emerald-500' : 'bg-orange-400'
                  }`}
                  style={{ 
                    left: balance >= 0 ? '50%' : `${50 - (Math.min(Math.abs(balance), DANGER_THRESHOLD) / DANGER_THRESHOLD) * 50}%`,
                    width: `${(Math.min(Math.abs(balance), DANGER_THRESHOLD) / DANGER_THRESHOLD) * 50}%`
                  }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className={isDangerZone ? 'text-red-300' : 'text-gray-400'}>-{DANGER_THRESHOLD}</span>
                <span className={isDangerZone ? 'text-red-300' : 'text-gray-400'}>0</span>
                <span className={isDangerZone ? 'text-red-300' : 'text-gray-400'}>+{DANGER_THRESHOLD}</span>
              </div>
            </div>
          </div>

          {/* Edit Section */}
          <div className={`p-6 ${isDangerZone ? 'bg-red-900/50' : 'bg-gray-50'}`}>
            {!isUnlocked ? (
              <button
                onClick={() => setShowPasswordModal(true)}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  isDangerZone 
                    ? 'bg-red-600 hover:bg-red-500 text-white' 
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                🔒 Unlock to Edit
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <span className={`font-semibold ${isDangerZone ? 'text-white' : 'text-gray-700'}`}>Edit Mode Active</span>
                  <button
                    onClick={() => setIsUnlocked(false)}
                    className="text-sm px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-700"
                  >
                    🔒 Lock
                  </button>
                </div>

                {/* Favor Note Input */}
                <div className={`p-4 rounded-xl ${isDangerZone ? 'bg-red-800/50' : 'bg-blue-50'}`}>
                  <label className={`block text-sm font-medium mb-2 ${isDangerZone ? 'text-blue-300' : 'text-blue-700'}`}>
                    What was the favor? (optional)
                  </label>
                  <input
                    type="text"
                    value={favorNote}
                    onChange={(e) => setFavorNote(e.target.value)}
                    placeholder="e.g., Picked up coffee, Covered lunch..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none text-gray-800"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl ${isDangerZone ? 'bg-red-800/50' : 'bg-emerald-50'}`}>
                    <p className={`text-sm font-medium mb-3 ${isDangerZone ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      Ryan did a favor
                    </p>
                    <button
                      onClick={() => addFavor(1, "Ryan")}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xl transition-all transform hover:scale-105"
                    >
                      +1 for Ryan
                    </button>
                  </div>
                  
                  <div className={`p-4 rounded-xl ${isDangerZone ? 'bg-red-800/50' : 'bg-orange-50'}`}>
                    <p className={`text-sm font-medium mb-3 ${isDangerZone ? 'text-orange-300' : 'text-orange-700'}`}>
                      Ariana did a favor
                    </p>
                    <button
                      onClick={() => addFavor(-1, "Ariana")}
                      className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold text-xl transition-all transform hover:scale-105"
                    >
                      +1 for Ariana
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setBalance(0);
                    setHistory([{ id: Date.now(), amount: 0, description: "Settled up over a meal 🍽️", timestamp: new Date().toLocaleString() }, ...history]);
                  }}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    isDangerZone 
                      ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  🍽️ Settle Up Over A Meal
                </button>
              </div>
            )}
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className={`p-6 border-t ${isDangerZone ? 'border-red-700 bg-red-900/30' : 'border-gray-200'}`}>
              <h3 className={`font-semibold mb-4 ${isDangerZone ? 'text-white' : 'text-gray-700'}`}>
                Recent Activity
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {history.slice(0, 10).map(item => (
                  <div 
                    key={item.id} 
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      isDangerZone ? 'bg-red-800/50' : 'bg-gray-100'
                    }`}
                  >
                    <div>
                      <p className={`font-medium ${isDangerZone ? 'text-white' : 'text-gray-800'}`}>
                        {item.description}
                      </p>
                      <p className={`text-xs ${isDangerZone ? 'text-red-300' : 'text-gray-500'}`}>
                        {item.timestamp}
                      </p>
                    </div>
                    <span className={`font-bold ${
                      item.amount > 0 ? 'text-emerald-500' : 
                      item.amount < 0 ? 'text-orange-500' : 
                      isDangerZone ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {item.amount === 0 ? '⟳' : item.amount > 0 ? `+${item.amount}` : item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 mt-6 text-sm">
          Official mooch status unlocks at {DANGER_THRESHOLD} favors owed 🍽️
        </p>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Enter Password</h2>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
              placeholder="Password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none text-lg"
              autoFocus
            />
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordInput('');
                  setError('');
                }}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUnlock}
                className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 rounded-xl font-semibold text-white"
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
