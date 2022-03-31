import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import App from "../App.jsx";

const container = document.getElementById("root");

// Create a root.
const root = ReactDOMClient.createRoot(container);

// Initial render: Render an element to the root.
root.render(<App />);

// During an update, there's no need to pass the container again.
