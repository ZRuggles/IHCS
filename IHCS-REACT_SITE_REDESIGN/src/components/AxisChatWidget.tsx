import { useEffect } from "react";

declare global {
  interface Window {
    AxisAIConfig?: {
      apiKey: string;
      apiUrl: string;
      theme: "light" | "dark";
      position: "bottom-right" | "bottom-left" | "custom";
      width: string;
      height: string;
      loadPersonaInfo: boolean;
    };
  }
}

const apiKey = import.meta.env.VITE_AXISAI_API_KEY;
const apiUrl = import.meta.env.VITE_AXISAI_API_URL ?? "https://axisai-backend.onrender.com/api";
const widgetScriptUrl =
  import.meta.env.VITE_AXISAI_WIDGET_URL ?? "https://axisai-backend.onrender.com/widget.js";

function AxisChatWidget() {
  useEffect(() => {
    if (!apiKey) {
      return;
    }

    window.AxisAIConfig = {
      apiKey,
      apiUrl,
      theme: "light",
      position: "bottom-right",
      width: "400px",
      height: "600px",
      loadPersonaInfo: true,
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${widgetScriptUrl}"]`,
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = widgetScriptUrl;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  if (!apiKey) {
    return null;
  }

  return <div id="axis-chat-widget" />;
}

export default AxisChatWidget;
