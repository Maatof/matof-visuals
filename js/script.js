// =============================
// IDIOMA
// =============================

const languageButtons = document.querySelectorAll(".language");

const translatableElements = document.querySelectorAll(
    "[data-es][data-en]"
);


function changeLanguage(language) {

    translatableElements.forEach(element => {

        element.textContent = element.dataset[language];

    });


    languageButtons.forEach(button => {

        button.classList.remove("active");

        if (button.dataset.lang === language) {

            button.classList.add("active");

        }

    });


    document.documentElement.lang = language;

    updateMenuButtonText();

    localStorage.setItem("language", language);

}


languageButtons.forEach(button => {

    button.addEventListener("click", () => {

        changeLanguage(button.dataset.lang);

    });

});


const savedLanguage = localStorage.getItem("language");

changeLanguage(savedLanguage || "es");



// =============================
// PREVIEW DE PROYECTOS
// HOME
// =============================

const activeProjectMediaElements = document.querySelectorAll(
    ".project-media:not(.project-media-coming-soon)"
);


activeProjectMediaElements.forEach(project => {

    const video = project.querySelector(".project-video");

    if (!video) return;


    project.addEventListener("mouseenter", () => {

        video.play().catch(() => {});

    });


    project.addEventListener("mouseleave", () => {

        video.pause();

        video.currentTime = 0;

    });

});



// =============================
// ANIMACIONES AL HACER SCROLL
// =============================

const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right"
);


if (revealElements.length > 0) {

    const revealObserver = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.15
        }

    );


    revealElements.forEach(element => {

        revealObserver.observe(element);

    });

}



// =============================
// NAVBAR AL HACER SCROLL
// =============================

const navbar = document.querySelector(".navbar");


if (navbar) {

    function updateNavbar() {

        if (window.scrollY > 50) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    }


    window.addEventListener("scroll", updateNavbar);

    updateNavbar();

}



// =============================
// SECCION ACTIVA EN NAVBAR
// SOLO HOME
// =============================

const sections = document.querySelectorAll(
    "#work, #services, #about, #contact"
);

const navLinks = document.querySelectorAll(".desktop-nav a");


if (sections.length > 0 && navLinks.length > 0) {

    const sectionObserver = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const id = entry.target.id;


                    navLinks.forEach(link => {

                        link.classList.remove("active");


                        if (link.getAttribute("href") === `#${id}`) {

                            link.classList.add("active");

                        }

                    });

                }

            });

        },

        {
            threshold: 0,

            rootMargin: "-40% 0px -50% 0px"
        }

    );


    sections.forEach(section => {

        sectionObserver.observe(section);

    });

}

function updateMenuButtonText() {

    const buttonText = document.querySelector(".menu-button span");
    const menu = document.querySelector(".mobile-menu");

    if (!buttonText || !menu) return;

    const language = document.documentElement.lang || "es";
    const menuIsOpen = menu.classList.contains("active");

    if (language === "es") {
        buttonText.textContent = menuIsOpen ? "CERRAR" : "MENÚ";
    } else {
        buttonText.textContent = menuIsOpen ? "CLOSE" : "MENU";
    }

}

// =============================
// MOBILE MENU
// =============================

const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");


if (menuButton && mobileMenu) {

    menuButton.addEventListener("click", () => {

        mobileMenu.classList.toggle("active");

        const menuIsOpen =
            mobileMenu.classList.contains("active");

        document.body.style.overflow =
            menuIsOpen ? "hidden" : "";

        updateMenuButtonText();

    });


    mobileNavLinks.forEach(link => {

        link.addEventListener("click", () => {

            mobileMenu.classList.remove("active");

            document.body.style.overflow = "";

            updateMenuButtonText();

        });

    });


    updateMenuButtonText();

}



// =============================
// CUSTOM CURSOR
// =============================

const customCursor = document.querySelector(".custom-cursor");


if (customCursor) {

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let cursorX = mouseX;
    let cursorY = mouseY;


    document.addEventListener("mousemove", event => {

        mouseX = event.clientX;
        mouseY = event.clientY;

        // Recuperar el cursor al volver a la página
        customCursor.classList.remove("cursor-hidden");

    });


    function animateCursor() {

        cursorX += (mouseX - cursorX) * 0.15;

        cursorY += (mouseY - cursorY) * 0.15;


        customCursor.style.left = `${cursorX}px`;

        customCursor.style.top = `${cursorY}px`;


        requestAnimationFrame(animateCursor);

    }


    animateCursor();



    // CURSOR GRANDE SOBRE PROYECTOS DE LA HOME

    activeProjectMediaElements.forEach(project => {

        project.addEventListener("mouseenter", () => {

            customCursor.classList.add("project-hover");

        });


        project.addEventListener("mouseleave", () => {

            customCursor.classList.remove("project-hover");

        });

    });

}

// =============================
// CONTACT FORM
// =============================

const contactForm = document.querySelector(".contact-form");

const formStatus = document.querySelector(".form-status");


if (contactForm && formStatus) {

    contactForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const submitButton =
            contactForm.querySelector(".form-submit");

        const submitText =
            submitButton.querySelector("span:first-child");

        const language =
            document.documentElement.lang || "es";


        submitButton.disabled = true;


        submitText.textContent =
            language === "es"
                ? "ENVIANDO..."
                : "SENDING...";


        formStatus.textContent = "";

        formStatus.classList.remove(
            "success",
            "error"
        );


        try {

            const response = await fetch(
                contactForm.action,
                {
                    method: "POST",

                    body: new FormData(contactForm),

                    headers: {
                        "Accept": "application/json"
                    }
                }
            );


            if (response.ok) {

                formStatus.textContent =
                    language === "es"
                        ? "¡Mensaje enviado! Me pondré en contacto con vos pronto."
                        : "Message sent! I'll get back to you soon.";

                formStatus.classList.add("success");

                contactForm.reset();

            } else {

                throw new Error("Form submission failed");

            }

        } catch (error) {

            formStatus.textContent =
                language === "es"
                    ? "No se pudo enviar el mensaje. Probá nuevamente."
                    : "The message couldn't be sent. Please try again.";

            formStatus.classList.add("error");

        }


        submitButton.disabled = false;


        submitText.textContent =
            language === "es"
                ? "ENVIAR CONSULTA"
                : "SEND INQUIRY";

    });

}