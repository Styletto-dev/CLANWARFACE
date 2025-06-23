document.addEventListener('DOMContentLoaded', () => {
    // Menu Mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            mainMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Sistema de busca e filtro (só na página de emblemas)
    if (document.querySelector('.emblems-section')) {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const categoryButtons = document.querySelectorAll('.category-btn');
        const emblemCards = document.querySelectorAll('.emblem-card');
        
        // Função de filtro
        function filterEmblems() {
            const searchTerm = searchInput.value.toLowerCase();
            const activeCategory = document.querySelector('.category-btn.active').dataset.category;
            
            emblemCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.textContent.toLowerCase();
                const category = card.dataset.category;
                
                const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
                const matchesCategory = activeCategory === 'all' || category === activeCategory;
                
                if (matchesSearch && matchesCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }
        
        // Event listeners
        searchButton.addEventListener('click', filterEmblems);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') filterEmblems();
        });
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterEmblems();
            });
        });
        
        // Filtro inicial
        filterEmblems();
    }
    
    // Efeito de partículas
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Posição aleatória
            const posX = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = 10 + Math.random() * 20;
            const size = 1 + Math.random() * 3;
            const opacity = 0.2 + Math.random() * 0.5;
            
            particle.style.left = `${posX}%`;
            particle.style.bottom = `-10px`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.opacity = opacity;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            
            particlesContainer.appendChild(particle);
        }
    }
    
    // Inicializar partículas
    createParticles();
});