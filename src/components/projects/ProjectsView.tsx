import React, { useState } from 'react';
import { FolderKanban, Plus, Search, Copy, Trash2, Film, Play, Sparkles } from 'lucide-react';
import { Project } from '../../types/index.js';
import { api } from '../../services/api.js';

interface ProjectsViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNewProject: () => void;
  onRefreshProjects: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onSelectProject,
  onNewProject,
  onRefreshProjects,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.prompt.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDuplicate = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.duplicateProject(id);
      onRefreshProjects();
    } catch (err) {
      console.error('Duplicate failed:', err);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.deleteProject(id);
      onRefreshProjects();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2F40] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00F0FF]">
            <FolderKanban className="w-4 h-4 text-[#00F0FF]" />
            <span>PROJECT MANAGEMENT</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Creator Projects ({projects.length})</h1>
        </div>

        <button
          onClick={onNewProject}
          className="flex items-center gap-2 px-4 py-2 bg-[#00F0FF] hover:bg-[#33F3FF] text-black font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search & Filter Toolbar (Zero-Pill discipline) */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 bg-[#12141A] border border-[#2A2F40] px-3 py-2 rounded-xl w-full sm:w-80">
          <Search className="w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="bg-transparent text-xs text-white outline-none flex-1"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#12141A] border border-[#2A2F40] rounded-lg w-full sm:w-auto overflow-x-auto">
          {['ALL', 'READY', 'DRAFT', 'STORYBOARD'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterStatus === st
                  ? 'bg-[#1A1D26] text-white shadow-xs'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(project => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="bg-[#12141A] hover:bg-[#161822] border border-[#2A2F40] hover:border-[#00F0FF]/50 rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="flex gap-3">
              <div className="w-16 h-24 bg-[#1A1D26] rounded-lg overflow-hidden shrink-0 border border-[#2A2F40] relative">
                <img
                  src={project.thumbnailUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1080&q=80'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[10px] text-[#00F0FF] font-mono uppercase tracking-wider">
                  {project.status}
                </span>
                <h3 className="text-sm font-semibold text-white group-hover:text-[#00F0FF] transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-xs text-[#94A3B8] line-clamp-2">
                  {project.prompt}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-[#1E2330]">
              <span>{project.scenes.length} Scenes · {project.targetDuration}s</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={e => handleDuplicate(e, project.id)}
                  className="p-1 hover:text-white"
                  title="Duplicate project"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={e => handleDelete(e, project.id)}
                  className="p-1 hover:text-red-400"
                  title="Delete project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
