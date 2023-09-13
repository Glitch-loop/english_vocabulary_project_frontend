import WordManagerComponent from "../components/WordManager/WordManagerComponent";
import TopicManagerComponent from "../components/WordManager/TopicManagerComponent";

const WordManager = () => {
  return(
  <>
    <div className="absolute w-full h-full flex flex-row justify-around items-center"> 
      <TopicManagerComponent /> 
      <WordManagerComponent /> 
    </div>
  </>)
}

export default WordManager;