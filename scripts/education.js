// Education page functionality

let currentFilter = "all"
let searchTerm = ""
let selectedResource = null

// Sample resources data
const resourcesData = [
  {
    id: 1,
    title: "Latest COVID-19 Treatment Protocols",
    description:
      "Updated guidelines for managing COVID-19 patients in clinical settings with evidence-based approaches.",
    type: "article",
    category: "emergency",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "15 min read",
    updated: "2024-01-15",
    author: "Dr. Sarah Johnson",
  },
  {
    id: 2,
    title: "Cardiac Arrhythmia Recognition",
    description:
      "Comprehensive guide to identifying and treating various types of cardiac arrhythmias in clinical practice.",
    type: "video",
    category: "cardiology",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "45 min",
    updated: "2024-01-10",
    author: "Dr. Michael Chen",
  },
  {
    id: 3,
    title: "Pediatric Dosage Calculations",
    description: "Safe medication dosing for pediatric patients with practical examples and calculation methods.",
    type: "tutorial",
    category: "pediatrics",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "30 min",
    updated: "2024-01-08",
    author: "Dr. Emily Rodriguez",
  },
  {
    id: 4,
    title: "Skin Cancer Detection Techniques",
    description:
      "Advanced methods for early detection of melanoma and other skin cancers using modern diagnostic tools.",
    type: "article",
    category: "dermatology",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "20 min read",
    updated: "2024-01-05",
    author: "Dr. David Kim",
  },
  {
    id: 5,
    title: "Stroke Assessment and Management",
    description: "Rapid assessment techniques and treatment protocols for acute stroke patients in emergency settings.",
    type: "video",
    category: "neurology",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "60 min",
    updated: "2024-01-03",
    author: "Dr. Lisa Wang",
  },
  {
    id: 6,
    title: "Emergency Airway Management",
    description: "Critical techniques for securing airways in emergency situations with step-by-step procedures.",
    type: "tutorial",
    category: "emergency",
    thumbnail: "/placeholder.svg?height=200&width=300",
    duration: "40 min",
    updated: "2024-01-01",
    author: "Dr. Robert Taylor",
  },
]

// DOM Elements
const educationDashboard = document.getElementById("education-dashboard")
const resourceViewer = document.getElementById("resource-viewer")
const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")
const filterBtns = document.querySelectorAll(".filter-btn")
const resourcesGrid = document.getElementById("resources-grid")
const popularResources = document.getElementById("popular-resources")
const viewerBackBtn = document.getElementById("viewer-back-btn")

// Initialize education functionality
function initEducation() {
  setupEventListeners()
  renderResources()
  renderPopularResources()
  console.log("Education page initialized")
}

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch)
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", handleSearch)
  }

  // Filter buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter")
      setActiveFilter(filter)
      handleFilter(filter)
    })
  })

  // Back button in viewer
  if (viewerBackBtn) {
    viewerBackBtn.addEventListener("click", closeResourceViewer)
  }
}

// Handle search
function handleSearch() {
  searchTerm = searchInput.value.toLowerCase().trim()
  renderResources()
}

// Handle filter
function handleFilter(filter) {
  currentFilter = filter
  renderResources()
}

// Set active filter button
function setActiveFilter(filter) {
  filterBtns.forEach((btn) => {
    btn.classList.remove("active")
    if (btn.getAttribute("data-filter") === filter) {
      btn.classList.add("active")
    }
  })
}

// Filter resources based on search and category
function getFilteredResources() {
  return resourcesData.filter((resource) => {
    const matchesSearch =
      !searchTerm ||
      resource.title.toLowerCase().includes(searchTerm) ||
      resource.description.toLowerCase().includes(searchTerm) ||
      resource.author.toLowerCase().includes(searchTerm)

    const matchesFilter = currentFilter === "all" || resource.category === currentFilter

    return matchesSearch && matchesFilter
  })
}

