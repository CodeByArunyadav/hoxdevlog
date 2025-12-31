/* ============================================
   Initial Sample Data + Local Storage Helpers
============================================ */

export const initialPosts = [
    {
        id: 1,
        title: "Understanding Async/Await in JavaScript",
        category: "JavaScript",
        author: "Sarah Dev",
        content: "Async/Await provides cleaner syntax over promises...",
        image: "images/js-code.jpg",
        date: "Oct 24, 2023"
    },
    {
        id: 2,
        title: "Python List Comprehensions Explained",
        category: "Python",
        author: "Mike Py",
        content: "List comprehensions help create lists efficiently...",
        image: "images/python-code.jpg",
        date: "Oct 22, 2023"
    },
    {
        id: 3,
        title: "Getting Started with Rust Ownership",
        category: "Rust",
        author: "Ferris Crab",
        content: "Rust's ownership is memory safe and compiler managed...",
        image: "images/rust-code.jpg",
        date: "Oct 20, 2023"
    }
];

/* ============================================
   LOCAL STORAGE POST HANDLING
============================================ */

export function getPosts() {
    const localPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    return [...initialPosts, ...localPosts];
}

export function savePost(post) {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts.push(post);
    localStorage.setItem("posts", JSON.stringify(posts));
}

export function updateLocalPost(updatedPost) {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const index = posts.findIndex(p => p.id == updatedPost.id);
    if(index !== -1){
        posts[index] = updatedPost;
        localStorage.setItem("posts", JSON.stringify(posts));
    }
}
