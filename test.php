// =====================================
// Initial Data (Simulated Database)
// =====================================
const initialPosts = [
    {
        id: 1,
        title: "Understanding Async/Await in JavaScript",
        category: "JavaScript",
        author: "Sarah Dev",
        content: "Asynchronous programming is a fundamental concept in JavaScript...",
        image: "images/js-code.jpg",
        date: "Oct 24, 2023"
    },
    {
        id: 2,
        title: "Python List Comprehensions Explained",
        category: "Python",
        author: "Mike Py",
        content: "List comprehensions provide a concise way to create lists...",
        image: "images/python-code.jpg",
        date: "Oct 22, 2023"
    },
    {
        id: 3,
        title: "Getting Started with Rust Ownership",
        category: "Rust",
        author: "Ferris Crab",
        content: "Ownership is Rust's most unique feature...",
        image: "images/rust-code.jpg",
        date: "Oct 20, 2023"
    }
];

// =====================================
// Local Storage Helpers
// =====================================
function getPosts() {
    const stored = JSON.parse(localStorage.getItem('devlog_posts')) || [];
    return [...initialPosts, ...stored].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function savePostLocal(post) {
    const stored = JSON.parse(localStorage.getItem('devlog_posts')) || [];
    stored.push(post);
    localStorage.setItem('devlog_posts', JSON.stringify(stored));
}

// --- USER SESSION STORAGE (Fix Added) ---
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("current_user"));
}

function setCurrentUser(user) {
    localStorage.setItem("current_user", JSON.stringify(user));
}

// =====================================
// Main Executions After DOM Loaded
// =====================================
document.addEventListener('DOMContentLoaded', () => {

    const pageId = document.body.id;
    console.log("Page:", pageId);

    // ==========================
    // Mobile Navigation Toggle
    // ==========================
    const menuBtn = document.querySelector(".mobile-menu-btn");
    const navLinksMobile = document.querySelector(".nav-links");
    if (menuBtn && navLinksMobile) menuBtn.onclick = () => navLinksMobile.classList.toggle("active");

    // ==========================
    // DYNAMIC NAVIGATION
    // ==========================
    async function updateNavigation() {
        const nav = document.getElementById("nav-links");
        if (!nav) return;

        try {
            const me = await api("api/me.php");  // if logged in

            nav.innerHTML = `
                <li><a href="index.html">Home</a></li>
                <li><a href="create.html">Write Post</a></li>
                <li><a href="#" id="logoutBtn">Logout (${me.user.name})</a></li>
            `;

            document.getElementById("logoutBtn").onclick = async (e) => {
                e.preventDefault();
                await api("api/logout.php");
                location.href = "index.html";
            };

        } catch {
            nav.innerHTML = `
                <li><a href="index.html">Home</a></li>
                <li><a href="login.html">Login</a></li>
                <li><a href="register.html">Register</a></li>
            `;
        }
    }
    updateNavigation();

    // ==========================
    // HOME PAGE
    // ==========================
    if (pageId === 'home-page') {
        const postsContainer = document.getElementById("posts-container");
        const buttons = document.querySelectorAll(".tag");
        const allPosts = getPosts();

        function render(posts) {
            postsContainer.innerHTML = "";
            posts.forEach(p => {
                postsContainer.innerHTML += `
                <div class="post-card">
                    <img src="${p.image || 'images/hero.jpg'}" alt="${p.title}">
                    <div class="post-content">
                        <div class="post-meta">
                            <span class="category-badge">${p.category}</span>
                            <span>${p.date}</span>
                        </div>
                        <h3><a href="post.html?id=${p.id}">${p.title}</a></h3>
                        <p>${p.content.substring(0,120)}...</p>
                        <div class="post-footer">
                            <span><i class="fas fa-user-circle"></i> ${p.author}</span>
                            <a href="post.html?id=${p.id}" class="read-more">Read More →</a>
                        </div>
                    </div>
                </div>`;
            });
        }

        render(allPosts);

        buttons.forEach(btn => btn.onclick = () => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            let c = btn.dataset.filter;
            render(c === "all" ? allPosts : allPosts.filter(p => p.category === c));
        });
    }

    // ==========================
    // CREATE PAGE
    // ==========================
    if (pageId === "create-page") {
        const user = getCurrentUser();
        if (!user) return location.href = "login.html";

        document.getElementById("author").value = user.name;

        document.getElementById("create-post-form").onsubmit = (e) => {
            e.preventDefault();

            const f = new FormData(e.target);
            const newPost = {
                id: Date.now(),
                title: f.get("title"),
                category: f.get("category"),
                author: f.get("author"),
                content: f.get("content"),
                image: "images/hero.jpg",
                date: new Date().toDateString()
            };

            savePostLocal(newPost);
            alert("Post Published!");
            location.href = "index.html";
        }
    }

    // ==========================
    // POST DETAIL PAGE
    // ==========================
    if (pageId === "post-page") {
        const id = new URLSearchParams(location.search).get("id");
        const post = getPosts().find(p => p.id == id);
        const box = document.getElementById("full-article");

        if (!post) return box.innerHTML = "<h2>Post Not Found</h2>";

        box.innerHTML = `
            <header>
                <span class="category-badge">${post.category}</span>
                <h1>${post.title}</h1>
                <p><i class="fas fa-user"></i> ${post.author} | ${post.date}</p>
            </header>
            <img src="${post.image}">
            <article>${post.content.split("\n").map(p=> `<p>${p}</p>`).join("")}</article>
        `;

        // Comments
        const form = document.getElementById('comment-form');
        if (form) form.onsubmit = (e) => {
            e.preventDefault();
            let user = getCurrentUser();
            if (!user) return location.href = "login.html";

            let text = form.querySelector("textarea").value;
            let list = document.getElementById("comments-list");

            list.innerHTML = `
                <div class="comment">
                    <strong>${user.name}</strong> <span>Just Now</span>
                    <p>${text}</p>
                </div>
            ` + list.innerHTML;

            form.reset();
        }
    }

    // ==========================
    // LOGIN PAGE
    // ==========================
    if (pageId === "login-page") {
        document.getElementById("login-form").onsubmit = (e) => {
            e.preventDefault();

            let email = email.value;
            let user = { name: email.split("@")[0], email }; // simulated

            setCurrentUser(user);
            alert("Login Successful");
            location.href = "index.html";
        }
    }

    // ==========================
    // REGISTER PAGE
    // ==========================
    if (pageId === "register-page") {
        document.getElementById("register-form").onsubmit = (e) => {
            e.preventDefault();
            alert("Registration Successful!");
            location.href = "login.html";
        }
    }

});
