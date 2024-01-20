//for read editor java script for reading the file and changing the text styel

function execCmd(command) {
    document.execCommand(command, false, null);
}

function insertImage() {
    const imageInput = document.getElementById('imageInput');
    imageInput.click();
}

document.getElementById('imageInput').addEventListener('change', handleImage);

function handleImage() {
    const editor = document.getElementById('editor');
    const imageInput = document.getElementById('imageInput');

    const file = imageInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            editor.appendChild(img);
            const b = document.createElement('br')
            editor.appendChild(b);
            const area = document.createElement('textarea')
            area.name="content";
            area.id = 'field';
            editor.appendChild(area);
        };

        reader.readAsDataURL(file);
    }
}


