document.getElementById('item').addEventListener("keypress", async function (e) {
    if (e.key === "Enter") {

        //reset
        document.querySelector('.add-item-input-error-container').style.display = 'none';
        document.querySelector('#item').style.animation = 'none';

        let item = document.getElementById('item').value;
        item = item.trimStart();
        item = item.trimEnd();

        if (item.length > 15) {
            document.querySelector('#item').style.animation = 'shake 1s';
            document.querySelector('#add-item-input-error').innerText = 'Character limit exceeded (10)';
            document.querySelector('.add-item-input-error-container').style.display = 'block';
        } else {
            const target = {
                "label": item
            }

            data = localStorage.getItem('Items') ? JSON.parse(localStorage.getItem('Items')) : [];
            if (item.length < 1 || data.some(item => JSON.stringify(item) === JSON.stringify(target))) {
                document.querySelector('#item').style.animation = 'shake 1s';
                document.querySelector('#add-item-input-error').innerText = 'Duplicate Entry';
                document.querySelector('.add-item-input-error-container').style.display = 'block';
            } else {
                document.querySelector('#editItems-container').style.filter = 'none'
                document.querySelector('#add-item-wrapper').style.display = 'none';
                data.push({
                    'label': item
                });
                localStorage.setItem('Items', JSON.stringify(data));
                renderItemsList();
                scrollToBottom();
            }
        }
    }
});

document.getElementById('add-btn').addEventListener('click', () => {
    document.querySelector('#editItems-container').style.filter = 'blur(5px)'
    document.querySelector('#add-item-wrapper').style.display = 'flex';
})

// hide the input prompt when use clicks on blank area on screen
let addItemWrapper = document.getElementById("add-item-wrapper");
let addItem = document.getElementById("addItem");

addItemWrapper.addEventListener("click", function (event) {
    if (event.target === addItemWrapper) {
        document.querySelector('#editItems-container').style.filter = ''
        document.querySelector('#add-item-wrapper').style.display = 'none';
    }
});


function hideInputDiv() {
    console.log('even listened')
}
document.getElementById('done').addEventListener('click', async () => {

    enableSwipe();
    await renderSpinWheel();

    const spinContainer = document.getElementById('spin-container')
    spinContainer.style.display = `flex`;

    const editItemsContainer = document.getElementById('editItems-container')
    editItemsContainer.style.display = `none`;
})

function renderItemsList() {
    const currentItems = document.getElementById('current-items');
    currentItems.innerHTML = '';
    data.forEach((element, index) => {
        currentItems.innerHTML += `
        <div class='spin-item'>
            <div class='item-name'>${element.label}</div>
            <div class="remove-btn-div">
                <button onclick="removeItem(${index})" class="remove-btn"><img src="assets/icons/remove-icon.png"></button>
            </div>
        </div>
    `;
    });
    scrollToBottom();
};

function removeItem(index) {
    data.splice(index, 1);
    localStorage.setItem('Items', JSON.stringify(data));
    renderItemsList();
};

function scrollToBottom() {
    document.getElementById('editItems-container').scrollTo(0, document.getElementById('editItems-container').scrollHeight);
}