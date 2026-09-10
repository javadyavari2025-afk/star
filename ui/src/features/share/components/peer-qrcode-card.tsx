'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface QRCodeCardProps {
  isLoading: boolean
  qrCode?: string
}

export default function PeerQRCodeCard({ isLoading, qrCode }: QRCodeCardProps) {
  const [isBlurred, setIsBlurred] = useState(true)

  const handleToggleBlur = () => {
    setIsBlurred((prev) => !prev)
  }

  return (
    <Card className='sky-glass-card flex h-full flex-col gap-5 border-white/10'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='from-primary bg-gradient-to-r to-fuchsia-400 bg-clip-text text-base font-semibold text-transparent'>
          QR Code
        </CardTitle>
        <span className='text-primary text-xs font-semibold'>WireGuard</span>
      </CardHeader>

      <CardContent className='flex flex-1 flex-col items-center justify-center gap-4'>
        {isLoading ? (
          <Skeleton className='h-[280px] w-[280px] rounded-2xl' />
        ) : (
          <div
            onClick={handleToggleBlur}
            className='relative cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-3'
            title={isBlurred ? 'Click to reveal' : 'Click to hide'}
          >
            <img
              src={qrCode}
              alt='QR Code'
              width={260}
              height={260}
              className={`h-[260px] w-[260px] rounded-xl transition-all duration-300 ${
                isBlurred ? 'blur-md' : 'blur-0'
              }`}
            />
            {isBlurred && (
              <div className='absolute inset-3 flex flex-col items-center justify-center gap-1 rounded-xl bg-black/50 text-center font-semibold text-white'>
                <span className='text-sm tracking-wide'>QR CODE PREVIEW</span>
                <span className='text-muted-foreground text-xs font-normal'>
                  Click to reveal
                </span>
              </div>
            )}
          </div>
        )}

        <p className='text-muted-foreground text-center text-sm'>
          Scan with your WireGuard app to connect instantly.
        </p>
      </CardContent>
    </Card>
  )
}
