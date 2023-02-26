import { useState, useEffect } from 'react'
import { IAnimal } from './models/models'

function useAnimalSearch() {
  const [animals, setAnimals] = useState<IAnimal[]>([]);

  useEffect(() => {
    search(localStorage.getItem('lastQuery') || '');
  }, []);

  const search = async (q: string) => {
    const response = await fetch(`https://anfarm-server.vercel.app/animals?${new URLSearchParams({ q })}`, {method: "GET"});
    const data = await response.json();
    
    setAnimals(data);

    localStorage.setItem('lastQuery', q)
  };

  const reset = async () => {
    const response = await fetch(`https://anfarm-server.vercel.app/animals?`, {method: "POST"});
    const data = await response.json();

    setAnimals(data);

    localStorage.setItem('lastQuery', '')
  }

  return {search, reset, animals}
}

function App() {
  const {search, reset, animals} = useAnimalSearch();

  return (
    <div className='container'>
      <div className='tools'>
        <input type="text" name="" id="" placeholder="Search..." onChange={(e) => search(e.target.value)}/>
        <button onClick={reset}>Reset</button>
      </div>

      <ul>
        {animals.map((animal) => (<Animal key={animal.id} {...animal}/>))}
        {animals.length === 0 && "No animals found"}
      </ul>
    </div>
  )
}

function Animal({type, name, age, img}: IAnimal) {
  return(
    <li>
      <img className='placeholder' src={img} />
      <span><strong>{type}</strong> {name} ({age} years old)</span>
    </li>
  )
}

export default App
