"use client";

import { Scene } from "@/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";

interface TodoPanelProps {
  scenes: Scene[];
  currentSceneIndex: number;
  onSceneClick?: (index: number) => void;
}

export function TodoPanel({ scenes, currentSceneIndex, onSceneClick }: TodoPanelProps) {
  if (scenes.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-sm font-medium text-muted-foreground">学习计划</h2>
          <span className="text-xs text-muted-foreground">
            ({scenes.filter(s => s.completed).length}/{scenes.length} 已完成)
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {scenes.map((scene, index) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              isActive={index === currentSceneIndex}
              onClick={() => onSceneClick?.(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface SceneCardProps {
  scene: Scene;
  isActive: boolean;
  onClick?: () => void;
}

function SceneCard({ scene, isActive, onClick }: SceneCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all",
        "border hover:border-primary/50",
        isActive
          ? "bg-primary/10 border-primary text-primary"
          : scene.completed
          ? "bg-accent/10 border-accent/30 text-accent"
          : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
      )}
    >
      {scene.completed ? (
        <CheckCircle2 className="w-4 h-4 text-accent" />
      ) : isActive ? (
        <PlayCircle className="w-4 h-4 text-primary" />
      ) : (
        <Circle className="w-4 h-4" />
      )}
      <span className="font-medium">{scene.name}</span>
      {scene.roundCount > 0 && !scene.completed && (
        <span className="text-xs opacity-70">({scene.roundCount}/5)</span>
      )}
    </button>
  );
}

