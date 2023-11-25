import { IImportWordExcel, ITopic, IWord_class } from "../Interfaces/interfaces";

const initialTopic:ITopic = {
  id_topic: 0,
  topic_name: ""
}

const initialWordClass:IWord_class = {
  id_word_class: 0,
  word_class: "",
  language: undefined
}

const initialImportWordExcel:IImportWordExcel = {
  word: "",
  meaning: "",
  id_topic: 0,
  id_word_class: 0
}

const randomNumber = (maximumNumber:number):number => {
  return Math.floor((Math.random() * maximumNumber) + 1);
}

const emptyOrUndefined = (data:string):boolean => {
  if(data === null || data === undefined || data === "") return true;
  else return false;
}

export {
  initialTopic,
  initialWordClass,
  initialImportWordExcel,
  randomNumber,
  emptyOrUndefined
}