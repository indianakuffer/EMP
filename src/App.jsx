import * as React from "react";
import { useState, useEffect } from "react";
import Playlist from "./Playlist.jsx";
import "./App.scss";

export default function App() {
  /////////////////////////////////////////////////////
  // States
  /////////////////////////////////////////////////////
  const [playlists, setPlaylists] = useState({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
  });
  const [currentPlaylist, setCurrentPlaylist] = useState(0);

  /////////////////////////////////////////////////////
  // Storage
  /////////////////////////////////////////////////////
  useEffect(() => {
    if (window.localStorage.playlists) {
      setPlaylists(JSON.parse(window.localStorage.playlists));
    }
  }, []);

  useEffect(() => {
    window.localStorage.playlists = JSON.stringify(playlists);
  }, [playlists]);

  /////////////////////////////////////////////////////
  // Edit playlists
  /////////////////////////////////////////////////////
  const addToPlaylist = (pathList) => {
    let newList = playlists[currentPlaylist];
    pathList.forEach((path) => {
      if (!newList.includes(path)) {
        newList.push(path);
      }
    });

    const replacement = replaceInPlaylists(newList);
    setPlaylists(replacement);
  };

  const removeFromPlaylist = (path) => {
    let newList = playlists[currentPlaylist];
    newList = newList.filter((x) => x !== path);

    const replacement = replaceInPlaylists(newList);
    setPlaylists(replacement);
  };

  const replaceInPlaylists = (newList) => {
    let newGroup = {};
    for (let [key] of Object.entries(playlists)) {
      if (parseInt(key) === currentPlaylist) {
        newGroup[key] = newList;
      } else {
        newGroup[key] = playlists[key];
      }
    }
    return newGroup;
  };

  /////////////////////////////////////////////////////
  // Other
  /////////////////////////////////////////////////////

  const handleDrop = (ev) => {
    ev.preventDefault();
    const files = ev.dataTransfer.files;
    let pathList = [];
    for (let [key, value] of Object.entries(files)) {
      pathList.push(value.path);
    }
    addToPlaylist(pathList);
  };

  const handleDragOver = (ev) => {
    ev.preventDefault();
  };

  const handleDropzoneClick = async () => {
    const selected = await window.electron.openFile();
    addToPlaylist(selected);
  };

  return (
    <>
      <h1>EMP</h1>
      <div
        className="dropzone"
        onClick={handleDropzoneClick}
        onDragOver={(ev) => handleDragOver(ev)}
        onDrop={(ev) => handleDrop(ev)}
      >
        Drag music here, or click to browse.
      </div>
      <Playlist
        playlists={playlists}
        currentPlaylist={currentPlaylist}
        setCurrentPlaylist={setCurrentPlaylist}
        removeFromPlaylist={removeFromPlaylist}
      />
    </>
  );
}
