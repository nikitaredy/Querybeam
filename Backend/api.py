from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from your_pipeline_file import run_rag_pipeline  # import your function

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/query")
async def query_endpoint(question: str = Form(...), files: List[UploadFile] = File(None)):
    # read files
    pdf_contents = []
    if files:
        for f in files:
            pdf_contents.append(await f.read())

    # send to your pipeline
    result = run_rag_pipeline(question, pdf_contents)

    return {"answer": result}
