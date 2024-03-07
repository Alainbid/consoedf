import "./styles/App.scss";
import { db } from "./FirebaseFirestore";
import TableEdf from "./TableEdf";
import "./styles/tableedf.scss";
import {
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { set } from "react-hook-form";

function App() {
//   //pour supprimer certains documents d'une collection
//   const codesCollectionRef = collection(db, "serre");
//   const [docTrouvés, setDocTrouvés] = useState(0);
//   const [leTotalDebut, setLetotalDebut] = useState(0);
//   const [texte, setTexte] = useState('');
//   const [champ, setChamp] = useState('');

//   const getDocumentCount = async () => {
//     const leQuery = query(codesCollectionRef);
//     try {
//       const querySnapshot = await getDocs(leQuery);
//       setLetotalDebut(querySnapshot.size );
//     } catch (error) {
//       console.error("Error getting document count: ", error);
//     }
//   };


// useEffect(() => {
//   if (leTotalDebut === 0){  getDocumentCount();}
//   }, []);

//   const   handelChange = (e) => {
//     var letexte = e.target.value;
//     if (!isNaN(letexte)) {
//       letexte = parseInt(letexte);
//       // If it's a number
//     }
//       else if (letexte.toLowerCase() === 'true' ) {
//         // If it's a boolean
//         letexte = true;
//     } else if (letexte.toLowerCase() === 'false') {
//       letexte = false;
//     } 
//     setTexte(letexte, () => {
//       console.log("texte", texte); // Log inside the callback
//     });
//   };

//   const   modifChamp = (e) => {
//     setChamp(e.target.value);
//    // console.log("champ", champ);
//   };

//   const handelDelete = async () => {
//     const batch = writeBatch(db);
//     const lequery = query(codesCollectionRef, where(champ, "==", texte));
//     try {
//       const querySnapshot = getDocs(lequery);
//       querySnapshot.then((querySnapshot) => {
//         querySnapshot.forEach((doc) => {
//         // batch.delete(doc.ref);
//         });
//         batch.commit().then(() => {
//           console.log("Documents successfully deleted!");
//         });
//       });
//     } catch (error) {
//       console.error("Error deleting documents: ", error);
//     }
// getDocumentAprès();
//   };

  
//   const getDocumentAprès = async () => {
//     try {
//    var x = await getDocs(query(codesCollectionRef))
//      // Now 'remainingDocuments' holds the data of the remaining documents
//      console.log("Nbre Documents après delete:", x.size);
//      var texteFin = "nombre de documents après modification " + x.size;
//      document.getElementById("après").innerHTML = texteFin;
//    } catch (error) {
//      console.error("Error getting document count: ", error);
//    }
//  };

//   const chercher =  async() => { 
//     const enteredText = document.getElementById("letexte").value;
//   console.log("texte chercher", enteredText);
//     try {
//       const querySnapshot = await getDocs( query(codesCollectionRef, where(champ, "==", texte)))
//       setDocTrouvés(querySnapshot.size);
//     } catch (error) {
//       console.error("Error getting documents: ", error);
//     }
// };

// useEffect(() => {
//   chercher();
// }, [texte]);


  return (
    <div className="App">
      {/* <h1 style={{ color: "black" }}>
        Suppression de certains documents d'une collection{" "}
      </h1>
       
      <h2 style={{ color: "black" }}>
        nombre total de documents dans la collection {leTotalDebut}
      </h2>
      
      <form className="form">
      <label>Rechercher sur 
          <input id="leChamp" type="text" value={champ} 
           onChange={(event) => modifChamp(event)} 
            /></label>
      <label>Valeur à supprimer
          <input id="letexte" type="text" value={texte} 
           onChange={(event) => handelChange(event)} 
            /></label>
          </form>

          <h2 style={{ color: "green" }}>
          nombre de documents sélectionnés par where {docTrouvés}
          </h2>
          <button onClick={handelDelete}>Supprimer</button>
      <h2 style={{ color: "red" }} id="après"></h2> */}
      <TableEdf/> 
    </div>
  );
}

export default App;
