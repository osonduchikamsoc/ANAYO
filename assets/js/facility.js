/* ===================================================
   NINA HOTELS — FACILITY FILTER JS
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const filterBtns  = document.querySelectorAll('.filter-btn');
  const sportCards  = document.querySelectorAll('.sport-card');

  if (!filterBtns.length || !sportCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      sportCards.forEach(card => {
        const cardCat = card.dataset.category;
        const show = category === 'all' || cardCat === category;

        if (show) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });

      if (typeof AOS !== 'undefined') AOS.refresh();
    });
  });

});
