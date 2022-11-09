const ctxTwo = document.getElementById('myChartTwo').getContext('2d');
const price = document.querySelectorAll('.price')
const brand = document.querySelectorAll('.brand')
const amount = document.querySelectorAll('.amount')

const allPrice = []
const allBrand = []
const allAmount = []

for (let x = 0; x < amount.length; x++) {
    allPrice.push(price[x]?.innerText)
    allBrand.push(brand[x]?.innerText)
    allAmount.push(Number(amount[x]?.innerText))
}
const myChartTwo = new Chart(ctxTwo, {
    type: 'line',
    data: {
        labels: allBrand,
        datasets: [{
            label: 'Payout',
            data: allPrice,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1
        },
    ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});