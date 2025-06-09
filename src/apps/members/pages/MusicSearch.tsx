import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import './MusicSearch.scss'
import { useSelector } from 'react-redux'
import { selectCurrentJukebox, selectCurrentClub, selectUser } from 'src/store'
import { Network } from 'src/network'
import { TrackSearchList } from './TrackSearchList'

// Mock data for demonstration
const mockTracks: ITrackDetails[] = [
  {
    id: '1',
    name: 'Bohemian Rhapsody',
    artists: [{ name: 'Queen' }],
    album: { name: 'A Night at the Opera', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737bc8a646c8c4bd25a' }] },
    duration_ms: 355000,
    popularity: 95
  },
  {
    id: '2', 
    name: 'Hotel California',
    artists: [{ name: 'Eagles' }],
    album: { name: 'Hotel California', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273ca3ddd6158ef2f7d4f41e4c6' }] },
    duration_ms: 391000,
    popularity: 88
  },
  {
    id: '3',
    name: 'Stairway to Heaven', 
    artists: [{ name: 'Led Zeppelin' }],
    album: { name: 'Led Zeppelin IV', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a982d086afc69' }] },
    duration_ms: 482000,
    popularity: 92
  },
  {
    id: '4',
    name: 'Sweet Child O\' Mine',
    artists: [{ name: 'Guns N\' Roses' }],
    album: { name: 'Appetite for Destruction', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b2735ba5489c4c59e38b60b3dc9c' }] },
    duration_ms: 356000,
    popularity: 94
  },
  {
    id: '5',
    name: 'Imagine',
    artists: [{ name: 'John Lennon' }],
    album: { name: 'Imagine', images: [{ url: 'https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe' }] },
    duration_ms: 183000,
    popularity: 91
  }
]

export const MusicSearch = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const jukebox = useSelector(selectCurrentJukebox)
  const currentClub = useSelector(selectCurrentClub)
  const user = useSelector(selectUser)
  const [inputs, setInputs] = useState({ track: '', album: '', artist: '' })
  const [tracks, setTracks] = useState<ITrackDetails[]>(mockTracks) // Auto-load with mock data
  const [isLoading, setIsLoading] = useState(false)
  const network = Network.getInstance()

  // Detect if accessed via sidebar (show sidebar) or directly (standalone)
  const showSidebar = searchParams.get('embed') !== 'false' && !location.state?.standalone
  const isStandalone = !showSidebar

  // Auto-load tracks on component mount
  useEffect(() => {
    setTracks(mockTracks)
  }, [])
  
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name
    const value = event.target.value
    setInputs((values) => ({ ...values, [name]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      // Filter mock tracks based on search inputs
      const filteredTracks = mockTracks.filter(track => {
        const trackMatch = !inputs.track || track.name.toLowerCase().includes(inputs.track.toLowerCase())
        const albumMatch = !inputs.album || track.album.name.toLowerCase().includes(inputs.album.toLowerCase())
        const artistMatch = !inputs.artist || track.artists.some(artist => 
          artist.name.toLowerCase().includes(inputs.artist.toLowerCase())
        )
        return trackMatch && albumMatch && artistMatch
      })
      
      setTracks(filteredTracks)
      setIsLoading(false)
    }, 500)
  }

  if (isStandalone) {
    // Standalone mode - full page with navigation bar
    return (
      <div className="music-search-page music-search-page--standalone">
        {/* Navigation Bar */}
        <div className="music-search-nav">
          <div className="music-search-nav__content">
            <div className="music-search-nav__left">
              <span className="music-search-nav__title">
                Open Source Club's Jukebox
                <span className="music-search-nav__dropdown-arrow">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M6 8L0 0H12L6 8Z" fill="white" fillOpacity="0.8" />
                  </svg>
                </span>
              </span>
            </div>
            <div className="music-search-nav__right">
              <nav className="music-search-nav__links">
                <a href="/members">Jukebox</a>
                <a href="/members/music/search?embed=false" className="active">Search Songs</a>
                <a href="/public">Public Site</a>
              </nav>
              <div className="music-search-nav__user-info">
                <span className="music-search-nav__coins">50 🪙</span>
                <div className="music-search-nav__profile">
                  {user?.image ? (
                    <img src={user.image} alt={user.first_name} />
                  ) : (
                    <div className="music-search-nav__profile-placeholder" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="music-search-container">
          {/* Search Section */}
          <div className="music-search-section">
            <h1 className="music-search-title">Search Songs</h1>
            <form className="music-search-form" onSubmit={handleSubmit}>
              <div className="music-search-inputs">
                <input
                  className="music-search-input"
                  type="text"
                  name="track"
                  value={inputs.track || ''}
                  onChange={handleChange}
                  placeholder="Track Name"
                />
                <input
                  className="music-search-input"
                  type="text"
                  name="album"
                  value={inputs.album || ''}
                  onChange={handleChange}
                  placeholder="Album Name"
                />
                <input
                  className="music-search-input"
                  type="text"
                  name="artist"
                  value={inputs.artist || ''}
                  onChange={handleChange}
                  placeholder="Artist Name"
                />
                <button 
                  type="submit" 
                  className="music-search-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Searching...' : 'Search Tracks'}
                </button>
              </div>
            </form>
          </div>

          {/* Results Section */}
          <div className="music-search-results">
            <TrackSearchList tracks={tracks} />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="music-search-loading">
              <p>Searching for tracks...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="music-search-footer">
          <p>© UF Open Source Club, 2024</p>
        </footer>
      </div>
    )
  }

  // Sidebar mode - embedded in dashboard
  return (
    <div className="music-search-page music-search-page--embedded">
      {/* Search Section */}
      <div className="music-search-section">
        <h1 className="music-search-title">Search Songs</h1>
        <form className="music-search-form" onSubmit={handleSubmit}>
          <div className="music-search-inputs">
            <input
              className="music-search-input"
              type="text"
              name="track"
              value={inputs.track || ''}
              onChange={handleChange}
              placeholder="Track Name"
            />
            <input
              className="music-search-input"
              type="text"
              name="album"
              value={inputs.album || ''}
              onChange={handleChange}
              placeholder="Album Name"
            />
            <input
              className="music-search-input"
              type="text"
              name="artist"
              value={inputs.artist || ''}
              onChange={handleChange}
              placeholder="Artist Name"
            />
            <button 
              type="submit" 
              className="music-search-button"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search Tracks'}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div className="music-search-results">
        <TrackSearchList tracks={tracks} />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="music-search-loading">
          <p>Searching for tracks...</p>
        </div>
      )}
    </div>
  )
}