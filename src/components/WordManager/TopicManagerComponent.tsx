import { useState, useEffect } from 'react';
import requester from "../../helpers/Requester";
import { EAlert } from "../../Interfaces/enums";
import { enqueueAlert } from "../../redux/slices/appSlice";
import { Dispatch, AnyAction } from 'redux';
import { useDispatch } from 'react-redux';
import { IRequest, ITopic } from "../../Interfaces/interfaces";


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
import { failedResponse } from '../../utils/genericResponses';

const initialTopic:ITopic = {
  id_topic: 0,
  topic_name: ""
}

const TopicManagerComponent = () => {
    const [topic, setTopic] = useState<ITopic>(initialTopic);
    const [allTopics, setAlltopic] = useState<ITopic[]>([]);

  //Reducers to alerts
  const dispatch:Dispatch<AnyAction> = useDispatch();

  useEffect(() => {
    getAllTopic().then((response) => {
      setAlltopic(response);
    })
  }, []);

  // Calls to API
  const addTopic = async (newTopic: ITopic):Promise<ITopic[]> => {
    try {
      console.log(newTopic)
      const topic: IRequest<ITopic[]> = await requester({
        url: `/topics`,
        method: 'POST',
        data: newTopic
      })
      
      if(topic.response.statusCode === 200) 
        if(topic.response.response !== undefined) {
          dispatch(enqueueAlert({alertData: {
            alertType: EAlert.success, 
            message: "The topic has been added successfully"}})); 
          return topic.response.response;
        }
      
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.warning, 
        message: "There has been an error saving the topic"}})); 
      return [];
    } catch (error) {
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.error, 
        message: "There has been an error connectiong to the server, try later"}})); 
      return [];
    }
  }

  const updateTopic = async (updateTopic: ITopic):Promise<ITopic[]> => {
    try {
      const topic: IRequest<ITopic[]> = await requester({
        url: `/topics/${updateTopic.id_topic}`,
        method: 'PUT',
        data: updateTopic
      })
      
      if(topic.response.statusCode === 200) 
        if(topic.response.response !== undefined) {
          dispatch(enqueueAlert({alertData: {
            alertType: EAlert.success, 
            message: "The topic has been updated successfully"}})); 
          return topic.response.response;
        }
      
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.warning, 
        message: "There has been an error updating the topic"}})); 
      return [];
    } catch (error) {
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.error, 
        message: "There has been an error connectiong to the server, try later"}})); 
      return [];
    }
  }

  const deleteTopic = async (deleteTopic: ITopic):Promise<IRequest<any>> => {
    try {
      const word: IRequest<any> = await requester({
        url: `/topics/${deleteTopic.id_topic}`,
        method: 'DELETE'
      })
      
      if(word.response.statusCode === 200)  {
        dispatch(enqueueAlert({alertData: {
          alertType: EAlert.success, 
          message: "The topic has been deleted successfully"}})); 
        return word;
      }
      
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.warning, 
        message: "There has been an error deleting the topic"}})); 
      return word;
    } catch (error) {
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.error, 
        message: "There has been an error connectiong to the server, try later"}})); 
      return failedResponse;
    }
  }

  const getTopicByID = async (topicSelected: ITopic):Promise<ITopic[]> => {
    try {
      const word: IRequest<ITopic[]> = await requester({
        url: `/topics/${topicSelected.id_topic}`,
        method: 'GET'
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

  const getAllTopic = async ():Promise<ITopic[]> => {
    try {
      const word: IRequest<ITopic[]> = await requester({
        url: `/topics`,
        method: 'GET'
      })
      
      if(word.response.statusCode === 200) 
        if(word.response.response !== undefined) {
          return word.response.response;
        }
      
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.warning, 
        message: "There has been an error getting the topics"}})); 
      return [];
    } catch (error) {
      dispatch(enqueueAlert({alertData: {
        alertType: EAlert.error, 
        message: "There has been an error connectiong to the server, try later"}})); 
      return [];
    }
  }



  // Handlers
  const handleOnAddTopic = async ():Promise<void> => { 
    await addTopic(topic)
    reset()
  }

  const handleOnUpdateTopic = async ():Promise<void> => { 
    await updateTopic(topic)
    reset()
  }

  const handleOnDeleteTopic = async (topicSelected:ITopic):Promise<void> => { 
    const response:IRequest<any> = await deleteTopic(topicSelected);

    if(response.success === true) {
      setAlltopic(
        allTopics.filter(topic => topic.id_topic !== topicSelected.id_topic)
      )
    }

    reset()
  }

  // Auxiliar functions
  const reset = ():void => {
    setTopic(initialTopic);
  }

  return(<>
      <div className='flex flex-col'>
        <div className='flex flex-col w-full'>
          <div className='flex flex-row justify-center mb-5'>
            <SearchTopic onSelectItem={setTopic} />
          </div>
          <div className="flex flex-col">
            <p className="text-lg font-bold text-center">
              { topic.id_topic === 0 ?
                "Add new topic" :
                "Manage topic"
              }
            </p>
            <div className="my-3 flex flex-row justify-center">
              <Input 
                name="topic" 
                placeholder="Topic"
                value={topic.topic_name} 
                onChange={(e):any => { setTopic({...topic, topic_name: e.target.value}) }}/>
            </div>
            { topic.id_topic === 0 ?
              <Button variant="contained" color="success" onClick={():any => {
                handleOnAddTopic()
              }}>
                Add topic
              </Button> :
              <div className='flex flex-row justify-around'>                
                <Button variant="contained" color="warning" onClick={():any => {
                  handleOnUpdateTopic()
                }}>
                  Update topic
                </Button>
                <div className='mx-3'>
                  <Button variant="contained" color="error" onClick={():any => {
                    handleOnDeleteTopic(topic)
                  }}>
                    Delete topic
                  </Button>
                </div>
                <Button variant="contained" color="info" onClick={():any => {
                  reset()
                }}>
                  Cancel
                </Button>
              </div>
            }
          </div>
          <div className='mt-5'>
            <Paper sx={{overflow: 'hidden'}}>
              <TableContainer sx={{ maxHeight: 220 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        Topic
                      </TableCell>
                      <TableCell align="center">
                        Update topic
                      </TableCell>
                      <TableCell align="center">
                        Delete topic
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      allTopics.map(currentTopic => {
                        return (
                          <TableRow key={currentTopic.id_topic}>
                            <TableCell align="center">
                              {currentTopic.topic_name}
                            </TableCell>
                            <TableCell align="center">
                              <button
                                onClick={() => {setTopic(currentTopic)}}>
                                <div className="text-2xl">
                                  <MdEditDocument />
                                </div>
                            </button>
                            </TableCell>
                            <TableCell align="center">
                              <button
                                onClick={() => {handleOnDeleteTopic(currentTopic)}}>
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
          </div>
        </div>
      </div>
  </>)
}

export default TopicManagerComponent;