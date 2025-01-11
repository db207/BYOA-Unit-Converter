function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update icon
    const icon = document.querySelector('.theme-toggle i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// Theme toggle event listener
document.getElementById('themeToggle').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

const conversionRates = {
    // Length conversions
    meters: {
        feet: 3.28084,
        inches: 39.3701,
        miles: 0.000621371,
        nauticalMiles: 0.000539957,
        yards: 1.09361,
        millimeters: 1000,
        kilometers: 0.001
    },
    feet: {
        meters: 0.3048,
        inches: 12,
        miles: 0.000189394,
        nauticalMiles: 0.000164579,
        yards: 0.333333
    },
    inches: {
        meters: 0.0254,
        feet: 0.0833333,
        miles: 1.5783e-5,
        nauticalMiles: 1.3715e-5,
        yards: 0.0277778
    },
    miles: {
        meters: 1609.34,
        feet: 5280,
        inches: 63360,
        nauticalMiles: 0.868976,
        yards: 1760
    },
    nauticalMiles: {
        meters: 1852,
        feet: 6076.12,
        inches: 72913.4,
        miles: 1.15078,
        yards: 2025.37
    },
    yards: {
        meters: 0.9144,
        feet: 3,
        inches: 36,
        miles: 0.000568182,
        nauticalMiles: 0.000493737
    },
    // Weight conversions
    kilograms: {
        pounds: 2.20462,
        ounces: 35.274,
        grams: 1000
    },
    pounds: {
        kilograms: 0.453592,
        ounces: 16,
        grams: 453.592
    },
    ounces: {
        kilograms: 0.0283495,
        pounds: 0.0625,
        grams: 28.3495
    },
    grams: {
        kilograms: 0.001,
        pounds: 0.00220462,
        ounces: 0.035274
    }
};

function updateUnitOptions() {
    const unitTypeToggle = document.getElementById('unitType');
    const unitType = unitTypeToggle.checked ? 'weight' : 'length';
    const fromSelect = document.getElementById('fromUnit');
    const toSelect = document.getElementById('toUnit');
    
    // Show/hide appropriate unit groups
    Array.from(fromSelect.getElementsByTagName('optgroup')).forEach(group => {
        group.style.display = group.label.toLowerCase() === unitType ? '' : 'none';
    });
    
    Array.from(toSelect.getElementsByTagName('optgroup')).forEach(group => {
        group.style.display = group.label.toLowerCase() === unitType ? '' : 'none';
    });
    
    // Select first option from visible group
    const visibleFromOptions = fromSelect.querySelector(`optgroup[label="${unitType.charAt(0).toUpperCase() + unitType.slice(1)}"]`).getElementsByTagName('option');
    const visibleToOptions = toSelect.querySelector(`optgroup[label="${unitType.charAt(0).toUpperCase() + unitType.slice(1)}"]`).getElementsByTagName('option');
    
    if (visibleFromOptions.length > 0) fromSelect.value = visibleFromOptions[0].value;
    if (visibleToOptions.length > 0) toSelect.value = visibleToOptions[0].value;
    
    convert();
}

function showMetricConversions(meters) {
    const metricConversions = document.getElementById('metricConversions');
    const millimeters = meters * 1000;
    const centimeters = meters * 100;
    const kilometers = meters * 0.001;
    
    metricConversions.innerHTML = `
        <div>Also equals:</div>
        <div>${millimeters.toFixed(2)} millimeters</div>
        <div>${centimeters.toFixed(2)} centimeters</div>
        <div>${kilometers.toFixed(4)} kilometers</div>
    `;
}

function convert() {
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    const fromValue = parseFloat(document.getElementById('fromValue').value);
    const metricConversions = document.getElementById('metricConversions');
    const unitTypeToggle = document.getElementById('unitType');
    const isWeightCalculation = unitTypeToggle.checked;
    const resultElement = document.getElementById('result');

    if (isNaN(fromValue)) {
        resultElement.textContent = 'Please enter a valid number';
        resultElement.classList.add('error-message');
        metricConversions.innerHTML = '';
        return;
    }

    resultElement.classList.remove('error-message');
    let result;
    if (fromUnit === toUnit) {
        result = fromValue;
    } else {
        result = fromValue * conversionRates[fromUnit][toUnit];
    }

    resultElement.textContent = 
        `Result: ${fromValue} ${fromUnit} = ${result.toFixed(2)} ${toUnit}`;

    // Only show metric conversions for length calculations
    if (!isWeightCalculation) {
        // Convert to meters first, then show metric conversions
        const metersValue = fromUnit === 'meters' ? 
            fromValue : 
            fromValue * conversionRates[fromUnit]['meters'];
        showMetricConversions(metersValue);
    } else {
        // Clear metric conversions for weight calculations
        metricConversions.innerHTML = '';
    }
}

function handleToggleAnimation() {
    const toggleContainer = document.querySelector('.toggle-container');
    toggleContainer.classList.add('exploding');
    
    // Remove the class after animation completes to allow it to trigger again
    setTimeout(() => {
        toggleContainer.classList.remove('exploding');
    }, 1000);
}

// Add event listeners
document.getElementById('unitType').addEventListener('change', () => {
    handleToggleAnimation();
    updateUnitOptions();
});
document.getElementById('fromUnit').addEventListener('change', convert);
document.getElementById('toUnit').addEventListener('change', convert);
document.getElementById('fromValue').addEventListener('input', convert);

// Initialize the unit options
updateUnitOptions(); 