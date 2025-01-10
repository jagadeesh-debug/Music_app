import { AddSongInPlaylist } from "../Api";
import { useStore } from "../zustand/store";
import { EllipsisVertical } from "lucide-react";
import {
  Menubar,
  MenubarMenu,
  MenubarContent,
  MenubarTrigger,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "../components/ui/menubar";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";

export default function SongDotMenu({ song }) {
  const { playlist } = useStore();
  return (
    <>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>
            <EllipsisVertical />
          </MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>Add to Queue</MenubarSubTrigger>
            </MenubarSub>
            <MenubarSub>
              <MenubarSubTrigger>Add to Playlist</MenubarSubTrigger>
              <MenubarSubContent className="w-52 mr-2 ">
                {playlist.map((list) => (
                  <div
                    key={list.id}
                    className="p-2 rounded-lg  w-full hover:bg-secondary"
                    onClick={() => (
                      AddSongInPlaylist(list.id, song.id),
                      toast("song added in playlist")
                    )}
                  >
                    {list.data.name}
                  </div>
                ))}
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <Toaster />
    </>
  );
}
