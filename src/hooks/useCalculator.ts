import React, { useState } from "react";
import { evaluate } from "mathjs";

export default function useCalculator() {
    const [history, setHistory] = useState<string[]>(() => {
        try {
            return JSON.parse(localStorage.getItem("history") ?? "[]");
        } catch {
            return [];
        }
    });
    const [result, setResult] = useState<string>("0");

    const calculate = (input: string): string => {
        try {
            const evaluated = evaluate(input);
            const res = String(evaluated);
            setResult(res);
            setHistory((prev) => {
                const updated = [...prev, `${input} = ${res}`];
                localStorage.setItem("history", JSON.stringify(updated));
                return updated;
            });
            localStorage.setItem("temp", res);
            return res;
        } catch {
            setResult("Error");
            return "Error";
        }
    };

    // history functions
    const clearHistory = () => {
        setHistory([]);
        localStorage.setItem("history", "[]");
    };

    const removeHistorItem = (index: number) => {
        setHistory((prev) => {
            const updated = prev.filter((_, myindex) => myindex !== index);
            localStorage.setItem("history", JSON.stringify(updated));
            return updated;
        });
    };

    // memory functions
    const memoryClear = () => {
        localStorage.setItem("memory", "0");
    };

    const memoryPLus = (input: string) => {
        try {
            const memoryVal = localStorage.getItem("memory") ?? "0";
            const val = input ? evaluate(input) : 0;
            const updated = String(evaluate(`${val} + ${memoryVal}`));
            localStorage.setItem("memory", updated);
        } catch {}
    };

    const memoryMinus = (input: string) => {
        try {
            const memoryVal = localStorage.getItem("memory") ?? "0";
            const val = input ? evaluate(input) : 0;
            const updated = String(evaluate(`${val} - ${memoryVal}`));
            localStorage.setItem("memory", updated);
        } catch {}
    };

    const memoryRecall = (
        _currentInput: string,
        setInput: React.Dispatch<React.SetStateAction<string>>
    ) => {
        const mem = localStorage.getItem("memory") ?? "0";
        setInput((prev) => {
            if (!prev || prev === "0") return mem;
            if (/[+\-*/]$/.test(prev)) return prev + mem;
            return prev + "+" + mem;
        });
    };

    return {
        calculate,
        setResult,
        memoryPLus,
        memoryMinus,
        memoryClear,
        memoryRecall,
        clearHistory,
        removeHistorItem,
        history,
        result,
    };
}