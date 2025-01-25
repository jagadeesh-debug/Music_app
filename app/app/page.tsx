import { SongCard } from "@/components/SongCard";
import { playlist, SpotifyImages} from "@/zustand/golang";

interface respSuggestion {
  tracks: song[];
  playlist: playlist[];
}

export interface song {
  id: string;
  name: string;
  images: SpotifyImages[];
  source: "jiosavan" | "yt";
  downloadurl: string;
  artist: string[]
}

const fetchSuggestions = async () => {
  // const res = await goBackendApi.get("/homesuggestion?query=trendsong");
  // const data: respSuggestion = res.data;
  const resNextVersion = await fetch("http://localhost:8000/homesuggestion?query=venom",{cache: "force-cache"})
  const dataNextVersion: respSuggestion = await resNextVersion.json()
  // console.log(dataNextVersion)
  // dataNextVersion.tracks.forEach((track: song)=>console.log(track.id,track.source))
  return dataNextVersion;
};

const Page = async () => {
  // const [songs, setSongs] = useState<song[]>([]);
  const songs = await (await fetchSuggestions()).tracks
  // const [playlists, setPlaylists] = useState<playlist[]>([])

  // useEffect(() => {
  //   (async () => {
  //     const data = await fetchSuggestions();
  //     setSongs(data.tracks);
  //     // setPlaylists(data.Playlist)
  //     // console.log(playlists)
  //   })();
  // }, []);

  return (
    <div>
      <h1>Songs</h1>
      <div className="flex flex-wrap">
        {/* <ScrollArea className="min-h-64"> */}
        {songs?.map((song) => (
          <SongCard key={song.id} data={song} />
        ))}
        {/* </ScrollArea> */}
      </div>
    </div>
  );
};



export default Page;
