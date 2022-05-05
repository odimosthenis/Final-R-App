document.querySelector('#resetRecord').addEventListener('click',(e)=>{
    e.preventDefault()
    window.location.href=e.target.dataset.redir
})

document.querySelector('#delete').addEventListener('click',(e)=>{
    e.preventDefault()
    console.log(e.target.dataset.record)
    const endpoint = `/records/${e.target.dataset.record}`
    fetch(endpoint,{method: 'DELETE'})
    .then(r=>r.json())
    .then(data=>{
        alert('deleted')
        window.location.href = data.redirect
    }).catch(e=>console.timeLog(e))
})

let editable=false;
document.querySelectorAll('.editablecontainer').forEach(el=>{
    el.querySelectorAll('.edit').forEach(edit=>{
        edit.addEventListener('click',(e)=>{
            
            if(!editable){
                editable=true;
                document.querySelector('#resetRecord').classList.remove('noneDisplay')
                document.querySelector('#submitRecord').classList.remove('noneDisplay')
                document.querySelector('#delete').classList.add('noneDisplay')
            }

            if(!el.classList.contains('n')){ // don't grab the tags
                const inpt =  el.querySelector('input') ||  el.querySelector('textarea')
                inpt.readOnly = false;
            }
        })
    })
});

const tagsDiv = document.querySelector('.editablecontainer.n');
tagsDiv.querySelector('.edit').addEventListener('click',()=>{
    if(!editable){
        editable=true;
        document.querySelector('#resetRecord').classList.remove('noneDisplay')
        document.querySelector('#submitRecord').classList.remove('noneDisplay')
        document.querySelector('#delete').classList.add('noneDisplay')
    }

    document.querySelector("#allTags").classList.remove('noneDisplay');
    tagsDiv.classList.add('noneDisplay')


})


document.querySelector('#submitRecord').addEventListener('click',(e)=>{
    e.preventDefault();

    let data = {};
    document.querySelectorAll('.editablecontainer').forEach(el=>{
        const inpt = el.querySelector('input:not([type="checkbox"])') ||  el.querySelector('textarea');
        if(inpt && !inpt.hasAttribute('readonly') ){
            data[inpt.name] = inpt.value;
        }
    })

    document.querySelectorAll('[name="tags[]"]:checked').forEach(tag=>{
        if(!data.tags) data.tags = []
        data.tags.push(tag.value)
    })

    console.log(data)
    
    
    const endpoint = `/records/${e.target.dataset.record}`
    fetch(endpoint,{
        method: 'PATCH', 
        headers: {"Content-type":"application/json"},
        body: JSON.stringify(data)
    })
    .then(r=>r.json())
    .then(data=>{
        window.location.href = endpoint;
    }).catch(e=>console.log('error'))
    
    

})