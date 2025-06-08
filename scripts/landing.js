// Landing page specific functionality

// Initialize landing page features
function initLandingPage() {
  console.log("Landing page initialized")

  // Add any landing page specific functionality here
  initHeroAnimations()
  initFeatureCardInteractions()
}

// Hero section animations
function initHeroAnimations() {
  const heroBlob = document.querySelector(".hero-blob")

  if (heroBlob) {
    // Parallax effect for hero blob
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset
      const rate = scrolled * -0.3
      heroBlob.style.transform = `translateY(${rate}px)`
    })

    // Add hover effect
    heroBlob.addEventListener("mouseenter", () => {
      heroBlob.style.transform += " scale(1.05)"
    })

    heroBlob.addEventListener("mouseleave", () => {
      heroBlob.style.transform = heroBlob.style.transform.replace(" scale(1.05)", "")
    })
  }
}

// Feature card interactions
function initFeatureCardInteractions() {
  const featureCards = document.querySelectorAll(".feature-card")

  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-8px)"
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(-5px)"
    })
  })
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLandingPage)
} else {
  initLandingPage()
}
