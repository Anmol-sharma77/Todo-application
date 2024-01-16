const express = require("express");
const fs = require("fs");
const multer=require("multer");
const db=require("./models/mongo");
const usermodel=require("./models/users");
const session = require("express-session");
const { error } = require("console");
const upload = multer({ dest: 'uploads/' });
const app = express();
app.use(function (req, res, next) {
  console.log(req.method, req.url);
  next();
}); 
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(upload.single("pic"));
app.use(express.static("uploads"));
app.get("/", function (request, response) {
  if(request.session.login){
  response.sendFile(__dirname + "/public/index.html");
  }
  else{
    response.redirect("/login");
  }
});
app.get("/about", function (request, response) {
  response.sendFile(__dirname + "/public/about.html");
});
app.get("/login", function (request, response) {
  response.sendFile(__dirname + "/public/login.html");
});
app.get("/contact", function (request, response) {
  response.sendFile(__dirname + "/public/contact.html");
});
app.get("/style.css", function (request, response) {
  response.sendFile(__dirname + "/public/css/style.css");
});
app.get("/todo", function (request, response) {
  response.sendFile(__dirname + "/public/todo.html");
});
app.post("/todo",function(request,response) {
  const todo=request.body;
  const image=request.file;
  todo.file=image.filename;
  todo.createdBy=request.session.username;
  todomodel.create(todo).then(function(todo){
    response.status(200);
    response.json(todo);
  }).catch(function(error){
    response.status(500);
    response.json({error:error});
  });
});
function savetodo(todo,callback)
{
  gettodos(null,true,function(error,todos){
    if(error)
    {
      callback(error)
    }
    else{
      todos.push(todo);
      fs.writeFile("./todos.txt",JSON.stringify(todos),function(error){
        if(error){
        callback(error);}
        else{
        callback();}
      });
    }
  });
}
app.get("/todos",function(request,response){
  const name=request.session.username;
  gettodos(name,false,function(error,todos){
    if(error)
    {
      response.status(500);
      response.json({error:error});
    }
    else{
      response.status(200);
      response.json(todos);
    }
  })
});
function gettodos(username,all,callback)
{
  todomodel.find({createdBy:username})
  .then(function(todo){
    console.log(todo);
    callback(null,todo);
  }).catch(function(error){
    callback(error,[]);
  });
}
db.init().then(function(){
  app.listen(8000,function(error)
  {
    if(error)
    console.log(error);
    else
    console.log("Server is running on port 8000");
  });});
app.get("/todo.js", function (request, response) {
  response.sendFile(__dirname + "/todo.js");
  });
