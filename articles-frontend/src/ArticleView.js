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
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
      }}
    >
      <div
        style={{
          width: "90%",
          height: "90%",
          background: "#030712",
          padding: 20,
          borderRadius: 12,
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            alignSelf: "flex-end",
            background: "#ef4444",
            color: "white",
            padding: "6px 12px",
            border: 0,
            borderRadius: 6,
            cursor: "pointer"
          }}
        >
          ❌ Close
        </button>

        {/* Title */}
        <h2 style={{ color: "white", marginBottom: 12 }}>
          {data.title}
        </h2>

        {/* CONTENT GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            flex: 1,
            overflow: "hidden"
          }}
        >
{/* LEFT: Original Article */}
<div
  style={{
    border: "1px solid #374151",
    borderRadius: 8,
    padding: 20,
    color: "#e5e7eb",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }}
>
  <h3>Original Article</h3>

  <p style={{ opacity: 0.8, textAlign: "center" }}>
    This article cannot be displayed here due to website restrictions.
  </p>

  <a
    href={data.link}
    target="_blank"
    rel="noreferrer"
    style={{
      marginTop: 12,
      padding: "10px 16px",
      background: "#22c55e",
      color: "#000",
      borderRadius: 6,
      textDecoration: "none",
      fontWeight: 600
    }}
  >
    Open Original Article ↗
  </a>
</div>


          {/* RIGHT: AI Enhanced Version */}
          <div
            style={{
              border: "1px solid #374151",
              borderRadius: 8,
              padding: 10,
              overflow: "auto",
              color: "#e5e7eb"
            }}
          >
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
