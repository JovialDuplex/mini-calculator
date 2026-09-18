import { useEffect, useState } from "react";
import { Button } from "./components/ui/button"
import { type BaseUIEvent } from "@base-ui/react";

type ButtonType = {
  label: string,
  value: string|null,
  type: string,
}

function App() {

  
    // "MC", "MR", "M+", "M-",
    // "%", "CE", "C", "+/-",
    // "7", "8", "9", "x",
    // "4", "5", "6", "-",
    // "1", "2", "3", "+",
    // "0", ".", "=",""
  const buttons: ButtonType[] = [
    {
      label: "MC",
      value: null,
      type: "function"
    },

    {
      label: "MR",
      value: null,
      type: "function",
    },

    {
      label: "M+",
      value: null,
      type: "function"
    },

    {
      label: "M-",
      value: null,
      type: "function"
    }, 
    {
      label: "%",
      value: "%",
      type: "operator"
    },

    {
      label: "CE",
      value: null,
      type: "function"
    }
  ];

  const [inputValue, setInputValue] = useState<string>("");
  
  const handleInput = (event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>)=>setInputValue(event.target.value);
  const clickButton = (event: BaseUIEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>)=> {
    const value:string = event.currentTarget.value;
    setInputValue((prev: React.SetStateAction<string>)=> prev + value);
  }
  useEffect(()=>{
    console.log(inputValue);
  }, [inputValue]);
  return (
    <div className="my-screen h-screen w-screen bg-green-200 flex items-center justify-center">
      <div className="text-(--text-primary) main-container rounded-(--radius-card) min-w-fit max-w-2xl h-9/12 min-h-fit max-h-150 p-3 bg-(--bg-color) w-4/12 flex flex-col gap-5">
        <input value={inputValue} onChange={handleInput} className="bg-(--bg-input) text-h1 text-right text-(--text-primary) w-full h-20 rounded-(--radius-input)" type={"text"} />
        {inputValue}
        <div className="main-box flex-1 text-(--text-primary) grid grid-cols-4 grid-rows-6 place-items-stretch gap-2">
          {buttons.map((bt, index)=> (
            <Button value={bt.value ?? ""} onClick={clickButton} className={"text-normal cursor-pointer bg-(--bg-button)"} key={index}>{bt.label}</Button>
          ))}
        </div>
      </div>
    </div>
  )


}


export default App
