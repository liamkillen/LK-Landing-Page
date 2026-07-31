(function () {
  'use strict';

  // ---- mobile nav ----
  var burger = document.querySelector('.burger');
  var mobileNav = document.getElementById('mobile-nav');

  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      burger.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      mobileNav.hidden = open;
    });
  }

  // ---- logo slideshow ----
  // Matches the Squarespace gallery block it replaces: fade transition,
  // one logo at a time, arrows revealed on hover.
  var shell = document.querySelector('.slideshow');
  if (!shell) return;

  var slides = Array.prototype.slice.call(shell.querySelectorAll('.slideshow-viewport li'));
  if (!slides.length) return;

  var index = 0;
  var timer = null;
  var INTERVAL = 3000; // gallery autoplay speed from the source tweaks

  function show(n) {
    index = (n + slides.length) % slides.length;
    slides.forEach(function (li, i) {
      li.classList.toggle('is-current', i === index);
      li.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
  }

  function next() { show(index + 1); }
  function prev() { show(index - 1); }

  function start() {
    if (timer) return;
    timer = setInterval(next, INTERVAL);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }

  show(0);

  shell.querySelector('.slide-nav--next').addEventListener('click', function () {
    stop(); next(); start();
  });
  shell.querySelector('.slide-nav--prev').addEventListener('click', function () {
    stop(); prev(); start();
  });

  shell.addEventListener('mouseenter', stop);
  shell.addEventListener('mouseleave', start);
  shell.addEventListener('focusin', stop);
  shell.addEventListener('focusout', start);

  document.addEventListener('visibilitychange', function () {
    document.hidden ? stop() : start();
  });

  // Autoplay only when the user hasn't asked for reduced motion.
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }, { threshold: 0 }).observe(shell);
    } else {
      start();
    }
  }
})();
