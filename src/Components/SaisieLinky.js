import React, {  useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../FirebaseFirestore.jsx";
import "../styles/saisielinky.scss";


const SaisieLinky = ({ jourdavant
, updateTable, totalJour, totalMois,lemois,totalProd }) => {

 

  const [liste, setListe] = useState(
    jourdavant || {
      hpbleu: "",
      hcbleu: "",
      hpblanc: "",
      hcblanc: "",
      hprouge: "",
      hcrouge: "",
      prod: "",
      note: "",
    }
  );
  const collectionRef = collection(db, "edf");
 
  const openConsoParMois = () => {
    //ouverture de la fenêtre des consos par mois
     window.open("/conso-par-mois", "_blank", "width=800,height=800");
  };

  /** handle submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("liste ", liste);
    try {
      const docRef = await addDoc(collectionRef, {
        hpbleu: Number(liste.hpbleu),
        hcbleu: Number(liste.hcbleu),
        hpblanc: Number(liste.hpblanc),
        hcblanc: Number(liste.hcblanc),
        hprouge: Number(liste.hprouge),
        hcrouge: Number(liste.hcrouge),
        prod: Number(liste.prod),
        note: liste.note,
        date: new Date().getTime(),
      });
      console.log("Document written with ID: ", docRef.id);
      updateTable();  
      reset();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const reset = () => {
    setListe({
      hpbleu: "",
      hcbleu: "",
      hpblanc: "",
      hcblanc: "",
      hprouge: "",
      hcrouge: "",
      prod: "",
      note: "",
    });
    window.location.reload();
  };

  const focusNextInput = (name) => {
    // Define the logic to focus on the next input element
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      focusNextInput("totalcreuse");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} onAbort={reset}>
      
      <div  >
          <label>Production Kwh</label>
          <input
            onKeyDown={handleKeyDown}
            type="text"
            value={liste.prod}
            onChange={(e) => setListe({ ...liste, prod: e.target.value })}
          />
        </div>
        <i style={{ marginTop: "10px" }}></i>
        <div  >
          <label>H C Bleues</label>
          <input
            onKeyDown={handleKeyDown}
            type="number"
            value={liste.hcbleu}
            onChange={(e) => setListe({ ...liste, hcbleu: e.target.value })}
          />
        </div>
        <div  >
          <label>H P Bleues</label>
          <input
            onKeyDown={handleKeyDown}
            type="number"
            value={liste.hpbleu}
            onChange={(e) => setListe({ ...liste, hpbleu: e.target.value })}
          />
        </div>
        <div  >
          <label>H C Blanches</label>
          <input
            onKeyDown={handleKeyDown}
            type="number"
            value={liste.hcblanc}
            onChange={(e) => setListe({ ...liste, hcblanc: e.target.value })}
          />
        </div>
        <div  >
          <label>H P Blanches</label>
          <input
            onKeyDown={handleKeyDown}
            type="number"
            value={liste.hpblanc}
            onChange={(e) => setListe({ ...liste, hpblanc: e.target.value })}
          />
        </div>
        <div  >
          <label>H C Rouges</label>
          <input
            onKeyDown={handleKeyDown}
            type="number"
            value={liste.hcrouge}
            onChange={(e) => setListe({ ...liste, hcrouge: e.target.value })}
          />
        </div>
        <div >
          <label>H P Rouges</label>
          <input
            onKeyDown={handleKeyDown}
            type="number"
            value={liste.hprouge}
            onChange={(e) => setListe({ ...liste, hprouge: e.target.value })}
          />
        </div>

        <div  >
          <label>Note</label>
          <input
            onKeyDown={handleKeyDown}
            type="text"
            value={liste.note}
            onChange={(e) => setListe({ ...liste, note: e.target.value })}
          />
        </div>
        <span>
        <button type="button" onClick={openConsoParMois}>
          Cout/Mois
        </button> 
        <button type="reset" onClick={reset} style={{ color: "red" }}>
            Annuler
          </button>
          <button type="submit">Ajouter</button>
        </span>

        
      </form><li id="totaux" style={{ marginTop: "22px" }}>
          Consommation du jour = {totalJour.toFixed(2)}€{" "}
        </li>
        <li id="totaux" style={{ marginTop: "5px" }}>
          {" "}
         consommation de {lemois} = {totalMois.toFixed(2)}€
        </li>
        <li id="totaux" style={{ marginTop: "5px" }}>
          {" "}
         Total revendu = {((totalProd-4981)*0.1).toFixed(2)}€
        </li><p></p>
      {/* <div>
        
      </div> */}
    </div>
  );
};

export default SaisieLinky;