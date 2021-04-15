const modal = {
  open() {
    document.querySelector('.modal-overlay')
    .classList.add('active')
    
    
  },
  close() {
    document.querySelector('.modal-overlay')
    .classList.remove('active')
  }
}


const Storage ={
  get(){
    return JSON.parse(localStorage.getItem('dev.finances:transaction')) ||[]
  },
  set(Transaction){
    localStorage.setItem('dev.finances:transaction',JSON.stringify(Transaction))
  }
}


const Transaction = {
  all: Storage.get(),
  add(transaction) {
    Transaction.all.push(transaction)

    App.reload()
  },
  remove(index) {
    Transaction.all.splice(index, 1)
    App.reload()
  },
  incomes() {
    let income = 0;
    //somar as entradas
    //para cada transacao
    Transaction.all.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount
      }
    })
    return income;

  },
  expenses() {
    let expense = 0;

    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expense += transaction.amount
      }
    })
    return expense;
  },
  total() {
    return Transaction.incomes() + Transaction.expenses()

  }
}



const dom = {
  transactionContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index) {
    
    const tr = document.createElement('tr')
    tr.innerHTML = dom.innerHTMLTransaction(transaction,index)
    tr.dataset.index = index

    dom.transactionContainer.appendChild(tr)

  },

  innerHTMLTransaction(transaction,index) {
    const cssClass = transaction.amount > 0 ? "income" : 'expense'
    const amount = Utils.formatCurrency(transaction.amount)

    const html = `
            <td class="description">${transaction.description}</td>
            <td class=${cssClass}>${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
              <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="remover transaçao">
            </td>
     `
    return html
  },

  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
  },


  clearTransactions() {
    dom.transactionContainer.innerHTML = ''
  }
}

const Utils = {
  formatAmount(value){
      value = Number(value) * 100
      return value
  },

  formatDate(date){
    const splittedDate = date.split('-')
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]} `

  },
  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : ''

    value = String(value).replace(/\D/g, '')

    value = Number(value) / 100
    value = value.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL'
    })
    return signal + value
  }
}
const Form = {
  description: document.querySelector('#description'),
  amount: document.querySelector('#amount'),
  date: document.querySelector('#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },
  validadeField() {
    //validar os campos
    const { description, amount, date } = Form.getValues()
    if (description.trim() === '' ||
      amount.trim() === '' ||
      date.trim() === '') {
      throw new Error('Por favor,preencha todos os campos')
    }

  },

  formatValues(){
    let { description, amount, date } = Form.getValues()
    amount = Utils.formatAmount(amount)
    date = Utils.formatDate(date)
    return{
      description,
      amount,
      date
    }

  },
  clearFields(){
    Form.description.value = ''
    Form.amount.value = ''
    Form.date.value = ''

  },



  submit(event) {
    event.preventDefault()


    try {
      Form.validadeField()
      const transaction = Form.formatValues()
      Transaction.add(transaction)
      Form.clearFields()
      modal.close()

    } catch (error) {
      alert(error.message)
    }




  }
}


const App = {
  init() {

    Transaction.all.forEach((transaction,index )=> {
      dom.addTransaction(transaction,index)
    })

    dom.updateBalance()
    Storage.set(Transaction.all)
  },
  reload() {
    dom.clearTransactions()
    App.init()
  }
}



App.init()
