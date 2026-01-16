def main():
    print("Hello from projectsllm!")

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from src.rag_pipeline import process_pdf, answer_query

app = FastAPI()

# CORS (important for Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    file_bytes = await file.read()

    pdf_path = f"data/{file.filename}"
    with open(pdf_path, "wb") as f:
        f.write(file_bytes)

    process_pdf(pdf_path)

    return {"status": "PDF processed successfully"}

@app.post("/ask")
async def ask(query: dict):
    user_query = query["query"]
    answer = answer_query(user_query)
    return {"answer": answer}

if __name__ == "__main__":
    main()
