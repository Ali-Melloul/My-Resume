/* =========================================================
   HOME PAGE ANIMATIONS
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
     * HERO ORBIT RESPONSE TO MOUSE
     * ---------------------------------------------
     */

    const canHover =
        window.matchMedia("(hover: hover)").matches &&
        window.innerWidth > 900;

    const orbit =
        document.querySelector(".home-orbit");

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