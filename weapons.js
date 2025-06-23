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
        <div class="weapon-card" data-category="${weapon.category}" data-id="${weapon.id}">
            <div class="weapon-header">
                <img src="${weapon.image}" alt="${weapon.name}" onerror="this.src='images/default-weapon.png'">
                <div class="weapon-badge">${weapon.category.toUpperCase()}</div>
                <button class="delete-weapon" title="Remover arma">×</button>
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
function loadWeapons(weapons = weaponsDB) {
    weaponsContainer.innerHTML = weapons.map(createWeaponCard).join('');
}

// Filtra as armas por categoria
function filterByCategory(category) {
    if (category === 'all') {
        loadWeapons();
        return;
    }
    
    const filtered = weaponsDB.filter(weapon => weapon.category === category);
    loadWeapons(filtered);
}

// Busca armas por termo
function searchWeapons(term) {
    const filtered = weaponsDB.filter(weapon => 
        weapon.name.toLowerCase().includes(term.toLowerCase()) || 
        weapon.loadout.toLowerCase().includes(term.toLowerCase())
    );
    loadWeapons(filtered);
}

// Adiciona uma nova arma
function addWeapon(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitWeaponBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    
    try {
        // Mostra o loading
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        
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
    } catch (error) {
        console.error("Erro ao adicionar arma:", error);
        alert("Erro ao adicionar a arma: " + error.message);
    } finally {
        // Esconde o loading
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// Remove uma arma
function deleteWeapon(id) {
    if (confirm("Tem certeza que deseja remover esta arma?")) {
        weaponsDB = weaponsDB.filter(weapon => weapon.id !== id);
        localStorage.setItem('weaponsDB', JSON.stringify(weaponsDB));
        loadWeapons();
    }
}

// Exporta para JSON
function exportDB() {
    const dataStr = JSON.stringify(weaponsDB, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'warface_armas.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Importa de JSON
function importDB(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            weaponsDB = data;
            localStorage.setItem('weaponsDB', JSON.stringify(weaponsDB));
            loadWeapons();
            alert("Banco de dados importado com sucesso!");
        } catch (error) {
            alert("Erro ao importar o arquivo: " + error.message);
        }
    };
    reader.readAsText(file);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    if (weaponsContainer) {
        loadWeapons();
        
        weaponForm.addEventListener('submit', addWeapon);
        searchButton.addEventListener('click', () => {
            const term = searchInput.value.trim();
            if (term) searchWeapons(term);
        });
        
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const term = searchInput.value.trim();
                if (term) searchWeapons(term);
            }
        });
        
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterByCategory(button.dataset.category);
            });
        });
        
        // Deleção de armas
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-weapon')) {
                const weaponCard = e.target.closest('.weapon-card');
                const weaponId = parseInt(weaponCard.dataset.id);
                deleteWeapon(weaponId);
            }
        });
        
        // Adiciona botões de exportação/importação
        const dbControls = document.createElement('div');
        dbControls.className = 'db-controls';
        dbControls.style.display = 'flex';
        dbControls.style.gap = '10px';
        dbControls.style.justifyContent = 'center';
        dbControls.style.margin = '20px 0';
        
        const exportBtn = document.createElement('button');
        exportBtn.className = 'submit-btn';
        exportBtn.textContent = 'Exportar Banco de Dados';
        exportBtn.onclick = exportDB;
        
        const importBtn = document.createElement('button');
        importBtn.className = 'submit-btn';
        importBtn.textContent = 'Importar Banco de Dados';
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', importDB);
        
        importBtn.onclick = () => fileInput.click();
        
        dbControls.appendChild(exportBtn);
        dbControls.appendChild(importBtn);
        dbControls.appendChild(fileInput);
        
        document.querySelector('.weapons-section .container').appendChild(dbControls);
    }
});