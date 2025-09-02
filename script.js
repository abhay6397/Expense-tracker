function getFormatedTime() {
    // 25 Feb, 06:45 PM
    const now = new Date().toLocaleTimeString('en-us', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
    const date = now.split(',')
    const newdate = date[0].split(' ');
    // console.log(date);
    // console.log(newdate);
    return `${newdate[1]} ${newdate[0]}, ${date[1]}`;
}

document.querySelector('.e-form').addEventListener('submit', (e) => {
    e.preventDefault()
    let desc = document.querySelector('#desc').value;
    let select = document.querySelector('#select').value;
    let amt = document.querySelector('#value').value;
    let edited = false;

    if (desc.length > 0 && amt.length > 0) {
        addInfo(desc, select, amt, edited);
        resetform()
    }
})
function addInfo(desc, select, amt, edited) {
    const date = getFormatedTime();
    var card = ` <div class="card">
            <h3>${desc}</h3>
            <p>${date}</p>
            <h2 class=${addClassColor(select)} >${select}₹${seprator(amt)}</h2>`;
    // totalbalance();
    // colorchange(); 
    const container = document.querySelector('.card-container');
    container.insertAdjacentHTML("afterBegin", card);
    setLocalstorage(desc, date, amt, select, edited)
    showtotalIncome();
    showtotalExpenses();
    showtotalbalance();
}
function getlocalstorage() {
    let items = localStorage.getItem("items");
    if (items) {
        items = JSON.parse(items)
    }
    else {
        items = [];
    }
    return items;
}
function setLocalstorage(desc, date, amt, select, edited) {
    let items = getlocalstorage();
    // let items = JSON.parse(localStorage.getItem('items') || '[]');

    items.push({ desc, date, amt, select, edited })

    localStorage.setItem("items", JSON.stringify(items));

}

function showtotalIncome() {
    let items = getlocalstorage();

    let totalIncome = 0;
    for (let item of items) {
        if (item.select === '+') {
            totalIncome += parseInt(item.amt);
        }
    }
    // console.log(totalIncome);
    document.querySelector('.income h1').innerText = `₹${seprator(totalIncome)}`;
}
showtotalIncome();
function showtotalExpenses() {
    let items = getlocalstorage();

    let totalExpenses = 0;
    for (let item of items) {
        if (item.select === '-') {
            totalExpenses += parseInt(item.amt);
        }
    }
    // console.log(totalExpenses);
    document.querySelector('.expenses h1').innerText = `₹${seprator(totalExpenses)}`;
}
showtotalExpenses();

function showtotalbalance() {
    let items = getlocalstorage();
    let totalamt = document.querySelector('.total h1');
    let total = 0;

    for (let item of items) {
        if (item.select === '+') {
            total += parseInt(item.amt);

        } else {
            total -= parseInt(item.amt);
        }
    }
    totalamt.innerText = seprator(total);
    // console.log(total);
    if (total < 0) {
        document.querySelector('.header').style.backgroundColor = 'red';

    } else {
        document.querySelector('.header').style.backgroundColor = 'green';

    }
}
showtotalbalance();

function resetform() {
    document.querySelector('#desc').value = "";
    // document.querySelector('#select').value = "+";
    document.querySelector('#value').value = "";
}


function showlsdata() {
    const items = getlocalstorage();
    items.forEach((val, index) => {
        var card = ` <div data-index="${index}" class="card">
    <h3>${val.desc}</h3>
    <p>${val.date} <span class ="edit">${val.edited?'Edited':''}</span></p>
    
    <h2 data-amt ="${seprator(val.amt)}" class=${addClassColor(val.select)}> ${val.select}₹${seprator(val.amt)}</h2>
    <div> <button class='edit_btn'>Edit</button>
     <button class='delete_btn'>Delete</button> </div>`;
        const container = document.querySelector('.card-container');
        container.insertAdjacentHTML("afterBegin", card);
    });
}
showlsdata();

document.querySelector('#delete').addEventListener('click',()=>{
    localStorage.removeItem('items');
    window.location.reload();
    
})

function seprator(amount){
    amount = parseInt(amount)
    return amount.toLocaleString();
};

function addClassColor(sign){
    if("+"===sign){
        return('green')
    }else{
        return('red')
    }
}

function modifyValue(){
    document.addEventListener('click',function(e){
        //edit btn
     if(e.target.classList.contains('edit_btn')){
        // let items = getlocalstorage();
        // console.log(items)
         const btn = e.target;
         const originalCard = btn.parentElement.parentElement;
         const index = btn.parentElement.parentElement.dataset.index;

        //  console.log(items[index].desc)
          const description = originalCard.querySelector('h3').innerText;
          const Amount = originalCard.querySelector('h2').dataset.amt;
         console.log(description)

         const editCard = document.createElement('div');
         editCard.classList.add('card', 'edit_card');
         editCard.dataset.index = `${index}`
         editCard.innerHTML = `<div>
         <label for="desc">description:&nbsp;</label>
        <input type="text" value=${description} class="desc" name="desc">
        </div>
        <div>
        <label for="amount">Amount: &nbsp; &nbsp; &nbsp; &nbsp;</label>
        <input  type="text" value=${Amount} class="amount" name="amount">
        </div>
        <div>
          <button class="save_btn">Save</button>
          <button class="cancle_btn">Cancle</button>
          </div>`;

        originalCard.replaceWith(editCard)


     }

    //  delete btn
       if(e.target.classList.contains('delete_btn')){
         const btn = e.target;
         const originalCard = btn.parentElement.parentElement;
         const index = btn.parentElement.parentElement.dataset.index;
         const items = getlocalstorage();
         console.log(items);

         console.log(index)
         items.pop(index);
          
         console.log(items);

         localStorage.setItem("items", JSON.stringify(items));

         originalCard.remove();
        
     }

    //  save btn
     if(e.target.classList.contains('save_btn')){
        let items = getlocalstorage();
        // console.log(items)
         const btn = e.target;
         const originalCard = btn.parentElement.parentElement;
         const index = btn.parentElement.parentElement.dataset.index;
         
         const newdesc  = originalCard.querySelector('.desc').value;
         const newAmount = originalCard.querySelector('.amount').value;
         const date = getFormatedTime();
        
         items[index].date = date;
         items[index].desc = newdesc;
         items[index].amt = newAmount;
         items[index].edited = true;

         localStorage.setItem("items", JSON.stringify(items));
         window.location.reload();

        
     }
     if(e.target.classList.contains('cancle_btn')){
         window.location.reload();
     }
    })
}

modifyValue();