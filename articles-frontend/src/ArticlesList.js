import React, { useEffect, useState } from "react";
import { API_BASE } from "./config";

export default function ArticlesList({ onSelect = () => {} }) {

  const getImageKeyword = (title) => {
    const t = title.toLowerCase();
    if (t.includes("chatbots magic")) return "chatbot,ai,robot,technology";
    if (t.includes("small business")) return "small business,store,startup";
    if (t.includes("lead generation")) return "marketing,analytics,growth";
    if (t.includes("virtual assistant")) return "remote work,laptop,assistant";
    if (t.includes("customer interaction")) return "customer support,chat";
    return "technology,ai";
  };

  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(API_BASE)
      .then(res => res.json())
      .then(setArticles)
      .catch(err => console.log("API error =", err));
  }, []);

  const originals = articles.filter(a => !a.isUpdatedVersion);

  return (
    <div style={{ padding: "40px 60px", background: "#020617", minHeight: "100vh" }}>

      <h1 style={{ color: "white", marginBottom: 25 }}>
        📚 <span style={{ color:"#38bdf8" }}>BeyondChats Articles</span>
      </h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 30
      }}>

        {originals.map(a => (
          <div key={a._id}
            style={{
              background: "#030712",
              borderRadius: 16,
              padding: 12,
              border: "1px solid #1f2937"
            }}
          >
            <img
              src={`https://source.unsplash.com/600x400/?${getImageKeyword(a.title)}`}
              alt={a.title}
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: 12
              }}
              onError={e =>
                e.target.src = "https://picsum.photos/600/400?random=" + a._id
              }
            />

            <h3 style={{ color: "#fff", marginTop: 12, minHeight: 50 }}>
              {a.title.replace(" (Updated Version)", "")}
            </h3>

        

            <button
  onClick={() => onSelect(a._id)}
  style={{
                marginTop: 10,
                padding: "8px 14px",
                borderRadius: 8,
                background: "#22c55e",
                border: "none",
                cursor: "pointer",
                fontWeight: 600
              }}>Read Article →</button>


          </div>
        ))}
      </div>
    </div>
  );
}