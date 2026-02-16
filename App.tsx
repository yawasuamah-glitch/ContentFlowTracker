import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ContentCard from './components/ContentCard';
import EditorModal from './components/EditorModal';
import { ContentItem, ContentStatus } from './types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; 

// Note: To keep this single-file/simple compatible without extra heavy deps if possible, 
// I will implement a visual Kanban without dnd library complexity first, 
// or imply column mapping. The prompt allows popular libraries, but raw React is often cleaner for generated code 
// unless DnD is critical. Let's use column-based rendering.

const App: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  // Load initial data
  useEffect(() => {
    const saved = localStorage.getItem('creatorflow-items');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem('creatorflow-items', JSON.stringify(items));
  }, [items]);

  const handleSave = (item: ContentItem) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.map(i => i.id === item.id ? item : i);
      }
      return [...prev, item];
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure?")) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleMove = (item: ContentItem, direction: 'next' | 'prev') => {
    // Simple status rotation logic could go here if we had buttons on the card
  };

  const columns = Object.values(ContentStatus);

  return (
    <Layout onNew={handleNew}>
      <div className="h-full flex flex-col p-6">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Content Pipeline</h1>
          <p className="text-slate-400">Manage your Substack & YouTube production workflow.</p>
        </header>

        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
          <div className="flex gap-6 h-full min-w-[1200px]">
            {columns.map(status => {
              const columnItems = items.filter(i => i.status === status);
              
              return (
                <div key={status} className="w-72 flex flex-col bg-slate-900/50 rounded-xl border border-slate-800/50">
                  {/* Column Header */}
                  <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-200">{status}</h3>
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-full">
                      {columnItems.length}
                    </span>
                  </div>

                  {/* Column Body */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                    {columnItems.length === 0 && (
                      <div className="text-center p-4 border-2 border-dashed border-slate-800 rounded-lg opacity-50">
                        <span className="text-sm text-slate-600">No content</span>
                      </div>
                    )}
                    {columnItems.map(item => (
                      <ContentCard 
                        key={item.id} 
                        item={item} 
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onMove={handleMove}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <EditorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={editingItem}
        onSave={handleSave}
      />
    </Layout>
  );
};

export default App;
