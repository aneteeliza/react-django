import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import './styles.css';

export default function Home() {
  const [nameSearch, setNameSearch] = useState('');
  const [pakapeSearch, setPakapeSearch] = useState('');
  const [people, setPeople] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // Tracks if a search was attempted

  // Fetch data from the backend API using Axios
  const fetchPeople = async () => {
    try {
      console.log('Fetching data with:', nameSearch, pakapeSearch);
      
      // Add query parameters to the request URL
      const response = await axios.get(`http://localhost:8000/search/`, {
        params: {
          name: nameSearch,
          pakape: pakapeSearch,
        },
      });

      setPeople(response.data); // Set people state with response data
      setIsSearching(true); // Indicate that a search was attempted
    } catch (error) {
      console.error('Error fetching data:', error);
      setPeople([]); // Clear people on error
      setIsSearching(true);
    }
  };

  // Handle search input changes
  const handleNameSearch = (event) => setNameSearch(event.target.value);
  const handlePakapeSearch = (event) => setPakapeSearch(event.target.value);

  // Fetch data whenever the search term changes
  useEffect(() => {
    if (nameSearch || pakapeSearch) {
      fetchPeople();
    } else {
      setPeople([]); // Clear results if no search terms
      setIsSearching(false); // Reset search attempt indicator
    }
  }, [nameSearch, pakapeSearch]);

  return (
    <div className="search">
      <h2>Meklēšana</h2>

      <Dropdown>
      <Dropdown.Toggle id="dropdown-basic">
        Izvēlies datu bāzi, kurā meklēt
      </Dropdown.Toggle>

      <Dropdown.Menu id="dropdown-basic-menu">
        <Dropdown.Item href="#/action-1">VISĀS</Dropdown.Item>
        <Dropdown.Item href="#/action-1">Latviešu leģionā mobilizētie</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Zedelgemas karagūstekņu nometnē ieslodzītie</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Kritušo un bez vēsts pazudušo leģionāri</Dropdown.Item>
        <Dropdown.Item href="#/action-3">2.brigādes apbalvotie</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>


      {/* Search for Name and Surname (Combined) */}
      <input
        type="text"
        id="nameSearch"
        value={nameSearch}
        onChange={handleNameSearch}
        placeholder="Meklēt pēc vārda un/vai uzvārda"
        title="Ieraksti vārdu un/vai uzvārdu"
      />

      {/* Search for Pakape (Rank/Position) */}
      <input
        type="text"
        id="pakapeSearch"
        value={pakapeSearch}
        onChange={handlePakapeSearch}
        placeholder="Meklēt pēc pakapes"
        title="Ieraksti pakapi"
      />

      {/* Display filtered results */}
      <ul id="myUL">
        {people.length > 0 ? (
          people.map((person, index) => (
            <li key={index}>
              <span>{person.uzvards_un_vards} - {person.pakape}</span>
            </li>
          ))
        ) : (
          isSearching && <li>No results found</li>
        )}
      </ul>
    </div>
  );
}