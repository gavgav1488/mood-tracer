'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'active' | 'completed' | 'on-hold';
  dueDate: string;
  team: number;
  priority: 'low' | 'medium' | 'high';
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design',
    progress: 75,
    status: 'active',
    dueDate: '2024-02-15',
    team: 5,
    priority: 'high'
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native iOS and Android app for customer engagement',
    progress: 45,
    status: 'active',
    dueDate: '2024-03-20',
    team: 8,
    priority: 'high'
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    description: 'Q1 digital marketing campaign across all channels',
    progress: 90,
    status: 'active',
    dueDate: '2024-01-30',
    team: 3,
    priority: 'medium'
  },
  {
    id: '4',
    name: 'Database Migration',
    description: 'Migrate legacy database to cloud infrastructure',
    progress: 100,
    status: 'completed',
    dueDate: '2024-01-15',
    team: 4,
    priority: 'high'
  }
];

export function ProjectDashboard() {
  const [projects] = useState<Project[]>(mockProjects);

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-accent" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'on-hold':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-accent';
      case 'low':
        return 'text-green-400';
    }
  };

  const activeProjects = projects.filter(p => p.status === 'active');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const totalProgress = projects.reduce((acc, p) => acc + p.progress, 0) / projects.length;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="heading-primary text-4xl md:text-5xl font-bold">
          mood-tracer
        </h1>
        <p className="body-text text-lg md:text-xl max-w-2xl mx-auto">
          Vibrant Creative Project Management Platform
        </p>
        <div className="flex justify-center">
          <Button className="glass-button px-8 py-3 rounded-full text-white font-semibold">
            <Plus className="w-5 h-5 mr-2" />
            Создать проект
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="heading-secondary text-2xl font-bold">{projects.length}</h3>
          <p className="body-text text-sm">Всего проектов</p>
        </div>

        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-secondary">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="heading-secondary text-2xl font-bold">{activeProjects.length}</h3>
          <p className="body-text text-sm">Активных</p>
        </div>

        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-primary">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="heading-secondary text-2xl font-bold">{completedProjects.length}</h3>
          <p className="body-text text-sm">Завершенных</p>
        </div>

        <div className="glass-card rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-secondary to-accent">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="heading-secondary text-2xl font-bold">{Math.round(totalProgress)}%</h3>
          <p className="body-text text-sm">Общий прогресс</p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="heading-secondary text-2xl font-bold">Проекты</h2>
          <Button variant="outline" className="glass-button rounded-full">
            <BarChart3 className="w-4 h-4 mr-2" />
            Аналитика
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="heading-secondary text-lg font-semibold">{project.name}</h3>
                  <p className="body-text text-sm">{project.description}</p>
                </div>
                {getStatusIcon(project.status)}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="body-text text-sm">Прогресс</span>
                  <span className="heading-secondary text-sm font-semibold">{project.progress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span className="body-text">{project.dueDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-secondary" />
                  <span className="body-text">{project.team}</span>
                </div>
                <span className={`font-semibold ${getPriorityColor(project.priority)}`}>
                  {project.priority.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
