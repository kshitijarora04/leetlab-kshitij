import React, { useEffect, useState } from 'react'
import { X, Plus, Loader } from "lucide-react"
import { usePlaylistStore } from '../store/usePlaylistStore.js';

const AddToPlaylist = ({ isOpen, onClose, problemId }) => {

  const { playlists, getAllPlaylists, addProblemToPlaylist, isLoading } = usePlaylistStore();
  const [selectedPlayList, setSeletedPlayList] = useState("");

  useEffect(() => {
    if (isOpen) {
      getAllPlaylists()
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlayList) {
      return;
    }
    await addProblemToPlaylist(selectedPlayList, [problemId])
    onClose()
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <h3 className="text-xl font-bold">Add to Playlist</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Select Playlist</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedPlayList}
              onChange={(e) => setSeletedPlayList(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Select a playlist</option>
              {playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!selectedPlayList || isLoading}
            >
              {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add to Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  )

}

export default AddToPlaylist