const burgerMenu = document.getElementById('burgerMenu')
const openIcon = document.getElementById('openIcon')
const closeIcon = document.getElementById('closeIcon')
const headerNav = document.getElementById('headerNav')

burgerMenu.addEventListener('click', ()=> {
    openIcon.classList.toggle('d-none')
    closeIcon.classList.toggle('d-none')
    headerNav.classList.toggle('header-nav-open')
})


document.addEventListener("DOMContentLoaded", function() {
  const submenuParent = document.querySelector(".has-submenu");

  if (submenuParent) {
    submenuParent.querySelector(".submenu-toggle").addEventListener("click", function(e) {
      e.preventDefault();
      submenuParent.classList.toggle("open");
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.feedback-container');
  const leftBtn = document.querySelector('.arrow-left');
  const rightBtn = document.querySelector('.arrow-right');
  const feedbacks = document.querySelectorAll('.feedback-container .border');

  let currentIndex = 0;

  // Функція визначення кількості відгуків на екрані
  const getVisibleCount = () => {
    const containerWidth = container.offsetWidth;
    const cardWidth = feedbacks[0].offsetWidth;
    return Math.floor(containerWidth / cardWidth);
  };

  const scrollToIndex = (index) => {
    const cardWidth = feedbacks[0].offsetWidth + parseInt(getComputedStyle(container).gap);
    container.scrollTo({
      left: cardWidth * index,
      behavior: 'smooth'
    });
    currentIndex = index;
    updateBlur();
  };

  rightBtn.addEventListener('click', () => {
    const visibleCount = getVisibleCount();
    if (currentIndex < feedbacks.length - visibleCount) {
      scrollToIndex(currentIndex + 1);
    }
  });

  leftBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  });

  const updateBlur = () => {
    const visibleCount = getVisibleCount();
    feedbacks.forEach((card, idx) => {
      if (visibleCount === 1) {
        card.classList.remove('blur'); // мобільна версія без blur
      } else {
        // blur для всіх, що поза видимою областю
        if (idx >= currentIndex && idx < currentIndex + visibleCount) {
          card.classList.remove('blur');
        } else {
          card.classList.add('blur');
        }
      }
    });
  };

  window.addEventListener('resize', updateBlur);
  updateBlur();
});
