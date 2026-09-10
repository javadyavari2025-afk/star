'use client'

import { PeerStats } from '@/schema/peers.ts'
import clsx from 'clsx'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

interface StatsCardProps {
  isLoading: boolean
  stats: PeerStats | undefined
}

function remainingDays(expireTime: string | null | undefined): number {
  if (!expireTime) return 0
  const expireDate = new Date(expireTime)
  const now = new Date()
  const diffTime = expireDate.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export default function PeerStatsCard({ isLoading, stats }: StatsCardProps) {
  const isOnline = Boolean(stats?.is_online)
  const status = isOnline ? 'Online' : 'Offline'

  return (
    <Card className='sky-glass-card flex h-full flex-col gap-5 border-white/10'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0'>
        <CardTitle className='from-primary bg-gradient-to-r to-fuchsia-400 bg-clip-text text-base font-semibold text-transparent'>
          Statistics
        </CardTitle>
        {!isLoading && (
          <span
            className={clsx(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
              isOnline
                ? 'border-green-500/30 bg-green-500/10 text-green-400'
                : 'border-red-500/30 bg-red-500/10 text-red-400'
            )}
          >
            <span
              className={clsx(
                'h-1.5 w-1.5 rounded-full',
                isOnline ? 'bg-green-400' : 'bg-red-400'
              )}
            />
            {status}
          </span>
        )}
      </CardHeader>

      <CardContent className='flex flex-1 flex-col justify-center gap-5'>
        {isLoading ? (
          <div className='space-y-3'>
            <Skeleton className='h-4 w-1/2' />
            <Skeleton className='h-4 w-1/2' />
            <div className='grid grid-cols-2 gap-3 pt-2'>
              <Skeleton className='h-20 w-full rounded-xl' />
              <Skeleton className='h-20 w-full rounded-xl' />
            </div>
            <Skeleton className='h-3 w-full rounded-full' />
          </div>
        ) : (
          <>
            <div className='space-y-3 text-sm'>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Traffic Limit</span>
                <span className='from-primary bg-gradient-to-r to-fuchsia-400 bg-clip-text font-semibold text-transparent'>
                  {stats?.traffic_limit
                    ? `${stats.traffic_limit} GB`
                    : 'Unlimited'}
                </span>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Expiration</span>
                <span className='from-primary bg-gradient-to-r to-fuchsia-400 bg-clip-text font-semibold text-transparent'>
                  {stats?.expire_time
                    ? `${stats.expire_time} (${remainingDays(stats.expire_time)} Days)`
                    : 'Never'}
                </span>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div className='rounded-xl border border-white/10 bg-white/5 p-4'>
                <div className='flex items-center gap-1.5 text-xs font-semibold tracking-wide text-green-400 uppercase'>
                  <ArrowDownIcon className='h-3.5 w-3.5' />
                  Download
                </div>
                <div className='from-primary bg-gradient-to-r to-fuchsia-400 bg-clip-text mt-1 text-2xl font-bold text-transparent'>
                  {stats?.download_usage ?? 0}{' '}
                  <span className='text-muted-foreground text-sm font-medium'>
                    GB
                  </span>
                </div>
              </div>

              <div className='rounded-xl border border-white/10 bg-white/5 p-4'>
                <div className='flex items-center gap-1.5 text-xs font-semibold tracking-wide text-sky-400 uppercase'>
                  <ArrowUpIcon className='h-3.5 w-3.5' />
                  Upload
                </div>
                <div className='from-primary bg-gradient-to-r to-fuchsia-400 bg-clip-text mt-1 text-2xl font-bold text-transparent'>
                  {stats?.upload_usage ?? 0}{' '}
                  <span className='text-muted-foreground text-sm font-medium'>
                    GB
                  </span>
                </div>
              </div>
            </div>

            {stats?.traffic_limit && (
              <Progress
                value={Number(stats.usage_percent)}
                className='h-2 [&>div]:bg-gradient-to-r [&>div]:from-indigo-400 [&>div]:to-fuchsia-400'
              />
            )}

            <div className='flex items-center justify-between border-t border-white/10 pt-4 text-sm'>
              <span className='text-muted-foreground'>Total Usage</span>
              <span className='from-primary bg-gradient-to-r to-fuchsia-400 bg-clip-text font-semibold text-transparent'>
                {stats?.total_usage ?? 0} GB{' '}
                {stats?.traffic_limit ? `(${stats.usage_percent}%)` : ''}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
