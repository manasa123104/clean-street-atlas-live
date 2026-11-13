# Clean Street Atlas

[Explore the live 3D neighborhood](https://manasa123104.github.io/clean-street-atlas-live/)

Clean Street Atlas is a field guide for public-space cleanup. Explore a miniature neighborhood and find practical next steps for litter, overflowing bins, bulky waste, and suspected hazards.

1. Drag the map to rotate and tilt it, or use the rotation and reset buttons.
2. Select a numbered hotspot to fill in an example, or enter your own short observation.
3. Choose **Get my cleanup route** to see the playbook.

This public edition runs on GitHub Pages. It uses browser-based rules and built-in playbooks. Observations stay in your browser, and the site does not file reports. The full project includes optional LLM classification and a read-only MCP tool.

## Run locally

Serve this folder with a local HTTP server. For example, run `python -m http.server 8000` and open [localhost:8000](http://localhost:8000). The site loads its JavaScript as modules over HTTP.
