import React, { useState, useEffect } from 'react';
import { ContentItem, Platform, ContentType, ContentStatus } from '../types';
import { X, Wand2, Image as ImageIcon, Sparkles, Save, Loader2 } from 'lucide-react';
import { generateDraft, generateThumbnail, suggestIdeas } from '../services/geminiService';

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ContentItem | null;
  onSave: (item: ContentItem) => void;
}

const EditorModal: React.FC<EditorModalProps> = ({ isOpen, onClose, item, onSave }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'ai' | 'preview'>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ContentItem>>({});

  useEffect(() => {
    if (isOpen && item) {
      setFormData({ ...item });
      setActiveTab('details');
    } else if (isOpen && !item) {
      setFormData({
        title: '',
        topic: '',
        status: ContentStatus.IDEA,
        platform: Platform.YOUTUBE,
        type: ContentType.VIDEO,
        researchNotes: '',
        draftContent: '',
        thumbnailUrl: '',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      setActiveTab('details');
    }
    setError(null);
  }, [isOpen, item]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.title) {
        setError("Title is required");
        return;
    }
    onSave({
      ...formData as ContentItem,
      id: formData.id || crypto.randomUUID(),
      updatedAt: Date.now()
    });
    onClose();
  };

  const handleGenerateDraft = async () => {
    setLoading(true);
    setError(null);
    try {
      const draft = await generateDraft(
        formData.topic || formData.title || "Generic Topic",
        formData.type || ContentType.ARTICLE,
        formData.platform || Platform.SUBSTACK,
        formData.researchNotes || ""
      );
      setFormData(prev => ({ ...prev, draftContent: draft }));
    } catch (e) {
      setError("Failed to generate draft. Check API Key.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = await generateThumbnail(
        formData.topic || formData.title || "Generic Content",
        formData.platform || Platform.YOUTUBE
      );
      setFormData(prev => ({ ...prev, thumbnailUrl: url }));
    } catch (e) {
      setError("Failed to generate thumbnail.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeNotes = async () => {
    if (!formData.researchNotes) {
        setError("Please add notes first.");
        return;
    }
    setLoading(true);
    try {
        const ideas = await suggestIdeas(formData.researchNotes);
        setFormData(prev => ({ ...prev, draftContent: (prev.draftContent ? prev.draftContent + "\n\n---\n\n" : "") + "### AI Ideas Analysis\n" + ideas}));
    } catch (e) {
        setError("Failed to analyze notes.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-950">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {item ? 'Edit Content' : 'New Content'}
            {loading && <Loader2 className="animate-spin text-blue-500" size={18} />}
          </h2>
          <div className="flex items-center gap-3">
             {error && <span className="text-red-400 text-sm">{error}</span>}
             <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 bg-slate-900">
          <button 
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'details' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Details & Research
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'ai' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Gemini Studio
          </button>
          <button 
             onClick={() => setActiveTab('preview')}
             className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'preview' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
           >
             Assets
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-900">
          
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="E.g., The Future of AI..."
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-400 mb-1">Topic / Core Idea</label>
                   <input 
                    type="text" 
                    value={formData.topic} 
                    onChange={e => setFormData({...formData, topic: e.target.value})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="E.g., Generative Models in 2025"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Platform</label>
                  <select 
                    value={formData.platform} 
                    onChange={e => setFormData({...formData, platform: e.target.value as Platform})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 outline-none"
                  >
                    {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value as ContentType})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 outline-none"
                  >
                    {Object.values(ContentType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value as ContentStatus})}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 outline-none"
                  >
                    {Object.values(ContentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                   <label className="block text-sm font-medium text-slate-400">Research Notes (NotebookLM)</label>
                   <button 
                     onClick={handleAnalyzeNotes}
                     disabled={loading || !formData.researchNotes}
                     className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 disabled:opacity-50"
                   >
                     <Sparkles size={12} /> Analyze with Gemini
                   </button>
                </div>
                <textarea 
                  value={formData.researchNotes} 
                  onChange={e => setFormData({...formData, researchNotes: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-300 h-40 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  placeholder="Paste your NotebookLM summary or raw notes here..."
                />
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <p className="text-slate-400 text-sm">
                  Use Gemini to draft your script or article based on the research notes and topic.
                </p>
                <button 
                  onClick={handleGenerateDraft}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wand2 size={16} />
                  {formData.draftContent ? 'Regenerate Draft' : 'Generate Draft'}
                </button>
              </div>
              
              <textarea 
                value={formData.draftContent}
                onChange={e => setFormData({...formData, draftContent: e.target.value})}
                className="flex-1 w-full bg-slate-800 border border-slate-700 rounded-lg p-4 text-slate-100 outline-none font-mono text-sm leading-relaxed resize-none focus:ring-2 focus:ring-purple-900"
                placeholder="AI generated draft will appear here..."
              />
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-6">
               <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <ImageIcon size={20} className="text-emerald-400"/>
                      Thumbnail Generation
                    </h3>
                    <button 
                      onClick={handleGenerateThumbnail}
                      disabled={loading}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                      <Sparkles size={16} />
                      Generate Thumbnail
                    </button>
                  </div>

                  <div className="aspect-video w-full bg-slate-950 rounded-lg border-2 border-dashed border-slate-700 flex items-center justify-center relative overflow-hidden group">
                    {formData.thumbnailUrl ? (
                      <>
                        <img src={formData.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <a href={formData.thumbnailUrl} download="thumbnail.png" className="text-white underline">Download</a>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-8">
                        <ImageIcon size={48} className="mx-auto text-slate-700 mb-2" />
                        <p className="text-slate-500">No thumbnail yet. Generate one with Gemini.</p>
                      </div>
                    )}
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-950 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
          >
            <Save size={18} />
            Save Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorModal;
