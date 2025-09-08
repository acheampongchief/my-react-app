import React from 'react';
/*
  writing a program to print numbers from 1 to 32 
  using tailwind css colors to print colors in react app 
  parity are described using the respective colors
  red for prime
  green for even
  blue for odd
*/
const numbers = Array.from({length: 32}, (_, i) => i + 1);

const isPrime = (numbers) => {
  if (numbers < 2) {
    return false;
  }
  else if (numbers === 2) {
    return true;
   }
  else {
    for (let i = 2; i <= Math.sqrt(numbers); i++) {
      if (numbers % i === 0) {
        return false;
      } else {
        return true;
      }
    }
    
  }
}  

const NumList = () => {
  return(
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">Number List with Colors</h1>
      <div className="space-y-2 text-center">
        {numbers.map((numbers) => {
          let colorClass = '';
          if (isPrime(numbers)) {
            colorClass = 'bg-red-500'; // Red for prime numbers
          } else if (numbers % 2 === 0) {
            colorClass = 'bg-green-500'; // Green for even numbers
          } else {
            colorClass = 'bg-blue-500'; // Blue for odd numbers
          }
            return (
            <React.Fragment key={numbers}>
              <span className={`text-lg  font-medium inline-block border px-7 py-7 ${colorClass}`}>
              {numbers}
              </span>
              {(numbers % 7 === 0) && <br />}
            </React.Fragment>
            );
        })}
      </div>
    </div>
  );
}
const addFood = (props) => {
  return (
    <div>
<button>add Food</button>
    </div>
  )
}
const Calories = (props) => {
  return(
    <div>
      <p>Calories</p>
    </div>
  )
}
const Protein = (props) => {
  return (
    <div>
      <p>Protein</p>
    </div>
  )
}
const Fat = (props) => {
  return (
    <div>
      <p>Fat</p>
    </div>
  )
}
const App = () => {
  return (
    <div>
  <NumList />
  <h2 className='text-center text-orange-600 text-3xl font-extrabold'>HOORAY!! HOORAY!! HOORAY!!</h2>
    </div>
  )
}
export default App;
// Successfully written to code to check the parity with numbers
// HOORAY!! HOORAY!! HOORAY!!