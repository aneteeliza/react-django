import React, { useState, useEffect } from 'react';
import { Container, Button, Form, Card, Row, Col } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import { FaSearch } from 'react-icons/fa';
import { BsArrowUp } from 'react-icons/bs';
import './../styles.css';
import { NetworkProvider } from '../../NetworkProvider';
import { useTranslation } from 'react-i18next';
import { ClipLoader } from 'react-spinners';
import PersonModal from './PersonModal';
import ErrorModal from './ErrorModal';
import EditPersonModal from './EditPersonModal';

export default function Home() {
  
  const [nameSearch, setNameSearch] = useState('');
  const [birthdateSearch, setBirthdateSearch] = useState('');
  const [people, setPeople] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showPersonModal, setShowPersonModal] = useState(null);

  const [selectedTable, setSelectedTable] = useState(0);
  const [showTopButton, setShowTopButton] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [showLoder, setShowLoader] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;

  const totalPages = Math.ceil(people.length / itemsPerPage);

  const paginatedPeople =
    people.length <= itemsPerPage
      ? people
      : people.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
      );

  const [dienestaVienibaSearch, setDienestaVienibaSearch] = useState('');

  const handleDienestaVienibaSearch = (event) => setDienestaVienibaSearch(event.target.value);

  const { t } = useTranslation();

  useEffect(() => {
    fetchUser()
  }, []);

  const fetchUser = async () => {
    try {
      const response = await NetworkProvider.getUser()
      setIsStaff(response.user.is_staff);
    } catch (error) {
      console.log(error);
      setError(
        error.response ? error.response.data : t('Kaut kas nogāja greizi')
      );
    }
  }

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

  const isBirthdateSearchEnabled = selectedTable == 1 || selectedTable == 3;

  const fetchPeople = async () => {
    try {
      setShowLoader(true);
      setPeople([]);
      // Check if any search term is too short (less than 3 characters) 
      if (
        (nameSearch.trim().length > 0 && nameSearch.trim().length < 3) ||
        (dienestaVienibaSearch.trim().length > 0 && dienestaVienibaSearch.trim().length < 3)
      ) {
        setIsSearching(false);
        setShowLoader(false);
        return;
      }

      // at least one search field has input
      if (
        !nameSearch.trim() &&
        !birthdateSearch.trim() &&
        !dienestaVienibaSearch.trim()
      ) {
        setIsSearching(false);
        setShowLoader(false);
        return;
      }

      const [name, ...surnameParts] = nameSearch.trim().split(' ');
      const surname = surnameParts.join(' ');

      const results = await NetworkProvider.search(selectedTable, name, surname, birthdateSearch, dienestaVienibaSearch)


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

      setPeople(sortedPeople);
      setIsSearching(true);
      setShowLoader(false);
    } catch (error) {
      setError(error);
      setIsSearching(true);
      setShowLoader(false);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleNameSearch = (event) => {
    const searchString = event.target.value.replace(/\d+/g, '');
    setNameSearch(searchString);
  }
  const handleBirthdateSearch = (event) => setBirthdateSearch(event.target.value);

  const handleTableSelect = (index) => {
    setSelectedTable(index)
  };

  const onEdited = async (record) => {
    try {
      setShowLoader(true);
      await NetworkProvider.update(selectedTable, record)
      setShowLoader(false);
    } catch (error) {
      setError(error.message);
      setShowLoader(false);
    }
  }

  const options = [
    t("2.brigādes apbalvotie"),
    t("Latviešu leģionā mobilizētie"),
    t("Kritušie un bez vēsts pazudušie leģionāri"),
    t("Zedelgemas karagūstekņu nometnē ieslodzītie")
  ]

  return (
    <Container className="flex-grow-1 d-flex justify-content-center align-items-center py-1">
      <Card className="p-4 shadow-lg w-100" style={{ border: 'none', maxWidth: 650 }}>
        <h3 className="text-start">{t("Karavīru meklēšana")}</h3>
        <br />

        <Row>
          {options.map((option, index) => (
            <Col xs={12} md={6} key={index} className="mb-2">
              <div className="custom-radio-container d-flex align-items-center">
                <Form.Check
                  type="radio"
                  id={`option-${index}`}
                  name="databaseOption"
                  value={index}
                  checked={selectedTable === index}
                  onChange={() => handleTableSelect(index)}
                  className="radio-input"
                  label=""
                />
                <span className="ms-2 text-start" style={{ fontSize: 14 }}>{option}</span>
              </div>
            </Col>
          ))}
        </Row>
        <br />

        <Form.Group className="mb-3 w-100">
          <Form.Control
            type="search"
            placeholder={t("Meklēt pēc vārda un/vai uzvārda")}
            value={nameSearch}
            onChange={handleNameSearch}
            className={`mb-3 w-100 ${error ? "is-invalid" : ""}`}
            style={{
              border: nameSearch.length > 0 && nameSearch.length < 3 ? '1px solid red' :
                nameSearch.length >= 3 ? '1px solid green' : '1px solid #ccc',
            }}
          />
          {error && <div className="invalid-feedback">{error}</div>}

          {isStaff && (
            <Form.Control
              type="text"
              id="dienestaVienibaSearch"
              value={dienestaVienibaSearch}
              onChange={handleDienestaVienibaSearch}
              placeholder={t("Meklēt pēc dienesta vienības")}
              title={t("Ieraksti vismaz 3 simbolus, lai meklētu pēc dienesta vienības")}
              style={{
                border: dienestaVienibaSearch.length > 0 && dienestaVienibaSearch.length < 3
                  ? '1px solid red'
                  : dienestaVienibaSearch.length >= 3
                    ? '1px solid green'
                    : '1px solid #ccc',
              }}
              className="mb-3 w-100"
            />
          )}

          {isBirthdateSearchEnabled && (
            <Form.Control
              type="text"
              id="birthdateSearch"
              value={birthdateSearch}
              onChange={handleBirthdateSearch}
              placeholder={t("Meklēt pēc dzimšanas datuma GGGG-MM-DD")}
              title={t("Ieraksti dzimšanas datumu GADS-MĒNESIS-DIENA")}
              className="mb-3 w-100"
            />
          )}
        </Form.Group>
        <Button
          onClick={fetchPeople}
          variant="primary"
          type="submit"
          className="w-100 rounded-sm"
          disabled={!(nameSearch.length >= 3 || birthdateSearch.length ==10)}
        >
          <FaSearch className="me-2" style={{ paddingBottom: 3 }} />
          {t("Meklēt")}
        </Button>
        <br></br>

        {showLoder &&
          <div className="d-flex justify-content-center py-4">
            <ClipLoader color="#000" loading={true} size={40} />
          </div>
        }

        <ListGroup>
          {paginatedPeople.map((person, index) => (
            <ListGroup.Item
              key={index}
              action
              onClick={() => {
                setSelectedPerson(person);
                setShowPersonModal(true)
              }}
            >
              {person.name} {person.surname}
            </ListGroup.Item>
          ))}
        </ListGroup>
        {
          people.length > 20 &&
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              ← {t('Iepriekšējā')}
            </Button>

            <span className="text-muted">
              {t('Lapa')} {currentPage + 1} / {totalPages}
            </span>

            <Button
              variant="secondary"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage >= totalPages - 1}
            >
              {t('Nākamā')} →
            </Button>
          </div>
        }

        <>
          {isSearching && people.length > 0 ? (
            <p>{t("Atrastie rezultāti")}: {people.length}</p>
          ) : isSearching && people.length === 0 ? (
            <p>{t("Netika atrasts neviens rezultāts")}</p>
          ) : null}
        </>

      </Card >

      {showTopButton && (
        <button className="back-to-top" onClick={scrollToTop}>
          <BsArrowUp size={20} />
        </button>
      )}

      <ErrorModal
        error={error}
        onClose={() => {
          setError(null);
        }}
      />

      {true ?
        <EditPersonModal
          show={showPersonModal}
          setShow={setShowPersonModal}
          selectedPerson={selectedPerson}
          onClose={() => setShowPersonModal(false)}
          onEdited={onEdited}
        /> : <PersonModal
          show={showPersonModal}
          setShow={setShowPersonModal}
          selectedPerson={selectedPerson}
          onClose={() => setShowPersonModal(false)}
        />
      }


    </Container >
  );
}