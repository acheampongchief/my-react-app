import React, { useState } from 'react';

const CalorieGoal = () => {
    const [calorieGoal, setCalorieGoal] = useState();
    const handleChange = (event) => {
        setCalorieGoal(event.target.value);
    }
    return(
      <div>
      <label htmlFor="calorieInput">Enter your Calorie Goal:</label>
      <input
        id="calorieInput"
        type="integer"
        value={calorieGoal}
        onChange={handleChange}
        placeholder="Type here..."
      />
        <p>Your Calorie Goal is: {calorieGoal} calories</p>
    </div>
    )
}

const UserName = () => {
    const [userName, setuserName] = useState('');
    const handleChange = (event) => {
        setuserName(event.target.value);
    }
    return(
    <div>
        <label htmlFor="userNameInput">Your Name...</label>
    </div>
    )
}
const Carbs = ({ carbs }) => {
  return (
    <div>   
        <h3>Carbohydrates: {carbs}g</h3>
    </div>
  );
}

const Protein = ({ protein }) => {
  return (
    <div>
        <h3>Protein: {protein}g</h3>
    </div>
  );
}


const Fat = ({ fat }) => {
    return (
        <div>
            <h3>Fat: {fat}g</h3>
        </div>
    );
}

const Calories = ({ calories }) => {
    // Will have to create calorieGoal component and pass it as a prop here
    
    if (calories < calorieGoal) {
        return (
            <>
            <h3>Just a little more to go and we will be right there!</h3>
            <h2 className="text-center">{calorieGoal}</h2>
            </>
        )
    }else if (calories === calorieGoal) {
        //Will also need to create userName name componnt and pass it as prop here as well
        return (
            <>
            <h3>Hooray!!! Welldone!!! {UserName}</h3>
            <h2 className="text-center">{calorieGoal}</h2>
            </>
        )
    }else
        return (
            <>
            <h3>I see you have started the journey to the potBelly. You will meet your Doom in Obesity(city)</h3>
            <h2 className="text-center">{calorieGoal}</h2>
            </>
        )

 
}
export { Carbs, Protein, Fat, Calories };
