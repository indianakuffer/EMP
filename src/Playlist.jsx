import * as React from "react";

export default function Playlist(props) {
  const { playlists, currentPlaylist, setCurrentPlaylist, removeFromPlaylist } =
    props;

  /////////////////////////////////////////////////////
  // Actions
  /////////////////////////////////////////////////////

  const play = (path) => {
    window.electron.audioApi.startAudio(path);
    notify("EMP", `Now playing: ${pathToName(path)}`);
  };

  const notify = (title, body) => {
    window.electron.notificationApi.sendNotification(title, body);
  };

  /////////////////////////////////////////////////////
  // Utils
  /////////////////////////////////////////////////////

  const pathToName = (path) => {
    const trimDir = path.slice(path.lastIndexOf("/") + 1);
    const trimExt = trimDir.slice(0, trimDir.indexOf("."));
    return trimExt;
  };

  /////////////////////////////////////////////////////
  // Rendering
  /////////////////////////////////////////////////////
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
  const renderPlaylist = () => {
    return (
      playlists && (
        <ul>{playlists[currentPlaylist].map((path) => renderTrack(path))}</ul>
      )
    );
  };

  const renderTrack = (path) => {
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

  return (
    <>
      {renderPlaylistDirectory()}
      {renderPlaylist()}
    </>
  );
}
