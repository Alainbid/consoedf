
import './styles/App.scss';
import { db } from "./FirebaseFirestore";
import TableEdf from "./TableEdf";
import "./styles/tableedf.scss";
import { collection, getDocs, query, where,} from "firebase/firestore";
import React, { useState, useEffect, } from "react";


 function App() {
// //pour supprimer certains documents d'une collection
// const codesCollectionRef = collection(db, "adebug");
// const [ audebut , setAudebut]= useState(0);
// const [ letotelDebut , setLetotelDebut]= useState(0);
// const [ letotelFin , setLetotelFin]= useState(0);

// const getDocumentCount = async () => {
//   try {
//     const querySnapshot = await getDocs(codesCollectionRef);
//     const count = querySnapshot.size;
//     setLetotelDebut(count);
//   } catch (error) {
//     console.error("Error getting document count: ", error);
//   }
// };

// const getDocumentAprès = async () => {
//   try {
//     const querySnapshot = await getDocs(codesCollectionRef);
//     // Fetch and update the remaining documents
//     const remainingDocuments = [];
//     querySnapshot.forEach((doc) => {
//       remainingDocuments.push(doc.data());
//     });
//     setLetotelFin(remainingDocuments.length );
//     // Now 'remainingDocuments' holds the data of the remaining documents
//     console.log('Nbre Documents après delete:', remainingDocuments.length);
//   } catch (error) {
//     console.error("Error getting document count: ", error);
//   }
// };

// const getData = async () => {
// getDocumentCount();
// // ici on choisit les critères de sélection des documents à supprimer
// const lequery = query(codesCollectionRef, where('banque', '==', 'Bourso'));

//   try {
//     const querySnapshot = await getDocs(lequery);
//     const updatedListe = [];
//     querySnapshot.forEach((doc) => {
//      // console.log(doc.ref, " => ", doc.data().humidite);
//       updatedListe.push(doc.ref); // Push DocumentReference to the array
//     });
//     setAudebut(updatedListe.length);

//     try {
//       // Use Promise.all with the map function to wait for all deletions to complete
//       await Promise.all(updatedListe.map(async (docRef) => {
//         //-------------------------------------------------------------- */

//        // await deleteDoc(docRef);

//        //----------------------------------------------------------------*/
//         console.log("Document successfully deleted!");
//       }));
//       // Fetch remaining documents and update 'letotelFin'
//       getDocumentAprès();
//     } catch (e) {
//       console.log('error', e);
//     }
//   } catch (error) {
//     console.error("Error getting documents: ", error);
//   }
// };

// useEffect(() => {
//   getData();
// }, []);


 
  return (
     <div className="App">
    {/*    <h1 style={{color:'black'}}>Suppression de certains documents d'une collection </h1>
        <h2 style={{color:'black'}}>nombre de documents dans la collection {letotelDebut}</h2>
        <h2 style={{color:'green'}}>nombre de documents sélectionnés par where {audebut}</h2>
        <h2 style={{color:'red'}}>nombre de documents après modification {letotelFin}</h2> */}
         <TableEdf/> 
        
      
    </div>
  );
}

export default App;
