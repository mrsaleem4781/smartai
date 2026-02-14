
import React from 'react';
import { Camera, Image as ImageIcon, Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Zap className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none">Smart Passport AI</h1>
            <p className="text-xs text-gray-500 font-medium">Professional Print-Ready Photos</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                AI Enhancement Active
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                A6 Print Layout
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
