import React, { useState } from 'react';
import {
  Layers,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { XRayNode } from '../types';

interface LegalXRayViewProps {
  nodes: XRayNode[];
  onSelectNode: (node: XRayNode) => void;
}

export const LegalXRayView: React.FC<LegalXRayViewProps> = ({ nodes, onSelectNode }) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'node-1': true,
    'node-2': true,
    'node-3': true,
    'node-4': true,
    'node-5': true,
  });

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusBadge = (status: 'normal' | 'attention' | 'critical') => {
    switch (status) {
      case 'critical':
        return {
          icon: AlertTriangle,
          border: 'border-rose-300 bg-rose-50/50 text-[#141413]',
          dot: 'bg-rose-600',
          label: 'Critical Review',
        };
      case 'attention':
        return {
          icon: AlertCircle,
          border: 'border-amber-300 bg-amber-50/50 text-[#141413]',
          dot: 'bg-amber-600',
          label: 'Needs Attention',
        };
      default:
        return {
          icon: CheckCircle2,
          border: 'border-[#E2E2DE] bg-white text-[#141413]',
          dot: 'bg-emerald-600',
          label: 'Standard Clause',
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 rounded-lg bg-white border border-[#E2E2DE] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-[#F8F8F5] text-[#141413] border border-[#E2E2DE] shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#141413]">
                Contract Structure Map
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#F8F8F5] text-[#6B6A66] border border-[#E2E2DE]">
                X-Ray
              </span>
            </div>
            <p className="text-xs text-[#6B6A66] mt-0.5">
              Architectural map of sections, dependencies, and risk status. Click any section to jump directly to it.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-[#141413]">
            <span className="w-2 h-2 rounded-full bg-rose-600" /> High Attention
          </span>
          <span className="flex items-center gap-1.5 text-[#141413]">
            <span className="w-2 h-2 rounded-full bg-amber-600" /> Watch Out
          </span>
          <span className="flex items-center gap-1.5 text-[#141413]">
            <span className="w-2 h-2 rounded-full bg-emerald-600" /> Standard
          </span>
        </div>
      </div>

      {/* Interactive Tree View */}
      <div className="bg-white border border-[#E2E2DE] rounded-lg p-5 space-y-3 font-sans shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#6B6A66] hairline-b pb-2">
          <span>Document Sections</span>
        </div>

        <div className="space-y-2.5 pl-1">
          {nodes.map((node) => {
            const isExpanded = expandedNodes[node.id] ?? true;
            const badge = getStatusBadge(node.status);
            const hasChildren = node.children && node.children.length > 0;

            return (
              <div key={node.id} className="relative group/node">
                {/* Branch Line */}
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => toggleNode(node.id)}
                    className="p-1 rounded text-[#6B6A66] hover:text-[#141413] mt-1 cursor-pointer"
                  >
                    {hasChildren ? (
                      isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )
                    ) : (
                      <span className="w-3.5 inline-block" />
                    )}
                  </button>

                  <div
                    onClick={() => onSelectNode(node)}
                    className={`flex-1 p-3.5 rounded border transition-colors cursor-pointer ${badge.border} hover:border-[#141413]`}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        <span className="font-semibold text-xs text-[#141413]">
                          {node.title}
                        </span>
                        <span className="text-[10px] font-mono text-[#6B6A66] bg-[#F8F8F5] px-1.5 py-0.5 rounded border border-[#E2E2DE]">
                          {node.sectionRef}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-mono">
                        <span className="text-[#6B6A66]">{badge.label}</span>
                        <ExternalLink className="w-3 h-3 text-[#A3A29E] group-hover/node:text-[#141413] transition-colors" />
                      </div>
                    </div>

                    <p className="text-xs text-[#4A4946] leading-relaxed">
                      {node.summary}
                    </p>
                  </div>
                </div>

                {/* Sub-children */}
                {hasChildren && isExpanded && (
                  <div className="pl-7 pt-2 space-y-2 border-l border-[#E2E2DE] ml-3.5 my-1">
                    {node.children!.map((child) => {
                      const childBadge = getStatusBadge(child.status);
                      return (
                        <div
                          key={child.id}
                          onClick={() => onSelectNode(child)}
                          className={`p-2.5 rounded border text-xs transition-colors cursor-pointer ${childBadge.border} hover:border-[#141413] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${childBadge.dot}`} />
                            <span className="font-medium text-[#141413]">
                              {child.title}
                            </span>
                            <span className="text-[10px] font-mono text-[#6B6A66]">
                              ({child.sectionRef})
                            </span>
                          </div>
                          <span className="text-[11px] text-[#6B6A66] truncate max-w-[320px]">
                            {child.summary}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
