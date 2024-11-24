import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal'; // Import the Modal component
import Button from 'react-bootstrap/Button'; // Import the Button component for closing the modal
import { BsArrowUp } from 'react-icons/bs';
import './styles.css';
import Card from 'react-bootstrap/Card';

export default function Home() {
  const [nameSearch, setNameSearch] = useState('');
  const [birthdateSearch, setBirthdateSearch] = useState('');
  const [selectedDatabase, setSelectedDatabase] = useState('kritusie');
  const [people, setPeople] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  // eslint-disable-next-line
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedDatabaseName, setSelectedDatabaseName] = useState('Kritušie un bez vēsts pazudušie leģionāri');
  const [showTopButton, setShowTopButton] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [profile, setProfile] = useState({ email: '', username: '' });
  const [originalProfile, setOriginalProfile] = useState({ email: '', username: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
const [dienestaVieniba, setDienestaVieniba] = useState('');

  
  const [dienestaVienibaSearch, setDienestaVienibaSearch] = useState('');
  const [vienibaSearch, setVienibaSearch] = useState('');

  const handleDienestaVienibaSearch = (event) => setDienestaVienibaSearch(event.target.value);
  const handleVienibaSearch = (event) => setVienibaSearch(event.target.value);
  
  useEffect(() => {
    // Fetch user profile data when component mounts
    axios
      .get('http://127.0.0.1:8000/user')
      .then(response => {
        const fetchedProfile = {
          email: response.data.user.email,
          username: response.data.user.username,
        };
        setProfile(fetchedProfile);
        setOriginalProfile(fetchedProfile);  // Save the initial profile data
  
        // Check if the user is a staff member and update the state
        setIsStaff(response.data.user.is_staff);  // Assuming the backend provides is_staff field
  
        setLoading(false); // Stop loading after data is fetched
      })
      .catch(error => {
        setError(
          error.response ? error.response.data : 'An error occurred while fetching the data.'
        );
        setLoading(false); // Stop loading on error
      });
  }, []);
  


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
  
      // Include dienesta vieniba or vieniba search based on selected database
      if (selectedDatabase === 'brigade' && dienestaVienibaSearch.trim() !== '') {
        params.dienesta_vieniba = dienestaVienibaSearch.trim();
      } else if (selectedDatabase === 'kritusie' && vienibaSearch.trim() !== '') {
        params.vieniba = vienibaSearch.trim();
      } else if (selectedDatabase === 'zedelgema' && dienestaVienibaSearch.trim() !== '') {
        params.dienesta_vieniba = dienestaVienibaSearch.trim();
      }
  
      let results = [];
      for (const query of reformattedQueries) {
        params.name = query;
        const response = await axios.get(endpoint, { params });
        results = results.concat(response.data);
      }
  
      // Filter out duplicates based on a unique key
      const uniquePeople = new Map();
      results.forEach((person) => {
        const uniqueKey = `${person.uzvards_un_vards || person.vards_uzvards || person.uzvards || ''}-${person.vards || ''}`;
        uniquePeople.set(uniqueKey, person);
      });
  
      const filteredPeople = Array.from(uniquePeople.values()).filter((person) => {
        const combinedName = [
          person.vards_uzvards || '',
          person.vards || '',
          person.uzvards || '',
          person.uzvards_un_vards || ''
        ].join(' ').toLowerCase().trim();
  
        const allTermsMatch = searchTerms.every((term) => combinedName.includes(term));
  
        const birthdateMatch = !isBirthdateSearchEnabled || 
          (birthdateSearch.trim() === '' || 
          person.dzimsanas_datums.includes(birthdateSearch.trim())); // Allows partial date match
  
        // Check for dienesta vieniba or vieniba match
        const dienestaMatch = selectedDatabase === 'brigade' || 'zedelgema' ? 
          (person.dienesta_vieniba || '').toLowerCase().includes(dienestaVienibaSearch.toLowerCase()) : true;
        const vienibaMatch = selectedDatabase === 'kritusie' ? 
          (person.vieniba || '').toLowerCase().includes(vienibaSearch.toLowerCase()) : true;

        return allTermsMatch && birthdateMatch && dienestaMatch && vienibaMatch;
      });
  
      // Sort filteredPeople by surname, then by first name
      const sortedPeople = filteredPeople.sort((a, b) => {
        const surnameA = (a.uzvards || a.vards_uzvards || a.uzvards_un_vards || '').toLowerCase();
        const surnameB = (b.uzvards || b.vards_uzvards || b.uzvards_un_vards || '').toLowerCase();
        if (surnameA < surnameB) return -1;
        if (surnameA > surnameB) return 1;
  
        const firstNameA = (a.vards || '').toLowerCase();
        const firstNameB = (b.vards || '').toLowerCase();
        if (firstNameA < firstNameB) return -1;
        if (firstNameA > firstNameB) return 1;
  
        return 0;
      });
  
      setPeople(sortedPeople);
      setIsSearching(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      setPeople([]);
      setIsSearching(true);
    }
  };
  

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  

  const handleNameSearch = (event) => setNameSearch(event.target.value);
  const handleBirthdateSearch = (event) => setBirthdateSearch(event.target.value);

  const handleDatabaseSelect = (database) => {
    setSelectedDatabase(database);
    setSelectedDatabaseName(databaseNames[database] || 'Izvēlies datu bāzi');
  };

  // useEffect(() => {
  //   // Check if any search field has content before triggering fetchPeople
  //   const isAnySearchTermEntered = 
  //     nameSearch.trim() !== '' || 
  //     (isBirthdateSearchEnabled && birthdateSearch.trim() !== '') || 
  //     dienestaVienibaSearch.trim() !== '' || 
  //     vienibaSearch.trim() !== '';
  
  //   if (isAnySearchTermEntered) {
  //     fetchPeople(); // Fetch results if any search term is entered
  //   } else {
  //     setPeople([]);  // Clear the people array
  //     setIsSearching(false);  // Indicate that no search is being done
  //   }
  //   // eslint-disable-next-line
  // }, [nameSearch, birthdateSearch, dienestaVienibaSearch, vienibaSearch, selectedDatabase]);
  


  useEffect(() => {
    if (nameSearch.trim() !== '' || (isBirthdateSearchEnabled && birthdateSearch.trim() !== '' || 
    dienestaVienibaSearch.trim() !== '' || 
    vienibaSearch.trim() !== '')) {
      fetchPeople();
    } else {
      setPeople([]);
      setIsSearching(false);
    }
    // eslint-disable-next-line
  }, [nameSearch, birthdateSearch, dienestaVienibaSearch, vienibaSearch, selectedDatabase]);

  return (
    <div className="search">
      <Card className="p-4 shadow-lg">
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


      {/* Conditional Inputs for Dienesta Vienība and Vienība */}
      {isStaff && selectedDatabase === 'brigade' && (
        <input
          type="text"
          id="dienestaVienibaSearch"
          value={dienestaVienibaSearch}
          onChange={handleDienestaVienibaSearch}
          placeholder="Meklēt pēc dienesta vienības"
          title="Ieraksti dienesta vienību"
        />
      )}

      {isStaff && selectedDatabase === 'zedelgema' && (
        <input
          type="text"
          id="dienestaVienibaSearch"
          value={dienestaVienibaSearch}
          onChange={handleDienestaVienibaSearch}
          placeholder="Meklēt pēc dienesta vienības"
          title="Ieraksti dienesta vienību"
        />
      )}

      {isStaff && selectedDatabase === 'kritusie' && (
        <input
          type="text"
          id="vienibaSearch"
          value={vienibaSearch}
          onChange={handleVienibaSearch}
          placeholder="Meklēt pēc dienesta vienības"
          title="Ieraksti dienesta vienību"
        />
      )}

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
      </Card>

      {showTopButton && (
        <button className="back-to-top" onClick={scrollToTop}>
          <BsArrowUp size={20} /> {/* Use the icon here */}
        </button>
      )}

      {/* Modal for detailed view */}
      <Modal show={selectedPerson !== null} onHide={() => setSelectedPerson(null)} className="d-flex  align-items-center">
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
    <Button variant="dark" onClick={() => setSelectedPerson(null)}>
      Aizvērt
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
}