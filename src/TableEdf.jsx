import React, { useState, useEffect } from "react";
import { db } from "./FirebaseFirestore";
import "./styles/tableedf.scss";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import SaisieLinky from "./Components/SaisieLinky.js";
import MaCourbe from "./Components/Courbes.tsx";

const TableEdf = () => {
  const codesCollectionRef = collection(db, "edf");
  const [liste, setListe] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const prix = {
    prixhcbleu: 0.129,
    prixhpbleu: 0.161,
    prixhcblanc: 0.148,
    prixhpblanc: 0.189,
    prixhcrouge: 0.157,
    prixhprouge: 0.756,
  };
  const monthTag = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Aout",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const [displayTotalPrix, setDisplayTotalPrix] = useState([0, 0, 0, 0, 0, 0]);
  var totalPrix = [0, 0, 0, 0, 0, 0];
  const [displayTotalJour, setDisplayTotalJour] = useState([0, 0, 0, 0, 0, 0]);
  var totalJour = [0, 0, 0, 0, 0, 0];
  const [leTotalJour, setLeTotalJour] = useState(0);
  const [leTotalMois, setLeTotalMois] = useState(0);

  //calcul des dates
  const mois = new Date().getMonth() + 1;
  //console.log("mois ", mois);
  const annee = new Date().getFullYear();
  //console.log("annee ", annee);
  const jour = new Date().getDate();

  //console.log("jour ", jour);
  let debut = new Date(annee , mois-2 ,1,0).getTime();
  //console.log("debut ", debut);

 

  useEffect(() => {
      if (jour === 1) {
    const lastJour = new Date(annee, mois - 1, 0).getDate();
    //console.log("lastJour ", lastJour);
   const d = new Date(annee, mois-2, lastJour,0);
  // console.log(annee, mois-1, lastJour);
   debut = d.getTime();
  }
    let lequery = query(
      codesCollectionRef,
      where("date", ">=", debut),
      orderBy("date", "desc")
    );
    const getData = async () => {
      try {
        const data = await getDocs(lequery);
        setListe(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setLoading(false);

        //  console.log('liste ',liste);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };
    getData();
  }, [codesCollectionRef, liste, debut]);

  useEffect(() => {
    if (liste.length > 0 && leTotalJour === 0 && leTotalMois === 0) {
      const calculateTotal = (liste) => {
        //calcul de la consommation du jour
        totalJour[1] = (liste[0].hpbleu - liste[1].hpbleu) * prix.prixhpbleu;
        totalJour[0] = (liste[0].hcbleu - liste[1].hcbleu) * prix.prixhcbleu;
        totalJour[3] = (liste[0].hpblanc - liste[1].hpblanc) * prix.prixhpblanc;
        totalJour[2] = (liste[0].hcblanc - liste[1].hcblanc) * prix.prixhcblanc;
        totalJour[5] = (liste[0].hprouge - liste[1].hprouge) * prix.prixhprouge;
        totalJour[4] = (liste[0].hcrouge - liste[1].hcrouge) * prix.prixhcrouge;
        const x = totalJour.reduce((sum, value) => sum + value, 0);
        setLeTotalJour(x);

        const n = liste.length;
        // calcul du total depuis le debut du mois
        totalPrix[1] =
          (liste[0].hpbleu - liste[n - 1].hpbleu) * prix.prixhpbleu;
        totalPrix[0] =
          (liste[0].hcbleu - liste[n - 1].hcbleu) * prix.prixhcbleu;
        totalPrix[3] =
          (liste[0].hpblanc - liste[n - 1].hpblanc) * prix.prixhpblanc;
        totalPrix[2] =
          (liste[0].hcblanc - liste[n - 1].hcblanc) * prix.prixhcblanc;
        totalPrix[5] =
          (liste[0].hprouge - liste[n - 1].hprouge) * prix.prixhprouge;
        totalPrix[4] =
          (liste[0].hcrouge - liste[n - 1].hcrouge) * prix.prixhcrouge;

        const z = totalPrix.reduce((sum, value) => sum + value, 0);
        setLeTotalMois(z);
        setDisplayTotalJour(totalJour);
        setDisplayTotalPrix(totalPrix);
      };
      calculateTotal(liste);
    }
  }, [leTotalJour, leTotalMois, liste]);

  // Callback function to update the table when the form is submitted
  const updateTable = async () => {
    // Refetch the data
    let lequery = query(codesCollectionRef, orderBy("date", "desc"));
    const updatedData = await getDocs(lequery);
    setListe(updatedData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleCellHover = (event) => {
    event.target.style.cursor = "pointer";
    event.target.style.backgroundColor = "darkgray";
    event.target.style.color = "black";
    event.target.style.fontSize = "1rem";
  };

  const handleCellLeave = (event) => {
    event.target.style.cursor = "default";
    event.target.style.backgroundColor = "";
    event.target.style.color = "white";
    event.target.style.fontSize = "0.8rem";
  };

  //pour préparer les données pour le graphique
  const lesdates = liste.map((item) => item.date);
  const revDates = lesdates.reverse();
  var lesproductions = liste.map((item) => (item.hcbleu - 28680) * 0.129);
  const revProdHcB = lesproductions.reverse();
  lesproductions = liste.map((item) => (item.hpbleu - 23964) * 0.161);
  const revProdHpB = lesproductions.reverse();
  lesproductions = liste.map((item) => (item.hcblanc - 1351) * 0.148);
  const revProdHcBl = lesproductions.reverse();
  lesproductions = liste.map((item) => (item.hpblanc - 1299) * 0.189);
  const revProdHpBl = lesproductions.reverse();
  lesproductions = liste.map((item) => (item.hcrouge - 785) * 0.157);
  const revProdHcR = lesproductions.reverse();
  lesproductions = liste.map((item) => (item.hprouge - 956) * 0.756);
  const revProdHpR = lesproductions.reverse();

  return (
    <div className="App-header">
      <h3>Consommations Linky {monthTag[mois - 1]}</h3>

      {!loading && liste.length > 0 && (
        <SaisieLinky
          jourdavant={liste[0]}
          updateTable={updateTable}
          totalJour={leTotalJour}
          totalMois={leTotalMois}
          lemois={monthTag[mois - 1]}
          totalProd={liste[0].prod}
        />
      )}
      <MaCourbe
        date={revDates}
        pHcBleu={revProdHcB}
        pHpBleu={revProdHpB}
        pHcBlanc={revProdHcBl}
        pHpBlanc={revProdHpBl}
        pHcRouge={revProdHcR}
        pHpRouge={revProdHpR}
        mois={monthTag[mois - 1]}
      />
      <table>
        <thead>
          <tr>
            <th style={{ width: "70px" }}>hc Bleues </th>
            <th style={{ width: "70px" }}>hp Bleues </th>
            <th style={{ width: "70px" }}>hc Blanches </th>
            <th style={{ width: "70px" }}>hp Blanches </th>
            <th style={{ width: "70px" }}>hc Rouges </th>
            <th style={{ width: "70px" }}>hp Rouges </th>
            <th style={{ width: "70px" }}>Total </th>
            <th style={{ width: "80px" }}>Date</th>
            <th style={{ width: "100px" }}>Note</th>
          </tr>

          <tr>
            <td style={{ width: "70px" }}>{displayTotalJour[0].toFixed(2)}</td>
            <td style={{ width: "70px" }}>{displayTotalJour[1].toFixed(2)}</td>
            <td style={{ width: "70px" }}>{displayTotalJour[2].toFixed(2)}</td>
            <td style={{ width: "70px" }}>{displayTotalJour[3].toFixed(2)}</td>
            <td style={{ width: "70px" }}>{displayTotalJour[4].toFixed(2)}</td>
            <td style={{ width: "70px" }}>{displayTotalJour[5].toFixed(2)}</td>
            <td style={{ width: "70px" }}>{leTotalJour.toFixed(2)}</td>
            {/* <th style={{ width: "80px" }}>==Total/jour</th> */}
          </tr>
          <tr>
            <td style={{ width: "70px" }}>{displayTotalPrix[0].toFixed(2)}</td>
            <td style={{ width: "70px" }}>{displayTotalPrix[1].toFixed(2)}</td>
            <td style={{ width: "70px" }}>{displayTotalPrix[2].toFixed(2)}</td>
            <td style={{ width: "70px" }}>{displayTotalPrix[3].toFixed(2)}</td>
            <td style={{ width: "70px" }}>{displayTotalPrix[4].toFixed(2)}</td>
            <td style={{ width: "70px" }}>{displayTotalPrix[5].toFixed(2)}</td>
            <td style={{ width: "70px" }}>{leTotalMois.toFixed(2)}</td>
            {/* <th style={{ width: "80px" }}>==Total/mois</th> */}
          </tr>
        </thead>
        <tbody>
          {liste.map((item, index) => {
            return (
              <tr key={index}>
                <td
                  style={{ width: "70px" }}
                  onMouseEnter={handleCellHover}
                  onMouseLeave={handleCellLeave}
                >
                  {item.hcbleu}
                </td>
                <td
                  style={{ width: "70px" }}
                  onMouseEnter={handleCellHover}
                  onMouseLeave={handleCellLeave}
                >
                  {item.hpbleu}
                </td>
                <td
                  style={{ width: "70px" }}
                  onMouseEnter={handleCellHover}
                  onMouseLeave={handleCellLeave}
                >
                  {item.hcblanc}
                </td>
                <td
                  style={{ width: "70px" }}
                  onMouseEnter={handleCellHover}
                  onMouseLeave={handleCellLeave}
                >
                  {item.hpblanc}
                </td>
                <td
                  style={{ width: "70px" }}
                  onMouseEnter={handleCellHover}
                  onMouseLeave={handleCellLeave}
                >
                  {item.hcrouge}
                </td>
                <td
                  style={{ width: "70px" }}
                  onMouseEnter={handleCellHover}
                  onMouseLeave={handleCellLeave}
                >
                  {item.hprouge}
                </td>

                <td
                  style={{ width: "70px" }}
                  onMouseEnter={handleCellHover}
                  onMouseLeave={handleCellLeave}
                >
                  {item.prod}
                </td>
                <td
                  style={{ width: "90px" }}
                  onMouseEnter={handleCellHover}
                  onMouseLeave={handleCellLeave}
                >
                  {new Date(item.date).toLocaleString()}
                </td>
                <td
                  style={{ width: "100px" }}
                  onMouseEnter={handleCellHover}
                  onMouseLeave={handleCellLeave}
                >
                  {item.note}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableEdf;
