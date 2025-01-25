/*
    Name : Mike Melchior
    Student ID: 100603864
    Date of Completion: Jan 26 / 2025
 */

'use strict';

/**
 * IFFY function to run page specific functions
 */
(function() {

    const displayHomePage = () => {
        console.log("calling displayHomePage");
        let link = document.querySelector("a.home");
        link.classList.add("active");

        let getInvolvedButton = document.getElementById("getInvolvedButton");
        getInvolvedButton.addEventListener("click", () => {
            console.log("getInvolvedButton clicked");
            location.href = "./opportunities.html";
        })
    }

    const displayAboutPage = () => {
        console.log("calling displayAboutPage");
        let link = document.querySelector("a.about");
        link.classList.add("active");
    }

    const displayContactPage = () => {
        console.log("calling displayContactPage");
        let link = document.querySelector("a.contact");
        link.classList.add("active");

        let form = document.getElementById("contactForm");
        form.onsubmit = (e) => {
            e.preventDefault();
            validateContactForm();

            // redirect user after 5 seconds
            setTimeout(() => {
                location.href = "./index.html";
            }, 5000)
        }
    }

    const displayEventsPage = () => {
        console.log("calling displayEventsPage");
        let link = document.querySelector("a.events");
        link.classList.add("active");

        createEventsCalendar();

        // give each drop down item a click event to change calendar
        let dropdownAllEvents = document.getElementById("ddAll")
        dropdownAllEvents.addEventListener("click", (e) => {
            document.getElementById("eventDropdownButton").textContent = "All Events";
            createEventsCalendar("All Events")
        })

        let dropdownWorkshop = document.getElementById("ddWorkshop")
        dropdownWorkshop.addEventListener("click", () => {
            document.getElementById("eventDropdownButton").textContent = "Workshop Events";
            createEventsCalendar("Workshop")
        })

        let dropdownCleanup = document.getElementById("ddCleanup")
        dropdownCleanup.addEventListener("click", () => {
            document.getElementById("eventDropdownButton").textContent = "Cleanup Events";
            createEventsCalendar("Cleanup")
        })

        let dropdownCharity = document.getElementById("ddCharity")
        dropdownCharity.addEventListener("click", () => {
            document.getElementById("eventDropdownButton").textContent = "Charity Events";
            createEventsCalendar("Charity")
        })
    }

    const displayOpportunitiesPage = () => {
        console.log("calling displayOpportunitiesPage");
        let link = document.querySelector("a.opportunities");
        link.classList.add("active");
        displayOpportunities();
    }

    const displayPolicyPage = () => {
        console.log("calling displayPolicyPage");
    }

    const displayTosPage = () => {
        console.log("calling displayTosPage");
    }

    const displayDonationPage = () => {
        console.log("calling displayDonationPage");
    }

    const Start = () => {
        console.log('Starting app...');

        switch (document.title) {
            case "Home":
                displayHomePage();
                break;
            case "Events":
                displayEventsPage();
                break;
            case "Opportunities":
                displayOpportunitiesPage();
                break;
            case "Contact Us":
                displayContactPage();
                break;
            case "About Us":
                displayAboutPage();
                break;
            case "Privacy Policy":
                displayPolicyPage();
                break;
            case "Terms of Service":
                displayTosPage();
                break;
            case "Donate":
                displayDonationPage();
                break;
            default:
                break;
        }

        addDonateLink();
        // change opportunities link text
        document.querySelector(".opportunities").textContent = "Volunteer Now"
        createFooter();
        createBackToTopButton();

    }

    window.addEventListener('load', Start);

})();

const createBackToTopButton = () => {
    let button = document.createElement("button");
    button.classList.add("btn", "btn-secondary");
    button.id = "backToTop";
    button.textContent = "Back to Top";
    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            button.style.display = 'block';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        } else {
            button.style.opacity = '0';
            button.style.transform = 'translateY(20px)';
            setTimeout(() => {
                button.style.display = 'none';
            }, 300); // Match the transition duration
        }
    });

    // Smoothly scroll to the top when the button is clicked
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

/**
 * programmatically add donate link to navbar
 */
const addDonateLink = () =>{
    let navbar = document.querySelector(".navbar-nav");

    let donateLink = document.createElement("li");
    donateLink.classList.add("nav-item");

    let link = document.createElement("a");
    link.classList.add("nav-link", "donate")
    link.setAttribute("href", "./donate.html");
    link.textContent = "Donate";
    donateLink.appendChild(link);
    navbar.appendChild(donateLink);
}

/**
 * function to add sticky footer with links
 */
const createFooter = () => {
    const footer = document.createElement("footer");
    footer.style.position = "fixed";
    footer.style.bottom = "0";
    footer.style.width = "100%";
    footer.style.backgroundColor = "#222"
    footer.classList.add("text-center");

    let container = document.createElement("div");
    container.innerHTML = `<a href="/tos.html">Terms of Service</a> | <a href="/policy.html">Privacy Policy</a>`;

    footer.appendChild(container);
    document.body.appendChild(footer);
}

const volunteerOpportunities = [
    {
        title: "Community Clean-Up",
        description: "Join us in cleaning up the local park and surrounding areas.",
        dateTime: "2025-02-15 10:00 AM",
        category: "Cleanup"
    },
    {
        title: "Food Drive Assistant",
        description: "Help organize and distribute food donations to families in need.",
        dateTime: "2025-02-20 9:00 AM",
        category: "Charity"
    },
    {
        title: "Animal Shelter Volunteer",
        description: "Assist with feeding, cleaning, and caring for animals at the shelter.",
        dateTime: "2025-01-28 10:00 AM",
        category: "Cleanup",
    },
    {
        title: "Senior Center Companion",
        description: "Spend time with seniors, play games, and help with activities.",
        dateTime: "2025-01-30 10:00 AM",
        category: "Workshop",
    },
    {
        title: "Tree Planting Event",
        description: "Help plant trees and contribute to a greener community.",
        dateTime: "2025-03-05 8:00 AM",
        category: "Workshop"
    },
    {
        title: "Literacy Tutor",
        description: "Support children in improving their reading and writing skills.",
        dateTime: "2025-03-10 5:00 PM",
        category: "Workshop"
    },
];

