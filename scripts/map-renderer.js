class MapRenderer {
    constructor(dataLoader) {
        this.dataLoader = dataLoader;
        this.svg = null;
        this.g = null;
        this.projection = null;
        this.path = null;
        this.zoom = null;
        this.width = 0;
        this.height = 0;
    }

    initialize() {
        const container = document.getElementById('map-container');
        this.width = container.clientWidth;
        this.height = container.clientHeight;

        this.svg = d3.select('#world-map')
            .attr('width', this.width)
            .attr('height', this.height);

        this.projection = d3.geoNaturalEarth1()
            .scale(this.width / 6.5)
            .translate([this.width / 2, this.height / 2]);

        this.path = d3.geoPath().projection(this.projection);

        this.g = this.svg.append('g');

        this.setupZoom();
    }

    setupZoom() {
        this.zoom = d3.zoom()
            .scaleExtent([0.5, 8])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });

        this.svg.call(this.zoom);
    }

    renderMap(worldData) {
        const countries = worldData.features || [];

        this.g.selectAll('.country')
            .data(countries)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', this.path)
            .style('fill', (d) => this.getCountryColor(d))
            .on('mouseover', (event, d) => this.handleMouseOver(event, d))
            .on('mouseout', (event, d) => this.handleMouseOut(event, d));

        this.addTooltip();
    }


    getCountryId(country) {
        const name = country.properties?.name;
        if (!name) return null;
        
        // Map country names to ISO codes
        const nameToISO = {
            "USA": "US",
            "Canada": "CA", 
            "England": "GB",
            "Germany": "DE",
            "France": "FR",
            "Australia": "AU",
            "Japan": "JP",
            "Italy": "IT",
            "Spain": "ES",
            "Netherlands": "NL",
            "Sweden": "SE",
            "Norway": "NO",
            "Denmark": "DK",
            "Finland": "FI",
            "Switzerland": "CH",
            "Austria": "AT",
            "Belgium": "BE",
            "Ireland": "IE",
            "Portugal": "PT",
            "Greece": "GR",
            "Poland": "PL",
            "Czech Republic": "CZ",
            "Hungary": "HU",
            "Slovakia": "SK",
            "Slovenia": "SI",
            "Estonia": "EE",
            "Latvia": "LV",
            "Lithuania": "LT",
            "Bulgaria": "BG",
            "Romania": "RO",
            "Croatia": "HR",
            "New Zealand": "NZ",
            "Singapore": "SG",
            "South Korea": "KR",
            "Taiwan": "TW",
            "Hong Kong": "HK",
            "India": "IN",
            "Brazil": "BR",
            "Mexico": "MX",
            "Argentina": "AR",
            "Chile": "CL",
            "Colombia": "CO",
            "Peru": "PE",
            "Uruguay": "UY",
            "South Africa": "ZA",
            "Egypt": "EG",
            "Morocco": "MA",
            "Nigeria": "NG",
            "Kenya": "KE",
            "Ghana": "GH",
            "Thailand": "TH",
            "Vietnam": "VN",
            "Malaysia": "MY",
            "Philippines": "PH",
            "Indonesia": "ID",
            "Turkey": "TR",
            "Saudi Arabia": "SA",
            "United Arab Emirates": "AE",
            "Israel": "IL",
            "Jordan": "JO",
            "Lebanon": "LB",
            "Kuwait": "KW",
            "Qatar": "QA",
            "Bahrain": "BH",
            "Oman": "OM",
            "Iran": "IR",
            "North Korea": "KP",
            "Syria": "SY",
            "Cuba": "CU",
            "Venezuela": "VE",
            "Belarus": "BY",
            "Myanmar": "MM",
            "Russia": "RU",
            "Costa Rica": "CR",
            "Guatemala": "GT",
            "Honduras": "HN",
            "Nicaragua": "NI",
            "Panama": "PA",
            "El Salvador": "SV",
            "Belize": "BZ",
            "Bolivia": "BO",
            "Ecuador": "EC",
            "Paraguay": "PY",
            "Dominican Republic": "DO",
            "Jamaica": "JM",
            "Haiti": "HT",
            "Trinidad and Tobago": "TT",
            "Bahamas": "BS",
            "Barbados": "BB",
            "Guyana": "GY",
            "Suriname": "SR",
            "French Guiana": "GF",
            "Antigua and Barbuda": "AG",
            "Saint Lucia": "LC",
            "Grenada": "GD",
            "Saint Vincent and the Grenadines": "VC",
            "Saint Kitts and Nevis": "KN",
            "Dominica": "DM",
            "Aruba": "AW",
            "Curacao": "CW",
            "Puerto Rico": "PR",
            "U.S. Virgin Islands": "VI",
            "British Virgin Islands": "VG",
            "Mongolia": "MN", "Ukraine": "UA", "Cambodia": "KH", "Pakistan": "PK", "Sri Lanka": "LK",
            "Albania": "AL", "Andorra": "AD", "Azerbaijan": "AZ", "Bosnia and Herzegovina": "BA",
            "Bulgaria": "BG", "Croatia": "HR", "Czech Republic": "CZ", "Georgia": "GE",
            "Greece": "GR", "Iceland": "IS", "Kazakhstan": "KZ", "Kosovo": "XK", "Kyrgyzstan": "KG",
            "Lithuania": "LT", "Luxembourg": "LU", "Malta": "MT", "Moldova": "MD",
            "Montenegro": "ME", "Serbia": "RS", "Republic of Serbia": "RS", "Slovakia": "SK", "Slovenia": "SI",
            "North Macedonia": "MK", "Macedonia": "MK", "Estonia": "EE",
            "Bangladesh": "BD", "Bhutan": "BT", "Laos": "LA", "Nepal": "NP", "Papua New Guinea": "PG",
            "Algeria": "DZ", "Armenia": "AM", "Bahrain": "BH", "Egypt": "EG", "Iraq": "IQ",
            "Jordan": "JO", "Lebanon": "LB", "Libya": "LY", "Oman": "OM", "Saudi Arabia": "SA",
            "Sudan": "SD", "Tunisia": "TN", "United Arab Emirates": "AE", "Yemen": "YE",
            "Lesotho": "LS", "Eswatini": "SZ", "Botswana": "BW", "Namibia": "NA", "South Africa": "ZA",
            "Angola": "AO", "Cameroon": "CM", "Equatorial Guinea": "GQ", "Gabon": "GA", "Congo": "CG", "Republic of the Congo": "CG",
            "Chad": "TD", "Central African Republic": "CF", "Democratic Republic of the Congo": "CD",
            "Sao Tome and Principe": "ST", "Burundi": "BI", "Eritrea": "ER", "Madagascar": "MG",
            "Reunion": "RE", "Somalia": "SO", "Comoros": "KM", "Ethiopia": "ET", "Rwanda": "RW",
            "Djibouti": "DJ", "Kenya": "KE", "Mayotte": "YT", "Seychelles": "SC", "Uganda": "UG",
            "Mozambique": "MZ", "Zambia": "ZM", "Malawi": "MW", "Tanzania": "TZ", "United Republic of Tanzania": "TZ", "Zimbabwe": "ZW",
            "Benin": "BJ", "Liberia": "LR", "Saint Helena": "SH", "Burkina Faso": "BF", "Gambia": "GM",
            "Mali": "ML", "Ghana": "GH", "Mauritania": "MR", "Senegal": "SN", "Cape Verde": "CV",
            "Cote d'Ivoire": "CI", "Guinea": "GN", "Niger": "NE", "Sierra Leone": "SL",
            "Guinea-Bissau": "GW", "Nigeria": "NG", "Togo": "TG"
        };
        
        return nameToISO[name] || null;
    }

    getCountryColor(country) {
        const countryId = this.getCountryId(country);
        const launched = this.dataLoader.getLaunchStatus(countryId);
        const isMyAlpha = this.dataLoader.isMyAlphaCountry(countryId);
        
        // Color logic:
        // 1. If MyAlpha country and launched: green
        // 2. If MyAlpha country and not launched: pink  
        // 3. If regular country and launched: green
        // 4. If regular country and not launched: gray
        
        if (isMyAlpha) {
            return launched ? '#16A34A' : '#DC2626'; // Green if launched, red if not
        } else {
            return launched ? '#16A34A' : '#D1D5DB'; // Green if launched, gray if not
        }
    }

    addTooltip() {
        this.tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('padding', '10px')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', 'white')
            .style('border-radius', '5px')
            .style('pointer-events', 'none')
            .style('opacity', 0)
            .style('font-size', '12px')
            .style('z-index', '1000');
    }

    handleMouseOver(event, d) {
        const countryId = this.getCountryId(d);
        const countryName = d.properties?.name || 'Unknown Country';
        const countryDisplay = countryId ? `${countryName} - ${countryId}` : countryName;
        const launched = this.dataLoader.getLaunchStatus(countryId);
        const featureName = this.dataLoader.featureName;
        const isMyAlpha = this.dataLoader.isMyAlphaCountry(countryId);
        const myAlphaId = this.dataLoader.getMyAlphaId(countryId);
        
        let tooltipContent;
        if (!featureName || featureName === '') {
            // Default state - no feature selected
            if (isMyAlpha && myAlphaId) {
                tooltipContent = `<strong>${countryDisplay}</strong><br/><em>MyAlpha Country (ID: ${myAlphaId})</em><br/><em>Select a feature to view launch status</em>`;
            } else if (isMyAlpha) {
                tooltipContent = `<strong>${countryDisplay}</strong><br/><em>MyAlpha Country</em><br/><em>Select a feature to view launch status</em>`;
            } else {
                tooltipContent = `<strong>${countryDisplay}</strong><br/><em>Select a feature to view launch status</em>`;
            }
        } else {
            const status = launched ? 'Launched' : 'Not Launched';
            if (isMyAlpha && myAlphaId) {
                tooltipContent = `<strong>${countryDisplay}</strong><br/><em>MyAlpha Country (ID: ${myAlphaId})</em><br/>${featureName}: ${status}`;
            } else if (isMyAlpha) {
                tooltipContent = `<strong>${countryDisplay}</strong><br/><em>MyAlpha Country</em><br/>${featureName}: ${status}`;
            } else {
                tooltipContent = `<strong>${countryDisplay}</strong><br/>${featureName}: ${status}`;
            }
        }

        this.tooltip
            .style('opacity', 1)
            .html(tooltipContent)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');

        d3.select(event.currentTarget)
            .style('stroke', '#333')
            .style('stroke-width', '2px');
    }

    handleMouseOut(event, d) {
        this.tooltip.style('opacity', 0);

        d3.select(event.currentTarget)
            .style('stroke', '#fff')
            .style('stroke-width', '0.5px');
    }

    resize() {
        const container = document.getElementById('map-container');
        this.width = container.clientWidth;
        this.height = container.clientHeight;

        this.svg
            .attr('width', this.width)
            .attr('height', this.height);

        this.projection
            .scale(this.width / 6.5)
            .translate([this.width / 2, this.height / 2]);

        this.g.selectAll('.country')
            .attr('d', this.path);
    }

    updateData(newLaunchStatus) {
        this.dataLoader.launchStatus = newLaunchStatus;
        
        this.g.selectAll('.country')
            .transition()
            .duration(300)
            .style('fill', (d) => this.getCountryColor(d));
    }
}