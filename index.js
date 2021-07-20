const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const TodoTask = require("./models/TodoTask");

const app = express()
dotenv.config()

const PORT = process.env.PORT | 3000

app.use('/static', express.static('public'))
app.use(express.urlencoded({
   extended: true
}))

mongoose.set('useFindAndModify', false)
mongoose.connect(process.env.DB_TO_CONNECT, {
   useNewUrlParser: true,
   useUnifiedTopology: true
}, () => {
   console.log('Connected to DB..')
   app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
})

app.set('view engine', 'ejs')

// Get Todos
app.get("/", (req, res) => {
   TodoTask.find({}, (err, tasks) => {
      res.render("todo.ejs", {
         todoTasks: tasks
      });
   });
});

// Create Todos
app.post('/', async (req, res) => {
   const todoTask = new TodoTask({
      content: req.body.content
   });
   try {
      await todoTask.save();
      res.redirect("/");
   } catch (err) {
      res.redirect("/");
   }
});

// Update Todos
app.route("/edit/:id").get((req, res) => {
   const id = req.params.id;
   TodoTask.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", {
         todoTasks: tasks,
         idTask: id
      });
   });
}).post((req, res) => {
   const id = req.params.id;
   TodoTask.findByIdAndUpdate(id, {
      content: req.body.content
   }, err => {
      if (err) return res.send(500, err);
      res.redirect("/");
   });
});

// Delete Todos
app.route("/remove/:id").get((req, res) => {
   const id = req.params.id;
   TodoTask.findByIdAndRemove(id, err => {
      if (err) return res.send(500, err);
      res.redirect("/");
   });
});