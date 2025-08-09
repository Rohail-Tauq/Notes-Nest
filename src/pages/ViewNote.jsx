import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import "../styles/ViewNote.css";
import { jsPDF } from "jspdf";

const ViewNote = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTopic, setEditedTopic] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      const docRef = doc(db, "notes", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const noteData = docSnap.data();
        setNote(noteData);
        setEditedTopic(noteData.topic);
        setEditedContent(noteData.content);
      } else {
        alert("Note not found");
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "notes", id));
        alert("Note deleted successfully.");
        navigate("/dashboard");
      } catch (error) {
        console.error("Error deleting note:", error);
        alert("Failed to delete note.");
      }
    }
  };

  const handleSave = async () => {
    try {
      const noteRef = doc(db, "notes", id);
      await updateDoc(noteRef, {
        topic: editedTopic,
        content: editedContent,
      });
      setNote({ topic: editedTopic, content: editedContent });
      setEditMode(false);
      alert("Note updated successfully.");
    } catch (error) {
      console.error("Error updating note:", error);
      alert("Failed to update note.");
    }
  };

  const handleDownloadPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(note.topic, 10, 10);
  doc.setFontSize(12);
  doc.text(note.content, 10, 20);
  doc.save(`${note.topic}.pdf`);
};

  return (
    <div className="view-note-container">
      {note ? (
        <div className="note-box">
          {editMode ? (
            <>
              <input
                type="text"
                className="edit-title"
                value={editedTopic}
                onChange={(e) => setEditedTopic(e.target.value)}
              />
              <textarea
                className="edit-content"
                rows="10"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className="button-group">
                <button className="save-btn" onClick={handleSave}>
                  💾 Save
                </button>
                <button className="cancel-btn" onClick={() => setEditMode(false)}>
                  ❌ Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="note-title">{note.topic}</h2>
              <pre className="note-content">{note.content}</pre>
              <div className="button-group">
                <button className="edit-btn" onClick={() => setEditMode(true)}>
                  ✏️ Edit
                </button>
                <button className="delete-btn" onClick={handleDelete}>
                  🗑️ Delete
                </button>
                <button className="download-btn" onClick={handleDownloadPDF}>
                  Download
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="loading-text">Loading...</p>
      )}
    </div>
  );
};

export default ViewNote;
