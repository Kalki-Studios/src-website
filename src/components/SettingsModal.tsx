"use client";

import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { getSettings, updatePassword, toggleUnderConstruction } from "../app/x9/settings-actions";
import { X, Save, ShieldAlert, CheckCircle2, Lock } from "lucide-react";

export function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnderConstruction, setIsUnderConstruction] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Load initial settings
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getSettings().then((s) => {
        setIsUnderConstruction(s.isUnderConstruction);
        setLoading(false);
      });
    }
  }, [isOpen]);

  const handleSave = async () => {
    setMessage("");
    try {
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setMessage("Passwords do not match.");
          return;
        }
        await updatePassword(newPassword);
      }
      
      await toggleUnderConstruction(isUnderConstruction);
      
      setMessage("Settings saved successfully.");
      setNewPassword("");
      setConfirmPassword("");
      
      // Close after 2 seconds
      setTimeout(() => setIsOpen(false), 2000);
    } catch (e) {
      setMessage("Failed to save settings.");
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-1.5 mr-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
        title="Admin Settings"
      >
        <Settings size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-[var(--ink)] flex items-center gap-2">
                <Settings size={20} className="text-[var(--mute)]" />
                Global Settings
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <>
                  {/* Under Construction Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <h3 className="font-semibold text-[var(--ink)] flex items-center gap-1.5">
                        <ShieldAlert size={16} className="text-orange-500" />
                        Under Construction Mode
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Block all public access and show a 404 page.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isUnderConstruction}
                        onChange={(e) => setIsUnderConstruction(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>

                  {/* Change Password */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[var(--ink)] flex items-center gap-1.5 border-b pb-2">
                      <Lock size={16} className="text-[var(--mute)]" />
                      Change Admin Password
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Leave blank to keep current"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--rule)] outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--rule)] outline-none"
                      />
                    </div>
                  </div>

                  {message && (
                    <div className={`p-3 rounded-md text-sm flex items-center gap-2 ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {message.includes('success') ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                      {message}
                    </div>
                  )}

                  <div className="pt-4 border-t flex justify-end gap-3">
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1.5"
                    >
                      <Save size={16} />
                      Save Settings
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
