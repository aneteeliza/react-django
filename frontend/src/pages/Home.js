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
import { useTranslation } from 'react-i18next';

export default function Home() {
  const [nameSearch, setNameSearch] = useState('');
  const [birthdateSearch, setBirthdateSearch] = useState('');
  const [people, setPeople] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const [selectedTable, setSelectedTable] = useState(2);
  const [showTopButton, setShowTopButton] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [profile, setProfile] = useState({ email: '', username: '' });
  const [originalProfile, setOriginalProfile] = useState({ email: '', username: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const [dienestaVienibaSearch, setDienestaVienibaSearch] = useState('');
  const [vienibaSearch, setVienibaSearch] = useState('');

  const handleDienestaVienibaSearch = (event) => setDienestaVienibaSearch(event.target.value);
  const handleVienibaSearch = (event) => setVienibaSearch(event.target.value);

  const { t } = useTranslation();

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
        error.response ? error.response.data : t('Kaut kas nogāja greizi')
      );
      setLoading(false); // Stop loading on error
    }
  }

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

  return (
    <div className="search">
      <Card className="p-4 shadow-lg">
        <h2>{t("Meklēšana")}</h2>

        <Dropdown onSelect={handleTableSelect}>
          <Dropdown.Toggle id="dropdown-basic">
            {
              (() => {
                switch (selectedTable) {
                  case 0:
                    return t("2.brigādes apbalvotie");
                  case 1:
                    return t("Latviešu leģionā mobilizētie");
                  case 2:
                    return t("Kritušie un bez vēsts pazudušie leģionāri");
                  case 3:
                    return t("Zedelgemas karagūstekņu nometnē ieslodzītie");
                  default:
                    return t("Izvēlies datubāzi");
                }
              })()
            }
          </Dropdown.Toggle>

          <Dropdown.Menu id="dropdown-basic-menu">
            <Dropdown.Item eventKey={1}>{t("Latviešu leģionā mobilizētie")}</Dropdown.Item>
            <Dropdown.Item eventKey={3}>{t("Zedelgemas karagūstekņu nometnē ieslodzītie")}</Dropdown.Item>
            <Dropdown.Item eventKey={2}>{t("Kritušie un bez vēsts pazudušie leģionāri")}</Dropdown.Item>
            <Dropdown.Item eventKey={0}>{t("2.brigādes apbalvotie")}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <input
          type="text"
          id="nameSearch"
          value={nameSearch}
          onChange={handleNameSearch}
          placeholder={t("Meklēt pēc vārda un/vai uzvārda")}
          title={t("Ierakstiet vismaz 3 simbolus, lai meklētu pēc vārda un/vārda")}
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
            placeholder={t("Meklēt pēc dienesta vienības")}
            title={t("Ieraksti vismaz 3 simbolus, lai meklētu pēc dienesta vienības")}
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
            placeholder={t("Meklēt pēc dienesta vienības")}
            title={t("Ieraksti vismaz 3 simbolus, lai meklētu pēc dienesta vienības")}
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
            placeholder={t("Meklēt pēc dienesta vienības")}
            title={t("Ieraksti vismaz 3 simbolus, lai meklētu pēc dienesta vienības")}
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
            placeholder={t("Meklēt pēc dzimšanas datuma GGGG-MM-DD")}
            title={t("Ieraksti dzimšanas datumu GADS-MĒNESIS-DIENA")}
          />
        )}



        <Button onClick={fetchPeople} variant="dark" className="searching">
          Meklēt
        </Button>
        <br></br>

        <div>
          {isSearching && people.length > 0 ? (
            <p>{t("Atrastie rezultāti")}: {people.length}</p>
          ) : isSearching && people.length === 0 ? (
            <p>{t("Netika atrasts neviens rezultāts")}</p>
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
            {t("Informācija par")} <strong>{selectedPerson?.vards} {selectedPerson?.uzvards} {selectedPerson?.vards_uzvards} {selectedPerson?.uzvards_un_vards}</strong>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            {Object.entries(selectedPerson || {}).map(([key, value]) => (
              <ListGroup.Item key={key}>
                <strong>{t(key)}:</strong> {value || t('Nav minēts')}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => setSelectedPerson(null)}>
            {t("Aizvērt")}
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}