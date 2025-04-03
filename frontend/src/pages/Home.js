import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { BsArrowUp } from 'react-icons/bs';
import './styles.css';
import Card from 'react-bootstrap/Card';
import { NetworkProvider } from '../NetworkProvider';

export default function Home() {
  const [nameSearch, setNameSearch] = useState('');
  const [birthdateSearch, setBirthdateSearch] = useState('');
  const [people, setPeople] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  // eslint-disable-next-line
  const [selectedTable, setSelectedTable] = useState(2);
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
    fetchUser()
  }, []);

  const fetchUser = async () => {
    try {
      const response = await NetworkProvider.getUser()
      const fetchedProfile = {
        email: response.data.user.email,
        username: response.data.user.username,
      };
      setProfile(fetchedProfile);
      setOriginalProfile(fetchedProfile);  // Save the initial profile data

      // Check if the user is a staff member and update the state
      setIsStaff(response.data.user.is_staff);  // Assuming the backend provides is_staff field

      setLoading(false); // Stop loading after data is fetched
    } catch (error) {
      setError(
        error.response ? error.response.data : 'Kaut kas nogāja greizi!'
      );
      setLoading(false); // Stop loading on error
    }
  }

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

  const isBirthdateSearchEnabled = selectedTable == 1 || selectedTable == 3;

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

      const results = await NetworkProvider.search(selectedTable, nameSearch, "", birthdateSearch, dienestaVienibaSearch)


      // Latvian alphabet for custom sorting
      const latvianAlphabet = [
        'a', 'ā', 'b', 'c', 'č', 'd', 'e', 'ē', 'f', 'g', 'ģ', 'h',
        'i', 'ī', 'j', 'k', 'ķ', 'l', 'ļ', 'm', 'n', 'ņ', 'o', 'p',
        'r', 's', 'š', 't', 'u', 'ū', 'v', 'z', 'ž'
      ];

      // Custom sort function for Latvian alphabet
      const latvianSort = (a, b) => {
        const surnameA = (a.surname || '').toLowerCase();
        const surnameB = (b.surname || '').toLowerCase();

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
        const firstNameA = (a.name || '').toLowerCase();
        const firstNameB = (b.name || '').toLowerCase();

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

      const sortedPeople = results.sort(latvianSort);
      console.log(sortedPeople);

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

  const handleTableSelect = (eventKey, _) => {
    setSelectedTable(parseInt(eventKey))
  };

  const formatLabel = (key) => {
    return key
      .replace(/_/g, ' ')               // Replace underscores with spaces
      .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize each word
  };

  return (
    <div className="search">
      <Card className="p-4 shadow-lg">
        <h2>Meklēšana</h2>

        <Dropdown onSelect={handleTableSelect}>
          <Dropdown.Toggle id="dropdown-basic">
            {
              (() => {
                switch (selectedTable) {
                  case 0:
                    return "2.brigādes apbalvotie";
                  case 1:
                    return "Latviešu leģionā mobilizētie";
                  case 2:
                    return "Kritušie un bez vēsts pazudušie leģionāri";
                  case 3:
                    return "Zedelgemas karagūstekņu nometnē ieslodzītie";
                  default:
                    return "Izvēlies datubāzi"; // Default fallback
                }
              })()
            }
          </Dropdown.Toggle>

          <Dropdown.Menu id="dropdown-basic-menu">
            <Dropdown.Item eventKey={1}>Latviešu leģionā mobilizētie</Dropdown.Item>
            <Dropdown.Item eventKey={3}>Zedelgemas karagūstekņu nometnē ieslodzītie</Dropdown.Item>
            <Dropdown.Item eventKey={2}>Kritušie un bez vēsts pazudušie leģionāri</Dropdown.Item>
            <Dropdown.Item eventKey={0}>2.brigādes apbalvotie</Dropdown.Item>
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
        {isStaff && selectedTable === 0 && (
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

        {isStaff && selectedTable === 3 && (
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

        {isStaff && selectedTable === 2 && (
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
          {isSearching && people.length > 0 ? (
            <p>Atrastie rezultāti: {people.length}</p>
          ) : isSearching && people.length === 0 ? (
            <p>Netika atrasts neviens rezultāts</p>
          ) : null}
        </div>

        <div>
          <ListGroup>
            {people.map((person, index) => (
              <ListGroup.Item
                key={index}
                action
                onClick={() => {
                  setSelectedPerson(person);
                }}
              >
                {person.name} {person.surname}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
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
          <ListGroup variant="flush">
            {Object.entries(selectedPerson || {}).map(([key, value]) => (
              <ListGroup.Item key={key}>
                <strong>{formatLabel(key)}:</strong> {value || 'Nav minētas'}
              </ListGroup.Item>
            ))}
          </ListGroup>
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