import { getPosts } from "../app.js";

export function initPostPage(){

    const id = new URLSearchParams(location.search).get("id");
    const post = getPosts().find(p => p.id == id);
    const container = document.getElementById("post-box");

    if(!post){
        container.innerHTML = `<h2>Post not found</h2>`;
        return;
    }

    container.innerHTML = `
        <h1>${post.title}</h1>
        <p><b>Author:</b> ${post.author} | <b>Date:</b> ${post.date}</p>
        <img src="${post.image}" style="width:100%;max-height:350px;object-fit:cover;margin:10px 0">
        <p>${post.content.replace(/\n/g,"<br>")}</p>

        <div id="post-actions"></div>

        <h3>Comments</h3>
        <div id="comments-list"></div>

        <form id="comment-form" style="margin-top:10px">
            <textarea placeholder="Write comment" required></textarea>
            <button type="submit">Post Comment</button>
        </form>
    `;

    /* ----------------------
       SHOW EDIT IF OWNER
    ----------------------- */
    const actionBox = document.getElementById("post-actions");

    if(window.CURRENT_USER && window.CURRENT_USER.name === post.author){
        actionBox.innerHTML = `
            <a href="create.html?id=${post.id}" class="edit-btn">✏ Edit</a>
            <button id="delete-post">🗑 Delete</button>
        `;

        document.getElementById("delete-post").onclick = ()=>{
            if(confirm("Delete this post?")){
                // delete from storage
                let posts = JSON.parse(localStorage.getItem("posts")||"[]");
                posts = posts.filter(p=>p.id!=post.id);
                localStorage.setItem("posts",JSON.stringify(posts));

                alert("Post deleted");
                location.href="index.html";
            }
        }
    }

    /* ----------------------
       COMMENT HANDLER
    ----------------------- */
    const commentForm = document.getElementById("comment-form");
    const commentList = document.getElementById("comments-list");

    commentForm.onsubmit = e => {
        e.preventDefault();

        if(!window.CURRENT_USER){
            alert("Login required to comment");
            location.href="login.html";
            return;
        }

        const commentText = commentForm.querySelector("textarea").value;

        const comment = document.createElement("p");
        comment.innerHTML = `<b>${CURRENT_USER.name}</b>: ${commentText}`;
        commentList.prepend(comment);

        commentForm.reset();
    }
}
