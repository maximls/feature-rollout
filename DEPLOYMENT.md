# Deployment Guide

## GitHub Pages Setup

### Step 1: Create Repository
1. Create a new repository on GitHub
2. Clone it locally or upload files

### Step 2: Upload Files
Upload all project files to the repository:
```
├── index.html
├── .nojekyll
├── _config.yml
├── .gitignore
├── README.md
├── styles/
│   └── main.css
├── scripts/
│   ├── data-loader.js
│   ├── map-renderer.js
│   └── main.js
└── data/
    ├── features/
    ├── MyAlpha-countries.json
    ├── myalpha-ids.json
    ├── regional-mappings.json
    └── world.json
```

### Step 3: Configure GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select "Deploy from a branch"
5. Choose **main** branch and **/ (root)** folder
6. Click **Save**

### Step 4: Access Your Site
- Your site will be available at: `https://[username].github.io/[repository-name]`
- Initial deployment may take a few minutes
- Check the **Actions** tab to monitor deployment status

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the repository root with your domain:
   ```
   yourdomain.com
   ```

2. Configure DNS with your domain provider:
   - Add a CNAME record pointing to `[username].github.io`
   - Or A records pointing to GitHub Pages IPs:
     - 185.199.108.153
     - 185.199.109.153  
     - 185.199.110.153
     - 185.199.111.153

3. In GitHub repository settings, under Pages, enter your custom domain

## Updating the Site

To update the live site:

1. **Make Changes**: Edit files locally
2. **Test Locally**: Run `python3 -m http.server 8080` 
3. **Update Versions**: Increment version numbers in `index.html` if needed
4. **Commit & Push**: Push changes to GitHub
5. **Auto Deploy**: GitHub Pages will automatically rebuild and deploy

## Troubleshooting

### Site Not Loading
- Check that `index.html` is in the root directory
- Verify `.nojekyll` file exists to bypass Jekyll
- Check repository is public or you have GitHub Pages enabled for private repos

### JavaScript/CSS Not Loading  
- Ensure all paths are relative (no leading `/`)
- Check browser console for 404 errors
- Verify file names and paths match exactly

### Feature Data Not Loading
- Ensure JSON files are valid (use JSONLint.com to validate)
- Check that file paths in JavaScript match actual file locations
- Verify `data/features/index.json` lists all feature files correctly

### HTTPS Mixed Content
- All external resources should use HTTPS (D3.js CDN already does)
- GitHub Pages serves over HTTPS by default

## Performance Optimization

For better performance on GitHub Pages:

1. **Minimize JSON Files**: Remove unnecessary whitespace
2. **Optimize Images**: Compress any image assets  
3. **Enable Caching**: Version numbers in URLs enable proper caching
4. **Monitor Size**: Keep total repository size reasonable

## Security Considerations

- No server-side code runs on GitHub Pages (static hosting only)
- All data is publicly accessible
- Don't include sensitive information in JSON files
- MyAlpha IDs and country mappings are visible to all users