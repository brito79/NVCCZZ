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
  if (/thunder|storm/.test(c)) return <WiThunderstorm className="text-slate-600" size={48} />
  if (/rain|drizzle/.test(c)) return <WiRain className="text-slate-600" size={48} />
  if (/shower/.test(c)) return <WiShowers className="text-slate-600" size={48} />
  if (/snow|sleet|hail/.test(c)) return <WiSnow className="text-slate-600" size={48} />
  if (/fog|mist|haze|smoke/.test(c)) return <WiFog className="text-slate-600" size={48} />
  if (/overcast/.test(c)) return <WiCloudy className="text-slate-600" size={48} />
  if (/cloud/.test(c)) return isNight ? <WiNightAltCloudy className="text-slate-600" size={48} /> : <WiDayCloudy className="text-slate-600" size={48} />
  if (/clear|sun/.test(c)) return isNight ? <WiNightClear className="text-slate-600" size={48} /> : <WiDaySunny className="text-slate-600" size={48} />
  return isNight ? <WiNightAltCloudy className="text-slate-600" size={48} /> : <WiDayCloudy className="text-slate-600" size={48} />
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
      className={`relative w-full max-w-[240px] sm:max-w-[280px] bg-slate-200 border border-slate-300 rounded-xl p-3 sm:p-4 md:p-6 text-slate-700 shadow-lg hover:shadow-xl transition-shadow overflow-hidden cursor-pointer font-poppins ${className}`}
      style={{ fontFamily: 'Poppins, sans-serif' }}
      aria-busy={loading}
    >
      {/* Simple header */}
      <div className="flex items-center justify-center mb-3 sm:mb-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xs sm:text-sm font-normal text-slate-600 tracking-wide uppercase"
        >
          Weather
        </motion.div>
      </div>

      {/* Main content - Icon and Temperature */}
      <div className="flex flex-col items-center space-y-3 sm:space-y-4 mb-3 sm:mb-4">
        <motion.div 
          className="flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
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
        
        <div className="text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl sm:text-3xl md:text-4xl font-normal text-slate-400 mb-1 sm:mb-2"
          >
            {Math.round(view.tempC)}°
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xs sm:text-sm md:text-base text-slate-400 font-normal capitalize"
          >
            {view.condition}
          </motion.div>
        </div>
      </div>

      {/* Temperature range */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600"
      >
        {typeof view.highC === 'number' && (
          <span className="flex items-center gap-1">
            <span className="text-slate-500 font-normal">High:</span>
            <span className="font-normal">{Math.round(view.highC)}°</span>
          </span>
        )}
        {typeof view.lowC === 'number' && (
          <span className="flex items-center gap-1">
            <span className="text-slate-500 font-normal">Low:</span>
            <span className="font-stretch-normal">{Math.round(view.lowC)}°</span>
          </span>
        )}
      </motion.div>

      {/* Loading overlay */}
      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-slate-200/90 flex flex-col items-center justify-center"
        >
          <div className="h-1 w-16 sm:w-20 overflow-hidden rounded-full bg-slate-300 mb-2">
            <motion.div 
              className="h-full bg-slate-600"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
          </div>
          <div className="text-xs text-slate-600 font-normal">Loading weather...</div>
        </motion.div>
      )}
      
      {/* Error overlay */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-x-3 sm:inset-x-4 bottom-3 sm:bottom-4 px-3 py-2 bg-red-100 border border-red-200 rounded-lg"
        >
          <div className="text-xs text-red-600 font-normal text-center">{error}</div>
        </motion.div>
      )}
    </motion.div>
  )
}
