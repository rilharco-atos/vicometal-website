/* ============================================
   VICOMETAL — AI Chatbot Assistant
   Intelligent responses about company services
   ============================================ */

(function() {
    'use strict';

    // --- Knowledge Base ---
    const knowledge = {
        servicos: {
            keywords: ['serviço', 'serviços', 'fazem', 'oferecem', 'atividade', 'trabalho'],
            response: `A Vicometal oferece um leque completo de serviços industriais:\n\n• **Fabrico** — Estruturas metálicas, caldeiraria pesada, equipamentos industriais (até 3.000 ton/mês)\n• **Montagem** — Montagem de estruturas, centrais de britagem, asfalto e betão\n• **Manutenção Industrial** — Equipas especializadas em celuloses, cimenteiras, siderurgias e minas\n• **Soldadura** — MIG/MAG robotizada, TIG, arco submerso (certificação EN ISO 3834)\n• **Soluções Chave-na-Mão** — Do design à entrega com comissionamento\n• **Inox (Vicoinox)** — Aço inoxidável para química, farmacêutica e alimentar\n\nGostaria de saber mais sobre algum serviço específico?`
        },
        orcamento: {
            keywords: ['orçamento', 'preço', 'custo', 'proposta', 'quanto custa', 'cotação', 'budget'],
            response: `Para solicitar um orçamento técnico, pode:\n\n1. **Formulário online** — Aceda à página [Pedir Orçamento](/orcamento.html) onde pode fazer upload de desenhos (PDF, DWG, STEP)\n2. **Email** — Envie para vicometal@vicometal.pt\n3. **Telefone** — Ligue para (+351) 239 644 616\n\nPara agilizar o processo, é útil indicar:\n• Tipo de serviço pretendido\n• Especificações técnicas ou desenhos\n• Prazo estimado\n• Quantidade/tonelagem\n\nNormalmente respondemos em 48h úteis.`
        },
        localizacao: {
            keywords: ['localização', 'onde', 'morada', 'endereço', 'chegar', 'mapa', 'sede'],
            response: `A sede da Vicometal está localizada em:\n\n📍 **Barroco, 3130-400**\nVila Nova de Anços · Soure\nPortugal\n\n**Coordenadas GPS:**\nN 40° 07' 19.68" W 8° 35' 52.50"\n\n**Horário de funcionamento:**\nSeg-Sex: 08:00 – 17:30\n\n**Como chegar:**\nA 10 min da A1 (saída Soure) e a 30 min de Coimbra.`
        },
        certificacoes: {
            keywords: ['certificação', 'certificado', 'qualidade', 'norma', 'iso', 'en1090', 'exc'],
            response: `A Vicometal possui as seguintes certificações:\n\n✅ **EN 1090** — Marcação CE de estruturas metálicas\n✅ **NP EN 9001** — Sistema de Gestão da Qualidade\n✅ **EN ISO 3834** — Requisitos de qualidade para soldadura\n✅ Soldadores certificados pela EN 287-1 / EN ISO 9606-1\n✅ Procedimentos de Soldadura ASME IX / EN ISO 15614-1 / PED\n✅ Classe de execução EXC3\n\nPode consultar mais detalhes na página de [Qualidade](/qualidade.html).`
        },
        empresa: {
            keywords: ['empresa', 'quem são', 'história', 'fundação', 'grupo', 'vicometal'],
            response: `O **Grupo Vicometal** foi fundado em 15 de Outubro de 2001 com apenas 7 funcionários.\n\n**Hoje, o grupo integra:**\n• Vieira Cordeiro, S.A. (fabrico e montagem)\n• Pormenorvirtual, S.A. (engenharia e projeto)\n• Vicometal Montajes, S.L. (Espanha)\n• Vicoinox, S.A. (aço inoxidável)\n\n**Números-chave:**\n• +200 colaboradores\n• +40.000 m² de área produtiva\n• Presença em +15 países\n• 4 continentes\n\nAtuamos na metalomecânica pesada há mais de 24 anos, com projetos na Europa, América do Sul e África.`
        },
        capacidades: {
            keywords: ['capacidade', 'fábrica', 'equipamento', 'produção', 'máquina', 'instalação'],
            response: `As nossas instalações contam com:\n\n🏭 **Área coberta:** 40.000 m²\n\n**Equipamentos principais:**\n• Gabinete de desenho técnico (Tekla/AutoCAD)\n• Corte oxicorte — até 200mm\n• Corte plasma — até 20mm\n• Calandragem — até 3000mm × 30mm (aço-carbono)\n• Quinadeiras, serrotes, guilhotinas\n• 5 Pontes rolantes (até 30 ton)\n• 2 Robots de soldadura MIG/MAG\n• Decapagem ao grau Sa2½\n• Pintura segundo EN 12944\n\nPode consultar a página completa em [Capacidades](/capacidades.html).`
        },
        contacto: {
            keywords: ['contacto', 'telefone', 'email', 'falar', 'ligar', 'comunicar'],
            response: `Pode contactar-nos através de:\n\n📞 **Telefone:** (+351) 239 644 616\n📠 **Fax:** (+351) 239 644 615\n📧 **Email:** vicometal@vicometal.pt\n\n**Horário:** Segunda a Sexta, 08:00 – 17:30\n\nOu utilize o formulário na página de [Contactos](/contactos.html) para uma resposta por escrito.`
        },
        setores: {
            keywords: ['setor', 'sector', 'indústria', 'área', 'mercado', 'cliente'],
            response: `Atuamos nos seguintes sectores industriais:\n\n• 🏭 Celuloses (papel e biomassa)\n• ⚙️ Cimenteiras & Cal\n• 🔥 Argilas expandidas & Cerâmicas\n• 🏗️ Siderurgias & Fundições\n• ⛏️ Minas\n• 🧪 Química & Farmacêutica\n• 🍃 Biomassa & Energia\n• 🥫 Indústria Alimentar\n• ♻️ Reciclagem\n\nTemos experiência em projetos de grande escala em todos estes sectores, tanto em Portugal como internacionalmente.`
        },
        internacional: {
            keywords: ['internacional', 'exportação', 'país', 'europa', 'estrangeiro', 'abroad'],
            response: `A Vicometal tem presença internacional em:\n\n🇵🇹 Portugal (sede)\n🇪🇸 Espanha (Vicometal Montajes, S.L.)\n🇫🇷 França\n🇩🇪 Alemanha\n🇫🇮 Finlândia\n🇧🇷 Brasil\n🇦🇴 Angola\n🇲🇦 Marrocos\n\nE mais de 15 países em 4 continentes.\n\nA nossa primeira experiência internacional foi em 2006 e desde então temos crescido consistentemente no mercado europeu e além.`
        },
        reclamacao: {
            keywords: ['reclamação', 'reclamar', 'queixa', 'livro'],
            response: `Para apresentar uma reclamação, pode:\n\n📋 **Livro de Reclamações Online:**\nhttps://www.livroreclamacoes.pt\n\nTambém pode contactar-nos diretamente por email (vicometal@vicometal.pt) ou telefone ((+351) 239 644 616) para resolver qualquer questão.\n\nA satisfação dos nossos clientes é uma prioridade absoluta.`
        }
    };

    const fallbackResponses = [
        'Obrigado pela sua pergunta. Para uma resposta mais detalhada, sugiro que nos contacte diretamente pelo telefone (+351) 239 644 616 ou email vicometal@vicometal.pt.',
        'Essa é uma boa questão! Para lhe dar a melhor resposta, o ideal seria falar com a nossa equipa comercial. Posso ajudá-lo com informações sobre serviços, orçamentos, ou localização?',
        'Não tenho informação suficiente para responder a essa questão específica, mas posso ajudar com:\n• Serviços oferecidos\n• Pedido de orçamento\n• Localização e contactos\n• Certificações\n• Capacidades industriais\n\nSobre qual tema gostaria de saber mais?'
    ];

    // --- Chatbot Logic ---
    const chatbot = document.getElementById('chatbot');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotForm = document.getElementById('chatbotForm');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSuggestions = document.getElementById('chatbotSuggestions');

    if (!chatbot) return;

    // Toggle chat
    chatbotToggle.addEventListener('click', () => {
        chatbot.classList.toggle('open');
        if (chatbot.classList.contains('open')) {
            chatbotInput.focus();
            const badge = chatbot.querySelector('.chatbot-badge');
            if (badge) badge.classList.add('hidden');
        }
    });

    chatbotClose.addEventListener('click', () => {
        chatbot.classList.remove('open');
    });

    // Suggestions
    chatbotSuggestions.querySelectorAll('.suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.getAttribute('data-question');
            handleUserMessage(question);
        });
    });

    // Form submit
    chatbotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = chatbotInput.value.trim();
        if (!message) return;
        handleUserMessage(message);
        chatbotInput.value = '';
    });

    function handleUserMessage(message) {
        addMessage(message, 'user');
        chatbotSuggestions.style.display = 'none';
        
        // Show typing indicator
        showTyping();
        
        // Simulate thinking time
        const delay = 800 + Math.random() * 1200;
        setTimeout(() => {
            removeTyping();
            const response = generateResponse(message);
            addMessage(response, 'bot');
        }, delay);
    }

    function generateResponse(input) {
        const normalized = input.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove accents for matching

        let bestMatch = null;
        let bestScore = 0;

        for (const [key, data] of Object.entries(knowledge)) {
            let score = 0;
            for (const keyword of data.keywords) {
                const normalizedKeyword = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                if (normalized.includes(normalizedKeyword)) {
                    score += normalizedKeyword.length; // Longer matches score higher
                }
            }
            if (score > bestScore) {
                bestScore = score;
                bestMatch = data;
            }
        }

        if (bestMatch && bestScore > 3) {
            return bestMatch.response;
        }

        // Greeting detection
        if (/^(ol[aá]|bom dia|boa tarde|boa noite|hey|hi|hello)/i.test(normalized)) {
            return 'Olá! 👋 Bem-vindo à Vicometal. Como posso ajudá-lo hoje?\n\nPosso dar informações sobre:\n• Serviços e capacidades\n• Orçamentos\n• Certificações\n• Localização e contactos';
        }

        // Thank you detection
        if (/^(obrigad|thank|agradec)/i.test(normalized)) {
            return 'De nada! 😊 Se precisar de mais alguma informação, não hesite em perguntar. Estamos aqui para ajudar!';
        }

        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', type);
        
        const bubble = document.createElement('div');
        bubble.classList.add('chat-bubble');
        
        // Parse markdown-like formatting
        const formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/• /g, '&bull; ')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: var(--color-accent); text-decoration: underline;">$1</a>');
        
        bubble.innerHTML = `<p>${formatted}</p>`;
        messageDiv.appendChild(bubble);
        chatbotMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('chat-message', 'bot');
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        `;
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function removeTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    // Auto-open after delay on first visit
    if (!sessionStorage.getItem('vicometal_chat_opened')) {
        setTimeout(() => {
            if (!chatbot.classList.contains('open')) {
                // Just show the badge pulse, don't auto-open
                sessionStorage.setItem('vicometal_chat_opened', 'true');
            }
        }, 10000);
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatbot.classList.contains('open')) {
            chatbot.classList.remove('open');
        }
    });

})();
