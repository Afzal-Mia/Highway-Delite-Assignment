import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/globalContext';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';

function Dashboard() {
  const { profileName,setUser, profileEmail, notes, addNotes, getNotes, deleteNoteById } = useContext(GlobalContext);
  const [showPopup, setShowPopup] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    addNotes({ content: noteContent });
    setNoteContent('');
    setShowPopup(false);
    setTimeout(() => getNotes(), 500);
  };
  const signOut=()=>{
    localStorage.removeItem("token");
    setUser(false);
    toast.success("sign out Successfully");
    
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white shadow-sm px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img src="/top.png" alt="logo" className="h-8 w-8 object-cover" />
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          </div>
          <button className="text-blue-600 font-medium hover:underline hover:cursor-pointer" onClick={()=>signOut()}>Sign Out</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-screen-md mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Profile Section */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome, {profileName}</h2>
          <p className="text-gray-600 text-sm break-words mt-1">Email: {profileEmail}</p>
        </section>

        {/* Create Note Button */}
        <div className="flex justify-end">
          <button
            onClick={() => setShowPopup(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 hover:cursor-pointer transition"
          >
            + Add Note
          </button>
        </div>

        {/* Notes Section */}
        <section>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Your Notes</h3>
          <div className="space-y-3">
            {notes && notes.length > 0 ? (
              notes.map((note) => (
                <div
                  key={note._id}
                  className="flex justify-between items-start bg-white p-4 rounded-lg shadow border border-gray-200"
                >
                  <span className="text-gray-800 break-words">{note.content}</span>
                  <button
                    className="text-red-500 hover:text-red-700 ml-4 hover:cursor-pointer"
                    onClick={() => deleteNoteById(note._id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center bg-white p-4 rounded-lg shadow text-gray-500">
                No Notes Yet. Start by creating one!
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Popup Modal */}
     {showPopup && (
  <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Add a New Note</h3>
      <textarea
        className="w-full border border-gray-300 p-3 rounded mb-4 resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
        rows="4"
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        placeholder="Write your note here..."
      />
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setShowPopup(false)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 hover:cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleAddNote}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hover:cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Dashboard;
