// Dark mode toggle
(function() {
  const THEME_KEY = 'blog-theme';
  const DARK_CLASS = 'dark-mode';
  
  // Get saved theme or default to light
  function getSavedTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  }
  
  // Apply theme
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add(DARK_CLASS);
    } else {
      document.documentElement.classList.remove(DARK_CLASS);
    }
    localStorage.setItem(THEME_KEY, theme);
    
    // Update toggle button icon
    updateToggleButton(theme);
  }
  
  // Update toggle button icon
  function updateToggleButton(theme) {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      const icon = toggleBtn.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
    }
  }
  
  // Toggle theme
  function toggleTheme() {
    const currentTheme = localStorage.getItem(THEME_KEY) || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }
  
  // Initialize theme on page load
  document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme);
    
    // Add toggle button event listener
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }
  });
  
  // Apply theme immediately to prevent flash
  const savedTheme = getSavedTheme();
  if (savedTheme === 'dark') {
    document.documentElement.classList.add(DARK_CLASS);
  }
  
  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
})();
