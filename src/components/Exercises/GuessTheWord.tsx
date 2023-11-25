import { useEffect, useState } from 'react';
import { IMeaning, ITopic, IWord, IWord_class, IRequest } from "../../Interfaces/interfaces";
import requester from "../../helpers/Requester";
import { EAlert } from "../../Interfaces/enums";
import { enqueueAlert } from "../../redux/slices/appSlice";
import { Dispatch, AnyAction } from 'redux';
import { useDispatch } from 'react-redux';

import { Input, Button } from "@mui/material";

const initialTopic:ITopic = {
  id_topic: 0,
  topic_name: ""
}

const initialWordClass:IWord_class = {
  id_word_class: 0,
  word_class: "",
  language: undefined
}

const GuessTheWord = ({
  currentWord,
  onSendAnswer
}:
{
  currentWord:IWord,
  onSendAnswer:any
}) => {

  const [topics, setTopics] = useState<ITopic>(initialTopic);
  const [wordClasses, setWordClasses] = useState<IWord_class>(initialWordClass);
  const [attempt, setAttempt] = useState<string>("");
  const [strike, setStrike] = useState<string>("");
  const [strikeCount, setStrikeCount] = useState<number>(0);
  const [ currentExample, setCurrentExample ] = useState<number>(0);

  //Reducers to alerts
  const dispatch:Dispatch<AnyAction> = useDispatch();

  useEffect(() => {
    getTopicByID(currentWord.meanings[0])
    .then((response) => setTopics(response));
    getWordClassByID(currentWord.meanings[0])
    .then((response) => setWordClasses(response));
  } ,[])


  const getTopicByID = async (wordToGet: IMeaning):Promise<ITopic> => {
    try {
      const word: IRequest<ITopic[]> = await requester({
        url: `/topics/${wordToGet.id_topic}`,
        method: 'GET'
      })

      if(word.response.statusCode === 200) 
        if(word.response.response !== undefined) {
          return word.response.response[0];
        }
      
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.warning, 
        message: "There has been an error getting the topic"}})); 
      return initialTopic;
    } catch (error) {
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.error, 
        message: "There has been an error connectiong to the server, try later"}})); 
      return initialTopic;
    }
  }

  const getWordClassByID = async (meaning: IMeaning):Promise<IWord_class> => {
    try {
      const wordClass: IRequest<IWord_class[]> = await requester({
        url: `/wordClasses/${meaning.id_word_class}`,
        method: 'GET'
      })
      if(wordClass.response.statusCode === 200) 
        if(wordClass.response.response !== undefined) {
          return wordClass.response.response[0];
        }
      
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.warning, 
        message: "There has been an error getting the topic"}})); 
      return initialWordClass;
    } catch (error) {
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.error, 
        message: "There has been an error connectiong to the server, try later"}})); 
      return initialWordClass;
    }
  }


  // Handlers
  const handleOnTryAttempt = ():void => {
    if(attempt.toLowerCase() === currentWord.word) {
      onSendAnswer();
      setStrike("");
      setStrikeCount(0);
      setAttempt("");
    } else {
      if(strikeCount < currentWord.word.length) {
        setStrike(strike + currentWord.word[strikeCount]);
        setStrikeCount(strikeCount + 1);
      }
    }
  }

  return (
    <div className='flex flex-row justify-center my-6 text-lg'>
      <div className='flex flex-col'>
        <div className="w-full h-full my-3 flex flex-row justify-center">
          <img src={currentWord.meanings[0].source} alt="Image of the meaning" />
        </div>
        <div className='my-6 flex flex-col justify-center text-center'>
          <span className=''>Meaning: </span> 
          <span className='italic font-bold capitalize'> { currentWord.meanings[0].meaning } </span>
        </div>
        <div className='flex flex-row justify-around'>
          <div>
            <span className='mr-3'>Word classification:</span>
            <span className='italic'>{ 
              wordClasses.id_word_class !== 0 &&
                wordClasses.word_class[0].toUpperCase() + wordClasses.word_class.slice(1)
            }</span>
          </div>
          <div className='ml-3'>
            <span className='mr-3'>Group:</span>
            <span className='italic'>{ 
              topics.id_topic !== 0 &&
                topics.topic_name[0].toUpperCase() + topics.topic_name.slice(1)
            }</span>
          </div>
        </div>
        {/* TODO examples view */}
        {/* { currentWord.meanings[0].examples[0] !== undefined &&
          <div className='my-6 flex flex-col justify-center text-center'>
            <span className=''>Examples: </span> 
          </div>
        } */}
        { strike !== "" &&
          <div className='my-6 flex flex-row justify-center'>
            <span className='mr-3'>Clue:</span>
            <span className='italic font-bold'>{ strike }</span>
          </div>
        }
        <div className='my-6 flex flex-row justify-center'>
          <Input 
            name="word" 
            placeholder="Word"
            value={attempt} 
            onChange={(e):any => { setAttempt( e.target.value ) }}/>
        </div>
        <div className='my-6 flex flex-row justify-center'>
          <Button variant="contained" color="info" onClick={():any => {
                handleOnTryAttempt()
              }}>
              Try it
          </Button>
        </div>

      </div>
    </div>
  )
}

export default GuessTheWord;