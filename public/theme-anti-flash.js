(function() {
  try {
    var theme = localStorage.getItem('theme');
    var followSystem = theme !== 'light' && theme !== 'dark'; // unset or 'system'
    if (theme === 'dark' || (followSystem && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
