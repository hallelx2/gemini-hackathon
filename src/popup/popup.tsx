import React, { useEffect, useState } from 'react';
import CustomDropdown from './CustomDropdown';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SpeechSynthesis = () => {
  const genAI = new GoogleGenerativeAI("AIzaSyDxl5yoMqA0DeWn3hV3cwYve_hLK0d6cS4");
  const [language, setLanguage] = useState('en'); // Default language
  const [text1, setText1] = useState(''); // Default language
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(false); // Track error state

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'X') {
        handleExtractText();
        console.log('Ctrl + Shift + X pressed');
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  async function run(textsvalue) {
    setLoading(true); // Set loading state to true while generating content
    setError(false); // Reset error state
    let prompts = `You are tasked with creating an accessible version of a website for people with disabilities. 
using this language: ${language}.
This is the information on the website: ${textsvalue}.

The goal is to transform the content of the website into a more narrative and explanatory format, 
making it easier for individuals with disabilities, such as visual impairments or cognitive disabilities, 
to comprehend and navigate.

Consider the following guidelines while transforming the content:

Simplify complex language and technical terms to enhance readability.
Provide detailed explanations and context for images, charts, and other visual elements.
Use descriptive headings and subheadings to organize the content and improve navigation.
Break down lengthy paragraphs into shorter, digestible sections for better understanding.
Incorporate alternative text (alt text) for images to convey their meaning to individuals using screen readers.
Ensure that the overall tone is inclusive, empathetic, and engaging to encourage users to explore the content further.

Your task is to generate a narrative version of the website's content that aligns with these guidelines. 
Focus on conveying the key information in a clear, concise, and accessible manner, ensuring that individuals with 
disabilities can fully engage with the content and gain valuable insights on [topic/niche].`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    try {
      const result = await model.generateContent(prompts);
      const response = await result.response;
      const text = response.text();
      setLoading(false); // Set loading state to false after content is generated
      return text;
    } catch (error) {
      setLoading(false); // Set loading state to false if an error occurs
      setError(true); // Set error state to true
      console.error("Error:", error);
    }
  }

  const handleExtractText = () => {
    setLoading(true); // Set loading state to true while extracting text
    setError(false); // Reset error state
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'extractText' }, async function (response) {
        setLoading(false); // Set loading state to false after text is extracted
        if (chrome.runtime.lastError) {
          setError(true); // Set error state to true if an error occurs
          console.error("Error:", chrome.runtime.lastError.message);
          return;
        }
        if (response && response.text) {
          let result = await run(response.text)
          setText1(result || response.text)
          const utterance = new SpeechSynthesisUtterance(result || response.text);
          utterance.lang = language;
          window.speechSynthesis.speak(utterance);
        } else {
          console.error("Text extraction failed or no text found.");
        }
      });
    });
  };

  chrome.commands.onCommand.addListener(function (command) {
    if (command === "myCommand") {
      console.log("My command was triggered!");
      handleExtractText()
    }
  });
  const [contrast, setContrast] = useState(255);

  const handleContrastChange = (e) => {
    setContrast(parseInt(e.target.value));
  };
  return (
    <div className="text-center pt-20 w-full h-full"
    style={{ backgroundColor: `rgba(${contrast}, ${contrast}, ${contrast}, 1)` }}
  >
    <h1 className="text-3xl font-bold mb-6" style={{ color: `rgba(${255 - contrast}, ${255 - contrast}, ${255 - contrast}, ${contrast})` }}>Accessify</h1>
    {/* <img src={'/icon.png'} width={200} height={100} alt="" /> */}
    <label htmlFor="language" className="block mb-2 text-[12px]" style={{ color: `rgba(${255 - contrast}, ${255 - contrast}, ${255 - contrast}, ${contrast})` }}>Select Language</label>
    <CustomDropdown onChange={(value) => setLanguage(value)} />
    {error ? ( // Render error message if error state is true
      <div className="text-lg my-4 text-red-500">Please Refresh Page.</div>
    ) : (
      <>
        {loading ? ( // Render loader if loading state is true
          <div className="text-lg flex justify-center my-2">
          <img src={'/loading.gif'} width={50} height={50} alt="" />
        </div>
        ) : (
          <div className="text-lg my-4 border-2 border-blue-300 rounded-md mx-2 p-2 max-h-[200px] overflow-y-scroll">{text1}</div>
        )}
        <button onClick={handleExtractText} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-[12px]">Extract and Speak</button>
        <div className="flex flex-col gap-2 py-8">
          <label htmlFor="" className="block mb-2 text-[12px]" style={{ color: `rgba(${255 - contrast}, ${255 - contrast}, ${255 - contrast}, ${contrast})` }}>Contrast Adjustment</label>
          <div className="flex justify-center items-center ">
            <input
              type="range"
              min="60"
              max="255"
              value={contrast}
              onChange={handleContrastChange}
              className="w-64"
            />
          </div>
        </div>
      </>
    )}
  </div>
  );
};

export default SpeechSynthesis;
