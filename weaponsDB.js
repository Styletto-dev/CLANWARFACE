// Configuração do Banco de Dados SQLite
let db;
let weapons = [];

// Inicializa o banco de dados SQLite
async function initDB() {
    try {
        // Carrega o SQL.js com WASM
        const SQL = await initSqlJs({
            locateFile: file => `sql-wasm.wasm`
        });
        
        // Cria um novo banco de dados
        db = new SQL.Database();
        
        // Cria a tabela se não existir
        db.run(`
            CREATE TABLE IF NOT EXISTS weapons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                image TEXT NOT NULL,
                loadout TEXT NOT NULL,
                damage INTEGER NOT NULL,
                range INTEGER NOT NULL,
                control INTEGER NOT NULL,
                handling INTEGER NOT NULL,
                stability INTEGER NOT NULL,
                accuracy INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        console.log("Banco de dados SQLite inicializado com sucesso!");
        return true;
    } catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error);
        return false;
    }
}

// Adiciona uma nova arma ao banco de dados
function addWeapon(weapon) {
    try {
        const stmt = db.prepare(`
            INSERT INTO weapons (name, category, image, loadout, damage, range, control, handling, stability, accuracy)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.bind([
            weapon.name,
            weapon.category,
            weapon.image,
            weapon.loadout,
            weapon.damage,
            weapon.range,
            weapon.control,
            weapon.handling,
            weapon.stability,
            weapon.accuracy
        ]);
        
        stmt.step();
        stmt.free();
        
        return true;
    } catch (error) {
        console.error("Erro ao adicionar arma:", error);
        return false;
    }
}

// Obtém todas as armas do banco de dados
function getAllWeapons() {
    const results = [];
    const stmt = db.prepare("SELECT * FROM weapons ORDER BY name");
    
    while (stmt.step()) {
        results.push(stmt.getAsObject());
    }
    
    stmt.free();
    return results;
}

// Filtra armas por categoria
function getWeaponsByCategory(category) {
    if (category === 'all') {
        return getAllWeapons();
    }
    
    const results = [];
    const stmt = db.prepare("SELECT * FROM weapons WHERE category = ? ORDER BY name");
    stmt.bind([category]);
    
    while (stmt.step()) {
        results.push(stmt.getAsObject());
    }
    
    stmt.free();
    return results;
}

// Busca armas por termo
function searchWeapons(term) {
    const results = [];
    const stmt = db.prepare(`
        SELECT * FROM weapons 
        WHERE name LIKE ? OR loadout LIKE ?
        ORDER BY name
    `);
    
    stmt.bind([`%${term}%`, `%${term}%`]);
    
    while (stmt.step()) {
        results.push(stmt.getAsObject());
    }
    
    stmt.free();
    return results;
}

// Remove uma arma do banco de dados
function deleteWeapon(id) {
    try {
        const stmt = db.prepare("DELETE FROM weapons WHERE id = ?");
        stmt.bind([id]);
        stmt.step();
        stmt.free();
        return true;
    } catch (error) {
        console.error("Erro ao remover arma:", error);
        return false;
    }
}

// Exporta o banco de dados para um arquivo
function exportDB() {
    const data = db.export();
    const blob = new Blob([data], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'warface_armas.db';
    a.click();
    
    URL.revokeObjectURL(url);
}

// Importa um banco de dados
async function importDB(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function() {
            try {
                const uints = new Uint8Array(reader.result);
                db = new SQL.Database(uints);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Renderiza as armas na tela
function renderWeapons(weaponsList) {
    const container = document.getElementById('weaponsContainer');
    container.innerHTML = weaponsList.map(createWeaponCard).join('');
}

// Cria o HTML para um card de arma
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

// Configura os event listeners
function setupEventListeners() {
    const weaponForm = document.getElementById('weaponForm');
    const searchInput = document.getElementById('weaponSearch');
    const searchButton = document.getElementById('searchWeaponBtn');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    // Formulário de adição
    weaponForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitWeaponBtn');
        const btnText = document.getElementById('btnText');
        const btnLoader = document.getElementById('btnLoader');
        
        try {
            // Mostra o loading
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            
            // Cria o objeto da nova arma
            const newWeapon = {
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
            
            // Adiciona ao banco de dados
            if (addWeapon(newWeapon)) {
                // Atualiza a lista
                weapons = getAllWeapons();
                renderWeapons(weapons);
                
                // Limpa o formulário
                weaponForm.reset();
            } else {
                throw new Error("Erro ao adicionar ao banco de dados");
            }
        } catch (error) {
            console.error("Erro ao adicionar arma:", error);
            alert("Erro ao adicionar a arma: " + error.message);
        } finally {
            // Esconde o loading
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });
    
    // Busca
    searchButton.addEventListener('click', () => {
        const term = searchInput.value.trim();
        if (term) {
            weapons = searchWeapons(term);
            renderWeapons(weapons);
        }
    });
    
    // Filtro por categoria
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.dataset.category;
            weapons = getWeaponsByCategory(category);
            renderWeapons(weapons);
        });
    });
    
    // Deleção de armas
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-weapon')) {
            const weaponCard = e.target.closest('.weapon-card');
            const weaponId = parseInt(weaponCard.dataset.id);
            
            if (confirm("Tem certeza que deseja remover esta arma?")) {
                if (deleteWeapon(weaponId)) {
                    weaponCard.remove();
                    weapons = weapons.filter(w => w.id !== weaponId);
                } else {
                    alert("Erro ao remover a arma");
                }
            }
        }
    });
}

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', async () => {
    if (!document.getElementById('weaponsContainer')) return;
    
    try {
        // Inicializa o banco de dados
        const success = await initDB();
        if (!success) throw new Error("Não foi possível iniciar o banco de dados");
        
        // Carrega as armas
        weapons = getAllWeapons();
        renderWeapons(weapons);
        
        // Configura os listeners
        setupEventListeners();
        
        // Adiciona botão de exportação (opcional)
        const exportBtn = document.createElement('button');
        exportBtn.className = 'submit-btn';
        exportBtn.textContent = 'Exportar Banco de Dados';
        exportBtn.style.margin = '20px auto';
        exportBtn.onclick = exportDB;
        document.querySelector('.weapons-section .container').appendChild(exportBtn);
        
    } catch (error) {
        console.error("Erro na inicialização:", error);
        alert("Erro crítico: " + error.message);
    }
});