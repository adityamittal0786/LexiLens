import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Printer,
  Copy,
  Check,
  Filter,
  Edit2,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ActionChecklistItem, DocumentAnalysis } from '../types';
import { realtimeSync } from '../services/realtimeSync';

interface ActionCenterProps {
  analysis: DocumentAnalysis;
  onUpdateChecklist?: (items: ActionChecklistItem[]) => void;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({ analysis }) => {
  const [items, setItems] = useState<ActionChecklistItem[]>(analysis.actionChecklist);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Custom');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [copied, setCopied] = useState(false);

  // Real-time synchronization for checklist state across tabs/sessions
  useEffect(() => {
    return realtimeSync.subscribe((event) => {
      if (event.type === 'CHECKLIST_TOGGLED' && event.payload) {
        const { id, completed } = event.payload;
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === id ? { ...item, completed } : item))
        );
      } else if (event.type === 'INIT_SYNC' && event.state?.checklistUpdates) {
        const updates = event.state.checklistUpdates;
        setItems((prevItems) =>
          prevItems.map((item) =>
            typeof updates[item.id] === 'boolean'
              ? { ...item, completed: updates[item.id] }
              : item
          )
        );
      }
    });
  }, []);

  const toggleComplete = (id: string) => {
    let nextCompleted = false;
    const updated = items.map((item) => {
      if (item.id === id) {
        nextCompleted = !item.completed;
        if (nextCompleted) {
          try {
            confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
          } catch {}
        }
        return { ...item, completed: nextCompleted };
      }
      return item;
    });
    setItems(updated);
    realtimeSync.broadcast('CHECKLIST_TOGGLED', { id, completed: nextCompleted });
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem: ActionChecklistItem = {
      id: 'act-custom-' + Date.now(),
      title: newItemTitle.trim(),
      description: 'Custom action item added by user.',
      sectionRef: 'User Note',
      completed: false,
      priority: 'Medium',
      category: newItemCategory,
    };

    setItems([newItem, ...items]);
    setNewItemTitle('');
  };

  const handleSaveNote = (id: string) => {
    setItems(items.map((it) => (it.id === id ? { ...it, userNotes: noteDraft } : it)));
    setEditingNotesId(null);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((it) => it.id !== id));
  };

  const handleCopyChecklist = () => {
    const text = items
      .map((it) => `[${it.completed ? 'X' : ' '}] ${it.title} (Ref: ${it.sectionRef})\n   ${it.description}${it.userNotes ? `\n   Note: ${it.userNotes}` : ''}`)
      .join('\n\n');

    navigator.clipboard.writeText(`LEXILENS ACTION CHECKLIST\nDocument: ${analysis.documentTitle}\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredItems =
    filterPriority === 'all'
      ? items
      : items.filter((it) => it.priority.toLowerCase() === filterPriority.toLowerCase());

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Action Header Card */}
      <div className="p-6 rounded-lg bg-white border border-[#E2E2DE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#6B6A66] font-semibold block mb-1">
            Pre-Execution Actions
          </span>
          <h2 className="text-xl sm:text-2xl font-serif text-[#141413]">
            Negotiation Checklist
          </h2>
          <p className="text-xs text-[#6B6A66] mt-1 max-w-xl leading-relaxed">
            Concrete items to clarify, verify, or negotiate before signing {analysis.documentTitle}.
          </p>
        </div>

        {/* Export and Print Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyChecklist}
            className="px-3 py-1.5 rounded bg-white hover:bg-[#F8F8F5] text-[#141413] border border-[#E2E2DE] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5 text-[#6B6A66]" />}
            <span>Copy Text</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded bg-[#141413] hover:bg-[#2C2C2A] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Checklist</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Filter Row */}
      <div className="p-4 rounded-lg bg-white border border-[#E2E2DE] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        {/* Progress Bar */}
        <div className="flex-1 max-w-md space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6B6A66] font-mono">Completion</span>
            <span className="text-[#141413] font-mono font-medium">
              {completedCount} of {totalCount} completed ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#F2F2EE] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#141413] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1 text-xs font-mono">
          <span className="text-[#6B6A66] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Priority:
          </span>
          {['all', 'high', 'medium', 'low'].map((p) => {
            const isActive = filterPriority === p;
            return (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2.5 py-1 rounded capitalize transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#141413] text-white font-medium'
                    : 'bg-white border border-[#E2E2DE] text-[#4A4946] hover:text-[#141413]'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Add Custom Item Form */}
      <form onSubmit={handleAddNewItem} className="flex gap-2">
        <input
          type="text"
          placeholder="Add custom task or negotiation point..."
          value={newItemTitle}
          onChange={(e) => setNewItemTitle(e.target.value)}
          className="flex-1 px-3 py-2 bg-white border border-[#E2E2DE] rounded text-xs text-[#141413] placeholder:text-[#A3A29E] focus:outline-none focus:border-[#141413]"
        />
        <select
          value={newItemCategory}
          onChange={(e) => setNewItemCategory(e.target.value)}
          className="px-3 py-2 bg-white border border-[#E2E2DE] rounded text-xs text-[#141413] focus:outline-none focus:border-[#141413] cursor-pointer"
        >
          <option value="Custom">Custom</option>
          <option value="Payment">Payment</option>
          <option value="IP">Intellectual Property</option>
          <option value="Termination">Termination</option>
          <option value="Liability">Liability</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-[#141413] hover:bg-[#2C2C2A] text-white font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </form>

      {/* Checklist Items Container */}
      <div className="space-y-2.5">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className={`p-4 rounded-lg border transition-colors shadow-xs ${
                item.completed
                  ? 'bg-[#F8F8F5] border-[#E2E2DE] opacity-75'
                  : 'bg-white border-[#E2E2DE] hover:border-[#141413]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {/* Custom Checkbox */}
                  <button
                    onClick={() => toggleComplete(item.id)}
                    className="mt-0.5 text-[#6B6A66] hover:text-[#141413] cursor-pointer shrink-0"
                  >
                    {item.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-800" />
                    ) : (
                      <Square className="w-4 h-4 text-[#C4C4BE] hover:text-[#141413]" />
                    )}
                  </button>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-xs font-semibold ${
                          item.completed ? 'line-through text-[#A3A29E]' : 'text-[#141413]'
                        }`}
                      >
                        {item.title}
                      </h4>

                      {/* Priority badge */}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                          item.priority === 'High'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : item.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-[#F8F8F5] text-[#6B6A66] border-[#E2E2DE]'
                        }`}
                      >
                        {item.priority} Priority
                      </span>

                      <span className="text-[10px] font-mono text-[#6B6A66] bg-[#F8F8F5] px-1.5 py-0.5 rounded border border-[#E2E2DE]">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-[#4A4946] leading-relaxed">
                      {item.description}
                    </p>

                    <div className="text-[11px] font-mono text-[#6B6A66] pt-0.5">
                      <span>Source: <strong className="text-[#141413] font-semibold">{item.sectionRef}</strong></span>
                    </div>

                    {/* Notes display */}
                    {item.userNotes && editingNotesId !== item.id && (
                      <div className="mt-2 p-2.5 rounded bg-[#FAF9F6] border border-[#E8E8E4] text-xs text-[#2C2C2A] flex items-start justify-between gap-2">
                        <p><strong className="text-[#141413] font-semibold">Your Note:</strong> {item.userNotes}</p>
                        <button
                          onClick={() => {
                            setEditingNotesId(item.id);
                            setNoteDraft(item.userNotes || '');
                          }}
                          className="text-[#6B6A66] hover:text-[#141413] text-xs cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Notes inline editor */}
                    {editingNotesId === item.id && (
                      <div className="mt-2 space-y-2">
                        <textarea
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          placeholder="Add negotiation notes or counsel feedback..."
                          className="w-full p-2.5 bg-white border border-[#E2E2DE] rounded text-xs text-[#141413] focus:outline-none focus:border-[#141413]"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveNote(item.id)}
                            className="px-3 py-1 rounded bg-[#141413] hover:bg-[#2C2C2A] text-white text-xs font-medium cursor-pointer"
                          >
                            Save Note
                          </button>
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="px-3 py-1 rounded bg-white border border-[#E2E2DE] text-[#4A4946] hover:bg-[#F8F8F5] text-xs font-medium cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 text-[#A3A29E] shrink-0">
                  {!item.userNotes && editingNotesId !== item.id && (
                    <button
                      onClick={() => {
                        setEditingNotesId(item.id);
                        setNoteDraft('');
                      }}
                      className="p-1 rounded hover:text-[#141413] hover:bg-[#F8F8F5] transition-colors text-xs flex items-center gap-1 cursor-pointer"
                      title="Add note"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-xs text-[#6B6A66] font-mono">Note</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 rounded hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
