import { api } from "../api.js";

export function initLoginPage(){
    document.getElementById("login-form").onsubmit = async(e)=>{
        e.preventDefault();

        const res = await api("api/login.php",{
            email: e.target.email.value,
            password: e.target.password.value,
        });

        if(res.success){
            location.href="index.html";
        }else alert(res.message);
    };
}
