const todolist=document.getElementById("new-todo");
const button=document.getElementById("submit");
const fileInput = document.querySelector('input[type="file"]');
getTodos();
button.addEventListener("click",function(){
    const id=Math.random();
    const flag=0;
   const todovalue=todolist.value;
   const file = fileInput.files[0];
    if(todovalue && file) {
      const formData = new FormData();
      formData.append("text", todovalue); 
      formData.append("createdBy", null);
      formData.append("id", id);
      formData.append("flag", flag);
      formData.append("pic", file);

      savetodo(formData, function (error, todos) {
        if (error) {
          alert("something went wrong");
        } else {
          addTodoindom(todos);
        }
      });
    } 
   else
   {
      alert("Please enter todo and Image");
   }
});
function savetodo(formdata,callback)
{ 
   fetch("/todo", {
      method: "POST",
      body: formdata,
    }).then(function(response){
      if(response.status===200)
      {
         return response.json();
      }
      else{
         callback("Something went wrong",null);
      }
   }).then(function(todos){
    callback(null,todos);
   })
}
function addTodoindom(todos){
  const list=document.getElementById("todo-list");
  const item=document.createElement("li");
  const box=document.createElement("input");
  const crs=document.createElement("span");
  const img=document.createElement("img");
  crs.textContent = '\u00D7';
  crs.classList.add("cross");
  box.type='checkbox';
  item.innerText=todos.text;
  img.src=todos.file;
  crs.setAttribute("todo-id",todos.id);
  box.setAttribute("todo-id",todos.id);
  list.appendChild(item);
  item.appendChild(box);
  item.appendChild(crs);
  item.appendChild(img);
  if (Number(todos.flag)) {
    box.checked = true;
    item.classList.add("item");
  }
    box.addEventListener("click",function(event){
    event.stopPropagation();
    const todoid=event.target.getAttribute("todo-id");
    savestate(todoid, function (error) {
      if (error) {
        alert(error);
      }
    });
      item.classList.toggle("item");
   });
   crs.addEventListener("click", function (event) {
     event.stopPropagation();
     const todoid=event.target.getAttribute("todo-id");
      deleteTodo(todoid, function (error) {
        if (error) {
          alert(error);
        } else {
          list.removeChild(item);
        }
      });
    });
}
function getTodos() {
   fetch("/todos")
     .then(function (response) {
       if (response.status !== 200) {
         throw new Error("Something went wrong");
       }
       return response.json();
     })
     .then(function (todos) {
       todos.forEach(function (todo) {
         addTodoindom(todo);
       });
     })
     .catch(function (error) {
       alert(error);
     });
 }
 function deleteTodo(todoid, callback) {
   fetch("/todo",{
     method: "DELETE",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ id: todoid, createdBy: "null" }),
   }).then(function (response){
     if (response.status === 200) {
       callback();
     } else {
       callback("Something went wrong");
     }
   });
 }
function savestate(todoid, callback){
  fetch("/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: todoid, createdBy: "null" }),
  }).then(function (response) {
    if (response.status === 200) {
      callback();
    } else {
      callback("Something went wrong");
    }
  });
}