document.addEventListener('click', e => {
    if (e.target.dataset.type === 'remove') {
        const id = e.target.closest('.buttons').dataset.id

        remove(id).then(() => {
            e.target.closest('li').remove()
        })
    }
    if (e.target.dataset.type === 'edit') {
        const id = e.target.closest('.buttons').dataset.id
        const text = e.target.closest('li').querySelector('p').textContent

        const newNoteTitle = prompt('Введите новое значение', text)

        if (newNoteTitle) {
            edit(id, newNoteTitle).then(() => {
                e.target.closest('li').querySelector('p').textContent = newNoteTitle
            })
        }
    }
    if (e.target.dataset.type === 'remove-alert') {
        e.target.closest('div').remove()
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