/**
 * function to loop through opportunities and display them as 'cards'
 */
const displayOpportunities = ()=> {

    const container = document.getElementById("opportunitiesContainer");

    volunteerOpportunities.forEach((opportunity, index) => {
        // Create card elements
        const card = document.createElement("div");
        card.className = "card m-4 text-center";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const title = document.createElement("h5");
        title.className = "card-title";
        title.textContent = opportunity.title;

        const description = document.createElement("p");
        description.className = "card-text";
        description.textContent = opportunity.description;

        const dateTime = document.createElement("p");
        dateTime.className = "card-text text-muted";
        dateTime.textContent = `Date & Time: ${opportunity.dateTime}`;

        const signUpButton = document.createElement("button");
        signUpButton.className = "btn btn-primary";
        signUpButton.textContent = "Sign Up";
        signUpButton.setAttribute("data-bs-toggle", "modal");
        signUpButton.setAttribute("data-bs-target", "#signUpModal");
        signUpButton.onclick = () => openSignUpModal(index);

        // Append elements to card
        cardBody.appendChild(title);
        cardBody.appendChild(description);
        cardBody.appendChild(dateTime);
        cardBody.appendChild(signUpButton);
        card.appendChild(cardBody);
        container.appendChild(card);

        // add scroll reveal functionality to cards
        try {
            const sr = ScrollReveal();
            sr.reveal('.card', {
                distance: '60px',
                duration: 1500,
                delay: 200  });
        } catch (e) {
            console.error(e);
        }
    });
}

/**
 * Function to open the modal and populate it with opportunity data
  */
const openSignUpModal = (index) => {
    const modalTitle = document.getElementById("modalTitle");
    modalTitle.textContent = `Sign Up for: ${volunteerOpportunities[index].title}`;

    const modalDescription = document.getElementById("modalDescription");
    modalDescription.textContent = volunteerOpportunities[index].description;

    const modalDate = document.getElementById("modalDate");
    modalDate.textContent = volunteerOpportunities[index].dateTime;

    const form = document.getElementById("signUpForm");
    form.onsubmit = (e) => {
        e.preventDefault();
        validateSignUpForm();
    };
}

/**
* Function to validate sign up form for volunteer opportunities
  */
const validateSignUpForm = () => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("preferredRole").value;

    if (!name || !email || !role) {
        return;
    }

    document.getElementById("confirmationMessage").textContent = "Thank you for signing up! We will contact you soon.";
    document.getElementById("signUpForm").reset();
}

/**
 * Function to validate the contact form
 */
const validateContactForm = () => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    if (!name || !email || !message) {
        return;
    }

    document.getElementById("confirmationMessage").textContent = "Thank you for contacting us, you will be redirected to the home page shortly.";
    document.getElementById("contactForm").reset();
}

/**
 * create a calendar for the events page
 */
const createEventsCalendar = (category = null) => {

    const calendarDays = document.getElementById('calendarDays');
    const monthYear = document.getElementById('monthYear');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');

    let currentDate = new Date();

    function renderCalendar() {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        // Set the header
        monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

        // Clear previous calendar days
        calendarDays.innerHTML = '';

        // Days of the week header
        const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        daysOfWeek.forEach(day => {
            const headerDiv = document.createElement('div');
            headerDiv.textContent = day;
            headerDiv.classList.add('header');
            calendarDays.appendChild(headerDiv);
        });

        // First day of the month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Fill empty slots before the first day
        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement('div');
            calendarDays.appendChild(emptyDiv);
        }

        // Filter events
        let volunteerOpportunitiesFiltered = volunteerOpportunities;
        if (category !== null && category !== "All Events") {
            volunteerOpportunitiesFiltered = volunteerOpportunities.filter((o) => {
                return o.category === category;
            });
        }

        // Fill days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = day;
            dayDiv.classList.add('day', `${day}`);

            // Highlight today
            const today = new Date();
            if (
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                dayDiv.classList.add('today');
            }

            calendarDays.appendChild(dayDiv);

            // color event days and give them event listener to open modal
            volunteerOpportunitiesFiltered.forEach(o => {
                if (day === new Date(o.dateTime).getDate() && month === new Date(o.dateTime).getMonth() &&
                    year === new Date(o.dateTime).getFullYear()) {
                    dayDiv.style.backgroundColor = "pink"
                    dayDiv.addEventListener('click', () => {
                        dayDiv.setAttribute("data-bs-toggle", "modal");
                        dayDiv.setAttribute("data-bs-target", "#eventModal");
                        openEventModal(o);
                    })
                }
            })
        }

    }

    // Event listeners for navigation
    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Initial render
    renderCalendar();
}

/**
 * function to open event modal filled with information about event that is passed to function
 * @param event
 */
const openEventModal = (event) => {
    const modalTitle = document.getElementById("modalTitle");
    modalTitle.textContent = `Sign Up for: ${event.title}`;

    const modalDescription = document.getElementById("modalDescription");
    modalDescription.textContent = event.description;

    const modalDate = document.getElementById("modalDate");
    modalDate.textContent = event.dateTime;

    const modalSignUpButton = document.getElementById("signUp");
    modalSignUpButton.addEventListener("click", () => {
        location.href = "/opportunities.html";
    })
}