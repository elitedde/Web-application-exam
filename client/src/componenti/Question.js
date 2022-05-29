class Question {
    constructor(id, text, surveyID, min, max, maxrisposte,ordine){
    this.id = id;
    this.text = text;
    this.surveyID = surveyID;
    this.min = min;
    this.max = max;
    this.maxrisposte = maxrisposte
    this.possible_answers = []; /*nel caso di più risposte*/
    this.ordine = ordine;
    }
    setAnswers(listA){
      this.possible_answers = listA;
    }
    getAnswers(){
      return this.possible_answers;
    }

}
  export {Question};
