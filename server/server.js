const express = require('express');
const morgan = require('morgan'); 
const {check, validationResult} = require('express-validator'); 
const dao = require('./dao'); 
const userdao=require('./user_dao');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy; 


/*** Set up Passport ***/
passport.use(new LocalStrategy(
  function(username,password,done){
    userdao.getUser(username,password).then((user)=>{
      if(!user)
        return done(null,false,{message:'Incorrect username and/or password.'});
      return done(null,user);
    });
  }
));

passport.serializeUser((user,done)=>{
  done(null,user.id);
});

passport.deserializeUser((id,done)=>{
  userdao.getUserById(id).then((user)=>{
    done(null,user);
  })
  .catch((err)=>{
    done(err,null);
  });
});

//init express
const PORT = 3001;
const app = new express();

//setup middlewares
app.use(morgan('dev'));
app.use(express.json()); 

const isLoggedIn=(req,res,next)=>{
  if(req.isAuthenticated())
    return next();
  return res.status(400).json({error:'Not authorized'});
}

//enalbe sessions in express
app.use(session({
  secret: 'una frase segreta da non condividere con nessuno e da nessuna parte, usata per firmare il cookie Session ID',
  resave: false,
  saveUninitialized: false,
}));

//init Passport to use sessions
app.use(passport.initialize());
app.use(passport.session());

/*** API ***/


app.post('/api/sessions',  function(req, res, next) {
  
  const errors = validationResult(req);    
  if ( !errors.isEmpty() || req.body.password.length <= 6) {
    return res.status(401).json({message: "Username/passowrd not valid! Try again!"});
  }
  
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);
    
    // req.user contains the authenticated user, we send all the user info back
    // this is coming from userDao.getUser()
    return res.json(req.user);

    });
  })(req, res, next);
});

//LOGOUT
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

//Get current session to check if user logged out
app.get('/api/sessions/current',(req,res)=>{
  if(req.isAuthenticated())
    res.json(req.user);
  else
    res.status(401).json({error:'Not authenticated'});
})

// GET /api/surveys/ 
app.get('/api/surveys', (req, res) => {
  if(req.query.admin){
    dao.getSurveysbyID(req.query.admin)
        .then(surveys => res.json(surveys))
        .catch(()=> res.status(500).end());
  }
  else{
    dao.getSurveys()
    .then(surveys => res.json(surveys))
    .catch(()=> res.status(500).end());
  }
});

// GET /api/survey/ by Survey ID
app.get('/api/survey', (req, res) => {
  if(req.query.title){
    dao.getSurveysbyTitle(req.query.title)
        .then(survey => res.json(survey))
        .catch(()=> res.status(500).end());
  }
});
// GET /api/questions dato surveyID
app.get('/api/questions',(req, res) => {
  dao.getQuestionsbyID(req.query.id)
      .then(questions => res.json(questions))
      .catch(()=> res.status(500).end());
});

// GET /api/answers dato surveyID
app.get('/api/answers',(req, res) => {
  dao.getAnswersbyID(req.query.Sid)
      .then(answers => res.json(answers))
      .catch(()=> res.status(500).end());
});

// GET /api/compiled totali questionari compilati per ciascun surveyID
app.get('/api/compiled',isLoggedIn,(req, res) => {
  dao.getTotalCompiled(req.query.id)
      .then(x => res.json(x))
      .catch(()=> res.status(500).end());
});

// GET /api/compiled dato surveyID per totali utenti
app.get('/api/username',(req, res) => {
  dao.getTotalUsers(req.query.id)
      .then(users => res.json(users))
      .catch(()=> res.status(500).end());
});

// GET /api/multipleanswers
app.get('/api/multipleanswers',(req, res) => {
  dao.getMultipleAnswersbyID(req.query.id)
      .then(answers => res.json(answers))
      .catch(()=> res.status(500).end());
});

// POST /api/questions/
app.post('/api/questions/',isLoggedIn,[
  check('text').notEmpty(),
  check('surveyID').isNumeric(),
  check('min').isNumeric(),
  check('max').isNumeric(),
  check('ordine').isNumeric()
],  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(422).json({errors: errors.array()});
  const questionToAdd = req.body;
  try{
    dao.createQuestion(questionToAdd)
      .then(id => res.json(id));
  }catch(err){
    res.status(503).json({error:`Generic error`});
  }
});

// POST /api/surveys/
app.post('/api/surveys/',isLoggedIn,[
  check('title').notEmpty(),
  check('adminID').isNumeric(),
  check('compilazioni').isNumeric(),
],  async (req, res) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(422).json({errors: errors.array()});
  const surveyToAdd = req.body;
  try{
    dao.createSurvey(surveyToAdd)
      .then(id => res.json(id));
  }catch(err){
    res.status(503).json({error:`Generic error`});
  }
});

// PUT /api/surveys/
app.put('/api/surveys/',[
  check('id').isNumeric()
],  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(422).json({errors: errors.array()});
  try{
    await dao.updateSurvey(req.body.id);
    res.status(201).end();
  }catch(err){
    res.status(503).json({error:`Generic error`});
  }
});

// POST /api/comp/
app.post('/api/comp/',[
  check('Username').notEmpty(),
  check('SurveyID').isNumeric()
],  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(422).json({errors: errors.array()});
  try{
    await dao.updateCompiled(req.body.Username,req.body.SurveyID);
    res.status(201).end();
  }catch(err){
    res.status(503).json({error:`Generic error`});
  }
});

// POST /api/answers/
app.post('/api/answers/',[
  check('username').notEmpty(),
  check('text').notEmpty(),
  check('questionID').isNumeric(),
  check('surveyID').isNumeric(),
],  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(422).json({errors: errors.array()});
  const answerToAdd = req.body;
  try{
    await dao.createAnswer(answerToAdd);
    res.status(201).end();
  }catch(err){
    res.status(503).json({error:`Generic error`});
  }
});

// POST /api/multipleanswers/
app.post('/api/multipleanswers/',isLoggedIn,[
  check('AnswerText').notEmpty(),
  check('QuestionID').isNumeric(),
],  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) 
    return res.status(422).json({errors: errors.array()});
  const answerToAdd = req.body;
  try{
    await dao.createMAnswer(answerToAdd);
    res.status(201).end();
  }catch(err){
    res.status(503).json({error:`Generic error`});
  }
});

app.delete('/api/questions/:id',isLoggedIn,(req,res)=>{
  dao.deleteQuestion(req.params.id)
      .then(()=> res.status(204).end())
      .catch(()=>res.status(504).json({error:  `Database error during the update of task ${taskToUpdate.id}`}));
})


app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));