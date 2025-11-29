import React, { useState } from 'react';
import { X, Key, Palette, Sliders, Eye, EyeOff, Save, Check, CircuitBoard } from 'lucide-react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

export const SettingsModal = () => {
  const { isSettingsOpen, toggleSettings, settings, updateSettings } = useStore();
  const [activeTab, setActiveTab] = useState<'general' | 'api' | 'theme'>('api');
  const [tempSettings, setTempSettings] = useState(settings);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    updateSettings(tempSettings);
    toggleSettings();
  };

  const toggleKeyVisibility = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Sliders },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'theme', label: 'Theme', icon: Palette },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={toggleSettings}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-card w-full max-w-lg rounded-xl border border-border shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
        >
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">Settings</h2>
              <p className="text-sm text-muted-foreground">Manage your preferences and keys.</p>
            </div>
            <button 
              onClick={toggleSettings}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-md"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Tabs (Desktop) / Top Tabs (Mobile) */}
            <div className="w-full flex flex-col">
              <div className="flex px-6 border-b border-border">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`
                        flex items-center gap-2 py-3 px-4 text-sm font-medium transition-all border-b-2
                        ${isActive 
                          ? 'border-primary text-primary' 
                          : 'border-transparent text-muted-foreground hover:text-foreground'}
                      `}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              <div className="p-6 flex-1 overflow-y-auto min-h-[300px]">
                
                {activeTab === 'api' && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">OpenAI API Key</label>
                      <div className="relative">
                        <input 
                          type={showKeys['openai'] ? 'text' : 'password'}
                          value={tempSettings.openaiKey}
                          onChange={(e) => setTempSettings({...tempSettings, openaiKey: e.target.value})}
                          placeholder="sk-..."
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10"
                        />
                        <button 
                          onClick={() => toggleKeyVisibility('openai')}
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                        >
                          {showKeys['openai'] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <p className="text-[0.8rem] text-muted-foreground">Required for workflow generation logic.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Perplexity API Key</label>
                      <div className="relative">
                        <input 
                          type={showKeys['perplexity'] ? 'text' : 'password'}
                          value={tempSettings.perplexityKey}
                          onChange={(e) => setTempSettings({...tempSettings, perplexityKey: e.target.value})}
                          placeholder="pplx-..."
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                    </div>

                     <div className="space-y-2">
                      <label className="text-sm font-medium">Cardano RPC URL</label>
                      <input 
                        type="text"
                        value={tempSettings.cardanoRpcUrl}
                        onChange={(e) => setTempSettings({...tempSettings, cardanoRpcUrl: e.target.value})}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'general' && (
                  <div className="flex flex-col items-center justify-center h-full py-10 text-center space-y-4 text-muted-foreground">
                     <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                        <CircuitBoard size={32} />
                     </div>
                     <div>
                       <h3 className="text-foreground font-medium">System Configuration</h3>
                       <p className="text-sm mt-1 max-w-xs mx-auto">Version 1.0.0. No additional general settings available yet.</p>
                     </div>
                  </div>
                )}

                 {activeTab === 'theme' && (
                  <div className="space-y-6">
                      <div>
                          <h3 className="text-sm font-medium mb-3">Appearance</h3>
                          <div className="grid grid-cols-2 gap-3">
                              <div className="relative p-1 rounded-xl border-2 border-primary bg-background cursor-pointer">
                                  <div className="space-y-2 rounded-lg bg-muted p-2">
                                      <div className="space-y-2 rounded-md bg-background p-2 shadow-sm">
                                        <div className="h-2 w-[80px] rounded-lg bg-muted-foreground/20" />
                                        <div className="h-2 w-[100px] rounded-lg bg-muted-foreground/20" />
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-2">
                                      <div className="h-4 w-4 rounded-full bg-primary" />
                                      <span className="text-xs font-medium">Dark Mode</span>
                                  </div>
                                  <div className="absolute top-2 right-2 bg-primary rounded-full p-0.5">
                                      <Check size={10} className="text-primary-foreground" />
                                  </div>
                              </div>
                              <div className="relative p-1 rounded-xl border border-border bg-background opacity-50 cursor-not-allowed">
                                  <div className="space-y-2 rounded-lg bg-[#f0f0f0] p-2">
                                      <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                                        <div className="h-2 w-[80px] rounded-lg bg-gray-200" />
                                        <div className="h-2 w-[100px] rounded-lg bg-gray-200" />
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-2">
                                      <div className="h-4 w-4 rounded-full bg-gray-400" />
                                      <span className="text-xs font-medium text-muted-foreground">Light Mode</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t border-border flex justify-end gap-3 bg-muted/20">
            <button 
              onClick={toggleSettings}
              className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};