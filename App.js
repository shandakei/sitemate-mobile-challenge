import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-web';


export default function App() {

  const externalAPI = "https://pokeapi.co/api/v2/pokemon/?limit=1000"

  const [ data, setData ] = useState([])
  const [ searchTerm, setSearchTerm ] = useState("")
  const [ selectedPokemon, setSelectedPokemon ] = useState(null)
  const [ searchQuery, setSearchQuery ] = useState("")

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const res = await fetch(externalAPI);
        const data = await res.json();
        setData(data.results || []); 
      } catch (err) {
        console.error("Error for fetchPokemonList:", err);
        alert("Failed to load Pokémon list. Please try again later.");
      }
    };
  
    fetchPokemonList();
  }, []);
  
  const filteredData = data.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const fetchPokemonDetails = async (name) => {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`);
      const data = await res.json();
      setSelectedPokemon(data); 
    } catch (err) {
      console.error(`Error for fetchPokemonDetails: ${name}:`, err);
      alert(`Failed to load details for ${name}. Please try again.`);
    }
  };
  
  
  
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <StatusBar style="auto" />

      <Image
        source={{ uri: 'https://logos-world.net/wp-content/uploads/2020/07/Pokemon-Logo.jpg' }}
        style={{
          width: 300,      
          height: 100,     
          resizeMode: 'contain', 
          marginVertical: 20, 
        }}
      />

      <Text 
        style={styles.h1} 
        accessible={true} 
        accessibilityLabel='app title'>
          Basic Mobile App Demo
      </Text>
      
      <Text 
        style={styles.h3} 
        accessible={true} 
        accessibilityLabel='pokemon url api list'>
          Pokemon names from externalAPI
      </Text>

      <TextInput 
        style={styles.input}
        accessible={true}
        accessibilityLabel="search input"
        placeholder= "Search Pokemon by name"
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={ () => setSearchQuery(searchTerm) }
      />
            
      <TouchableOpacity style={styles.searchBtn} onPress={() => setSearchQuery(searchTerm)}>
        <Text style={styles.btnText}>Search</Text>
      </TouchableOpacity>

      {searchTerm ? (
        filteredData.length > 0 ? (
        filteredData.map((pokemon, index) => (
          <TouchableOpacity key={index} onPress={() => fetchPokemonDetails(pokemon.name)}>
            <Text style={styles.name}>
              {pokemon.name}
            </Text>
          </TouchableOpacity>
        ))
        ) : (
        <Text style={styles.noResults}>No Pokémon found.</Text>
        )
        ) : (
        <Text style={styles.instructions}>Start typing to search for a Pokémon.</Text>
        )}

      {selectedPokemon ? (
        <ScrollView style={styles.details}>
          <Text style={styles.h2}>Details for {selectedPokemon.name}</Text>
          <Text>ID: {selectedPokemon.id}</Text>
          <Text>Height: {selectedPokemon.height}</Text>
          <Text>Weight: {selectedPokemon.weight}</Text>
          <Text>Types: {selectedPokemon.types.map(data => data.type.name).join(", ")}</Text>
          <Text>Abilities: {selectedPokemon.abilities.map(a => a.ability.name).join(", ")}</Text>
        </ScrollView>
      ) : (
        <Text style={styles.noSearchText}>Select a Pokémon to see details.</Text>
      )}

      <Text style={styles.disclaimer} accessible={true} accessibilityLabel='disclaimer'>
        Pokémon and all associated trademarks and copyrights are the property of The Pokémon Company, Nintendo, Game Freak, and Creatures. This app is not affiliated with or endorsed by The Pokémon Company or its affiliates. All rights reserved.
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'goldenrod',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10
  },
  h3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20
  },
  input: {
    minWidth: 400,
    border: '3px solid black',
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'white',
    color: 'grey',
    marginBottom: 10,
    marginTop: 50
  },
  noSearchText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10
  },
  searchBtn: {
    marginBottom: 20,
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: 'blue',
    backgroundColor: 'yellow',
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'blue',
  },
  disclaimer: {
    marginBottom: 20,
    marginTop: 60,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'grey',
  }
});
