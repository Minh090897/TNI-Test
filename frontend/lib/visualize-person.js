export function visualizePerson(imageElement, bboxes, vbboxes) {
   // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  const ctx = canvas.getContext('2d');

  // Draw the original image
  ctx.drawImage(imageElement, 0, 0);

  // Process each bounding box
  bboxes.forEach((bbox, i) => {
    const vbbox = vbboxes[i];
    const [x1, y1, x2, y2] = bbox;
    const [vx1, vy1, vx2, vy2] = vbbox;

    // Generate random color
    const color = {
      r: Math.floor(Math.random() * 256),
      g: Math.floor(Math.random() * 256),
      b: Math.floor(Math.random() * 256)
    };
    const strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    const fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`;

    // Draw main bounding box
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1;
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

    // Draw filled visual bounding box with alpha
    ctx.fillStyle = fillStyle;
    ctx.fillRect(vx1, vy1, vx2 - vx1, vy2 - vy1);

    // Draw circles at corners of visual bbox
    ctx.beginPath();
    const corners = [[vx1, vy1], [vx1, vy2], [vx2, vy1], [vx2, vy2]];
    corners.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, 2 * Math.PI);
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  });

  return canvas.toDataURL();
}
