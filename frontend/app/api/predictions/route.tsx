export async function POST(req: Request) {
  const res = await req.json()
  // Create FormData and append base64 image converted to blob
  const base64Data = res.image.split(',')[1];
  const imageBuffer = Buffer.from(base64Data, 'base64');
  const uint8Array = new Uint8Array(imageBuffer);

  const formData = new FormData();
  formData.append('image', new Blob([uint8Array], { type: 'image/png' }), 'image.png',);

  const response = await fetch(`http://backend:8000/v1/person_detection`, {
    method: "POST",
    body: formData,
  });


  if (response.status !== 200) {
    const error = await response.json();
    return Response.json({ detail: error.detail }, { status: 500 });
  }

  const prediction = await response.json();
  return Response.json({ ...prediction })
}