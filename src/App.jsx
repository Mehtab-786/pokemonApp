import { useState } from "react";
import { useEffect } from "react";

export default function App() {
  let [allPokemon, setAllPokemon] = useState([]);
  let [search, setSearch] = useState("");
  let [selected, setSelected] = useState('All');
  let [filteredlist, setFilteredlist] = useState([])


  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=150")
      .then((raw) => {
        if (raw.ok) return raw.json();
        else throw new Error("Data not found ");
      })
      .then((data) => {
        const detailsFetched = data.results.map((pokemon) =>
          fetch(pokemon.url).then((raw) => raw.json())
        );

        Promise.all(detailsFetched).then((allDetails) => {
          const finalData = allDetails.map((item) => ({
            id: item.id,
            name: item.name,
            image: item.sprites.front_default,
            types: item.types.map((poke) => poke.type.name),
          }));
          setAllPokemon(finalData);
          setFilteredlist(finalData)
        });
      });
    }, []);


  function filter() {
      let filtered = allPokemon.filter((value) => {
        let nameMatch = value.name.toLowerCase().includes(search.toLowerCase())
        let typeMatch = selected === 'All' || value.types.includes(selected.toLowerCase());

        return nameMatch && typeMatch
      })
      setFilteredlist(filtered)
  }
  

  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Pokémon List</h1>
        <p className="text-gray-600 mt-2">Explore among 150 Pokémon!</p>
      </header>

      <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
  <input
    type="text"
    placeholder="Type Pokémon name..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
  />

  <select
    value={selected}
    onChange={(e) => setSelected(e.target.value)}
    className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    <option value="All">All</option>
    <option value="Fire">Fire</option>
    <option value="Grass">Grass</option>
    <option value="Flying">Flying</option>
    <option value="Water">Water</option>
    <option value="Poison">Poison</option>
    <option value="Bug">Bug</option>
    <option value="Ghost">Ghost</option>
    <option value="psychic">psychic</option>
    <option value="ice">ice</option>
  </select>

  <button
    onClick={filter}
    className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
  >
    Search
  </button>
</div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredlist.length > 0 &&
          filteredlist.map((data, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              {/* ✅ Added: Pokémon Image */}
              <img
                src={data.image}
                alt={data.name}
                className="w-24 h-24 mx-auto mb-2"
              />
              {/* ✅ Modified: Show Name */}
              <h2 className="text-lg font-semibold text-gray-800 capitalize">
                #{data.id} {data.name}
              </h2>
              {/* ✅ Added: Show Types */}
              <p className="text-sm text-gray-600">
                Types: {data.types.join(", ")}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
