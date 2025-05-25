'use client';

import { GlassmorphismLayout } from '@/components/layout/glassmorphism-layout';
import { ProjectDashboard } from '@/components/project-management/project-dashboard';

export default function DiaryPage() {
  return (
    <GlassmorphismLayout>
      <ProjectDashboard />
    </GlassmorphismLayout>
  );
}
