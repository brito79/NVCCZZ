'use client'

import ProfileMenu from "@/components/ProfileMenu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { EventsData, NewsletterData, PostsData } from "@/types.db";
import Posts from "./tabs/posts";
import EventsCalendar from "./tabs/calendar";
import NewsletterCarousel from "./tabs/newsletter";
import FeedPage from "./tabs/feeds";
import HeroClient from "./HeroClient";
import { ChatbotProvider } from "@/components/chatbot";
import HomepageSidebar from "@/components/HomepageSidebar";
import SocialMediaLinks from "@/components/mediapages/SocialMediaLinks";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState("feed");
  const [logged, setLogged] = useState(false);
  const router = useRouter();

  // Mock data objects
  const eventsData: EventsData = {
    success: true,
    data: [
      {
        "id": "clx1234567890abcdef",
        "title": "Company Annual Meeting",
        "description": "Annual company meeting for all employees",
        "startDate": "2024-12-25T09:00:00.000Z",
        "endDate": "2024-12-25T17:00:00.000Z",
        "location": "Main Conference Room",
        "authorId": "clx1234567890abcdef",
        "author": {
          "id": "clx1234567890abcdef",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "isActive": true,
        "createdAt": "2025-08-03T12:17:54.136Z",
        "updatedAt": "2025-08-03T12:17:54.136Z"
      }
    ]
  };


  useEffect(() => {
    const isSessionActive = sessionStorage.getItem('userID');
    if (isSessionActive) {
      setLogged(true);
      setShowWelcome(false);
      setContentVisible(true);
    } else {
      const timer = setTimeout(() => {
        setShowWelcome(true);
        setContentVisible(false);
      }, 3000);
      router.push('/auth')
      return () => clearTimeout(timer);
    }
  }, []);

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95,
      transition: { 
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const tabVariants: Variants = {
    inactive: { 
      scale: 1,
      transition: { duration: 0.2 }
    },
    active: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  return (
    <ChatbotProvider position="bottom-right">
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <HomepageSidebar />

        {/* Main Content */}
        <div className="relative flex-1 overflow-hidden">
          {/* Right Social Media Links - Fixed Position */}
          <SocialMediaLinks />

          {/* Hero (mock API data) */}
          <section className="mx-auto w-full max-w-7xl px-3 py-3 sm:px-4">
            {/* hydrating client-side is fine for now */}
            <HeroClient />
          </section>

          {/* Welcome Splash Screen */}
          <AnimatePresence mode="wait">
            {showWelcome && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center"
                style={{
                  background: `radial-gradient(ellipse at center, rgba(59, 130, 246, 0.4) 0%, rgba(51, 65, 85, 1) 100%)`,
                }}
              >
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="text-center"
                >
                  <motion.h1 
                    className="mb-4 text-5xl font-bold text-white"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Welcome to NVCCZ
                  </motion.h1>
                  <motion.p 
                    className="text-xl text-blue-200"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    Loading your experience...
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div 
            className={`flex min-h-screen flex-col items-center justify-start transition-opacity duration-1000 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ 
              background: `
                radial-gradient(ellipse at top left, color-mix(in oklch, var(--primary) 25%, transparent) 0%, transparent 45%),
                radial-gradient(ellipse at bottom right, color-mix(in oklch, var(--chart-2) 25%, transparent) 0%, transparent 45%),
                linear-gradient(to bottom right, color-mix(in oklch, var(--secondary) 85%, white), color-mix(in oklch, var(--accent) 70%, white))
              `,
              backgroundAttachment: 'fixed'
            }}
          >
            {/* Top-right controls (sticky) */}
            <div className="sticky top-4 z-40 flex w-full items-center justify-end gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-input bg-card/70 px-3 py-2 shadow-xl backdrop-blur">
                <div className="h-5 w-px bg-slate-600/60" />
                {/* Removed profile button next to calendar */}
                <ProfileMenu />
              </div>
            </div>

            <Tabs 
              defaultValue="feed" 
              className="w-[95%] max-w-none"
              onValueChange={(value) => setCurrentTab(value)}
            >
              <TabsList 
                className="mb-8 grid w-full grid-cols-4 gap-2 rounded-xl border border-input bg-card p-2 shadow-lg backdrop-blur"
              >
                {['feed', 'newsletter', 'forum', 'calendar'].map((tabValue) => (
                  <TabsTrigger key={tabValue} value={tabValue} asChild>
                    <motion.button
                      className="group relative w-full overflow-hidden rounded-lg px-6 py-3 text-base font-semibold text-muted-foreground data-[state=active]:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-colors"
                      variants={tabVariants}
                      initial="inactive"
                      animate={currentTab === tabValue ? 'active' : 'inactive'}
                      whileHover="hover"
                    >
                      <span className="relative z-10 capitalize">{tabValue}</span>
                      <span
                        className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-data-[state=active]:opacity-100 bg-gradient-to-r from-chart-2/30 via-primary/50 to-primary/80"
                      />
                      <span className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-border data-[state=active]:ring-primary/40" />
                    </motion.button>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div 
                className="relative min-h-[300px] w-full rounded-xl border p-6 shadow-xl bg-card/95 backdrop-blur"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTab}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={contentVariants}
                  >
                    {currentTab === "feed" && (
                      <TabsContent value="feed" className="text-foreground">
                        <FeedPage />
                      </TabsContent>
                    )}

                    {currentTab === "newsletter" && (
                      <TabsContent value="newsletter" className="text-foreground">
                        <NewsletterCarousel />
                      </TabsContent>
                    )}

                    {currentTab === "forum" && (
                      <TabsContent value="forum" className="text-foreground">
                        <Posts />
                      </TabsContent>
                    )}

                    {currentTab === "calendar" && (
                      <TabsContent value="calendar" className="text-foreground">
                        <EventsCalendar events={eventsData} />
                      </TabsContent>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </ChatbotProvider>
  );
}