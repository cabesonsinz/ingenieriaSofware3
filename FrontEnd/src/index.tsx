/* Added imports for all CSS files */
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./globals.css"
import "./styles/buttons.css"
import "./styles/forms.css"
import "./styles/cards.css"
import "./styles/layout.css"
import "./styles/navigation.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
