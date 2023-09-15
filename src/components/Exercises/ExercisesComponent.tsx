import { useState } from 'react';
import { ITopic, IWord_class, IWord, IMeaning, IRequest } from "../../Interfaces/interfaces";
import SearchTopic from "../Searchers/SearchTopic";
import SearchWordClasses from "../Searchers/SearchWordClasses";
import GuessTheWord from './GuessTheWord';
import requester from '../../helpers/Requester';
import { EAlert } from "../../Interfaces/enums";
import { enqueueAlert } from "../../redux/slices/appSlice";
import { Dispatch, AnyAction } from 'redux';
import { useDispatch } from 'react-redux';
import { randomNumber } from '../../utils/utils';

import Switch from '@mui/material/Switch';
import { Input, Button } from "@mui/material";
import ChooseTheImage from './ChooseTheImage';


const initialTopic:ITopic = {
  id_topic: 0,
  topic_name: ""
}

const initialWordClass:IWord_class = {
  id_word_class: 0,
  word_class: "",
  language: undefined
}

const verifyIsNumber = (input:string):any => {
  for(let i = 0; i < input.length; i++) {
    const ascii = input.charCodeAt(i);
    if(!(ascii >= 48 && ascii <= 57)) {
      return '10'; //There is a char that is not a number
    } 
  }

  return input;
}

const getSetToPlay = (amountSet:number, maximumValue:number, currentIndex:number, setOfWords:IWord[]):IWord[] => {
  const setWordsToPlay:IWord[] = [];
  const usedNumbers:number[] = [];

  const positionCorrectAnswer:number = randomNumber(amountSet - 1);

  let index:number = 0;
  while(index < amountSet) {
    
    let newNumber = randomNumber(maximumValue);
    if(positionCorrectAnswer === index) { // This position is reserved for the correct answer
      setWordsToPlay.push(setOfWords[currentIndex]);
      index++;
    } else {
      if(newNumber !== currentIndex && usedNumbers.find(item => item === newNumber) === undefined) {
        setWordsToPlay.push(setOfWords[newNumber]);
        usedNumbers.push(newNumber);
        index++;
      }
    }
  }
  
  return setWordsToPlay;
}



const ExercisesComponent = () => {
  const [topics, setTopics] = useState<ITopic>(initialTopic);
  const [wordClasses, setWordClasses] = useState<IWord_class>(initialWordClass);
  const [lessStudiedWords, setLessStudiedWords] = useState<boolean>(false);
  const [numberWords, setNumberWords] = useState<number>(10);

  const [activity, setActivity] = useState<IWord[]>([]);
  const [ questionNumber, setQuestionNumber ] = useState<number>(1);
  const [ inActivity, setInActivity ] = useState<boolean>(false);

  //Reducers to alerts
  const dispatch:Dispatch<AnyAction> = useDispatch();

  //Calls to API
  const getActivity = async ():Promise<IWord[]> => {
    try {
      const data:any = {
        "idTopic": 0, 
        "idWordClass": 0, 
        "lessStudiedWord": false, 
        "numberWords": 10
      }
      const word: IRequest<IWord[]> = await requester({
        url: `/activities`,
        method: 'PATCH',
        data:data

      })

      if(word.response.statusCode === 200) 
        if(word.response.response !== undefined) {
          return word.response.response;
        }
      
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.warning, 
        message: "There has been an error getting the topic"}})); 
      return [];
    } catch (error) {
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.error, 
        message: "There has been an error connectiong to the server, try later"}})); 
      return [];
    }
  }

  const handleOnAssessAnswer = () => {
    if((questionNumber - 1) < (activity.length - 1)) {
      setQuestionNumber(questionNumber + 1);
    } else {
      setQuestionNumber(1);
      setInActivity(false);
      setActivity([]);
    }
  }

  return (
    <div className='mt-6 flex flex-row w-full h-full justify-center items-center'>
      <div className='flex flex-col w-1/2'>
        { !inActivity &&
          <div className=''>
              <div className="flex flex-row justify-around">
              <SearchTopic 
                onSelectItem={(item:ITopic) => { setTopics(item) }} 
                initialValue={topics}/>

              <SearchWordClasses onSelectItem={(item:IWord_class) => { 
                setWordClasses(item);
                }}
                initialValue={wordClasses}
                />
              </div>
              <div className='my-6 flex flex-row justify-center items-center'>
                <span className='text-lg font-bold text-center'>Less studied words: </span>
                <Switch checked={lessStudiedWords} onChange={() => {setLessStudiedWords(!lessStudiedWords)}}/>
              </div>
              <div className='my-6 flex flex-row justify-center items-center'>
                <Input 
                    name="number_words" 
                    placeholder="Number of words"
                    value={numberWords} 
                    onChange={(e:any):any => { 
                      const input:string = e.target.value;
                      setNumberWords(verifyIsNumber(input)) 
                    }}/>
              </div>
              <div className='my-6 flex flex-row justify-center items-center'>
                <Button variant="contained" color="info" 
                  onClick={():any => { 
                    getActivity()
                    .then((response) => {
                      setActivity(response);
                      setInActivity(true);
                    })
                  }}>
                  Play
                </Button>
              </div>
          </div>
        }
        
        { inActivity &&
          <div>
            <div className='text-center text-2xl'>{questionNumber} / { activity.length }</div>
            { randomNumber(2) === 1 ?
              <GuessTheWord 
                onSendAnswer={handleOnAssessAnswer}
                currentWord={activity[questionNumber - 1]}/>:
              <ChooseTheImage 
                onSendAnswer={handleOnAssessAnswer}
                setOfWords={getSetToPlay(3, activity.length - 1, questionNumber - 1, activity,)}
                currentWord={activity[questionNumber - 1]}
                />
            }
          </div>
        }
      </div>
    </div>
  )
}

export default ExercisesComponent