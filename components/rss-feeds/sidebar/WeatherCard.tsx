'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  WiDaySunny,
  WiNightClear,
  WiCloud,
  WiCloudy,
  WiDayCloudy,
  WiNightAltCloudy,
  WiRain,
  WiShowers,
  WiThunderstorm,
  WiSnow,
  WiFog,
} from 'react-icons/wi'

// Types for incoming data (either provided or fetched)
export type WeatherNow = {
  location: string
  tempC: number
  condition: string
  icon?: string
  highC?: number
  lowC?: number
  feelsLikeC?: number
  humidity?: number
  windKph?: number
  updatedAt?: string | number | Date
  isNight?: boolean
}

type WeatherCardProps = {
  // Provide either data or a fetchUrl.
  data?: WeatherNow
  fetchUrl?: string // Should return WeatherNow JSON
  compact?: boolean
  className?: string
}

function pickIcon(condition: string, isNight?: boolean) {
  const c = condition.toLowerCase()
  const size = 56
  
  if (/thunder|storm/.test(c)) 
    return <WiThunderstorm className="text-amber-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" size={size} />
  
  if (/rain|drizzle/.test(c)) 
    return <WiRain className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" size={size} />
  
  if (/shower/.test(c)) 
    return <WiShowers className="text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" size={size} />
  
  if (/snow|sleet|hail/.test(c)) 
    return <WiSnow className="text-sky-300 drop-shadow-[0_0_8px_rgba(186,230,253,0.5)]" size={size} />
  
  if (/fog|mist|haze|smoke/.test(c)) 
    return <WiFog className="text-slate-400 drop-shadow-[0_0_8px_rgba(148,163,184,0.5)]" size={size} />
  
  if (/overcast/.test(c)) 
    return <WiCloudy className="text-slate-500 drop-shadow-[0_0_8px_rgba(100,116,139,0.5)]" size={size} />
  
  if (/cloud/.test(c)) 
    return isNight 
      ? <WiNightAltCloudy className="text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" size={size} /> 
      : <WiDayCloudy className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" size={size} />
  
  if (/clear|sun/.test(c)) 
    return isNight 
      ? <WiNightClear className="text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" size={size} /> 
      : <WiDaySunny className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" size={size} />
  
  return isNight 
    ? <WiNightAltCloudy className="text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" size={size} /> 
    : <WiDayCloudy className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" size={size} />
}

