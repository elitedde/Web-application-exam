'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');


// open the database
const db = new sqlite.Database('mydb.db', (err) => {
  if(err) throw err;
});

// get all surveys
exports.getSurveys = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Surveys';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const surveys = rows.map((e) =>({id:e.id, title:e.title,adminID: e.adminID, compilazioni:e.compilazioni}));
      resolve(surveys);
    });
  });
};

// get the survey by title
exports.getSurveysbyTitle = (title) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Surveys WHERE title=?';
    db.all(sql, [title], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({error: 'Surveys not found.'});
      } else {
        const surveys = rows.map((e) => ({id:e.id, title:e.title,adminID: e.adminID,compilazioni:e.compilazioni}));
        resolve(surveys);
      }
    });
  });
}
// get Surveys by adminID
exports.getSurveysbyID = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Surveys WHERE adminID=?';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({error: 'Surveys not found.'});
      } else {
        const surveys = rows.map((e) => ({id:e.id, title:e.title,adminID: e.adminID,compilazioni:e.compilazioni}));
        resolve(surveys);
      }
    });
  });
};

// get Questions by surveyID
exports.getQuestionsbyID = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM Questions WHERE surveyID=? ORDER BY ordine';
      db.all(sql, [id], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        if (rows == undefined) {
          resolve({error: 'Questions not found.'});
        } else {
          const questions = rows.map((e) => ({id:e.id, text:e.text,surveyID:e.surveyID,min:e.min,max:e.max,maxrisposte:e.maxrisposte}));
          resolve(questions);
        }
      });
    });
  };
  // get MultipleAnswers by questionID
exports.getMultipleAnswersbyID = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM MultipleAnswers WHERE QuestionID=?';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({error: 'Answers not found.'});
      } else {
        const answers = rows.map((e) => e.AnswerText);
        resolve(answers);
      }
    });
  });
};
// get Users by SurveyID
exports.getTotalUsers = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Compiled WHERE surveyID=?';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({error: 'survey not found.'});
      } else {
        const users = rows.map((e) => e.Username);
        resolve(users);
      }
    });
  });
};
// get Total Compiled by SurveyID
exports.getTotalCompiled = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) FROM Compiled WHERE surveyID=?';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({error: 'survey not found.'});
      } else {
        const compiled = rows;
        resolve(compiled);
      }
    });
  });
};
//GET Answers by surveyID
exports.getAnswersbyID = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Answers WHERE surveyID = ? ';
    db.all(sql, [id], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows == undefined) {
        resolve({error: 'Answers not found.'});
      } else {
        const answers = rows.map((e) => ({id:e.id,username:e.username, text:e.text,questionID:e.questionID,surveyID:e.surveyID}));
        resolve(answers);
      }
    });
  });
};

// add a new question
exports.createQuestion = (question) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Questions(text, surveyID, min, max,maxrisposte,ordine) VALUES(?,?,?,?,?,?)';
    db.run(sql, [question.text, question.surveyID, question.min, question.max, question.maxrisposte, question.ordine], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}

// add a new survey
exports.createSurvey = (survey) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO Surveys(title, adminID, compilazioni) VALUES(?,?,?)';
      db.run(sql, [survey.title, survey.adminID, survey.compilazioni], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  }
// add compiled survey 
exports.updateSurvey = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Surveys SET compilazioni = compilazioni + 1 WHERE id= ?'
    db.run(sql, [id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}
// add a new association
exports.updateCompiled = (Username, SurveyID) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Compiled(Username, SurveyID) VALUES(?,?)';
    db.run(sql, [Username, SurveyID], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}

// add a new answer
exports.createAnswer = (answer) => {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO Answers(username, text, questionID, surveyID) VALUES(?,?,?,?)';
      db.run(sql, [answer.username, answer.text, answer.questionID,answer.surveyID], function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
}
// add a new multple answer
exports.createMAnswer = (answer) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO MultipleAnswers(AnswerText, QuestionID) VALUES(?,?)';
    db.run(sql, [answer.AnswerText, answer.QuestionID], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}

// delete an existing question
exports.deleteQuestion = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM questions WHERE id = ?';
    db.run(sql, [id], (err) => {
      if (err) {
        reject(err);
        return; 
      } else
        resolve(null);
    });
  });
}

