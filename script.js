/* =========================================
   APEX - FUNCIONES E INTERACCIONES
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // 0. DESPLAZAMIENTO SUAVE AL INICIO ABSOLUTO
    const homeLinks = document.querySelectorAll('a[href="#inicio"]');

    homeLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            // Si el menú móvil está abierto, ciérralo al hacer clic
            const navLinks = document.getElementById("nav-links");
            const menuToggle = document.getElementById("menu-toggle");
            if (navLinks && navLinks.classList.contains("open")) {
                navLinks.classList.remove("open");
                if (menuToggle) {
                    menuToggle.setAttribute("aria-expanded", "false");
                    menuToggle.setAttribute("aria-label", "Abrir menú");
                }
            }
        });
    });


    // 1. MENÚ RESPONSIVE

    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    function closeMenu() {
        if (!navLinks || !menuToggle) return;
        navLinks.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Cerrar menú" : "Abrir menú"
            );
        });

        // Cerrar el menú al elegir una sección (excepto los de inicio que ya manejan su lógica arriba).
        navLinks.querySelectorAll("a").forEach(link => {
            if (link.getAttribute("href") !== "#inicio") {
                link.addEventListener("click", closeMenu);
            }
        });
    }

    // Cerrar el menú al ampliar la ventana.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeMenu();
        }
    });


    // 2. ANIMACIONES AL DESPLAZARSE

    const revealElements = document.querySelectorAll(".reveal");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        "IntersectionObserver" in window &&
        !prefersReducedMotion
    ) {
        const observer = new IntersectionObserver(
            (entries, currentObserver) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");

                        currentObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(element => {
            observer.observe(element);
        });

    } else {
        // Mostrar el contenido si las animaciones no están disponibles.
        revealElements.forEach(element => {
            element.classList.add("visible");
        });
    }


    // 3. AÑO AUTOMÁTICO DEL PIE DE PÁGINA

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // 4. BOTONES DE CONSULTA DE LOS PLANES

    const contactButtons = document.querySelectorAll(".contact-plan");

    const contactEmail = "apex.soporte.co@gmail.com";

    contactButtons.forEach(button => {

        const plan = button.dataset.plan;

        if (!plan) {
            return;
        }

        const subject = `Información sobre ${plan}`;

        const gmailUrl =
            "https://mail.google.com/mail/?view=cm" +
            "&fs=1" +
            "&to=" + encodeURIComponent(contactEmail) +
            "&su=" + encodeURIComponent(subject);

        const mailtoUrl =
            "mailto:" + contactEmail +
            "?subject=" + encodeURIComponent(subject);

        // Gmail se abre en una pestaña nueva.
        button.href = gmailUrl;
        button.target = "_blank";
        button.rel = "noopener noreferrer";

        // Alternativa para quien prefiera su aplicación de correo.
        button.addEventListener("contextmenu", () => {
            button.dataset.alternativeEmail = mailtoUrl;
        });

    });

});