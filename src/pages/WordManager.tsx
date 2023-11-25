import { useState } from "react";

import WordManagerComponent from "../components/WordManager/WordManagerComponent";
import TopicManagerComponent from "../components/WordManager/TopicManagerComponent";
import AddWordsExcel from "../components/WordManager/AddWordsExcel";

const WordManager = () => {
  return(
  <>
    <div className="absolute w-full h-full flex flex-row justify-around items-center "> 
      <TopicManagerComponent /> 
      <div className="flex flex-col">
        <AddWordsExcel /> 
        <WordManagerComponent />   
      </div>
    </div>
  </>)
}

export default WordManager;