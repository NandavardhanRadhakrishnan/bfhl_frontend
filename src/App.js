import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

const App = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponse(null);

    try {
      const parsedInput = JSON.parse(input);

      const res = await fetch("https://bfhl-backend.onrender.com/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Failed to fetch: ${res.status} ${res.statusText}. ${errorText}`
        );
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Error details:", err);
      setError(err.message);
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const renderResponse = () => {
    if (!response) return null;

    return (
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Response:</h2>
        {selectedOptions.includes("Alphabets") && (
          <p>Alphabets: {response.alphabets.join(", ")}</p>
        )}
        {selectedOptions.includes("Numbers") && (
          <p>Numbers: {response.numbers.join(", ")}</p>
        )}
        {selectedOptions.includes("Highest alphabet") && (
          <p>Highest alphabet: {response.highest_alphabet.join(", ")}</p>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ABCD123</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter JSON input"
          className="w-full p-2 border rounded"
          rows="4"
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
      <Transition
        show={!!error}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="rounded-md bg-yellow-50 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Error</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      {response && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Select options to display:</h2>
          {["Alphabets", "Numbers", "Highest alphabet"].map((option) => (
            <label key={option} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionChange(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )}
      {renderResponse()}
    </div>
  );
};

export default App;
