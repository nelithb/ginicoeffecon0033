let chart = null;

function calculateGiniAndLorenz(incomes) {
    incomes.sort((a, b) => a - b);
    
    let n = incomes.length;
    let totalIncome = incomes.reduce((sum, income) => sum + income, 0);
    let cumulativeIncome = 0;
    let giniNumerator = 0;

    let lorenzData = [{x: 0, y: 0}];
    
    for (let i = 0; i < n; i++) {
        giniNumerator += (i + 1) * incomes[i];
        cumulativeIncome += incomes[i];
        lorenzData.push({
            x: ((i + 1) / n) * 100,
            y: (cumulativeIncome / totalIncome) * 100
        });
    }

    let gini = (2 * giniNumerator) / (n * totalIncome) - (n + 1) / n;

    return { gini, lorenzData };
}

function createOrUpdateLorenzCurve(lorenzData, gini) {
    const ctx = document.getElementById('lorenzCurve').getContext('2d');
    
    const chartData = {
        datasets: [{
            label: 'Lorenz Curve',
            data: lorenzData,
            borderColor: 'red',
            fill: false
        }, {
            label: 'Perfect Equality',
            data: [{x: 0, y: 0}, {x: 100, y: 100}],
            borderColor: 'red',
            borderDash: [5, 5],
            fill: false
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        title: {
            display: true,
            text: 'Lorenz Curve'
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Cumulative Share of Population (%)'
                },
                min: 0,
                max: 100
            },
            y: {
                type: 'linear',
                title: {
                    display: true,
                    text: 'Cumulative Share of Income (%)'
                },
                min: 0,
                max: 100
            }
        },
        plugins: {
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'xy'
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'xy',
                }
            }
        }
    };

    if (chart) {
        chart.data = chartData;
        chart.options = chartOptions;
        chart.update();
    } else {
        chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: chartOptions
        });
    }

    document.getElementById('giniCoefficient').textContent = gini.toFixed(4);
}

document.getElementById('incomeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let incomeString = document.getElementById('incomeInput').value;
    
    // Input validation and sanitization
    incomeString = incomeString.replace(/[^0-9,.\s]/g, '');
    let incomes = incomeString.split(',').map(income => {
        let cleanedIncome = parseFloat(income.trim());
        return isNaN(cleanedIncome) || cleanedIncome < 0 ? null : cleanedIncome;
    }).filter(income => income !== null);
    
    if (incomes.length === 0) {
        alert('Please enter valid, positive numbers separated by commas.');
        return;
    }

    let { gini, lorenzData } = calculateGiniAndLorenz(incomes);
    createOrUpdateLorenzCurve(lorenzData, gini);
    
    document.getElementById('results').style.display = 'block';
    document.querySelector('.container').style.height = 'auto';
    document.body.style.height = 'auto';
    document.body.style.alignItems = 'flex-start';
});