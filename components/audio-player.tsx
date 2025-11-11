'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { getMediaByCategory } from '@/lib/sanity-queries'
import { urlFor } from '@/sanity/lib/image'

interface AudioItem {
  _id: string
  title: string
  mediaType: string
  imageFile?: {
    asset: {
      _ref: string
      url?: string
    }
  }
  otherFile?: {
    asset: {
      _ref: string
      url?: string
    }
  }
}

interface AudioPlayerProps {
  defaultAudioUrl?: string
}

const AudioPlayer = ({
  defaultAudioUrl = '/audio/nigeria-military-band.mp3',
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [volume, setVolume] = useState([30])
  const [isVisible, setIsVisible] = useState(true)
  const [audioUrl, setAudioUrl] = useState<string>(defaultAudioUrl)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Fetch audio from Sanity on component mount
  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const audioMedia = await getMediaByCategory('background-music')

        if (audioMedia && audioMedia.length > 0) {
          // Use the first audio file found in the background-music category
          const audio = audioMedia[0]

          // Determine which field contains the audio file based on mediaType
          let assetData = null
          if (
            audio.mediaType === 'audio' &&
            audio.otherFile &&
            audio.otherFile.asset
          ) {
            assetData = audio.otherFile.asset
          } else if (
            audio.mediaType === 'image' &&
            audio.imageFile &&
            audio.imageFile.asset
          ) {
            assetData = audio.imageFile.asset // fallback, shouldn't happen for audio
          }

          if (assetData) {
            if (assetData.url) {
              // If direct URL is available
              setAudioUrl(assetData.url)
            } else if (assetData._ref) {
              // Construct URL for file assets
              const assetRef = assetData._ref
              const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
              const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

              if (projectId && dataset) {
                // Determine if it's an image or file asset based on the _ref format
                if (assetRef.startsWith('image-')) {
                  // It's an image asset, use the urlFor function
                  try {
                    // Create a temporary image object for urlFor
                    const tempImage = {
                      _ref: assetRef,
                    }
                    setAudioUrl(urlFor(tempImage).url())
                  } catch (e) {
                    console.error('Error creating image URL:', e)
                  }
                } else if (assetRef.startsWith('file-')) {
                  // It's a file asset, construct the file URL
                  // Extract filename from "file-{sha256}-{extension}" format
                  const fileName = assetRef.replace('file-', '')
                  setAudioUrl(
                    `https://cdn.sanity.io/files/${projectId}/${dataset}/${fileName}`
                  )
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching audio from Sanity:', error)
        // Keep the default audio URL if fetching fails
      }
    }

    fetchAudio()

    // Remember mute/volume state in localStorage
    const savedMute = localStorage.getItem('audioMuted')
    if (savedMute !== null) {
      setIsMuted(savedMute === 'true')
    }

    const savedVolume = localStorage.getItem('audioVolume')
    if (savedVolume !== null) {
      setVolume([parseInt(savedVolume, 10)])
    }
  }, [])

  // Update audio element when audioUrl changes
  useEffect(() => {
    if (audioRef.current) {
      // Apply current volume and mute state immediately
      audioRef.current.volume = volume[0] / 100
      audioRef.current.muted = isMuted

      // Load the new source and preserve the state only when audioUrl changes
      audioRef.current.load()

      if (isPlaying && !isMuted) {
        // Play if it was playing before and we have a new audio source
        audioRef.current
          .play()
          .catch((e) =>
            console.error('Error playing audio after source change:', e)
          )
      }
    }
  }, [audioUrl]) // Only audioUrl should trigger this effect

  // Update volume and mute state immediately when they change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100
      audioRef.current.muted = isMuted
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((e) => {
          console.error('Error playing audio:', e)
          setIsPlaying(false)
        })
        if (isMuted) {
          setIsMuted(false)
          audioRef.current.muted = false
          localStorage.setItem('audioMuted', 'false')
        }
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      const newMuted = !isMuted
      audioRef.current.muted = newMuted
      setIsMuted(newMuted)
      localStorage.setItem('audioMuted', String(newMuted))
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100
      localStorage.setItem('audioVolume', value[0].toString())
      if (value[0] > 0 && isMuted) {
        setIsMuted(false)
        audioRef.current.muted = false
        localStorage.setItem('audioMuted', 'false')
      }
    }
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 transition-smooth',
        isVisible ? 'animate-fade-in' : 'opacity-0 pointer-events-none'
      )}
      role='region'
      aria-label='Audio player'
    >
      <div className='backdrop-blur-md bg-card/90 border border-border/50 rounded-full shadow-sm px-1.5 py-1 flex items-center gap-1'>
        <Button
          variant='ghost'
          size='icon'
          onClick={togglePlay}
          aria-label={
            isPlaying ? 'Pause background music' : 'Play background music'
          }
          className='h-6 w-6 rounded-full hover:bg-primary/10'
        >
          {isPlaying ? (
            <Pause className='w-2.5 h-2.5 fill-current' aria-hidden='true' />
          ) : (
            <Play className='w-2.5 h-2.5 fill-current' aria-hidden='true' />
          )}
        </Button>

        <Button
          variant='ghost'
          size='icon'
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          className='h-6 w-6 rounded-full hover:bg-primary/10'
        >
          {isMuted ? (
            <VolumeX className='w-2.5 h-2.5' aria-hidden='true' />
          ) : (
            <Volume2 className='w-2.5 h-2.5' aria-hidden='true' />
          )}
        </Button>

        <div className='w-12'>
          <Slider
            value={volume}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            aria-label='Volume control'
            className='cursor-pointer'
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        loop
        muted={isMuted}
        aria-label='Background music player'
      >
        <source src='/audio/nigeria-military-band.mp3' type='audio/mpeg' />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}

export default AudioPlayer
