import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import "../styles/CreateNote.css";
const CreateNote = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, userLoading] = useAuthState(auth);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!topic) return alert("Please enter a topic.");
    if (!user || userLoading) return alert("User not authenticated");

    setLoading(true);

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: import.meta.env.VITE_GEMINI_API
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant who writes clear notes on academic topics."
            },
            {
              role: "user",
              content: `Write short and clear notes on the topic: ${topic} without any emojis make a good pattern for the notes as it will be goin for the website that generate notes using grok api and dont say any introduction like Here are some short and clear notes on photosynthesis: just start from the topic `
            }
          ]
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Groq API Error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      const noteContent = data.choices[0].message.content.trim();

      // Save to Firestore
      const docRef = await addDoc(collection(db, "notes"), {
        uid: user.uid,
        topic,
        content: noteContent,
        createdAt: serverTimestamp()
      });

      // Go to note view page
      navigate(`/note/${docRef.id}`);
    } catch (err) {
      console.error("Note generation failed:", err);
      alert("Something went wrong while generating your note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

   return (
    <div className="create-note-container">
      <h2 className="create-note-title">Generate Notes</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Enter topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="note-input"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="generate-btn"
        >
          {loading ? "Generating..." : "Generate Notes"}
        </button>
      </div>
    </div>
  );
};

export default CreateNote;