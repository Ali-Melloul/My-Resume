/* =========================================================
   SKILLS PAGE ANIMATIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /*
     * ---------------------------------------------
     * SCROLL REVEAL
     * ---------------------------------------------
     */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries, observerInstance) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observerInstance.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        revealElements.forEach(element => {
            observer.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /*
     * ---------------------------------------------
     * SUBTLE CARD TILT
     * ---------------------------------------------
     *
     * Only enabled on desktop.
     * Keeps the effect subtle so the page remains
     * professional.
     */

    const canHover =
        window.matchMedia("(hover: hover)").matches &&
        window.innerWidth > 900;

    if (canHover) {

        const cards = document.querySelectorAll(
            ".language-card, .expertise-card, .tool-feature"
        );

        cards.forEach(card => {

            card.addEventListener("mousemove", event => {

                const rect = card.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width;

                const y =
                    (event.clientY - rect.top) /
                    rect.height;

                const rotateX = (0.5 - y) * 4;
                const rotateY = (x - 0.5) * 4;

                card.style.transform =
                    `translateY(-6px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            });


            card.addEventListener("mouseleave", () => {

                card.style.transform = "";

            });

        });

    }


    /*
     * ---------------------------------------------
     * TOOL CHIP MAGNETIC EFFECT
     * ---------------------------------------------
     */

    if (canHover) {

        const tools = document.querySelectorAll(".skill-tool");

        tools.forEach(tool => {

            tool.addEventListener("mousemove", event => {

                const rect = tool.getBoundingClientRect();

                const x =
                    event.clientX - rect.left - rect.width / 2;

                const y =
                    event.clientY - rect.top - rect.height / 2;

                tool.style.transform =
                    `translate(${x * 0.08}px, ${y * 0.08}px) translateY(-3px)`;

            });

            tool.addEventListener("mouseleave", () => {

                tool.style.transform = "";

            });

        });

    }


    /*
     * ---------------------------------------------
     * LANGUAGE CARD FLOATING EFFECT
     * ---------------------------------------------
     */

    const languageCards =
        document.querySelectorAll(".language-card");

    languageCards.forEach((card, index) => {

        const delay = index * 350;

        setTimeout(() => {

            card.style.setProperty(
                "--float-delay",
                `${delay}ms`
            );

        }, delay);

    });


    /*
     * ---------------------------------------------
     * SECTION HEADING LINE ANIMATION
     * ---------------------------------------------
     */

    const sectionHeadings =
        document.querySelectorAll(".section-heading");

    const headingObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "heading-visible"
                        );

                    }

                });

            },
            {
                threshold: 0.5
            }
        );

    sectionHeadings.forEach(heading => {
        headingObserver.observe(heading);
    });


    /*
     * ---------------------------------------------
     * SOFT SKILLS ACTIVE STATE
     * ---------------------------------------------
     */

    const softSkills =
        document.querySelectorAll(".soft-skill");

    softSkills.forEach(skill => {

        skill.addEventListener("mouseenter", () => {

            softSkills.forEach(other => {

                if (other !== skill) {
                    other.style.opacity = "0.45";
                }

            });

        });

        skill.addEventListener("mouseleave", () => {

            softSkills.forEach(other => {
                other.style.opacity = "";
            });

        });

    });


    /*
     * ---------------------------------------------
     * HERO ORBIT RESPONSE TO MOUSE
     * ---------------------------------------------
     */

    const orbit =
        document.querySelector(".career-orbit");

    if (orbit && canHover) {

        orbit.addEventListener("mousemove", event => {

            const rect =
                orbit.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width -
                0.5;

            const y =
                (event.clientY - rect.top) /
                rect.height -
                0.5;

            orbit.style.transform =
                `translate(${x * 8}px, ${y * 8}px)`;

        });

        orbit.addEventListener("mouseleave", () => {

            orbit.style.transform = "";

        });

    }

});