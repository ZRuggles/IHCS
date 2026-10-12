import { StrictMode } from "react";
import { MotionConfig } from "motion/react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { ContentProvider } from "./content/ContentProvider";
import { EditorProvider } from "./editor/EditorProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      {/* ContentProvider must wrap EditorProvider: the editor refreshes
          content after sign-in, so it depends on the content context. */}
      <ContentProvider>
        <EditorProvider>
          <MotionConfig reducedMotion="user">
            <App />
          </MotionConfig>
        </EditorProvider>
      </ContentProvider>
    </BrowserRouter>
  </StrictMode>,
);
