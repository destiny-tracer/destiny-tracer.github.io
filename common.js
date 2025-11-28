/* ============================================
   destiny-tracer — Shared Features
   Dark Mode & Save Calculations
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // DARK MODE FUNCTIONALITY
  // ============================================
  
  const ThemeManager = {
    init() {
      // Load saved theme or default to light
      const savedTheme = localStorage.getItem('theme') || 'light';
      this.setTheme(savedTheme);
      this.createToggleButton();
    },

    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      this.updateToggleIcon(theme);
    },

    toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
    },

    updateToggleIcon(theme) {
      const icon = document.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
    },

    createToggleButton() {
      const header = document.querySelector('.header');
      if (!header) return;

      // Check if button already exists
      if (document.querySelector('.theme-toggle')) return;

      // Create theme toggle button
      const themeToggle = document.createElement('button');
      themeToggle.className = 'theme-toggle';
      themeToggle.innerHTML = '<span class="theme-icon">🌙</span><span>Theme</span>';
      themeToggle.addEventListener('click', () => this.toggleTheme());

      // Find or create header actions container
      let actionsContainer = document.querySelector('.header-actions');
      if (!actionsContainer) {
        actionsContainer = document.createElement('div');
        actionsContainer.className = 'header-actions';
        header.appendChild(actionsContainer);
      }

      // Insert before back button if it exists, otherwise append
      const backBtn = actionsContainer.querySelector('.back-btn');
      if (backBtn) {
        actionsContainer.insertBefore(themeToggle, backBtn);
      } else {
        actionsContainer.appendChild(themeToggle);
      }

      // Update icon based on current theme
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      this.updateToggleIcon(currentTheme);
    }
  };

  // ============================================
  // SAVE CALCULATIONS FUNCTIONALITY
  // ============================================
  
  const SaveManager = {
    storageKey: 'destiny-tracer-calculations',

    init() {
      this.loadCalculations();
    },

    // Save a calculation
    save(calcData) {
      if (!calcData.type || !calcData.name) {
        console.error('Calculation must have type and name');
        return false;
      }

      const calculations = this.getAll();
      
      // Add timestamp and ID
      calcData.id = Date.now().toString();
      calcData.timestamp = new Date().toISOString();
      
      calculations.push(calcData);
      
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(calculations));
        return true;
      } catch (e) {
        console.error('Failed to save calculation:', e);
        return false;
      }
    },

    // Get all saved calculations
    getAll() {
      try {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.error('Failed to load calculations:', e);
        return [];
      }
    },

    // Get calculations by type
    getByType(type) {
      return this.getAll().filter(calc => calc.type === type);
    },

    // Load a specific calculation
    load(id) {
      const calculations = this.getAll();
      return calculations.find(calc => calc.id === id);
    },

    // Delete a calculation
    delete(id) {
      const calculations = this.getAll();
      const filtered = calculations.filter(calc => calc.id !== id);
      
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(filtered));
        return true;
      } catch (e) {
        console.error('Failed to delete calculation:', e);
        return false;
      }
    },

    // Clear all calculations
    clearAll() {
      try {
        localStorage.removeItem(this.storageKey);
        return true;
      } catch (e) {
        console.error('Failed to clear calculations:', e);
        return false;
      }
    },

    // Load calculations into form
    loadCalculations() {
      // This will be implemented per calculator
    }
  };

  // ============================================
  // SAVE BUTTON HELPER
  // ============================================
  
  window.DestinyTracer = window.DestinyTracer || {};
  
  window.DestinyTracer.addSaveButton = function(container, onSave) {
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn save';
    saveBtn.textContent = '💾 Save';
    saveBtn.addEventListener('click', onSave);
    
    const actions = container.querySelector('.actions');
    if (actions) {
      actions.appendChild(saveBtn);
    }
  };

  window.DestinyTracer.showSavedCalculations = function(containerId, calcType, onLoad) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const calculations = SaveManager.getByType(calcType);
    
    if (calculations.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.innerHTML = `
      <div class="saved-header">
        <h3>📋 Saved Calculations</h3>
        <button class="btn-icon delete" onclick="DestinyTracer.SaveManager.clearAll(); location.reload();">
          🗑️ Clear All
        </button>
      </div>
      <div class="saved-list">
        ${calculations.map(calc => `
          <div class="saved-item">
            <div class="saved-info">
              <div class="saved-name">${calc.name}</div>
              <div class="saved-details">${calc.details || 'Saved ' + new Date(calc.timestamp).toLocaleDateString()}</div>
            </div>
            <div class="saved-actions">
              <button class="btn-icon" onclick="DestinyTracer.loadCalculation('${calc.id}')">
                📥 Load
              </button>
              <button class="btn-icon delete" onclick="DestinyTracer.deleteCalculation('${calc.id}')">
                ❌
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    
    container.style.display = 'block';

    // Store the onLoad callback
    window.DestinyTracer._onLoadCallback = onLoad;
  };

  window.DestinyTracer.loadCalculation = function(id) {
    const calc = SaveManager.load(id);
    if (calc && window.DestinyTracer._onLoadCallback) {
      window.DestinyTracer._onLoadCallback(calc);
    }
  };

  window.DestinyTracer.deleteCalculation = function(id) {
    if (confirm('Delete this calculation?')) {
      SaveManager.delete(id);
      location.reload();
    }
  };

  // ============================================
  // EXPORT TO WINDOW
  // ============================================
  
  window.DestinyTracer = window.DestinyTracer || {};
  window.DestinyTracer.ThemeManager = ThemeManager;
  window.DestinyTracer.SaveManager = SaveManager;

  // ============================================
  // AUTO-INITIALIZE
  // ============================================
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ThemeManager.init();
    });
  } else {
    ThemeManager.init();
  }

})();

