import React, { useState } from "react";
import ArticlesList from "./ArticlesList";
import ArticleView from "./ArticleView";

export default function App() {

  const [selectedId, setSelectedId] = useState(null);

  return (
    <>
      <ArticlesList onSelect={setSelectedId} />

      {selectedId && (
        <ArticleView
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}