from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter

def get_pdf_text(pdf_file):
    """Extract text from PDF file"""
    text = ""
    pdf_reader = PdfReader(pdf_file)
    for page in pdf_reader.pages:
        extracted_text = page.extract_text()
        if extracted_text:
            text += extracted_text + "\n"
    return text

def get_text_chunks(text):
    """Split text into chunks for processing"""
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    return text_splitter.split_text(text)