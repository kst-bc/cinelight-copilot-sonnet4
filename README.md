# CineLight - Movie Search Application

A lightweight, mobile-first web application for searching movies using the OMDb API. Features a dark cinema-inspired theme and responsive design that works perfectly on phones, tablets, and desktop screens.

## Features

- **Search Movies**: Search for movies by title with real-time results
- **Movie Details**: View comprehensive information including cast, crew, ratings, and plot
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark Theme**: Cinema-inspired dark theme for optimal viewing experience
- **Pagination**: Navigate through large result sets with intelligent pagination
- **Single Page Application**: Smooth navigation without page reloads

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: OMDb API (Open Movie Database)
- **Design**: Mobile-first responsive design
- **Fonts**: DM Sans from Google Fonts

## Setup Instructions

1. **Clone or Download** the project files to your local machine
2. **Open in Browser**: Simply double-click `index.html` or open it directly in your web browser

## Project Structure

```
cinelight-copilot-sonnet4/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.ts           # TypeScript source (main development file)
├── dist/
│   └── script.js       # Compiled JavaScript (auto-generated)
├── tsconfig.json       # TypeScript configuration
├── build.sh            # Build script
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## Usage

1. **Start Page**: Enter a movie title in the search box and click the search button or press Enter
2. **Results Page**: Browse through movie results displayed as a grid of posters and titles
3. **Movie Details**: Click on any movie to view detailed information including ratings, cast, and plot
4. **Navigation**: Use the header logo to return to the start page, or the back button to return to results

## Design Features

### Color Scheme

- **Background**: #151419 (Dark cinema black)
- **Text**: #dcdcdd (Light gray)
- **Primary**: #ffc007 (Golden yellow)
- **Secondary**: #fe0100 (Cinema red)

### Responsive Breakpoints

- **Mobile**: 1 column layout (< 480px)
- **Small Tablet**: 2 columns (480px - 767px)
- **Tablet**: 3 columns (768px - 1199px)
- **Desktop**: 4 columns (≥ 1200px)

## API Information

This application uses the OMDb API with the key `507fedbe`. The API provides:

- Movie search by title
- Detailed movie information
- Ratings from multiple sources (IMDb, Rotten Tomatoes, Metacritic)
- Movie posters and metadata

## Browser Compatibility

- Modern browsers with ES6+ support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

This project uses TypeScript for development with automatic compilation to JavaScript.

### Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd cinelight-copilot-sonnet4
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Building

#### Option 1: Using npm scripts (recommended)

```bash
# Build once
npm run build

# Build and watch for changes
npm run dev

# Clean build directory
npm run clean
```

#### Option 2: Using build script

```bash
./build.sh
```

#### Option 3: Manual compilation

```bash
npx tsc
```

The compiled JavaScript will be written to `dist/script.js`.

### Deployment

For deployment platforms like Netlify, Vercel, or similar:

1. **Build command**: `npm run build`
2. **Publish directory**: `.` (root directory)
3. **Node.js version**: 18 or higher

The project includes a `netlify.toml` configuration file for easy Netlify deployment.

### Project Structure with Build System

```
cinelight-copilot-sonnet4/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.ts           # TypeScript source (main development file)
├── package.json        # Node.js dependencies and scripts
├── netlify.toml        # Netlify deployment configuration
├── dist/
│   └── script.js       # Compiled JavaScript (auto-generated)
├── tsconfig.json       # TypeScript configuration
├── build.sh            # Build script
└── README.md           # This file
```

**Note:** Always edit `script.ts` and then compile to `dist/script.js`. The JavaScript file is auto-generated and should not be edited directly.

## License

This project is open source and available under the MIT License.
