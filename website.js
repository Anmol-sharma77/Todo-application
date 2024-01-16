const usn=document.getElementById("username");
const mail=document.getElementById("email");
const pasw=document.getElementById("password");
const btn=document.getElementById("sgn");
btn.addEventListener("click",function(){
    const username=usn.value;
    const email=mail.value;
    const password=pasw.value;
    if(email!="" && password!= ""&&username!=""){
        saveinfo(username,email,password,function(error){
            if(error)
            {
                alert("Email already exist");
            }
            else{
            alert("Signup successfull");
            window.location.href="/";
        }
        });
}});
function saveinfo(username,email,password,callback)
{
    fetch("/signup", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name:username,email:email,password:password}),
    }).then(function(response)
    {
        console.log("Response Status:", response.status);
        console.log("Response Body:", response);
        if(response.status===200){
            callback();}
        else{
             callback("Username is taken already");
            }
    });
}