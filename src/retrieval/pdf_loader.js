import { PDFLoader } from "langchain/document_loaders/fs/pdf";

const loader = new PDFLoader('src/source/beian.pdf')

const rawDocs = await loader.load();
console.log('====rawDocs====\n', rawDocs);