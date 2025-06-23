// Banco de dados local para armazenar as armas
let weaponsDB = JSON.parse(localStorage.getItem('weaponsDB')) || [];

// Elementos do DOM
const weaponsContainer = document.getElementById('weaponsContainer');
const weaponForm = document.getElementById('weaponForm');
const searchInput = document.getElementById('weaponSearch');
const searchButton = document.getElementById('searchWeaponBtn');
const categoryButtons = document.querySelectorAll('.category-btn');

// Template para o card de arma
function createWeaponCard(weapon) {
    return `
        <div class="weapon-card" data-category="${weapon.category}">
            <div class="weapon-header">
                <img src="${weapon.image}" alt="${weapon.name}" onerror="this.src='images/default-weapon.png'">
                <div class="weapon-badge">${weapon.category.toUpperCase()}</div>
            </div>
            <div class="weapon-content">
                <h3>${weapon.name}</h3>
                <div class="weapon-info">
                    <p><span>Loadout:</span> ${weapon.loadout}</p>
                    <div class="weapon-stats">
                        <p><span>Dano:</span> ${weapon.damage}</p>
                        <p><span>Alcance:</span> ${weapon.range}m</p>
                        <p><span>Controle:</span> ${weapon.control}</p>
                        <p><span>Manuseio:</span> ${weapon.handling}</p>
                        <p><span>Estabilidade:</span> ${weapon.stability}</p>
                        <p><span>Precisão:</span> ${weapon.accuracy}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Carrega as armas no grid
function loadWeapons() {
    weaponsContainer.innerHTML = weaponsDB.map(createWeaponCard).join('');
    filterWeapons();
}

// Filtra as armas por categoria e busca
function filterWeapons() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeCategory = document.querySelector('.category-btn.active').dataset.category;
    const weaponCards = document.querySelectorAll('.weapon-card');
    
    weaponCards.forEach(card => {
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

// Adiciona uma nova arma
function addWeapon(e) {
    e.preventDefault();
    
    const newWeapon = {
        id: Date.now(),
        name: document.getElementById('weaponName').value,
        category: document.getElementById('weaponCategory').value,
        image: document.getElementById('weaponImage').value,
        loadout: document.getElementById('weaponLoadout').value,
        damage: document.getElementById('weaponDamage').value,
        range: document.getElementById('weaponRange').value,
        control: document.getElementById('weaponControl').value,
        handling: document.getElementById('weaponHandling').value,
        stability: document.getElementById('weaponStability').value,
        accuracy: document.getElementById('weaponAccuracy').value
    };
    
    weaponsDB.push(newWeapon);
    localStorage.setItem('weaponsDB', JSON.stringify(weaponsDB));
    loadWeapons();
    weaponForm.reset();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    if (weaponsContainer) {
        loadWeapons();
        
        weaponForm.addEventListener('submit', addWeapon);
        searchButton.addEventListener('click', filterWeapons);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') filterWeapons();
        });
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterWeapons();
            });
        });
    }
});