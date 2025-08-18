"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export type FormattedExchangeRate = {
  currency: string
  bid: number | string
  ask: number | string
  avg: number | string
}

export type FinalExchangeRateResponse = {
  status: string
  date: string // formatted DD-MM-YYYY
  timestamp: string
  source: string
  url: string
  exchange_rates: FormattedExchangeRate[]
}

interface TickerStripProps {
  data: FinalExchangeRateResponse
  className?: string
}

export function TickerStrip({ data, className = "" }: TickerStripProps) {
  const [isPaused, setIsPaused] = useState(false)
  const tickerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll animation
  useEffect(() => {
    if (!tickerRef.current || isPaused) return

    const scrollWidth = tickerRef.current.scrollWidth / 2 // Divide by 2 since we duplicate content
    let scrollPosition = 0

    const scroll = () => {
      if (!tickerRef.current || isPaused) return

      scrollPosition += 0.5 // Adjust speed here
      if (scrollPosition >= scrollWidth) {
        scrollPosition = 0
      }
      tickerRef.current.style.transform = `translateX(-${scrollPosition}px)`
    }

    const intervalId = setInterval(scroll, 20) // 50fps

    return () => clearInterval(intervalId)
  }, [isPaused])

  const formatValue = (value: number | string): string => {
    if (typeof value === "string") return value
    return value.toFixed(4)
  }

  const getChangeColor = (bid: number | string, ask: number | string): string => {
    const bidNum = typeof bid === "string" ? Number.parseFloat(bid) : bid
    const askNum = typeof ask === "string" ? Number.parseFloat(ask) : ask

    if (bidNum > askNum) return "text-green-600"
    if (bidNum < askNum) return "text-red-600"
    return "text-black"
  }

  return (
    <div className={`relative bg-slate-100 border-b border-slate-200 overflow-hidden ${className}`}>
      {/* Ticker Content */}
      <div 
        className="py-3 px-4" 
        onMouseEnter={() => setIsPaused(true)} 
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={tickerRef}
          className="flex items-center gap-8 whitespace-nowrap transition-transform"
          style={{ willChange: 'transform' }}
        >
          {/* Duplicate the data for seamless loop */}
          {[...data.exchange_rates, ...data.exchange_rates].map((rate, index) => (
            <div key={`${rate.currency}-${index}`} className="flex items-center gap-6 min-w-fit">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-800 text-sm">{rate.currency}</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-600">BID:</span>
                  <span className={`font-medium ${getChangeColor(rate.bid, rate.ask)}`}>{formatValue(rate.bid)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-600">ASK:</span>
                  <span className={`font-medium ${getChangeColor(rate.ask, rate.bid)}`}>{formatValue(rate.ask)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-600">AVG:</span>
                  <span className="font-medium text-slate-700">{formatValue(rate.avg)}</span>
                </div>
              </div>
              {index < data.exchange_rates.length * 2 - 1 && <div className="w-px h-4 bg-slate-300" />}
            </div>
          ))}
        </div>
      </div>

      {/* Status Info */}
      <div className="absolute top-2 right-4 text-xs text-slate-500">
        Updated: {data.date} | Source: {data.source}
      </div>

      {/* Gradient overlays for smooth fade */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-100 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-100 to-transparent pointer-events-none z-10" />
    </div>
  )
}
