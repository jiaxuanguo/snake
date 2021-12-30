const button = document.querySelector('#start')

const direction$ = rxjs.fromEvent(document, 'keydown').subscribe(i => console.log(i))
const start$ = rxjs.fromEvent(button, 'click').subscribe(i => console.log(i))
