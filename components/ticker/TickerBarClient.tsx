import { TickerStrip } from "./TickerBar"
import { sampleExchangeData } from "@/lib/constants"

export default function TickerBarClient() {
  return (
    <div className="w-full">
      <TickerStrip data={sampleExchangeData} />
    </div>
  )
}


