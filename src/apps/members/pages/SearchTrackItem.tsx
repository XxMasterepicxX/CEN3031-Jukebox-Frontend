import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Network } from 'src/network'
import { selectCurrentJukebox } from 'src/store'
import { formatDuration } from 'src/utils'
import { ThumbsUp, ThumbsDown } from 'src/assets/svg'

import "./SearchTrackItem.scss"

export const SearchTrackItem = (props: { track: Nullable<ITrackDetails> }) => {
  const { track } = props

  const network = Network.getInstance()
  const jukebox = useSelector(selectCurrentJukebox)

  const [addedToQueue, setAddedToQueue] = useState(false)
  const [likes, setLikes] = useState(Math.floor(Math.random() * 10) + 1) // Mock likes data
  const [dislikes, setDislikes] = useState(Math.floor(Math.random() * 3)) // Mock dislikes data
  const [userLiked, setUserLiked] = useState(false)
  const [userDisliked, setUserDisliked] = useState(false)

  const addSongToQueue = async() =>{
    if(track && jukebox)
    {
      const songhref:string = track.id
      const res = await network.queueTrack(jukebox.id, songhref)
      console.log(res)
    }else{
      console.log("Not Possible")
    }

    setAddedToQueue(true)
  }

  const handleLike = () => {
    if (userLiked) {
      // Remove like
      setLikes(prev => prev - 1)
      setUserLiked(false)
    } else {
      // Add like
      setLikes(prev => prev + 1)
      setUserLiked(true)
      // Remove dislike if it exists
      if (userDisliked) {
        setDislikes(prev => prev - 1)
        setUserDisliked(false)
      }
    }
  }

  const handleDislike = () => {
    if (userDisliked) {
      // Remove dislike
      setDislikes(prev => prev - 1)
      setUserDisliked(false)
    } else {
      // Add dislike
      setDislikes(prev => prev + 1)
      setUserDisliked(true)
      // Remove like if it exists
      if (userLiked) {
        setLikes(prev => prev - 1)
        setUserLiked(false)
      }
    }
  }

  return (
    <li className="search-track-item">
      {!track && <p>No track specified.</p>}
      {track && (
        <>
          {/* Album Cover */}
          <div className="search-track-item__cover">
            <img
              src={track?.album?.images[0]?.url || '/placeholder-album.png'}
              alt={track.name}
            />
          </div>
          
          {/* Title & Artist */}
          <div className="search-track-item__info">
            <h3 className="search-track-item__title">{track.name}</h3>
            <span className="search-track-item__artist">
              {track.artists.map((artist) => artist.name).join(', ')}
            </span>
          </div>
          
          {/* Album Name */}
          <div className="search-track-item__album">
            {track.album.name}
          </div>
          
          {/* Duration */}
          <div className="search-track-item__duration">
            {formatDuration(track.duration_ms)}
          </div>
          
          {/* Likes */}
          <div className="search-track-item__likes">
            <button 
              className={`search-track-item__like-button ${userLiked ? 'search-track-item__like-button--active' : ''}`}
              onClick={handleLike}
              title="Like this track"
            >
              <span className="search-track-item__like-icon">👍</span>
              <span className="search-track-item__like-count">{likes}</span>
            </button>
          </div>
          
          {/* Dislikes */}
          <div className="search-track-item__dislikes">
            <button 
              className={`search-track-item__dislike-button ${userDisliked ? 'search-track-item__dislike-button--active' : ''}`}
              onClick={handleDislike}
              title="Dislike this track"
            >
              <span className="search-track-item__dislike-icon">👎</span>
              <span className="search-track-item__dislike-count">{dislikes}</span>
            </button>
          </div>
          
          {/* Add Button */}
          <div className="search-track-item__action">
            {addedToQueue ? (
              <div className="search-track-item__added">
                Added to Queue
              </div>
            ) : (
              <button className="search-track-item__add-button" onClick={addSongToQueue}>
                Add +
              </button>
            )}
          </div>
        </>
      )}
    </li>
  )
}
