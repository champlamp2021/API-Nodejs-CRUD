let express=require('express');
let app=express();
let bodyParser=require('body-parser');
let mysql=require('mysql');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

//homepage route
app.get('/',(req,res)=>{
    return res.send({
        error:false,
        message:"wellcome to RESTful CRUD API with NodeJS,Express,MYSQL",
        written_by:"Natthaphong",
        published_on:"https://natthaphong.dev"
    });
})

//connection to mysql database
let dbCon=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'nodejs_api'
})
dbCon.connect();

//retrieve all  books 
app.get('/books',(req,res) => {
    dbCon.query('SELECT * FROM books ',(error,results,fields)=>{
        if(error)throw  error;
        
        let message="";
        if(results===undefined || results.length==0){
            message="Books table is empty";

        }else{
            message="Successfully retrieve all books"
        }
        return res.send({
            error:false,
            data:results,
            message:message

        });

    })
})

//add a new books 
app.post('/book',(req,res)=>{
    let name=req.body.name;
    let  author=req.body.author;
    console.log(name);
    console.log(author);
    //data  validation 
    if(!name || !author){
        return res.status(400).send({error:true,message:"please provide book name and author."})
    }else{
        dbCon.query('INSERT INTO books (name,author) VALUE(?,?)',[name,author],(error,results,fields)=>{
            if(error)throw error;
            return res.send({
                error:false,
                data:results,
                message:"book Successfully added"

            });
        })
    }
});

//retrieve book by id
app.get('/book/:id',(req,res)=>{
    let id=req.params.id;
    if(!id){
        return res.status(400).send({error:true,message:"please provide book id "})
    }else{
        dbCon.query("SELECT * FROM books WHERE id=?",id,(error,results,fields)=>{
            if(error)throw error;
            let message="";
            if(results===undefined||results.length==0){
                message="Book not found";
            }else{
                message = "Successfully retrieved book data";
                console.log(results);
                return res.send({
                    error:false,
                    data:results[0],
                    message:message
                })
            }

        })
    }
    
})

//update data books
app.put('/book',(req,res)=>{
    let id=req.body.id;
    let name=req.body.name;
    let author=req.body.author;

    //validation
    if(!id||!name||!author){
        return res.status(400).send({
            error:true,
            message:"Plesase provide book id,name and author"
        })
    }else{

        dbCon.query('UPDATE books set name=?,author=? WHERE id=?',[name,author,id],(error,results,fields)=>{
            if(error)throw error;
            
            let message = "";
            //เช็คดูข้อมูลว่ามีการเปลี่ยนแปลงหรือเปล่า
            if(results.changedRow===0){
                message="Book not found or data are same";
                
            }else{
                message="Book successfully updated";
                return res.send({
                    error:false,
                    data:results,
                    message:message
                })
            }

        })
    }

})

//Delete books
app.delete('/book',(req,res)=>{
    console.log(req);
    let id = req.body.id;

    if(!id){
        return res.status(400).send({
            error:true,
            message:"Plesase provide book id"
        })
    }else{
        dbCon.query('DELETE FROM books WHERE id=?',[id],(error,results,fields)=>{
            if(error)throw error;

            let message="";
            if(results.affectedRows===0){
                message="book not found";
                
            }else{
                message="Delete book successfully";
            }
            return res.send({
                error: false,
                data: results,
                message: message
            })

        })
    }

})


app.listen(3000,()=>{
    console.log("server running...");
})
module.exports=app;