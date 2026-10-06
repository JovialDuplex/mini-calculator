import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "./components/ui/button";
import * as LucideIcon from "lucide-react";
import useCalculator from "./hooks/useCalculator";
import { Dialog, DialogContent, DialogTitle } from "./components/ui/dialog";

type ButtonType = {
  label: string;
  value: string | null;
  role: "function" | "operator" | "number";
};

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

  // Starts empty so the cursor blinks on an empty screen (Requirement 3)
  const [inputValue, setInputValue] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [justCalculated, setJustCalculated] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const displayContainerRef = useRef<HTMLDivElement>(null);
  const calculator = useCalculator();

  // Scroll display to the end as characters are added so cursor is always visible
  useEffect(() => {
    if (displayContainerRef.current) {
      displayContainerRef.current.scrollLeft = displayContainerRef.current.scrollWidth;
    }
  }, [inputValue]);

  useEffect(() => {
    localStorage.setItem("memory", "0");
    localStorage.setItem("temp", "0");
  }, []);

  // Handle typing numbers (0-9)
  const handleNumberInput = useCallback((digit: string) => {
    // If a calculation was just completed, start a new calculation with this number
    if (justCalculated) {
      setInputValue(digit);
      setJustCalculated(false);
      return;
    }

    setInputValue((prev) => {
      // If empty, return the digit
      if (prev === "") {
        return digit;
      }

      // If display is just "0" and another digit is entered
      if (prev === "0") {
        return digit;
      }

      // Extract the current number segment after the last operator
      const match = prev.match(/(?:^|[+\-*/])([^+\-*/]*)$/);
      const lastToken = match ? match[1] : prev;

      // If current number segment is just "0", replace it with the new digit (e.g. "5+0" + "3" -> "5+3")
      if (lastToken === "0") {
        return prev.slice(0, -1) + digit;
      }

      return prev + digit;
    });
  }, [justCalculated]);

  // Requirement 2: Handle decimals cleanly, including decimals starting with 0
  const handleDecimalInput = useCallback(() => {
    // If a calculation was just completed, start fresh with "0."
    if (justCalculated) {
      setInputValue("0.");
      setJustCalculated(false);
      return;
    }

    setInputValue((prev) => {
      // If display is empty or just "0", start with "0."
      if (prev === "" || prev === "0") {
        return "0.";
      }

      // Extract the current number segment after the last operator
      const match = prev.match(/(?:^|[+\-*/])([^+\-*/]*)$/);
      const lastToken = match ? match[1] : prev;

      // If current number segment already has a decimal, do nothing (prevent multiple dots)
      if (lastToken.includes(".")) {
        return prev;
      }

      // If last token is empty (i.e. prev ends with an operator, e.g. "5+"), append "0."
      if (lastToken === "") {
        return prev + "0.";
      }

      // Otherwise append "." (e.g. "5" -> "5.")
      return prev + ".";
    });
  }, [justCalculated]);

  // Requirement 1: Handle operators (+, -, *, /)
  const handleOperatorInput = useCallback((op: string) => {
    // If a calculation was just completed, reuse previous result for the new operation!
    if (justCalculated && lastResult !== null && lastResult !== "Error") {
      setInputValue(lastResult + op);
      setJustCalculated(false);
      return;
    }

    setInputValue((prev) => {
      // If empty:
      if (prev === "") {
        // If we have an existing result, reuse it
        if (lastResult !== null && lastResult !== "Error") {
          return lastResult + op;
        }
        // Allow negative sign to start negative number
        if (op === "-") return "-";
        return "0" + op;
      }

      // If ending in decimal dot (e.g. "5."), strip it first
      let clean = prev;
      if (clean.endsWith(".")) {
        clean = clean.slice(0, -1);
      }

      // If ending with an operator:
      if (/[+\-*/]$/.test(clean)) {
        // Allow unary minus after * or / (e.g. 5 * -)
        if (op === "-" && (clean.endsWith("*") || clean.endsWith("/"))) {
          return clean + "-";
        }
        // Replace previous operator
        return clean.slice(0, -1) + op;
      }

      return clean + op;
    });
    setJustCalculated(false);
  }, [justCalculated, lastResult]);

  // Handle calculation (=)
  const handleEquals = useCallback(() => {
    if (!inputValue || inputValue === "-") return;

    let expr = inputValue;
    // Strip any trailing operators or decimal points
    while (/[+\-*/.]$/.test(expr)) {
      expr = expr.slice(0, -1);
    }

    if (!expr) return;

    const res = calculator.calculate(expr);
    if (res !== "Error") {
      setLastResult(res);
      setJustCalculated(true);
    }
  }, [inputValue, calculator]);

  // Handle AC (All Clear)
  const handleClear = useCallback(() => {
    setInputValue("");
    calculator.setResult("0");
    setLastResult(null);
    setJustCalculated(false);
    localStorage.setItem("temp", "0");
  }, [calculator]);

  // Handle DEL
  const handleDelete = useCallback(() => {
    if (justCalculated) {
      setInputValue("");
      setJustCalculated(false);
      return;
    }

    setInputValue((prev) => {
      if (prev.length <= 1) return "";
      return prev.slice(0, -1);
    });
  }, [justCalculated]);

  // Handle +/-
  const handlePlusMinus = useCallback(() => {
    if (justCalculated && lastResult !== null && lastResult !== "Error") {
      const num = Number(lastResult);
      const toggled = (-num).toString();
      setInputValue(toggled);
      setLastResult(toggled);
      calculator.setResult(toggled);
      return;
    }

    setInputValue((prev) => {
      if (!prev || prev === "0") return prev;

      if (/^-?\d+(\.\d+)?$/.test(prev)) {
        return prev.startsWith("-") ? prev.slice(1) : "-" + prev;
      }

      const match = prev.match(/^(.*[+\-*/])(-?\d+(?:\.\d+)?)$/);
      if (match) {
        const prefix = match[1];
        const lastNum = match[2];
        if (lastNum.startsWith("-")) {
          return prefix + lastNum.slice(1);
        } else {
          return prefix + "-" + lastNum;
        }
      }

      return prev;
    });
  }, [justCalculated, lastResult, calculator]);

  // Global keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (openDialog) return;

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleNumberInput(e.key);
      } else if (e.key === "+" || e.key === "-" || e.key === "/" || e.key === "*") {
        e.preventDefault();
        handleOperatorInput(e.key);
      } else if (e.key.toLowerCase() === "x") {
        e.preventDefault();
        handleOperatorInput("*");
      } else if (e.key === "." || e.key === ",") {
        e.preventDefault();
        handleDecimalInput();
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleEquals();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleDelete();
      } else if (e.key === "Escape" || e.key === "Delete") {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    openDialog,
    handleNumberInput,
    handleOperatorInput,
    handleDecimalInput,
    handleEquals,
    handleDelete,
    handleClear,
  ]);

  // Button click dispatcher
  const clickButton = (bt: ButtonType) => {
    const { label, value, role } = bt;

    if (label === "History") {
      setOpenDialog(true);
      return;
    }
    if (label === "AC") {
      handleClear();
      return;
    }
    if (label === "DEL") {
      handleDelete();
      return;
    }
    if (label === "=") {
      handleEquals();
      return;
    }
    if (label === "+/-") {
      handlePlusMinus();
      return;
    }
    if (label === "MC") {
      calculator.memoryClear();
      return;
    }
    if (label === "M+") {
      calculator.memoryPLus(inputValue);
      return;
    }
    if (label === "M-") {
      calculator.memoryMinus(inputValue);
      return;
    }
    if (label === "MR") {
      calculator.memoryRecall(inputValue, setInputValue);
      return;
    }
    if (label === "," || value === ".") {
      handleDecimalInput();
      return;
    }
    if (role === "operator") {
      handleOperatorInput(value ?? label);
      return;
    }
    if (role === "number") {
      handleNumberInput(value ?? label);
      return;
    }
  };

  return (
    <div className="my-screen h-screen w-screen bg-(--bg-page) flex items-center justify-center">
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className={"h-100 bg-(--bg-calc) text-(--text-primary) flex flex-col"}>
          <DialogTitle> History </DialogTitle>
          <div className="flex flex-col flex-1 gap-2 overflow-y-auto">
            {calculator.history.length === 0 ? (
              <span className="text-(--text-muted) text-center mt-4">No history yet</span>
            ) : (
              calculator.history.map((element, key) => (
                <div
                  key={key}
                  className="flex justify-between items-center w-full p-2 rounded-xl bg-(--bg-page)"
                >
                  <span> {element} </span>
                  <Button
                    size="icon-xs"
                    onClick={() => calculator.removeHistorItem(key)}
                  >
                    <LucideIcon.X />
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="shadow-lg shadow-black text-(--text-secondary) main-container rounded-(--radius-card) min-w-fit max-w-2xl h-9/12 min-h-fit max-h-150 p-3 bg-(--bg-calc) w-4/12 flex flex-col gap-5">
        <div className="bg-(--bg-input) px-3 py-2 h-24 rounded-(--radius-input) flex flex-col justify-between">
          {/* Main display with real calculator blinking cursor (Requirement 3) */}
          <div
            ref={displayContainerRef}
            className="w-full flex-1 flex items-center justify-end overflow-x-auto overflow-y-hidden cursor-text select-none no-scrollbar"
          >
            <span className="text-h1 text-(--text-secondary) font-mono tracking-wider whitespace-nowrap">
              {inputValue}
            </span>
            <span className="calc-cursor" aria-hidden="true" />
          </div>

          {/* Result area */}
          <div className="result w-full flex justify-between items-end border-t border-(--border)/20 pt-1">
            <span className="text-(--text-secondary) text-h2"> Result </span>
            <span className="text-h2 font-mono"> {calculator.result} </span>
          </div>
        </div>

        <div className="main-box flex-1 text-(--text-primary) grid grid-cols-4 grid-rows-6 place-items-stretch gap-2">
          {buttons.map((bt, index) => {
            const Icon = bt.label === "History" ? LucideIcon.History : null;

            return (
              <Button
                key={index}
                value={bt.value ?? ""}
                data-label={bt.label}
                data-role={bt.role}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => clickButton(bt)}
                className={`font-bold text-sm cursor-pointer bg-(--bg-button) ${
                  bt.role === "number" || bt.role === "operator"
                    ? "bg-white text-black"
                    : "bg-(--bg-button)"
                }`}
              >
                {Icon ? <Icon /> : bt.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
