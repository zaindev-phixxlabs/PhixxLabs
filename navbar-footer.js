// // Fast Component Loader with Promise
// async function loadComponent(elementId, filePath) {
//     try {
//         const response = await fetch(filePath);
//         const html = await response.text();

//         const element = document.getElementById(elementId);
//         element.innerHTML = html;

//         // Agar navbar hai to body ke start me move kar do
//         if (elementId === "navbar-placeholder") {
//             document.body.insertBefore(element, document.body.firstChild);
//         }

//         return true;
//     } catch (error) {
//         console.error('Error loading component:', error);
//         return false;
//     }
// }

// // Fast Navbar Initialization
// function fastInitNavbar() {
//     requestAnimationFrame(() => {
//         const menuBtn = document.getElementById("mobileMenuBtn");
//         const navLinks = document.getElementById("navLinks");
        
//         if (menuBtn && navLinks) {
//             menuBtn.addEventListener("click", (e) => {
//                 e.preventDefault();
//                 menuBtn.classList.toggle("active");
//                 navLinks.classList.toggle("active");
//             });
//         }
        
//         // Active link set on page load
//         const currentPage = window.location.pathname.split('/').pop() || 'index.html';
//         document.querySelectorAll(".nav-links a").forEach(link => {
//             if (link.getAttribute('href') === currentPage) {
//                 link.classList.add('active');
//             }
//         });
//     });
// }

// // Scroll Observer
// function initScrollObserver() {
//     const sections = document.querySelectorAll("section, header");
//     const navItems = document.querySelectorAll(".nav-links a");
    
//     if (sections.length === 0 || navItems.length === 0) return;
    
//     const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) {
//                 const id = entry.target.getAttribute('id') || 'home';
//                 navItems.forEach(link => {
//                     link.classList.remove('active');
//                     if (link.getAttribute('href').includes(id)) {
//                         link.classList.add('active');
//                     }
//                 });
//             }
//         });
//     }, { threshold: 0.3, rootMargin: "-100px 0px -100px 0px" });
    
//     sections.forEach(section => observer.observe(section));
// }

// // Simple Loader - Navbar or Footer dono Load Honge
// async function loadSite() {
//     await loadComponent('navbar-placeholder', 'navbar.html');
//     fastInitNavbar();

//     await loadComponent('footer-placeholder', 'footer.html');

//     initScrollObserver();

//     // Body show karo jab sab load ho jaye
//     document.getElementById("pageBody").style.display = "block";
// }

// loadSite();

// // Start loading when DOM is ready
// document.addEventListener('DOMContentLoaded', loadSite);




// Fast Component Loader with Promise
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        const html = await response.text();

        const element = document.getElementById(elementId);
        element.innerHTML = html;

        // Agar navbar hai to body ke start me move kar do
        if (elementId === "navbar-placeholder") {
            document.body.insertBefore(element, document.body.firstChild);
        }

        return true;
    } catch (error) {
        console.error('Error loading component:', error);
        return false;
    }
}

// Fast Navbar Initialization
function fastInitNavbar() {
    requestAnimationFrame(() => {
        const menuBtn = document.getElementById("mobileMenuBtn");
        const navLinks = document.getElementById("navLinks");
        
        if (menuBtn && navLinks) {
            menuBtn.addEventListener("click", (e) => {
                e.preventDefault();
                menuBtn.classList.toggle("active");
                navLinks.classList.toggle("active");
            });
        }
        
        // Active link set on page load
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll(".nav-links a").forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll Observer
function initScrollObserver() {
    const sections = document.querySelectorAll("section, header");
    const navItems = document.querySelectorAll(".nav-links a");
    
    if (sections.length === 0 || navItems.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id') || 'home';
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(id)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3, rootMargin: "-100px 0px -100px 0px" });
    
    sections.forEach(section => observer.observe(section));
}

// Smart path resolver - har folder se kaam karega
function resolvePath(filePath) {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');
    const fileName = pathParts.pop(); // current file name hatao
    
    // Count folders depth
    const folderDepth = pathParts.filter(p => p !== '').length;
    
    // Build path with appropriate number of ../
    let prefix = '';
    for (let i = 0; i < folderDepth; i++) {
        prefix += '../';
    }
    
    // Return multiple path options
    return [
        prefix + filePath,           // Relative to current folder
        filePath,                     // Same folder
        '/' + filePath,               // Root folder
        '../' + filePath,             // One level up
        '../../' + filePath           // Two levels up
    ];
}

// Updated loader with path resolution
async function loadComponentSmart(elementId, filePath) {
    const paths = resolvePath(filePath);
    
    for (let path of paths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                const html = await response.text();
                const element = document.getElementById(elementId);
                element.innerHTML = html;
                
                if (elementId === "navbar-placeholder") {
                    document.body.insertBefore(element, document.body.firstChild);
                }
                
                console.log(`Loaded ${filePath} from: ${path}`);
                return true;
            }
        } catch (e) {
            // Try next path
        }
    }
    
    console.error('Failed to load component:', filePath);
    return false;
}

// Simple Loader - Navbar or Footer dono Load Honge
async function loadSite() {
    // Pehle navbar with smart path
    await loadComponentSmart('navbar-placeholder', 'navbar.html');
    fastInitNavbar();

    // Phir footer with smart path
    await loadComponentSmart('footer-placeholder', 'footer.html');

    // Scroll observer
    initScrollObserver();

    // Body show karo jab sab load ho jaye
    const pageBody = document.getElementById("pageBody");
    if (pageBody) {
        pageBody.style.display = "block";
    }
}

// Start loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadSite();
});

// Extra safety: agar DOM already loaded ho to bhi chal jaye
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(loadSite, 100);
}