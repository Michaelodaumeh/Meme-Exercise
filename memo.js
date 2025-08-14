
const form = document.getElementById('memeForm');
const container = document.getElementById('memeContainer');

form.addEventListener('submit', function(event){
    event.preventDefault();

    const imageUrl = document.getElementById('imageUrl').value.trim();
    const topText = document.getElementById('topText').value.trim();
    const bottomText = document.getElementById('bottomText').value.trim();

    if (!imageUrl || !topText || !bottomText){
        alert('Please fill in all the fields!');
        return;
    }

    const memeDiv = document.createElement('div');
    memeDiv.classList.add('meme');

    const img = document.createElement('img');
    img.src = imageUrl;

    const top = document.createElement('div');
    top.classList.add('meme-text', 'top-text');
    top.innerText = topText;

    const bottom = document.createElement('div');
    bottom.classList.add('meme-text', 'bottom-text');
    bottom.innerText = bottomText;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-button');
    deleteBtn.innerText = '❌';


    deleteBtn.addEventListener('click', function(){
        memeDiv.remove();
    });

    memeDiv.appendChild(img);
    memeDiv.appendChild(top);
    memeDiv.appendChild(bottom);
    memeDiv.appendChild(deleteBtn);
    container.appendChild(memeDiv);

    form.reset();

});