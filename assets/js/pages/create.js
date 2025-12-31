export function initCreatePage(){

    if(!CURRENT_USER){
        alert("Login required!");
        location.href = "login.html";
        return;
    }

    const form = document.getElementById("create-post-form");
    const postId = new URLSearchParams(location.search).get("id");

    // Edit mode
    if(postId){
        fetch(`api/getPost.php?id=${postId}`)
        .then(r=>r.json())
        .then(p=>{
            form.title.value = p.title;
            form.content.value = p.content;
            form.category.value = p.category;
        });
    }

    form.onsubmit = async(e)=>{
        e.preventDefault();
        let fd = new FormData(form);

        if(postId) fd.append("id",postId);

        let url = postId ? "api/updatePost.php" : "api/createPost.php";
        let res = await fetch(url,{method:"POST",body:fd});

        let out = await res.json();
        if(out.success){
            alert("Post saved!");
            location.href="index.html";
        }else alert(out.message);
    }
}
