export function setupUI(){
    const nav = document.getElementById("nav-links");
    if(!nav) return;

    if(CURRENT_USER){
        nav.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="create.html">Write Post</a></li>
            <li><a href="#" id="logoutBtn">Logout (${CURRENT_USER.name})</a></li>
        `;

        document.getElementById("logoutBtn").onclick = async () => {
            await fetch("api/logout.php", {credentials:"include"});
            location.reload();
        };

    }else{
        nav.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="login.html">Login</a></li>
            <li><a href="register.html">Register</a></li>
        `;
    }
}
