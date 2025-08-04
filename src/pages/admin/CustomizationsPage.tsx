import React from 'react';
import { CustomizationManager } from '../../components/admin/CustomizationManager';

export const CustomizationsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <CustomizationManager />
      </div>
    </div>
  );
}; 