# LVGL Widget Designer

A drag-and-drop designer for creating LVGL interfaces for ESPHome projects. Drag and drop widgets onto a 320x240 canvas and generate ESPHome YAML configuration.  

### Demo
[https://lvgl.codemov.com]https://lvgl.codemov.com

## Features

- Drag-and-drop widget placement on a 320x240 canvas
- 8 different widget types (label, button, slider, checkbox, switch, image, arc, bar)
- Full property customization for each widget
- Color customization for all widgets
- Background color selection
- ESPHome YAML generation with copy-to-clipboard functionality

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Docker (optional, for containerized deployment)

### System Requirements

   - Node.js: Version 18 or later  
   - npm or yarn: Package manager  
   - Operating System: Any OS that supports Node.js (Windows, macOS, Linux)  

## Production Installation Commands

 - Create a project directory (eg. /opt/esphome-lvgl)
 - Clone this repo
```bash
 git clone https://github.com/c0deirl/ESPHome-VGL.git
```
 - Compile and Build
 ```bash 
 npm install
 npm run build
 npm run build-static
 ```
 - Static assessts should be saved to the "dist" folder. Copy those to your web server.

### Development Setup

1. Install dependencies:
```bash
npm install  
```
2. Run NPM
```bash
npm run dev  
```

 Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
  
### Docker Deployment
Build and run with Docker:
```bash    
docker run -d -p 3000:3000 mgreathouse/lvgl-esphome-designer:latest  
  ```
Or use Docker Compose:  
```bash
docker-compose up -d
  ```
Access the application at http://localhost:3000  


#### Key Dependencies Explained  

 - Next.js 14: React framework with App Router
 - React 18: UI library
 - Lucide React: Icon library
 - TypeScript: Type checking
 - Tailwind CSS: Utility-first CSS framework
 - PostCSS & Autoprefixer: CSS processing

These dependencies will be automatically installed when you run npm install in the project directory. The application is designed to work with these specific versions to ensure compatibility.




