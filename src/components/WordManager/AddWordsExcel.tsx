import { useEffect, useState } from "react"
import { Dialog, Input } from "@mui/material";
import { getGifs } from "../../services/giphy.api";
import { getImages } from "../../services/pexels_api";
import SelectionGraphsElements from "../UIcomponents/SelectionGraphsElements";
import { Photo } from "pexels/dist/types";
import { IExample, IGif, IImportWordExcel, IMeaning, IRequest, ITopic, IWord, IWord_class } from "../../Interfaces/interfaces";
import { Button } from "@mui/material";
import * as XLSX from 'xlsx'; 
import SearchTopic from "../Searchers/SearchTopic";
import SearchWordClasses from "../Searchers/SearchWordClasses";
import { addExample, addMeaning, addWord, getTopicByID, getWordClassByID, searchWordName } from "../../services/backend_api";
import { initialTopic, initialImportWordExcel, initialWordClass, emptyOrUndefined } from "../../utils/utils";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { MdDeleteForever } from "react-icons/md";

const excelHeaders:any[] = ["word",	"meaning", "id_topic", "id_word_class"];

//Auxiliar function
const getTopic = async (id_topic:number):Promise<ITopic> => {
  const responseTopic:IRequest<ITopic[]> = await getTopicByID(id_topic);

  if(responseTopic.response.statusCode === 200 
  && responseTopic.response.response !== undefined) { 
      return responseTopic.response.response[0];
  } else return initialTopic;
} 

const getWordClass = async (id_word_class:number):Promise<IWord_class> => {
  const responseTopic:IRequest<IWord_class[]> = await getWordClassByID(id_word_class);

  if(responseTopic.response.statusCode === 200 
  && responseTopic.response.response !== undefined) { 
      return responseTopic.response.response[0];
  } else return initialWordClass;
} 

const getPhotos = async (concept:string):Promise<Photo[]> => {
  const responsePhotos:IRequest<Photo[]> = await getImages(concept);

  if(responsePhotos.response.statusCode === 200 
  && responsePhotos.response.response !== undefined) { 
      return responsePhotos.response.response;
  } else return [];
}

const getGif = async (concept:string):Promise<IGif[]> => {
  const responseGifs:IRequest<IGif[]> = await getGifs(concept);

  if(responseGifs.response.statusCode === 200 
  && responseGifs.response.response !== undefined) { 
      return responseGifs.response.response;
  } else return [];
}

