export async function uploadPDF(file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("http://localhost:8000/upload", {
    method: "POST",
    body: form,
  });

  return await res.json();
}

export async function askQuestion(query: string) {
  const res = await fetch("http://localhost:8000/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  return await res.json();
}
