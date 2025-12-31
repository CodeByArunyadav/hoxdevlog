export async function api(url, data=null){
    const options = { credentials:"include" };

    if(data){
        options.method = "POST";
        options.headers = { "Content-Type":"application/json" };
        options.body = JSON.stringify(data);
    }

    const res = await fetch(url, options);
    return res.json();
}

// Load user session
export async function loadUser(){
    try{
        const res = await api("api/me.php");
        return res.user;
    }catch{
        return null;
    }
}