// Render resources grid
function renderResources() {
  const filteredResources = getFilteredResources()

  if (filteredResources.length === 0) {
    resourcesGrid.innerHTML = `
            <div class="no-results">
                <p>No resources found matching your criteria.</p>
            </div>
        `
    return
  }

  const resourcesHTML = filteredResources.map((resource) => createResourceCard(resource)).join("")
  resourcesGrid.innerHTML = resourcesHTML

  // Add click listeners to resource cards
  const resourceCards = resourcesGrid.querySelectorAll(".resource-card")
  resourceCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      openResourceViewer(filteredResources[index])
    })
  })
}

// Create resource card HTML
function createResourceCard(resource) {
  const typeIcon = getTypeIcon(resource.type)
  const typeBadgeClass = getTypeBadgeClass(resource.type)

  return `
        <div class="resource-card" data-id="${resource.id}">
            <div class="resource-thumbnail">
                <img src="${resource.thumbnail}" alt="${resource.title}" class="resource-image">
                <div class="resource-type-badge ${typeBadgeClass}">
                    <span>${typeIcon}</span>
                    <span>${resource.type}</span>
                </div>
            </div>
            <div class="resource-content">
                <h3 class="resource-title">${resource.title}</h3>
                <p class="resource-description">${resource.description}</p>
                <div class="resource-meta">
                    <span>${resource.author}</span>
                    <span>${resource.duration}</span>
                </div>
                <div class="resource-updated">
                    Updated: ${formatDate(resource.updated)}
                </div>
            </div>
        </div>
    `
}

// Get type icon
function getTypeIcon(type) {
  switch (type) {
    case "article":
      return "📄"
    case "video":
      return "🎥"
    case "tutorial":
      return "🎓"
    default:
      return "📚"
  }
}

// Get type badge class
function getTypeBadgeClass(type) {
  switch (type) {
    case "article":
      return "article"
    case "video":
      return "video"
    case "tutorial":
      return "tutorial"
    default:
      return "article"
  }
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Render popular resources
function renderPopularResources() {
  const popularHTML = resourcesData
    .slice(0, 3)
    .map((resource) => createPopularItem(resource))
    .join("")
  popularResources.innerHTML = popularHTML

  // Add click listeners
  const popularItems = popularResources.querySelectorAll(".popular-item")
  popularItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      openResourceViewer(resourcesData[index])
    })
  })
}

// Create popular item HTML
function createPopularItem(resource) {
  const typeIcon = getTypeIcon(resource.type)

  return `
        <div class="popular-item" data-id="${resource.id}">
            <span class="popular-icon">${typeIcon}</span>
            <div class="popular-details">
                <h4 class="popular-item-title">${resource.title}</h4>
                <p class="popular-item-meta">${resource.author} • ${resource.duration}</p>
            </div>
        </div>
    `
}

// Open resource viewer
function openResourceViewer(resource) {
  selectedResource = resource

  // Update viewer content
  document.getElementById("viewer-type-icon").textContent = getTypeIcon(resource.type)
  document.getElementById("viewer-title").textContent = resource.title
  document.getElementById("viewer-meta").textContent = `By ${resource.author} • ${resource.duration}`
  document.getElementById("viewer-description").textContent = resource.description
  document.getElementById("viewer-image").src = resource.thumbnail
  document.getElementById("viewer-image").alt = resource.title

  // Update access button text
  const accessBtn = document.getElementById("access-content-btn")
  if (accessBtn) {
    accessBtn.textContent =
      resource.type === "video" ? "Watch Now" : resource.type === "tutorial" ? "Start Tutorial" : "Read Full Article"

    accessBtn.addEventListener("click", () => {
      window.MedAI.showNotification(`Opening ${resource.title}...`, "info")
    })
  }

  // Update save button
  const saveBtn = document.getElementById("save-later-btn")
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      window.MedAI.showNotification("Resource saved for later!", "success")
    })
  }

  // Show viewer, hide dashboard
  educationDashboard.style.display = "none"
  resourceViewer.style.display = "block"
}

// Close resource viewer
function closeResourceViewer() {
  educationDashboard.style.display = "block"
  resourceViewer.style.display = "none"
  selectedResource = null
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initEducation)
} else {
  initEducation()
}
