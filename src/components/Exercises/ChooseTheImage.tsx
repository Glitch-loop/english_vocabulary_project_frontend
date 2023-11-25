import { useEffect, useState } from 'react';
import { IMeaning, ITopic, IWord, IWord_class, IRequest } from "../../Interfaces/interfaces";
import requester from "../../helpers/Requester";
import { EAlert } from "../../Interfaces/enums";
import { enqueueAlert } from "../../redux/slices/appSlice";
import { Dispatch, AnyAction } from 'redux';
import { useDispatch } from 'react-redux';
import { randomNumber } from '../../utils/utils';

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

const initialMeaning:IMeaning = {
  id_meaning: 0,
  meaning: "",
  source: "",
  recently_practiced: 0,
  times_practiced: 0,
  id_word: 0,
  id_word_class: 0,
  id_topic: 0,
  examples: []
}

const initialWord:IWord = {
  id_word: 0,
  word: "",
  meanings: [
    initialMeaning
  ]
}


const ChooseTheImage = ({
  currentWord,
  setOfWords,
  onSendAnswer
}:
{
  currentWord:IWord,
  setOfWords:IWord[],
  onSendAnswer:any
}) => {
  const [topics, setTopics] = useState<ITopic>(initialTopic);
  const [wordClasses, setWordClasses] = useState<IWord_class>(initialWordClass);
  const [attempt, setAttempt] = useState<string>("");
  const [strike, setStrike] = useState<boolean>(false);
  const [strikeCount, setStrikeCount] = useState<number>(0);
  const [wordSelected, setWordSelected] = useState<IWord>(initialWord);

  //Reducers to alerts
  const dispatch:Dispatch<AnyAction> = useDispatch();

  useEffect(() => {
    getTopicByID(currentWord.meanings[0])
    .then((response) => setTopics(response));
    getWordClassByID(currentWord.meanings[0])
    .then((response) => setWordClasses(response));
  } ,[currentWord])


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
    if(currentWord.meanings[0].id_meaning === wordSelected.meanings[0].id_meaning) {
      onSendAnswer();
      setStrike(false);
      setWordSelected(initialWord);
    } else {
      setStrike(true);
    }
  }

  const handleOnSelectItem = (userSelection:IWord) => {
    setWordSelected(userSelection);
  }

  return (
    <div className='flex flex-row justify-center my-6 text-lg w-full'>
      <div className='flex flex-col'>
        <div className='my-6 flex flex-col justify-center text-center'>
          <span className='italic font-bold capitalize'> { currentWord.word } </span>
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
        { strike &&
          <span className='italic font-bold capitalize text-center my-3'> You are wrong </span>
        }
        <div className='flex flex-row my-6'>
          { setOfWords.map(word => {
            return (
              <div 
                key={ word.meanings[0].id_meaning }
                onClick={() => { handleOnSelectItem(word) }} 
              className= { word.meanings[0].id_meaning === wordSelected.meanings[0].id_meaning ?
                'mx-2 w-full h-full flex flex-col justify-center outline outline-offset-2 outline-4': 'mx-2 w-full h-full flex flex-col justify-center'
              }
              >
                <div className="flex flex-row justify-center">
                  <img src={ word.meanings[0].source } alt="Image of the meaning" />
                </div>
                <p className='text-center text-sm'>{ word.meanings[0].meaning }</p>
              </div>

            )
          })}
        </div>
        {/* TODO examples view */}
        {/* { currentWord.meanings[0].examples[0] !== undefined &&
          <div className='my-6 flex flex-col justify-center text-center'>
            <span className=''>Examples: </span> 
          </div>
        } */}
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

export default ChooseTheImage;