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

    // 4. FILTRE DYNAMIQUE SUR LE TABLEAU E5
    const tableRows = document.querySelectorAll('.cyber-table tbody tr:not(.group-header)');
    const filterInput = document.createElement('input');
    
    filterInput.type = 'text';
    filterInput.placeholder = '🔍 Filtrer les réalisations / compétences...';
    filterInput.className = 'cyber-filter-input';

    const tableWrapper = document.querySelector('.download-container');
    if (tableWrapper) {
        tableWrapper.appendChild(filterInput);
    }

    filterInput.addEventListener('keyup', (e) => {
        const query = e.target.value.toLowerCase();
        tableRows.forEach(row => {
            const text = row.innerText.toLowerCase();
            if (text.includes(query)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // 5. LIGHTBOX / ZOOM DES IMAGES DU STAGE
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const captionText = document.getElementById("modal-caption");
    const closeBtn = document.querySelector(".modal-close");

    document.querySelectorAll('.zoomable-img').forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = "block";
            modalImg.src = this.src;
            const caption = this.closest('.media-preview')?.querySelector('.media-caption');
            captionText.innerHTML = caption ? caption.innerHTML : this.alt;
            playBeep(900, 'sine', 0.06);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = "none";
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.style.display === "block") {
            modal.style.display = "none";
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const modalCaption = document.getElementById("modal-caption");
    const closeBtn = document.getElementById("modal-close");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    // Récupère toutes les images cliquables du DOM
    const images = Array.from(document.querySelectorAll(".zoomable-img"));
    let currentIndex = 0;

    // Fonction pour afficher une image dans la modale
    function showImage(index) {
        if (index < 0) {
            currentIndex = images.length - 1;
        } else if (index >= images.length) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }

        const selectedImg = images[currentIndex];
        modalImg.src = selectedImg.src;
        modalCaption.textContent = selectedImg.alt || "";
    }

    // Ouvrir la modale au clic sur une image
    images.forEach((img, index) => {
        img.addEventListener("click", () => {
            modal.style.display = "flex";
            showImage(index);
        });
    });

    // Navigation avec les boutons
    prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showImage(currentIndex - 1);
    });

    nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showImage(currentIndex + 1);
    });

    // Fermeture de la modale
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // Navigation au clavier (Flèches gauche/droite + Échap)
    document.addEventListener("keydown", (e) => {
        if (modal.style.display === "flex") {
            if (e.key === "ArrowLeft") {
                showImage(currentIndex - 1);
            } else if (e.key === "ArrowRight") {
                showImage(currentIndex + 1);
            } else if (e.key === "Escape") {
                modal.style.display = "none";
            }
        }
    });
});
