document.addEventListener('DOMContentLoaded', () => {

    // 1. EFFET MACHINE À ÉCRIRE SUR LE HERO
    const heroTitle = document.querySelector('.console-box p');
    if (heroTitle) {
        const text = heroTitle.innerText;
        heroTitle.innerText = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.innerText += text.charAt(i);
                i++;
                setTimeout(typeWriter, 15);
            }
        }
        typeWriter();
    }

    // 2. EFFET DE REVEAL AU SCROLL
    const cards = document.querySelectorAll('.terminal-card');
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });

    // 3. EFFET AUDIO RETRO (BEEP SUR LES BOUTONS & CARTES)
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    function playBeep(freq = 800, type = 'sine', duration = 0.05) {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }

    document.querySelectorAll('.cyber-btn, .node-card, nav a').forEach(element => {
        element.addEventListener('mouseenter', () => playBeep(1200, 'square', 0.03));
        element.addEventListener('click', () => playBeep(600, 'sawtooth', 0.08));
    });

    // 4. FILTRE DYNAMIQUE SUR LE TABLEAU E5 (Cible tes barres de recherche HTML)
    const filterInputs = document.querySelectorAll('input[type="text"]');
    
    filterInputs.forEach(input => {
        // Vérifie qu'il s'agit bien de la barre de recherche (basé sur le placeholder ou une classe)
        if (input.placeholder.includes('Filtrer') || input.classList.contains('cyber-filter-input')) {
            input.addEventListener('keyup', (e) => {
                const query = e.target.value.toLowerCase();
                // Sélectionne toutes les lignes du tableau E5
                const tableRows = document.querySelectorAll('table tr, tbody tr');
                
                tableRows.forEach(row => {
                    // Ignore les lignes d'en-tête (th)
                    if (row.querySelector('th')) return;
                    
                    const text = row.innerText.toLowerCase();
                    if (text.includes(query)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        }
    });

    // 5. LIGHTBOX / ZOOM ET NAVIGATION DES IMAGES (MODALE)
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const modalCaption = document.getElementById("modal-caption");
    const closeBtn = document.getElementById("modal-close") || document.querySelector(".modal-close");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    const images = Array.from(document.querySelectorAll(".zoomable-img"));
    let currentIndex = 0;

    function showImage(index) {
        if (images.length === 0) return;
        if (index < 0) {
            currentIndex = images.length - 1;
        } else if (index >= images.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        const selectedImg = images[currentIndex];
        if (modalImg && selectedImg) {
            modalImg.src = selectedImg.src;
            if (modalCaption) {
                const caption = selectedImg.closest('.media-preview')?.querySelector('.media-caption');
                modalCaption.innerHTML = caption ? caption.innerHTML : (selectedImg.alt || "");
            }
        }
    }

    images.forEach((img, index) => {
        img.addEventListener("click", () => {
            if (modal) {
                modal.style.display = "flex";
                showImage(index);
                playBeep(900, 'sine', 0.06);
            }
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            showImage(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            showImage(currentIndex + 1);
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            if (modal) modal.style.display = "none";
        });
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (modal && modal.style.display === "flex" || modal && modal.style.display === "block") {
            if (e.key === "ArrowLeft" && prevBtn) {
                showImage(currentIndex - 1);
            } else if (e.key === "ArrowRight" && nextBtn) {
                showImage(currentIndex + 1);
            } else if (e.key === "Escape") {
                modal.style.display = "none";
            }
        }
    });
});