const AddWordsExcel = () => {
  const [data, setData] = useState<IImportWordExcel[]>([]);
  const [indexWord, setIndexWord] = useState<number>(0);
  const [topic, setTopic] = useState<ITopic>(initialTopic);
  const [wordClass, setWordClass] = useState<IWord_class>(initialWordClass);
  const [graphicSource, setGraphicSource] = useState<string>("");
  const [currentExample, setCurrentExample] = useState<string>("");
  const [arrExamples, setArrExamples] = useState<IExample[]>([]);

  const [arrayImages, setArrayImages] = useState<Photo[]>([]);
  const [arrayGifs, setArrayGifs] = useState<IGif[]>([]);
  const [searchImages, setSearchImages] = useState<string>("");
  const [searchGif, setSearchGif] = useState<string>(""); 

  const [wordsForReview, setWordsForReview] = useState<IImportWordExcel[]>([]);

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  //Handlers
  const handleFileChange = async (e:any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const formatType = !!reader.readAsBinaryString;
    reader.onload = async (event) => {
      if(event.target !== null) {
        if(event.target.result !== null) {
          const wb = XLSX.read(event.target.result, {type: formatType ? "binary" : "array"});
          const sheets = wb.SheetNames;
    
          if (sheets.length) {
              const rows:IImportWordExcel[] = 
                XLSX.utils.sheet_to_json(wb.Sheets[sheets[0]]);
              
              //Saving data
              setData(rows);
              
              //Set up the component (it is always going to start with the first element "0")
              setUpNewWord(0, rows);
              setOpenDialog(true);
          }
        }
      }
    }
    if (formatType) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  const handleSearchImages = async (concept:string) => {
    setArrayImages( await getPhotos(concept))
  }

  const handleSearchGifs = async (concept:string) => {
    setArrayGifs( await getGif(concept))
  }

  const handleAddNewExample = async(example:string) => {
    if(example !== "") {
      const newExample:IExample = {
        id_example: currentExample.length,
        example: example,
        id_meaning: 0
      }
      setArrExamples([...arrExamples, newExample]);
      setCurrentExample("");
    }
  }

  const handleRemoveExample = (id_example:number) => {
    setArrExamples(
      arrExamples.filter(example => example.id_example !== id_example)
    )
  }

  const handleAddWord = async () => {
    let wordRepited = false;

    // Verify all the data 
    if(
      emptyOrUndefined(data[indexWord].word) ||
      emptyOrUndefined(data[indexWord].meaning) ||
      emptyOrUndefined(graphicSource)
    ) {
      console.log("There is an field empty")
    } else {
      // Adding new word
      const newWord:IWord = {
        id_word: 0,
        word: data[indexWord].word,
        meanings: []
      }

      //Verifying that word already exists
      const wordsInDatabase:IWord[] = await searchWordName(newWord.word);

      wordsInDatabase.forEach(currentWord => {
        if(currentWord.word.toLowerCase() == newWord.word.toLowerCase()) {
          wordRepited = true;
        } else { /* Do Nothing */ }
      });


      if(wordRepited == false) {
        const responseWord = await addWord(newWord)
  
        if(responseWord.response.statusCode === 200
          && responseWord.response.response !== undefined) {
          const newMeaning:IMeaning = {
            id_meaning: 0,
            meaning: data[indexWord].meaning,
            source: graphicSource,
            recently_practiced: 0,
            times_practiced: 0,
            id_word: responseWord.response.response.id_word,
            id_word_class: wordClass.id_word_class,
            id_topic: topic.id_topic,
            examples: []
          }
          const responseMeaning = await addMeaning(newMeaning)
    
          if(responseMeaning.response.statusCode === 200
          && responseMeaning.response.response !== undefined) {
            arrExamples.forEach(example => {
              const newExample:IExample = {
                id_example: 0,
                example: example.example,
                id_meaning: responseMeaning.response.response!.id_meaning
              }
              addExample(newExample)
            })
          }
        }
        // Go to the next word to add
        verifyEndProcess(false, wordsForReview);
      } else {
        // The word already exists.
        // The word is added to the excel "wordForReview", for a revision.
        handleNextWord();
      }
    }
  }

  const handleNextWord = async() => {
    verifyEndProcess(false, [...wordsForReview, data[indexWord]]);
  }

  const handleOnCancelTheProcess = async() => {
    verifyEndProcess(true, [...wordsForReview, data[indexWord]]);
  }

  //Auxiliar functions 
  const setUpNewWord = async (index:number, array:IImportWordExcel[]) => {
    setTopic(await getTopic(array[index].id_topic));
    setWordClass(await getWordClass(array[index].id_word_class));
    setArrayImages(await getPhotos(array[index].word));
    setArrayGifs(await getGif(array[index].word));
    setGraphicSource("");
    setArrExamples([]);
    setCurrentExample("");
  }

  const verifyEndProcess = async (endManuallyTheProcess:boolean, arrWordReview:IImportWordExcel[]) => {
    const index = indexWord + 1;
    const remainingWord:IImportWordExcel[] = [];
    //End process manually
    if(endManuallyTheProcess) {
      for(let i = indexWord; i < data.length; i++) {
        remainingWord.push(data[i]);
      }
    }

    if(index > data.length - 1 || endManuallyTheProcess) {
      // Process end 
      setOpenDialog(false);
      
      if(wordsForReview.length > 0 || remainingWord.length > 0) {
        const rows:any[][] = [excelHeaders]; 

        console.log(wordsForReview)
        // Add the words that the user skipped
        arrWordReview.forEach(currentWord => {
          const dataRow:any[] = [
            currentWord.word, 
            currentWord.meaning, 
            currentWord.id_topic, 
            currentWord.id_word_class
          ];
          rows.push(dataRow);
        });

        // Add the remaining words
        remainingWord.forEach(currentWord => {
          const dataRow:any[] = [
            currentWord.word, 
            currentWord.meaning, 
            currentWord.id_topic, 
            currentWord.id_word_class
          ];
          rows.push(dataRow);
        })

        // Creating the file
        const workbook = XLSX.utils.book_new();

        //Worksheet
        const ws = XLSX.utils.aoa_to_sheet(rows);

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');

        // Write the Excel file
        XLSX.writeFile(workbook, 'words_to_review.xlsx');
      }
    } else {

      // There are still words
      setIndexWord(index);
      setUpNewWord(index, data);
      setWordsForReview(arrWordReview);
    }
  }

  return (
    <>
      { openDialog === true &&
        <div className="absolute">
          <Dialog open={openDialog} maxWidth={false} fullWidth={true}>
            <div className="m-5 w-full flex flex-col justify-center text-lg">
              {/* Data from the own word */}
              <div className="flex flex-row justify-center">
                <span>Word: </span>
                <span className="ml-3 font-bold italic">{data[indexWord].word}</span>

              </div>
              <div className="flex flex-row justify-center mt-3 italic">
                <span>Meaning: </span>
              </div>
              <div className="flex flex-row justify-center">
                <span>{data[indexWord].meaning}</span>
              </div>
              <div className="flex flex-row justify-around mt-5">
                <SearchTopic 
                  initialValue={topic}
                  onSelectItem={setTopic}
                  />
                <SearchWordClasses
                  initialValue={ wordClass }
                  onSelectItem={ setWordClass }
                />
              </div>
              {/* Image section */}
              <div className="flex flex-col justify-center mt-5 text-center">
                <p>Choose an image/gif, or put your own link to an graphic element</p>
                <div className="flex flex-row justify-center">
                  <Input 
                      style={{width: "40%"}}
                      name="source" 
                      placeholder="Source"
                      value={graphicSource} 
                      onChange={(e):any => { setGraphicSource(e.target.value) }}
                      />
                </div>
                { graphicSource !== "" &&
                  <div className="mt-3">
                    <div className="flex flex-row justify-center">
                      <img src={ graphicSource } 
                          alt="Not source avaible" />
                    </div>
                    <p className="text-sm mt-2">Image selected</p>
                  </div>
                }
              </div>
              <div className="flex flex-row mt-5">
                <div className="basis-1/2">
                  <div className="flex flex-row justify-center">
                    <Input 
                      style={{width: "40%"}}
                      name="source" 
                      placeholder="Source"
                      value={searchImages} 
                      onChange={(e):any => { 
                        handleSearchImages(e.target.value);
                        setSearchImages(e.target.value); 
                       }}
                      />
                  </div>
                  <SelectionGraphsElements 
                    onSelectItem={setGraphicSource}
                    arrayItems={arrayImages}/>
                </div>
                <div className="basis-1/2">
                  <div className="flex flex-row justify-center">
                    <Input 
                      style={{width: "40%"}}
                      name="source" 
                      placeholder="Source"
                      value={searchGif} 
                      onChange={(e):any => { 
                        handleSearchGifs(e.target.value);
                        setSearchGif(e.target.value); 
                      }}
                      />
                  </div>
                  <SelectionGraphsElements 
                    onSelectItem={setGraphicSource}
                    arrayItems={arrayGifs}/>
                </div>
              </div>
              {/* Example section */}
              <div className="flex flex-row justify-center mt-5">
                  <Input 
                      style={{width: "40%"}}
                      name="Example" 
                      placeholder={`Example using: "${data[indexWord].word}"`}
                      value={currentExample} 
                      onChange={(e):any => { setCurrentExample(e.target.value) }}
                      />
              </div>
              <div className="flex flex-row justify-center mt-5">
                <Button  variant="contained" color="success" onClick={(e) => {handleAddNewExample(currentExample)}}>
                  Add example
                </Button>
              </div>

              { arrExamples.length > 0 &&
                <div className="flex flex-row justify-center mt-5">
                  <div className=" w-1/2">
                    <Paper  sx={{overflow: 'hidden'}}>
                      <TableContainer sx={{ maxHeight: 220 }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell align="center">
                                Examples
                              </TableCell>
                              <TableCell align="center">
                                Delete example
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {
                              arrExamples.map(currentExample => {
                                return (
                                  <TableRow key={currentExample.id_example}>
                                    <TableCell align="center">
                                      {currentExample.example}
                                    </TableCell>
                                    <TableCell align="center">
                                      <button
                                        onClick={() => {
                                          handleRemoveExample(currentExample.id_example)
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
                  </div>
                </div>
              }
              {/* Handlers section */}
              <div className="flex flex-row justify-center mt-10">
                <Button  variant="contained" color="warning"
                  onClick={handleOnCancelTheProcess}>
                  Cancel process
                </Button>
                <div className="mx-6">
                  <Button  variant="contained" color="info" 
                    onClick={handleNextWord}>
                    Next word
                  </Button>
                </div>
                <Button  variant="contained" color="success" 
                  onClick={handleAddWord}>
                  Add word
                </Button>
              </div>
            </div>
          </Dialog>
        </div>
      }
      <div className='flex flex-row justify-center mb-5'>
        <input 
          type="file" onChange={handleFileChange} 
        />
        <Button  variant="contained" color="success" 
        // onClick={(e) => {handleAceptFile(e)}}
        >
          Add word Excel
        </Button>
      </div>
    </>
  )
}

export default AddWordsExcel;