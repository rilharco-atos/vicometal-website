/* ============================================
   VICOMETAL — Portal Client Integration
   Connects login form to HeavyForge Platform API
   ============================================ */

(function () {
    'use strict';

    const form = document.getElementById('portalLoginForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('portal-email').value.trim();
        const password = document.getElementById('portal-password').value;
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!email || !password) {
            VToast.error('Preencha todos os campos.');
            return;
        }

        // Disable button during request
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>A autenticar...</span>';

        try {
            const response = await fetch(VICOMETAL_CONFIG.API_URL + '/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
            });

            if (!response.ok) {
                const data = await response.json().catch(function () { return {}; });
                throw new Error(data.message || 'Credenciais inválidas.');
            }

            const data = await response.json();

            // Redirect to platform with token
            const redirectUrl = VICOMETAL_CONFIG.PLATFORM_URL + '/auth/callback?token=' + encodeURIComponent(data.access_token);
            window.location.href = redirectUrl;

        } catch (err) {
            VToast.error(err.message || 'Erro ao autenticar. Tente novamente.');
            submitBtn.disabled = false;
            submitBtn.innerHTML =
                '<span>Entrar no Portal</span>' +
                '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        }
    });
})();
