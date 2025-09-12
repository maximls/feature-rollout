class DataLoader {
    constructor() {
        this.launchStatus = {};
        this.worldData = null;
        this.currentFeature = null;
        this.featureName = '';
        this.featureDescription = '';
        this.availableFeatures = [];
        this.featuresIndex = null;
        this.myAlphaCountries = [];
        this.regionalMappings = null;
        this.myAlphaIds = null;
    }

    async loadFeaturesIndex() {
        try {
            const response = await fetch('data/features/index.json');
            this.featuresIndex = await response.json();
            return this.featuresIndex;
        } catch (error) {
            console.error('Error loading features index:', error);
            return null;
        }
    }

    async discoverFeatures() {
        try {
            await this.loadFeaturesIndex();
            if (!this.featuresIndex?.features) {
                throw new Error('Invalid features index');
            }

            const features = [];
            for (const filename of this.featuresIndex.features) {
                try {
                    const response = await fetch(`data/features/${filename}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (this.validateFeatureSchema(data)) {
                            features.push({
                                id: filename.replace('.json', ''),
                                name: data.name,
                                filename: filename,
                                data: data
                            });
                        } else {
                            console.warn(`Invalid schema for ${filename}`);
                        }
                    }
                } catch (error) {
                    console.warn(`Failed to load ${filename}:`, error);
                }
            }

            this.availableFeatures = features;
            console.log(`Discovered ${features.length} valid features:`, features.map(f => f.name));
            return features;
        } catch (error) {
            console.error('Error discovering features:', error);
            return [];
        }
    }

    validateFeatureSchema(data) {
        if (!data || typeof data !== 'object') return false;
        if (!data.name || typeof data.name !== 'string') return false;
        if (!data.countries || typeof data.countries !== 'object') return false;
        
        // Validate country/regional entries
        for (const [key, countryData] of Object.entries(data.countries)) {
            // Allow either ISO country codes (2 letters) or regional keys (like "LATAM")
            const isCountryCode = /^[A-Z]{2}$/.test(key);
            const isRegionalKey = this.regionalMappings?.regions[key];
            
            if (!isCountryCode && !isRegionalKey) {
                console.warn(`Invalid key: ${key} (not a valid ISO code or regional identifier)`);
                return false;
            }
            
            if (!countryData || typeof countryData !== 'object') return false;
            if (typeof countryData.launched !== 'boolean') return false;
        }
        
        return true;
    }

    async loadFeatureData(featureId) {
        try {
            const feature = this.availableFeatures.find(f => f.id === featureId);
            if (!feature) {
                throw new Error(`Feature ${featureId} not found`);
            }

            // Expand regional entries to individual countries
            this.launchStatus = this.expandRegionalData(feature.data.countries);
            this.featureName = feature.data.name;
            this.featureDescription = feature.data.description || '';
            this.currentFeature = featureId;
            console.log(`Loaded ${feature.name} data:`, this.launchStatus);
            return this.launchStatus;
        } catch (error) {
            console.error(`Error loading ${featureId} data:`, error);
            return {};
        }
    }

    expandRegionalData(countries) {
        const expanded = {};
        
        console.log('=== EXPAND REGIONAL DATA DEBUG ===');
        console.log('Input countries:', countries);
        console.log('Regional mappings object:', this.regionalMappings);
        console.log('Available regions:', this.regionalMappings?.regions ? Object.keys(this.regionalMappings.regions) : 'No regional mappings');
        console.log('Looking for LATAM key in countries:', countries.hasOwnProperty('LATAM'));
        if (countries.LATAM) {
            console.log('LATAM value:', countries.LATAM);
        }
        
        // First pass: Process regional entries
        for (const [key, value] of Object.entries(countries)) {
            if (this.regionalMappings?.regions[key]) {
                console.log(`Processing regional entry: ${key} = `, value);
                
                // Expand the region to individual countries
                const regionCountries = this.regionalMappings.regions[key].countries;
                console.log(`Expanding ${key} to countries:`, regionCountries);
                
                regionCountries.forEach(countryCode => {
                    expanded[countryCode] = { launched: value.launched };
                    console.log(`Added ${countryCode}: launched=${value.launched}`);
                });
                
                console.log(`Finished expanding ${key} (${value.launched ? 'launched' : 'not launched'}) to ${regionCountries.length} countries`);
            }
        }
        
        // Second pass: Process individual country entries (these override regional settings)
        for (const [key, value] of Object.entries(countries)) {
            if (!this.regionalMappings?.regions[key]) {
                // Regular country entry - this will override any regional setting
                expanded[key] = value;
                console.log(`Individual country entry (overrides regional): ${key} = ${value.launched ? 'launched' : 'not launched'}`);
            }
        }
        
        console.log('Final expanded data:', expanded);
        return expanded;
    }

    async loadLaunchStatus() {
        return await this.loadFeatureData(this.currentFeature);
    }

    async loadWorldData() {
        try {
            const response = await fetch('data/world.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.worldData = await response.json();
            return this.worldData;
        } catch (error) {
            console.error('Error loading world data:', error);
            throw error;
        }
    }

    async loadMyAlphaCountries() {
        try {
            const response = await fetch('data/MyAlpha-countries.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.myAlphaCountries = data.countries || [];
            console.log('Loaded MyAlpha countries:', this.myAlphaCountries);
            return this.myAlphaCountries;
        } catch (error) {
            console.error('Error loading MyAlpha countries:', error);
            return [];
        }
    }

    async loadRegionalMappings() {
        try {
            const response = await fetch('data/regional-mappings.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.regionalMappings = await response.json();
            console.log('Loaded regional mappings:', Object.keys(this.regionalMappings.regions));
            return this.regionalMappings;
        } catch (error) {
            console.error('Error loading regional mappings:', error);
            return null;
        }
    }

    async loadMyAlphaIds() {
        try {
            const response = await fetch('data/myalpha-ids.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.myAlphaIds = await response.json();
            console.log('Loaded MyAlpha IDs');
            return this.myAlphaIds;
        } catch (error) {
            console.error('Error loading MyAlpha IDs:', error);
            return null;
        }
    }


    getLaunchStatus(countryId) {
        return this.launchStatus[countryId]?.launched || false;
    }

    isMyAlphaCountry(countryId) {
        return this.myAlphaCountries.includes(countryId);
    }

    getMyAlphaId(countryId) {
        if (!this.myAlphaIds || !countryId) return null;
        
        // Check individual countries first
        if (this.myAlphaIds.individual_countries[countryId]) {
            return this.myAlphaIds.individual_countries[countryId];
        }
        
        // Check LATAM countries
        if (this.myAlphaIds.latam_countries[countryId]) {
            return this.myAlphaIds.latam_countries[countryId];
        }
        
        // Check Africa countries
        if (this.myAlphaIds.africa_countries[countryId]) {
            return this.myAlphaIds.africa_countries[countryId];
        }
        
        // Check Europe countries
        if (this.myAlphaIds.europe_countries[countryId]) {
            return this.myAlphaIds.europe_countries[countryId];
        }
        
        // Check AAP countries
        if (this.myAlphaIds.aap_countries[countryId]) {
            return this.myAlphaIds.aap_countries[countryId];
        }
        
        // Check MENA countries
        if (this.myAlphaIds.mena_countries[countryId]) {
            return this.myAlphaIds.mena_countries[countryId];
        }
        
        return null;
    }

    getMyAlphaLaunchStats() {
        if (!this.currentFeature || this.myAlphaCountries.length === 0) {
            return {
                total: 0,
                launched: 0,
                percentage: 0
            };
        }

        let totalMyAlpha = 0;
        let launchedMyAlpha = 0;

        this.myAlphaCountries.forEach(countryId => {
            if (this.launchStatus[countryId]) {
                totalMyAlpha++;
                if (this.launchStatus[countryId].launched) {
                    launchedMyAlpha++;
                }
            }
        });

        return {
            total: totalMyAlpha,
            launched: launchedMyAlpha,
            percentage: totalMyAlpha > 0 ? Math.round((launchedMyAlpha / totalMyAlpha) * 100) : 0
        };
    }


    getCountryId(country) {
        const name = country.properties?.name;
        if (!name) return null;
        
        // Map country names to ISO codes (same mapping as in map-renderer.js)
        const nameToISO = {
            "USA": "US", "Canada": "CA", "England": "GB", "Germany": "DE", "France": "FR",
            "Australia": "AU", "Japan": "JP", "Italy": "IT", "Spain": "ES", "Netherlands": "NL", "Sweden": "SE",
            "Norway": "NO", "Denmark": "DK", "Finland": "FI", "Switzerland": "CH", "Austria": "AT", "Belgium": "BE",
            "Ireland": "IE", "Portugal": "PT", "Greece": "GR", "Poland": "PL", "Czech Republic": "CZ", "Hungary": "HU",
            "Slovakia": "SK", "Slovenia": "SI", "Estonia": "EE", "Latvia": "LV", "Lithuania": "LT", "Bulgaria": "BG",
            "Romania": "RO", "Croatia": "HR", "New Zealand": "NZ", "Singapore": "SG", "South Korea": "KR", "Taiwan": "TW",
            "Hong Kong": "HK", "India": "IN", "Brazil": "BR", "Mexico": "MX", "Argentina": "AR", "Chile": "CL",
            "Colombia": "CO", "Peru": "PE", "Uruguay": "UY", "South Africa": "ZA", "Egypt": "EG", "Morocco": "MA",
            "Nigeria": "NG", "Kenya": "KE", "Ghana": "GH", "Thailand": "TH", "Vietnam": "VN", "Malaysia": "MY",
            "Philippines": "PH", "Indonesia": "ID", "Turkey": "TR", "Saudi Arabia": "SA", "United Arab Emirates": "AE",
            "Israel": "IL", "Jordan": "JO", "Lebanon": "LB", "Kuwait": "KW", "Qatar": "QA", "Bahrain": "BH",
            "Oman": "OM", "Iran": "IR", "North Korea": "KP", "Syria": "SY", "Cuba": "CU", "Venezuela": "VE",
            "Belarus": "BY", "Myanmar": "MM", "Russia": "RU",
            "Costa Rica": "CR", "Guatemala": "GT", "Honduras": "HN", "Nicaragua": "NI", "Panama": "PA",
            "El Salvador": "SV", "Belize": "BZ", "Bolivia": "BO", "Ecuador": "EC", "Paraguay": "PY",
            "Dominican Republic": "DO", "Jamaica": "JM", "Haiti": "HT", "Trinidad and Tobago": "TT",
            "Bahamas": "BS", "Barbados": "BB", "Guyana": "GY", "Suriname": "SR", "French Guiana": "GF",
            "Antigua and Barbuda": "AG", "Saint Lucia": "LC", "Grenada": "GD", "Saint Vincent and the Grenadines": "VC",
            "Saint Kitts and Nevis": "KN", "Dominica": "DM", "Aruba": "AW", "Curacao": "CW",
            "Puerto Rico": "PR", "U.S. Virgin Islands": "VI", "British Virgin Islands": "VG",
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

    async loadAllData() {
        const loadingElement = document.getElementById('loading');
        
        try {
            loadingElement.textContent = 'Loading regional mappings...';
            await this.loadRegionalMappings();
            
            loadingElement.textContent = 'Discovering features...';
            await this.discoverFeatures();
            
            if (this.availableFeatures.length === 0) {
                throw new Error('No valid features found');
            }
            
            loadingElement.textContent = 'Loading world map data...';
            await this.loadWorldData();
            
            loadingElement.textContent = 'Loading MyAlpha countries...';
            await this.loadMyAlphaCountries();
            
            loadingElement.textContent = 'Loading MyAlpha IDs...';
            await this.loadMyAlphaIds();
            
            // Initialize with empty launch status (no feature selected)
            this.launchStatus = {};
            this.featureName = '';
            this.featureDescription = '';
            this.currentFeature = null;
            
            loadingElement.style.display = 'none';
            
            return {
                launchStatus: this.launchStatus,
                worldData: this.worldData,
                availableFeatures: this.availableFeatures,
                myAlphaCountries: this.myAlphaCountries
            };
        } catch (error) {
            console.error('Error loading data:', error);
            loadingElement.textContent = 'Error loading data. Please refresh the page.';
            throw error;
        }
    }
}