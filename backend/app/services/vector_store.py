from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS

def get_vector_store(text_chunks):
    """Create and save vector store from text chunks"""
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")
    return vector_store

def get_vector_db():
    """Load the vector store"""
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    return FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)