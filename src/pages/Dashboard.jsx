import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [notes, setNotes] = useState([]);

  const handleCreateNote = () => {
    navigate("/create");
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleCardClick = (id) => {
    navigate(`/note/${id}`);
  };

  useEffect(() => {
    if (!user) return;
    const fetchNotes = async () => {
      const q = query(collection(db, "notes"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedNotes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(fetchedNotes);
    };
    fetchNotes();
  }, [user]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Your Notes</h2>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <button className="create-button" onClick={handleCreateNote}>+ Create New Note</button>

      <div className="cards-container">
        {notes.map(note => (
          <div
            key={note.id}
            className="note-card"
            onClick={() => handleCardClick(note.id)}
          >
            <h3>{note.topic}</h3>
            <p>{note.content.slice(0, 100)}...</p>
            <span className="view-more">Click to view</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;