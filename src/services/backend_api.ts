import requester from "../helpers/Requester";
import { failedResponse } from '../utils/genericResponses';

import { IExample, IMeaning, IRequest, ITopic, IWord, IWord_class } from "../Interfaces/interfaces";

const initialTopic:ITopic = {
  id_topic: 0,
  topic_name: ""
}

const initialWordClass:IWord_class = {
  id_word_class: 0,
  word_class: "",
  language: undefined
}

//Endpoints related to topics
const addTopic = async (newTopic: ITopic):Promise<IRequest<ITopic>> => {
  try {
    const topic: IRequest<ITopic> = await requester({
      url: `/topics`,
      method: 'POST',
      data: newTopic
    })
    return topic;
  } catch (error) {
    return failedResponse;
  }
}

const updateTopic = async (updateTopic: ITopic):Promise<IRequest<ITopic[]>> => {
  try {
    const topic: IRequest<ITopic[]> = await requester({
      url: `/topics/${updateTopic.id_topic}`,
      method: 'PUT',
      data: updateTopic
    })
    return topic;
  } catch (error) {
    return failedResponse;
  }
}

const deleteTopic = async (deleteTopic: ITopic):Promise<IRequest<any>> => {
  try {
    const word: IRequest<any> = await requester({
      url: `/topics/${deleteTopic.id_topic}`,
      method: 'DELETE'
    })
    return word;
  } catch (error) {
    return failedResponse;
  }
}

const getAllTopic = async ():Promise<IRequest<ITopic[]>> => {
  try {
    const word: IRequest<ITopic[]> = await requester({
      url: `/topics`,
      method: 'GET'
    })
    return word;
  } catch (error) {
    return failedResponse;
  }
}

const getTopicByID = async (id_topic: number):Promise<IRequest<ITopic[]>> => {
  try {
    const word: IRequest<ITopic[]> = await requester({
      url: `/topics/${id_topic}`,
      method: 'GET'
    })
    return word;
  } catch (error) {
    return failedResponse;
  }
}

// Endpoints related to word classification
const getWordClassByID = async (id_word_class: number):Promise<IRequest<IWord_class[]>> => {
  try {
    const wordClass: IRequest<IWord_class[]> = await requester({
      url: `/wordClasses/${id_word_class}`,
      method: 'GET'
    })
    return wordClass;
  } catch (error) {
    return failedResponse;
  }
}

// Endpoint related to word
const addWord = async (newWord: IWord):Promise<IRequest<IWord>> => {
  try {
    const word: IRequest<IWord> = await requester({
      url: `/words`,
      method: 'POST',
      data: newWord
    })
    
    return word;
  } catch (error) {
    return failedResponse;
  }
}

const updateWord = async (updateWord: IWord):Promise<IRequest<IWord[]>> => {
  try {
    const word: IRequest<IWord[]> = await requester({
      url: `/words/${updateWord.id_word}`,
      method: 'PUT',
      data: updateWord
    })
  
    return word;
  } catch (error) {
    return failedResponse;
  }
}

const deleteWord = async (deleteWord: IWord):Promise<IRequest<IWord[]>> => {
  try {
    const word: IRequest<IWord[]> = await requester({
      url: `/words/${deleteWord.id_word}`,
      method: 'DELETE'
    })
    
    return word;
  } catch (error) {
    return failedResponse;
  }
}

const getWordById = async (wordToGet: IWord):Promise<IRequest<IWord[]>> => {
  try {
    const word: IRequest<IWord[]> = await requester({
      url: `/words/${wordToGet.id_word}`,
      method: 'GET'
    })
    return word;
  } catch (error) {
    return failedResponse;
  }
}

const addMeaning = async (newMeaning: IMeaning):Promise<IRequest<IMeaning>> => {
  try {
    const word: IRequest<IMeaning> = await requester({
      url: `/meanings`,
      method: 'POST',
      data: newMeaning
    });
    return word
  } catch (error) {
    return failedResponse;
  }
}

const deleteMeaning = async (deleteMeaning: IMeaning):Promise<IRequest<any>> => {
  try {
    const word: IRequest<IWord[]> = await requester({
      url: `/meanings/${deleteMeaning.id_meaning}`,
      method: 'DELETE'
    })
    return word;
  } catch (error) {
    return failedResponse;
  }
}

const getMeaningById = async (meaningToGet: IMeaning):Promise<IRequest<IMeaning[]>> => {
  try {
    const word: IRequest<IMeaning[]> = await requester({
      url: `/meanings/${meaningToGet.id_meaning}`,
      method: 'GET'
    })
    return word;
  } catch (error) {
    return failedResponse;
  }
}

const addExample = async (newExample: IExample):Promise<IRequest<IExample>> => {
  try {
    const word: IRequest<IExample> = await requester({
      url: `/meanings/examples/${newExample.id_meaning}`,
      method: 'POST',
      data: newExample
    })
    return word
  } catch (error) {
    return failedResponse;
  }
}

const updateExample = async (updateExample: IExample):Promise<IRequest<any>> => {
  try {
    const responseExample: IRequest<IExample[]> = await requester({
      url: `/meanings/examples/${updateExample.id_example}`,
      method: 'PUT',
      data: updateExample
    })
    return responseExample;
  } catch (error) {
    return failedResponse;
  }
}

const deleteExample = async (deleteExample: IExample):Promise<IRequest<any>> => {
  try {
    const word: IRequest<IExample[]> = await requester({
      url: `/meanings/examples/${deleteExample.id_example}`,
      method: 'DELETE'
    })
    return word;
  } catch (error) {
    return failedResponse;
  }
}

export {
  addTopic,
  updateTopic,
  deleteTopic,
  getTopicByID,
  getAllTopic,
  getWordClassByID,
  addWord,
  updateWord,
  deleteWord,
  getWordById,
  addMeaning,
  deleteMeaning,
  getMeaningById,
  addExample,
  updateExample,
  deleteExample
}