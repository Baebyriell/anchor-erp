(function () {
  var html = document.documentElement;
  var chapters = document.querySelectorAll('.chapter');
  var navLinks = document.querySelectorAll('.index-nav a[data-chapter]');
  var panel = document.getElementById('panel');

  if (!chapters.length || !navLinks.length) return;

  html.classList.add('js');

  var ids = Array.prototype.map.call(chapters, function (c) { return c.id; });

  function show(id) {
    if (ids.indexOf(id) === -1) id = ids[0];

    chapters.forEach(function (chapter) {
      chapter.classList.toggle('is-active', chapter.id === id);
    });
    navLinks.forEach(function (link) {
      var active = link.getAttribute('data-chapter') === id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    if (panel) panel.scrollTop = 0;
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      var id = link.getAttribute('data-chapter');
      if (location.hash !== '#' + id) {
        history.pushState(null, '', '#' + id);
      }
      show(id);
    });
  });

  window.addEventListener('popstate', function () {
    show(location.hash.replace('#', ''));
  });

  show(location.hash.replace('#', '') || ids[0]);
})();
