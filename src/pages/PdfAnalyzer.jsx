import React, { useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import workerSrc from "../pdf-worker";
import "../styles/PdfAnalyzer.css";

GlobalWorkerOptions.workerSrc = workerSrc;

const PdfAnalyzer = () => {
  const [pdfText, setPdfText] = useState("");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [answerLoading, setAnswerLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    setLoading(true);
    setPdfText("");
    setChatHistory([]);

    try {
      const reader = new FileReader();
      reader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const loadingTask = getDocument(typedArray);
        const pdf = await loadingTask.promise;

        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item) => item.str).join(" ");
          fullText += `${strings} `;
        }

        setPdfText(fullText);
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("Error reading PDF:", err);
      alert("Failed to read PDF.");
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || !pdfText.trim()) return;

    const userMessage = { role: "user", content: question };
    const newChat = [...chatHistory, userMessage];
    setChatHistory(newChat);
    setAnswerLoading(true);
    setQuestion("");

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: import.meta.env.VITE_GROK_API,
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that answers questions based only on the provided PDF content.",
            },
            { role: "user", content: `PDF Content: ${pdfText.slice(0, 8000)}` },
            ...newChat,
          ],
        }),
      });

      const data = await res.json();
      const aiContent = data.choices?.[0]?.message?.content || "No response.";
      const aiMessage = { role: "assistant", content: aiContent };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Failed to get AI response:", err);
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    }

    setAnswerLoading(false);
  };

  return (
    <div className="pdf-analyzer-container">
      <h2>📄 PDF Analyzer + Q&A</h2>
      <p className="disclaimer">⚠️ We do not store your files or questions. Everything is processed temporarily.</p>

      <input type="file" accept="application/pdf" onChange={handleFileChange} />

      {loading && <p>Loading PDF content...</p>}

      {!loading && pdfText && (
        <>
          <div className="chat-box">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`message ${msg.role}`}>
                <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about the PDF..."
            />
            <button onClick={handleAskQuestion} disabled={answerLoading}>
              {answerLoading ? "Thinking..." : "Ask"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PdfAnalyzer;
