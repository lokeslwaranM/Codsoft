/* ================= MOBILE MENU ================= */

const menuBtn = document.getElementById("menuBtn");

const navLinks = document.getElementById("navLinks");


menuBtn.addEventListener("click", function () {

    navLinks.classList.toggle("active");


    if (navLinks.classList.contains("active")) {

        menuBtn.textContent = "✕";

    } else {

        menuBtn.textContent = "☰";

    }

});


/* CLOSE MENU AFTER CLICK */

document.querySelectorAll(".nav-links a")
    .forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("active");

            menuBtn.textContent = "☰";

        });

    });



/* ================= CONTACT FORM ================= */

const contactForm =
    document.getElementById("contactForm");


contactForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document.getElementById("name")
                .value.trim();


        const email =
            document.getElementById("email")
                .value.trim();


        const subject =
            document.getElementById("subject")
                .value.trim();


        const message =
            document.getElementById("message")
                .value.trim();


        const nameError =
            document.getElementById("nameError");


        const emailError =
            document.getElementById("emailError");


        const subjectError =
            document.getElementById("subjectError");


        const messageError =
            document.getElementById("messageError");


        const formMessage =
            document.getElementById("formMessage");


        nameError.textContent = "";

        emailError.textContent = "";

        subjectError.textContent = "";

        messageError.textContent = "";

        formMessage.textContent = "";


        let valid = true;


        /* NAME */

        if (name === "") {

            nameError.textContent =
                "Please enter your name.";

            valid = false;

        }

        else if (name.length < 3) {

            nameError.textContent =
                "Name must contain at least 3 characters.";

            valid = false;

        }


        /* EMAIL */

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (email === "") {

            emailError.textContent =
                "Please enter your email.";

            valid = false;

        }

        else if (!emailPattern.test(email)) {

            emailError.textContent =
                "Please enter a valid email address.";

            valid = false;

        }


        /* SUBJECT */

        if (subject === "") {

            subjectError.textContent =
                "Please enter a subject.";

            valid = false;

        }

        else if (subject.length < 3) {

            subjectError.textContent =
                "Subject must contain at least 3 characters.";

            valid = false;

        }


        /* MESSAGE */

        if (message === "") {

            messageError.textContent =
                "Please enter your message.";

            valid = false;

        }

        else if (message.length < 10) {

            messageError.textContent =
                "Message must contain at least 10 characters.";

            valid = false;

        }


        /* SUCCESS */

        if (valid) {

            formMessage.textContent =
                "Message validated successfully!";

            formMessage.style.color = "green";

            contactForm.reset();

        }

        else {

            formMessage.textContent =
                "Please correct the errors above.";

            formMessage.style.color = "red";

        }

    }
);



/* ================= SCROLL ANIMATION ================= */

const animatedElements =
    document.querySelectorAll(
        ".skill-card, .project-card, .about-container"
    );


const observer =
    new IntersectionObserver(

        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                }

            });

        },

        {
            threshold: 0.15
        }

    );


animatedElements.forEach(function (element) {

    element.style.opacity = "0";

    element.style.transform =
        "translateY(30px)";

    element.style.transition =
        "opacity 0.7s ease, transform 0.7s ease";

    observer.observe(element);

});