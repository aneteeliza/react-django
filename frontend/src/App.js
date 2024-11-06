import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Contacts from './pages/Contacts';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  // const [details, setDetails] = useState([]); // State to hold fetched details

  // useEffect(() => {
  //   // Fetching data after the component mounts
  //   axios
  //     .get('http://localhost:8000') // Update URL if necessary
  //     .then((res) => {
  //       setDetails(res.data); // Storing the fetched data in state
  //     })
  //     .catch((err) => console.error(err));
  // }, []); // Empty dependency array ensures the effect runs only once on mount

  let component;
  switch (window.location.pathname) {
    case "/":
      component = <Home />;
      break;
    case "/contacts":
      component = <Contacts />;
      break;
    case "/about":
      component = <About />;
      break;
    default:
      component = <div>Page not found</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container">
        {component}
        {/* <div>
          {details.map((output, id) => (
            <div key={id}>
              <h2>{output.uzvards_un_vards}</h2>
              <h3>{output.pakape}</h3>
            </div>
          ))}
        </div> */}
      </div>
      <footer className="footer">
        <p>&copy; 2024 Larvijas Kara muzejs. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;


// import axios from 'axios';
// import React from 'react';
// import Navbar from './Navbar';
// import Contacts from './pages/Contacts';
// import Home from './pages/Home';
// import About from './pages/About';

// function App() {
//   let component;
//     switch (window.location.pathname) {
//       case "/":
//         component = <Home />;
//         break;
//       case "/contacts":
//         component = <Contacts />;
//         break;
//       case "/about":
//         component = <About />;
//         break;
//       default:
//         component = <div>Page not found</div>;
//     }
//   return (
//     <>
//       <Navbar />
//         <div className="container">
//           {component}
//         </div>
//         <footer className="footer">
//           <p>&copy; 2024 Larvijas Kara muzejs. All rights reserved.</p>
//         </footer>
//      </>
//   )
// }

// export default App;


// class App extends React.Component {
//   state = { details: [] };

//   componentDidMount() {
//     axios
//       .get('http://localhost:8000')
//       .then((res) => {
//         this.setState({ details: res.data });
//       })
//       .catch((err) => console.error(err));
//   }
//     return (
//       <div>
//         {this.state.details.map((output, id) => (
//           <div key={id}>
//             <h2>{output.employee}</h2>
//             <h3>{output.department}</h3>
//           </div>
//         ))}
//       </div>
//     );
//   }
// }