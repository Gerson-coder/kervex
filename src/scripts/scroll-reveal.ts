const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      (e.target as HTMLElement).style.opacity = '1';
      (e.target as HTMLElement).style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.06 });

document.querySelectorAll('.pc,.pg,.plan').forEach(el => {
  (el as HTMLElement).style.opacity = '0';
  (el as HTMLElement).style.transform = 'translateY(16px)';
  (el as HTMLElement).style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  io.observe(el);
});
