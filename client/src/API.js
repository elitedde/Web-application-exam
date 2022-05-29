import {Survey} from './componenti/Survey.js';
import {Question} from './componenti/Question.js';
import {Answer} from './componenti/Answer.js';

/*prendo tutti surveys*/
const fetchSurveys = async() =>{
    const response = await fetch('/api/surveys');
    const responseBody = await response.json().then(x => x.map((e) => new Survey(e.id, e.title, e.adminID, e.compilazioni)));
    return responseBody;
}
/*prendo surveys dato admin*/
const fetchSurveysAdmin = async(adminID) =>{
    const response = await fetch('/api/surveys?admin='+adminID);
    const responseBody = await response.json().then(x => x.map((e) => new Survey(e.id, e.title, e.adminID,e.compilazioni)));
    return responseBody;
}
/*prendo survey dato id*/
const fetchSurveybyTitle = async(title) =>{
    const response = await fetch('/api/survey?title='+title);
    const responseBody = await response.json().then(x => x.map((e) => new Survey(e.id, e.title, e.adminID, e.compilazioni)));
    return responseBody;
}
/*prendo questions dato surveyID*/
const fetchQuestions = async(surveyID) =>{
    const response = await fetch('/api/questions?id='+surveyID);
    const responseBody = await response.json().then(x => x.map((e) => new Question(e.id, e.text, e.surveyID, e.min, e.max, e.maxrisposte)));
    return responseBody;
}
/*prendo numero di compilazioni totali dato surveyID*/
const fetchTotalCompiled = async(surveyID) =>{
    const response = await fetch('/api/compiled?id='+surveyID);
    const responseBody = await response.json();
    return responseBody;
}
/*prendo numero di utenti totali dato surveyID*/
const fetchTotalUsers = async(surveyID) =>{
    const response = await fetch('/api/username?id='+surveyID);
    const responseBody = await response.json();
    return responseBody;
}
/*prendo answers dato surveyID*/
const fetchAnswers = async(surveyID) =>{
    const response = await fetch('/api/answers?Sid='+surveyID);
    const responseBody = await response.json().then(x => x.map((e) => new Answer(e.id, e.username, e.text, e.questionID, e.surveyID)));
    return responseBody;
}
/*prendo multipleanswers dato questionID*/
const fetchMutipleAnswers = async(questionID) =>{
    const response = await fetch('/api/multipleanswers?id='+questionID);
    const responseBody = await response.json();
    return responseBody;
}
/*aggiungo multipleanswers dato questionID*/
const fetchAddMutipleAnswers = async(answer, idQ) =>{
    const response = await fetch('/api/multipleanswers',{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({AnswerText: answer, QuestionID: idQ }),
    });
}

/*aggiungo survey*/
const fetchAddSurvey = async(survey) =>{  
    const response = await fetch('/api/surveys',{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({title: survey.title, adminID: survey.adminID, compilazioni: survey.compilazioni}),
    });
    const responseBody = await response.json();
    return responseBody;
}

/*aggiungo compilazioni*/
const fetchUpdateSurvey = async(id) =>{  
    const response = await fetch('/api/surveys',{
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({id: id}),
    });
}
/*aggiungo answer */
const fetchAddAnswer = async(answer) =>{  
    const response = await fetch('/api/answers',{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({username: answer.username, text: answer.text, questionID: answer.questionID,surveyID: answer.surveyID}),
    });
}
/*aggiungo question*/
const fetchAddQuestion = async(question, sID) =>{  
    const response = await fetch('/api/questions',{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({text: question.text, surveyID: sID, min: question.min, max: question.max, maxrisposte: question.maxrisposte, ordine: question.ordine}),
    });
    const responseBody = await response.json();
    return responseBody;
}
/*aggiungo riga in compiled table*/
const fetchAddCompiledQuest = async(user, qID) =>{  
    const response = await fetch('/api/comp',{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({Username: user, SurveyID: qID}),
    });
}
/*elimino una domanda passando id*/
const fetchDelete = async(id) =>{
    const response = await fetch('/api/questions/'+id,{
    method: 'DELETE'
    });
}

const login = async(credentials) =>{
    let response = await fetch('/api/sessions',{
    method:'POST',
    headers:{
        'Content-Type':'application/json'},
    body: JSON.stringify(credentials),
    });
    if(response.ok){
        const user=await response.json();
        return user;
    }else{
        const errDetails=await response.text();
        throw errDetails;
    }
}

async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo(){
    const res = await fetch('/api/sessions/current');
    const userInfo = await res.json();
    if(res.ok)
    return userInfo;
    else
    throw userInfo;
}
  
  const API={fetchSurveys,fetchSurveybyTitle,fetchAddCompiledQuest,fetchUpdateSurvey,fetchTotalUsers,fetchAddMutipleAnswers,fetchTotalCompiled,fetchMutipleAnswers,fetchSurveysAdmin,fetchQuestions,fetchAnswers,fetchAddSurvey,fetchAddQuestion,fetchAddAnswer,fetchDelete,login,getUserInfo,logOut};
  export default API;