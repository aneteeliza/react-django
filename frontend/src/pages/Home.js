import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  // States to hold the search terms and the results
  const [nameSearch, setNameSearch] = useState('');
  const [pakapeSearch, setPakapeSearch] = useState('');
  const [people, setPeople] = useState([]);

  // Fetch data from the backend API using Axios
  const fetchPeople = async () => {
    try {
      console.log('Fetching data with:', nameSearch, pakapeSearch); // Debug log
      
      // Add query parameters to the request URL
      const response = await axios.get(
        `http://localhost:8000/search/`, // Assuming you have a search endpoint
        {
          params: {
            name: nameSearch,  // Send the name search term as a query parameter
            pakape: pakapeSearch  // Send the pakape search term as a query parameter
          }
        }
      );
      
      setPeople(response.data); // Set people state with response data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  // Handle search input changes for name and pakape
  const handleNameSearch = (event) => setNameSearch(event.target.value);
  const handlePakapeSearch = (event) => setPakapeSearch(event.target.value);

  // Fetch data whenever the search term changes
  useEffect(() => {
    if (nameSearch || pakapeSearch) {
      fetchPeople();
    } else {
      setPeople([]); // Clear results if no search
    }
  }, [nameSearch, pakapeSearch]);

  return (
    <div className="search">
      <h2>Meklēšana</h2>

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
          <li>No results found</li>
        )}
      </ul>
    </div>
  );
}






// import React, { useState } from 'react';

// export default function Home() {
//   // States to hold the search terms
//   const [nameSearch, setNameSearch] = useState('');
//   const [birthdateSearch, setBirthdateSearch] = useState('');

//   // Sample data with name, surname, and birthdate
//   const people = [
//     { name: 'Anna', surname: 'Kalniņa', birthdate: '1990-01-15' },
//     { name: 'Solveiga', surname: 'Bērziņa', birthdate: '1991-01-15' },
//     { name: 'Anita', surname: 'Bērziņa', birthdate: '1991-01-15' },
//     { name: 'Karīna', surname: 'Jansone', birthdate: '1991-01-15' },
//     { name: 'Jānis', surname: 'Bērziņš', birthdate: '1990-01-15' },
//     { name: 'Agnes', surname: 'Lapiņa', birthdate: '1985-05-22' },
//     { name: 'Pēteris', surname: 'Ziedonis', birthdate: '1980-11-30' },
//     { name: 'Juris', surname: 'Davis', birthdate: '1975-03-09' },
//     { name: 'Edgars', surname: 'Miller', birthdate: '2000-07-19' },
//     { name: 'Kristīna', surname: 'Bērziņa', birthdate: '1992-02-10' },
//     { name: 'Cilija', surname: 'Rudzīte', birthdate: '1995-12-25' }
// ];


//   // Handle search input changes
//   const handleNameSearch = (event) => setNameSearch(event.target.value);
//   const handleBirthdateSearch = (event) => setBirthdateSearch(event.target.value);

//   // Filter people based on the name and surname combined search and birthdate
//   const filteredPeople = people.filter((person) => {
//     const fullName = (person.name + ' ' + person.surname).toLowerCase();

//     // Check if name or surname matches the combined search term
//     const isNameMatch = nameSearch ? fullName.includes(nameSearch.toLowerCase()) : true;
    
//     // Extract the year from the birthdate
//     const birthYear = person.birthdate.split('-')[0];

//     // Check if the birthdate includes the search term (allowing partial year search)
//     const isBirthdateMatch = birthdateSearch
//       ? birthYear.includes(birthdateSearch) || person.birthdate.includes(birthdateSearch)
//       : true; 

//     return isNameMatch && isBirthdateMatch;
//   });

//   // Don't display results unless there's input in either of the fields
//   const showResults = nameSearch || birthdateSearch;

//   return (
//     <div className="search">
//       <h2>Meklēšana</h2>

//       {/* Search for Name and Surname (Combined) */}
//       <input
//         type="text"
//         id="nameSearch"
//         value={nameSearch}
//         onChange={handleNameSearch}
//         placeholder="Meklēt pēc vārda un/vai uzvārda"
//         title="Ieraksti vārdu un/vai uzvārdu"
//       />

//       {/* Search for Birthdate */}
//       <input
//         type="text"
//         id="birthdateSearch"
//         value={birthdateSearch}
//         onChange={handleBirthdateSearch}
//         placeholder="Meklēt pēc dzimšanas datiem (YYYY-MM-DD)"
//         title="Ieraksti dzimšanas datus"
//       />

//       {showResults && (
//         <ul id="myUL">
//           {filteredPeople.length > 0 ? (
//             filteredPeople.map((person, index) => (
//               <li key={index}>
//                 <span>{person.name} {person.surname} - {person.birthdate}</span>
//               </li>
//             ))
//           ) : (
//             <li>No results found</li>
//           )}
//         </ul>
//       )}
//     </div>
//   );
// }
