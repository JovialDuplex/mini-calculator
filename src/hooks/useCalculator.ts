import { useState } from "react";

export default function useCalculator(){
    const memory = localStorage.getItem("memory");
    const [result, setResult] = useState<string>("0");

    const calculate = (input:string)=> setResult(input + " = " + String(eval(input)));
    const memoryClear = ()=>localStorage.removeItem("memory");

    const memoryPLus = (input:string)=> {
        if(memory) {
            localStorage.setItem("memory", `${eval(`${input} + ${localStorage.getItem("memory")}`)}`)
        }
    }

    const memoryMinus = (input:string)=>{
         if(memory) {
            localStorage.setItem("memory", `${eval(`${input} - ${localStorage.getItem("memory")}`)}`)
        }
    }

    const memoryRecall = (input:string, setInput:(value: React.SetStateAction<string>)=>void) =>{ 
        if (memory){
            setInput(input + localStorage.getItem("memory"))
        }
    }
    
    return {
        calculate,
        memoryPLus,
        memoryMinus,
        memoryClear,
        memoryRecall,
        result,
    }
}