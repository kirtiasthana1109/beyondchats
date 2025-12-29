import React, { useEffect, useState } from "react";
import { API_BASE } from "./config";

export default function ArticlesList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/articles`)
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container">
      <h2>📰 BeyondChats Articles</h2>

      <div className="grid">
        {articles.map((a) => (
          <div className="card" key={a._id}>
            <h3>{a.title}</h3>

            <p><strong>Source:</strong> {a.link}</p>

            {a.title.includes("Updated Version")
              ? <span className="badge updated">Updated Article</span>
              : <span className="badge original">Original Article</span>
            }
          </div>
        ))}
      </div>
    </div>
  );
}
