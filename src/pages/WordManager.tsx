import { useState } from "react";

import WordManagerComponent from "../components/WordManager/WordManagerComponent";
import TopicManagerComponent from "../components/WordManager/TopicManagerComponent";
import AddWordsExcel from "../components/WordManager/AddWordsExcel";

const WordManager = () => {
  return(
  <>
    <div className="absolute w-full h-full flex flex-row justify-around items-center"> 
      <div className="flex flex-col items-center">
        <TopicManagerComponent /> 
      </div>
      <div className="flex flex-col h-4/5 items-center overflow-auto">
        <div className="flex flex-row">
          <AddWordsExcel /> 
        </div>
        <div className="flex flex-row">
          <WordManagerComponent />   
        </div>
      </div>
    </div>
  </>)
}

export default WordManager;