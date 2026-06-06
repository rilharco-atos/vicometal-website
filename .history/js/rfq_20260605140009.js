/* ============================================
   VICOMETAL — RFQ Form Logic
   Drag & drop, file validation, form submit
   ============================================ */

(function() {
    'use strict';

    const form = document.getElementById('rfqForm');
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const uploadFiles = document.getElementById('uploadFiles');

    if (!form || !uploadZone) return;

    let files = [];
    const MAX_SIZE = 500 * 1024 * 1024; // 500 MB
    const ALLOWED_EXTENSIONS = ['.pdf', '.dwg', '.dxf', '.step', '.stp', '.ifc', '.zip', '.rar', '.7z', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.png'];

    // --- Drag & Drop ---
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
        uploadZone.addEventListener(event, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    ['dragenter', 'dragover'].forEach(event => {
        uploadZone.addEventListener(event, () => {
            uploadZone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(event => {
        uploadZone.addEventListener(event, () => {
            uploadZone.classList.remove('dragover');
        });
    });

    uploadZone.addEventListener('drop', (e) => {
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    });

    fileInput.addEventListener('change', (e) => {
        const selectedFiles = Array.from(e.target.files);
        handleFiles(selectedFiles);
        fileInput.value = ''; // Reset
    });

    function handleFiles(newFiles) {
        newFiles.forEach(file => {
            const ext = '.' + file.name.split('.').pop().toLowerCase();
            
            if (!ALLOWED_EXTENSIONS.includes(ext)) {
                showNotification(`Formato não suportado: ${ext}`, 'error');
                return;
            }

            if (file.size > MAX_SIZE) {
                showNotification(`Ficheiro demasiado grande: ${file.name}`, 'error');
                return;
            }

            // Check duplicates
            if (files.some(f => f.name === file.name && f.size === file.size)) {
                return;
            }

            files.push(file);
        });

        renderFiles();
    }

    function renderFiles() {
        uploadFiles.innerHTML = '';
        
        files.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'upload-file-item';
            item.innerHTML = `
                <span class="file-name">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
                    ${escapeHtml(file.name)}
                </span>
                <span class="file-size">${formatFileSize(file.size)}</span>
                <span class="file-remove" data-index="${index}">✕</span>
            `;
            uploadFiles.appendChild(item);
        });

        // Remove handlers
        uploadFiles.querySelectorAll('.file-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                files.splice(index, 1);
                renderFiles();
            });
        });
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // --- Form Submission ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate required fields
        const required = form.querySelectorAll('[required]');
        let valid = true;

        required.forEach(field => {
            const parent = field.closest('.form-field') || field.closest('.form-checkbox');
            const existingError = parent?.querySelector('.error-message');
            if (existingError) existingError.remove();
            parent?.classList.remove('error');

            if (!field.value.trim() && field.type !== 'checkbox') {
                valid = false;
                parent?.classList.add('error');
                const msg = document.createElement('span');
                msg.className = 'error-message';
                msg.textContent = 'Este campo é obrigatório';
                parent?.appendChild(msg);
            }

            if (field.type === 'checkbox' && !field.checked) {
                valid = false;
                parent?.classList.add('error');
            }

            if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
                valid = false;
                parent?.classList.add('error');
                const msg = document.createElement('span');
                msg.className = 'error-message';
                msg.textContent = 'Email inválido';
                parent?.appendChild(msg);
            }
        });

        if (!valid) {
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Simulate submission
        const submitBtn = form.querySelector('.rfq-submit');
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="loader-ring" style="width:20px;height:20px;border-width:2px;"></span>
            <span>A enviar...</span>
        `;

        setTimeout(() => {
            // Show success
            const wrapper = document.querySelector('.rfq-form-wrapper');
            wrapper.innerHTML = `
                <div class="form-success">
                    <div class="form-success-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                            <path d="M22 4L12 14.01l-3-3"/>
                        </svg>
                    </div>
                    <h2>Pedido Enviado com Sucesso!</h2>
                    <p>A nossa equipa irá analisar o seu pedido e responderá em até 48 horas úteis com uma proposta técnica detalhada.</p>
                    <br>
                    <a href="index.html" class="btn btn-primary">Voltar ao Início</a>
                </div>
            `;
            wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 2000);
    });

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showNotification(message, type) {
        if (typeof VToast !== 'undefined') {
            VToast.show(message, type === 'error' ? 'error' : 'info');
        }
    }
})();
