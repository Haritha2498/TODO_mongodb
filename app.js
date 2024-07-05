const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const mongoose=require('mongoose');

mongoose.connect(
    "mongodb://localhost:27017/tododb"
)


const database=mongoose.connection;
database.on("error",(error)=>
{
    console.log(error)
});
database.once("connected",()=>
{
    console.log("database connected");
})

const tododb=require('./models/schema.js')




app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'addTask.html'));
});

app.get('/tasks', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'viewTasks.html'));
});

app.get('/task/:id', (req, res) => {
    const id = req.params.id;
    
    res.sendFile(path.join(__dirname, 'public', 'task.html'));
});

app.get('/api/tasks', async(req, res) => {
    const data=await tododb.find()

    res.json(data);

});

app.get('/api/task/:id', async(req, res) => {
    const id = req.params.id;
    
    const data=await tododb.findOne({id:id})
    res.json(data);
});

app.post('/addtask', async(req, res) => {
    const { title, description } = req.body;
    

    const count = await tododb.countDocuments(); 
    const id = count + 1;
    const newTask = { id, title, description };

    const data=await tododb.create(newTask)
    
    res.redirect('/tasks');
});

app.post('/updatetask/:id', async(req, res) => {
    const id = req.params.id;
    
    const { title, description } = req.body;
    

    const update={id,title,description};
    const options = { new: true };
    const updateddetails=await tododb.findOneAndUpdate({id:id},update,options);

    res.redirect('/tasks');
});

app.post('/deletetask/:id', async(req, res) => {
    const id = req.params.id;
    

    const deletedDetails = await tododb.findOneAndDelete({id:id});


    res.redirect('/tasks');
});

app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(3011, () => {
    console.log("Server is running on port 3011 ");
});