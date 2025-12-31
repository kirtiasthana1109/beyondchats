// import React, { useEffect, useState } from "react";
// import { API_BASE } from "./config";

// export default function ArticleView({ id, onClose }) {

//   const [article, setArticle] = useState(null);

//   useEffect(() => {
//     if (!id) return;

//     fetch(`${API_BASE}/articles/${id}`)
//       .then(res => res.json())
//       .then(setArticle)
//       .catch(err => console.log("Error loading article =", err));
//   }, [id]);

//   if (!article) return null;

//   return (
//     <div style={{
//       position: "fixed",
//       inset: 0,
//       background: "rgba(0,0,0,0.75)",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       zIndex: 999
//     }}>

//       <div style={{
//         background: "#020617",
//         padding: 20,
//         borderRadius: 14,
//         width: "70%",
//         maxHeight: "90vh",
//         overflowY: "auto",
//         color: "white"
//       }}>

//         <button
//           onClick={onClose}
//           style={{
//             float: "right",
//             background: "#ef4444",
//             border: "none",
//             padding: "6px 10px",
//             borderRadius: 6,
//             cursor: "pointer"
//           }}
//         >
//           ✖
//         </button>

//         <h2>{article.title}</h2>
//         <hr />

//         <h3>Original Article</h3>
//         <p>{article?.original?.content || "No original content available"}</p>

//         <hr />

//         <h3>AI Enhanced Version</h3>
//         {article?.updated?.content ? (
//           <p>{article.updated.content}</p>
//         ) : (
//           <p style={{ color: "yellow" }}>⚠ No AI-updated version available</p>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { API_BASE } from "./config";

export default function ArticleView({ id, onClose }) {

  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`${API_BASE}/${id}`)
      .then(res => res.json())
      .then(setData)
      .catch(err => console.log("Load article error =", err));
  }, [id]);

  if (!data) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      
      <div style={{
        width: "90%",
        height: "90%",
        background: "#030712",
        padding: 20,
        overflow: "auto",
        borderRadius: 12
      }}>

        <button
          onClick={onClose}
          style={{ float: "right", background: "#ef4444", padding: "5px 12px", border: 0 }}
        >
          ❌ Close
        </button>

        <h2 style={{ color: "white" }}>{data.title}</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Original */}
          <div style={{ color: "#e5e7eb" }}>
            <h3>Original Article</h3>

            <a href={data.link} target="_blank" rel="noreferrer">
              Open Source ↗
            </a>
          </div>

          {/* AI Enhanced */}
          <div style={{ color: "#e5e7eb" }}>
            <h3>AI Enhanced Version</h3>

            {data.updated?.content ? (
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {data.updated.content}
              </pre>
            ) : (
              <p>⚠️ No AI-updated content found</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}