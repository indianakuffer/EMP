import * as React from "react";
import { useState, useEffect } from "react";
import "./App.scss";

export default function App() {
  const [playlists, setPlaylists] = useState({
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
  });
  const [currentPlaylist, setCurrentPlaylist] = useState(0);

  const handleDragOver = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
  };

  const handleDrop = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    const files = ev.dataTransfer.files;
    let pathList = [];
    for (let [key, value] of Object.entries(files)) {
      pathList.push(value.path);
    }
    addToPlaylist(pathList);
  };

  const addToPlaylist = (pathList) => {
    let newList = playlists[currentPlaylist];
    pathList.forEach((path) => {
      if (!newList.includes(path)) {
        newList.push(path);
      }
    });
    let newGroup = {};
    for (let [key] of Object.entries(playlists)) {
      if (parseInt(key) === currentPlaylist) {
        newGroup[key] = newList;
      } else {
        newGroup[key] = playlists[key];
      }
    }
    setPlaylists(newGroup);
  };

  const removeFromPlaylist = (path) => {
    let newList = playlists[currentPlaylist];
    newList = newList.filter((x) => x !== path);

    let newGroup = {};
    for (let [key] of Object.entries(playlists)) {
      if (parseInt(key) === currentPlaylist) {
        newGroup[key] = newList;
      } else {
        newGroup[key] = playlists[key];
      }
    }
    setPlaylists(newGroup);
  };

  useEffect(() => {
    if (window.localStorage.playlists) {
      setPlaylists(JSON.parse(window.localStorage.playlists));
    }
  }, []);

  useEffect(() => {
    window.localStorage.playlists = JSON.stringify(playlists);
  }, [playlists]);

  const play = (path) => {
    window.electron.audioApi.startAudio(path);
    notify("EMP", `Now playing: ${pathToName(path)}`);
  };

  const notify = (title, body) => {
    window.electron.notificationApi.sendNotification(title, body);
  };

  const renderPlaylist = () => {
    return (
      playlists && (
        <ul>{playlists[currentPlaylist].map((path) => track(path))}</ul>
        // <ul>
        //   {["a", "a", "a", "a", "a", "a", "a"].map((path) => track(path))}
        // </ul>
      )
    );
  };

  const renderPlaylistDirectory = () => {
    return (
      <div className="directory">
        {Object.entries(playlists).map((p, i) => (
          <div
            className={`playlist ${i === currentPlaylist ? "current" : ""}`}
            onClick={() => setCurrentPlaylist(i)}
          >
            {`list${i + 1}`}
          </div>
        ))}
      </div>
    );
  };

  const track = (path) => {
    return (
      <>
        <li key={path}>
          <button className="play-btn" onClick={() => play(path)}>
            ▶
          </button>
          <div>{pathToName(path)}</div>
          <button
            className="remove-btn"
            onClick={() => removeFromPlaylist(path)}
          >
            X
          </button>
        </li>
      </>
    );
  };

  const pathToName = (path) => {
    const trimDir = path.slice(path.lastIndexOf("/") + 1);
    const trimExt = trimDir.slice(0, trimDir.indexOf("."));
    return trimExt;
  };

  return (
    <>
      <div className="top">
        <h1>EMP</h1>
        <div
          onClick={async () => {
            const selected = await window.electron.openFile();
            addToPlaylist(selected);
          }}
          className="dropzone"
          onDragOver={(ev) => handleDragOver(ev)}
          onDrop={(ev) => handleDrop(ev)}
        >
          Drag music here, or click to browse.
        </div>
        {renderPlaylistDirectory()}
      </div>
      {renderPlaylist()}
    </>
  );
}
