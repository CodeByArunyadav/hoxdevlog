import { api } from "../api.js";

export function initRegisterPage(){
    document.getElementById("register-form").onsubmit = async(e)=>{
        e.preventDefault();

        const res = await api("api/register.php",{
            name:e.target.name.value,
            email:e.target.email.value,
            password:e.target.password.value
        });

        if(res.success) location.href="login.html";
        else alert(res.message);
    }
}
