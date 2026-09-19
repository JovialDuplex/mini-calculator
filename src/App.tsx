import { useEffect, useRef, useState, type JSX } from "react";
import { Button } from "./components/ui/button"
import { type BaseUIEvent } from "@base-ui/react";
import * as LucideIcon from "lucide-react";

type ButtonType = {
  label: string,
  value: string | null,
  role: "function" | "operator" | "number"
}

function App() {
  const buttons: ButtonType[] = [
    {label: "MC", value: null, role: "function"}, 
    {label: "MR", value: null, role: "function"},
    {label: "M+", value: null, role: "function"},
    {label: "Moon", value: null, role:"function"},
    {label: "M-", value: null, role: "function"},
    {label: "%", value: "%",role: "operator"},
    {label: "CE", value: null, role: "function"},
    {label: "C", value: null, role: "function"},
    {label: "+/-", value: "-", role: "operator"},
    {label: "7", value: "7", role: "number"},
    {label: "8", value: "8", role: "number"},
    {label: "9", value: "9", role: "number"},
    {label: "x", value: "*", role: "operator"},
    {label: "4", value: "4", role: "number"},
    {label: "5", value: "5", role: "number"}, 
    {label: "6", value: "6", role: "number"},
    {label: "-", value: "-", role: "operator"},
    {label: "1", value: "1", role: "number"},
    {label: "2", value: "2", role: "number"},
    {label: "3", value: "3", role: "number"},
    {label: "+", value: "+", role: "operator"},
    {label: "0", value: "0", role: "number"},
    {label: ",", value: ".", role: "number"},
    {label: "=", value: null, role: "function"}
  ];

  const [inputValue, setInputValue] = useState<string>("");
  const [result, setResult] = useState("0");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    localStorage.setItem("memory", "0");
    inputRef.current?.focus();
  }, []);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setInputValue(event.target.value);
  
  const clickButton = (event: BaseUIEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>) => {
    const value: string = event.currentTarget.value;
    const label: string|undefined = event.currentTarget.dataset.label;

    setInputValue((prev: React.SetStateAction<string>) => prev + value);
    const myButtonType = event.currentTarget.dataset["role"];
    const memory = localStorage.getItem("memory");
    
    if(myButtonType === "function") {
      console.log(myButtonType);

      if(label && label==="CE") {
        setInputValue((prev:React.SetStateAction<string>)=> prev.toString().slice(0, -1));
      }

      if(label && label==="C") {
        setInputValue("");
      }

      if(label && label==="="){
        setResult(inputValue + " = "+ String(eval(inputValue)));
      }

      if(label && label==="MC"){
        localStorage.removeItem("memory");
      }

      if(label && label==="M+"){
        console.log(memory);
        if(memory){
          const newValue = inputValue + "+" + localStorage.getItem("memory");
          localStorage.setItem("memory", `${eval(newValue)}`);
        }
      }
      if(label && label==="M-") {
        if(memory) {
          const newValue = inputValue + "-" + localStorage.getItem("memory");
          localStorage.setItem("memory", `${eval(newValue)}`)
        }
      }
      if(label && label==="MR") {
        if(memory) {
          setInputValue(inputValue + localStorage.getItem("memory"))
        }
      }
    }

  }
  
  return (
    <div className="my-screen h-screen w-screen bg-green-200 flex items-center justify-center">
      <div className="text-(--text-primary) main-container rounded-(--radius-card) min-w-fit max-w-2xl h-9/12 min-h-fit max-h-150 p-3 bg-(--bg-color) w-4/12 flex flex-col justify- gap-5">
        <div className="bg-(--bg-input) px-1 h-20 rounded-(--radius-input) flex flex-col ">
          <input ref={inputRef} value={inputValue} onChange={handleInput}  className="outline-none border-none caret-white flex-1 text-h1 text-right text-(--text-primary) w-full " type={"text"} />
          <div className="result w-full flex-1 flex justify-between items-end">
            <span className="text-(--text-secondary) text-h2"> Result </span>
            <span className="text-h2"> {result} </span>
          </div>
        </div>
        <div className="main-box flex-1 text-(--text-primary) grid grid-cols-4 grid-rows-6 place-items-stretch gap-2">
          {buttons.map((bt, index)=>{
            const Icon= bt.label === "Moon" ? LucideIcon[bt.label] :null;
            return <Button value={bt.value ?? ""} data-label={bt.label} data-role={bt.role} onClick={clickButton} className={"text-normal cursor-pointer bg-(--bg-button)"} key={index}>{bt.label === "Moon" ? Icon && <Icon/> : bt.label}</Button>
          })}
            
        </div>
      </div>
    </div>
  )
}


export default App
