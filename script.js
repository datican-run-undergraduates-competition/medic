// DOM Elements
const navMenu = document.getElementById("nav-menu")
const navToggle = document.getElementById("nav-toggle")
const navClose = document.getElementById("nav-close")
const navLinks = document.querySelectorAll(".nav__link")
const sections = document.querySelectorAll("section[id]")
const scrollTopBtn = document.getElementById("scroll-top")
const contactForm = document.getElementById("contact-form")
const statNumbers = document.querySelectorAll(".stat__number")

// Mobile Navigation
function showMenu() {
  navMenu.classList.add("show-menu")
  document.body.style.overflow = "hidden"
}

function hideMenu() {
  navMenu.classList.remove("show-menu")
  document.body.style.overflow = "auto"
}

// Event Listeners for Mobile Menu
if (navToggle) {
  navToggle.addEventListener("click", showMenu)
}

if (navClose) {
  navClose.addEventListener("click", hideMenu)
}

// Close menu when clicking on nav links
navLinks.forEach((link) => {
  link.addEventListener("click", hideMenu)
})

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
    hideMenu()
  }
})

// Active Link Highlighting
function highlightActiveLink() {
  const scrollY = window.pageYOffset

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight
    const sectionTop = section.offsetTop - 100
    const sectionId = section.getAttribute("id")
    const correspondingLink = document.querySelector(`.nav__link[href*=${sectionId}]`)

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      correspondingLink?.classList.add("active-link")
    } else {
      correspondingLink?.classList.remove("active-link")
    }
  })
}

// Scroll to Top Button
function toggleScrollTopButton() {
  if (window.scrollY >= 400) {
    scrollTopBtn.classList.add("show")
  } else {
    scrollTopBtn.classList.remove("show")
  }
}

// Smooth Scroll for Navigation Links
function smoothScroll() {
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const headerHeight = document.querySelector(".header").offsetHeight
        const targetPosition = targetSection.offsetTop - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })
}

// Scroll to Top Functionality
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
}

// Animated Counter for Statistics
function animateCounters() {
  const observerOptions = {
    threshold: 0.7,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target
        const target = Number.parseInt(counter.getAttribute("data-target"))
        const increment = target / 100
        let current = 0

        const updateCounter = () => {
          if (current < target) {
            current += increment
            counter.textContent = Math.ceil(current)
            setTimeout(updateCounter, 20)
          } else {
            counter.textContent = target
          }
        }

        updateCounter()
        observer.unobserve(counter)
      }
    })
  }, observerOptions)

  statNumbers.forEach((counter) => {
    observer.observe(counter)
  })
}

// Fade In Animation on Scroll
function fadeInOnScroll() {
  const fadeElements = document.querySelectorAll(".service__card, .contact__item")

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in", "show")
      }
    })
  }, observerOptions)

  fadeElements.forEach((element) => {
    element.classList.add("fade-in")
    observer.observe(element)
  })
}

// Contact Form Handling
function handleContactForm() {
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const formData = new FormData(contactForm)
      const formObject = {}
      formData.forEach((value, key) => {
        formObject[key] = value
      })

      // Show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.textContent = "Sending..."
      submitBtn.disabled = true

      // Simulate form submission (replace with actual form handling)
      setTimeout(() => {
        // Show success message
        showNotification("Message sent successfully! We'll get back to you soon.", "success")

        // Reset form
        contactForm.reset()

        // Reset button
        submitBtn.textContent = originalText
        submitBtn.disabled = false
      }, 2000)
    })
  }
}

// Notification System
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification--${type}`
  notification.innerHTML = `
        <div class="notification__content">
            <span class="notification__message">${message}</span>
            <button class="notification__close">&times;</button>
        </div>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `

  // Add to DOM
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Close functionality
  const closeBtn = notification.querySelector(".notification__close")
  closeBtn.addEventListener("click", () => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => notification.remove(), 300)
  })

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => notification.remove(), 300)
    }
  }, 5000)
}

// Header Background on Scroll
function updateHeaderBackground() {
  const header = document.querySelector(".header")
  if (window.scrollY > 100) {
    header.style.backgroundColor = "rgba(255, 255, 255, 0.98)"
    header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
  } else {
    header.style.backgroundColor = "rgba(255, 255, 255, 0.95)"
    header.style.boxShadow = "none"
  }
}

// Parallax Effect for Hero Section
function parallaxEffect() {
  const heroBlob = document.querySelector(".hero__blob")
  if (heroBlob) {
    const scrolled = window.pageYOffset
    const rate = scrolled * -0.5
    heroBlob.style.transform = `translateY(${rate}px)`
  }
}

// Keyboard Navigation
function handleKeyboardNavigation() {
  document.addEventListener("keydown", (e) => {
    // ESC key to close mobile menu
    if (e.key === "Escape" && navMenu.classList.contains("show-menu")) {
      hideMenu()
    }

    // Enter key on scroll-to-top button
    if (e.key === "Enter" && document.activeElement === scrollTopBtn) {
      scrollTopBtn.click()
    }
  })
}

// Performance Optimization - Throttle Scroll Events
function throttle(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Scroll Event Listener with Throttling
const throttledScrollHandler = throttle(() => {
  highlightActiveLink()
  toggleScrollTopButton()
  updateHeaderBackground()
  parallaxEffect()
}, 16) // ~60fps

// Initialize Everything
function init() {
  // Set up smooth scrolling
  smoothScroll()

  // Initialize animations
  animateCounters()
  fadeInOnScroll()

  // Set up form handling
  handleContactForm()

  // Set up keyboard navigation
  handleKeyboardNavigation()

  // Add scroll event listener
  window.addEventListener("scroll", throttledScrollHandler)

  // Initial calls
  highlightActiveLink()
  toggleScrollTopButton()
  updateHeaderBackground()

  console.log("🚀 WebCraft Studio website initialized successfully!")
}

// Wait for DOM to be fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init)
} else {
  init()
}

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Page is hidden - pause animations if needed
    console.log("Page hidden - pausing animations")
  } else {
    // Page is visible - resume animations
    console.log("Page visible - resuming animations")
  }
})

// Error handling for images
document.addEventListener(
  "error",
  (e) => {
    if (e.target.tagName === "IMG") {
      console.warn("Image failed to load:", e.target.src)
      e.target.style.display = "none"
    }
  },
  true,
)

// Service Worker Registration (for PWA capabilities)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
