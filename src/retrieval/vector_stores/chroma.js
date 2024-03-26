import 'dotenv/config'
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";

console.time("All");
// Create docs with a loader
// const loader = new PDFLoader("src/source/beian.pdf");
console.time("Load Documents");
const loader = new TextLoader("src/source/some.txt");
const docs = await loader.load();
console.timeEnd("Load Documents");

console.time("Create Vector Store and Index Documents");
const vectorStore = await Chroma.fromDocuments(docs, new OpenAIEmbeddings(), {
  collectionName: "a-test-collection",
  url: "http://107.150.102.219:8000", // Optional, will default to this value
  collectionMetadata: {
    "hnsw:space": "cosine",
  }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
});
console.timeEnd("Create Vector Store and Index Documents");

console.time("Similarity Search");
const response = await vectorStore.similaritySearch("mysql", 1);
console.timeEnd("Similarity Search");

console.timeEnd("All");
console.log(response);
/*
[
  Document {
    pageContent: 'Foo\nBar\nBaz\n\n',
    metadata: { source: 'src/document_loaders/example_data/example.txt' }
  }
]
*/