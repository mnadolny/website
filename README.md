# Alley Website Prototype

A prototype build for exploring design and interaction ideas for the Alley website.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd website
```

2. Install dependencies:
```bash
npm install
```

## Running the Project

Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Runs the app in development mode
- `npm start` - Alias for `npm run dev`
- `npm run build` - Builds the app for production

## Project Structure

```
website/
├── src/
│   ├── components/     # React components
│   ├── App.js         # Main app component
│   ├── index.js       # Entry point
│   └── styles.css     # Global styles
├── public/            # Static assets
└── package.json       # Dependencies and scripts
```

## Components

- **ParticleBackground** - Interactive particle animation background
- **LiquidBackground** - Liquid veil effect with cursor interaction
- **AnimatedContent** - Scroll-triggered animations
- **DarkVeil** - Dark overlay effect
- **InteractiveBlob** - Interactive blob animation

## Notes

This is a prototype build for experimentation. Features and implementations may change during development.