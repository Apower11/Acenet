let date = new Date();

let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

console.log(date.getDate().toString() + ' ' + months[date.getUTCMonth()]);