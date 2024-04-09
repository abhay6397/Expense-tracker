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
// getFormatedTime();
document.getElementById('check').addEventListener('click', (e) => {
    // e.preventDefault()
    let desc = document.querySelector('#desc').value;
    let select = document.querySelector('#select').value;
    let amt = document.querySelector('#value').value;

    if (desc.length > 0 && amt.length > 0) {
        addInfo(desc, select, amt);
        resetform()
    }
})
function addInfo(desc, select, amt) {
    const date = getFormatedTime();
    var card = ` <div class="card">
            <h3>${desc}</h3>
            <p>${date}</p>
            <h2>${select}$${seprator(amt)}</h2>`;
    // totalbalance();
    // colorchange(); 
    const container = document.querySelector('.card-container');
    container.insertAdjacentHTML("afterBegin", card);
    setLocalstorage(desc, date, amt, select)
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
function setLocalstorage(desc, date, amt, select) {
    let items = getlocalstorage();
    // let items = JSON.parse(localStorage.getItem('items') || '[]');

    items.push({ desc, date, amt, select })

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
    document.querySelector('.income h1').innerText = `$${totalIncome}`;
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
    document.querySelector('.expenses h1').innerText = `$${totalExpenses}`;
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
    totalamt.innerText = total;
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
    document.querySelector('#select').value = "+";
    document.querySelector('#value').value = "";
}

function showlsdata() {
    const items = getlocalstorage();
    items.forEach(val => {
        var card = ` <div class="card">
    <h3>${val.desc}</h3>
    <p>${val.date}</p>
    <h2>${val.select}$${seprator(val.amt)}</h2>`;
        const container = document.querySelector('.card-container');
        container.insertAdjacentHTML("afterBegin", card);
    });
}
showlsdata();

document.querySelector('#delete').addEventListener('click',()=>{
    localStorage.clear();
    window.location.reload();
    
})

function seprator(amount){
    amount = parseInt(amount)
    return amount.toLocaleString();
};

