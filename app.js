const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB using mongoose
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/UserData', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

// Call the connectDB function to establish the connection
connectDB();

const blog = mongoose.model('blog_posts', new mongoose.Schema({
  title: String,
  content: String,
  image: Buffer,
  cat:String,
}));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



app.post('/blog', upload.single('image'), async (req, res) => {
  try {
    const { title,cat,content } = req.body;

    const document = {
      title: title,
      content: content,
      cat:cat,

      image: req.file.buffer,
    };

    await blog.create(document);

    app.use('/styles', express.static(path.join(__dirname, 'public', 'website.css')));

  const update = await blog.find();
  res.render('website',{posts:update}); 
  } catch (err) {
    console.log('Error occurred', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.set('view engine', 'ejs');


//display the ejs for home page

app.get('/', async (req,res)=>{

try{
  app.use('/styles', express.static(path.join(__dirname, 'public', 'website.css')));

  const multiple_Doc = await blog.find();
  res.render('website',{posts:multiple_Doc}); 

}
catch(err){
  console.error(err);
  res.status(500).json({ error: 'Internal server error occurred in finding multi docs' });

}

});


app.use(express.static('public'));
app.get('/editor',async (req,res)=>{

  res.sendFile(path.join(__dirname, 'public', 'editor.html'));

});

app.use(express.static('public'));
app.use('/styles', express.static(path.join(__dirname, 'public', 'display.css')));
app.get('/post/:id',async (req,res)=>{

 try{

  const object_id = req.params.id;
  const blog_data = await blog.findById(object_id);
  res.render('display',{blog_details:blog_data});

 }
 catch(err){
  console.error(err);
  res.status(500).json({error_message:'internal error in blog_details'});
 }

});



// for lables food and technology,beauty,entertainment

app.get('/:page',async(req,res)=>{

  try{
    const cat = req.params.page;
    const data = await blog.find({ cat: cat });
    res.render('foodblogs',{blogs:data});

  }
  catch(err){
    console.error(err);
    res.status(500).json({error:'error in food data'});
  }
});





app.listen(port, () => {
  console.log('Server is running...');
});