export default function WeatherCard({ data, fetchUrl, compact = true, className = '' }: WeatherCardProps) {
  const [loading, setLoading] = useState<boolean>(!!fetchUrl)
  const [error, setError] = useState<string | null>(null)
  const [weather, setWeather] = useState<WeatherNow | undefined>(data)

  useEffect(() => {
    let active = true
    async function load() {
      if (!fetchUrl) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(fetchUrl)
        if (!res.ok) throw new Error(`Weather fetch failed: ${res.status} ${res.statusText}`)
        const json = await res.json()
        if (active) setWeather(json as WeatherNow)
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Unknown error'
        if (active) setError(msg)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [fetchUrl])

  // Fallback demo data if nothing provided
  const view = useMemo<WeatherNow>(() => {
    if (weather) return weather
    return {
      location: 'Harare, ZW',
      tempC: 22,
      condition: 'Partly Cloudy',
      highC: 25,
      lowC: 16,
      feelsLikeC: 21,
      updatedAt: Date.now(),
      isNight: false,
    }
  }, [weather])

  const icon = pickIcon(view.condition, view.isNight)

  // Determine background gradient based on condition and time
  const getBgGradient = () => {
    const c = view.condition.toLowerCase();
    if (view.isNight) {
      return "bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900";
    }
    if (/thunder|storm/.test(c)) {
      return "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900";
    }
    if (/rain|drizzle|shower/.test(c)) {
      return "bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900";
    }
    if (/snow|sleet|hail/.test(c)) {
      return "bg-gradient-to-br from-blue-200 via-blue-300 to-blue-100";
    }
    if (/fog|mist|haze|smoke|overcast/.test(c)) {
      return "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600";
    }
    if (/cloud/.test(c)) {
      return "bg-gradient-to-br from-blue-500 via-blue-400 to-sky-500";
    }
    // Default sunny
    return "bg-gradient-to-br from-sky-400 via-blue-400 to-blue-500";
  };

  // Determine text color based on condition
  const getTextColor = () => {
    const c = view.condition.toLowerCase();
    if (view.isNight || /thunder|storm|rain|drizzle|shower/.test(c)) {
      return "text-white";
    }
    if (/snow|sleet|hail/.test(c)) {
      return "text-blue-900";
    }
    return "text-white";
  };

  const bgGradient = getBgGradient();
  const textColor = getTextColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        y: -2, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className={`relative w-full ${bgGradient} border border-white/20 rounded-2xl p-4 sm:p-5 ${textColor} shadow-lg hover:shadow-xl transition-all overflow-hidden cursor-pointer font-poppins ${className}`}
      style={{ fontFamily: 'Poppins, sans-serif' }}
      aria-busy={loading}
    >
      {/* Animated weather effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/rain|drizzle|shower/.test(view.condition.toLowerCase()) && (
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute w-0.5 bg-blue-200 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  height: `${Math.random() * 20 + 10}px`,
                  opacity: Math.random() * 0.8 + 0.2,
                  animationDuration: `${Math.random() * 1.5 + 0.5}s`,
                  animationDelay: `${Math.random() * 2}s`,
                  animation: 'rainDrop linear infinite',
                }}
              />
            ))}
          </div>
        )}
        
        {/sun|clear/.test(view.condition.toLowerCase()) && !view.isNight && (
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-300 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3" />
        )}
        
        {view.isNight && (
          <>
            <div className="absolute inset-0">
              {Array.from({ length: 15 }).map((_, i) => (
                <div 
                  key={i}
                  className="absolute bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    opacity: Math.random() * 0.7 + 0.3,
                    animation: `twinkle ${Math.random() * 5 + 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Location */}
      <div className="relative flex items-center justify-between mb-2">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-medium tracking-wide"
        >
          {view.location}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-light opacity-80"
        >
          Now
        </motion.div>
      </div>

      {/* Main content - Icon and Temperature */}
      <div className="relative flex items-center justify-between mb-4">
        <motion.div 
          className="flex items-center justify-center"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          whileHover={{ 
            scale: 1.1, 
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.6 }
          }}
        >
          {icon}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="text-5xl font-light"
        >
          {Math.round(view.tempC)}°
        </motion.div>
      </div>
      
      {/* Condition and details */}
      <div className="relative">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-sm font-medium mb-3 capitalize"
        >
          {view.condition}
        </motion.div>
        
        {/* Temperature range */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-between text-xs font-medium"
        >
          {typeof view.highC === 'number' && typeof view.lowC === 'number' && (
            <>
              <div className="flex items-center gap-1">
                <span className="opacity-80">H:</span>
                <span>{Math.round(view.highC)}°</span>
              </div>
              <div className="h-4 w-px bg-white/30"></div>
              <div className="flex items-center gap-1">
                <span className="opacity-80">L:</span>
                <span>{Math.round(view.lowC)}°</span>
              </div>
              {typeof view.feelsLikeC === 'number' && (
                <>
                  <div className="h-4 w-px bg-white/30"></div>
                  <div className="flex items-center gap-1">
                    <span className="opacity-80">Feels:</span>
                    <span>{Math.round(view.feelsLikeC)}°</span>
                  </div>
                </>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-indigo-900/90 backdrop-blur-sm flex flex-col items-center justify-center"
        >
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-blue-700 mb-3">
            <motion.div 
              className="h-full bg-blue-400"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
          </div>
          <div className="text-xs text-blue-200 font-medium">Loading weather...</div>
        </motion.div>
      )}
      
      {/* Error overlay */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 bg-red-900/80 backdrop-blur-sm flex items-center justify-center"
        >
          <div className="text-sm text-white font-medium text-center px-4">{error}</div>
        </motion.div>
      )}
    </motion.div>
  )
}
