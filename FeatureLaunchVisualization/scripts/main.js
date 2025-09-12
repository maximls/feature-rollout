class FeatureLaunchVisualization {
    constructor() {
        this.dataLoader = new DataLoader();
        this.mapRenderer = new MapRenderer(this.dataLoader);
        this.isInitialized = false;
    }

    async initialize() {
        try {
            const data = await this.dataLoader.loadAllData();

            this.populateFeatureSelector(data.availableFeatures);

            this.mapRenderer.initialize();
            this.mapRenderer.renderMap(this.dataLoader.worldData);

            this.updateAlphaStats(); // Initialize alpha stats display

            this.setupEventListeners();
            this.isInitialized = true;

            console.log('Feature Launch Visualization initialized successfully');
            console.log(`Loaded ${data.availableFeatures.length} features`);

        } catch (error) {
            console.error('Failed to initialize visualization:', error);
            this.showError('Failed to load the visualization. Please refresh the page.');
        }
    }

    populateFeatureSelector(features) {
        const select = document.getElementById('feature-select');
        select.innerHTML = ''; // Clear existing options

        // Add default "Select Feature" option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a feature';
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        features.forEach(feature => {
            const option = document.createElement('option');
            option.value = feature.id;
            option.textContent = feature.name;
            select.appendChild(option);
        });
    }

    updateAlphaStats() {
        const progressLabelElement = document.getElementById('progress-feature-name');
        const progressStatsElement = document.getElementById('progress-stats');
        const progressFillElement = document.getElementById('progress-fill');
        const progressPercentageElement = document.getElementById('progress-percentage');

        // Update description section
        const descriptionCard = document.getElementById('description-card');
        const descriptionContent = document.getElementById('description-content');
        
        if (!this.dataLoader.currentFeature || !this.dataLoader.featureName) {
            progressLabelElement.textContent = 'MyAlpha Launch Progress';
            progressStatsElement.textContent = 'Select a feature to view progress';
            progressFillElement.style.width = '0%';
            progressPercentageElement.textContent = '0%';
            descriptionCard.style.display = 'none';
            return;
        }
        
        // Show description if available
        if (this.dataLoader.featureDescription) {
            descriptionContent.textContent = this.dataLoader.featureDescription;
            descriptionCard.style.display = 'block';
        } else {
            descriptionCard.style.display = 'none';
        }

        const stats = this.dataLoader.getMyAlphaLaunchStats();
        const featureName = this.dataLoader.featureName;

        if (stats.total === 0) {
            progressLabelElement.textContent = featureName;
            progressStatsElement.textContent = 'No MyAlpha countries found in data';
            progressFillElement.style.width = '0%';
            progressPercentageElement.textContent = '0%';
        } else {
            progressLabelElement.textContent = featureName;
            progressStatsElement.innerHTML = `<strong>${stats.launched}/${stats.total}</strong> MyAlpha countries launched`;
            progressFillElement.style.width = `${stats.percentage}%`;
            progressPercentageElement.textContent = `${stats.percentage}%`;
        }
    }

    setupEventListeners() {
        // Feature selector change event
        const featureSelect = document.getElementById('feature-select');
        featureSelect.addEventListener('change', async (event) => {
            await this.switchFeature(event.target.value);
        });

        window.addEventListener('resize', () => {
            this.debounce(() => {
                if (this.isInitialized) {
                    this.mapRenderer.resize();
                }
            }, 250);
        });

        window.addEventListener('beforeunload', () => {
            if (this.mapRenderer.tooltip) {
                this.mapRenderer.tooltip.remove();
            }
        });
    }

    async switchFeature(featureId) {
        if (!this.isInitialized) {
            console.warn('Visualization not initialized yet');
            return;
        }

        try {
            const loadingElement = document.getElementById('loading');
            loadingElement.style.display = 'block';

            if (!featureId || featureId === '') {
                // Handle empty selection - show default state
                loadingElement.textContent = 'Clearing feature selection...';
                this.dataLoader.launchStatus = {};
                this.dataLoader.featureName = '';
                this.dataLoader.featureDescription = '';
                this.dataLoader.currentFeature = null;
                this.mapRenderer.updateData(this.dataLoader.launchStatus);
                this.updateAlphaStats(); // Update alpha stats for default state
                loadingElement.style.display = 'none';
                console.log('Switched to default state (no feature selected)');
                return;
            }

            loadingElement.textContent = `Loading ${featureId}...`;
            await this.dataLoader.loadFeatureData(featureId);
            this.mapRenderer.updateData(this.dataLoader.launchStatus);
            this.updateAlphaStats(); // Update alpha stats for selected feature

            loadingElement.style.display = 'none';
            console.log(`Switched to ${this.dataLoader.featureName}`);
        } catch (error) {
            console.error('Failed to switch feature:', error);
            this.showError('Failed to load feature data.');
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showError(message) {
        const loadingElement = document.getElementById('loading');
        loadingElement.textContent = message;
        loadingElement.style.color = '#dc3545';
        loadingElement.style.display = 'block';
    }

    async updateLaunchStatus(newData) {
        if (!this.isInitialized) {
            console.warn('Visualization not initialized yet');
            return;
        }

        try {
            this.dataLoader.launchStatus = newData.countries || newData;
            this.mapRenderer.updateData(this.dataLoader.launchStatus);
            console.log('Launch status data updated successfully');
        } catch (error) {
            console.error('Failed to update launch status:', error);
        }
    }

    getStats() {
        if (!this.isInitialized) {
            return null;
        }

        if (!this.dataLoader.currentFeature || !this.dataLoader.featureName) {
            return {
                featureName: 'No feature selected',
                totalCountries: 0,
                launchedCountries: 0,
                notLaunchedCountries: 0,
                excludedCountries: 0,
                launchRate: 0
            };
        }

        const totalCountries = Object.keys(this.dataLoader.launchStatus).length;
        const launchedCountries = Object.values(this.dataLoader.launchStatus)
            .filter(status => status.launched).length;
        const excludedCountries = 0;

        return {
            featureName: this.dataLoader.featureName,
            totalCountries,
            launchedCountries,
            notLaunchedCountries: totalCountries - launchedCountries,
            excludedCountries,
            launchRate: totalCountries > 0 ? (launchedCountries / totalCountries * 100).toFixed(1) : 0
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.visualization = new FeatureLaunchVisualization();
    window.visualization.initialize();
});

window.updateLaunchData = function(newData) {
    if (window.visualization) {
        window.visualization.updateLaunchStatus(newData);
    }
};

window.getVisualizationStats = function() {
    if (window.visualization) {
        return window.visualization.getStats();
    }
    return null;
};