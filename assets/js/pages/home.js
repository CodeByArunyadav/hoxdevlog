export function initHomePage(){
    fetch("api/getPosts.php")
    .then(res => res.json())
    .then(posts => {
        const box = document.getElementById("posts");
        box.innerHTML = posts.map(p => `
            <div class="card">
                <img src="${p.image}">
                <h3>${p.title}</h3>
                <p>${p.category}</p>
                <a href="post.html?id=${p.id}">Read More</a>
            </div>
        `).join("");
    });
}
