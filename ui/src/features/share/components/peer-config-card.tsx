'use client'

import { useEffect, useState } from 'react'
import { CopyIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface ConfigCardProps {
  isLoading: boolean
  blob?: Blob
  peerName?: string
}

export default function PeerConfigCard({
  isLoading,
  blob,
  peerName,
}: ConfigCardProps) {
  const [configText, setConfigText] = useState<string>('')
  const [isBlurred, setIsBlurred] = useState(true)

  useEffect(() => {
    if (blob) {
      const reader = new FileReader()
      reader.onload = () => setConfigText(reader.result as string)
      reader.readAsText(blob)
    }
  }, [blob])

  const handleCopy = async () => {
    if (!configText) return
    await navigator.clipboard.writeText(configText)
    toast.success('Copied to clipboard.', { duration: 5000 })
  }

  const handleDownload = () => {
    if (!configText) return
    const file = new Blob([configText], { type: 'text/plain;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(file)
    link.download = `${peerName || 'peer'}.conf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const toggleBlur = () => {
    setIsBlurred((prev) => !prev)
  }

  return (
    <Card className='sky-glass-card flex h-full min-w-0 flex-col gap-5 border-white/10'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='from-primary bg-gradient-to-r to-fuchsia-400 bg-clip-text text-base font-semibold text-transparent'>
          Configuration
        </CardTitle>
        <span className='text-xs font-semibold text-amber-400'>
          .conf file
        </span>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col'>
        {isLoading ? (
          <div className='flex flex-1 flex-col justify-center space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-5/6' />
            <Skeleton className='h-4 w-4/6' />
            <Skeleton className='h-4 w-3/6' />
            <Skeleton className='mt-4 h-10 w-32' />
          </div>
        ) : (
          <div
            className='relative min-h-[12rem] flex-1 cursor-pointer overflow-auto rounded-xl border border-white/10 bg-black/30 px-4 py-3'
            onClick={toggleBlur}
            title={isBlurred ? 'Click to reveal' : 'Click to hide'}
          >
            <pre
              className={`text-sm break-words whitespace-pre-wrap transition-all duration-300 ${
                isBlurred ? 'blur-md' : 'blur-0'
              }`}
            >
              <code>{configText}</code>
            </pre>

            {isBlurred && (
              <div className='pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 font-semibold text-white'>
                Click to reveal
              </div>
            )}

            <Button
              variant='outline'
              size='sm'
              onClick={(e) => {
                e.stopPropagation()
                handleCopy()
              }}
              className='absolute top-2 right-2 border-white/15 bg-white/5 hover:bg-white/10'
            >
              <CopyIcon className='mr-1 h-4 w-4' />
              Copy
            </Button>
          </div>
        )}
      </CardContent>
      {!isLoading && (
        <CardFooter className='mt-auto'>
          <Button
            className='w-full border-0 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white hover:opacity-90'
            onClick={handleDownload}
          >
            Download Configuration
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
