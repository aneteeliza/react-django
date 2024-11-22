import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal'; // Import the Modal component
import Button from 'react-bootstrap/Button'; // Import the Button component for closing the modal
import './styles.css';

export default function Home() {
  const [nameSearch, setNameSearch] = useState('');
  const [birthdateSearch, setBirthdateSearch] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState('kritusie');
  const [people, setPeople] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedDatabaseName, setSelectedDatabaseName] = useState('Kritušie un bez vēsts pazudušie leģionāri');
  

  const databaseEndpoints = {
    brigade: 'http://localhost:8000/brigade/',
    zedelgema: 'http://127.0.0.1:8000/zedelgema/',
    mobilizetie: 'http://127.0.0.1:8000/mobilizetie/',
    kritusie: 'http://127.0.0.1:8000/kritusie/',
  };

  const databaseNames = {
    brigade: '2.brigādes apbalvotie',
    zedelgema: 'Zedelgemas karagūstekņu nometnē ieslodzītie',
    mobilizetie: 'Latviešu leģionā mobilizētie',
    kritusie: 'Kritušie un bez vēsts pazudušie leģionāri',
  };

  const isBirthdateSearchEnabled = selectedDatabase === 'mobilizetie' || selectedDatabase === 'zedelgema';

  const fetchPeople = async () => {
    try {
      const endpoint = databaseEndpoints[selectedDatabase] || databaseEndpoints.brigade;
      const searchTerms = nameSearch.trim().toLowerCase().split(/\s+/);
      
      const reformattedQueries = [
        searchTerms.join(' '),
        searchTerms.reverse().join(' '),
      ];

      let params = { name: reformattedQueries[0] };
      if (isBirthdateSearchEnabled && birthdateSearch.trim() !== '') {
        params.dzimsanas_datums = birthdateSearch.trim();
      }

      let results = [];
      for (const query of reformattedQueries) {
        params.name = query;
        const response = await axios.get(endpoint, { params });
        results = results.concat(response.data);
      }

      const filteredPeople = results.filter((person) => {
        const combinedName = [
          person.vards_uzvards || '',
          person.vards || '',
          person.uzvards || '',
          person.uzvards_un_vards || ''
        ].join(' ').toLowerCase().trim();
  
        const allTermsMatch = searchTerms.every((term) => combinedName.includes(term));
        const birthdateMatch = !isBirthdateSearchEnabled || (birthdateSearch.trim() === '' || person.dzimsanas_datums === birthdateSearch.trim());
        
        return allTermsMatch && birthdateMatch;
      });
  
      setPeople(filteredPeople);
      setIsSearching(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      setPeople([]);
      setIsSearching(true);
    }
  };

  const handleNameSearch = (event) => setNameSearch(event.target.value);
  const handleBirthdateSearch = (event) => setBirthdateSearch(event.target.value);

  const handleDatabaseSelect = (database) => {
    setSelectedDatabase(database);
    setSelectedDatabaseName(databaseNames[database] || 'Izvēlies datu bāzi');
  };

  useEffect(() => {
    if (nameSearch.trim() !== '' || (isBirthdateSearchEnabled && birthdateSearch.trim() !== '')) {
      fetchPeople();
    } else {
      setPeople([]);
      setIsSearching(false);
    }
  }, [nameSearch, birthdateSearch, selectedDatabase]);

  return (
    <div className="search">
      <h2>Meklēšana</h2>

      <Dropdown onSelect={handleDatabaseSelect}>
        <Dropdown.Toggle id="dropdown-basic">
          {selectedDatabaseName}
        </Dropdown.Toggle>

        <Dropdown.Menu id="dropdown-basic-menu">
          <Dropdown.Item eventKey="mobilizetie">Latviešu leģionā mobilizētie</Dropdown.Item>
          <Dropdown.Item eventKey="zedelgema">Zedelgemas karagūstekņu nometnē ieslodzītie</Dropdown.Item>
          <Dropdown.Item eventKey="kritusie">Kritušie un bez vēsts pazudušie leģionāri</Dropdown.Item>
          <Dropdown.Item eventKey="brigade">2.brigādes apbalvotie</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <input
        type="text"
        id="nameSearch"
        value={nameSearch}
        onChange={handleNameSearch}
        placeholder="Meklēt pēc vārda un/vai uzvārda"
        title="Ieraksti vārdu un/vārdu"
      />

      {isBirthdateSearchEnabled && (
        <input
          type="text"
          id="birthdateSearch"
          value={birthdateSearch}
          onChange={handleBirthdateSearch}
          placeholder="Meklēt pēc dzimšanas datuma YYYY-MM-DD"
          title="Ieraksti dzimšanas datumu"
        />
      )}

      {isSearching && people.length === 0 && (
        <p>No results found for "{nameSearch}".</p>
      )}
      {isSearching && people.length > 0 && (
        <ul id="myUL">
          {people.map((person, index) => (
            <li
              key={index}
              onClick={() => {
                setSelectedPerson(person);
                setShowModal(true); // Show the modal when a person is selected
              }}
            >
              <span>{person.vards_uzvards} {person.uzvards} {person.vards} {person.uzvards_un_vards} {person.dzimsanas_datums}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Modal for detailed view */}
      <Modal show={selectedPerson !== null} onHide={() => setSelectedPerson(null)}>
  <Modal.Header closeButton>
    <Modal.Title>
      Informācija par <strong>{selectedPerson?.vards} {selectedPerson?.uzvards} {selectedPerson?.vards_uzvards} {selectedPerson?.uzvards_un_vards}</strong>
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
  {selectedDatabase === 'brigade' ? (
    <>
      <p><strong>Uzvārds un Vārds:</strong> {selectedPerson?.uzvards_un_vards || 'Nav minētas'}</p>
      <p><strong>Pakāpe:</strong> {selectedPerson?.pakape || 'Nav minētas'}</p>
      <p><strong>Dienesta vienība:</strong> {selectedPerson?.dienesta_vieniba || 'Nav minētas'}</p>
      <p><strong>Ordenis:</strong> {selectedPerson?.ordenis || 'Nav minētas'}</p>
      <p><strong>Ordeņa pakāpe:</strong> {selectedPerson?.ordeņa_pakape || 'Nav minētas'}</p>
      <p><strong>Piezīmes:</strong> {selectedPerson?.piezimes || 'Nav minētas'}</p>
      <p><strong>Arhīva lieta:</strong> {selectedPerson?.arhīva_lieta || 'Nav minētas'}</p>
    </>
  ) : selectedDatabase === 'mobilizetie' ? (
    <>
      <p><strong>Uzvārds:</strong> {selectedPerson?.uzvards || 'Nav minētas'}</p>
      <p><strong>Vārds:</strong> {selectedPerson?.vards || 'Nav minētas'}</p>
      <p><strong>Dzimsanas datums:</strong> {selectedPerson?.dzimsanas_datums || 'Nav minētas'}</p>
    </>
  ) : selectedDatabase === 'kritusie' ? (
    <>
      <p><strong>Vārds un Uzvārds:</strong> {selectedPerson?.vards_uzvards || 'Nav minētas'}</p>
      <p><strong>Dienesta pakāpe:</strong> {selectedPerson?.dienesta_pakape || 'Nav minētas'}</p>
      <p><strong>Vienība:</strong> {selectedPerson?.vieniba || 'Nav minētas'}</p>
      <p><strong>Kritis un miris no ievainojuma un kad:</strong> {selectedPerson?.kritis_un_miris_no_ievainojuma_un_kad || 'Nav minētas'}</p>
      <p><strong>Apbedīšanas vieta:</strong> {selectedPerson?.apbedisanas_vieta || 'Nav minētas'}</p>
      <p><strong>Piezīmes:</strong> {selectedPerson?.piezimes || 'Nav minētas'}</p>
    </>
  ) : selectedDatabase === 'zedelgema' ? (
    <>
      <p><strong>Uzvārds:</strong> {selectedPerson?.uzvards || 'Nav minētas'}</p>
      <p><strong>Vārds:</strong> {selectedPerson?.vards || 'Nav minētas'}</p>
      <p><strong>Dzimsanas datums:</strong> {selectedPerson?.dzimsanas_datums || 'Nav minētas'}</p>
      <p><strong>Dienesta pakāpe:</strong> {selectedPerson?.dienesta_pakape || 'Nav minētas'}</p>
      <p><strong>Dienesta vienība:</strong> {selectedPerson?.dienesta_vieniba || 'Nav minētas'}</p>
      <p><strong>Nometnes nodalījums:</strong> {selectedPerson?.nometnes_nodalijums || 'Nav minētas'}</p>
      <p><strong>Aizbraucis uz PSRS:</strong> {selectedPerson?.aizbraucis_uz_psrs || 'Nav minētas'}</p>
      <p><strong>Nāve:</strong> {selectedPerson?.miris || 'Nav minētas'}</p>
      <p><strong>Piezīmes:</strong> {selectedPerson?.piezimes || 'Nav minētas'}</p>
    </>
  ) : (
    <p>No database selected</p>
  )}
</Modal.Body>

  <Modal.Footer>
    <Button variant="secondary" onClick={() => setSelectedPerson(null)}>
      Aizvērt
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
}


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Dropdown from 'react-bootstrap/Dropdown';
// import './styles.css';

// export default function Home() {
//   const [nameSearch, setNameSearch] = useState('');
//   const [birthdateSearch, setBirthdateSearch] = useState(''); // New state for birthdate
//   const [selectedDatabase, setSelectedDatabase] = useState('kritusie'); // Default to 'kritusie'
//   const [people, setPeople] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [selectedPerson, setSelectedPerson] = useState(null);
//   const [selectedDatabaseName, setSelectedDatabaseName] = useState('Kritušie un bez vēsts pazudušie leģionāri'); // Display name of the default database

//   // Define the API endpoints for each database
//   const databaseEndpoints = {
//     brigade: 'http://localhost:8000/brigade/',
//     zedelgema: 'http://127.0.0.1:8000/zedelgema/',
//     mobilizetie: 'http://127.0.0.1:8000/mobilizetie/',
//     kritusie: 'http://127.0.0.1:8000/kritusie/',
//   };

//   // Mapping of event keys to user-friendly names
//   const databaseNames = {
//     brigade: '2.brigādes apbalvotie',
//     zedelgema: 'Zedelgemas karagūstekņu nometnē ieslodzītie',
//     mobilizetie: 'Latviešu leģionā mobilizētie',
//     kritusie: 'Kritušie un bez vēsts pazudušie leģionāri',
//   };

//   // Check if birthdate search should be enabled
//   const isBirthdateSearchEnabled = selectedDatabase === 'mobilizetie' || selectedDatabase === 'zedelgema';

//   // Fetch data from the backend API using Axios
//   const fetchPeople = async () => {
//     try {
//       console.log('Fetching data with:', nameSearch, birthdateSearch, selectedDatabase);
  
//       // Get the correct endpoint for the selected database
//       const endpoint = databaseEndpoints[selectedDatabase] || databaseEndpoints.brigade;
  
//       // Trim and lower case the search input, then split by spaces
//       const searchTerms = nameSearch.trim().toLowerCase().split(/\s+/);
      
//       // Generate multiple formats to search: "Jānis Lerhs" and "Lerhs Jānis"
//       const reformattedQueries = [
//         searchTerms.join(' '),                // Original input
//         searchTerms.reverse().join(' ')       // Reversed input
//       ];

//       // Prepare parameters for the backend request
//       let params = { name: reformattedQueries[0] };

//       // Include birthdate in parameters if applicable
//       if (isBirthdateSearchEnabled && birthdateSearch.trim() !== '') {
//         params.dzimsanas_datums = birthdateSearch.trim();
//       }

//       // Fetch data from the backend
//       let results = [];
//       for (const query of reformattedQueries) {
//         params.name = query;
//         const response = await axios.get(endpoint, { params });
//         results = results.concat(response.data);
//       }
  
//       // Log to see if multiple formats return data
//       console.log('API response:', results);
  
//       // Combine and filter results in the frontend
//       const filteredPeople = results.filter((person) => {
//         const combinedName = [
//           person.vards_uzvards || '',
//           person.vards || '',
//           person.uzvards || '',
//           person.uzvards_un_vards || ''
//         ].join(' ').toLowerCase().trim();
  
//         const allTermsMatch = searchTerms.every((term) => combinedName.includes(term));

//         // If birthdate search is enabled, match the birthdate as well
//         const birthdateMatch = !isBirthdateSearchEnabled || (birthdateSearch.trim() === '' || person.dzimsanas_datums === birthdateSearch.trim());
        
//         return allTermsMatch && birthdateMatch;
//       });
  
//       console.log('Filtered results:', filteredPeople);
//       setPeople(filteredPeople);
//       setIsSearching(true);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setPeople([]);
//       setIsSearching(true);
//     }
//   };

//   // Handle search input changes
//   const handleNameSearch = (event) => setNameSearch(event.target.value);
//   const handleBirthdateSearch = (event) => setBirthdateSearch(event.target.value);

//   // Handle database selection change
//   const handleDatabaseSelect = (database) => {
//     setSelectedDatabase(database);
//     setSelectedDatabaseName(databaseNames[database] || 'Izvēlies datu bāzi');
//   };

//   // Fetch data whenever the search term or database changes
//   useEffect(() => {
//     // Fetch data when a valid nameSearch term is entered, or the selectedDatabase changes
//     if (nameSearch.trim() !== '' || (isBirthdateSearchEnabled && birthdateSearch.trim() !== '')) {
//       fetchPeople();
//     } else {
//       setPeople([]); // Clear results if nameSearch is empty
//       setIsSearching(false); // Reset search attempt indicator
//     }
//   }, [nameSearch, birthdateSearch, selectedDatabase]); // Depend on nameSearch, birthdateSearch, and selectedDatabase

//   return (
//     <div className="search">
//       <h2>Meklēšana</h2>

//       <Dropdown onSelect={handleDatabaseSelect}>
//         <Dropdown.Toggle id="dropdown-basic">
//           {selectedDatabaseName} {/* Display the selected database name */}
//         </Dropdown.Toggle>

//         <Dropdown.Menu id="dropdown-basic-menu">
//           <Dropdown.Item eventKey="mobilizetie">Latviešu leģionā mobilizētie</Dropdown.Item>
//           <Dropdown.Item eventKey="zedelgema">Zedelgemas karagūstekņu nometnē ieslodzītie</Dropdown.Item>
//           <Dropdown.Item eventKey="kritusie">Kritušie un bez vēsts pazudušie leģionāri</Dropdown.Item>
//           <Dropdown.Item eventKey="brigade">2.brigādes apbalvotie</Dropdown.Item>
//         </Dropdown.Menu>
//       </Dropdown>

//       {/* Search for Name */}
//       <input
//         type="text"
//         id="nameSearch"
//         value={nameSearch}
//         onChange={handleNameSearch}
//         placeholder="Meklēt pēc vārda un/vai uzvārda"
//         title="Ieraksti vārdu un/vai uzvārdu"
//       />

//       {/* Conditionally render birthdate search field */}
//       {isBirthdateSearchEnabled && (
//         <input
//           type="text"
//           id="birthdateSearch"
//           value={birthdateSearch}
//           onChange={handleBirthdateSearch}
//           placeholder="Meklēt pēc dzimšanas datuma"
//           title="Ieraksti dzimšanas datumu"
//         />
//       )}

//       {/* Display filtered results */}
//       {/* <ul id="myUL">
//         {people.length > 0 ? (
//           people.map((person, index) => (
//             <li key={index}>
//               <span>{person.vards_uzvards} {person.uzvards} {person.vards} {person.uzvards_un_vards} {person.dzimsanas_datums}</span><br />
//             </li>
//           ))
//         ) : (
//           isSearching && <li>No results found</li>
//         )}
//       </ul> */}

//       {/* People list */}
//       {isSearching && people.length === 0 && (
//         <p>No results found for "{nameSearch}".</p>
//       )}
//       {isSearching && people.length > 0 && (
//         <ul id="myUL">
//           {people.map((person, index) => (
//             <li
//               key={index}
//               onClick={() => {
//                 setSelectedPerson(person);
//                 console.log('Selected person:', person);  // Debugging selection
//               }}
//             >
//               {/* <span>
//                 {person.vards_uzvards || `${person.vards} ${person.uzvards}` || person.uzvards_un_vards} {person.dzimsanas_datums}
//               </span> */}
//               <span>{person.vards_uzvards} {person.uzvards} {person.vards} {person.uzvards_un_vards} {person.dzimsanas_datums}</span>
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* Detailed person view */}
//       {selectedPerson && (
//         <div className="person-details">
//           <h3>Informācija par {selectedPerson.vards} {selectedPerson.uzvards} {selectedPerson.vards_uzvards} {selectedPerson.uzvards_un_vards}</h3>
//           <p><strong>Dzimsanas datums:</strong> {selectedPerson.dzimsanas_datums}</p>
//           <p><strong>Dienesta pakāpe:</strong> {selectedPerson.dienesta_pakape}</p>
//           <p><strong>Dienesta vienība:</strong> {selectedPerson.dienesta_vieniba}</p>
//           <p><strong>Nometnes nodalījums:</strong> {selectedPerson.nometnes_nodalijums}</p>
//           <p><strong>Aizbraucis uz PSRS:</strong> {selectedPerson.aizbraucis_uz_psrs ? 'Yes' : 'No'}</p>
//           <p><strong>Miris:</strong> {selectedPerson.miris ? 'Yes' : 'No'}</p>
//           <p><strong>Piezīmes:</strong> {selectedPerson.piezimes || 'None'}</p>
//           <button onClick={() => setSelectedPerson(null)}>Close</button>
//         </div>
//       )}
//     </div>
//   );
// }

//////////////////////////////////////////////////////////////////////

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Dropdown from 'react-bootstrap/Dropdown';
// import './styles.css';

// export default function Home() {
//   const [nameSearch, setNameSearch] = useState('');
//   const [selectedDatabase, setSelectedDatabase] = useState('kritusie'); // Default to 'kritusie'
//   const [people, setPeople] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [selectedDatabaseName, setSelectedDatabaseName] = useState('Kritušie un bez vēsts pazudušie leģionāri'); // Display name of the default database

//   // Define the API endpoints for each database
//   const databaseEndpoints = {
//     brigade: 'http://localhost:8000/brigade/',
//     zedelgema: 'http://127.0.0.1:8000/zedelgema/',
//     mobilizetie: 'http://127.0.0.1:8000/mobilizetie/',
//     kritusie: 'http://127.0.0.1:8000/kritusie/',
//   };

//   // Mapping of event keys to user-friendly names
//   const databaseNames = {
//     brigade: '2.brigādes apbalvotie',
//     zedelgema: 'Zedelgemas karagūstekņu nometnē ieslodzītie',
//     mobilizetie: 'Latviešu leģionā mobilizētie',
//     kritusie: 'Kritušie un bez vēsts pazudušie leģionāri',
//   };

//   // Fetch data from the backend API using Axios
//   const fetchPeople = async () => {
//     try {
//       console.log('Fetching data with:', nameSearch, selectedDatabase);
  
//       // Get the correct endpoint for the selected database
//       const endpoint = databaseEndpoints[selectedDatabase] || databaseEndpoints.brigade;
  
//       // Trim and lower case the search input, then split by spaces
//       const searchTerms = nameSearch.trim().toLowerCase().split(/\s+/);
      
//       // Generate multiple formats to search: "Jānis Lerhs" and "Lerhs Jānis"
//       const reformattedQueries = [
//         searchTerms.join(' '),                // Original input
//         searchTerms.reverse().join(' ')       // Reversed input
//       ];
  
//       // Fetch data from the backend for each query format
//       let results = [];
//       for (const query of reformattedQueries) {
//         const response = await axios.get(endpoint, {
//           params: { name: query },
//         });
//         results = results.concat(response.data);
//       }
  
//       // Log to see if multiple formats return data
//       console.log('API response:', results);
  
//       // Combine and filter results in the frontend
//       const filteredPeople = results.filter((person) => {
//         const combinedName = [
//           person.vards_uzvards || '',
//           person.vards || '',
//           person.uzvards || '',
//           person.uzvards_un_vards || ''
//         ].join(' ').toLowerCase().trim();
  
//         const allTermsMatch = searchTerms.every((term) => combinedName.includes(term));
//         return allTermsMatch;
//       });
  
//       console.log('Filtered results:', filteredPeople);
//       setPeople(filteredPeople);
//       setIsSearching(true);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setPeople([]);
//       setIsSearching(true);
//     }
//   };
  
  
  
  
  

//   // Handle search input changes
//   const handleNameSearch = (event) => setNameSearch(event.target.value);

//   // Handle database selection change
//   const handleDatabaseSelect = (database) => {
//     setSelectedDatabase(database);
//     setSelectedDatabaseName(databaseNames[database] || 'Izvēlies datu bāzi');
//   };

//   // Fetch data whenever the search term or database changes
//   useEffect(() => {
//     // Fetch data when a valid nameSearch term is entered, or the selectedDatabase changes
//     if (nameSearch.trim() !== '') {
//       fetchPeople();
//     } else {
//       setPeople([]); // Clear results if nameSearch is empty
//       setIsSearching(false); // Reset search attempt indicator
//     }
//   }, [nameSearch, selectedDatabase]); // Depend on both nameSearch and selectedDatabase

//   return (
//     <div className="search">
//       <h2>Meklēšana</h2>

//       <Dropdown onSelect={handleDatabaseSelect}>
//         <Dropdown.Toggle id="dropdown-basic">
//           {selectedDatabaseName} {/* Display the selected database name */}
//         </Dropdown.Toggle>

//         <Dropdown.Menu id="dropdown-basic-menu">
//           <Dropdown.Item eventKey="mobilizetie">Latviešu leģionā mobilizētie</Dropdown.Item>
//           <Dropdown.Item eventKey="zedelgema">Zedelgemas karagūstekņu nometnē ieslodzītie</Dropdown.Item>
//           <Dropdown.Item eventKey="kritusie">Kritušie un bez vēsts pazudušie leģionāri</Dropdown.Item>
//           <Dropdown.Item eventKey="brigade">2.brigādes apbalvotie</Dropdown.Item>
//         </Dropdown.Menu>
//       </Dropdown>

//       {/* Search for Name */}
//       <input
//         type="text"
//         id="nameSearch"
//         value={nameSearch}
//         onChange={handleNameSearch}
//         placeholder="Meklēt pēc vārda un/vai uzvārda"
//         title="Ieraksti vārdu un/vai uzvārdu"
//       />

//       {/* Display filtered results */}
// <ul id="myUL">
//   {people.length > 0 ? (
//     people.map((person, index) => (
//       <li key={index}>
//         <span>{person.vards_uzvards} {person.uzvards} {person.vards} {person.uzvards_un_vards}</span><br /> {/* Updated to use 'vards_uzvards' */}
//       </li>
//     ))
//   ) : (
//     isSearching && <li>No results found</li>
//   )}
// </ul>

//     </div>
//   );
// }

////////////////////////////





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Dropdown from 'react-bootstrap/Dropdown';
// import './styles.css';

// export default function Home() {
//   const [nameSearch, setNameSearch] = useState('');
//   const [pakapeSearch, setPakapeSearch] = useState('');
//   const [people, setPeople] = useState([]);
//   const [isSearching, setIsSearching] = useState(false); // Tracks if a search was attempted

//   // Fetch data from the backend API using Axios
//   const fetchPeople = async () => {
//     try {
//       console.log('Fetching data with:', nameSearch, pakapeSearch);
      
//       // Add query parameters to the request URL
//       const response = await axios.get(`http://localhost:8000/search/`, {
//         params: {
//           name: nameSearch,
//           pakape: pakapeSearch,
//         },
//       });

//       setPeople(response.data); // Set people state with response data
//       setIsSearching(true); // Indicate that a search was attempted
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setPeople([]); // Clear people on error
//       setIsSearching(true);
//     }
//   };

//   // Handle search input changes
//   const handleNameSearch = (event) => setNameSearch(event.target.value);
//   const handlePakapeSearch = (event) => setPakapeSearch(event.target.value);

//   // Fetch data whenever the search term changes
//   useEffect(() => {
//     if (nameSearch || pakapeSearch) {
//       fetchPeople();
//     } else {
//       setPeople([]); // Clear results if no search terms
//       setIsSearching(false); // Reset search attempt indicator
//     }
//   }, [nameSearch, pakapeSearch]);

//   return (
//     <div className="search">
//       <h2>Meklēšana</h2>

//       <Dropdown>
//       <Dropdown.Toggle id="dropdown-basic">
//         Izvēlies datu bāzi, kurā meklēt
//       </Dropdown.Toggle>

//       <Dropdown.Menu id="dropdown-basic-menu">
//         <Dropdown.Item href="#/action-1">VISĀS</Dropdown.Item>
//         <Dropdown.Item href="#/action-1">Latviešu leģionā mobilizētie</Dropdown.Item>
//         <Dropdown.Item href="#/action-2">Zedelgemas karagūstekņu nometnē ieslodzītie</Dropdown.Item>
//         <Dropdown.Item href="#/action-3">Kritušo un bez vēsts pazudušo leģionāri</Dropdown.Item>
//         <Dropdown.Item href="#/action-3">2.brigādes apbalvotie</Dropdown.Item>
//       </Dropdown.Menu>
//     </Dropdown>


//       {/* Search for Name and Surname (Combined) */}
//       <input
//         type="text"
//         id="nameSearch"
//         value={nameSearch}
//         onChange={handleNameSearch}
//         placeholder="Meklēt pēc vārda un/vai uzvārda"
//         title="Ieraksti vārdu un/vai uzvārdu"
//       />

//       {/* Search for Pakape (Rank/Position) */}
//       <input
//         type="text"
//         id="pakapeSearch"
//         value={pakapeSearch}
//         onChange={handlePakapeSearch}
//         placeholder="Meklēt pēc pakapes"
//         title="Ieraksti pakapi"
//       />

//       {/* Display filtered results */}
//       <ul id="myUL">
//         {people.length > 0 ? (
//           people.map((person, index) => (
//             <li key={index}>
//               <span>{person.uzvards_un_vards} - {person.pakape}</span>
//             </li>
//           ))
//         ) : (
//           isSearching && <li>No results found</li>
//         )}
//       </ul>
//     </div>
//   );
// }