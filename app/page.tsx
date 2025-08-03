'use client'

'use client'

import ProfileMenu from "@/components/ProfileMenu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
// Adjust the import path as needed

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
      setContentVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Welcome Splash Screen */}
      {showWelcome && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-1000"
          style={{
            background: `
              radial-gradient(ellipse at center, rgba(29, 78, 216, 0.3) 0%, rgba(15, 23, 42, 1) 100%)
            `,
          }}
        >
          <div className="text-center animate-pulse">
            <h1 className="text-5xl font-bold text-white mb-4">Welcome to NVCCZ</h1>
            <p className="text-xl text-blue-200">Loading your experience...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div 
        className={`flex flex-col items-center justify-start min-h-screen p-4 transition-opacity duration-1000 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          background: `
            radial-gradient(ellipse at top left, rgba(29, 78, 216, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at bottom right, rgba(30, 58, 138, 0.25) 0%, transparent 50%),
            linear-gradient(to bottom right, #0f172a, #1e293b, #1e3a8a)
          `,
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Profile Menu */}
        <ProfileMenu />
        <Tabs defaultValue="feed" className="w-full max-w-[900px]">
          <TabsList className="grid w-full grid-cols-4 gap-2 p-2 rounded-xl mb-8" style={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(55, 65, 81, 0.5)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(8px)'
          }}>
            <TabsTrigger 
              value="feed"
              className="relative overflow-hidden rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 group"
              style={{
                color: '#d1d5db',
                backgroundColor: 'transparent'
              }}
            >
              <span className="relative z-10">Feed</span>
              <span 
                className="absolute inset-0 opacity-0 rounded-lg transition-opacity duration-300 group-data-[state=active]:opacity-100" 
                style={{
                  background: 'linear-gradient(to right, #1e3a8a, #3b82f6)'
                }}
              />
              <span 
                className="absolute inset-0 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(30, 58, 138, 0)',
                  border: '1px solid transparent'
                }}
              />
            </TabsTrigger>
            
            <TabsTrigger 
              value="newsletter"
              className="relative overflow-hidden rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 group"
              style={{
                color: '#d1d5db',
                backgroundColor: 'transparent'
              }}
            >
              <span className="relative z-10">Newsletter</span>
              <span 
                className="absolute inset-0 opacity-0 rounded-lg transition-opacity duration-300 group-data-[state=active]:opacity-100" 
                style={{
                  background: 'linear-gradient(to right, #1e3a8a, #3b82f6)'
                }}
              />
            </TabsTrigger>
            
            <TabsTrigger 
              value="forum"
              className="relative overflow-hidden rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 group"
              style={{
                color: '#d1d5db',
                backgroundColor: 'transparent'
              }}
            >
              <span className="relative z-10">Forum</span>
              <span 
                className="absolute inset-0 opacity-0 rounded-lg transition-opacity duration-300 group-data-[state=active]:opacity-100" 
                style={{
                  background: 'linear-gradient(to right, #1e3a8a, #3b82f6)'
                }}
              />
            </TabsTrigger>
            
            <TabsTrigger 
              value="calendar"
              className="relative overflow-hidden rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 group"
              style={{
                color: '#d1d5db',
                backgroundColor: 'transparent'
              }}
            >
              <span className="relative z-10">Calendar</span>
              <span 
                className="absolute inset-0 opacity-0 rounded-lg transition-opacity duration-300 group-data-[state=active]:opacity-100" 
                style={{
                  background: 'linear-gradient(to right, #1e3a8a, #3b82f6)'
                }}
              />
            </TabsTrigger>
          </TabsList>
          
          <div 
            className="p-6 rounded-xl shadow-xl"
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(55, 65, 81, 0.4)'
            }}
          >
            <TabsContent value="feed" className="text-gray-300">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#ffffff' }}>Community Feed</h3>
              <p>Explore the latest updates from your network</p>
            </TabsContent>
            
            <TabsContent value="newsletter" className="text-gray-300">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#ffffff' }}>Newsletters</h3>
              <p>Stay updated with curated content</p>
            </TabsContent>
            
            <TabsContent value="forum" className="text-gray-300">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#ffffff' }}>Discussion Forum</h3>
              <p>Engage with the community in meaningful conversations</p>
            </TabsContent>
            
            <TabsContent value="calendar" className="text-gray-300">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#ffffff' }}>Event Calendar</h3>
              <p>Never miss important dates and gatherings</p>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
}