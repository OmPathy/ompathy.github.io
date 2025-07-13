document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('myButton');

    if (button) {
        button.addEventListener('click', () => {
            alert('Button clicked! Welcome to JavaScript!');
            // You can add more complex JavaScript logic here
        });
    }
});
