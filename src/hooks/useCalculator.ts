import React, { useState } from "react";
import {evaluate} from "mathjs";

export default function useCalculator(){
    const memory: string|null = localStorage.getItem("memory");

    const [history, setHistory] = useState<string[]>(JSON.parse(localStorage.getItem("history") ?? "[]"))
    const [result, setResult] = useState<string>("0");

    const calculate = (input:string)=> {
        setResult(String(evaluate(input)));
        history.push(`${input} = ${String(evaluate(input))}`);
        localStorage.setItem("history", JSON.stringify(history));
        
        localStorage.setItem("temp", String(evaluate(input)));
    };

    //history function
    const clearHistory = ()=> localStorage.setItem("history", "[]");
    const removeHistorItem = (index:number)=>{
        localStorage.setItem("history", JSON.stringify(history.filter((_, myindex)=>myindex != index)))
        setHistory((prev)=> prev.filter((_, myindex)=> myindex !== index ));
    };

    // memory functions
    const memoryClear = ()=>localStorage.setItem("memory", "0");
    const memoryPLus = (input:string)=> {
        if(memory) {
            localStorage.setItem("memory", `${evaluate(`${input} + ${localStorage.getItem("memory")}`)}`)
        }
    }
    const memoryMinus = (input:string)=>{
         if(memory) {
            localStorage.setItem("memory", `${evaluate(`${input} - ${localStorage.getItem("memory")}`)}`)
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
        clearHistory,
        removeHistorItem,
        history,
        result,
    }
}