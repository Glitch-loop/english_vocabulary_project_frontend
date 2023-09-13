import { useState } from 'react';
import requester from "../../helpers/Requester";
import { EAlert } from "../../Interfaces/enums";
import { enqueueAlert } from "../../redux/slices/appSlice";
import { Dispatch, AnyAction } from 'redux';
import { useDispatch } from 'react-redux';
import { IExample, IMeaning, IRequest, ITopic, IWord, IWord_class } from "../../Interfaces/interfaces";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { MdEditDocument, MdDeleteForever } from "react-icons/md";

import { Input, Button } from "@mui/material";
import SearchTopic from '../Searchers/SearchTopic';
import SearchWord from '../Searchers/SearchWord';
import SearchWordClasses from '../Searchers/SearchWordClasses';
import { failedResponse } from '../../utils/genericResponses';

const initialWord:IWord = {
  id_word: 0,
  word: "",
  meanings: []
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

const initialExample:IExample = {
  id_example: 0,
  example: "",
  id_meaning: 0
}

const initialTopic:ITopic = {
  id_topic: 0,
  topic_name: ""
}

const initialWordClass:IWord_class = {
  id_word_class: 0,
  word_class: "",
  language: undefined
}

const WordManagerComponent = () => {
  const [word, setWord] = useState<IWord>(initialWord);
  const [meaning, setMeaning] = useState<IMeaning>(initialMeaning);
  const [example, setExample] = useState<IExample>(initialExample);
  const [manageMeaning, setManageMeaning] = useState<boolean>(false);
  const [manageExample, setManageExample] = useState<boolean>(false);

  const [topic, setTopic] = useState<ITopic>(initialTopic);
  const [wordClasses, setWordClasses] = useState<IWord_class>(initialWordClass);
  
  //Reducers to alerts
  const dispatch:Dispatch<AnyAction> = useDispatch();

  // Calls to API
  const addWord = async (newWord: IWord):Promise<IWord[]> => {
    try {
      const word: IRequest<IWord[]> = await requester({
        url: `/words`,
        method: 'POST',
        data: newWord
      })
      
      if(word.response.statusCode === 200) 
        if(word.response.response !== undefined) {
          dispatch(enqueueAlert({alertData: {
            alertType: EAlert.success, 
            message: "Word has been added successfully"}})); 
          return word.response.response;
        }
      
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.warning, 
        message: "There has been an error saving the word"}})); 
      return [];
    } catch (error) {
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.error, 
        message: "There has been an error connectiong to the server, try later"}})); 
      return [];
    }
  }

  const updateWord = async (updateWord: IWord):Promise<IWord[]> => {
    try {
      const word: IRequest<IWord[]> = await requester({
        url: `/words/${updateWord.id_word}`,
        method: 'PUT',
        data: updateWord
      })
      
      if(word.response.statusCode === 200) 
        if(word.response.response !== undefined) {
          dispatch(enqueueAlert({alertData: {
            alertType: EAlert.success, 
            message: "Word has been updated successfully"}})); 
          return word.response.response;
        }
      
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.warning, 
        message: "There has been an error updating the word"}})); 
      return [];
    } catch (error) {
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.error, 
        message: "There has been an error connectiong to the server, try later"}})); 
      return [];
    }
  }

  const deleteWord = async (deleteWord: IWord):Promise<IWord[]> => {
    try {
      const word: IRequest<IWord[]> = await requester({
        url: `/words/${deleteWord.id_word}`,
        method: 'DELETE'
      })
      
      if(word.response.statusCode === 200) 
        if(word.response.response !== undefined) {
          dispatch(enqueueAlert({alertData: {
            alertType: EAlert.success, 
            message: "Word has been deleted successfully"}})); 
          return word.response.response;
        }
      
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.warning, 
        message: "There has been an error deleting the word"}})); 
      return [];
    } catch (error) {
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.error, 
        message: "There has been an error connectiong to the server, try later"}})); 
      return [];
    }
  }

  const getWordById = async (wordToGet: IWord):Promise<IWord[]> => {
    try {
      const word: IRequest<IWord[]> = await requester({
        url: `/words/${wordToGet.id_word}`,
        method: 'GET'
      })
      
      if(word.response.statusCode === 200) 
        if(word.response.response !== undefined) {
          return word.response.response;
        }
      
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.warning, 
        message: "There has been an error getting the word"}})); 
      return [];
    } catch (error) {
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.error, 
        message: "There has been an error connectiong to the server, try later"}})); 
      return [];
    }
  }

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

  const getWordClassByID = async (wordToGet: IMeaning):Promise<IWord_class> => {
    try {
      const word: IRequest<IWord_class[]> = await requester({
        url: `/wordClasses/${wordToGet.id_topic}`,
        method: 'GET'
      })

      if(word.response.statusCode === 200) 
        if(word.response.response !== undefined) {
          return word.response.response[0];
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

  const addMeaning = async (newWord: IMeaning):Promise<IRequest<IMeaning>> => {
    const failedResponse:IRequest<IMeaning> = {
      success: false,
      response: {
        statusCode: 500
      }
    }
    try {
      const word: IRequest<IMeaning> = await requester({
        url: `/meanings`,
        method: 'POST',
        data: newWord
      })
      
      if(word.response.statusCode === 200) 
        if(word.response.response !== undefined) {
          dispatch(enqueueAlert({alertData: {
            alertType: EAlert.success, 
            message: "Word has been added successfully"}})); 
          return word;
        }
      
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.warning, 
        message: "There has been an error saving the word"}})); 
      return word
    } catch (error) {
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.error, 
        message: "There has been an error connectiong to the server, try later"}})); 
      return failedResponse;
    }
  }

  const deleteMeaning = async (deleteMeaning: IMeaning):Promise<IRequest<any>> => {
    try {
      const word: IRequest<IWord[]> = await requester({
        url: `/meanings/${deleteMeaning.id_meaning}`,
        method: 'DELETE'
      })
      
      if(word.response.statusCode === 200) 
        if(word.response.response !== undefined) {
          dispatch(enqueueAlert({alertData: {
            alertType: EAlert.success, 
            message: "Meaning has been deleted successfully"}})); 
          return word;
        }
      
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.warning, 
        message: "There has been an error deleting the meaning"}})); 
      return word;
    } catch (error) {
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.error, 
        message: "There has been an error connectiong to the server, try later"}})); 
      return failedResponse;
    }
  }

  const getMeaningById = async (meaningToGet: IMeaning):Promise<IMeaning[]> => {
    try {
      const word: IRequest<IMeaning[]> = await requester({
        url: `/meanings/${meaningToGet.id_meaning}`,
        method: 'GET'
      })
      
      if(word.response.statusCode === 200) 
        if(word.response.response !== undefined) {
          return word.response.response;
        }
      
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.warning, 
        message: "There has been an error getting the word"}})); 
      return [];
    } catch (error) {
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.error, 
        message: "There has been an error connectiong to the server, try later"}})); 
      return [];
    }
  }

  const addExample = async (newExample: IExample):Promise<IRequest<IExample>> => {
    const failedResponse:IRequest<IExample> = {
      success: false,
      response: {
        statusCode: 500
      }
    }
    try {
      const word: IRequest<IExample> = await requester({
        url: `/meanings/examples/${newExample.id_meaning}`,
        method: 'POST',
        data: newExample
      })
      
      if(word.response.statusCode === 200) 
        if(word.response.response !== undefined) {
          dispatch(enqueueAlert({alertData: {
            alertType: EAlert.success, 
            message: "Example has been added successfully"}})); 
          return word;
        }
      
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.warning, 
        message: "There has been an error saving the example"}})); 
      return word
    } catch (error) {
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.error, 
        message: "There has been an error connectiong to the server, try later"}})); 
      return failedResponse;
    }
  }

  const updateExample = async (updateExample: IExample):Promise<IRequest<any>> => {
    const failedResponse:IRequest<undefined> = {
      success: false,
      response: {
        statusCode: 500
      }
    }
    try {
      const responseExample: IRequest<IExample[]> = await requester({
        url: `/meanings/examples/${updateExample.id_example}`,
        method: 'PUT',
        data: updateExample
      })
      
      if(responseExample.response.statusCode === 200) 
        if(responseExample.response !== undefined) {
          dispatch(enqueueAlert({alertData: {
            alertType: EAlert.success, 
            message: "The example has been updated successfully"}})); 
          return responseExample;
        }
      
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.warning, 
        message: "There has been an error updating the example"}})); 
      return responseExample;
    } catch (error) {
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.error, 
        message: "There has been an error connectiong to the server, try later"}})); 
      return failedResponse;
    }
  }

  const deleteExample = async (deleteExample: IExample):Promise<IRequest<any>> => {
    try {
      const word: IRequest<IExample[]> = await requester({
        url: `/meanings/examples/${deleteExample.id_example}`,
        method: 'DELETE'
      })
      
      if(word.response.statusCode === 200) 
        if(word.response.response !== undefined) {
          dispatch(enqueueAlert({alertData: {
            alertType: EAlert.success, 
            message: "The example of the meaning has been deleted successfully"}})); 
          return word;
        }
      
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.warning, 
        message: "There has been an error deleting the example of the meaning"}})); 
      return word;
    } catch (error) {
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.error, 
        message: "There has been an error connectiong to the server, try later"}})); 
      return failedResponse;
    }
  }

  // Handlers
  const handleOnAddWord = async ():Promise<void> => { 
    await addWord(word);
    reset();
  }
  const handleOnUpdateWord = async ():Promise<void> => { 
    await updateWord(word);
    reset();
  }
  const handleOnDeleteWord = async ():Promise<void> => { 
    await deleteWord(word);
    reset();
  }
  const handleAddMeaning = async ():Promise<void> => {
    const response:IRequest<IMeaning> = await addMeaning(meaning);
    if(response.success === true && response.response.response !== undefined) {
      const newMeaning:IMeaning = response.response.response;

      //The meaning was added successfully
      setWord({...word, 
        meanings: [...word.meanings, newMeaning]
      });
      setMeaning(initialMeaning);
    }
  }
  const handleOnDeleteMeaning = async (meaningSelected:IMeaning):Promise<void> => {
    const response = await deleteMeaning(meaningSelected);
    if(response.success === true) {
      resetMeaning();
      setWord({...word, 
        meanings: word.meanings
        .filter(currentMeaning => 
          currentMeaning.id_meaning !== meaningSelected.id_meaning)
      });
    }
  }
  const handleOnAddExample = async ():Promise<void> => {
    const response:IRequest<IExample> = await addExample(example);
    if(response.success === true && response.response.response !== undefined) {
      const newExample:IExample = response.response.response;

      //The example was added successfully
      setMeaning({...meaning, 
        examples: [...meaning.examples, newExample]
      });
      setExample({...example, example: ""});
    }
  }
  const handleOnUpdateExample = async ():Promise<void> => {
    const responseExample:IRequest<IExample> = await updateExample(example);

    if(responseExample.success === true) {
      const newExamples = meaning.examples.map(currentExample => {
        if(currentExample.id_example === example.id_example) {
          currentExample.example = example.example;
          return currentExample;
        } else {
          return currentExample;
        }
      })
      setMeaning({...meaning, 
        examples: newExamples
      });
      setExample({...example, example: ""});
      resetExample();
    }
  }
  const handleOnDeleteExample = async (exampleSelected:IExample):Promise<void> => {
    const response = await deleteExample(exampleSelected);
    if(response.success === true) {
      resetExample()
      setMeaning({...meaning, 
        examples: meaning.examples
        .filter(currentExample => 
          currentExample.id_example !== exampleSelected.id_example)
      });
    }
  }
    
  // Auxiliar functions
  const reset = ():void => {
    setWord(initialWord);
    setMeaning(initialMeaning);
    setExample(initialExample);
    setTopic(initialTopic);
    setWordClasses(initialWordClass);
  }

  const resetMeaning = ():void => {
    setMeaning(initialMeaning);
    setExample(initialExample);
    setTopic(initialTopic);
    setWordClasses(initialWordClass);
    setManageMeaning(false);
  }

  const resetExample = ():void => {
    setExample({...example, example: ""});
    setManageExample(false);
  }

  return(
      <div className='flex flex-col overflow-y-auto max-h-full'>
        <div className='flex flex-col my-6'>
          <div className='flex flex-row justify-center mb-5'>
            <SearchWord onSelectItem={(item:IWord) => {
              getWordById(item).then((response:IWord[]) => {
                setWord(response[0]);
              })
              setMeaning({...meaning, id_word: item.id_word})
            }} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-lg font-bold text-center">
              { word.id_word === 0 ?
                "Add new word" :
                "Manage word"
              }
            </p>
            <div className="my-6 flex flex-row justify-center">
              <Input 
                name="word" 
                placeholder="Word"
                value={word.word} 
                onChange={(e):any => { setWord({...word, word: e.target.value}) }}/>
            </div>
            { word.id_word === 0 ?
              <Button variant="contained" color="success" onClick={():any => {
                handleOnAddWord()
              }}>
                Add word
              </Button> :
              <div className='flex flex-row justify-around'>
                <Button variant="contained" color="warning" onClick={():any => {
                  handleOnUpdateWord()
                }}>
                  Update word
                </Button>
                <Button variant="contained" color="info" 
                  onClick={():any => {
                    reset()
                  }}>
                  Cancel
                </Button>
                <Button variant="contained" color="error" onClick={():any => {
                  handleOnDeleteWord()
                }}>
                  Delete word
                </Button>
              </div>

            }
          </div>
        </div>
        { word.id_word !== 0 &&
          <div className='flex flex-col mt-3 mb-6'>
            <p className='text-center text-lg font-bold'>
              {!manageMeaning ?
                "Add meaning":
                "Manage meaning"
              }
            </p>
            <div className='mt-6 w-full flex flex-row justify-center'>
              <Input 
                style={{width: "80%"}}
                name="meaning" 
                placeholder="Meaning"
                value={meaning.meaning} 
                onChange={(e):any => { 
                  setMeaning({...meaning, meaning: e.target.value}) }}
                />
            </div>
            <div className='mt-6 w-full flex flex-row justify-center'>
              <Input 
                style={{width: "80%"}}
                name="source" 
                placeholder="Source"
                value={meaning.source} 
                onChange={(e):any => { setMeaning({...meaning, source: e.target.value}) }}
                />

            </div>
            { meaning.source !== "" &&
              <div className='flex flex-row justify-center my-6'>
                <div className="w-1/2 h-1/2">
                  <img src={meaning.source} alt="Image of the meaning" />
                </div>
              </div>
            }
            <div className='my-6 flex flex-row justify-around'>
              <div className='mr-3'>
                <SearchTopic 
                  onSelectItem={(item:ITopic) => { 
                    setMeaning({...meaning, id_topic: item.id_topic});
                    setTopic(item);
                  }} 
                  initialValue={topic}
                  />
              </div>
              <SearchWordClasses onSelectItem={(item:IWord_class) => { 
                setMeaning({...meaning, id_word_class: item.id_word_class})
                setWordClasses(item);
                }}
                initialValue={wordClasses}
               />
            </div>
            <div className='flex flex-row justify-center'>
              { !manageMeaning ?
                <Button variant="contained" color="success" onClick={():any => {
                  handleAddMeaning()
                }}>
                  Add meaning
                </Button>:
                <div className='flex flex-row justify-around w-full'>
                  <Button variant="contained" color="warning" onClick={():any => {
                    handleAddMeaning()
                  }}>
                    Update meaning
                  </Button>
                  <Button variant="contained" color="info" onClick={():any => {
                  resetMeaning()
                  }}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="error" onClick={():any => {
                    handleOnDeleteMeaning(meaning);
                  }}>
                    Delete meaning
                  </Button>
                </div>
              }
            </div>
            {/* Example */}
            { meaning.id_meaning !== 0 &&
              <div className='mt-6 flex flex-col justify-center'>
                <p className="text-lg font-bold text-center">
                  { !manageExample ?
                    "Add new example" :
                    "Manage example"
                  }
                </p>
                <div>
                  <div className='flex flex-row justify-center'>
                    <Input 
                      style={{width: "80%"}}
                      name="example" 
                      placeholder={`Example which uses the word: "${word.word}"`}
                      value={example.example} 
                      onChange={(e):any => { setExample({...example, example: e.target.value}) }}
                      />
                  </div>
                  <div className='mt-3 flex flex-row justify-center'>
                    { !manageExample ?
                      <Button variant="contained" color="success" onClick={():any => {
                        handleOnAddExample()
                      }}>
                        Add example
                      </Button>:
                      <div className='flex flex-row justify-around w-full'>
                        <Button variant="contained" color="warning" onClick={():any => {
                          handleOnUpdateExample()
                        }}>
                          Update example
                        </Button>
                        <Button variant="contained" color="info" 
                          onClick={():any => { resetExample() }}>
                          Cancel
                        </Button>
                        <Button variant="contained" color="error" 
                          onClick={():any => { handleOnDeleteExample(example) }}>
                          Delete example
                        </Button>
                      </div>
                    }
                  </div>
                  <div className='mt-6 flex flex-row justify-center'>
                    <div className='max-w-3xl'>
                      { meaning.examples[0] !== undefined ?
                        <Paper sx={{overflow: 'hidden'}}>
                          <TableContainer sx={{ maxHeight: 220 }}>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell align="center">
                                    Examples
                                  </TableCell>
                                  <TableCell align="center">
                                    Update example
                                  </TableCell>
                                  <TableCell align="center">
                                    Delete example
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {
                                  meaning.examples.map(currentExample => {
                                    return (
                                      <TableRow key={currentExample.id_example}>
                                        <TableCell align="center">
                                          {currentExample.example}
                                        </TableCell>
                                        <TableCell align="center">
                                          <button
                                            onClick={() => {
                                              setExample(currentExample)
                                              setManageExample(true);
                                              }}>
                                            <div className="text-2xl">
                                              <MdEditDocument />
                                            </div>
                                        </button>
                                        </TableCell>
                                        <TableCell align="center">
                                          <button
                                            onClick={() => {
                                              handleOnDeleteExample(currentExample)
                                            }}
                                            >
                                            <div className="text-2xl">
                                              <MdDeleteForever />
                                            </div>
                                          </button>
                                        </TableCell>
                                      </TableRow>
                                    )
                                  }) 
                                }
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Paper>
                        :
                        <p className=' text-center font-bold italic'>
                          The meaning still has no examples.
                        </p>
                      }
                    </div>
                  </div>
                </div>
              {/* Meanings of the word */}
              </div>
            }
            <div className='mt-6 flex flex-row justify-center'>
              <div className='max-w-3xl'>
                { word.meanings[0] !== undefined ?
                  <Paper sx={{overflow: 'hidden'}}>
                    <TableContainer sx={{ maxHeight: 220 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">
                              Other meanings of the word
                            </TableCell>
                            <TableCell align="center">
                              Update meaning
                            </TableCell>
                            <TableCell align="center">
                              Delete meaning
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {
                            word.meanings.map(currentMeaning => {
                              return (
                                <TableRow key={currentMeaning.id_meaning}>
                                  <TableCell align="center">
                                    {currentMeaning.meaning}
                                  </TableCell>
                                  <TableCell align="center">
                                    <button
                                      onClick={() => {
                                        getMeaningById(currentMeaning)
                                        .then((response) => {
                                          
                                          getTopicByID(currentMeaning)
                                          .then((responseTopic)=> {
                                            setTopic(responseTopic);
                                          })

                                          getWordClassByID(currentMeaning)
                                          .then((responseTopic)=> {
                                            setWordClasses(responseTopic);
                                          })

                                          setMeaning(response[0]);
                                          setExample({...example, id_meaning: currentMeaning.id_meaning});
                                          setManageMeaning(true);
                                        })
                                        }}>
                                      <div className="text-2xl">
                                        <MdEditDocument />
                                      </div>
                                  </button>
                                  </TableCell>
                                  <TableCell align="center">
                                    <button
                                      onClick={() => {
                                        handleOnDeleteMeaning(currentMeaning)
                                      }}
                                      >
                                      <div className="text-2xl">
                                        <MdDeleteForever />
                                      </div>
                                    </button>
                                  </TableCell>
                                </TableRow>
                              )
                            }) 
                          }
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                  :
                  <p className=' text-center font-bold italic'>
                    The word still has no meanings.
                  </p>
                }
              </div>
            </div>
          </div>
        }
      </div>
  )
}

export default WordManagerComponent;