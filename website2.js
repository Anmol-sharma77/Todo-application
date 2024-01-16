const pasw2=document.getElementById("logpassword");
const btn2=document.getElementById("lgn");
const mail2=document.getElementById("mail");
btn2.addEventListener("click",function(){
    const email=mail2.value;
    const password=pasw2.value;
    checklogin(email,password,function(error){
        if(error)
        alert("Wrong credentials");
        else
        window.location.href = "/webpage";
    });
});
function checklogin(email,password,callback)
{
    fetch("/login",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({email:email,password:password}),
    })
    .then(function (response) {
        if (response.status !== 200) {
          throw new Error("Something went wrong");
        }
        return response.json();
      })
      .then(function(username){
    })
    .catch(function (error) {
        alert(error);
      });
}