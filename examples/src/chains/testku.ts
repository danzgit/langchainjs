import { OpenAI } from "langchain/llms/openai";
import { loadQAChain } from "langchain/chains";
import { TextLoader } from "langchain/document_loaders";
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import {
    JSONLoader,
    JSONLinesLoader,
  } from "langchain/document_loaders/fs/json";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
  
/**
 * Takes input docs and a question sent to LLM for answer based on relevant docs
 */
export const run = async () => {
    const model = new OpenAI({
        modelName: "gpt-4",
        temperature: 0.7,
        maxTokens: 1000,
        maxRetries: 5,
      });
  // question and answer chain
  const chain = loadQAChain(model);
  
  
  // Set your docs
  //Ini kalau me-refer satu file txt saja.. 
  //const loader = new TextLoader(
  //  "src/document_loaders/example_data/example.txt"
  //);
  
  //Ini kalau me-refer satu berbagai macam tipe file  https://js.langchain.com/docs/modules/data_connection/document_loaders/integrations/file_loaders/directory
  const loader = new DirectoryLoader(
    "src/document_loaders/example_data",
    {
      ".json": (path) => new JSONLoader(path, "/texts"),
      ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
      ".txt": (path) => new TextLoader(path),
      ".csv": (path) => new CSVLoader(path, "text"),
    }
  );
  const docs = await loader.load();
  
  console.log("docs", docs);


  //call the chain with both the doc and question
  const res = await chain.call({
    input_documents: docs,
    question: "What is azure?",
  });
  console.log({ res });
};
