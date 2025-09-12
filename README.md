# MyAlpha Feature Launch Visualization

A world map visualization tool that displays MyAlpha feature rollout status across countries and regions with interactive tooltips and progress tracking.

## Overview

This tool provides a visual representation of feature launches across MyAlpha countries, with support for:
- Individual country launch tracking
- Regional groupings (LATAM, AFRICA, EUROPE, AAP, MENA)
- MyAlpha ID mapping and display
- Progress tracking with percentage completion
- Feature descriptions and details

## Adding a New Feature

### Step 1: Create Feature JSON File

Create a new JSON file in `data/features/` directory with the following structure:

```json
{
  "name": "Your Feature Name",
  "description": "Detailed description of what this feature does and its benefits.",
  "countries": {
    "US": { "launched": true },
    "CA": { "launched": false },
    "GB": { "launched": true },
    "LATAM": { "launched": true },
    "AFRICA": { "launched": false },
    "EUROPE": { "launched": true },
    "AAP": { "launched": false },
    "MENA": { "launched": false }
  }
}
```

### Step 2: Add Feature to Index

Add your new feature file to `data/features/index.json`:

```json
{
  "features": [
    "Cinderella.json",
    "Madagascar.json",
    "your-new-feature.json"
  ]
}
```

### Step 3: Countries and Regions

You can use either:

**Individual Countries**: Use 2-letter ISO codes
- `"US": { "launched": true }`
- `"FR": { "launched": false }`

**Regional Groups**: Use regional identifiers
- `"LATAM": { "launched": true }` - Covers 46 Latin American countries
- `"AFRICA": { "launched": false }` - Covers 49 African countries
- `"EUROPE": { "launched": true }` - Covers 24 European countries
- `"AAP": { "launched": false }` - Covers 5 Asia-Pacific countries
- `"MENA": { "launched": true }` - Covers 15 Middle East & North Africa countries

**Note**: Individual country settings override regional settings.

## Marking Features as Launched

### For Individual Countries

Update the country's launch status in your feature JSON file:

```json
{
  "countries": {
    "US": { "launched": true },    // Launched
    "CA": { "launched": false }    // Not launched
  }
}
```

### For Regional Groups

Update the regional launch status:

```json
{
  "countries": {
    "LATAM": { "launched": true },   // All LATAM countries launched
    "AFRICA": { "launched": false }  // All AFRICA countries not launched
  }
}
```

### Mixed Approach (Individual + Regional)

You can combine both approaches. Individual settings take precedence:

```json
{
  "countries": {
    "LATAM": { "launched": false },  // All LATAM countries not launched
    "BR": { "launched": true },      // Except Brazil is launched
    "MX": { "launched": true }       // And Mexico is launched
  }
}
```

## MyAlpha Countries

MyAlpha countries are displayed in **red** when not launched and **green** when launched. Non-MyAlpha countries appear in **gray**.

### Regional Groups Breakdown

- **LATAM (ID: 31)**: 46 countries including Argentina, Brazil, Chile, Colombia, Mexico, Peru, etc.
- **AFRICA (ID: 58)**: 49 countries including South Africa, Nigeria, Kenya, Ghana, Egypt, etc.
- **EUROPE (ID: 64)**: 24 countries including Albania, Bulgaria, Croatia, Estonia, Greece, etc.
- **AAP (ID: 66)**: 5 countries - Bangladesh, Bhutan, Laos, Nepal, Papua New Guinea
- **MENA (ID: 73)**: 15 countries including Algeria, Armenia, Bahrain, Egypt, Iraq, Morocco, etc.

Individual MyAlpha countries have unique IDs (see `data/myalpha-ids.json` for complete mapping).

## File Structure

```
data/
├── features/
│   ├── index.json           # List of active feature files
│   ├── Cinderella.json      # Example feature
│   ├── Madagascar.json      # Example feature
│   └── your-feature.json    # Your new feature
├── MyAlpha-countries.json   # List of all MyAlpha countries
├── myalpha-ids.json        # ID mapping for countries and regions
├── regional-mappings.json   # Regional country groupings
└── world.json              # World map data
```

## Deployment

### GitHub Pages

This project is ready to deploy on GitHub Pages:

1. **Push to GitHub**: Upload your project to a GitHub repository
2. **Enable Pages**: Go to repository Settings → Pages
3. **Configure Source**: Select "Deploy from a branch" and choose "main" branch
4. **Access Site**: Your site will be available at `https://username.github.io/repository-name`

The project includes:
- `.nojekyll` file to bypass Jekyll processing
- `_config.yml` with GitHub Pages configuration
- All relative paths for proper hosting

### Local Development

Run a local HTTP server to test before deployment:

```bash
python3 -m http.server 8080
# or
python -m http.server 8080
# or using Node.js
npx serve .
```

Then open `http://localhost:8080` in your browser.

### Deployment Checklist

Before deploying to GitHub Pages:

- [ ] Test locally with `python3 -m http.server 8080`
- [ ] Ensure all feature JSON files are valid and in `data/features/index.json`
- [ ] Verify MyAlpha countries and regional mappings are up to date
- [ ] Update version numbers in `index.html` if code was modified
- [ ] Test feature switching and map interactions
- [ ] Confirm all tooltips show correct MyAlpha IDs

### Cache Busting

The application uses versioned JavaScript and CSS files. If you make changes to the code, update the version numbers in `index.html`:

```html
<script src="scripts/data-loader.js?v=34"></script>
<script src="scripts/map-renderer.js?v=33"></script>
<script src="scripts/main.js?v=14"></script>
```

## Features

- **Interactive World Map**: Click and hover over countries for details
- **Feature Selector**: Dropdown to switch between different features
- **Progress Tracking**: Visual progress bar showing MyAlpha rollout percentage
- **Feature Descriptions**: Detailed descriptions displayed for each feature
- **Tooltips**: Show country names, codes, MyAlpha IDs, and launch status
- **Responsive Design**: Works on desktop and mobile devices
- **Regional Controls**: Manage large groups of countries with single settings

## Troubleshooting

### Feature Not Appearing
- Ensure the JSON file is valid and properly formatted.
- Check that the filename is added to `data/features/index.json`
- Verify the JSON follows the required schema (name and countries are required)

### Countries Not Coloring
- Confirm country codes match the name mappings in JavaScript files
- Check that countries are listed in `MyAlpha-countries.json`
- Verify regional mappings in `regional-mappings.json`

### Cache Issues
- Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)
- Update version numbers in `index.html` if you modified code files