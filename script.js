document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recruitmentForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const modal = document.getElementById('statusModal');
    const discordLink = document.getElementById('discordLink');

    // API URL - Substitua pela URL do seu servidor
    const API_URL = 'http://localhost:3000/api/requests';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const warfaceNick = document.getElementById('warfaceNick').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const discordNick = document.getElementById('discordNick').value.trim();
        
        // Validação
        if (!warfaceNick || !phone || !discordNick) {
            showModal('Erro', 'Por favor, preencha todos os campos.', 'Todos os campos são obrigatórios.', false);
            return;
        }
        
        if (!discordNick.match(/.+#\d{4}/)) {
            showModal('Erro', 'Formato inválido', 'O Nick do Discord deve estar no formato: usuario#1234', false);
            return;
        }

        toggleLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    warfaceNick,
                    phone,
                    discordNick
                })
            });

            const data = await response.json();

            if (response.ok) {
                showModal(
                    'Solicitação Enviada!',
                    `Obrigado por se candidatar, ${warfaceNick}!`,
                    `ID: ${data.id}\nAguarde a aprovação dos administradores.`,
                    true,
                    true
                );
                form.reset();
            } else {
                showModal(
                    'Erro',
                    'Ocorreu um erro ao enviar sua solicitação.',
                    data.message || 'Tente novamente mais tarde.',
                    false
                );
            }
        } catch (error) {
            console.error('Erro:', error);
            showModal(
                'Erro de Conexão',
                'Não foi possível conectar ao servidor.',
                'Por favor, tente novamente mais tarde.',
                false
            );
        } finally {
            toggleLoading(false);
        }
    });

    function showModal(title, message, status, isSuccess = true, showDiscordLink = false) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        
        const statusElement = document.getElementById('modalStatus');
        statusElement.textContent = status;
        statusElement.className = `status-message ${isSuccess ? 'success' : 'error'}`;
        
        discordLink.style.display = showDiscordLink ? 'block' : 'none';
        modal.style.display = 'flex';
    }

    function toggleLoading(show) {
        btnText.style.display = show ? 'none' : 'inline';
        btnLoader.style.display = show ? 'inline-block' : 'none';
        submitBtn.disabled = show;
    }

    document.getElementById('closeModal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});