(function () {
  var sections = document.querySelectorAll('main .section, .hero');
  var navLinks = document.querySelectorAll('.site-nav a');

  if (!('IntersectionObserver' in window) || !sections.length) return;

  var linkFor = function (id) {
    return document.querySelector('.site-nav a[href="#' + id + '"]');
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var link = linkFor(entry.target.id);
      if (!link) return;
      navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
      link.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(function (section) {
    if (section.id) observer.observe(section);
  });
})();
