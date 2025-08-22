document.addEventListener('DOMContentLoaded', () => {

  // ==============================
  // FUNÇÃO DE EASING PARA SCROLL SUAVE
  // ==============================
  function easeInOutCubic(t) {
    return t < 0.5 
      ? 4 * t * t * t 
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function smoothScroll(target, duration) {
    const targetPosition = target.getBoundingClientRect().top + window.scrollY;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const ease = easeInOutCubic(progress / duration);
      window.scrollTo(0, startPosition + distance * ease);
      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  // ==============================
  // ANIMAÇÃO DAS IMAGENS SNEAKERS
  // ==============================
  const sneakersSection = document.getElementById('sneakers');
  const sneakerImages = sneakersSection.querySelectorAll('.sneaker-display img');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sneakersSection.classList.add('show');
        sneakerImages.forEach(img => img.style.animationPlayState = 'running');
        observer.unobserve(sneakersSection);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(sneakersSection);

  // ==============================
  // CARROSSEL DE CARDS SHOP
  // ==============================
  const track = document.querySelector('.shop-track');
  const cards = document.querySelectorAll('.shop-card');
  const totalCards = 5; // número de cards que circulam
  let index = 0;

  function moveCarousel() {
    const cardWidth = cards[0].offsetWidth + 20; // 20px de gap
    index++;
    if(index >= totalCards) index = 0;
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  setInterval(moveCarousel, 3000);

  // ==============================
  // SCROLL SUAVE PARA CTA BUTTON
  // ==============================
  const ctaButton = document.querySelector('.cta-button');
  const shopSection = document.querySelector('#shop-section');

  if(ctaButton && shopSection) {
    ctaButton.addEventListener('click', e => {
      e.preventDefault();
      smoothScroll(shopSection, 3200);
    });
  }

  // ==============================
  // SCROLL SUAVE PARA LINKS DO NAV
  // ==============================
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetID = document.querySelector(link.getAttribute('href'));
      if(targetID) smoothScroll(targetID, 1200);
    });
  });

});

// ==============================
// CARRINHO DE COMPRAS
// ==============================
const cartToggle = document.getElementById('cart-toggle');
const cartDropdown = document.getElementById('cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const cartNotification = document.getElementById('cart-notification');

let cartData = [];

// Abrir/fechar dropdown do carrinho
cartToggle.addEventListener('click', () => {
  cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
});

// Adicionar produtos ao carrinho
document.querySelectorAll('.shop-card button').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const card = btn.parentElement;
    const title = card.querySelector('h3').innerText;
    const price = parseFloat(card.querySelector('p').innerText.replace('R$ ', ''));
    const imgSrc = card.querySelector('img').src;

    addToCart({ title, price, quantity: 1, img: imgSrc });
    showNotification(title);
  });
});

// Função para adicionar ou atualizar produto no carrinho
function addToCart(product) {
  const existing = cartData.find(item => item.title === product.title);
  if (existing) existing.quantity++;
  else cartData.push(product);
  renderCart();
}

// Renderiza itens no dropdown do carrinho
function renderCart() {
  cartItems.innerHTML = '';
  let total = 0;
  cartData.forEach((item, index) => {
    total += item.price * item.quantity;
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <span>${item.title} x${item.quantity}</span>
      <span>R$ ${(item.price*item.quantity).toFixed(2)}</span>
      <button onclick="removeFromCart(${index})">❌</button>
    `;
    cartItems.appendChild(li);
  });
  cartTotal.innerText = total.toFixed(2);
  cartCount.innerText = cartData.reduce((sum, i) => sum + i.quantity, 0);
}

// Remove item do carrinho
window.removeFromCart = function(index) {
  cartData.splice(index, 1);
  renderCart();
}

// Finalizar compra
checkoutBtn.addEventListener('click', () => {
  if(cartData.length === 0) return;
  cartData = [];
  renderCart();
  cartDropdown.style.display = 'none';
});

// Notificação de item adicionado
function showNotification(productName) {
  cartNotification.innerText = `"${productName}" adicionado ao carrinho!`;
  cartNotification.style.display = 'block';
  setTimeout(() => {
    cartNotification.style.display = 'none';
  }, 1500);
}