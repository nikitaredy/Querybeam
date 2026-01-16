from .vector_store import store_pdf_embeddings, get_relevant_chunks
from .embeddings import get_embedding
from .utils import call_llm

def process_pdf(path):
    store_pdf_embeddings(path)

def answer_query(query):
    embedding = get_embedding(query)
    context = get_relevant_chunks(embedding)
    
    prompt = f"""
    You are a helpful assistant. Use only the context below.
    
    Context:
    {context}

    Question: {query}
    """
    
    return call_llm(prompt)
