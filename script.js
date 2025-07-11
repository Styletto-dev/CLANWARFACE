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
    
    // Efeito de partÃ­culas
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
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
    
    createParticles();
    
    // FormulÃ¡rio de inscriÃ§Ã£o com webhook
    const applicationForm = document.getElementById('application-form');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close-modal');
    
    async function sendToDiscordWebhook(data) {
        const webhookURL = 'https://discord.com/api/webhooks/1392999008787632350/HRkS4luRYnP_YA3plAk9yGJmdEMZyetTu63Bdm7k-JEUch8BdhlX0_zvc7FjY5PIYW-'; // Substitua pelo seu webhook
        
        try {
            const response = await fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: "ðŸ“¢ Nova inscriÃ§Ã£o no Clan Warface!",
                    embeds: [
                        {
                            title: "Novo Recruta",
                            color: 0x6495ED,
                            fields: [
                                {
                                    name: "ðŸ“± WhatsApp",
                                    value: `+${data.whatsapp}`,
                                    inline: true
                                },
                                {
                                    name: "ðŸŽ® Discord",
                                    value: data.discord || "NÃ£o informado",
                                    inline: true
                                }
                            ],
                            timestamp: new Date().toISOString(),
                            footer: {
                                text: "Clan Warface Recrutamento"
                            }
                        }
                    ]
                }),
            });

            return response.ok;
        } catch (error) {
            console.error('Erro:', error);
            return false;
        }
    }

    if (applicationForm) {
        applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = applicationForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            const formData = {
                discord: document.getElementById('discord').value,
                whatsapp: document.getElementById('whatsapp').value.replace(/\D/g, '') // Remove nÃ£o-numÃ©ricos
            };
            
            try {
                const success = await sendToDiscordWebhook(formData);
                
                if (success) {
                    modal.style.display = 'block';
                    applicationForm.reset();
                } else {
                    alert('Ocorreu um erro ao enviar. Por favor, entre em contato diretamente pelo Discord.');
                }
            } catch (error) {
                console.error(error);
                alert('Erro ao processar o formulÃ¡rio.');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // ValidaÃ§Ã£o do WhatsApp
    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
});
