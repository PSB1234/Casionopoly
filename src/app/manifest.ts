import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Industrial.io',
    short_name: 'Industrial.io',
    description: 'Dive into Industrial.io, a multiplayer Board game with a retro 8-bit aesthetic. Trade, build, and conquer the board with your friends!',
    start_url: '/',
    display: 'standalone',
    background_color: '#281E50',
    theme_color: '#281E50',
    icons: [
      {
        src: '/app_icons/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/app_icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/app_icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/app_icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
