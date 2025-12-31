// ============ GLOBAL PAGE LOADER ============
import { loadUser } from "./api.js";
import { setupUI } from "./ui.js";
import { initHomePage } from "./pages/home.js";
import { initPostPage } from "./pages/post.js";
import { initCreatePage } from "./pages/create.js";
import { initLoginPage } from "./pages/login.js";
import { initRegisterPage } from "./pages/register.js";

// Global User
window.CURRENT_USER = null;

document.addEventListener("DOMContentLoaded", async () => {

    // Load user session first
    CURRENT_USER = await loadUser();   

    setupUI();       // navbar update
    routePages();    // load current page
});

function routePages(){
    const page = document.body.id;

    if(page === "home-page")      initHomePage();
    if(page === "post-page")      initPostPage();
    if(page === "create-page")    initCreatePage();
    if(page === "login-page")     initLoginPage();
    if(page === "register-page")  initRegisterPage();
}
