// Global JavaScript functionality

// DOM Elements
const navToggle = document.getElementById("nav-toggle")
const navMenu = document.getElementById("nav-menu")

// Mobile Navigation
function initMobileNavigation() {
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("show")
      document.body.style.overflow = navMenu.classList.contains("show") ? "hidden" : "auto"
    })

    // Close menu when clicking on nav links
    const navLinks = navMenu.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("show")
        document.body.style.overflow = "auto"
      })
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove("show")
        document.body.style.overflow = "auto"
      }
    })
  }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]')
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        const headerHeight = document.querySelector(".navbar").offsetHeight
        const targetPosition = targetElement.offsetTop - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })
}

// Animated counter for statistics
function animateCounters() {
  const counters = document.querySelectorAll("[data-target]")

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
            counter.textContent = Math.ceil(current).toLocaleString()
            setTimeout(updateCounter, 20)
          } else {
            counter.textContent = target.toLocaleString()
            if (target === 99) {
              counter.textContent = "99.9%"
            }
          }
        }

        updateCounter()
        observer.unobserve(counter)
      }
    })
  }, observerOptions)

  counters.forEach((counter) => {
    observer.observe(counter)
  })
}

// Fade in animation on scroll
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll(".feature-card, .tool-card, .resource-card")

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  fadeElements.forEach((element) => {
    element.style.opacity = "0"
    element.style.transform = "translateY(20px)"
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(element)
  })
}

// Notification system
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
  const bgColor =
    type === "success" ? "#22c55e" : type === "error" ? "#ef4444" : type === "warning" ? "#f59e0b" : "#3b82f6"

  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-family: var(--font-family);
    `

  // Add to DOM
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Close functionality
  const closeBtn = notification.querySelector(".notification__close")
  closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 1rem;
    `

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

// Header background on scroll
function updateHeaderBackground() {
  const header = document.querySelector(".navbar")
  if (header) {
    if (window.scrollY > 100) {
      header.style.backgroundColor = "rgba(255, 255, 255, 0.98)"
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
    } else {
      header.style.backgroundColor = "rgba(255, 255, 255, 0.95)"
      header.style.boxShadow = "none"
    }
  }
}

// Keyboard navigation
function initKeyboardNavigation() {
  document.addEventListener("keydown", (e) => {
    // ESC key to close mobile menu
    if (e.key === "Escape" && navMenu && navMenu.classList.contains("show")) {
      navMenu.classList.remove("show")
      document.body.style.overflow = "auto"
    }
  })
}

// Performance optimization - Throttle scroll events
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

// Scroll event listener with throttling
const throttledScrollHandler = throttle(() => {
  updateHeaderBackground()
}, 16) // ~60fps

// Error handling for images
function initImageErrorHandling() {
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
}

// Initialize all global functionality
function initGlobal() {
  initMobileNavigation()
  initSmoothScrolling()
  animateCounters()
  initScrollAnimations()
  initKeyboardNavigation()
  initImageErrorHandling()

  // Add scroll event listener
  window.addEventListener("scroll", throttledScrollHandler)

  // Initial calls
  updateHeaderBackground()

  console.log("🚀 MedAI Pro global scripts initialized successfully!")
}

// Wait for DOM to be fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGlobal)
} else {
  initGlobal()
}

// Export functions for use in other scripts
window.MedAI = {
  showNotification,
  throttle,
}