app.delete("/todo", function (request, response) {
    const todo = request.body;
    todo.createdBy=request.session.username;
    gettodos(null, true, function (error, todos) {
      if (error) {
        response.status(500);
        response.json({ error: error });
      } else {
        const filteredTodos = todos.filter(function (item) {
          if(item.id === todo.id){
            const filename=item.file;
            fs.unlink(`uploads/${filename}`, (err) => {
              if (err) {
                console.error("Error deleting image file:", err);
              }
              });
            return false;
          }
          return true;
        });
        fs.writeFile("./todos.txt",JSON.stringify(filteredTodos),function (error) {
            if (error) {
              response.status(500);
              response.json({ error: error });
            } else {
              response.status(200);
              response.send();
            }
          }
        );
      }
    });
  });
  app.post("/update", function (request, response) {
    const todo = request.body;
    todo.createdBy=request.session.username;
    gettodos(null, true, function (error, todos) {
      if (error) {
        response.status(500);
        response.json({ error: error });
      } else {
        const filteredTodos = todos.filter(function (item) {
          if(item.id===todo.id){
              if(Number(item.flag)===1)
               item.flag=0;
               else
               item.flag=1;}
          return true;
        });
        fs.writeFile("./todos.txt",JSON.stringify(filteredTodos),function (error) {
            if (error) {
              response.status(500);
              response.json({ error: error });
            } else {
              response.status(200);
              response.send();
            }
          }
        );
      }
    });
  });
  app.get("/website.js", function (request, response) {
    response.sendFile(__dirname + "/website.js");
    });
    app.get("/website2.js", function (request, response) {
      response.sendFile(__dirname + "/website2.js");
      });
  app.get("/signup",function(request,response){
    response.sendFile(__dirname+"/public/signup.html");
  });
  app.post("/signup",function(request,response){
    const user=request.body;
    console.log(user);
    usermodel.create(user).then(function(todo){
      response.status(200);
      response.json(user);
    }).catch(function(error){
      response.status(500);
      response.json({error:error});
    })
    // savedetails(user,function(error){
    //   if(error){
    //     response.status(409);
    //     response.send();
    //   }
    //   else{
    //     response.status(200);
    //     response.redirect("/login");
    //   }
    // })
  })
  app.post("/login",function(request,response){
    const login=request.body;
    checklogin(login,(error,user)=>{
      if(error)
      {
        response.redirect("/invalid");
      }
      else{
        response.status(200);
        request.session.login=true;
        console.log(user.name);
        request.session.username=user.name;
        response.redirect("/");
      }
    });
  });
  app.get("/invalid",function(request,response){
    response.sendFile(__dirname+"/public/wrong.html");
  });
    function savedetails(user, callback) {
      getdetails(user.email, function (error, existinguser) {
        if (error) {
          callback(error);
        } else {
          if (existinguser) {
            callback("Email is already taken");
          } else {
            usermodel.create(user).then(function(todo){
              response.status(200);
              response.json(user);
            }).catch(function(error){
              response.status(500);
              response.json({error:error});
            })
            // fs.readFile("./user.txt", "utf-8", function (error, data) {
            //   if (error) {
            //     callback(error);
            //   } else {
            //     if(data.length==0){
            //       data="[]";
            //      }
            //     try {
            //       const details = JSON.parse(data);
            //       details.push(user);
            //       fs.writeFile("./user.txt", JSON.stringify(details), function (writeError) {
            //         if (writeError) {
            //           callback(writeError);
            //         } else {
            //           callback();
            //         }
            //       });
            //     } catch (parseError) {
            //       callback(parseError);
            //     }
            //   }
            // });
          }
        }
      });
    }
    function getdetails(email,callback){
      usermodel.findOne({email:email}).then(function(user){
        console.log(user);
        if(user)
        {
          callback(null,true);
          return;
        }
        else{
          callback(null,false);
          return;
        }
      }).catch(function(error){
        callback(error);
      })
        // fs.readFile("./user.txt","utf-8",function(error,data){
        //   if(error){
        //     callback(error);
        //   }
        //   else
        //   {  
        //      try{
        //       if(data.length==0)
        //       {
        //         data="[]";
        //       }
        //          const details=JSON.parse(data);
        //          const exisuser=details.find((user)=>user.email===email);
        //          if(exisuser){
        //          return callback(null,true);}
        //          else{
        //          return callback(null,false);}
        //      }catch(error){
        //       callback(error);
        //      }
        //   }
        // });
    }
    function checklogin(log,callback)
    {
      console.log(log);
      usermodel.findOne({email:log.mail,password:log.logpassword}).then(function(d){
        console.log(d);
        if(d.name)
        {
          callback(null,d);
          return;
        }
        else{
          callback("ERROR",null);
        }
      }).catch(function(error){
        callback(error);
      });
      // fs.readFile("./user.txt","utf-8",function(error,data){
      //   if(error){
      //     callback(error);
      //   }
      //   else
      //   {
      //     try{
      //       if(data.length===0)
      //       {
      //         callback("error");
      //       }
      //       const details=JSON.parse(data);
      //       const mail=details.find((users)=>users.email===log.mail);
      //       const password=details.find((users)=>users.password===log.logpassword);     
      //       if(mail&&password)
      //       {
      //         callback(null,mail);
      //       }
      //       else{
      //         callback("ERROR",null);
      //       }
      //     }catch(error){
      //       callback(error)
      //     }
      //   }
      // });
    }