import React from 'react';
import { Code, Palette, Megaphone, FileText, Smartphone, Video, Music, Settings } from 'lucide-react';

const categories = [
  { id: 'web-development', name: 'Web Development', icon: Code, color: 'bg-blue-100 text-blue-600' },
  { id: 'graphic-design', name: 'Graphic Design', icon: Palette, color: 'bg-pink-100 text-pink-600' },
  { id: 'digital-marketing', name: 'Digital Marketing', icon: Megaphone, color: 'bg-green-100 text-green-600' },
  { id: 'writing-translation', name: 'Writing & Translation', icon: FileText, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'mobile-development', name: 'Mobile Development', icon: Smartphone, color: 'bg-purple-100 text-purple-600' },
  { id: 'video-animation', name: 'Video & Animation', icon: Video, color: 'bg-red-100 text-red-600' },
  { id: 'music-audio', name: 'Music & Audio', icon: Music, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'programming-tech', name: 'Programming & Tech', icon: Settings, color: 'bg-gray-100 text-gray-600' },
];

export const Categories = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our most in-demand categories and find the perfect service for your needs
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="group cursor-pointer bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};