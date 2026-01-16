from langchain_core.documents import Document

class CustomFaissRetriever:
    def __init__(self, store):
        self.store = store   # your FaissVectorStore instance
    
    def invoke(self, query: str):
        results = self.store.query(query)
        
        docs = []
        for r in results:
            text = r["metadata"]["text"] if r["metadata"] else ""
            docs.append(
                Document(
                    page_content=text,
                    metadata={"distance": r["distance"]}
                )
            )
        return docs
