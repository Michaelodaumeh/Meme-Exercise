const form = document.getElementById('memeForm');
const container = document.getElementById('memeContainer');

form.addEventListener('submit', function(event){
  event.preventDefault();

  const imageUrl = document.getElementById('imageUrl').value.trim();
  const topTextInput = document.getElementById('topText').value.trim();
  const bottomTextInput = document.getElementById('bottomText').value.trim();

  if (!imageUrl){
    alert('Please provide an image URL!');
    return;
  }

  const memeDiv = document.createElement('div');
  memeDiv.classList.add('meme');

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = imageUrl;

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;

    let topText = { text: topTextInput, x: canvas.width/2, y: 50 };
    let bottomText = { text: bottomTextInput, x: canvas.width/2, y: canvas.height-50 };
    let dragging = null;
    let editing = null;

    function drawMeme() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0);

      function drawText(t){
        if (!t.text) return;
        let fontSize = canvas.width / 10;
        ctx.font = `${fontSize}px Impact`;
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = fontSize/15;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 2;
        ctx.fillText(t.text.toUpperCase(), t.x, t.y);
        ctx.strokeText(t.text.toUpperCase(), t.x, t.y);
        ctx.shadowColor = 'transparent';
      }

      drawText(topText);
      drawText(bottomText);
    }

    drawMeme();

    // Dragging events
    canvas.addEventListener('mousedown', e => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const radius = 50;

      if (Math.abs(x - topText.x) < radius && Math.abs(y - topText.y) < radius) dragging = 'top';
      else if (Math.abs(x - bottomText.x) < radius && Math.abs(y - bottomText.y) < radius) dragging = 'bottom';
    });

    canvas.addEventListener('mousemove', e => {
      if (!dragging) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (dragging === 'top') topText.x = x, topText.y = y;
      if (dragging === 'bottom') bottomText.x = x, bottomText.y = y;
      drawMeme();
    });

    canvas.addEventListener('mouseup', () => dragging = null);
    canvas.addEventListener('mouseleave', () => dragging = null);

    // Double click to edit
    canvas.addEventListener('dblclick', e => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const radius = 50;
      if (Math.abs(x - topText.x) < radius && Math.abs(y - topText.y) < radius) editing = 'top';
      else if (Math.abs(x - bottomText.x) < radius && Math.abs(y - bottomText.y) < radius) editing = 'bottom';
      else editing = null;

      if (editing) {
        const newText = prompt("Edit text:", editing === 'top' ? topText.text : bottomText.text);
        if (newText !== null){
          if (editing === 'top') topText.text = newText;
          else bottomText.text = newText;
          drawMeme();
        }
        editing = null;
      }
    });

    // Buttons container
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons');

    const downloadBtn = document.createElement('button');
    downloadBtn.innerText = '💾';
    downloadBtn.title = "Save Meme";
    downloadBtn.addEventListener('click', e => {
      e.stopPropagation();
      const link = document.createElement('a');
      link.download = 'meme.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = '❌';
    deleteBtn.title = "Delete Meme";
    deleteBtn.addEventListener('click', e => {
      e.stopPropagation();
      memeDiv.remove();
    });

    buttonsDiv.appendChild(downloadBtn);
    buttonsDiv.appendChild(deleteBtn);

    memeDiv.appendChild(canvas);
    memeDiv.appendChild(buttonsDiv);

    container.appendChild(memeDiv);
  };

  img.onerror = () => alert('Failed to load image. Check the URL.');
  form.reset();
});
