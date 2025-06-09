import { mergeClassNames } from 'src/utils'

import { TrackItem } from 'src/components'
import { SearchTrackItem } from './SearchTrackItem'
import './TrackSearchList.scss'

export const TrackSearchList = (props: {
  tracks: ITrackDetails[]
}) => {
  const { tracks } = props

  return (
    <div className="search-track-list">
      {tracks &&
        tracks.length > 0 &&
        tracks
          .map(
            (track) =>
              track && <SearchTrackItem track={track} key={track.id} />,
          )}
      {tracks.length < 1 && (
        <div className="search-track-list__empty">
          <p>No tracks found. Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  )
}