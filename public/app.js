document.addEventListener('click', e => {
    if (e.target.dataset.type === 'remove-alert') {
        e.target.closest('div').remove()
        return
    }

    const noteNode = e.target.closest('li')

    if (e.target.dataset.type === 'remove') {
        const id = noteNode.dataset.id
        remove(id).then(() => {
            noteNode.remove()
        })
    }
    if (e.target.dataset.type === 'update') {
        const noteTitle = noteNode.querySelector('p').textContent

        noteNode.innerHTML = `  <input type="text" class="form-control form-control-sm" style="width: 300px" name="new-title" value="${noteTitle}" required>
                                <div class="buttons">
                                    <button type="button" class="btn btn-success" data-type="save">Сохранить</button>
                                    <button class="btn btn-danger" data-type="cancel">Отменить</button>
                                </div>`
    }
    if (e.target.dataset.type === 'cancel') {
        const noteTitle = noteNode.querySelector('input').value

        noteNode.innerHTML = `  
                                <p>${noteTitle}</p>
                                <div class="buttons">
                                    <button class="btn btn-primary" data-type="update">Обновить</button>
                                    <button class="btn btn-danger" data-type="remove">&times;</button>
                                </div>`
    }
    if (e.target.dataset.type === 'save') {
        const id = noteNode.dataset.id
        const noteTitle = noteNode.querySelector('input').value

        if (noteTitle) {
            edit(id, noteTitle).then(() => {
                noteNode.innerHTML = `  
                                <p>${noteTitle}</p>
                                <div class="buttons">
                                    <button class="btn btn-primary" data-type="update">Обновить</button>
                                    <button class="btn btn-danger" data-type="remove">&times;</button>
                                </div>`
            })
        }
    }
})

async function remove(id) {
    await fetch(`/${id}`, {method: 'DELETE'})
}

async function edit(id, newTitle) {
    const newNoteData = {
        title: newTitle,
    }
    await fetch(`/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newNoteData),
    })
}
