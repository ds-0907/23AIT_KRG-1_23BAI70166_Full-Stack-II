# EcoTrack - Carbon Footprint Tracker

A simple React application for tracking and monitoring carbon footprint from daily activities.

## Features

- **Dashboard**: View total carbon footprint and activity breakdown
- **Activity Logging**: Track carbon emissions from various activities
- **Real-time Calculations**: Automatic calculation of total carbon footprint

## Tech Stack

- **Frontend**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: CSS
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd Experiment-1_EcoTrack/Program\ Code
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   └── Header.jsx
├── pages/
│   ├── Dashboard.jsx
│   └── Logs.jsx
├── data/
│   └── logs.js
├── assets/
└── App.jsx
```

## Usage

The application displays:
- Total carbon footprint in kilograms
- List of activities with their respective carbon emissions
- Activity logs for detailed tracking

## Sample Data

The app comes with sample activities:
- Car Travel: 28 KG CO₂
- Electricity Usage: 12 KG CO₂  
- Cycling: 0 KG CO₂

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request

## License

This project is private and not licensed for public use.
