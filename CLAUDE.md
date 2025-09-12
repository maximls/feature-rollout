# Feature Launch Visualization Tool

## Project Overview
A web-based data visualization tool that displays an interactive world map, dynamically coloring countries based on launch status data from JSON configuration. Countries with `launched: true` are colored green, while others remain in default coloring.

## Key Requirements
- Interactive world map with country boundaries
- JSON-driven country coloring (green for launched countries)
- **Exclude US-sanctioned countries**: Iran, North Korea, Syria, Cuba, Venezuela, Belarus, Myanmar, Russia
- Pan and zoom functionality
- Real-time data updates without page refresh
- Load time under 3 seconds
- Support for 190+ countries (excluding sanctioned countries)
- Responsive design for desktop and tablet

## Technology Stack Recommendations
- **Mapping Library**: D3.js with TopoJSON for world map data
- **Alternative**: Leaflet with custom country boundaries
- **Data Format**: JSON with country codes (ISO 2-letter codes)
- **Styling**: CSS with responsive design
- **Performance**: Optimized SVG rendering

## Project Structure
```
/
├── index.html           # Main application entry point
├── styles/
│   └── main.css        # Styles and responsive design
├── scripts/
│   ├── main.js         # Application logic and map initialization
│   ├── data-loader.js  # JSON data loading and processing
│   └── map-renderer.js # Map rendering and country coloring
├── data/
│   ├── world.json      # World map TopoJSON data
│   ├── launch-status.json # Sample launch status data
│   └── sanctioned-countries.json # US-sanctioned countries list
└── assets/
    └── favicon.ico
```

## Sample Data Format
```json
{
  "countries": {
    "US": { "launched": true },
    "CA": { "launched": true },
    "GB": { "launched": true },
    "DE": { "launched": false },
    "FR": { "launched": false }
  }
}
```

## Development Commands
```bash
# Start local development server
python3 -m http.server 8000
# or
npx serve .

# Run tests (if implemented)
npm test

# Build for production (if build process added)
npm run build

# Lint code (if linting added)
npm run lint
```

## Implementation Steps
1. Set up basic HTML structure with map container
2. Include D3.js and load world map TopoJSON data
3. **Load and filter US-sanctioned countries list**
4. Implement country boundary rendering (excluding sanctioned countries)
5. Add JSON data loading functionality
6. Implement country coloring logic based on launch status
7. Add pan/zoom controls and interactions
8. Style with CSS for clean, minimal interface
9. Add legend and loading states
10. Implement responsive design
11. Optimize performance for filtered country set

## Sanctioned Countries Handling
**Excluded Countries (ISO codes):**
- IR (Iran)
- KP (North Korea) 
- SY (Syria)
- CU (Cuba)
- VE (Venezuela)
- BY (Belarus)
- MM (Myanmar)
- RU (Russia)

These countries will be:
- Filtered out from data processing
- Not rendered on the map
- Excluded from launch status calculations
- Hidden from user interface

## Performance Targets
- Initial load: < 3 seconds
- Smooth pan/zoom interactions
- Efficient rendering for all countries
- Real-time data updates

## Browser Support
- Chrome 90+
- Firefox 88+ 
- Safari 14+
- Progressive enhancement for older browsers

## Future Enhancements
- Additional data properties beyond launch status
- Multiple color schemes
- Export functionality
- External API integration