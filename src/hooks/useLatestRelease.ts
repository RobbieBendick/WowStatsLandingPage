import { useState, useEffect } from 'react'

export function useLatestRelease() {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestRelease = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/repos/WoW-Stats/WoWStatsReleases/releases/latest'
        )
        const data = await response.json()
        
        // Find the Windows executable asset (typically .exe or .msi)
        const windowsAsset = data.assets?.find((asset: any) => 
          asset.name.endsWith('.exe') || 
          asset.name.endsWith('.msi') ||
          asset.name.toLowerCase().includes('windows')
        )
        
        if (windowsAsset) {
          setDownloadUrl(windowsAsset.browser_download_url)
        } else if (data.assets && data.assets.length > 0) {
          // Fallback to first asset if no Windows-specific one found
          setDownloadUrl(data.assets[0].browser_download_url)
        } else {
          // Fallback to releases page if no assets found
          setDownloadUrl('https://github.com/WoW-Stats/WoWStatsReleases/releases/latest')
        }
      } catch (error) {
        console.error('Failed to fetch latest release:', error)
        // Fallback to releases page on error
        setDownloadUrl('https://github.com/WoW-Stats/WoWStatsReleases/releases/latest')
      } finally {
        setLoading(false)
      }
    }

    fetchLatestRelease()
  }, [])

  return { downloadUrl, loading }
}
