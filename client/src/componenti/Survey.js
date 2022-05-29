
import API from '../API.js';
class Survey {
  constructor(id, title, adminID, compilazioni){
    this.id = id;
    this.title = title;
    this.adminID = adminID;
    this.compilazioni = compilazioni
    this.domande = [];
  }

  async setDomande(){
    const dd = await API.fetchQuestions(this.id);
    this.domande = dd;
    this.domande.filter(x => x.max >0).forEach(async(d)=>{
          d.possible_answers=await API.fetchMutipleAnswers(d.id);
        });
  }
  
  getDomande(){
    return this.domande;
  }

}
  
export {Survey};