import React, { useState } from 'react';
import { PROJECTS } from '../data/projects';
import type { Project } from '../data/projects';
import { ProjectModal } from './ProjectModal';
import { cursorEngine } from '../core/cursor-engine';
import { audioSynthesizer } from '../core/audio-synthesizer';
import { ArrowUpRight } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  const handleSelect = (project: Project) => {
    setSelectedProject(project);
    cursorEngine.resetState();
  };

  return (
    <section
      id="projects"
      className="relative min-h-screen w-full bg-[#060709] px-6 md:px-16 py-32 select-none"
    >
      {/* Section Eyebrow */}
      <div className="flex items-center justify-between border-b border-[#242834] pb-6 mb-16">
        <div className="flex items-center gap-3 font-mono-tech text-xs tracking-widest text-[#FF3B00] uppercase">
          <span>04</span>
          <span>//</span>
          <span>EDITORIAL PROJECT ARCHIVE</span>
        </div>
        <span className="font-mono-tech text-xs text-[#8E929A]">05 EDITIONS (2024 — 2026)</span>
      </div>

      {/* Floating Hover Background Preview (Appears softly in background when hovered) */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 ${
          hoveredProject ? 'opacity-20' : 'opacity-0'
        }`}
      >
        {hoveredProject && (
          <img
            src={hoveredProject.image}
            alt=""
            className="w-full h-full object-cover filter grayscale contrast-150 scale-105 transition-transform duration-1000"
          />
        )}
      </div>

      {/* Enormous Editorial Compositions List */}
      <div className="relative z-10 space-y-24">
        {PROJECTS.map((project) => {
          const isHovered = hoveredProject?.id === project.id;
          return (
            <div
              key={project.id}
              onClick={() => handleSelect(project)}
              onMouseEnter={() => {
                setHoveredProject(project);
                cursorEngine.setState('hover', 'ENTER');
                audioSynthesizer.playMechanicalTick(1.2);
              }}
              onMouseLeave={() => {
                setHoveredProject(null);
                cursorEngine.resetState();
              }}
              className="group relative border-b border-[#242834]/80 pb-16 cursor-pointer transition-all duration-500"
            >
              {/* Top Row: Number, Discipline, Year */}
              <div className="flex items-center justify-between font-mono-tech text-xs text-[#8E929A] uppercase tracking-widest mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-[#FF3B00] font-bold group-hover:translate-x-2 transition-transform duration-300">
                    {project.number}
                  </span>
                  <span>{project.discipline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{project.year}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#8E929A] group-hover:text-[#FF3B00] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </div>
              </div>

              {/* Main Enormous Title with Kinetic Stretching on Hover */}
              <div className="overflow-hidden py-2">
                <h3
                  className={`font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#EDE8DE] tracking-tighter uppercase transition-all duration-500 ${
                    isHovered
                      ? 'tracking-wide text-[#FF3B00] scale-y-105'
                      : 'group-hover:text-[#EDE8DE]'
                  }`}
                  style={{ willChange: 'transform, letter-spacing' }}
                >
                  {project.title}
                </h3>
              </div>

              {/* Editorial Description & Subtitle */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                <p className="md:col-span-2 font-sans-body text-sm md:text-base text-[#8E929A] group-hover:text-[#EDE8DE]/90 transition-colors max-w-2xl leading-relaxed">
                  {project.description}
                </p>

                {/* Inline Hover Visual Thumbnail Expand */}
                <div className="relative h-28 md:h-36 rounded-lg overflow-hidden border border-[#242834] group-hover:border-[#FF3B00] transition-colors">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover filter grayscale contrast-125 group-hover:filter-none group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-[#060709]/30 group-hover:opacity-0 transition-opacity" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Spatial Project Expansion Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
