// src/pages/ManualNote.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "../styles/ManualNote.css"; // you can reuse or make your own styles

const ManualNote = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!topic.trim() || !content.trim()) {
      alert("Please fill in both topic and content.");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "notes"), {
        uid: user.uid,            // so it shows up in dashboard
        topic: topic.trim(),
        content: content.trim(),
        type: "manual",           // optional, but useful for filtering
        createdAt: serverTimestamp(),
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-note-container">
      <h2>Create Manual Note ✏️</h2>
      <input
        type="text"
        placeholder="Enter topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="note-input"
      />
      <textarea
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="note-textarea"
        rows={8}
      />
      <div className="buttons">
        <button onClick={() => navigate("/dashboard")} className="cancel-button">
          Cancel
        </button>
        <button onClick={handleSave} disabled={loading} className="save-button">
          {loading ? "Saving..." : "Save Note"}
        </button>
      </div>
    </div>
  );
};

export default ManualNote;
