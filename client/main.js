

const buttons = document.querySelectorAll('.dbButtons');
buttons.forEach(button => {
    button.addEventListener('click', async () => {
        console.log(`${button.id} clicked!`);
        try{
            const response = await fetch(`http://localhost:3000/api/dbManager/selectDB`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ buttonId: button.id })
            });

            const data = await response.json();
            console.log('Data received:', data);
            responseDiv.innerText = `Selected Database: ${data.connected}`;
            getAllDataButton.click();

        }catch (error) {
            console.error('Error:', error);
        }
    });
});

const getAllDataButton = document.getElementById('getAllData');
getAllDataButton.addEventListener('click', async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/dbManager/getAllData`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('Data received:', data);
        const dbDataShower = document.getElementById('dbDataShower');
        dbDataShower.innerHTML = data;
        renderData(data);

    } catch (error) {
        console.error('Error:', error);
    }
});

function renderData(data) {
    const container = document.getElementById('dbDataShower');
    container.innerHTML = '';  // clear previous content

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const collection = data[key];
            const collectionDiv = document.createElement('div');
            collectionDiv.className = 'type-container';
            const collectionTitle = document.createElement('h2');
            collectionTitle.textContent = key;
            collectionDiv.appendChild(collectionTitle);


            const addRandomDataButton = document.createElement('button');
            addRandomDataButton.textContent = 'Add Random Data';
            addRandomDataButton.addEventListener('click', async () => {
                try {
                    const response = await fetch(`http://localhost:3000/api/dbManager/addRandomData`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ collection: key })
                    });

                    const data = await response.json();
                    console.log('Data received:', data);
                    getAllDataButton.click();
                } catch (error) {
                    console.error('Error:', error);
                }
            });
            collectionDiv.appendChild(addRandomDataButton);

            for (const item of collection) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'user-card';
                
                const nameEl = document.createElement('h3');
                nameEl.textContent = item.name;

                const ageEl = document.createElement('p');
                ageEl.textContent = `Age: ${item.age}`;

                const emailEl = document.createElement('p');
                emailEl.textContent = `Email: ${item.email}`;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => {
                    editData(item, key);
                });

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.style.marginLeft = '8px';
                deleteButton.addEventListener('click', async () => {
                    deleteData(item, key);
                });

                itemDiv.append(nameEl, ageEl, emailEl, editButton, deleteButton);
                collectionDiv.appendChild(itemDiv);
            }

            container.appendChild(collectionDiv);
        }
    }
}


async function editData(item, collection) {
    const newName = prompt("Enter new name:");
    const newAge = prompt("Enter new age:");
    const newEmail = prompt("Enter new email:");
    const submitChanges = confirm(`Save changes?\nName: ${newName}\nAge: ${newAge}\nEmail: ${newEmail}`);
    if (submitChanges) {
        try{
            const response = await fetch(`http://localhost:3000/api/dbManager/updateData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    collection: collection,
                    id: item._id,
                    name: newName,
                    age: newAge,
                    email: newEmail
                })
            });
            const data = await response.json();
            console.log('Data received:', data);
            getAllDataButton.click(); 
        }catch (error) {
            console.error('Error:', error);
        }
    }
}

async function deleteData(item, collection) {
    console.log("item_collection:", collection);
    const confirmDelete = confirm("Are you sure you want to delete this item?");
    if (confirmDelete) {
        try{
            const response = await fetch(`http://localhost:3000/api/dbManager/deleteData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    collection: collection,
                    id: item._id
                })
            });
            const data = await response.json();
            console.log('Data received:', data);
            getAllDataButton.click(); 
        }catch (error) {
            console.error('Error:', error);
        }
    }
}

