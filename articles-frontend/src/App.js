import React, { useEffect, useState } from "react";

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/articles")
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const original = articles.filter(a => !a.title.includes("Updated Version"));
  const updated = articles.filter(a => a.title.includes("Updated Version"));

  if (loading) return <h2 style={{ textAlign:"center", marginTop:"40px" }}>Loading...</h2>;

  return (
    <div style={{
      maxWidth:"900px",
      margin:"20px auto",
      padding:"20px",
      fontFamily:"Arial"
    }}>

      <h1 style={{ textAlign:"center", marginBottom:"20px" }}>
        📰 BeyondChats Articles
      </h1>

      {/* ORIGINAL ARTICLES */}
      <h2 style={{ marginTop:"10px" }}>📌 Original Articles</h2>
      <hr />

      {original.map(a => (
        <div
          key={a._id}
          style={{
            marginTop:"14px",
            padding:"14px",
            borderRadius:"10px",
            border:"1px solid #ddd",
            background:"#ffffff",
            boxShadow:"0 2px 8px rgba(0,0,0,0.05)"
          }}
        >
          <h3>{a.title}</h3>

          {a.link && (
            <p>
              <a href={a.link} target="_blank" rel="noreferrer">
                Read Original Article 🔗
              </a>
            </p>
          )}
        </div>
      ))}

      {/* UPDATED ARTICLES */}
      <h2 style={{ marginTop:"25px" }}>✨ AI Updated Versions</h2>
      <hr />

      {updated.map(a => (
        <div
          key={a._id}
          style={{
            marginTop:"14px",
            padding:"14px",
            borderRadius:"10px",
            border:"1px solid #b8c7ff",
            background:"#f2f5ff",
            boxShadow:"0 2px 10px rgba(0,0,0,0.05)"
          }}
        >
          <h3>{a.title}</h3>

          <span style={{
            padding:"4px 8px",
            background:"#dde6ff",
            color:"#0033aa",
            borderRadius:"6px",
            fontSize:"12px"
          }}>
            Updated Article
          </span>
        </div>
      ))}

    </div>
  );
}

export default App;