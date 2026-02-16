import React from 'react';
import { ContentItem, Platform, ContentType } from '../types';
import { Youtube, FileText, Mic, Video, Edit3, Trash2 } from 'lucide-react';

interface ContentCardProps {
  item: ContentItem;
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
  onMove: (item: ContentItem, direction: 'next' | 'prev') => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, onEdit, onDelete, onMove }) => {
  
  const getIcon = () => {
    switch (item.platform) {
      case Platform.YOUTUBE: return <Youtube size={16} className="text-red-400" />;
      case Platform.SUBSTACK: return <FileText size={16} className="text-orange-400" />;
      default: return <div className="flex gap-1"><Youtube size={14} /><FileText size={14} /></div>;
    }
  };

  const getTypeBadge = () => {
    const classes = "text-xs px-2 py-0.5 rounded-full font-medium ";
    switch (item.type) {
      case ContentType.VIDEO: return <span className={classes + "bg-blue-900 text-blue-200"}>Video</span>;
      case ContentType.ARTICLE: return <span className={classes + "bg-emerald-900 text-emerald-200"}>Article</span>;
      case ContentType.SHORT: return <span className={classes + "bg-purple-900 text-purple-200"}>Short</span>;
      default: return <span className={classes + "bg-gray-700 text-gray-300"}>{item.type}</span>;
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow group relative">
      {item.thumbnailUrl && (
        <div className="mb-3 rounded-md overflow-hidden h-32 w-full">
          <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="text-xs text-slate-400">{item.platform}</span>
        </div>
        {getTypeBadge()}
      </div>

      <h3 className="text-slate-100 font-semibold mb-2 line-clamp-2">{item.title}</h3>
      <p className="text-slate-400 text-xs mb-4 line-clamp-3">{item.topic}</p>

      <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-700">
        <span className="text-xs text-slate-500">{new Date(item.updatedAt).toLocaleDateString()}</span>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(item)}
            className="p-1.5 hover:bg-slate-700 rounded-md text-slate-300 transition-colors"
            title="Edit"
          >
            <Edit3 size={14} />
          </button>
          <button 
            onClick={() => onDelete(item.id)}
            className="p-1.5 hover:bg-red-900/30 rounded-md text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
