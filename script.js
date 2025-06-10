// DOM Elements
const navMenu = document.getElementById("nav-menu")
const navToggle = document.getElementById("nav-toggle")
const navClose = document.getElementById("nav-close")
const navLinks = document.querySelectorAll(".nav__link")
const sections = document.querySelectorAll("section[id]")
const scrollTopBtn = document.getElementById("scroll-top")
const contactForm = document.getElementById("contact-form")
const statNumbers = document.querySelectorAll(".stat__number")

// Error handling utility
const handleError = (error, context) => {
  console.error(`Error in ${context}:`, error)
  showNotification(`An error occurred: ${error.message}`, "error")
}

// Mobile Navigation with improved accessibility
function showMenu() {
  try {
    navMenu.classList.add("show-menu")
    document.body.style.overflow = "hidden"
    navToggle.setAttribute("aria-expanded", "true")
  } catch (error) {
    handleError(error, "showMenu")
  }
}

function hideMenu() {
  try {
    navMenu.classList.remove("show-menu")
    document.body.style.overflow = "auto"
    navToggle.setAttribute("aria-expanded", "false")
  } catch (error) {
    handleError(error, "hideMenu")
  }
}

// Event Listeners for Mobile Menu with cleanup
function setupMobileMenu() {
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

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideMenu()
    }
  })
}

// Active Link Highlighting with performance optimization
function highlightActiveLink() {
  try {
    const scrollY = window.pageYOffset
    const headerHeight = document.querySelector(".header")?.offsetHeight || 0

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight
      const sectionTop = section.offsetTop - headerHeight - 100
      const sectionId = section.getAttribute("id")
      const correspondingLink = document.querySelector(`.nav__link[href*=${sectionId}]`)

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        correspondingLink?.classList.add("active-link")
      } else {
        correspondingLink?.classList.remove("active-link")
      }
    })
  } catch (error) {
    handleError(error, "highlightActiveLink")
  }
}

// Scroll to Top Button with improved performance
function toggleScrollTopButton() {
  try {
    if (window.scrollY >= 400) {
      scrollTopBtn?.classList.add("show")
    } else {
      scrollTopBtn?.classList.remove("show")
    }
  } catch (error) {
    handleError(error, "toggleScrollTopButton")
  }
}

// Smooth Scroll with improved error handling
function smoothScroll() {
  try {
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href")
        const targetSection = document.querySelector(targetId)

        if (targetSection) {
          const headerHeight = document.querySelector(".header")?.offsetHeight || 0
          const targetPosition = targetSection.offsetTop - headerHeight

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        }
      })
    })
  } catch (error) {
    handleError(error, "smoothScroll")
  }
}

// Scroll to Top Functionality
function setupScrollTop() {
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      try {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      } catch (error) {
        handleError(error, "scrollToTop")
      }
    })
  }
}

// Animated Counter with improved performance
function animateCounters() {
  try {
    const observerOptions = {
      threshold: 0.7,
      rootMargin: "0px 0px -100px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target
          const target = Number.parseInt(counter.getAttribute("data-target"))
          const duration = 2000 // 2 seconds
          const startTime = performance.now()
          const startValue = 0

          function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime
            const progress = Math.min(elapsedTime / duration, 1)
            const currentValue = Math.floor(progress * (target - startValue) + startValue)
            
            counter.textContent = currentValue.toLocaleString()

            if (progress < 1) {
              requestAnimationFrame(updateCounter)
            } else {
              counter.textContent = target.toLocaleString()
            }
          }

          requestAnimationFrame(updateCounter)
          observer.unobserve(counter)
        }
      })
    }, observerOptions)

    statNumbers.forEach((counter) => {
      observer.observe(counter)
    })
  } catch (error) {
    handleError(error, "animateCounters")
  }
}

// Fade In Animation with improved performance
function fadeInOnScroll() {
  try {
    const fadeElements = document.querySelectorAll(".service__card, .contact__item")
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in", "show")
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    fadeElements.forEach((element) => {
      element.classList.add("fade-in")
      observer.observe(element)
    })
  } catch (error) {
    handleError(error, "fadeInOnScroll")
  }
}

// Contact Form Handling with improved validation and error handling
function handleContactForm() {
  if (!contactForm) return

  const validateForm = (formData) => {
    const errors = []
    const email = formData.get("email")
    const message = formData.get("message")

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push("Please enter a valid email address")
    }

    if (!message || message.length < 10) {
      errors.push("Message must be at least 10 characters long")
    }

    return errors
  }

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData(contactForm)
      const errors = validateForm(formData)

      if (errors.length > 0) {
        errors.forEach(error => showNotification(error, "error"))
        return
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      
      // Show loading state
      submitBtn.classList.add("btn--loading")
      submitBtn.disabled = true

      // Simulate form submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000))

      showNotification("Message sent successfully! We'll get back to you soon.", "success")
      contactForm.reset()

      // Reset button
      submitBtn.classList.remove("btn--loading")
      submitBtn.textContent = originalText
      submitBtn.disabled = false
    } catch (error) {
      handleError(error, "contactForm")
      showNotification("Failed to send message. Please try again.", "error")
    }
  })
}

// Notification System with improved accessibility
function showNotification(message, type = "info") {
  try {
    // Remove existing notifications
    const existingNotification = document.querySelector(".notification")
    if (existingNotification) {
      existingNotification.remove()
    }

    // Create notification element
    const notification = document.createElement("div")
    notification.className = `notification notification--${type}`
    notification.setAttribute("role", "alert")
    notification.setAttribute("aria-live", "polite")
    
    notification.innerHTML = `
      <div class="notification__content">
        <span class="notification__message">${message}</span>
        <button class="notification__close" aria-label="Close notification">&times;</button>
      </div>
    `

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === "success" ? "var(--success-color)" : 
                   type === "error" ? "var(--error-color)" : 
                   "var(--primary-color)"};
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
    requestAnimationFrame(() => {
      notification.style.transform = "translateX(0)"
    })

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
  } catch (error) {
    handleError(error, "showNotification")
  }
}

// Performance optimized scroll handlers
const debounce = (func, wait) => {
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

// Initialize all functionality
function init() {
  try {
    setupMobileMenu()
    setupScrollTop()
    smoothScroll()
    animateCounters()
    fadeInOnScroll()
    handleContactForm()

    // Add scroll event listeners with debounce
    window.addEventListener("scroll", debounce(() => {
      toggleScrollTopButton()
      highlightActiveLink()
    }, 100))

    // Add keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        hideMenu()
      }
    })
  } catch (error) {
    handleError(error, "init")
  }
}

// Start the application
document.addEventListener("DOMContentLoaded", init)

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
