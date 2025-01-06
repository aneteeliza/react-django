import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal'; 
import Button from 'react-bootstrap/Button'; 
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
  const [showModal, setShowModal] = useState(false); 
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
          error.response ? error.response.data : 'Kaut kas nogāja greizi!'
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
      // Check if any search term is too short (less than 3 characters) 
      if (
        (nameSearch.trim().length > 0 && nameSearch.trim().length < 3) ||
        (dienestaVienibaSearch.trim().length > 0 && dienestaVienibaSearch.trim().length < 3) ||
        (vienibaSearch.trim().length > 0 && vienibaSearch.trim().length < 3)
      ) {
        setPeople([]);
        setIsSearching(false); // no active search
        return;
      }
      // at least one search field has input
      if (
        !nameSearch.trim() &&
        !birthdateSearch.trim() &&
        !dienestaVienibaSearch.trim() &&
        !vienibaSearch.trim()
      ) {
        setPeople([]); // 
        setIsSearching(false); // no active search
        return;
      }
      // Set the appropriate endpoint based on the selected database
      const endpoint = databaseEndpoints[selectedDatabase] || databaseEndpoints.brigade;

      // Split the name search term into individual words and prepare alternative search formats
      const searchTerms = nameSearch.trim().toLowerCase().split(/\s+/);
      const reformattedQueries = [
        searchTerms.join(' '), // Regular order
        searchTerms.reverse().join(' '), // Reverse order
      ];

      let params = { name: reformattedQueries[0] };

      // Add birthdate search term if enabled and entered
      if (isBirthdateSearchEnabled && birthdateSearch.trim() !== '') {
        params.dzimsanas_datums = birthdateSearch.trim();
      }

      // Add specific database filters based on the selected database
      if (selectedDatabase === 'brigade' && dienestaVienibaSearch.trim() !== '') {
        params.dienesta_vieniba = dienestaVienibaSearch.trim();
      } else if (selectedDatabase === 'kritusie' && vienibaSearch.trim() !== '') {
        params.vieniba = vienibaSearch.trim();
      } else if (selectedDatabase === 'zedelgema' && dienestaVienibaSearch.trim() !== '') {
        params.dienesta_vieniba = dienestaVienibaSearch.trim();
      }
  
      let results = [];

      // Loop through the search queries and fetch data from the API
      for (const query of reformattedQueries) {
        params.name = query;
        const response = await axios.get(endpoint, { params });
        results = results.concat(response.data);
      }

       // Remove duplicate entries based on name
      const uniquePeople = new Map();
      results.forEach((person) => {
        const uniqueKey = `${person.uzvards_un_vards || person.vards_uzvards || person.uzvards || ''}-${person.vards || ''}`;
        uniquePeople.set(uniqueKey, person);
      });

      // Filter the results based on the search terms and selected filters
      const filteredPeople = Array.from(uniquePeople.values()).filter((person) => {
        const combinedName = [
          person.vards_uzvards || '',
          person.vards || '',
          person.uzvards || '',
          person.uzvards_un_vards || ''
        ].join(' ').toLowerCase().trim();
        
        // Check if all search terms match the person's name
        const allTermsMatch = searchTerms.every((term) => combinedName.includes(term));

        // Check if the birthdate matches
        const birthdateMatch = !isBirthdateSearchEnabled || 
          (birthdateSearch.trim() === '' || 
          person.dzimsanas_datums.includes(birthdateSearch.trim()));
  
        const dienestaMatch = selectedDatabase === 'brigade' || 'zedelgema' ? 
          (person.dienesta_vieniba || '').toLowerCase().includes(dienestaVienibaSearch.toLowerCase()) : true;
        const vienibaMatch = selectedDatabase === 'kritusie' ? 
          (person.vieniba || '').toLowerCase().includes(vienibaSearch.toLowerCase()) : true;
  
        return allTermsMatch && birthdateMatch && dienestaMatch && vienibaMatch;
      });

      // Latvian alphabet for custom sorting
      const latvianAlphabet = [
        'a', 'ā', 'b', 'c', 'č', 'd', 'e', 'ē', 'f', 'g', 'ģ', 'h', 
        'i', 'ī', 'j', 'k', 'ķ', 'l', 'ļ', 'm', 'n', 'ņ', 'o', 'p', 
        'r', 's', 'š', 't', 'u', 'ū', 'v', 'z', 'ž'
      ];
      
      // Custom sort function for Latvian alphabet
      const latvianSort = (a, b) => {
        const surnameA = (a.uzvards || a.vards_uzvards || a.uzvards_un_vards || '').toLowerCase();
        const surnameB = (b.uzvards || b.vards_uzvards || b.uzvards_un_vards || '').toLowerCase();
      
        // Compare each letter of the surname
        for (let i = 0; i < Math.max(surnameA.length, surnameB.length); i++) {
          const letterA = surnameA[i] || ''; // Default to empty string if one string is shorter
          const letterB = surnameB[i] || '';
      
          // Get index in custom Latvian alphabet
          const indexA = latvianAlphabet.indexOf(letterA);
          const indexB = latvianAlphabet.indexOf(letterB);
      
          // Compare based on indices
          if (indexA !== indexB) {
            return indexA - indexB;
          }
        }
      
        // If surnames are identical, compare first names
        const firstNameA = (a.vards || '').toLowerCase();
        const firstNameB = (b.vards || '').toLowerCase();
      
        for (let i = 0; i < Math.max(firstNameA.length, firstNameB.length); i++) {
          const letterA = firstNameA[i] || '';
          const letterB = firstNameB[i] || '';
      
          const indexA = latvianAlphabet.indexOf(letterA);
          const indexB = latvianAlphabet.indexOf(letterB);
      
          if (indexA !== indexB) {
            return indexA - indexB;
          }
        }
      
        return 0; 
      };
      
      const sortedPeople = filteredPeople.sort(latvianSort);

      setPeople(sortedPeople);
      setIsSearching(true);
    } catch (error) {
      console.error('Kļūda iegūstot datus:', error);
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
        title="Ierakstiet vismaz 3 simbolus, lai meklētu pēc vārda un/vārda"
        style={{
          border: nameSearch.length > 0 && nameSearch.length < 3 ? '1px solid red' :
                  nameSearch.length >= 3 ? '1px solid green' : '1px solid #ccc',
        }}
      />

      {/* Conditional Inputs for Dienesta Vienība and Vienība */}
      {isStaff && selectedDatabase === 'brigade' && (
        <input
          type="text"
          id="dienestaVienibaSearch"
          value={dienestaVienibaSearch}
          onChange={handleDienestaVienibaSearch}
          placeholder="Meklēt pēc dienesta vienības"
          title="Ieraksti vismaz 3 simbolus, lai meklētu pēc dienesta vienības"
          style={{
            border: dienestaVienibaSearch.length > 0 && dienestaVienibaSearch.length < 3 ? '1px solid red' :
            dienestaVienibaSearch.length >= 3 ? '1px solid green' : '1px solid #ccc',
          }}
        />
      )}

      {isStaff && selectedDatabase === 'zedelgema' && (
        <input
          type="text"
          id="dienestaVienibaSearch"
          value={dienestaVienibaSearch}
          onChange={handleDienestaVienibaSearch}
          placeholder="Meklēt pēc dienesta vienības"
          title="Ieraksti vismaz 3 simbolus, lai meklētu pēc dienesta vienības"
          style={{
            border: dienestaVienibaSearch.length > 0 && dienestaVienibaSearch.length < 3 ? '1px solid red' :
            dienestaVienibaSearch.length >= 3 ? '1px solid green' : '1px solid #ccc',
          }}
        />
      )}

      {isStaff && selectedDatabase === 'kritusie' && (
        <input
          type="text"
          id="vienibaSearch"
          value={vienibaSearch}
          onChange={handleVienibaSearch}
          placeholder="Meklēt pēc dienesta vienības"
          title="Ieraksti vismaz 3 simbolus, lai meklētu pēc dienesta vienības"
          style={{
            border: vienibaSearch.length > 0 && vienibaSearch.length < 3 ? '1px solid red' :
            vienibaSearch.length >= 3 ? '1px solid green' : '1px solid #ccc',
          }}
        />
      )}

      {isBirthdateSearchEnabled && (
        <input
          type="text"
          id="birthdateSearch"
          value={birthdateSearch}
          onChange={handleBirthdateSearch}
          placeholder="Meklēt pēc dzimšanas datuma GGGG-MM-DD"
          title="Ieraksti dzimšanas datumu GADS-MĒNESIS-DIENA"
        />
      )}

      

      <Button onClick={fetchPeople} variant="dark" className="searching">
        Meklēt
      </Button>
      <br></br>
      
      <div>
        {people.map((person, index) => (
          <div key={index}>{person.name}</div>
        ))}
      </div>  

      <div>
        {isSearching && people.length > 0 ? (
          <p>Atrastie rezultāti: {people.length}</p>
        ) : isSearching && people.length === 0 ? (
          <p>Netika atrasts neviens rezultāts</p>
        ) : null}
      </div>


      {isSearching && people.length > 0 && (
        <ul id="myUL">
          {people.map((person, index) => (
            <li
              key={index}
              onClick={() => {
                setSelectedPerson(person);
                setShowModal(true); 
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
          <BsArrowUp size={20} />
        </button>
      )}

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
      <p><strong>Dzimšanas vieta:</strong> {selectedPerson?.dzimsanas_vieta || 'Nav minētas'}</p>
      <p><strong>Pēdējā dzīves vieta:</strong> {selectedPerson?.pedeja_dzives_vieta || 'Nav minētas'}</p>
      <p><strong>Mobilizēšanas datums:</strong> {selectedPerson?.mobilizesanas_datums_labots || 'Nav minētas'}</p>
      <p><strong>Pirmā dienesta vienība:</strong> {selectedPerson?.pirmā_dienesta_vieniba_labots || 'Nav minētas'}</p>
      <p><strong>Pirmā dienesta pakāpe:</strong> {selectedPerson?.pirmā_dienesta_pakāpe || 'Nav minētas'}</p>
      {selectedPerson?.kritis_datums && <p><strong>Krišanas datums:</strong> {selectedPerson.kritis_datums}</p>}
      {selectedPerson?.info_par_krisanu && <p><strong>Informācija par krišanu:</strong> {selectedPerson.info_par_krisanu}</p>}
      {selectedPerson?.pazudis_datums && <p><strong>Pazušanas datums:</strong> {selectedPerson.pazudis_datums}</p>}
      {selectedPerson?.info_par_pazusanu && <p><strong>Informācija par pazušanu:</strong> {selectedPerson.info_par_pazusanu}</p>}
      {selectedPerson?.miris_datums && <p><strong>Miršanas datums:</strong> {selectedPerson.miris_datums}</p>}
      {selectedPerson?.info_par_mirsanu && <p><strong>Informācija par miršanu:</strong> {selectedPerson.info_par_mirsanu}</p>}
      {selectedPerson?.dezertējis_datums && <p><strong>Dezertēšanas datums:</strong> {selectedPerson.dezertējis_datums}</p>}
      {selectedPerson?.apbalvots && <p><strong>Apbalvots:</strong> {selectedPerson.apbalvots}</p>}
      {selectedPerson?.paaugstinats_degradets && <p><strong>Paaugstināts vai degradets:</strong> {selectedPerson.paaugstinats_degradets}</p>}
      {selectedPerson?.atbrīvots_no_dienesta_datums && <p><strong>Datums, kad atbrīvots no dienesta:</strong> {selectedPerson.atbrīvots_no_dienesta_datums}</p>}
      {selectedPerson?.atbrivosanas_iemesls && <p><strong>Atbrīvošanas iemesls:</strong> {selectedPerson.atbrivosanas_iemesls}</p>}
      {selectedPerson?.ievainots && <p><strong>Ievainots:</strong> {selectedPerson.ievainots}</p>}
      {selectedPerson?.navessods_arests && <p><strong>Nāvessods vai arests:</strong> {selectedPerson.navessods_arests}</p>}
      {selectedPerson?.cita_informacija && <p><strong>Cita informācija:</strong> {selectedPerson.cita_informacija}</p>}
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
      {selectedPerson?.miris && <p><strong>Miršanas datums:</strong> {selectedPerson.miris}</p>}
      {selectedPerson?.aizbraucis_uz_psrs && <p><strong>Aizbraucis uz PSRS:</strong> {selectedPerson.aizbraucis_uz_psrs}</p>}
      {selectedPerson?.piezimes && <p><strong>Piezīmes:</strong> {selectedPerson.piezimes}</p>}
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