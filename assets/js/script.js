// ===============================
// GLOBAL VARIABLES
// ===============================
let CURRENT_USER = null;

// ===============================
// INITIAL POSTS (SIMULATED DATABASE)
// ===============================
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

// ===============================
// COMMON API HELPER
// ===============================
async function api(url, data = null) {
    const options = { method: data ? 'POST' : 'GET', credentials: 'include' };

    if (data) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(data);
    }

    const res = await fetch(url, options);
    if (!res.ok) throw new Error('API error');
    return res.json();
}

// ===============================
// SESSION MANAGEMENT
// ===============================
async function loadCurrentUser() {
    try {
        const res = await api('api/me.php');
        CURRENT_USER = res.user ?? null;
    } catch {
        CURRENT_USER = null;
    }
}

// ===============================
// LOCAL POSTS STORAGE (for demo fallback)
// ===============================
function getPosts() {
    const localPosts = JSON.parse(localStorage.getItem('devlog_posts')) || [];
    return [...initialPosts, ...localPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function savePostLocal(post) {
    const localPosts = JSON.parse(localStorage.getItem('devlog_posts')) || [];
    localPosts.push(post);
    localStorage.setItem('devlog_posts', JSON.stringify(localPosts));
}

// ===============================
// UPDATE NAVIGATION BAR
// ===============================
async function updateNavigation() {
    const nav = document.querySelector(".nav-links");
    if (!nav) return;

    try {
        const me = await api("api/me.php");
        CURRENT_USER = me.user;

        nav.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="create.html">Write Post</a></li>
            <li><a href="#" id="logoutBtn">Logout (${CURRENT_USER.name})</a></li>
        `;

        document.getElementById("logoutBtn").onclick = async e => {
            e.preventDefault();
            await api("api/logout.php");
            CURRENT_USER = null;
            location.href = "index.html";
        };
    } catch {
        nav.innerHTML = `
            <li><a href="index.html">Home</a></li>
			<li><a href="index.html">Category</a></li>
			<li><a href="index.html">About</a></li>
            <li><a href="login.html">Login</a></li>
            <li><a href="register.html">Register</a></li>
        `;
    }
}

// ===============================
// PAGE INITIALIZERS MOBIAL VIEW
// ===============================
function initMobileMenu() {
    const menuBtn = document.querySelector(".mobile-menu-btn");
    const navLinksMobile = document.querySelector(".nav-links");
    if (menuBtn && navLinksMobile) menuBtn.onclick = () => navLinksMobile.classList.toggle("active");
}

// ===============================
// PAGE INITIALIZERS HOME PAGE
// ===============================

async function initHomePage() {
    const postsContainer = document.getElementById('posts-container');
    const filterButtons = document.querySelectorAll('.tag');

    // Fetch posts from your API
    async function getPosts() {
        try {
            const response = await fetch('api/getPosts.php'); // add query params if needed
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
			return Array.isArray(data) ? data : [data];
        } catch (err) {
            console.error("Failed to fetch posts:", err);
            return [];
        }
    }

    const allPosts = await getPosts();
	
    function renderPosts(posts) {
        postsContainer.innerHTML = '';

        if (posts.length === 0) {
            postsContainer.innerHTML = `<p>No posts found</p>`;
            return;
        }

        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'post-card';
            card.innerHTML = `
                <img src="${post.image || 'images/hero.jpg'}" alt="${post.title}" class="post-image">
                <div class="post-content">
                    <div class="post-meta">
                        <span class="category-badge">${post.category || ''}</span>
                        <span>${post.date || ''}</span>
                    </div>
                    <h3 class="post-title">
                        <a href="post.html?id=${post.id}">${post.title}</a>
                    </h3>
                    <p class="post-excerpt">${(post.content || '').substring(0, 100)}...</p>
                    <div class="post-footer">
                        <div class="author">
                            <i class="fas fa-user-circle"></i> ${post.author_name || 'Unknown'}
                        </div>
                        <a href="post.html?id=${post.id}" class="read-more" 
                            style="color: var(--primary); text-decoration: none; font-weight: 600;">
                            Read More &rarr;
                        </a>
                    </div>
                </div>
            `;
            postsContainer.appendChild(card);
        });
    }

    // Initial render
    renderPosts(allPosts);

    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');
            renderPosts(category === 'all'
                ? allPosts
                : allPosts.filter(p => p.category === category)
            );
        });
    });
}

// Call the function
initHomePage();

  /* ================================
     GLOBAL EDIT / DELETE HANDLER
  ================================ */
  document.addEventListener('click', async e => {

    if (e.target.classList.contains('editPost')) {
      location.href = `create.html?id=${e.target.dataset.id}`;
    }

    if (e.target.classList.contains('deletePost')) {
      if (!confirm('Delete this post?')) return;

      const res = await api('api/deletePost.php', {
        id: e.target.dataset.id
      });

      if (res.success) {
        alert('Post deleted');
        location.href = 'index.html';
      } else {
        alert(res.message);
      }
    }
  });

// ===================================================
// PAGE INITIALIZERS FOR CREATE OR WRITE POST OPRATION
// ===================================================

function initCreatePage() {
    if (!CURRENT_USER) {
        alert("You must login to create a post.");
        location.href = "login.html";
        return;
    }

    const form = document.getElementById('create-post-form');
    if (!form) return;

    const postId = new URLSearchParams(location.search).get('id');

    const authorField = document.getElementById('author');
    if (authorField) authorField.value = CURRENT_USER.name;

    // ============================
    // EDIT MODE
    // ============================
    if (postId) {
        api(`api/getPost.php?id=${postId}`).then(res => {

            if (!res.success) {
                alert('Post not found');
                return;
            }

            const post = res.post;

            form.querySelector('[name=title]').value = post.title || '';
            form.querySelector('[name=content]').value = post.content || '';
            form.querySelector('[name=category]').value = post.category || '';

            const imageField = form.querySelector('[name=image]');
            if (imageField) imageField.required = false;

            form.querySelector('button').textContent = 'Update Post';
        }).catch(err => {
            console.error(err);
            alert('Failed to load post data');
        });
    }
	form.addEventListener('submit', async e => {
        e.preventDefault();
        const formData = new FormData(form);
        formData.append('author_id', CURRENT_USER.id);
        if (postId) formData.append('id', postId);

        const url = postId ? 'api/updatePost.php' : 'api/createPost.php';
       try {
            const res = await fetch(url, { method: 'POST', body: formData, credentials: 'include' });
            const result = await res.json();

            if (result.success) {
                alert(result.message || "Post saved successfully!");
                location.href = 'index.html';
            } else {
                alert(result.message || "Something went wrong!");
            }
        } catch (err) {
            console.error(err);
            alert("Network error. Please try again.");
        }
    });
}


// ===================================================
// PAGE INITIALIZERS FOR SINGLE POST OPRATION
// ===================================================

   function initPostPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const articleContainer = document.getElementById('full-article');

    if (!articleContainer) return;

    fetch(`api/getPost.php?id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.success && data.post) {
                const post = data.post;
				// ============================
                // EDIT / DELETE (AUTHOR OR ADMIN)
                // ============================
                let actions = '';
				//const author_id = $(post.author_id);
                if ( CURRENT_USER &&(CURRENT_USER.role === 'admin' || CURRENT_USER.id === post.author_id)
                ) {
                    actions = `
                        <div class="post-actions">
                            <button class="editPost" data-id="${post.id}">✏ Edit</button>
                            <button class="deletePost" data-id="${post.id}">🗑 Delete</button>
                        </div>
                    `;
                }
                articleContainer.innerHTML = `
                    <header class="article-header">
                        <span class="category-badge">${post.category}</span>
                        <h1>${post.title}</h1>
                        <div class="article-meta">
                            <span><i class="fas fa-user"></i> ${post.author_name}</span>
                            <span><i class="fas fa-calendar"></i> ${post.post_date}</span>
							${actions}
                        </div>
                    </header>
                    <img src="${post.image || 'images/hero.jpg'}" alt="${post.title}" class="article-image">
                    <div class="article-content">${post.content.split('\n').map(p => `<p>${p}</p>`).join('')}</div>
                `;
            } else {
                articleContainer.innerHTML = '<h2>Article not found</h2><p><a href="index.html">Return home</a></p>';
            }
        })
        .catch(err => {
            console.error(err);
            articleContainer.innerHTML = '<h2>Error loading article</h2><p><a href="index.html">Return home</a></p>';
        });
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', e => {
            e.preventDefault();
            if (!CURRENT_USER) {
                alert('Please login to comment');
                location.href = 'login.html';
                return;
            }

            const textarea = commentForm.querySelector('textarea');
            const commentsList = document.getElementById('comments-list');
            const newComment = document.createElement('div');
            newComment.className = 'comment';
            newComment.innerHTML = `
                <div class="comment-header">
                    <strong>${CURRENT_USER.name}</strong>
                    <span>Just now</span>
                </div>
                <p>${textarea.value}</p>
            `;
            commentsList.prepend(newComment);
            textarea.value = '';
        });
    }
}

// ================================ 
// LOGIN PAGE INITIALIZERS  
// ================================ 

function initLoginPage() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const res = await api('api/login.php', {
            email: form.email.value,
            password: form.password.value
        });

        if (res.success) location.href = 'index.html';
        else alert(res.message);
    });
}

// ===============================
// REGISTRATION INITIALIZE APPLICATION
// ===============================

function initRegisterPage() {
    const form = document.getElementById('register-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const res = await api('api/register.php', {
            name: form.name.value,
            email: form.email.value,
            password: form.password.value
        });

        if (res.success) {
            alert('Registration successful! Please login.');
            location.href = 'login.html';
        } else {
            alert(res.message);
        }
    });
}

// ===============================
// INITIALIZE APPLICATION
// ===============================
document.addEventListener('DOMContentLoaded', async () => {
    await loadCurrentUser();
    updateNavigation();
    initMobileMenu();

    const pageId = document.body.id;
    if (pageId === 'home-page') initHomePage();
    if (pageId === 'create-page') initCreatePage();
    if (pageId === 'post-page') initPostPage();
    if (pageId === 'login-page') initLoginPage();
    if (pageId === 'register-page') initRegisterPage();
});
