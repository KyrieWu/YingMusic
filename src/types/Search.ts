import { SongInfo } from './songInfo'
import { AlbumInfo } from './album'
import { ArtistsInfo } from './aritsts'
import { MVInfo } from './MVInfo'

export interface Search {
    code: number
    result: Result
}

interface Result {
    songs: SongInfo[],
    albums: AlbumInfo[],
    artists: ArtistsInfo[],
    playlists: any[],
    mvs: MVInfo[],
}