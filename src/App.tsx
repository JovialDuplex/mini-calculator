import React, { useEffect, useRef, useState } from "react";
import { Button } from "./components/ui/button"
import { type BaseUIEvent } from "@base-ui/react";
import * as LucideIcon from "lucide-react";
import useCalculator from "./hooks/useCalculator";
import { Dialog, DialogContent, DialogTitle } from "./components/ui/dialog";

type ButtonType = {
  label: string,
  value: string | null,
  role: "function" | "operator" | "number"
}

function App() {
  const buttons: ButtonType[] = [

    { label: "History", value: null, role: "function" },
    { label: "MC", value: null, role: "function" },
    { label: "MR", value: null, role: "function" },
    { label: "M+", value: null, role: "function" },
    { label: "+/-", value: "-", role: "operator" },
    { label: "M-", value: null, role: "function" },
    { label: "DEL", value: null, role: "function" },
    { label: "AC", value: null, role: "function" },
    { label: "7", value: "7", role: "number" },
    { label: "8", value: "8", role: "number" },
    { label: "9", value: "9", role: "number" },
    { label: "+", value: "+", role: "operator" },
    { label: "4", value: "4", role: "number" },
    { label: "5", value: "5", role: "number" },
    { label: "6", value: "6", role: "number" },
    { label: "-", value: "-", role: "operator" },
    { label: "1", value: "1", role: "number" },
    { label: "2", value: "2", role: "number" },
    { label: "3", value: "3", role: "number" },
    { label: "x", value: "*", role: "operator" },
    { label: ",", value: ".", role: "number" },
    { label: "0", value: "0", role: "number" },
    { label: "=", value: null, role: "function" },
    { label: "/", value: "/", role: "operator" },
  ];

  const [inputValue, setInputValue] = useState<string>("0");
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const calculator = useCalculator();

  useEffect(() => {
    localStorage.setItem("memory", "0");
    localStorage.setItem("history", "[]");
    localStorage.setItem("temp", "0");

    inputRef.current?.focus();
  }, []);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => setInputValue(event.target.value);

  const clickButton = (event: BaseUIEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>) => {
    const value: string = event.currentTarget.value;
    const label: string | undefined = event.currentTarget.dataset.label;
    const temp:string|null = localStorage.getItem("temp") ?? "0";

    if(label === "History") {
      setOpenDialog(true);
    }

    if(label === "+/-") {
      setInputValue((prev: React.SetStateAction<string>) => prev !== "0" ? "-" + prev : prev);
    } else {
      setInputValue((prev: React.SetStateAction<string>) => {
        if(temp !== "0"){
          return temp+value;
        }
        return prev === "0" ? value: prev + value;
      });
    }

    console.log(inputValue);
    const myButtonType = event.currentTarget.dataset["role"];
    if (myButtonType === "function") {
      if (label && label === "DEL") { setInputValue((prev: React.SetStateAction<string>)=> prev.toString().length <=1 ? "0" : prev.toString().slice(0, -1));}
      if (label && label === "AC") { setInputValue("0"); }
      if (label && label === "=") { calculator.calculate(inputValue, setInputValue); }
      if (label && label === "MC") { calculator.memoryClear(); }
      if (label && label === "M+") { calculator.memoryPLus(inputValue) }
      if (label && label === "M-") { calculator.memoryMinus(inputValue) }
      if (label && label === "MR") { calculator.memoryRecall(inputValue, setInputValue) }
    }

  }

  return (
    <div className="my-screen h-screen w-screen bg-(--bg-page) flex items-center justify-center">
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className={"h-100 bg-(--bg-calc) text-(--text-primary) flex flex-col"}>
          <DialogTitle> History </DialogTitle>
          <div className="flex flex-col flex-1 gap-2">
            {calculator.history.map((element, key)=>(
              <div className="flex justify-between items-center w-full p-2 rounded-xl bg-(--bg-page)">
                <span key={key} > {element} </span>
                <Button size="icon-xs" onClick={()=>calculator.removeHistorItem(key)}> <LucideIcon.X /></Button>
              </div>  
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="shadow-lg shadow-black text-(--text-secondary) main-container rounded-(--radius-card) min-w-fit max-w-2xl h-9/12 min-h-fit max-h-150 p-3 bg-(--bg-calc) w-4/12 flex flex-col justify- gap-5">
        <div className=" bg-(--bg-input) px-1 h-20 rounded-(--radius-input) flex flex-col ">
          <input ref={inputRef} value={inputValue} onChange={handleInput} className="outline-none border-none caret-(--text-secondary) flex-1 text-h1 text-right text-(--text-secondary) w-full " type={"text"} />
          <div className="result w-full flex-1 flex justify-between items-end">
            <span className="text-(--text-secondary) text-h2"> Result </span>
            <span className="text-h2"> {calculator.result} </span>
          </div>
        </div>
        <div className="main-box flex-1 text-(--text-primary) grid grid-cols-4 grid-rows-6 place-items-stretch gap-2">
          {buttons.map((bt, index) => {
            const Icon = bt.label === "History" ? LucideIcon.History : null;

              return <Button
                key={index}
                value={bt.value ?? ""}
                data-label={bt.label}
                data-role={bt.role}
                onClick={clickButton}
                className={` font-bold text-sm cursor-pointer bg-(--bg-button) ${bt.role === "number" || bt.role==="operator" ? "bg-white text-black" : "bg-(--bg-button)"}`}
              >
                {Icon ? <Icon /> : bt.label}
              </Button>
          
          })}

        </div>
      </div>
    </div>
  )
}


export default App
