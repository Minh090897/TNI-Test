# Person Detection System

A full-stack application that detects and counts people in images using computer vision. The system consists of a FastAPI backend for image processing and a Next.js frontend for user interaction.

## Features

- Upload images through a web interface
- Real-time person detection and counting
- Visualization of detection results
- Database storage of detection history
- RESTful API endpoints

## Tech Stack

### Backend
- FastAPI (Python web framework)
- InsightFace (Person detection)
- PostgreSQL (Database)
- YAML (Configuration)

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS

## How to run
1. Clone the repository
2. Run `docker compose up`
3. Open `http://localhost:3000` in your browser

## How to use
1. Upload an image
2. Click "Detect"
3. See the result