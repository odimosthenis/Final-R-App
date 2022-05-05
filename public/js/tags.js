document.querySelectorAll(".tagoption").forEach( tagop =>{
    tagop.querySelector(".del").addEventListener('click', ()=>{
            tagop.remove()
    })
})

document.querySelector("#addTagContainer .addbtn").addEventListener('click',(e)=>{
        const val = document.querySelector('#addTagContainer input').value;
        if (val=='') return;
        const newtagop = document.createElement('div');
        newtagop.classList.add('tagoption')
        newtagop.innerHTML = document.querySelector('.tagoption.template').innerHTML;
        newtagop.querySelector('.name input').value = val;
        document.querySelector("#mytags").appendChild(newtagop)
        document.querySelector('#addTagContainer input').value = '';
        newtagop.querySelector(".del").addEventListener('click', ()=>{
                newtagop.remove()
        })
})