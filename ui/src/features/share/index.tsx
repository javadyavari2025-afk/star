'use client'

import { AxiosError } from 'axios'
import { useSearch } from '@tanstack/react-router'
import { useTelegramStatusQuery } from '@/hooks/telegram/useTelegramStatusQuery'
import { usePeerTelegramStatusQuery } from '@/hooks/telegram/usePeerTelegramStatusQuery.ts'
import { useUserConfigQuery } from '@/hooks/user/useUserConfigQuery.ts'
import { useUserDetailsQuery } from '@/hooks/user/useUserDetailsQuery.ts'
import { useUserQRCodeQuery } from '@/hooks/user/useUserQRCodeQuery.ts'
import NotFoundError from '@/features/errors/not-found-error.tsx'
import PeerConfigCard from '@/features/share/components/peer-config-card.tsx'
import PeerQRCodeCard from '@/features/share/components/peer-qrcode-card.tsx'
import PeerStatsCard from '@/features/share/components/peer-stats-card.tsx'
import PeerTelegramCard from '@/features/share/components/peer-telegram-card.tsx'

export default function PeerShare() {
  const { shareId } = useSearch({ from: '/share' })

  const {
    data: stats,
    error: statsError,
    isLoading: statsLoading,
  } = useUserDetailsQuery(shareId)

  const { data: configBlob, isLoading: configLoading } =
    useUserConfigQuery(shareId)

  const { data: qrCode, isLoading: qrCodeLoading } = useUserQRCodeQuery(shareId)
  const { data: telegramStatus, isLoading: telegramStatusLoading } =
    useTelegramStatusQuery()
  const { data: telegramLink, isLoading: telegramLinkLoading } =
    usePeerTelegramStatusQuery(
      telegramStatus?.enabled ? shareId : undefined
    )

  const configCard = (
    <PeerConfigCard
      isLoading={configLoading}
      blob={
        configBlob
          ? new Blob([configBlob], { type: 'text/plain' })
          : undefined
      }
      peerName={stats?.name}
    />
  )

  const statsCard = (
    <PeerStatsCard isLoading={statsLoading} stats={stats} />
  )

  if (statsError && (statsError as AxiosError)?.response?.status === 404) {
    return <NotFoundError />
  }

  return (
    <div className='sky-share-theme sky-share-bg text-foreground min-h-svh w-full'>
      <div className='mx-auto max-w-6xl space-y-8 px-6 py-10'>
        <div className='space-y-2 text-center'>
          <span className='from-primary bg-gradient-to-r to-fuchsia-400 bg-clip-text text-xs font-bold tracking-[0.2em] text-transparent uppercase'>
            SKY-PANEL
          </span>
          <h1 className='text-3xl font-bold tracking-tight'>
            Welcome{stats?.name ? `, ${stats.name}` : ''}
          </h1>
          <p className='text-muted-foreground text-sm'>
            Scan the QR Code with the WireGuard App to add this peer or
            download the config and import it manually.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
          {statsCard}
          <PeerQRCodeCard isLoading={qrCodeLoading} qrCode={qrCode} />
          {configCard}
          {telegramStatus?.enabled && (
            <PeerTelegramCard
              isLoading={telegramStatusLoading || telegramLinkLoading}
              shareId={shareId}
              botStatus={telegramStatus}
              linkStatus={telegramLink}
            />
          )}
        </div>
      </div>
    </div>
  )
}
